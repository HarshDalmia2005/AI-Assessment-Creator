"use client";

import styles from "./page.module.css";
import { useAssignmentStore } from "@/store/assignmentStore";
import { generateQuestionPaper, validateAssignmentForm } from "@/lib/questionGenerator";
import { useGenerationSocket } from "@/hooks/useGenerationSocket";
import type { Difficulty, QuestionType } from "@/types/assessment";

const QUESTION_TYPES: QuestionType[] = [
  "Short Answer",
  "Long Answer",
  "MCQ",
  "True/False",
  "Case Study",
];

const difficultyClassMap: Record<Difficulty, string> = {
  Easy: styles.easy,
  Moderate: styles.moderate,
  Hard: styles.hard,
};

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  useGenerationSocket();

  const {
    formValues,
    formErrors,
    generatedPaper,
    structuredPromptPreview,
    generationStatus,
    socketStatus,
    setField,
    toggleQuestionType,
    setErrors,
    setGenerationStatus,
    setGenerationResult,
    clearGeneration,
  } = useAssignmentStore();

  const handleGenerate = () => {
    const errors = validateAssignmentForm(formValues);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setGenerationStatus("error");
      return;
    }

    setErrors({});
    setGenerationStatus("queued");

    window.setTimeout(() => {
      setGenerationStatus("generating");
      window.setTimeout(() => {
        const { paper, promptPreview } = generateQuestionPaper(formValues);
        setGenerationResult(paper, promptPreview);
      }, 700);
    }, 400);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>AI Assessment Creator</h1>
        <p>Create assignments and generate a clean, structured question paper.</p>
      </header>

      <main className={styles.grid}>
        <section className={styles.card}>
          <h2>Assignment Creation</h2>

          <label className={styles.label} htmlFor="title">
            Assignment title
          </label>
          <input
            id="title"
            className={styles.input}
            value={formValues.title}
            onChange={(event) => setField("title", event.target.value)}
            placeholder="e.g. Mid-Term Science Assessment"
          />
          {formErrors.title ? <p className={styles.error}>{formErrors.title}</p> : null}

          <label className={styles.label} htmlFor="sourceFile">
            Source file (optional)
          </label>
          <input
            id="sourceFile"
            type="file"
            className={styles.input}
            accept=".pdf,.txt,application/pdf,text/plain"
            onChange={(event) => setField("sourceFile", event.target.files?.[0] ?? null)}
          />
          {formErrors.sourceFile ? <p className={styles.error}>{formErrors.sourceFile}</p> : null}

          <label className={styles.label} htmlFor="dueDate">
            Due date
          </label>
          <input
            id="dueDate"
            type="date"
            className={styles.input}
            min={getTodayDate()}
            value={formValues.dueDate}
            onChange={(event) => setField("dueDate", event.target.value)}
          />
          {formErrors.dueDate ? <p className={styles.error}>{formErrors.dueDate}</p> : null}

          <fieldset className={styles.fieldset}>
            <legend>Question types</legend>
            <div className={styles.options}>
              {QUESTION_TYPES.map((type) => (
                <label key={type} className={styles.checkboxOption}>
                  <input
                    type="checkbox"
                    checked={formValues.questionTypes.includes(type)}
                    onChange={() => toggleQuestionType(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
            {formErrors.questionTypes ? <p className={styles.error}>{formErrors.questionTypes}</p> : null}
          </fieldset>

          <div className={styles.inlineFields}>
            <div>
              <label className={styles.label} htmlFor="questionCount">
                Number of questions
              </label>
              <input
                id="questionCount"
                className={styles.input}
                type="number"
                min={1}
                value={formValues.questionCount}
                onChange={(event) => setField("questionCount", Number(event.target.value))}
              />
              {formErrors.questionCount ? <p className={styles.error}>{formErrors.questionCount}</p> : null}
            </div>

            <div>
              <label className={styles.label} htmlFor="marksPerQuestion">
                Marks per question
              </label>
              <input
                id="marksPerQuestion"
                className={styles.input}
                type="number"
                min={1}
                value={formValues.marksPerQuestion}
                onChange={(event) => setField("marksPerQuestion", Number(event.target.value))}
              />
              {formErrors.marksPerQuestion ? (
                <p className={styles.error}>{formErrors.marksPerQuestion}</p>
              ) : null}
            </div>
          </div>

          <label className={styles.label} htmlFor="instructions">
            Additional instructions
          </label>
          <textarea
            id="instructions"
            className={styles.textarea}
            value={formValues.additionalInstructions}
            onChange={(event) => setField("additionalInstructions", event.target.value)}
            placeholder="Mention chapter limits, pedagogy style, or constraints."
            rows={4}
          />
          {formErrors.additionalInstructions ? (
            <p className={styles.error}>{formErrors.additionalInstructions}</p>
          ) : null}

          <div className={styles.metaBar}>
            <span>Socket: {socketStatus}</span>
            <span>Status: {generationStatus}</span>
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryButton} type="button" onClick={handleGenerate}>
              Generate Question Paper
            </button>
            <button className={styles.secondaryButton} type="button" onClick={clearGeneration}>
              Reset
            </button>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.outputHeader}>
            <h2>Generated Output</h2>
            {generatedPaper ? (
              <button className={styles.regenButton} type="button" onClick={handleGenerate}>
                Regenerate
              </button>
            ) : null}
          </div>

          {!generatedPaper ? (
            <p className={styles.placeholder}>
              Fill the form and generate to preview a structured exam paper.
            </p>
          ) : (
            <article className={styles.paper}>
              <header className={styles.paperHeader}>
                <h3>{generatedPaper.title}</h3>
                <p>Total Marks: {generatedPaper.totalMarks}</p>
              </header>

              <section className={styles.studentInfo}>
                <h4>Student Information</h4>
                <div className={styles.studentGrid}>
                  <label>
                    Name
                    <input className={styles.lineInput} />
                  </label>
                  <label>
                    Roll Number
                    <input className={styles.lineInput} />
                  </label>
                  <label>
                    Section
                    <input className={styles.lineInput} />
                  </label>
                </div>
              </section>

              {generatedPaper.sections.map((section) => (
                <section key={section.id} className={styles.sectionBlock}>
                  <h4>{section.title}</h4>
                  <p className={styles.sectionInstruction}>{section.instruction}</p>
                  <ol>
                    {section.questions.map((question) => (
                      <li key={question.id} className={styles.questionRow}>
                        <span>{question.text}</span>
                        <div className={styles.badges}>
                          <span className={`${styles.badge} ${difficultyClassMap[question.difficulty]}`}>
                            {question.difficulty}
                          </span>
                          <span className={styles.marks}>{question.marks} marks</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </article>
          )}

          {structuredPromptPreview ? (
            <details className={styles.promptBox}>
              <summary>Structured prompt preview</summary>
              <pre>{structuredPromptPreview}</pre>
            </details>
          ) : null}
        </section>
      </main>
    </div>
  );
}
