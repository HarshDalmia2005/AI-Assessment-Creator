import { create } from "zustand";
import {
  QuestionType,
  AssignmentFormData,
  QuestionSection,
  StudentInfo,
} from "@/app/types";
import { v4 as uuidv4 } from "uuid";

interface AssessmentState {
  formData: AssignmentFormData;
  generatedSections: QuestionSection[] | null;
  studentInfo: StudentInfo | null;
  isGenerating: boolean;
  assignmentId: string | null;
  status: "pending" | "generating" | "completed" | "failed";
  generatedPaper: any | null;
  assignmentMeta: any | null;

  // Actions
  updateFormData: (data: Partial<AssignmentFormData>) => void;
  addQuestionType: (type?: string, count?: number, marks?: number) => void;
  updateQuestionType: (id: string, updates: Partial<QuestionType>) => void;
  removeQuestionType: (id: string) => void;
  setGeneratedSections: (sections: QuestionSection[]) => void;
  setStudentInfo: (info: StudentInfo) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setAssignmentData: (id: string, status: string, paper?: any) => void;
  submitAssignment: () => Promise<string | null>;
  fetchAssignment: (id: string) => Promise<void>;
  reset: () => void;
}

const initialFormData: AssignmentFormData = {
  title: "",
  subject: "",
  class: "",
  dueDate: "",
  timeAllowed: "45 minutes",
  questionTypes: [
    { id: "1", type: "Multiple Choice Questions", count: 4, marks: 1 },
    { id: "2", type: "Short Questions", count: 3, marks: 2 },
  ],
  additionalInstructions: "",
  schoolName: "Delhi Public School, Sector-4, Bokaro",
};

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  formData: initialFormData,
  generatedSections: null,
  studentInfo: null,
  isGenerating: false,
  assignmentId: null,
  status: "pending",
  generatedPaper: null,
  assignmentMeta: null,

  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  addQuestionType: (type = "Multiple Choice Questions", count = 1, marks = 1) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: [
          ...state.formData.questionTypes,
          { id: uuidv4(), type, count, marks },
        ],
      },
    })),

  updateQuestionType: (id, updates) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: state.formData.questionTypes.map((qt) =>
          qt.id === id ? { ...qt, ...updates } : qt,
        ),
      },
    })),

  removeQuestionType: (id) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: state.formData.questionTypes.filter(
          (qt) => qt.id !== id,
        ),
      },
    })),

  setGeneratedSections: (sections) => set({ generatedSections: sections }),
  setStudentInfo: (info) => set({ studentInfo: info }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setAssignmentData: (id, status, paper = null) =>
    set({
      assignmentId: id,
      status: status as any,
      generatedPaper: paper,
      isGenerating: status === "generating",
    }),

  submitAssignment: async () => {
    const { formData } = get();
    try {
      set({ isGenerating: true, status: "pending" });
      const res = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.assignmentId) {
        set({ assignmentId: data.assignmentId });
        return data.assignmentId;
      }
      set({ isGenerating: false, status: "failed" });
      return null;
    } catch (error) {
      console.error(error);
      set({ isGenerating: false, status: "failed" });
      return null;
    }
  },

  fetchAssignment: async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/assignments/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        set({
          assignmentId: data.data._id,
          status: data.data.status,
          generatedPaper: data.data.generatedPaper || null,
          assignmentMeta: data.data,
          isGenerating: data.data.status === "generating",
        });
      }
    } catch (error) {
      console.error(error);
    }
  },

  reset: () =>
    set({
      formData: initialFormData,
      generatedSections: null,
      studentInfo: null,
      isGenerating: false,
      assignmentId: null,
      status: "pending",
      generatedPaper: null,
      assignmentMeta: null,
    }),
}));
