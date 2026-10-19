import { PlusSquare } from "lucide-react";
import type { AdditionalContext } from "../types/careerCoach";
import { CardShell, Field } from "./Field";

interface AdditionalContextCardProps {
  value: AdditionalContext;
  onChange: (update: Partial<AdditionalContext>) => void;
}

export function AdditionalContextCard({ value, onChange }: AdditionalContextCardProps) {
  return (
    <CardShell id="card-additional" icon={<PlusSquare size={16} />} title="Additional Context" defaultOpen={false}>
      <Field
        label="Previous outreach email or conversation"
        htmlFor="add-previous"
        hint="Include prior messages so the coach can follow up appropriately."
      >
        <textarea
          id="add-previous"
          className="cr-textarea"
          rows={3}
          value={value.previousOutreach}
          onChange={(e) => onChange({ previousOutreach: e.target.value })}
        />
      </Field>
      <Field label="Motivation for contacting the company" htmlFor="add-motivation">
        <textarea
          id="add-motivation"
          className="cr-textarea"
          rows={2}
          value={value.motivation}
          onChange={(e) => onChange({ motivation: e.target.value })}
        />
      </Field>
      <Field label="Strongest selling point" htmlFor="add-selling">
        <textarea
          id="add-selling"
          className="cr-textarea"
          rows={2}
          value={value.strongestSellingPoint}
          onChange={(e) => onChange({ strongestSellingPoint: e.target.value })}
        />
      </Field>
      <Field label="Particular concerns about the resume" htmlFor="add-concerns">
        <textarea
          id="add-concerns"
          className="cr-textarea"
          rows={2}
          value={value.resumeConcerns}
          onChange={(e) => onChange({ resumeConcerns: e.target.value })}
        />
      </Field>
      <Field label="Custom instructions" htmlFor="add-custom">
        <textarea
          id="add-custom"
          className="cr-textarea"
          rows={2}
          value={value.customInstructions}
          onChange={(e) => onChange({ customInstructions: e.target.value })}
        />
      </Field>
      <Field label="Any additional information relevant to the opportunity" htmlFor="add-anything">
        <textarea
          id="add-anything"
          className="cr-textarea"
          rows={2}
          value={value.anythingElse}
          onChange={(e) => onChange({ anythingElse: e.target.value })}
        />
      </Field>
    </CardShell>
  );
}
