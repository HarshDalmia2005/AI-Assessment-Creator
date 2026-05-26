import type {
  AssignmentFormValues,
  Difficulty,
  FormErrors,
  GeneratedPaper,
  GeneratedQuestion,
  GeneratedSection,
  StructuredPrompt,
} from "@/types/assessment";

const difficulties: Difficulty[] = ["Easy", "Moderate", "Hard"];

function toISODate(dateString: string): string {
  return new Date(dateString).toISOString().slice(0, 10);
}

export function validateAssignmentForm(values: AssignmentFormValues): FormErrors {
  const errors: FormErrors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!values.title.trim()) {
    errors.title = "Assignment title is required.";
  }

  if (!values.dueDate) {
    errors.dueDate = "Due date is required.";
  } else {
    const dueDate = new Date(values.dueDate);
    if (Number.isNaN(dueDate.getTime()) || dueDate < today) {
      errors.dueDate = "Due date must be today or later.";
    }
  }

  if (!values.questionTypes.length) {
    errors.questionTypes = "Select at least one question type.";
  }

  if (!Number.isInteger(values.questionCount) || values.questionCount <= 0) {
    errors.questionCount = "Number of questions must be a positive integer.";
  }

  if (!Number.isFinite(values.marksPerQuestion) || values.marksPerQuestion <= 0) {
    errors.marksPerQuestion = "Marks per question must be a positive number.";
  }

  if (!values.additionalInstructions.trim()) {
    errors.additionalInstructions = "Additional instructions are required.";
  }

  if (values.sourceFile) {
    const isValidType = ["application/pdf", "text/plain"].includes(values.sourceFile.type);
    if (!isValidType) {
      errors.sourceFile = "Only PDF or text files are allowed.";
    }
  }

  return errors;
}

export function buildStructuredPrompt(values: AssignmentFormValues): StructuredPrompt {
  return {
    assignmentTitle: values.title.trim(),
    dueDate: toISODate(values.dueDate),
    questionTypes: values.questionTypes,
    questionCount: values.questionCount,
    marksPerQuestion: values.marksPerQuestion,
    additionalInstructions: values.additionalInstructions.trim(),
    sourceFileName: values.sourceFile?.name,
  };
}

function buildPromptPreview(prompt: StructuredPrompt): string {
  return JSON.stringify(
    {
      task: "Generate an exam paper",
      format: {
        sections: true,
        questionText: true,
        difficulty: ["Easy", "Moderate", "Hard"],
        marks: true,
      },
      input: prompt,
      constraints: ["No raw model output", "Return valid structured JSON only"],
    },
    null,
    2,
  );
}

function toQuestionText(type: string, index: number, instruction: string): string {
  switch (type) {
    case "MCQ":
      return `(${index}) Choose the most appropriate answer based on: ${instruction}`;
    case "True/False":
      return `(${index}) Mark the statement as true or false and justify briefly.`;
    case "Case Study":
      return `(${index}) Analyze the case and answer with clear reasoning.`;
    case "Long Answer":
      return `(${index}) Provide a detailed response with relevant examples.`;
    default:
      return `(${index}) Answer briefly and clearly based on the topic.`;
  }
}

function splitIntoSections(questionCount: number): number[] {
  if (questionCount <= 5) return [questionCount];
  const sectionA = Math.ceil(questionCount / 2);
  return [sectionA, questionCount - sectionA];
}

export function generateQuestionPaper(values: AssignmentFormValues): {
  paper: GeneratedPaper;
  promptPreview: string;
} {
  const structuredPrompt = buildStructuredPrompt(values);
  const sectionSizes = splitIntoSections(structuredPrompt.questionCount);

  let globalIndex = 1;
  const sections: GeneratedSection[] = sectionSizes
    .filter((size) => size > 0)
    .map((size, sectionIndex) => {
      const questions: GeneratedQuestion[] = Array.from({ length: size }).map((_, index) => {
        const type =
          structuredPrompt.questionTypes[(globalIndex - 1) % structuredPrompt.questionTypes.length];
        const difficulty = difficulties[(globalIndex - 1) % difficulties.length];
        const question = {
          id: `q-${sectionIndex + 1}-${index + 1}`,
          text: toQuestionText(type, globalIndex, structuredPrompt.additionalInstructions),
          difficulty,
          marks: structuredPrompt.marksPerQuestion,
        };
        globalIndex += 1;
        return question;
      });

      return {
        id: `section-${sectionIndex + 1}`,
        title: `Section ${String.fromCharCode(65 + sectionIndex)}`,
        instruction: sectionIndex === 0 ? "Attempt all questions" : "Answer any three questions",
        questions,
      };
    });

  const totalMarks = sections.reduce(
    (sum, section) => sum + section.questions.reduce((acc, question) => acc + question.marks, 0),
    0,
  );

  return {
    paper: {
      title: structuredPrompt.assignmentTitle,
      sections,
      totalMarks,
    },
    promptPreview: buildPromptPreview(structuredPrompt),
  };
}
