export type Difficulty = "Easy" | "Moderate" | "Hard";

export type QuestionType =
  | "Short Answer"
  | "Long Answer"
  | "MCQ"
  | "True/False"
  | "Case Study";

export interface AssignmentFormValues {
  title: string;
  dueDate: string;
  questionTypes: QuestionType[];
  questionCount: number;
  marksPerQuestion: number;
  additionalInstructions: string;
  sourceFile: File | null;
}

export interface FormErrors {
  title?: string;
  dueDate?: string;
  questionTypes?: string;
  questionCount?: string;
  marksPerQuestion?: string;
  additionalInstructions?: string;
  sourceFile?: string;
}

export interface StructuredPrompt {
  assignmentTitle: string;
  dueDate: string;
  questionTypes: QuestionType[];
  questionCount: number;
  marksPerQuestion: number;
  additionalInstructions: string;
  sourceFileName?: string;
}

export interface GeneratedQuestion {
  id: string;
  text: string;
  difficulty: Difficulty;
  marks: number;
}

export interface GeneratedSection {
  id: string;
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
  title: string;
  sections: GeneratedSection[];
  totalMarks: number;
}

export type SocketStatus = "disconnected" | "connecting" | "connected";
export type GenerationStatus = "idle" | "queued" | "generating" | "completed" | "error";
