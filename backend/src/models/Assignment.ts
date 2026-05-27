import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  id: string;
  text: string;
  marks: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
}

export interface IAssignment extends Document {
  title: string;
  dueDate: string;
  additionalInstructions: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  questionTypes: Array<{
    id: string;
    type: string;
    count: number;
    marks: number;
  }>;
  generatedPaper?: {
    questions: IQuestion[];
    answers: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    dueDate: { type: String, required: true },
    additionalInstructions: { type: String, default: '' },
    status: { 
      type: String, 
      enum: ['pending', 'generating', 'completed', 'failed'], 
      default: 'pending' 
    },
    questionTypes: [
      {
        id: { type: String, required: true },
        type: { type: String, required: true },
        count: { type: Number, required: true },
        marks: { type: Number, required: true },
      }
    ],
    generatedPaper: {
      questions: [
        {
          id: { type: String, required: true },
          text: { type: String, required: true },
          marks: { type: Number, required: true },
          difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], required: true },
        }
      ],
      answers: [{ type: String }]
    }
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
