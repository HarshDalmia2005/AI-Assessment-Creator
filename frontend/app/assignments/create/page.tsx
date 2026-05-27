"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Calendar,
  Plus,
  Mic,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Minus,
  X,
} from "lucide-react";
import { useAssessmentStore } from "@/store/useAssessmentStore";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const {
    formData,
    updateFormData,
    addQuestionType,
    updateQuestionType,
    removeQuestionType,
    submitAssignment,
  } = useAssessmentStore();

  const totalQuestions = formData.questionTypes.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );
  const totalMarks = formData.questionTypes.reduce(
    (acc, curr) => acc + curr.count * curr.marks,
    0,
  );

  const handleNext = async () => {
    if (!formData.dueDate) {
      alert("Please select a Due Date.");
      return;
    }
    const id = await submitAssignment();
    if (id) {
      router.push("/assignments/output");
    } else {
      alert("Failed to submit assignment. Please try again.");
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1];
        updateFormData({
          fileData: base64String,
          fileMimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto relative">
      {/* Mobile header: ← Create Assignment */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#F3F4F6]">
        <button onClick={() => router.back()} className="text-[#303030]">
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <h2 className="text-[15px] font-semibold text-[#303030]">
          Create Assignment
        </h2>
      </div>

      {/* Desktop header with green dot */}
      <div className="hidden md:flex items-center justify-start gap-3 my-1 mx-5">
        <div className="w-3 h-3 rounded-full bg-[#22C55E] ring-4 ring-[#22C55E]/20"></div>
        <h2 className="text-[22px] font-bold text-[#303030] font-bricolage">
          Create Assignment
        </h2>
      </div>
      <p className="hidden md:block text-[13px] text-[#9CA3AF] ml-6">
        Set up a new assignment for your students
      </p>

      <div className="flex-1 px-4 md:px-8 pt-4 md:pt-8 pb-36 md:pb-32 max-w-[900px] mx-auto w-full relative">
        {/* Desktop: Progress Bar */}
        <div className="hidden md:block mb-8">
          <div className="flex items-center gap-2 mt-6 ml-6 max-w-[815px]">
            <div className="h-[4px] bg-[#5E5E5E] rounded-full w-1/2"></div>
            <div className="h-[4px] bg-[#DADADA] rounded-full w-1/2"></div>
          </div>
        </div>

        {/* White Card */}
        <div className="bg-white md:bg-white/50 mx-auto rounded-[20px] md:rounded-[32px] p-5 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
          <h3 className="text-[16px] md:text-[20px] font-bold text-[#303030] font-bricolage mb-0.5">
            Assignment Details
          </h3>
          <p className="text-[12px] md:text-[14px] text-[#5E5E5E] mb-5 md:mb-8">
            Basic information about your assignment
          </p>

          {/* File Upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#EAEAEA] rounded-[16px] md:rounded-[24px] py-6 md:py-10 px-4 md:px-6 flex flex-col items-center justify-center bg-white mb-2 md:mb-4 hover:bg-[#FAFAFA] transition-colors cursor-pointer group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/jpeg, image/png, application/pdf"
            />
            <UploadCloud
              size={20}
              className="md:w-6 md:h-6 text-[#303030] mb-2 md:mb-4"
              strokeWidth={2}
            />
            <p className="font-semibold text-[13px] md:text-[16px] text-[#303030] mb-0.5 text-center">
              {fileName ? fileName : "Choose a file or drag & drop it here"}
            </p>
            {!fileName && (
              <p className="text-[11px] md:text-[14px] text-[#A9A9A9] mb-3 md:mb-5">
                JPEG, PNG, PDF upto 10MB
              </p>
            )}
            <button className="px-5 md:px-6 py-1.5 md:py-2 bg-[#F5F5F5] hover:bg-[#EEEEEE] rounded-full text-[12px] md:text-[14px] font-semibold text-[#303030] transition-colors mt-2">
              {fileName ? "Change File" : "Browse Files"}
            </button>
          </div>
          <p className="text-center text-[11px] md:text-[14px] text-[#303030]/60 mb-5 md:mb-8">
            Upload images of your preferred document/image
          </p>

          <div className="mb-5 md:mb-8">
            <label className="block text-[13px] md:text-[16px] font-bold text-[#303030] mb-2 md:mb-3">
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full pl-4 md:pl-6 pr-4 md:pr-6 py-2.5 md:py-3.5 bg-[#F9FAFB] border border-[#EAEAEA] rounded-full text-[13px] md:text-[14px] outline-none focus:border-[#D1D5DB] focus:bg-white transition-colors placeholder:text-[#9CA3AF] font-medium text-[#303030]"
                value={formData.dueDate}
                onChange={(e) => updateFormData({ dueDate: e.target.value })}
              />
            </div>
          </div>

          {/* Question Types */}
          <div className="mb-6 md:mb-10">
            {/* Desktop column headers */}
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 pl-2">
              <div className="col-span-7">
                <label className="text-[16px] font-bold text-[#303030]">
                  Question Type
                </label>
              </div>
              <div className="col-span-3 text-center">
                <label className="text-[16px] font-bold text-[#303030]">
                  No. of Questions
                </label>
              </div>
              <div className="col-span-2 text-center">
                <label className="text-[16px] font-bold text-[#303030]">
                  Marks
                </label>
              </div>
            </div>

            {/* Mobile label */}
            <div className="md:hidden mb-3">
              <label className="text-[13px] font-bold text-[#303030]">
                Question Type
              </label>
            </div>

            <div className="space-y-3 md:space-y-4">
              {formData.questionTypes.map((qt) => (
                <div key={qt.id}>
                  {/* ── Desktop row (grid) ── */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 relative">
                      <select
                        className="w-full appearance-none bg-white border border-[#EAEAEA] rounded-full pl-6 pr-10 py-3.5 text-[16px] font-medium text-[#303030] outline-none focus:border-[#D1D5DB] cursor-pointer shadow-sm shadow-black/5"
                        value={qt.type}
                        onChange={(e) =>
                          updateQuestionType(qt.id, { type: e.target.value })
                        }
                      >
                        <option>Multiple Choice Questions</option>
                        <option>Short Questions</option>
                        <option>Diagram/Graph-Based Questions</option>
                        <option>Numerical Problems</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
                      />
                    </div>
                    <div className="col-span-1 text-center text-[#303030] font-bold text-[16px]">
                      x
                    </div>
                    <div className="col-span-2 flex items-center justify-between bg-white border border-[#EAEAEA] rounded-full px-4 py-3.5 shadow-sm shadow-black/5">
                      <button
                        onClick={() =>
                          updateQuestionType(qt.id, {
                            count: Math.max(1, qt.count - 1),
                          })
                        }
                        className="text-[#D1D5DB] hover:text-[#303030] transition-colors"
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="font-bold text-[14px] text-[#303030]">
                        {qt.count}
                      </span>
                      <button
                        onClick={() =>
                          updateQuestionType(qt.id, { count: qt.count + 1 })
                        }
                        className="text-[#D1D5DB] hover:text-[#303030] transition-colors"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                    <div className="col-span-1 text-center text-[#303030] font-bold text-[16px] opacity-0 pointer-events-none">
                      x
                    </div>
                    <div className="col-span-2 flex items-center justify-between bg-white border border-[#EAEAEA] rounded-full px-4 py-3.5 shadow-sm shadow-black/5">
                      <button
                        onClick={() =>
                          updateQuestionType(qt.id, {
                            marks: Math.max(1, qt.marks - 1),
                          })
                        }
                        className="text-[#D1D5DB] hover:text-[#303030] transition-colors"
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="font-bold text-[16px] text-[#303030]">
                        {qt.marks}
                      </span>
                      <button
                        onClick={() =>
                          updateQuestionType(qt.id, { marks: qt.marks + 1 })
                        }
                        className="text-[#D1D5DB] hover:text-[#303030] transition-colors"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                  {/* ── Mobile card (stacked, matching Figma) ── */}
                  <div className="md:hidden bg-[#F9FAFB] border border-[#EAEAEA] rounded-[16px] p-4">
                    {/* Type dropdown + X */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="relative flex-1">
                        <select
                          className="w-full appearance-none bg-white border border-[#EAEAEA] rounded-full pl-3 pr-7 py-2 text-[12px] font-medium text-[#303030] outline-none cursor-pointer"
                          value={qt.type}
                          onChange={(e) =>
                            updateQuestionType(qt.id, { type: e.target.value })
                          }
                        >
                          <option>Multiple Choice Questions</option>
                          <option>Short Questions</option>
                          <option>Diagram/Graph-Based Questions</option>
                          <option>Numerical Problems</option>
                        </select>
                        <ChevronDown
                          size={12}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
                        />
                      </div>
                      <button
                        onClick={() => removeQuestionType(qt.id)}
                        className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors shrink-0"
                      >
                        <X size={16} strokeWidth={2} />
                      </button>
                    </div>

                    {/* Counters row */}
                    <div className="flex gap-3">
                      {/* No. of Questions */}
                      <div className="flex-1">
                        <label className="text-[10px] text-[#9CA3AF] font-semibold mb-1.5 block">
                          No. of Questions
                        </label>
                        <div className="flex items-center justify-between bg-white border border-[#EAEAEA] rounded-full px-3 py-2">
                          <button
                            onClick={() =>
                              updateQuestionType(qt.id, {
                                count: Math.max(1, qt.count - 1),
                              })
                            }
                            className="text-[#D1D5DB] hover:text-[#303030]"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="font-bold text-[13px] text-[#303030]">
                            {qt.count}
                          </span>
                          <button
                            onClick={() =>
                              updateQuestionType(qt.id, { count: qt.count + 1 })
                            }
                            className="text-[#D1D5DB] hover:text-[#303030]"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                      {/* Marks */}
                      <div className="flex-1">
                        <label className="text-[10px] text-[#9CA3AF] font-semibold mb-1.5 block">
                          Marks
                        </label>
                        <div className="flex items-center justify-between bg-white border border-[#EAEAEA] rounded-full px-3 py-2">
                          <button
                            onClick={() =>
                              updateQuestionType(qt.id, {
                                marks: Math.max(1, qt.marks - 1),
                              })
                            }
                            className="text-[#D1D5DB] hover:text-[#303030]"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="font-bold text-[13px] text-[#303030]">
                            {qt.marks}
                          </span>
                          <button
                            onClick={() =>
                              updateQuestionType(qt.id, { marks: qt.marks + 1 })
                            }
                            className="text-[#D1D5DB] hover:text-[#303030]"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => addQuestionType()}
              className="flex items-center gap-2 text-[13px] md:text-[14px] text-[#303030] font-bold mt-4 md:mt-6 transition-colors group"
            >
              <div className="bg-[#2B2B2B] text-white rounded-full w-[28px] h-[28px] md:w-[36px] md:h-[36px] flex items-center justify-center group-hover:bg-black transition-colors">
                <Plus
                  size={12}
                  className="md:w-[14px] md:h-[14px]"
                  strokeWidth={2.5}
                />
              </div>
              Add Question Type
            </button>

            <div className="flex flex-col items-end mt-3 md:mt-4 text-[13px] md:text-[16px] text-[#303030] space-y-0.5 md:space-y-1 font-medium">
              <div>
                Total Questions :{" "}
                <span className="font-medium">{totalQuestions}</span>
              </div>
              <div>
                Total Marks : <span className="font-medium">{totalMarks}</span>
              </div>
            </div>
          </div>

          {/* Additional Information - desktop only */}
          <div className="hidden md:block">
            <label className="block text-[16px] font-bold text-[#303030] mb-3">
              Additional Information (For better output)
            </label>
            <div className="relative">
              <textarea
                rows={3}
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                className="w-full h-[102px] overflow-hidden p-6 pb-14 bg-[#FFFFFF]/25 border-2 border-dashed border-[#EAEAEA] rounded-[24px] text-[14px] outline-none focus:border-[#D1D5DB] transition-colors resize-none placeholder:text-[#303030]/60"
                value={formData.additionalInstructions}
                onChange={(e) =>
                  updateFormData({ additionalInstructions: e.target.value })
                }
              />
              <button className="absolute right-5 bottom-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#F0F0F0]/20 hover:bg-[#D1D5DB] transition-colors text-[#303030]">
                <Mic size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav Buttons */}
      <div className="fixed bottom-16 md:bottom-8 left-4 right-4 md:left-[340px] md:right-12 z-20 pointer-events-none">
        <div className="max-w-[900px] mx-auto w-full px-0 md:px-8 flex justify-between pointer-events-auto gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 md:gap-2 bg-white border border-[#EAEAEA] hover:bg-[#F9FAFB] text-[#303030] px-4 md:px-6 py-2.5 md:py-3.5 rounded-full text-[12px] md:text-[14px] font-bold transition-colors shadow-sm"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={useAssessmentStore.getState().isGenerating}
            className="flex items-center gap-1.5 md:gap-2 bg-[#303030] hover:bg-black disabled:bg-gray-400 text-white px-5 md:px-8 py-2.5 md:py-3.5 rounded-full text-[12px] md:text-[14px] font-bold transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            {useAssessmentStore.getState().isGenerating
              ? "Generating..."
              : "Next"}
            {!useAssessmentStore.getState().isGenerating && (
              <ArrowRight size={14} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
