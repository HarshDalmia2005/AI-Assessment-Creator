'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Calendar, Plus, Mic, ArrowLeft, ArrowRight, ChevronDown, Minus } from 'lucide-react';
import { useAssessmentStore } from '@/store/useAssessmentStore';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { formData, updateFormData, addQuestionType, updateQuestionType } = useAssessmentStore();

  const totalQuestions = formData.questionTypes.reduce((acc, curr) => acc + curr.count, 0);
  const totalMarks = formData.questionTypes.reduce((acc, curr) => acc + (curr.count * curr.marks), 0);

  const handleNext = () => {
    router.push('/assignments/output');
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto relative">
      <div className="flex items-center justify-start gap-3 my-1 mx-5">
        <div className="w-3 h-3 rounded-full bg-[#22C55E] ring-4 ring-[#22C55E]/20"></div>
        <h2 className="text-[22px] font-bold text-[#303030] font-bricolage">Create Assignment</h2>
      </div>
      <p className="text-[13px] text-[#9CA3AF] ml-6">Set up a new assignment for your students</p>
      <div className="flex-1 px-8 pt-8 pb-32 max-w-[900px] mx-auto  w-full relative">
        {/* Page Header */}
        <div className="mb-8">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 mt-6 ml-6 max-w-[815px]">
            <div className="h-[4px] bg-[#5E5E5E] rounded-full w-1/2"></div>
            <div className="h-[4px] bg-[#DADADA] rounded-full w-1/2"></div>
          </div>
        </div>

        {/* White Card */}
        <div className="bg-white/50 mx-auto rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
          <h3 className="text-[20px] font-bold text-[#303030] font-bricolage mb-1">Assignment Details</h3>
          <p className="text-[14px] text-[#5E5E5E] mb-8">Basic information about your assignment</p>

          {/* File Upload */}
          <div className="border-2 border-dashed border-[#EAEAEA] rounded-[24px] py-10 px-6 flex flex-col items-center justify-center bg-white mb-4 hover:bg-[#FAFAFA] transition-colors cursor-pointer group">
            <UploadCloud size={24} className="text-[#303030] mb-4" strokeWidth={2} />
            <p className="font-semibold text-[16px] text-[#303030] mb-1">Choose a file or drag & drop it here</p>
            <p className="text-[14px] text-[#A9A9A9] mb-5">JPEG, PNG, upto 10MB</p>
            <button className="px-6 py-2 bg-[#F5F5F5] hover:bg-[#EEEEEE] rounded-full text-[14px] font-semibold text-[#303030] transition-colors">
              Browse Files
            </button>
          </div>
          <p className="text-center text-[14px] text-[#303030]/60 mb-8">Upload images of your preferred document/image</p>

          {/* Due Date */}
          <div className="mb-8">
            <label className="block text-[16px] font-bold text-[#303030] mb-3">Due Date</label>
            <div className="relative">
              <input
                type="text"
                placeholder="DD-MM-YYYY"
                className="w-full pl-6 pr-12 py-3.5 bg-[#F9FAFB] border border-[#EAEAEA] rounded-full text-[14px] outline-none focus:border-[#D1D5DB] focus:bg-white transition-colors placeholder:text-[#9CA3AF] font-medium text-[#303030]"
                value={formData.dueDate}
                onChange={(e) => updateFormData({ dueDate: e.target.value })}
              />
              <Calendar size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#303030]" />
            </div>
          </div>

          {/* Question Types */}
          <div className="mb-10">
            <div className="grid grid-cols-12 gap-4 mb-4 pl-2">
              <div className="col-span-7"><label className="text-[16px] font-bold text-[#303030]">Question Type</label></div>
              <div className="col-span-3 text-center"><label className="text-[16px] font-bold text-[#303030]">No. of Questions</label></div>
              <div className="col-span-2 text-center"><label className="text-[16px] font-bold text-[#303030]">Marks</label></div>
            </div>

            <div className="space-y-4">
              {formData.questionTypes.map((qt) => (
                <div key={qt.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 relative">
                    <select
                      className="w-full appearance-none bg-white border border-[#EAEAEA] rounded-full pl-6 pr-10 py-3.5 text-[16px] font-medium text-[#303030] outline-none focus:border-[#D1D5DB] cursor-pointer shadow-sm shadow-black/5"
                      value={qt.type}
                      onChange={(e) => updateQuestionType(qt.id, { type: e.target.value })}
                    >
                      <option>Multiple Choice Questions</option>
                      <option>Short Questions</option>
                      <option>Diagram/Graph-Based Questions</option>
                      <option>Numerical Problems</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
                  </div>

                  <div className="col-span-1 text-center text-[#303030] font-bold text-[16px]">
                    x
                  </div>

                  <div className="col-span-2 flex items-center justify-between bg-white border border-[#EAEAEA] rounded-full px-4 py-3.5 shadow-sm shadow-black/5">
                    <button
                      onClick={() => updateQuestionType(qt.id, { count: Math.max(1, qt.count - 1) })}
                      className="flex items-center justify-center text-[#D1D5DB] hover:text-[#303030] transition-colors"
                    >
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="font-bold text-[14px] text-[#303030]">{qt.count}</span>
                    <button
                      onClick={() => updateQuestionType(qt.id, { count: qt.count + 1 })}
                      className="flex items-center justify-center text-[#D1D5DB] hover:text-[#303030] transition-colors"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>

                  <div className="col-span-1 text-center text-[#303030] font-bold text-[16px] opacity-0 pointer-events-none">
                    x
                  </div>

                  <div className="col-span-2 flex items-center justify-between bg-white border border-[#EAEAEA] rounded-full px-4 py-3.5 shadow-sm shadow-black/5">
                    <button
                      onClick={() => updateQuestionType(qt.id, { marks: Math.max(1, qt.marks - 1) })}
                      className="flex items-center justify-center text-[#D1D5DB] hover:text-[#303030] transition-colors"
                    >
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="font-bold text-[16px] text-[#303030]">{qt.marks}</span>
                    <button
                      onClick={() => updateQuestionType(qt.id, { marks: qt.marks + 1 })}
                      className="flex items-center justify-center text-[#D1D5DB] hover:text-[#303030] transition-colors"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => addQuestionType()}
              className="flex items-center gap-2 text-[14px] text-[#303030] font-bold mt-6 transition-colors group"
            >
              <div className="bg-[#2B2B2B] text-white rounded-full w-[36px] h-[36px] flex items-center justify-center group-hover:bg-black transition-colors">
                <Plus size={14} strokeWidth={2.5} />
              </div>
              Add Question Type
            </button>

            <div className="flex flex-col items-end mt-4 text-[16px] text-[#303030] space-y-1 font-medium">
              <div>Total Questions : <span className="font-medium">{totalQuestions}</span></div>
              <div>Total Marks : <span className="font-medium">{totalMarks}</span></div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-[16px] font-bold text-[#303030] mb-3">Additional Information (For better output)</label>
            <div className="relative">
              <textarea
                rows={3}
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                className="w-full h-[102px] overflow-hidden p-6 pb-14 bg-[#FFFFFF]/25 border-2 border-dashed border-[#EAEAEA] rounded-[24px] text-[14px] outline-none focus:border-[#D1D5DB] transition-colors resize-none placeholder:text-[#303030]/60"
                value={formData.additionalInstructions}
                onChange={(e) => updateFormData({ additionalInstructions: e.target.value })}
              />
              <button className="absolute right-5 bottom-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#F0F0F0]/20 hover:bg-[#D1D5DB] transition-colors text-[#303030]">
                <Mic size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-8 left-[340px] right-12 z-20 pointer-events-none">
        <div className="max-w-[900px] mx-auto w-full px-8 flex justify-between pointer-events-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-white border border-[#EAEAEA] hover:bg-[#F9FAFB] text-[#303030] px-6 py-3.5 rounded-full text-[14px] font-bold transition-colors shadow-sm"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-[#303030] hover:bg-black text-white px-8 py-3.5 rounded-full text-[14px] font-bold transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            Next
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
