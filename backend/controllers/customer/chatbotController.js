const Groq = require("groq-sdk");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const ChatSession = require("../../models/chatSessionModel");
const Fuse = require("fuse.js");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let searchEngine = null;
let cachedProducts = [];
let lastUpdated = 0;

// Cập nhật dữ liệu tìm kiếm mỗi 5p
async function updateSearchIndex() {
  const now = Date.now();
  if (now - lastUpdated > 300000 || !searchEngine) {
    try {
      const products = await Product.find({ status: "active" })
        .populate("brand", "name")
        .populate("category", "name")
        .select(
          "name price description brand category specifications tags"
        );

      // Chuẩn hóa dữ liệu để search ngon hơn
      cachedProducts = products.map((p) => ({
        price: p.price,
        // Tạo một trường text tổng hợp để search cho chuẩn
        searchText: `ID:${p.id} ${p.name}
          ${p.brand?.name || ""},
          ${p.category?.name || ""}
          ${p.description || ""}
          ${JSON.stringify(p.specifications || "")}
          ${p.tags}`,

        // Giữ nguyên dữ liệu thô để trả về cho AI lọc
        raw: {
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          brand: p.brand?.name || "",
          category: p.category?.name || "",
          specifications: p.specifications,
          tags: p.tags,
        },
      }));

      // Cấu hình Fuse.js
      const options = {
        isCaseSensitive: false,
        includeScore: true,
        shouldSort: true,
        keys: ["searchText"], // Tìm trong trường text tổng hợp
        threshold: 0.4, // Độ chấp nhận sai số
        distance: 1000,
        ignoreLocation: true,
      };

      searchEngine = new Fuse(cachedProducts, options);
      lastUpdated = now;
      console.log(
        `Search Engine Updated! Loaded ${cachedProducts.length} products.`
      );
    } catch (e) {
      console.error("Update Search Index Error:", e);
    }
  }
}

updateSearchIndex();

const ROUTER_PROMPT = `
Role: Intent Classifier.
Task: Analyze user query and output JSON.

Intents:
1. "search_product": Tìm kiếm sản phẩm, hỏi giá cả.
2. "check_order": Kiểm tra trạng thái đơn hàng.
3. "request_consultation": Tư vấn mua hàng tổng quát (Laptop, PC, Điện thoại...).
4. "compare_products": So sánh thông số kỹ thuật giữa 2 hoặc nhiều sản phẩm cụ thể.
5. "compatibility_check": Kiểm tra xem linh kiện (RAM, SSD...) có tương thích với máy/mainboard không.
6. "product_status_warranty": Hỏi về tình trạng còn hàng, địa điểm kho, chính sách bảo hành.
7. "technical_support": Khách gặp lỗi kỹ thuật (máy nóng, pin tụt, lỗi driver...) sau khi mua.
8. "payment_installment": Hỏi về các phương thức thanh toán hoặc thủ tục trả góp.
9. "budget_consultation": Tư vấn chọn mua máy/cấu hình khi khách chỉ đưa ra ngân sách.

JSON Output:
{
  "intent": "search_product" | "check_order" | "request_consultation" | "compare_products" | "compatibility_check" | "product_status_warranty" | "technical_support" | "payment_installment",
  "query": {
    "keyword": string, // Từ khóa sản phẩm hoặc vấn đề kỹ thuật.
    "products_to_compare": [string], // Danh sách tên sản phẩm nếu intent là compare_products.
    "device_model": string, // Model máy khách đang dùng nếu intent là compatibility hoặc technical_support.
    "price_max": number,
    "price_min": number
  },
}
`;

const FILTER_PROMPT = `
Bạn là chuyên gia lọc dữ liệu kỹ thuật.
Nhiệm vụ: Dựa trên yêu cầu của người dùng, hãy chọn ra các sản phẩm THỰC SỰ PHÙ HỢP nhất từ danh sách hỗ trợ.
Tiêu chí quan trọng:
- Mục đích sử dụng (Lập trình: cần CPU mạnh, RAM nhiều; Đồ họa: cần GPU rời, màn đẹp).
- Ngân sách (Không vượt quá 10% ngân sách khách đưa ra).
- Ưu tiên (Pin hay Hiệu năng).

Chỉ trả về JSON object:
  {
    products: [
      {
        "id": string,
        "name": string,
      }, ...
    ]
  }
Nếu không có sản phẩm nào phù hợp > 70%, hãy trả về danh sách trống.
`;

