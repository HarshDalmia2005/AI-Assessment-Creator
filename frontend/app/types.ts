export interface QuestionType {
  id: string;
  type: string;
  count: number;
  marks: number;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  subject: string;
  class: string;
  dueDate: string;
  createdDate: string;
  totalQuestions: number;
  totalMarks: number;
  questionTypes: QuestionType[];
  additionalInstructions?: string;
  fileUpload?: { name: string; url: string; type: 'pdf' | 'text' };
  schoolInfo: { name: string; sector?: string; city?: string };
  timeAllowed?: string;
  status?: 'draft' | 'published' | 'generating' | 'completed';
}

export interface Question {
  id: string;
  text: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: string;
}

export interface QuestionSection {
  id: string;
  title: string;
  instruction: string;
  questions: Question[];
}

export interface StudentInfo {
  name: string;
  rollNumber: string;
  class: string;
  section: string;
}

export interface FormState {
  file: File | null;
  dueDate: string;
  questionTypes: QuestionType[];
  additionalInstructions: string;
  errors: Record<string, string>;
}

export interface AssignmentFormData {
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  timeAllowed?: string;
  questionTypes: QuestionType[];
  additionalInstructions: string;
  file?: File;
  schoolName: string;
}
