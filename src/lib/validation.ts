import type {
  FormState,
  ValidationIssue,
} from "../types/careerCoach";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Required-field validation. Only genuinely required inputs are checked. */
export function validateForm(state: FormState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const { recipient, resume } = state;

  if (!recipient.fullName.trim()) {
    issues.push({
      field: "recipient.fullName",
      label: "Contact full name",
      message: "Enter the recipient's full name.",
    });
  }
  if (!recipient.title.trim()) {
    issues.push({
      field: "recipient.title",
      label: "Current position/title",
      message: "Enter the recipient's current title.",
    });
  }
  if (!recipient.company.trim()) {
    issues.push({
      field: "recipient.company",
      label: "Company name",
      message: "Enter the company name.",
    });
  }
  if (!recipient.email.trim()) {
    issues.push({
      field: "recipient.email",
      label: "Contact email address",
      message: "Enter a contact email address.",
    });
  } else if (!isValidEmail(recipient.email)) {
    issues.push({
      field: "recipient.email",
      label: "Contact email address",
      message: "Enter a valid email address (e.g. name@company.com).",
    });
  }
  if (!resume.text.trim()) {
    issues.push({
      field: "resume.text",
      label: "Resume content",
      message:
        "Add resume text — upload a PDF/DOCX/TXT or paste the content.",
    });
  }

  return issues;
}

export function isFormValid(state: FormState): boolean {
  return validateForm(state).length === 0;
}
