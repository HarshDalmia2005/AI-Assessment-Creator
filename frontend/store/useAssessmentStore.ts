import { create } from 'zustand';
import { QuestionType, AssignmentFormData, QuestionSection, StudentInfo } from '@/app/types';
import { v4 as uuidv4 } from 'uuid';

interface AssessmentState {
  formData: AssignmentFormData;
  generatedSections: QuestionSection[] | null;
  studentInfo: StudentInfo | null;
  isGenerating: boolean;
  
  // Actions
  updateFormData: (data: Partial<AssignmentFormData>) => void;
  addQuestionType: (type?: string, count?: number, marks?: number) => void;
  updateQuestionType: (id: string, updates: Partial<QuestionType>) => void;
  removeQuestionType: (id: string) => void;
  setGeneratedSections: (sections: QuestionSection[]) => void;
  setStudentInfo: (info: StudentInfo) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  reset: () => void;
}

const initialFormData: AssignmentFormData = {
  title: '',
  subject: '',
  class: '',
  dueDate: '',
  timeAllowed: '45 minutes',
  questionTypes: [
    { id: '1', type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { id: '2', type: 'Short Questions', count: 3, marks: 2 }
  ],
  additionalInstructions: '',
  schoolName: 'Delhi Public School, Sector-4, Bokaro'
};

export const useAssessmentStore = create<AssessmentState>((set) => ({
  formData: initialFormData,
  generatedSections: null,
  studentInfo: null,
  isGenerating: false,

  updateFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),

  addQuestionType: (type = 'Multiple Choice Questions', count = 1, marks = 1) => set((state) => ({
    formData: {
      ...state.formData,
      questionTypes: [
        ...state.formData.questionTypes,
        { id: uuidv4(), type, count, marks }
      ]
    }
  })),

  updateQuestionType: (id, updates) => set((state) => ({
    formData: {
      ...state.formData,
      questionTypes: state.formData.questionTypes.map((qt) => 
        qt.id === id ? { ...qt, ...updates } : qt
      )
    }
  })),

  removeQuestionType: (id) => set((state) => ({
    formData: {
      ...state.formData,
      questionTypes: state.formData.questionTypes.filter((qt) => qt.id !== id)
    }
  })),

  setGeneratedSections: (sections) => set({ generatedSections: sections }),
  setStudentInfo: (info) => set({ studentInfo: info }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  reset: () => set({ 
    formData: initialFormData, 
    generatedSections: null, 
    studentInfo: null, 
    isGenerating: false 
  })
}));
