import { Link } from "react-router-dom";
import { motion } from "framer-motion";
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* =============== Hero Section =============== */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🧾 نظام إدارة المصاريف الذكي
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            سيطر على نفقاتك، تابع اشتراكاتك، وحلل بياناتك المالية بسهولة وأناقة.
          </motion.p>
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/expenses" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-primary/90">
              🚀 ابدأ الآن
            </Link>
            <Link to="/about" className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10">
              ℹ️ من نحن
            </Link>
          </motion.div>
        </div>
      </section>

      {/* =============== Features Section =============== */}
      <section className="py-20 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">⚡ أبرز الميزات</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-gray-50 p-6 rounded-xl shadow text-center">
                <div className="text-4xl mb-2">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* لماذا نحن */}
      <section className="py-20 bg-white border-t">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">🧠 لماذا تختار نظامنا؟</h2>
          <p className="text-gray-600 mb-8 text-sm">
            لأننا جمعنا بين البساطة، الذكاء، وجمال التصميم. مع دعم اللغة العربية الكامل، والتحكم الذكي بالمصاريف والاشتراكات، والتقارير.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-sm" dir="rtl">
            <div className="p-4 bg-gray-50 rounded-xl shadow text-right">
              <h4 className="font-bold text-primary mb-1">✅ ميزات لا تجدها في تطبيقات أخرى</h4>
              <ul className=" pr-4 text-gray-700 space-y-1">
                <li>تحليل ذكي وتقرير PDF أنيق</li>
                <li>إدارة الاشتراكات المتكررة تلقائيًا</li>
                <li>تقويم مصاريف تفاعلي</li>
                <li>نظام الوضع الآمن لإخفاء الأرقام</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl shadow text-right">
              <h4 className="font-bold text-primary mb-1">⚡ مقارنة مع المنافسين</h4>
              <table className="text-xs w-full">
                <thead>
                  <tr className="text-right">
                    <th className="py-1">الميزة</th>
                    <th className="py-1">تطبيقنا</th>
                    <th className="py-1">الآخرون</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>دعم اللغة العربية</td><td>✅</td><td>❌</td></tr>
                  <tr><td>تكرار المصاريف تلقائيًا</td><td>✅</td><td>❌</td></tr>
                  <tr><td>تصدير PDF ذكي</td><td>✅</td><td>⚠️</td></tr>
                  <tr><td>واجهة عربية أنيقة</td><td>✅</td><td>❌</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

            {/* =============== Demo / Preview =============== */}
            <section className="py-20 bg-blue-50 border-t">
              <div className="max-w-5xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-6">📷 لمحة من داخل النظام</h2>
                <img src="./src/images/landing.png" alt="تجربة من التطبيق" className="rounded-xl shadow-lg mx-auto max-w-full" />
                <p className="text-gray-500 text-sm mt-2">واجهة الاشتراكات المتكررة تعرض المصاريف والاشتراكات بشكل حيّ</p>
              </div>
            </section>

            {/* =============== Testimonials =============== */}
            <section className="py-20 bg-white border-t">
              <div className="max-w-5xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-12">💬 آراء المستخدمين</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {testimonials.map((t, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded shadow">
                      <p className="text-gray-600 italic">"{t.text}"</p>
                      <div className="mt-4 font-semibold text-primary">{t.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* =============== FAQ =============== */}
            <section className="py-20 bg-blue-50 border-t">
              <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12">❓الأسئلة الشائعة</h2>
                {faq.map((q, i) => (
                  <div key={i} className="mb-6">
                    <h4 className="font-bold">{q.q}</h4>
                    <p className="text-gray-600 mt-1 text-sm">{q.a}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="py-16 bg-primary text-white text-center">
              <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl font-bold mb-4">جاهز للسيطرة على مصاريفك؟</h2>
                <p className="mb-6 text-sm opacity-90">ابدأ اليوم واستفد من نظام مصاريف ذكي، آمن، وسهل الاستخدام.</p>
                <Link
                  to="/expenses"
                  className="bg-white text-primary font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
                >
                  🚀 ابدأ الآن
                </Link>
              </div>
            </section>

      {/* =============== Footer =============== */}
      <footer className="bg-gray-50 border-t py-6 text-sm text-center text-gray-500">
        <p>ⓒ 2025 نظام إدارة المصاريف – جميع الحقوق محفوظة</p>
        <div className="mt-2 flex justify-center gap-4 text-gray-400">
          <a href="#" className="hover:text-primary">سياسة الخصوصية</a>
          <a href="#" className="hover:text-primary">اتصل بنا</a>
        </div>
      </footer>

    </div>
  );
}

const features = [
  { icon: "📊", title: "تحليلات مالية", desc: "استعرض أين تذهب أموالك بتقارير ورسوم بيانية دقيقة." },
  { icon: "🔁", title: "إدارة الاشتراكات", desc: "كرر المصاريف الشهرية تلقائيًا وتابعها بسهولة." },
  { icon: "🔐", title: "الوضع الآمن", desc: "أخفِ الأرقام الحساسة لحماية خصوصيتك." },
  { icon: "📅", title: "تقويم ذكي", desc: "تابع كل المصاريف حسب التاريخ وقم بالتخطيط المالي." },
  { icon: "🔍", title: "فلترة وبحث متقدم", desc: "اعثر على أي مصروف أو اشتراك بسهولة فائقة." },
  { icon: "📤", title: "تصدير PDF", desc: "احصل على تقرير مصاريفك بشكل أنيق قابل للطباعة." },
];

const testimonials = [
  { name: "محمد", text: "أخيرا لقيت تطبيق مصاريف عربي أنيق وسهل!" },
  { name: "سارة", text: "بستخدمه يوميا لإدارة اشتراكاتي، ممتاز جدا." },
  { name: "أحمد", text: "الواجهة خرافية وتحليل البيانات دقيق وواضح." },
];

const faq = [
  { q: "هل البيانات تبقى محفوظة؟", a: "نعم، يتم حفظها محليا على جهازك باستخدام localStorage." },
  { q: "هل يمكن تعديل أو حذف مصروف؟", a: "أكيد، كل مصروف قابل للتعديل والحذف بسهولة." },
  { q: "هل يدعم الاشتراكات المتكررة؟", a: "نعم، يمكنك تحديد أسبوعي أو شهري ويتم تكرارها تلقائيا." },
];
