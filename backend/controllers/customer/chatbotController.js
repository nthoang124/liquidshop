const Groq = require('groq-sdk');
const Product = require('../../models/productModel');
const Order = require('../../models/orderModel');
const ChatSession = require('../../models/chatSessionModel');
const Fuse = require('fuse.js');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let searchEngine = null;
let cachedProducts = [];
let lastUpdated = 0;

// Cập nhật dữ liệu tìm kiếm mỗi 5p
async function updateSearchIndex() {
  const now = Date.now();
  if (now - lastUpdated > 300000 || !searchEngine) {
    try {
      const products = await Product.find({ status: 'active' })
        .populate('brand', 'name')
        .populate('category', 'name')
        .select('name price slug description brand category image sku');

      // Chuẩn hóa dữ liệu để search ngon hơn
      cachedProducts = products.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        // Tạo một trường text tổng hợp để search cho chuẩn
        searchText: `${p.name} ${p.brand?.name || ''} ${p.category?.name || ''} ${p.description || ''}`,
        raw: p
      }));

      // Cấu hình Fuse.js
      const options = {
        includeScore: true,
        keys: ['searchText'], // Tìm trong trường text tổng hợp
        threshold: 0.4, // Độ chấp nhận sai số
        ignoreLocation: true
      };

      searchEngine = new Fuse(cachedProducts, options);
      lastUpdated = now;
      console.log(`Search Engine Updated! Loaded ${cachedProducts.length} products.`);
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
1. "search_product": Find product, ask price.
2. "check_order": Check order status.

JSON Output:
{
  "intent": "search_product" | "check_order",
  "query": {
    "keyword": string, // Important: Extract core keywords related to name, category, brand
    "price_max": number // Only fill in when the user mentions price
  },
}
`;

const RESPONDER_SYSTEM_PROMPT = `
Role: Sales Assistant. Tone: Friendly, Vietnamese.
Task: Answer based on CONTEXT.
Rules:
- Don't list product details (name, price) repeatedly because user can see the cards.
- Just give a short, catchy introduction about the products found.
- If no products, suggest broadly.
`;

const chatWithAI = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    await updateSearchIndex();

    let session;
    session = await ChatSession.findOne({ userId });

    if (!session) {
      session = new ChatSession({ userId: userId, messages: [] });
      await session.save();
    }

    // Lấy lịch sử chat cho AI nhớ
    const historyContext = session.messages.slice(-4).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.message
    }));

    // Gọi AI cùi để lọc dữ liệu cho nhanh
    const routerCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: ROUTER_PROMPT },
        ...historyContext,
        { role: "user", content: message }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const { intent, query } = JSON.parse(routerCompletion.choices[0].message.content);

    console.log(JSON.stringify(query))

    // Query db dựa trên res đã lọc từ AI cùi
    let dbContext = "Không có dữ liệu database.";
    let foundDataPayload = null;

    if (intent === "search_product") {
      let results = [];

      if (query?.keyword) {
        const fuseResults = searchEngine.search(query.keyword);
        results = fuseResults.map(r => r.item);
      } else {
        results = cachedProducts;
      }

      if (query?.price_max) {
        results = results.filter(p => p.price <= query.price_max);
      }

      const products = results.slice(0, 5);

      if (products.length > 0) {

        dbContext = `Tìm thấy ${products.length} sản phẩm:\n` +
          products.map(p => `- ${p.name} (Giá: ${p.price})`).join("\n");

        const ids = products.map(p => p._id);
        foundDataPayload = `[PRODUCT_LIST_START]${JSON.stringify(ids)}[PRODUCT_LIST_END]`;
      } else {
        dbContext = "Đã tìm trong kho nhưng không thấy sản phẩm nào khớp yêu cầu.";
      }

    } else if (intent === "check_order") {
      const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(1);

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
        { role: "system", content: RESPONDER_SYSTEM_PROMPT },
        ...historyContext,
        { role: "system", content: `CONTEXT DATA TỪ DATABASE:\n${dbContext}` },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      stream: true,
      temperature: 0.7,
      max_tokens: 500
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
      res.write(`data: ${JSON.stringify({ content: "\n\n" + foundDataPayload })}\n\n`);
      fullBotResponse += "\n" + foundDataPayload;
    }

    session.messages.push({ sender: 'user', message: message });
    session.messages.push({ sender: 'bot', message: fullBotResponse });
    session.updatedAt = Date.now();
    await session.save();

    console.log(fullBotResponse)
    res.end();

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.write(`data: ${JSON.stringify({ content: "Mạng lag quá, mình chưa load được. Bạn hỏi lại nha!" })}\n\n`);
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
        error
      });
    }

    res.status(200).json({
      message: "Get history chatbot successfull",
      session
    });
  } catch (error) {
    res.status(500).json({
      message: "Get history chatbot error",
      error
    });
  }
};

module.exports = { chatWithAI, getHistory }