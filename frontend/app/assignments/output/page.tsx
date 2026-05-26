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

export default function OutputPage() {
  const paperRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const element = paperRef.current;
    if (!element) return;

    // Dynamically import html2pdf to prevent "window is not defined" error during Next.js SSR
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
    <div className="flex flex-col h-full bg-[#1A1A1A] rounded-[24px] overflow-hidden">
      {/* Top bar with AI message and download */}
      <div className="px-6 pt-5 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3 text-white max-w-xl">
          <div className="mt-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
            <span className="text-[#1A1A1A] text-[9px] font-bold">V</span>
          </div>
          <p className="text-[13px] font-medium leading-relaxed text-white/90">
            Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-white text-[#1A1A1A] hover:bg-[#F3F4F6] px-4 py-2 rounded-full text-[11px] font-bold transition-colors shrink-0 self-start tracking-wide"
        >
          <Download size={12} strokeWidth={2.5} />
          Download as PDF
        </button>
      </div>

      {/* The Paper */}
      <div className="flex-1 mx-4 mb-4 bg-white rounded-[20px] overflow-y-auto">
        <div ref={paperRef} className="p-8 md:p-12 max-w-2xl mx-auto font-sans text-[#1A1A1A]">

          {/* Paper Header */}
          <div className="text-center mb-6 pb-3">
            <h1 className="text-[20px] font-bold mb-1">Delhi Public School, Sector-4, Bokaro</h1>
            <h2 className="text-[14px] font-medium text-[#6B7280]">Subject: English</h2>
            <h3 className="text-[14px] font-medium text-[#6B7280]">Class: 5th</h3>
          </div>

          {/* Meta Info */}
          <div className="flex justify-between items-center text-[12px] mb-4 font-medium">
            <div>Time Allowed: 45 minutes</div>
            <div>Maximum Marks: 20</div>
          </div>

          <div className="text-[12px] font-medium mb-6 text-[#6B7280] italic">
            All questions are compulsory unless stated otherwise.
          </div>

          {/* Student Info Lines */}
          <div className="space-y-3 mb-8 text-[12px]">
            <div className="flex items-end gap-2">
              <span className="font-medium">Name:</span>
              <div className="flex-1 border-b border-[#D1D5DB]"></div>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-medium">Roll Number:</span>
              <div className="flex-1 border-b border-[#D1D5DB]"></div>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-medium">Class: 5th Section:</span>
              <div className="flex-1 border-b border-[#D1D5DB]"></div>
            </div>
          </div>

          {/* Section */}
          <div className="mb-8">
            <h4 className="text-center text-[14px] font-bold mb-5">Section A</h4>

            <div className="mb-4">
              <h5 className="font-bold text-[13px] mb-0.5">Short Answer Questions</h5>
              <p className="text-[11px] italic text-[#9CA3AF]">Attempt all questions. Each question carries 2 marks</p>
            </div>

            <div className="space-y-4">
              {MOCK_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="flex gap-3 text-[12px] leading-relaxed">
                  <span className="shrink-0 font-medium">{idx + 1}.</span>
                  <div className="flex-1">
                    <span className="text-[#9CA3AF] mr-1">[{q.difficulty}]</span>
                    {q.text} <span className="ml-0.5">[{q.marks} Marks]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[12px] font-bold mt-8 pt-4 border-t border-[#F3F4F6]">
            End of Question Paper
          </div>

        </div>
      </div>
    </div>
  );
}
