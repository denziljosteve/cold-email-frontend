import { User } from "lucide-react";
import type { CandidateProfile } from "../types/careerCoach";
import { CardShell, Field, Toggle } from "./Field";

interface CandidateProfileFormProps {
  value: CandidateProfile;
  onChange: (update: Partial<CandidateProfile>) => void;
}

export function CandidateProfileForm({ value, onChange }: CandidateProfileFormProps) {
  return (
    <CardShell id="card-candidate" icon={<User size={16} />} title="Candidate Profile">
      <Toggle
        id="candidate-include-contact"
        label="Include candidate contact information in output"
        checked={value.includeContactInfo}
        onChange={(v) => onChange({ includeContactInfo: v })}
      />
      <div className="cr-grid-2">
        <Field label="Candidate full name" htmlFor="candidate-name">
          <input
            id="candidate-name"
            className="cr-input"
            value={value.fullName}
            placeholder="Optional if present in resume"
            onChange={(e) => onChange({ fullName: e.target.value })}
          />
        </Field>
        <Field label="Candidate email" htmlFor="candidate-email">
          <input
            id="candidate-email"
            type="email"
            className="cr-input"
            value={value.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </Field>
        <Field label="Candidate phone" htmlFor="candidate-phone">
          <input
            id="candidate-phone"
            className="cr-input"
            value={value.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </Field>
        <Field label="Candidate LinkedIn URL" htmlFor="candidate-linkedin">
          <input
            id="candidate-linkedin"
            className="cr-input"
            value={value.linkedinUrl}
            onChange={(e) => onChange({ linkedinUrl: e.target.value })}
          />
        </Field>
        <Field label="Candidate portfolio URL" htmlFor="candidate-portfolio">
          <input
            id="candidate-portfolio"
            className="cr-input"
            value={value.portfolioUrl}
            onChange={(e) => onChange({ portfolioUrl: e.target.value })}
          />
        </Field>
        <Field label="Candidate GitHub URL" htmlFor="candidate-github">
          <input
            id="candidate-github"
            className="cr-input"
            value={value.githubUrl}
            onChange={(e) => onChange({ githubUrl: e.target.value })}
          />
        </Field>
        <Field label="Current location/country" htmlFor="candidate-location">
          <input
            id="candidate-location"
            className="cr-input"
            value={value.location}
            onChange={(e) => onChange({ location: e.target.value })}
          />
        </Field>
        <Field label="Preferred job market" htmlFor="candidate-market">
          <input
            id="candidate-market"
            className="cr-input"
            value={value.jobMarket}
            placeholder="e.g. Remote (EU/US time zones)"
            onChange={(e) => onChange({ jobMarket: e.target.value })}
          />
        </Field>
        <Field label="Target role or job title" htmlFor="candidate-target">
          <input
            id="candidate-target"
            className="cr-input"
            value={value.targetRole}
            onChange={(e) => onChange({ targetRole: e.target.value })}
          />
        </Field>
      </div>
      <Field
        label="Additional achievements or context"
        htmlFor="candidate-achievements"
        hint="Awards, publications, talks, certifications — anything that strengthens the case."
      >
        <textarea
          id="candidate-achievements"
          className="cr-textarea"
          rows={3}
          value={value.achievements}
          onChange={(e) => onChange({ achievements: e.target.value })}
        />
      </Field>
    </CardShell>
  );
}
