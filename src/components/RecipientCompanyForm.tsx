import { Building2 } from "lucide-react";
import type { RecipientCompany, ValidationIssue } from "../types/careerCoach";
import { CardShell, Field } from "./Field";

interface RecipientCompanyFormProps {
  value: RecipientCompany;
  onChange: (update: Partial<RecipientCompany>) => void;
  errors: ValidationIssue[];
}

export function RecipientCompanyForm({ value, onChange, errors }: RecipientCompanyFormProps) {
  const err = (f: string) => errors.find((i) => i.field === f)?.message;
  const requiredCount = errors.length;

  return (
    <CardShell
      id="card-recipient"
      icon={<Building2 size={16} />}
      title="Recipient & Company"
      requiredCount={requiredCount}
    >
      <div className="cr-grid-2">
        <Field label="Contact full name" htmlFor="recipient-name" required error={err("recipient.fullName")}>
          <input
            id="recipient-name"
            className="cr-input"
            value={value.fullName}
            placeholder="e.g. Jane Doe"
            onChange={(e) => onChange({ fullName: e.target.value })}
          />
        </Field>
        <Field label="Current position/title" htmlFor="recipient-title" required error={err("recipient.title")}>
          <input
            id="recipient-title"
            className="cr-input"
            value={value.title}
            placeholder="e.g. Engineering Manager"
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </Field>
        <Field label="Company name" htmlFor="recipient-company" required error={err("recipient.company")}>
          <input
            id="recipient-company"
            className="cr-input"
            value={value.company}
            placeholder="e.g. Acme Corp"
            onChange={(e) => onChange({ company: e.target.value })}
          />
        </Field>
        <Field label="Contact email address" htmlFor="recipient-email" required error={err("recipient.email")}>
          <input
            id="recipient-email"
            type="email"
            className="cr-input"
            value={value.email}
            placeholder="jane@acme.com"
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </Field>
        <Field label="Recipient LinkedIn URL" htmlFor="recipient-linkedin">
          <input
            id="recipient-linkedin"
            className="cr-input"
            value={value.linkedinUrl}
            placeholder="https://linkedin.com/in/..."
            onChange={(e) => onChange({ linkedinUrl: e.target.value })}
          />
        </Field>
        <Field label="Company website URL" htmlFor="recipient-website">
          <input
            id="recipient-website"
            className="cr-input"
            value={value.companyWebsite}
            placeholder="https://acme.com"
            onChange={(e) => onChange({ companyWebsite: e.target.value })}
          />
        </Field>
        <Field label="Relevant team or department" htmlFor="recipient-department">
          <input
            id="recipient-department"
            className="cr-input"
            value={value.department}
            placeholder="e.g. Platform Infrastructure"
            onChange={(e) => onChange({ department: e.target.value })}
          />
        </Field>
      </div>
      <Field
        label="Known recipient background or profile notes"
        htmlFor="recipient-background"
        hint="Only include what you actually know — this becomes a verified fact for personalization."
      >
        <textarea
          id="recipient-background"
          className="cr-textarea"
          rows={3}
          value={value.backgroundNotes}
          onChange={(e) => onChange({ backgroundNotes: e.target.value })}
        />
      </Field>
    </CardShell>
  );
}
