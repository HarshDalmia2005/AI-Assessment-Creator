'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import Image from 'next/image';

const dummyAssignments = [
  { id: 1, title: 'Quiz on Electricity', assignedOn: '20-06-2025', dueDate: '21-06-2025' },
  { id: 2, title: 'Quiz on Electricity', assignedOn: '20-06-2025', dueDate: '21-06-2025' },
  { id: 3, title: 'Quiz on Electricity', assignedOn: '20-06-2025', dueDate: '21-06-2025' },
  { id: 4, title: 'Quiz on Electricity', assignedOn: '20-06-2025', dueDate: '21-06-2025' },
  { id: 5, title: 'Quiz on Electricity', assignedOn: '20-06-2025', dueDate: '21-06-2025' },
  { id: 6, title: 'Quiz on Electricity', assignedOn: '20-06-2025', dueDate: '21-06-2025' },
];

export default function AssignmentsPage() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(0);

  return (
    <div className="flex flex-col h-full rounded-[24px] overflow-hidden relative">
      {dummyAssignments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <Image src={"/Illustrations.png"} alt="" width={300} height={300} />

          <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-2 mt-4">No assignments yet</h3>
          <p className="text-[#6B7280] text-[16px] mb-8 leading-relaxed max-w-[380px]">
            Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
          </p>
          <Link
            href="/assignments/create"
            className="font-bricolage flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full transition-colors text-[14px]"
          >
            <Plus size={20} strokeWidth={2.5} />
            Create Your First Assignment
          </Link>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-8 pb-32">
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-[12px] h-[12px] rounded-full bg-[#4BC26D] ring-4 ring-[#22C55E]/20"></div>
              <div>
                <h1 className="text-[20px] font-bold text-[#1A1A1A] font-bricolage leading-none mb-1">Assignments</h1>
                <p className="text-[#5E5E5E]/55 text-[14px]">Manage and create assignments for your classes</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-[24px] p-3 flex items-center justify-between mb-8 shadow-sm">
              <div className="flex items-center gap-2 px-4 text-[#A9A9A9]">
                <Filter size={20} />
                <span className="text-[14px]">Filter By</span>
              </div>
              <div className="relative w-[400px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A9A9A9]" size={20} />
                <input
                  type="text"
                  placeholder="Search Assignment"
                  className="w-full pl-12 pr-4 py-3 border border-[#000000]/20 rounded-full text-[14px] outline-none placeholder:text-[#A9A9A9] placeholder:font-bricolage placeholder:font-bold placeholder:align-middle"
                />
              </div>
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-2 gap-6">
              {dummyAssignments.map(assignment => (
                <div key={assignment.id} className="bg-white rounded-[32px] p-8 relative shadow-sm">
                  <div className="flex justify-between items-start mb-16">
                    <h3 className="font-bold text-[#303030] text-[24px] font-bricolage">
                      <span className="decoration-2 underline-offset-4">Quiz</span> on Electricity
                    </h3>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === assignment.id ? null : assignment.id)}
                      className="text-[#A9A9A9] hover:text-[#303030] p-2 rounded-full hover:bg-[#F3F4F6] transition-colors"
                    >
                      <MoreVertical size={24} />
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === assignment.id && (
                      <div className="absolute right-8 top-16 bg-white rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#F3F4F6] p-2 z-10 w-[180px]">
                        <button className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-[#1A1A1A] hover:bg-[#F9FAFB] rounded-[10px] mb-1">
                          View Assignment
                        </button>
                        <button className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] rounded-[10px]">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[16px]">
                    <div>
                      <span className="font-bold text-[#303030]">Assigned on : </span>
                      <span className="text-[#000000]/50">{assignment.assignedOn}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#303030]">Due : </span>
                      <span className="text-[#000000]/50">{assignment.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Blur Effect */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] pointer-events-none z-10 bg-linear-to-b from-transparent to-[#DADADA]/50 backdrop-blur-xl"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)'
            }}
          ></div>

          {/* Floating Create Button */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <Link
              href="/assignments/create"
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-8 py-4 rounded-[100px] transition-all text-[15px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] font-inter tracking-wide"
            >
              <Plus size={20} strokeWidth={2} />
              Create Assignment
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
