import { describe, it, expect } from "vitest";
import { validateForm, isFormValid } from "./validation";
import { createDefaultFormState } from "../config/defaultInstructions";

function filledState() {
  const s = createDefaultFormState();
  s.recipient.fullName = "Jane Doe";
  s.recipient.title = "Engineering Manager";
  s.recipient.company = "Acme Corp";
  s.recipient.email = "jane@acme.com";
  s.resume.text = "Senior engineer with 8 years experience.";
  return s;
}

describe("validateForm", () => {
  it("reports every required field when empty", () => {
    const issues = validateForm(createDefaultFormState());
    const fields = issues.map((i) => i.field);
    expect(fields).toContain("recipient.fullName");
    expect(fields).toContain("recipient.title");
    expect(fields).toContain("recipient.company");
    expect(fields).toContain("recipient.email");
    expect(fields).toContain("resume.text");
  });

  it("passes with all required fields present", () => {
    expect(validateForm(filledState())).toEqual([]);
    expect(isFormValid(filledState())).toBe(true);
  });

  it("rejects an invalid email", () => {
    const s = filledState();
    s.recipient.email = "not-an-email";
    const issues = validateForm(s);
    expect(issues.some((i) => i.field === "recipient.email")).toBe(true);
  });

  it("rejects an email missing a TLD", () => {
    const s = filledState();
    s.recipient.email = "jane@acme";
    expect(isFormValid(s)).toBe(false);
  });

  it("accepts a valid email with subdomain and plus addressing", () => {
    const s = filledState();
    s.recipient.email = "jane.doe+job@careers.acme.co.uk";
    expect(isFormValid(s)).toBe(true);
  });

  it("treats whitespace-only required fields as missing", () => {
    const s = filledState();
    s.recipient.company = "   ";
    expect(isFormValid(s)).toBe(false);
  });

  it("does not make optional fields required", () => {
    const s = filledState();
    // All optional fields are empty by default; required-only validation passes.
    expect(s.recipient.linkedinUrl).toBe("");
    expect(s.candidate.fullName).toBe("");
    expect(s.opportunity.jobDescription).toBe("");
    expect(s.research.researchNotes).toBe("");
    expect(isFormValid(s)).toBe(true);
  });

  it("treats whitespace-only resume as missing", () => {
    const s = filledState();
    s.resume.text = "   \n  ";
    expect(isFormValid(s)).toBe(false);
  });
});
