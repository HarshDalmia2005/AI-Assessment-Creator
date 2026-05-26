import { create } from "zustand";
import type {
  AssignmentFormValues,
  FormErrors,
  GeneratedPaper,
  GenerationStatus,
  QuestionType,
  SocketStatus,
} from "@/types/assessment";

const initialFormValues: AssignmentFormValues = {
  title: "",
  dueDate: "",
  questionTypes: [],
  questionCount: 5,
  marksPerQuestion: 2,
  additionalInstructions: "",
  sourceFile: null,
};

interface AssignmentStore {
  formValues: AssignmentFormValues;
  formErrors: FormErrors;
  generatedPaper: GeneratedPaper | null;
  structuredPromptPreview: string;
  generationStatus: GenerationStatus;
  socketStatus: SocketStatus;
  setField: <K extends keyof AssignmentFormValues>(
    field: K,
    value: AssignmentFormValues[K],
  ) => void;
  toggleQuestionType: (questionType: QuestionType) => void;
  setErrors: (errors: FormErrors) => void;
  setSocketStatus: (status: SocketStatus) => void;
  setGenerationStatus: (status: GenerationStatus) => void;
  setGenerationResult: (paper: GeneratedPaper, promptPreview: string) => void;
  clearGeneration: () => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  formValues: initialFormValues,
  formErrors: {},
  generatedPaper: null,
  structuredPromptPreview: "",
  generationStatus: "idle",
  socketStatus: "disconnected",
  setField: (field, value) =>
    set((state) => ({
      formValues: {
        ...state.formValues,
        [field]: value,
      },
    })),
  toggleQuestionType: (questionType) =>
    set((state) => {
      const exists = state.formValues.questionTypes.includes(questionType);
      return {
        formValues: {
          ...state.formValues,
          questionTypes: exists
            ? state.formValues.questionTypes.filter((type) => type !== questionType)
            : [...state.formValues.questionTypes, questionType],
        },
      };
    }),
  setErrors: (errors) => set({ formErrors: errors }),
  setSocketStatus: (status) => set({ socketStatus: status }),
  setGenerationStatus: (status) => set({ generationStatus: status }),
  setGenerationResult: (paper, promptPreview) =>
    set({
      generatedPaper: paper,
      structuredPromptPreview: promptPreview,
      generationStatus: "completed",
      formErrors: {},
    }),
  clearGeneration: () =>
    set({
      generatedPaper: null,
      structuredPromptPreview: "",
      generationStatus: "idle",
    }),
}));
