const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CONSULTATION_SCRIPT = [
    {
        step: 1,
        question: "Bạn đang quan tâm đến laptop, PC hay linh kiện gì để tôi hỗ trợ chính xác nhất?",
        key: "category",
        formatter: (q, data) => q
    },
    {
        step: 2,
        question: "Bạn sử dụng máy cho mục đích gì ạ? (Ví dụ: Lập trình, đồ họa chuyên nghiệp, chơi game AAA hay chỉ văn phòng cơ bản?)",
        key: "purpose"
    },
    {
        step: 3,
        question: "Cảm ơn thông tin của bạn. Vậy ngân sách dự kiến của bạn là khoảng bao nhiêu? (Ví dụ: Dưới 15 triệu, Khoảng 20 - 25 triệu)",
        key: "budget"
    },
    {
        step: 4,
        question: "Cuối cùng, bạn ưu tiên yếu tố nào hơn: Pin trâu/di động cao hay Hiệu năng xử lý tối đa?",
        key: "priority"
    },
    {
        step: 5,
        question: "Vui lòng cho tôi xin số điện thoại để khi có mẫu máy cực hot hoặc giảm giá sốc phù hợp nhu cầu, tôi sẽ báo bạn ngay nhé!",
        key: "phone"
    }
];

const CONSULTATION_EXTRACTOR_PROMPT = `
Role: Information Extractor.
Task: Trích xuất thông tin từ câu nói của khách hàng vào JSON.

Fields cần tìm:
- category: Loại sản phẩm (Laptop, PC, Màn hình, Chuột, Bàn phím...).
- budget: Ngân sách (VD: 20 triệu -> 20000000).
- brand: Thương hiệu (VD: Acer, Asus, Dell, Apple...).
- purpose: Mục đích sử dụng (Lập trình, Gaming, Văn phòng...).
- priority: Ưu tiên (Pin, Hiệu năng, Màn hình...).
- phone: Số điện thoại.

Output JSON Format:
{
  "category": string | null,
  "budget": number | null,
  "brand": string | null,
  "purpose": string | null,
  "priority": string | null,
  "phone": string | null
}

Quy tắc:
- Chỉ trích xuất thông tin CÓ trong câu nói.
- Nếu không có thông tin, để null.
- Số tiền phải chuyển về dạng số nguyên (VNĐ).
- Brand phải chuẩn hóa tên (ví dụ: "máy acer" -> "Acer").
`;

class ConsultAgent {
    constructor() {
        this.script = CONSULTATION_SCRIPT;
    }

    async extractInfo(message) {
        try {
            const extractionCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: CONSULTATION_EXTRACTOR_PROMPT },
                    { role: "user", content: message },
                ],
                model: "qwen/qwen3-32b",
                temperature: 0,
                response_format: { type: "json_object" },
            });
            return JSON.parse(extractionCompletion.choices[0].message.content);
        } catch (error) {
            console.error("Extraction Error:", error);
            return {};
        }
    }

    determineNextStep(currentStep, consultationData) {
        let nextStepIdx = currentStep + 1;
        while (nextStepIdx < this.script.length) {
            const stepKey = this.script[nextStepIdx].key;
            // Nếu chưa có data thì dừng lại hỏi
            if (!consultationData[stepKey] || consultationData[stepKey] === "N/A") {
                return nextStepIdx;
            }
            nextStepIdx++;
        }
        return nextStepIdx; // Nếu nextStepIdx == length nghĩa là done
    }

    getStepQuestion(stepIdx, consultationData) {
        if (stepIdx >= this.script.length) return null;
        const step = this.script[stepIdx];
        if (step.formatter) {
            return step.formatter(step.question, consultationData);
        }
        return step.question;
    }
}

module.exports = new ConsultAgent();
