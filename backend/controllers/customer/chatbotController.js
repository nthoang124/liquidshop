const Groq = require("groq-sdk");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const ChatSession = require("../../models/chatSessionModel");

// Import Agents
const IntentAgent = require("../../agents/IntentAgent");
const SearchAgent = require("../../agents/SearchAgent");
const ConsultAgent = require("../../agents/ConsultAgent");
const AdvisorAgent = require("../../agents/AdvisorAgent");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Init Search Engine
SearchAgent.init();

const RESPONDER_SYSTEM_PROMPT = `
Role: AI Assistant cho E-commerce.
Task: Trả lời ngắn gọn, đúng trọng tâm.

QUY TẮC PHẢN HỒI:
1. GREETING/OTHER/COMPARE: Trả lời bằng VĂN BẢN (Text).
   - Ngắn gọn, thân thiện.
   - So sánh thì dùng gạch đầu dòng ngắn.
   
2. SEARCH_PRODUCT / KẾT QUẢ TƯ VẤN:
   - TUYỆT ĐỐI KHÔNG trả lời văn bản.
   - CHỈ trả về JSON Object theo format sau để Frontend render:
   
   JSON FORMAT:
   {
     "type": "product_list",
     "data": [
       {
         "id": "...",
         "name": "...",
         "price": 10000000,
         "image": "..."
       }
     ]
   }

3. TECHNICAL_ADVICE:
   - Đóng vai chuyên gia (Senior Tech Lead).
   - Phân tích sâu về cấu hình/phần mềm.
   - KHÔNG bao giờ trộn Text và JSON trong cùng một phản hồi.
   - QUAN TRỌNG: TUYỆT ĐỐI KHÔNG xuất hiện thẻ <think> hoặc quá trình suy nghĩ trong câu trả lời. Chỉ đưa ra kết quả cuối cùng.
   - DỮ LIỆU: Chỉ tư vấn dựa trên danh sách sản phẩm được cung cấp trong "CONTEXT DATABASE". Không tự bịa sản phẩm bên ngoài.
   - Nếu không tìm thấy sản phẩm, trả về văn bản xin lỗi và gợi ý.
`;