const CONSULTATION_SCRIPT = [
  {
    step: 1,
    question: "Chào Anh/Chị! Tôi là chuyên viên tư vấn công nghệ. Trước hết, tôi có thể biết tên của Anh/Chị để tiện xưng hô được không?",
    key: "name"
  },
  {
    step: 2,
    question: "Chào {name}! Anh/Chị đang quan tâm đến laptop, PC hay linh kiện gì để tôi hỗ trợ chính xác nhất?",
    key: "category"
  },
  {
    step: 3,
    question: "Anh/Chị sử dụng máy cho mục đích gì ạ? (Ví dụ: Lập trình, đồ họa chuyên nghiệp, chơi game AAA hay chỉ văn phòng cơ bản?)",
    key: "purpose"
  },
  {
    step: 4,
    question: "Cảm ơn thông tin của bạn. Vậy ngân sách dự kiến của {name} là khoảng bao nhiêu để tôi lọc cấu hình tối ưu nhất?",
    key: "budget"
  },
  {
    step: 5,
    question: "Cuối cùng, {name} ưu tiên yếu tố nào hơn: Pin trâu/di động cao hay Hiệu năng xử lý tối đa?",
    key: "priority"
  },
  {
    step: 6,
    question: "Vui lòng cho tôi xin số điện thoại để khi có mẫu máy cực hot hoặc giảm giá sốc phù hợp nhu cầu, tôi sẽ báo {name} ngay nhé!",
    key: "phone"
  }
];

const SPECIALIZED_PROMPT = `
Nếu mục đích là 'Lập trình', hãy ưu tiên gợi ý các máy có:
- RAM từ 16GB trở lên.
- CPU hướng đến đa nhân (Multi-core).
- SSD NVMe tốc độ cao.
Nếu khách chọn 'Đồ họa', hãy ưu tiên màn hình có độ chuẩn màu (sRGB, DCI-P3) và Card đồ họa rời (RTX/Quadro).
`;

const CONSULTATION_EXTRACTOR_PROMPT = `
Bạn là một trợ lý trích xuất thông tin. Nhiệm vụ của bạn là trích xuất thông tin từ câu trả lời của người dùng dựa trên trường (key) được yêu cầu.

Trường yêu cầu: {key}

Chỉ trả về duy nhất giá trị đã trích xuất, tuyệt đối không bao gồm bất kỳ phân tích, suy nghĩ, giải thích hay thẻ <think> nào.
Nếu không thấy thông tin phù hợp hãy trả về "N/A".
Ví dụ: 
User: "Tôi tên là Hoàn" -> Kết quả: "Hoàn"
User: "Tầm 20 triệu" -> Kết quả: "20.000.000"
`;

const RESPONDER_SYSTEM_PROMPT = `
Role: Liquid AI Assistant - Chuyên gia công nghệ & Tư vấn bán hàng chuyên nghiệp của TL-Website.
Tone: Thân thiện, lịch sự, chuyên môn cao.

Nhiệm vụ:
1. So sánh sản phẩm: Luôn trình bày theo BẢNG (Markdown table) gồm các tiêu chí: CPU, RAM, Màn hình, GPU, Pin, Phù hợp. Cuối cùng kết luận thẳng: "Ai nên mua máy nào".
2. Kiểm tra tương thích: Dựa trên thông tin database hoặc kiến thức chuẩn (DDR4, DDR5, M.2 NVMe...) để khẳng định chắc chắn. Nếu không tương thích, phải CHẶN khách mua sai.
3. Hỗ trợ kỹ thuật: Gợi ý các bước xử lý lỗi (cập nhật driver, kiểm tra task manager) trước khi yêu cầu mang qua cửa hàng.
4. Trả góp: Luôn nhắc đến chính sách trả góp 0% qua thẻ tín dụng và hỗ trợ tính toán phương án trả góp nếu khách hỏi.
5. Bảo hành: Nhấn mạnh bảo hành chính hãng và chính sách 1 đổi 1 của cửa hàng để khách yên tâm.
6. Fallback: Nếu vấn đề quá phức tạp về kỹ thuật, hãy nói: "Tôi sẽ chuyển yêu cầu của bạn đến kỹ thuật viên chuyên sâu để xử lý chính xác nhất."

QUY TẮC QUAN TRỌNG:
- KHÔNG bao gồm bất kỳ nội dung phân tích, suy nghĩ nội bộ hay thẻ <think> nào trong phản hồi.
- CHỈ trả về văn bản phản hồi cuối cùng bằng tiếng Việt.
- Trả lời súc tích, đi thẳng vào vấn đề.
`;

