// Example conditional rules for simulated AI
export function getNextStep(
  currentStep: number,
  answers: Record<string, string>
) {
  // Example: if user is beginner, ask additional question
  if (answers["experience"] === "beginner" && currentStep === 1) {
    return {
      question: "Would you like beginner-friendly jobs?",
      key: "beginnerPref",
    };
  }
  return null;
}
