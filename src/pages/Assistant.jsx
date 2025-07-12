import { useState, useEffect } from "react";
import { toast } from "sonner";
 
export default function Assistant() {
    const [input, setInput] = useState(""); 
    const [messages, setMessages] = useState([]); 
    const [expenses, setExpenses] = useState([]);
 
useEffect(() => { 
    const saved = JSON.parse(localStorage.getItem("expenses") || "[]"); 
    setExpenses(saved); }, []);
 
const normalizeText = (text) => { 
    return text
    .toLowerCase() 
    .replace(/[!؟?,.\-\n]/g, "") 
    .replace(/أ|إ|آ/g, "ا") 
    .replace(/ة/g, "ه") 
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ")
    .trim(); };
 
const getCurrentMonth = () => new Date().getMonth();
 
const getMonthName = (index) =>
    [ "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر" ][index];
 
const generateReply = (text) => { 
    const normalized = normalizeText(text); 
    const now = new Date(); 
    const currentMonth = now.getMonth(); 
    const thisMonthExpenses = expenses.filter(e => new Date(e.date).getMonth() === currentMonth); 
    const allTotal = expenses.reduce((sum, e) => sum + e.amount, 0); 
    const monthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const grouped = expenses.reduce((acc, item) => {   
    acc[item.category] = (acc[item.category] || 0) + item.amount;   
    return acc;
    }, {});  
 
    const topCategory = Object.entries(grouped).sort((a, b) => b[1] - a[1])[0];  
    // Intent: total spent this month 
    if (normalized.includes("كم") && normalized.includes("شهر")) {   
        return `📆 في شهر ${getMonthName(currentMonth)}, صرفت ${monthTotal} ₪; `
    }  
    // Intent: overall spending 
    if (normalized.includes("مجموع") || normalized.includes("كل") || normalized.includes("صرفت")) {   
        return `💰 مجموع المصاريف المسجلة هو ${allTotal} ₪; `}  
    // Intent: top spending category 
    if (   
        normalized.includes("اكثر") ||   
        normalized.includes("اعلى") ||   
        normalized.includes("وين") ||   
        normalized.includes("راتبي") 
    ) {
        if (!topCategory) return "ما في بيانات كافية لهيك تحليل.";   
        return `📊 أكثر تصنيف صرفت عليه هو: ${topCategory[0]} بمبلغ ${topCategory[1]} ₪;` 
    }  
    // Intent: is my financial situation good? 
    if (normalized.includes("وضعي") || normalized.includes("تمام") || normalized.includes("تحليل")) {   
        const income = 2000; 
        // أو ممكن تسحب من مكان تاني   
        const percentage = (allTotal / income) * 100;   
        if (percentage < 50) return "✅ وضعك المالي ممتاز!";   
        if (percentage < 80) return "⚠️ جيد لكن راقب مصاريفك.";   
        return "❗ صرفك مرتفع جدًا مقارنة بدخلك."; 
    }  
    // Intent: advice 
    if (   
      normalized.includes("نصيحه") ||   
      normalized.includes("اوقف") ||   
      normalized.includes("اوفر") ||   
      normalized.includes("توفير") 
    ) {   
        if (!topCategory) return "ابدأ بإدخال مصاريف أولًا، بعدها بعطيك نصايح 🔍";
        return `💡 حاول تقلل من مصاريف ${topCategory[0]}. شكلها مرتفعة عن باقي التصنيفات.`;
     }  
     return "🤖 آسف، ما فهمت السؤال بالضبط. جرب تسألني مثل: \"كم صرفت هذا الشهر؟\" أو \"وين بروح راتبي؟\"";  
};
 
const handleUserMessage = (e) => { 
    e.preventDefault(); 
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input }; 
    const reply = generateReply(input);  

    setMessages((prev) => [...prev, userMessage, { sender: "bot", text: reply }]); 
    setInput("");  
};
 
return ( 
   <div className="flex-1 overflow-y-auto space-y-2 mb-4 border rounded p-2 bg-white">
        <h2 className="text-lg font-bold mb-4 text-gray-800">المساعد الذكي</h2>
        <div className="flex-1 overflow-y-auto space-y-2 mb-4 border rounded p-2 bg-gray-50">
            {messages.map((msg , i)=>(
                <div key={i}
                className={`p-2 rounded max-w-[80%] whitespace-pre-wrap break-words ${
                    msg.sender === "user"?
                    "bg-blue-100 self-end text-rigth":
                    "bg-green-100 self-start text-rigth"
                }`}
                >
                    {msg.text}
                </div>
            ))}
            {messages.length === 0 && (
                <p className="text-gray-400 text-sm text-center">ابدا بكتابة سؤالك🖐️</p>
            )}
        </div>
        <form onSubmit={handleUserMessage} className="flex gap-2">
            <input 
                type="text" 
                placeholder="اكتب سؤالك ..."
                value={input}
                onChange={(e)=> setInput(e.target.value)}
                className="flex-1 border p-2 rounded"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">ارسال</button>
        </form>
   </div>     
); }