const chatWithAI = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    await updateSearchIndex();

    let session;
    session = await ChatSession.findOne({ userId });

    if (!session) {
      session = new ChatSession({ userId: userId, messages: [] });
      await session.save();
    }

    // Lấy lịch sử chat cho AI nhớ
    const historyContext = session.messages.slice(-4).map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.message,
    }));

    // Nếu đang trong chế độ tư vấn, bỏ qua việc nhận diện intent chung
    if (session.context?.isConsulting) {
      const currentStepIdx = session.context.currentStep;
      const currentStep = CONSULTATION_SCRIPT[currentStepIdx];

      // Trích xuất thông tin từ câu trả lời của user cho bước hiện tại
      const extractionCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: CONSULTATION_EXTRACTOR_PROMPT.replace("{key}", currentStep.key) },
          { role: "user", content: message },
        ],
        model: "qwen/qwen3-32b",
        temperature: 0,
      });

      const extractedValue = extractionCompletion.choices[0].message.content.trim();
      if (extractedValue !== "N/A") {
        session.context.consultationData[currentStep.key] = extractedValue;
      }

      // Chuyển sang bước tiếp theo
      const nextStepIdx = currentStepIdx + 1;
      if (nextStepIdx < CONSULTATION_SCRIPT.length) {
        session.context.currentStep = nextStepIdx;
        const nextStep = CONSULTATION_SCRIPT[nextStepIdx];

        let question = nextStep.question;
        // Thay thế placeholder nếu có (ví dụ {name})
        if (question.includes("{name}")) {
          question = question.replace("{name}", session.context.consultationData.name || "Anh/Chị");
        }

        res.write(`data: ${JSON.stringify({ content: question })}\n\n`);

        session.messages.push({ sender: "user", message: message });
        session.messages.push({ sender: "bot", message: question });
        session.updatedAt = Date.now();
        session.markModified('context'); // Quan trọng để Mongoose nhận biết Object thay đổi
        await session.save();
        return res.end();
      } else {
        // Kết thúc tư vấn
        session.context.isConsulting = false;
        session.context.currentStep = 0;

        const summary = `Cảm ơn ${session.context.consultationData.name || "Anh/Chị"}! Tôi đã ghi nhận nhu cầu của bạn:
- Danh mục: ${session.context.consultationData.category || "N/A"}
- Mục đích: ${session.context.consultationData.purpose || "N/A"}
- Ngân sách: ${session.context.consultationData.budget || "N/A"}
- Ưu tiên: ${session.context.consultationData.priority || "N/A"}
- SĐT: ${session.context.consultationData.phone || "N/A"}

Dựa trên kinh nghiệm của tôi, tôi đã tìm thấy một số lựa chọn xuất sắc phù hợp với yêu cầu của bạn!`;

        res.write(`data: ${JSON.stringify({ content: summary })}\n\n`);

        // Sau khi tư vấn xong, tự động trigger tìm kiếm sản phẩm dựa trên consultationData
        const searchQuery = `${session.context.consultationData.category} ${session.context.consultationData.purpose} ${session.context.consultationData.priority || ""}`;
        const fuseResults = searchEngine.search(searchQuery);
        let initialResults = fuseResults.map((r) => r.item).slice(0, 10);

        // Gọi AI lọc lại một lần nữa để đảm bảo "PHÙ HỢP" tuyệt đối
        const filterCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: FILTER_PROMPT },
            { role: "user", content: `Yêu cầu: ${JSON.stringify(session.context.consultationData)}\n\nDanh sách: ${JSON.stringify(initialResults.map(p => ({ id: p.raw.id, name: p.raw.name, specifications: p.raw.specifications })))}` },
          ],
          model: "qwen/qwen3-32b",
          temperature: 0,
          response_format: { type: "json_object" },
        });

        const filtered = JSON.parse(filterCompletion.choices[0].message.content);
        const results = filtered.products || [];

        if (results.length > 0) {
          const ids = results.map((p) => p.id);
          const foundDataPayload = `\n\n[PRODUCT_LIST_START]${JSON.stringify(ids)}[PRODUCT_LIST_END]`;
          res.write(`data: ${JSON.stringify({ content: foundDataPayload })}\n\n`);
        } else if (initialResults.length > 0) {
          // Nếu AI lọc quá gắt mà không có gì, lấy tạm 2 cái đầu từ fuse nhưng báo khách
          const ids = initialResults.slice(0, 2).map((p) => p.raw.id);
          const foundDataPayload = `\n\n[PRODUCT_LIST_START]${JSON.stringify(ids)}[PRODUCT_LIST_END]`;
          res.write(`data: ${JSON.stringify({ content: foundDataPayload })}\n\n`);
        }

        session.messages.push({ sender: "user", message: message });
        session.messages.push({ sender: "bot", message: summary });
        session.updatedAt = Date.now();
        session.markModified('context');
        await session.save();
        return res.end();
      }
    }

    // Gọi AI để nhận diện intent
    const routerCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: ROUTER_PROMPT },
        ...historyContext,
        { role: "user", content: message },
      ],
      model: "qwen/qwen3-32b",
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const { intent, query } = JSON.parse(
      routerCompletion.choices[0].message.content
    );

    console.log("Detected Intent:", intent, "with query:", query);

    // Xử lý intent tư vấn mới
    if (intent === "request_consultation") {
      session.context = {
        isConsulting: true,
        currentStep: 0,
        consultationData: {}
      };

      const firstQuestion = CONSULTATION_SCRIPT[0].question;
      res.write(`data: ${JSON.stringify({ content: firstQuestion })}\n\n`);

      session.messages.push({ sender: "user", message: message });
      session.messages.push({ sender: "bot", message: firstQuestion });
      session.updatedAt = Date.now();
      session.markModified('context');
      await session.save();
      return res.end();
    }

    // Query db dựa trên res đã lọc từ AI cùi
    let dbContext = "Không có dữ liệu database.";
    let foundDataPayload = null;

    if (intent === "search_product") {
      let results = [];

      if (query?.keyword) {
        const fuseResults = searchEngine.search(query.keyword);
        results = fuseResults.map((r) => r.item);
      } else {
        results = cachedProducts;
      }

      if (query?.price_max) {
        results = results.filter((p) => p.price < query.price_max);
      }

      if (query?.price_min) {
        results = results.filter((p) => p.price > query.price_min);
      }
      console.log("Search Results Count:", results.length);
      if (results.length > 0) {
        results = results.slice(0, 20); // Giới hạn 20 kết quả để lọc
        // Gọi AI cùi để lọc dữ liệu cho nhanh
        const filterCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: FILTER_PROMPT },
            ...historyContext,
            { role: "system", content: `Context: ${JSON.stringify(results.map(p => p.raw))}` },
            { role: "user", content: message },
          ],
          model: "moonshotai/kimi-k2-instruct-0905",
          temperature: 0,
          response_format: { type: "json_object" },
        });

        const productFiltered = JSON.parse(
          filterCompletion.choices[0].message.content
        );

        console.log("Filtered Products:", productFiltered.products);

        dbContext =
          `Tìm thấy ${productFiltered.products.length} sản phẩm:\n` +
          productFiltered.products.map((p) => `- ${p.name}`).join("\n");
        const ids = productFiltered.products.map((p) => p.id);
        foundDataPayload = `[PRODUCT_LIST_START]${JSON.stringify(
          ids
        )}[PRODUCT_LIST_END]`;
      } else {
        dbContext =
          "Đã tìm trong kho nhưng không thấy sản phẩm nào khớp yêu cầu.";
      }
    } else if (intent === "compare_products") {
      const productNames = query?.products_to_compare || [];
      if (productNames.length > 0) {
        const products = await Product.find({
          name: { $in: productNames.map(name => new RegExp(name, 'i')) }
        }).populate("brand").populate("category");

        dbContext = `Dữ liệu so sánh sản phẩm:\n${JSON.stringify(products.map(p => ({
          name: p.name,
          price: p.price,
          brand: p.brand?.name,
          category: p.category?.name,
          specifications: p.specifications
        })))}`;
      } else {
        dbContext = "Khách hàng muốn so sánh nhưng không rõ tên sản phẩm cụ thể.";
      }
    } else if (intent === "compatibility_check") {
      const keyword = query?.keyword || "";
      const deviceModel = query?.device_model || "";

      const fuseResults = searchEngine.search(keyword + " " + deviceModel);
      const results = fuseResults.map((r) => r.item).slice(0, 3);

      dbContext = `Dữ liệu kiểm tra tương thích:\nThiết bị của khách: ${deviceModel}\nLinh kiện quan tâm: ${JSON.stringify(results.map(p => p.raw))}`;
    } else if (intent === "product_status_warranty") {
      const keyword = query?.keyword || "";
      const fuseResults = searchEngine.search(keyword);
      const results = fuseResults.map((r) => r.item).slice(0, 3);

      // Giả lập dữ liệu tồn kho và bảo hành (trong thực tế sẽ lấy từ DB)
      dbContext = `Dữ liệu kho & bảo hành:\n${JSON.stringify(results.map(p => ({
        name: p.raw.name,
        stock: "Còn 5-10 máy tại kho HCM & Hà Nội",
        warranty: "24 tháng chính hãng, 1 đổi 1 trong 30 ngày nếu lỗi NSX"
      })))}`;
    } else if (intent === "technical_support") {
      dbContext = `Khách hàng đang gặp vấn đề kỹ thuật: ${query?.keyword || "N/A"}. Thiết bị: ${query?.device_model || "N/A"}. Hãy gợi ý giải pháp cơ bản.`;
    } else if (intent === "payment_installment") {
      dbContext = "Chính sách trả góp: Hỗ trợ trả góp 0% qua thẻ tín dụng (Visa/Master/JCB) và các công ty tài chính (Home Credit, FE Credit). Kỳ hạn 6-12 tháng.";
    } else if (intent === "budget_consultation") {
      const budget = query?.price_max || "N/A";
      dbContext = `Khách hàng có ngân sách khoảng ${budget}. Hãy đưa ra các lựa chọn tốt nhất trong tầm giá này cho cả Laptop và PC (giả định cấu hình phổ biến: i5/16GB cho laptop 15tr, i3/RTX3050 cho PC 15tr). Cuối cùng hỏi khách ưu tiên di động hay hiệu năng.`;
    } else if (intent === "escalate_human") {
      const orders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .limit(1);

      if (orders.length > 0) {
        const o = orders[0];
        dbContext = `Đơn gần nhất: ${o.orderCode}, Trạng thái: ${o.orderStatus}, Tổng: ${o.totalAmount}, Ngày: ${o.createdAt}`;

        foundDataPayload = `[ORDER_CODE:${o.orderCode}]`;
      } else {
        dbContext = "Khách hàng này chưa có đơn hàng nào.";
      }
    }

    // Gọi AI xịn cho nó "chém gió" dựa trên dbContext vừa tìm được =))
    const stream = await groq.chat.completions.create({
      messages: [
        { role: "system", content: RESPONDER_SYSTEM_PROMPT + "\n\n" + SPECIALIZED_PROMPT },
        ...historyContext,
        { role: "system", content: `CONTEXT DATA TỪ DATABASE:\n${dbContext}` },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    let fullBotResponse = "";

    // Stream từng chữ của AI về Frontend
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullBotResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Gửi foundDataPayload để Frontend render ra cái Card đẹp mắt bên dưới lời thoại
    if (foundDataPayload) {
      res.write(
        `data: ${JSON.stringify({ content: "\n\n" + foundDataPayload })}\n\n`
      );
      fullBotResponse += "\n" + foundDataPayload;
    }

    session.messages.push({ sender: "user", message: message });
    session.messages.push({ sender: "bot", message: fullBotResponse });
    session.updatedAt = Date.now();
    await session.save();

    res.end();
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.write(
      `data: ${JSON.stringify({
        content: "Mạng lag quá, mình chưa load được. Bạn hỏi lại nha!",
      })}\n\n`
    );
    res.end();
  }
};

const getHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const session = await ChatSession.findOne({ userId });

    if (!session) {
      res.status(400).json({
        message: "Chat history empty",
        error,
      });
    }

    res.status(200).json({
      message: "Get history chatbot successfull",
      session,
    });
  } catch (error) {
    res.status(500).json({
      message: "Get history chatbot error",
      error,
    });
  }
};

module.exports = { chatWithAI, getHistory };
