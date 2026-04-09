import React from 'react';

const WorkFlow = () => {
  const steps = [
    {
      id: 1,
      title: "Өөрт таарсан ажлыг хайх",
      description: "Нүүр хуудас эсвэл 'Бүх ажил' цэснээс мэргэжил, үнэ, үнэлгээгээр шүүж өөрт тохирох мэргэжилтнийг хайж олох боломжтой.",
      location: "ХААНА: НҮҮР ХУУДАС",
      action: "Мэргэжилтэн хайх",
      color: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/30",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Цаг сонгож ажиллах",
      description: "Үйлчилгээний хуудас дотор 'Цаг сонгох' товчийг дарж, өөрт боломжит цагийг сонгон захиалах боломжтой.",
      location: "ХААНА: ДЭЛГЭРЭНГҮЙ ХУУДАС",
      action: "Цаг сонгох",
      color: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/30",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Гэрээгээ хийх",
      description: "Ажил олгогч зөвшөөрсний дараа дээд цэсний сагсны дүрс дээр дарж төлбөрөө аюулгүй төлнө.",
      location: "ХААНА: САГСНЫ ХУУДАС",
      action: "Сагс үзэх",
      color: "from-emerald-400 to-emerald-500",
      shadow: "shadow-emerald-500/30",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Үнэлгээ өгөх",
      description: "Захиалга дууссаны дараа 'Миний захиалгууд' хуудаснаас үнэлгээ, сэтгэгдэл үлдээх боломжтой.",
      location: "ХААНА: ПРОФАЙЛ",
      action: "Захиалга харах",
      color: "from-amber-400 to-amber-500",
      shadow: "shadow-amber-500/30",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Арын зөөлөн туяа (Glow effect) */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none"></div>

      <div className="w-full px-8 md:px-16 lg:px-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h4 className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-3">Ажлын урсгал</h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Хэрхэн ажилладаг вэ?</h2>
          <p className="text-gray-500 text-lg">Бид таныг ур чадварт тань тохирсон цагийн ажил болон богино хугацааны төслүүдтэй шуурхай холбож, найдвартай орлоготой болоход тань тусална.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="group relative bg-white/60 backdrop-blur-xl border border-gray-100/80 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full"
            >
              {/* Хөвдөг дугаар */}
              <div className={`absolute -top-5 right-6 w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} text-white font-black text-xl flex items-center justify-center shadow-lg ${step.shadow} transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300`}>
                {step.id}
              </div>

              {/* Икон хэсэг */}
              <div className={`w-16 h-16 rounded-2xl ${step.iconBg} ${step.iconColor} flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>

              {/* Текст мэдээлэл */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-grow mb-8">
                {step.description}
              </p>

              {/* Үйлдэл хэсэг */}
              <div className="mt-auto pt-6 border-t border-gray-100/80">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {step.location}
                </div>
                <button className={`w-full py-3 rounded-xl bg-gray-50 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2 group-hover:${step.iconColor}`}>
                  {step.action} 
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkFlow;