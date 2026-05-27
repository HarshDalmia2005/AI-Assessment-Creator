"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreVertical } from "lucide-react";
import Image from "next/image";



export default function AssignmentsPage() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  } | null>(null);

  React.useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    fetch(`${backendUrl}/api/assignments`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setAssignments(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Assignment",
      message: "Are you sure you want to delete this assignment? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
          const res = await fetch(`${backendUrl}/api/assignments/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success) {
            setAssignments((prev) => prev.filter((a) => a._id !== id));
            setOpenDropdown(null);
            setModalConfig(null);
          } else {
            setModalConfig({
              isOpen: true,
              title: "Error",
              message: "Failed to delete assignment",
            });
          }
        } catch (error) {
          console.error(error);
          setModalConfig({
            isOpen: true,
            title: "Error",
            message: "An error occurred while deleting the assignment",
          });
        }
      }
    });
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = (assignment.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === "all" || assignment.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full rounded-none md:rounded-[24px] overflow-hidden relative">
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A1A1A] mb-4"></div>
          <p className="text-[#303030] font-medium">Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-4">
          <Image
            src={"/Illustrations.png"}
            alt=""
            width={300}
            height={300}
            className="w-[220px] md:w-[300px] h-auto"
          />

          <h3 className="text-[18px] md:text-[20px] font-bold text-[#1A1A1A] mb-2 mt-4">
            No assignments yet
          </h3>
          <p className="text-[#6B7280] text-[14px] md:text-[16px] mb-8 leading-relaxed max-w-[380px]">
            Create your first assignment to start collecting and grading student
            submissions. You can set up rubrics, define marking criteria, and
            let AI assist with grading.
          </p>
          <Link
            href="/assignments/create"
            className="font-bricolage flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full transition-colors text-[14px]"
          >
            <Plus size={20} strokeWidth={2.5} />
            Create Your First Assignment
          </Link>

          {/* Mobile FAB */}
          <Link
            href="/assignments/create"
            className="md:hidden fixed bottom-24 right-5 z-40 w-12 h-12 bg-[#F36B24] hover:bg-[#E05D1A] rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            <Plus size={22} className="text-white" strokeWidth={2.5} />
          </Link>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 md:p-8 md:pb-32">
            {/* Header Section - mobile: shows "Assignments" title with back arrow */}
            <div className="md:hidden mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-[18px] font-bold text-[#1A1A1A] font-bricolage">
                  Assignments
                </h1>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex items-center gap-4 mb-8">
              <div className="w-[12px] h-[12px] rounded-full bg-[#4BC26D] ring-4 ring-[#22C55E]/20"></div>
              <div>
                <h1 className="text-[20px] font-bold text-[#1A1A1A] font-bricolage leading-none mb-1">
                  Assignments
                </h1>
                <p className="text-[#5E5E5E]/55 text-[14px]">
                  Manage and create assignments for your classes
                </p>
              </div>
            </div>

            {/* Action Bar - responsive */}
            <div className="bg-white rounded-[16px] md:rounded-[24px] p-2 md:p-3 flex items-center justify-between mb-4 md:mb-8 shadow-sm gap-2">
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-3 md:px-4 text-[#A9A9A9] hover:text-[#303030] transition-colors"
                >
                  <Filter size={16} className="md:w-5 md:h-5" />
                  <span className="text-[12px] md:text-[14px] capitalize">
                    {statusFilter === "all" ? "Filter" : statusFilter}
                  </span>
                </button>
                
                {isFilterOpen && (
                  <div className="absolute left-0 top-10 bg-white rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#F3F4F6] p-1.5 z-10 w-[140px]">
                    {["all", "completed", "pending", "generating", "failed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-[13px] font-medium rounded-[8px] mb-0.5 capitalize ${
                          statusFilter === status 
                            ? "bg-[#F3F4F6] text-[#1A1A1A]" 
                            : "text-[#5E5E5E] hover:bg-[#F9FAFB]"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative flex-1 md:flex-none md:w-[400px]">
                <Search
                  className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#A9A9A9]"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 md:pl-12 pr-4 py-2.5 md:py-3 border border-[#000000]/20 rounded-full text-[12px] md:text-[14px] outline-none placeholder:text-[#A9A9A9] placeholder:font-bricolage placeholder:font-bold"
                />
              </div>
            </div>

            {/* Assignments - single column on mobile, 2 cols on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              {filteredAssignments.length === 0 ? (
                <div className="col-span-full py-12 text-center text-[#A9A9A9] text-[14px]">
                  No assignments match your search or filter.
                </div>
              ) : (
                filteredAssignments.map((assignment) => (
                  <div
                  key={assignment._id}
                  className="bg-white rounded-[16px] md:rounded-[32px] p-4 md:p-8 relative shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4 md:mb-16">
                    <h3 className="font-bold text-[#303030] text-[16px] md:text-[24px] font-bricolage">
                      {assignment.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[12px] font-bold px-2 py-1 rounded-md ${
                          assignment.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : assignment.status === "generating"
                              ? "bg-blue-100 text-blue-700"
                              : assignment.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {assignment.status}
                      </span>
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === assignment._id
                              ? null
                              : assignment._id,
                          )
                        }
                        className="text-[#A9A9A9] hover:text-[#303030] p-1 md:p-2 rounded-full hover:bg-[#F3F4F6] transition-colors"
                      >
                        <MoreVertical size={20} className="md:w-6 md:h-6" />
                      </button>
                    </div>

                    {openDropdown === assignment._id && (
                      <div className="absolute right-4 md:right-8 top-12 md:top-16 bg-white rounded-[12px] md:rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#F3F4F6] p-1.5 md:p-2 z-10 w-[160px] md:w-[180px]">
                        <Link
                          href={`/assignments/output?id=${assignment._id}`}
                          className="block w-full text-left px-3 md:px-4 py-2 md:py-2.5 text-[13px] md:text-[14px] font-medium text-[#1A1A1A] hover:bg-[#F9FAFB] rounded-[8px] md:rounded-[10px] mb-0.5"
                        >
                          View Assignment
                        </Link>
                        <button 
                          onClick={() => handleDelete(assignment._id)}
                          className="w-full text-left px-3 md:px-4 py-2 md:py-2.5 text-[13px] md:text-[14px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] rounded-[8px] md:rounded-[10px]"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[12px] md:text-[16px]">
                    <div>
                      <span className="font-bold text-[#303030]">
                        Assigned on :{" "}
                      </span>
                      <span className="text-[#000000]/50">
                        {new Date(assignment.createdAt)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-[#303030]">Due : </span>
                      <span className="text-[#000000]/50">
                        {assignment.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Blur Effect */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[80px] md:h-[100px] pointer-events-none z-10 bg-linear-to-b from-transparent to-[#DADADA]/50 backdrop-blur-xl"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 100%)",
            }}
          ></div>

          {/* Floating Create Button - Desktop */}
          <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <Link
              href="/assignments/create"
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-8 py-4 rounded-[100px] transition-all text-[15px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] font-inter tracking-wide"
            >
              <Plus size={20} strokeWidth={2} />
              Create Assignment
            </Link>
          </div>

          {/* Mobile FAB */}
          <Link
            href="/assignments/create"
            className="md:hidden fixed bottom-24 right-5 z-40 w-12 h-12 bg-[#F36B24] hover:bg-[#E05D1A] rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            <Plus size={22} className="text-white" strokeWidth={2.5} />
          </Link>
        </>
      )}

      {/* Confirmation Modal */}
      {modalConfig?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] p-6 md:p-8 w-full max-w-[400px] shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-[18px] md:text-[20px] font-bold text-[#303030] mb-2">
              {modalConfig.title}
            </h3>
            <p className="text-[14px] text-[#5E5E5E] mb-6 leading-relaxed">
              {modalConfig.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalConfig(null)}
                className="bg-gray-100 text-[#303030] px-6 py-2 rounded-full font-bold text-[14px] hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              {modalConfig.onConfirm && (
                <button
                  onClick={modalConfig.onConfirm}
                  className="bg-[#EF4444] text-white px-6 py-2 rounded-full font-bold text-[14px] hover:bg-red-600 transition-colors"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