const chatWithAI = async (req, res) => {
  const { message, userId } = req.body;

  try {
    // 1. Load Session
    let session = await ChatSession.findOne({ userId });
    if (!session) {
      session = new ChatSession({ userId, messages: [], context: {} });
    }

    // --- STREAMING SETUP ---
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // 2. CHECK MODE: CONSULTING (Stateful Flow)
    if (session.context?.isConsulting) {
      // Step A: Extract Info
      const extractedData = await ConsultAgent.extractInfo(message);

      // Update Context
      Object.keys(extractedData).forEach(key => {
        if (extractedData[key] !== null) {
          session.context.consultationData[key] = extractedData[key];
        }
      });

      // Step B: Determine Next Step (Skip Logic)
      const nextStepIdx = ConsultAgent.determineNextStep(session.context.currentStep, session.context.consultationData);

      if (nextStepIdx < ConsultAgent.script.length) {
        // CONTINUE ASKING
        session.context.currentStep = nextStepIdx;
        const nextQuestion = ConsultAgent.getStepQuestion(nextStepIdx, session.context.consultationData);

        res.write(`data: ${JSON.stringify({ content: nextQuestion })}\n\n`);

        session.messages.push({ sender: "user", message: message });
        session.messages.push({ sender: "bot", message: nextQuestion });
        session.updatedAt = Date.now();
        session.markModified('context');
        await session.save();
        return res.end();
      } else {
        // FINISHED CONSULTING -> SEARCH
        session.context.isConsulting = false;
        session.context.currentStep = 0;

        // Construct Query for SearchAgent
        const queryObj = {
          keyword: "",
          category: session.context.consultationData.category,
          price_max: session.context.consultationData.budget ? session.context.consultationData.budget * 1.1 : null,
        };

        // Search
        const topProducts = SearchAgent.getTopProducts(queryObj, 10);

        if (topProducts.length > 0) {
          const finalProducts = topProducts.map(p => ({
            id: p.raw.id,
            name: p.raw.name,
            price: p.raw.price,
            image: ""
          }));

          const jsonResponse = {
            type: "product_list",
            data: finalProducts
          };

          const successMsg = `Dựa trên yêu cầu (${session.context.consultationData.category || "Sản phẩm"}, ${session.context.consultationData.brand || ""}), đây là gợi ý tốt nhất:`;
          res.write(`data: ${JSON.stringify({ content: successMsg })}\n\n`);
          res.write(`data: ${JSON.stringify({ content: JSON.stringify(jsonResponse) })}\n\n`);

          session.messages.push({ sender: "user", message: message });
          session.messages.push({ sender: "bot", message: successMsg + "\n" + JSON.stringify(jsonResponse) });
        } else {
          const failMsg = "Rất tiếc, không tìm thấy sản phẩm nào khớp hoàn toàn với yêu cầu chi tiết của bạn.";
          res.write(`data: ${JSON.stringify({ content: failMsg })}\n\n`);
          session.messages.push({ sender: "user", message: message });
          session.messages.push({ sender: "bot", message: failMsg });
        }

        session.updatedAt = Date.now();
        await session.save();
        return res.end();
      }
    }

    // 3. NORMAL MODE: INTENT CLASSIFICATION
    const intentResult = await IntentAgent.detectIntent(message);
    const { intent, query } = intentResult;

    // --- DECISION LAYER (Logic Rules) ---
    // Example: Warn if specific bad combos found
    let warningMsg = "";
    if (intent === "TECHNICAL_ADVICE" || intent === "SEARCH_PRODUCT") {
      if (message.toLowerCase().includes("lập trình") && message.toLowerCase().includes("8gb")) {
        warningMsg = "⚠️ Lưu ý: Lập trình hiện nay nên dùng RAM tối thiểu 16GB để mượt mà ạ.\n";
      }
    }

    // 4. HANDLE INTENTS
    if (intent === "CONSULTING") {
      // Start Consultation Flow
      session.context = {
        isConsulting: true,
        currentStep: 0,
        consultationData: {},
      };

      // Auto-fill from initial message
      const extractedData = await ConsultAgent.extractInfo(message);
      session.context.consultationData = extractedData;

      const nextStepIdx = ConsultAgent.determineNextStep(0, session.context.consultationData);
      session.context.currentStep = nextStepIdx;

      const firstQuestion = ConsultAgent.getStepQuestion(nextStepIdx, session.context.consultationData) || "Bạn cần tư vấn về sản phẩm nào?";

      res.write(`data: ${JSON.stringify({ content: firstQuestion })}\n\n`);
      session.messages.push({ sender: "user", message: message });
      session.messages.push({ sender: "bot", message: firstQuestion });
      session.markModified('context');
      await session.save();
      return res.end();
    }

    // GREETING
    if (intent === "GREETING") {
      const reply = "Chào bạn! Tôi có thể giúp gì cho bạn hôm nay? (Tìm laptop, so sánh, hay tư vấn cấu hình...)";
      res.write(`data: ${JSON.stringify({ content: reply })}\n\n`);
      session.messages.push({ sender: "user", message: message });
      session.messages.push({ sender: "bot", message: reply });
      session.updatedAt = Date.now();
      await session.save();
      return res.end();
    }

    // Build Context for AI Responder
    let dbContext = "Không có dữ liệu database.";
    let directJsonResponse = null;

    if (intent === "SEARCH_PRODUCT") {
      const results = SearchAgent.search(query);
      if (results.length > 0) {
        directJsonResponse = {
          type: "product_list",
          data: results.slice(0, 10).map(p => ({
            id: p.raw.id,
            name: p.raw.name,
            price: p.raw.price,
            image: ""
          }))
        };
      } else {
        dbContext = "Không tìm thấy sản phẩm nào khớp với từ khóa/tiêu chí.";
      }
    }
    else if (intent === "COMPARE_PRODUCT") {
      // Dynamic Compare Logic
      let productsToCompare = [];

      if (query.products_to_compare && query.products_to_compare.length > 0) {
        // Search by name
        const products = await Product.find({
          name: { $in: query.products_to_compare.map(name => new RegExp(name, 'i')) }
        }).populate("brand").populate("category");
        productsToCompare = products.map(p => ({ raw: p })); // unify format
      } else {
        // Dynamic Search
        productsToCompare = SearchAgent.getTopProducts({
          keyword: query.keyword || query.category || "",
          category: query.category,
          sort_by: query.sort_by,
        }, query.quantity || 2);
      }

      if (productsToCompare.length > 0) {
        dbContext = `Dữ liệu so sánh:\n${JSON.stringify(productsToCompare.map(p => ({
          name: p.raw.name || p.name,
          price: p.raw.price || p.price,
          specifications: p.raw.specifications || p.specifications
        })))}`;
      } else {
        dbContext = "Không tìm thấy sản phẩm để so sánh.";
      }
    }
    else if (intent === "TECHNICAL_ADVICE" || intent === "OTHER") {
      const keyword = query?.keyword || "";
      const deviceModel = query?.device_model || "";

      let productContext = "";
      if (keyword) {
        const results = SearchAgent.getTopProducts({ keyword }, 3);
        productContext = results.length > 0 ? JSON.stringify(results.map(p => p.raw)) : "Không xác định";
      }

      let advisorPrompt = "";
      if (intent === "TECHNICAL_ADVICE") {
        advisorPrompt = AdvisorAgent.getSpecializedPrompt();
      }

      // Fallback Order Check if OTHER
      let orderInfo = "";
      if (intent === "OTHER") {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(1);
        if (orders.length > 0) {
          const o = orders[0];
          orderInfo = `Đơn gần nhất: ${o.orderCode}, Trạng thái: ${o.orderStatus}, Tổng: ${o.totalAmount}`;
        }
      }

      dbContext = `${advisorPrompt}\nThông tin bổ trợ: ${keyword}. Thiết bị: ${deviceModel}. \nSản phẩm liên quan: ${productContext}\n${orderInfo}`;
    }

    // 5. FINAL RESPONSE GENERATION
    if (directJsonResponse) {
      const successMsg = warningMsg + "Dựa trên tiêu chí, đây là các sản phẩm phù hợp:";
      res.write(`data: ${JSON.stringify({ content: successMsg })}\n\n`);
      res.write(`data: ${JSON.stringify({ content: JSON.stringify(directJsonResponse) })}\n\n`);

      session.messages.push({ sender: "user", message: message });
      session.messages.push({ sender: "bot", message: successMsg + "\n" + JSON.stringify(directJsonResponse) });
    } else {
      // Stream text response
      const messagesForAI = [
        { role: "system", content: RESPONDER_SYSTEM_PROMPT + `\nCONTEXT DATABASE:\n${dbContext}` },
        ...session.messages.slice(-5).map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.message })),
        { role: "user", content: message }
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages: messagesForAI,
        model: "qwen/qwen3-32b",
        temperature: 0.7,
        stream: true,
      });

      let fullResponse = warningMsg; // Prepend warning
      if (warningMsg) {
        res.write(`data: ${JSON.stringify({ content: warningMsg })}\n\n`);
      }

      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      session.messages.push({ sender: "user", message: message });
      session.messages.push({ sender: "bot", message: fullResponse });
    }

    // Save Session
    session.updatedAt = Date.now();
    await session.save();
    res.end();

  } catch (error) {
    console.error("Chat Error:", error);
    res.write(`data: ${JSON.stringify({ content: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau." })}\n\n`);
    res.end();
  }
};

const getHistory = async (req, res) => {
  const { userId } = req.query;
  try {
    const session = await ChatSession.findOne({ userId });
    res.json(session ? session.messages : []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

const resetSession = async (req, res) => {
  const { userId } = req.query; // Or body depending on API logic, usually delete uses query or params? 
  // Check implementation: Frontend calls reset with POST/DELETE? 
  // Router says: router.delete('/', resetSession)
  // Usually userId is passed via query or auth middleware if available. 
  // Assuming req.query as per simple implementation or req.body if frontend sents it.
  // Wait, previous chatWithAI used req.body.userId. 
  // Let's use req.query.userId for GET/DELETE usually.
  try {
    await ChatSession.findOneAndDelete({ userId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error resetting session" });
  }
}

module.exports = {
  chatWithAI,
  getHistory,
  resetSession,
  updateSearchIndex: SearchAgent.updateSearchIndex.bind(SearchAgent)
};
