import { describe, it, expect } from "vitest";
import { buildPluginInput, buildPlainText } from "./promptBuilder";
import { buildJson } from "./jsonSchema";
import { createDefaultFormState } from "../config/defaultInstructions";

function filledState() {
  const s = createDefaultFormState();
  s.recipient.fullName = "Jane Doe";
  s.recipient.title = "Engineering Manager";
  s.recipient.company = "Acme Corp";
  s.recipient.email = "jane@acme.com";
  s.resume.text = "Senior engineer with 8 years experience in distributed systems.";
  return s;
}

describe("buildPlainText", () => {
  it("includes all nine numbered sections", () => {
    const out = buildPlainText(filledState());
    for (const heading of [
      "1. MASTER INSTRUCTIONS",
      "2. RECIPIENT & COMPANY",
      "3. CANDIDATE PROFILE",
      "4. RESUME",
      "5. TARGET OPPORTUNITY",
      "6. OUTREACH PREFERENCES",
      "7. RESEARCH & PERSONALIZATION",
      "8. ADDITIONAL CONTEXT",
      "9. REQUIRED OUTPUT",
    ]) {
      expect(out).toContain(heading);
    }
  });

  it("preserves the full resume text verbatim", () => {
    const s = filledState();
    const out = buildPlainText(s);
    expect(out).toContain(s.resume.text);
  });

  it("preserves a long resume without truncation", () => {
    const s = filledState();
    s.resume.text = "Line of experience. ".repeat(50000); // ~1M chars
    const out = buildPlainText(s);
    // normalize() trims only trailing whitespace; content is never truncated.
    expect(out).toContain(s.resume.text.trim());
    expect(out.length).toBeGreaterThan(1000000);
    expect(out).toContain("5. TARGET OPPORTUNITY");
  });

  it("labels missing optional fields as Not provided", () => {
    const out = buildPlainText(filledState());
    expect(out).toContain("LinkedIn URL: [Not provided]");
  });

  it("includes the master instructions when enabled", () => {
    const s = filledState();
    s.masterInstructions.text = "CUSTOM MASTER TEXT XYZ";
    s.masterInstructions.included = true;
    expect(buildPlainText(s)).toContain("CUSTOM MASTER TEXT XYZ");
  });

  it("omits master instructions from output when excluded but keeps them in form state", () => {
    const s = filledState();
    s.masterInstructions.text = "CUSTOM MASTER TEXT XYZ";
    s.masterInstructions.included = false;
    const out = buildPlainText(s);
    expect(out).not.toContain("CUSTOM MASTER TEXT XYZ");
    expect(out).toContain("Master instructions excluded");
    // Form state untouched:
    expect(s.masterInstructions.text).toBe("CUSTOM MASTER TEXT XYZ");
  });

  it("does not fabricate candidate contact details", () => {
    const s = filledState();
    s.candidate.email = "";
    s.candidate.phone = "";
    const out = buildPlainText(s);
    expect(out).toContain("Email: [Not provided]");
    expect(out).toContain("Phone: [Not provided]");
  });

  it("omits candidate contact info when the toggle is off", () => {
    const s = filledState();
    s.candidate.email = "candidate@example.com";
    s.candidate.phone = "555-0100";
    s.candidate.includeContactInfo = false;
    const out = buildPlainText(s);
    expect(out).not.toContain("candidate@example.com");
    expect(out).not.toContain("555-0100");
    expect(out).toContain("Omitted by user preference");
  });

  it("keeps candidate contact info when the toggle is on", () => {
    const s = filledState();
    s.candidate.email = "candidate@example.com";
    s.candidate.includeContactInfo = true;
    expect(buildPlainText(s)).toContain("candidate@example.com");
  });

  it("requires labeled inference when no job description is provided", () => {
    const s = filledState();
    s.opportunity.targetTitle = "";
    const out = buildPlainText(s);
    expect(out).toContain("[Not provided — assess fit against the target title only");
    expect(out).toContain("label any inferred expectations as inferred");
  });

  it("requires transparent disclosure in provided-information-only research mode", () => {
    const out = buildPlainText(filledState());
    expect(out).toContain("no live web research was performed");
    expect(out).toContain("Do not fabricate personalization");
  });

  it("handles unicode and special characters without mangling", () => {
    const s = filledState();
    s.recipient.fullName = "José Müller-Ødegård";
    s.resume.text = "Résumé — “quoted” & <tagged> ✅ emoji 🚀 经历";
    const out = buildPlainText(s);
    expect(out).toContain("José Müller-Ødegård");
    expect(out).toContain("Résumé — “quoted” & <tagged> ✅ emoji 🚀 经历");
  });

  it("mentions the fit rubric weights", () => {
    const out = buildPlainText(filledState());
    expect(out).toContain("Relevant experience and responsibilities: 30");
    expect(out).toContain("Evidenced skills and tools: 25");
    expect(out).toContain("Achievements and measurable impact: 20");
    expect(out).toContain("Industry/domain alignment: 15");
    expect(out).toContain("Relevant education and certifications: 10");
  });

  it("includes the full job description when provided", () => {
    const s = filledState();
    s.opportunity.jobDescription = "JD ".repeat(200000);
    const out = buildPlainText(s);
    expect(out).toContain(s.opportunity.jobDescription.trim());
    expect(out).toContain("6. OUTREACH PREFERENCES");
  });
});

describe("buildJson", () => {
  it("produces a parseable object with the expected top-level keys", () => {
    const json = buildJson(filledState());
    const parsed = JSON.parse(JSON.stringify(json));
    expect(parsed).toHaveProperty("recipient");
    expect(parsed).toHaveProperty("candidate");
    expect(parsed).toHaveProperty("opportunity");
    expect(parsed).toHaveProperty("preferences");
    expect(parsed).toHaveProperty("research");
    expect(parsed).toHaveProperty("requestedOutputs");
  });

  it("represents missing optional values as null, never placeholders", () => {
    const json = buildJson(filledState());
    const text = JSON.stringify(json);
    expect(json.recipient.linkedinUrl).toBeNull();
    expect(json.candidate.fullName).toBeNull();
    expect(json.opportunity.jobDescription).toBeNull();
    expect(json.research.notes).toBeNull();
    expect(json.additionalContext).toBeNull();
    expect(text).not.toContain('"..."');
  });

  it("preserves the resume text in the JSON", () => {
    const s = filledState();
    const json = buildJson(s);
    expect(json.candidate.resumeText).toBe(s.resume.text);
  });

  it("omits candidate contact info when the toggle is off", () => {
    const s = filledState();
    s.candidate.email = "secret@example.com";
    s.candidate.includeContactInfo = false;
    const json = buildJson(s);
    expect(json.candidate.email).toBeNull();
    expect(json.candidate.contactInfoIncluded).toBe(false);
  });

  it("marks master instructions as excluded with null text", () => {
    const s = filledState();
    s.masterInstructions.included = false;
    const json = buildJson(s);
    expect(json.masterInstructions.included).toBe(false);
    expect(json.masterInstructions.text).toBeNull();
  });

  it("includes all seven requested outputs", () => {
    const json = buildJson(filledState());
    expect(json.requestedOutputs).toEqual([
      "outreach_strategy",
      "subject_lines",
      "primary_email",
      "alternative_email",
      "resume_fit_assessment",
      "resume_improvements",
      "recommended_next_steps",
    ]);
  });

  it("handles unicode and emoji without corruption", () => {
    const s = filledState();
    s.recipient.company = "Ünïcode & Co — 🚀";
    const json = buildJson(s);
    expect(json.recipient.company).toBe("Ünïcode & Co — 🚀");
  });
});

describe("buildPluginInput", () => {
  it("returns complete, prompt and json variants", () => {
    const res = buildPluginInput(filledState());
    expect(res.complete).toContain("PLAIN-TEXT PROMPT");
    expect(res.complete).toContain("STRUCTURED JSON");
    expect(res.prompt).toContain("1. MASTER INSTRUCTIONS");
    expect(() => JSON.parse(res.json)).not.toThrow();
  });

  it("flags when the package exceeds the configured context limit", () => {
    const s = filledState();
    s.resume.text = "x".repeat(50000);
    const res = buildPluginInput(s);
    expect(res.overContextLimit).toBe(true);
  });

  it("does not flag a small package", () => {
    const res = buildPluginInput(filledState());
    expect(res.overContextLimit).toBe(false);
  });
});
