import React from 'react';

const WorkFlow = () => {
  const steps = [
    {
      id: 1,
      title: "Бүртгэл үүсгэх",
      description: "Ажил хайгч эсвэл Ажил олгогчоор системд хялбархан бүртгүүлнэ үү.",
      icon: "👤",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      id: 2,
      title: "Профайл / Зар",
      description: "Өөрийн ур чадвараа оруулах эсвэл ажлын байрны шинэ зар нийтэлнэ.",
      icon: "📝",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      id: 3,
      title: "Холбогдох",
      description: "Хүсэлт илгээж, зөвшөөрөгдсөн үед холбоо барих мэдээлэл нээгдэнэ.",
      icon: "🤝",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    },
    {
      id: 4,
      title: "Үнэлгээ өгөх",
      description: "Ажил амжилттай дууссаны дараа бие биедээ үнэлгээ өгч, итгэлцэл үүсгэнэ.",
      icon: "⭐",
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 transition-colors duration-300">
          Хэрхэн ажилладаг вэ?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium transition-colors duration-300">
          Манай платформ нь ажил хайгч болон ажил олгогчдыг хамгийн хурдан бөгөөд аюулгүйгээр холбох гүүр болно.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        
        {/* Ард байрлах холбогч шугам (Зөвхөн том дэлгэц дээр) */}
        <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gray-200 dark:bg-gray-800 z-0 transition-colors duration-300"></div>

        {steps.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
            {/* Айкон хайрцаг */}
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-md ${step.color} border-4 border-white dark:border-[#111111]`}>
              {step.icon}
            </div>
            
            {/* Текстүүд */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
              {step.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed transition-colors duration-300">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkFlow;