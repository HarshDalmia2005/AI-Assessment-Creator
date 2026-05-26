'use client';

import React, { useRef } from 'react';
import { Download } from 'lucide-react';

const MOCK_QUESTIONS = [
  { id: 1, text: "Define electroplating. Explain its purpose.", marks: 2, difficulty: "Easy" },
  { id: 2, text: "What is the role of a conductor in the process of electrolysis?", marks: 2, difficulty: "Moderate" },
  { id: 3, text: "Why does a solution of copper sulfate conduct electricity?", marks: 2, difficulty: "Easy" },
  { id: 4, text: "Describe one example of the chemical effect of electric current in daily life.", marks: 2, difficulty: "Moderate" },
  { id: 5, text: "Explain why electric current is said to have chemical effects.", marks: 2, difficulty: "Moderate" },
  { id: 6, text: "How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction involved.", marks: 2, difficulty: "Challenging" },
  { id: 7, text: "What happens at the cathode and anode during the electrolysis of water? Name the gases evolved.", marks: 2, difficulty: "Challenging" },
  { id: 8, text: "Mention the type of current used in electroplating and justify why it is used.", marks: 2, difficulty: "Easy" },
  { id: 9, text: "What is the importance of electric current in the field of metallurgy?", marks: 2, difficulty: "Moderate" },
  { id: 10, text: "Explain with a chemical equation how copper is deposited during the electroplating of an object.", marks: 2, difficulty: "Challenging" }
];

const MOCK_ANSWERS = [
  "Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness.",
  "A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes.",
  "Copper sulfate solution contains free copper and sulfate ions which carry electric charge, thus conducting electricity.",
  "An example is the electroplating of silver on jewelry to prevent tarnishing.",
  "Electric current causes the movement of ions leading to chemical changes at the electrodes, hence it shows chemical effects.",
  "During brine electrolysis as water gains electrons: 2H2O + 2e- → H2 + 2OH-",
  "At cathode hydrogen gas is evolved, at anode oxygen gas is evolved during electrolysis of water.",
  "Direct current (DC) is used because it provides a steady unidirectional flow needed for consistent metal deposition.",
  "Electric current is used in metallurgy for extracting pure metals from their ores through electrolytic refining.",
  "Cu²⁺ + 2e⁻ → Cu. Copper ions from the solution gain electrons at the cathode and deposit as pure copper metal."
];

export default function OutputPage() {
  const paperRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const element = paperRef.current;
    if (!element) return;

    // @ts-ignore
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    const opt = {
      margin: 10,
      filename: 'Assessment.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    if (typeof html2pdf === 'function') {
      html2pdf().set(opt).from(element).save();
    } else {
      console.error("html2pdf is not a function. Module:", html2pdfModule);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#5E5E5E] rounded-none md:rounded-[24px] overflow-y-auto">
      {/* Top bar */}
      <div className="bg-[#303030] m-6 rounded-[32px] px-4 md:px-8 pt-4 md:pt-6 pb-3 md:pb-4 shrink-0">
        {/* Mobile: bubble card */}
        <div className="md:hidden bg-[#2D2D2D] rounded-[16px] p-3 mb-3">
          <p className="text-[12px] font-medium leading-relaxed text-white/90">
            Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
          </p>
        </div>

        {/* Desktop: text directly on background */}
        <p className="hidden md:block text-[14px] font-bold leading-relaxed text-white mb-4 max-w-2xl">
          Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
        </p>

        {/* Download button */}
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-white text-[#1A1A1A] hover:bg-[#F3F4F6] px-4 py-2 rounded-full text-[12px] font-bold transition-colors shadow-sm"
        >
          <Download size={14} strokeWidth={2.5} />
          <span className="hidden md:inline">Download as PDF</span>
        </button>
      </div>

      {/* The Paper */}
      <div className="flex-1 mx-2 md:mx-6 mb-2 md:mb-6 bg-white rounded-t-[20px] md:rounded-[32px] shadow-lg">
        <div ref={paperRef} className="p-5 md:px-16 md:py-12 max-w-3xl mx-auto font-sans text-[#1A1A1A]">

          {/* Paper Header */}
          <div className="text-center mb-4 md:mb-6 pb-2 md:pb-3">
            <h1 className="text-[16px] md:text-[22px] font-bold mb-1">Delhi Public School, Sector-4, Bokaro</h1>
            <h2 className="text-[12px] md:text-[14px] font-medium text-[#6B7280]">Subject: English</h2>
            <h3 className="text-[12px] md:text-[14px] font-medium text-[#6B7280]">Class: 5th</h3>
          </div>

          {/* Meta Info */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center text-[11px] md:text-[13px] mb-3 md:mb-4 font-bold space-y-0.5 md:space-y-0">
            <div>Time Allowed: 45 minutes</div>
            <div>Maximum Marks: 20</div>
          </div>

          <div className="text-[11px] md:text-[13px] font-medium mb-4 md:mb-6 text-[#1A1A1A]">
            All questions are compulsory unless stated otherwise.
          </div>

          {/* Student Info Lines */}
          <div className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-[11px] md:text-[13px]">
            <div className="flex items-end gap-2">
              <span className="font-bold shrink-0">Name:</span>
              <div className="flex-1 border-b border-[#1A1A1A]"></div>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-bold shrink-0">Roll Number:</span>
              <div className="flex-1 border-b border-[#1A1A1A]"></div>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-bold shrink-0">Class: 5th Section:</span>
              <div className="flex-1 border-b border-[#1A1A1A]"></div>
            </div>
          </div>

          {/* Section */}
          <div className="mb-6 md:mb-8">
            <h4 className="text-center text-[13px] md:text-[16px] font-bold mb-4 md:mb-5">Section A</h4>

            <div className="mb-3 md:mb-4">
              <h5 className="font-bold text-[12px] md:text-[14px] mb-0.5">Short Answer Questions</h5>
              <p className="text-[10px] md:text-[12px] italic text-[#6B7280]">Attempt all questions. Each question carries 2 marks</p>
            </div>

            <div className="space-y-2.5 md:space-y-3">
              {MOCK_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="flex gap-2 md:gap-2 text-[11px] md:text-[13px] leading-relaxed">
                  <span className="shrink-0">{idx + 1}.</span>
                  <div className="flex-1">
                    [{q.difficulty}] {q.text} [{q.marks} Marks]
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] md:text-[13px] font-bold mt-6 md:mt-8 mb-8 md:mb-10">
            End of Question Paper
          </div>

          {/* Answer Key */}
          <div>
            <h4 className="text-[13px] md:text-[16px] font-bold mb-4 md:mb-5">Answer Key:</h4>
            <div className="space-y-3 md:space-y-4">
              {MOCK_ANSWERS.map((answer, idx) => (
                <div key={idx} className="flex gap-2 text-[10px] md:text-[12px] leading-relaxed">
                  <span className="shrink-0">{idx + 1}.</span>
                  <p className="flex-1">{answer}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
