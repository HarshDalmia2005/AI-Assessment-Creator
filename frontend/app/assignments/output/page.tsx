"use client";

import React, { useRef } from "react";
import { Download } from "lucide-react";

const MOCK_SECTIONS = [
  {
    sectionTitle: "Section A: Short Answer Questions",
    instructions: "Attempt all questions. Each question carries 2 marks",
    questions: [
      {
        id: 1,
        text: "Define electroplating. Explain its purpose.",
        marks: 2,
        difficulty: "Easy",
      },
      {
        id: 2,
        text: "What is the role of a conductor in the process of electrolysis?",
        marks: 2,
        difficulty: "Moderate",
      },
      {
        id: 3,
        text: "Why does a solution of copper sulfate conduct electricity?",
        marks: 2,
        difficulty: "Easy",
      },
      {
        id: 4,
        text: "Describe one example of the chemical effect of electric current in daily life.",
        marks: 2,
        difficulty: "Moderate",
      },
      {
        id: 5,
        text: "Explain why electric current is said to have chemical effects.",
        marks: 2,
        difficulty: "Moderate",
      },
    ]
  }
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
  "Cu²⁺ + 2e⁻ → Cu. Copper ions from the solution gain electrons at the cathode and deposit as pure copper metal.",
];

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useNotificationStore } from "@/store/useNotificationStore";

function OutputContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean, title: string, message: string} | null>(null);
  const {
    assignmentId,
    status,
    generatedPaper,
    assignmentMeta,
    fetchAssignment,
    setAssignmentData,
  } = useAssessmentStore();

  useEffect(() => {
    if (urlId && urlId !== assignmentId) {
      fetchAssignment(urlId);
    }
  }, [urlId, assignmentId, fetchAssignment]);

  useEffect(() => {
    if (assignmentId && (status === "pending" || status === "generating")) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const socket = io(backendUrl);

      socket.emit("join_assignment_room", assignmentId);

      socket.on("status_update", (data) => {
        setAssignmentData(assignmentId, data.status, generatedPaper);
        
        if (data.status === "completed") {
          toast.success("Assignment generation completed!");
          useNotificationStore.getState().addNotification(
            `Assignment "${assignmentMeta?.subject || 'Paper'} - ${assignmentMeta?.classLevel || ''}" has been generated successfully.`,
            "success"
          );
        } else if (data.status === "failed") {
          toast.error("Assignment generation failed.");
          useNotificationStore.getState().addNotification(
            `Failed to generate assignment "${assignmentMeta?.subject || 'Paper'} - ${assignmentMeta?.classLevel || ''}". Please try again.`,
            "error"
          );
        }
      });

      socket.on("generation_complete", () => {
        fetchAssignment(assignmentId);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [
    assignmentId,
    status,
    generatedPaper,
    fetchAssignment,
    setAssignmentData,
  ]);
  const paperRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const element = paperRef.current;
    if (!element) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setModalConfig({
        isOpen: true,
        title: "Pop-up Blocked",
        message: "Your browser blocked the print window. Please allow pop-ups for this site to download the PDF.",
      });
      return;
    }

    // Grab all current stylesheets and style tags so Tailwind works in the new window
    const styles = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]'),
    )
      .map((node) => node.outerHTML)
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Assessment Paper</title>
          ${styles}
          <style>
            @media print {
              @page { margin: 15mm; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body class="bg-white p-4 md:p-8 font-sans text-black">
          ${element.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Small delay to allow CSS to apply before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (!assignmentId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#5E5E5E] rounded-none md:rounded-[24px]">
        <p className="text-white font-medium">No assignment selected.</p>
      </div>
    );
  }

  if (status === "pending" || status === "generating") {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#5E5E5E] rounded-none md:rounded-[24px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <p className="text-white font-medium text-[16px] md:text-[20px]">
          {status === "generating"
            ? "AI is creating your paper..."
            : "Queuing assignment..."}
        </p>
        <p className="text-white/70 text-[12px] md:text-[14px] mt-2 text-center max-w-sm px-6">
          This usually takes about 10-15 seconds. Please don't refresh the page.
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#5E5E5E] rounded-none md:rounded-[24px]">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <div className="w-8 h-8 text-red-500 text-[24px] font-bold text-center leading-[32px]">!</div>
        </div>
        <p className="text-white font-bold text-[18px] md:text-[22px] mb-2">
          Generation Failed
        </p>
        <p className="text-white/70 text-[13px] md:text-[15px] text-center max-w-sm px-6 mb-6 leading-relaxed">
          The AI model is currently experiencing high demand or encountered an error. Please try generating the assignment again.
        </p>
        <button 
          onClick={() => window.location.href = '/assignments/create'}
          className="bg-white text-[#303030] px-6 py-2.5 rounded-full font-bold text-[14px] hover:bg-gray-100 transition-colors shadow-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  const sections = generatedPaper?.sections || MOCK_SECTIONS;
  const answers = generatedPaper?.answers || MOCK_ANSWERS;

  return (
    <div className="flex flex-col h-full bg-[#5E5E5E] rounded-none md:rounded-[24px] overflow-y-auto">
      {/* Top bar */}
      <div className="bg-[#303030] m-6 rounded-[32px] px-4 md:px-8 pt-4 md:pt-6 pb-3 md:pb-4 shrink-0">
        {/* Mobile: bubble card */}
        <div className="md:hidden bg-[#2D2D2D] rounded-[16px] p-3 mb-3">
          <p className="text-[12px] font-medium leading-relaxed text-white/90">
            Certainly, Lakshya! Here are customized Question Paper for your CBSE
            Grade 8 Science classes on the NCERT chapters:
          </p>
        </div>

        <p className="hidden md:block text-[14px] font-bold leading-relaxed text-white mb-4 max-w-2xl">
          Certainly! Here is your customized Question Paper {assignmentMeta?.subject ? `for ${assignmentMeta.subject}` : ""} based on your instructions:
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
        <div
          ref={paperRef}
          className="p-5 md:px-16 md:py-12 max-w-3xl mx-auto font-sans text-[#1A1A1A]"
        >
          {/* Paper Header */}
          <div className="text-center mb-4 md:mb-6 pb-2 md:pb-3">
            <h1 className="text-[16px] md:text-[22px] font-bold mb-1">
              {assignmentMeta?.schoolName || "Delhi Public School, Sector-4, Bokaro"}
            </h1>
            {assignmentMeta?.subject && (
              <h2 className="text-[12px] md:text-[14px] font-medium text-[#6B7280]">
                Subject: {assignmentMeta.subject}
              </h2>
            )}
            {assignmentMeta?.classLevel && (
              <h3 className="text-[12px] md:text-[14px] font-medium text-[#6B7280]">
                Class: {assignmentMeta.classLevel}
              </h3>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center text-[11px] md:text-[13px] mb-3 md:mb-4 font-bold space-y-0.5 md:space-y-0">
            <div>Time Allowed: {assignmentMeta?.timeAllowed || "45 minutes"}</div>
            <div>Maximum Marks: {assignmentMeta?.totalMarks || 20}</div>
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
              <span className="font-bold shrink-0">Class: {assignmentMeta?.classLevel || "5th"} Section:</span>
              <div className="flex-1 border-b border-[#1A1A1A]"></div>
            </div>
          </div>

          {/* Sections */}
          {sections.map((section: any, sIdx: number) => (
            <div key={sIdx} className="mb-6 md:mb-8">
              <h4 className="text-center text-[13px] md:text-[16px] font-bold mb-4 md:mb-5">
                {section.sectionTitle.includes(":") ? section.sectionTitle.split(":")[0] : section.sectionTitle || `Section ${String.fromCharCode(65 + sIdx)}`}
              </h4>

              <div className="mb-3 md:mb-4">
                <h5 className="font-bold text-[12px] md:text-[14px] mb-0.5">
                  {section.sectionTitle.includes(":") ? section.sectionTitle.split(":")[1].trim() : section.sectionTitle}
                </h5>
                <p className="text-[10px] md:text-[12px] italic text-[#6B7280]">
                  {section.instructions}
                </p>
              </div>

              <div className="space-y-2.5 md:space-y-3">
                {section.questions.map((q: any, qIdx: number) => (
                  <div
                    key={q.id}
                    className="flex gap-2 md:gap-2 text-[11px] md:text-[13px] leading-relaxed"
                  >
                    <span className="shrink-0">{qIdx + 1}.</span>
                    <div className="flex-1">
                      [{q.difficulty}] {q.text} <span className="font-semibold text-gray-500 float-right">[{q.marks} Marks]</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-[11px] md:text-[13px] font-bold mt-6 md:mt-8 mb-8 md:mb-10">
            End of Question Paper
          </div>

          {/* Answer Key */}
          <div className="print:break-before-page" style={{ pageBreakBefore: 'always' }}>
            <h4 className="text-[13px] md:text-[16px] font-bold mb-4 md:mb-5">
              Answer Key:
            </h4>
            <div className="space-y-3 md:space-y-4">
              {answers.map((answer: string, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-2 text-[10px] md:text-[12px] leading-relaxed"
                >
                  <span className="shrink-0">{idx + 1}.</span>
                  <p className="flex-1">{answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {modalConfig?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] p-6 md:p-8 w-full max-w-[400px] shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-[18px] md:text-[20px] font-bold text-[#303030] mb-2">
              {modalConfig.title}
            </h3>
            <p className="text-[14px] text-[#5E5E5E] mb-6 leading-relaxed">
              {modalConfig.message}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setModalConfig(null)}
                className="bg-[#303030] text-white px-6 py-2 rounded-full font-bold text-[14px] hover:bg-black transition-colors"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OutputPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-full bg-[#5E5E5E] rounded-none md:rounded-[24px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        </div>
      }
    >
      <OutputContent />
    </Suspense>
  );
}
