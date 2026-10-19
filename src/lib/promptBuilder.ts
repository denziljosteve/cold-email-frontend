import type { FormState } from "../types/careerCoach";
import { APP_CONFIG } from "../config/defaultInstructions";
import { buildJson } from "./jsonSchema";

/** Trim and collapse runs of blank lines without altering factual content. */
function normalize(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

const NA = "[Not provided]";

function line(label: string, value: string | undefined | null): string {
  const v = value && value.trim() ? normalize(value) : NA;
  return `${label}: ${v}`;
}

/**
 * Assemble the complete plain-text plugin input package.
 * Sections are clearly labeled. Absent optional information is marked
 * explicitly rather than silently omitted.
 */
export function buildPlainText(state: FormState): string {
  const { masterInstructions, recipient, candidate, resume, opportunity, preferences, research, additional } = state;

  const out: string[] = [];
  out.push(`${APP_CONFIG.productName.toUpperCase()} — INPUT PACKAGE`);
  out.push("=".repeat(60));
  out.push("");

  // 1. Master instructions
  out.push("1. MASTER INSTRUCTIONS");
  out.push("-".repeat(40));
  if (masterInstructions.included) {
    out.push(normalize(masterInstructions.text));
  } else {
    out.push("[Master instructions excluded by user]");
  }
  out.push("");

  // 2. Recipient & company
  out.push("2. RECIPIENT & COMPANY");
  out.push("-".repeat(40));
  out.push(line("Contact full name", recipient.fullName));
  out.push(line("Current position/title", recipient.title));
  out.push(line("Company", recipient.company));
  out.push(line("Contact email", recipient.email));
  out.push(line("LinkedIn URL", recipient.linkedinUrl));
  out.push(line("Company website", recipient.companyWebsite));
  out.push(line("Team/department", recipient.department));
  out.push(line("Known background/notes", recipient.backgroundNotes));
  out.push("");

  // 3. Candidate profile
  out.push("3. CANDIDATE PROFILE");
  out.push("-".repeat(40));
  out.push(line("Full name", candidate.fullName));
  if (candidate.includeContactInfo) {
    out.push(line("Email", candidate.email));
    out.push(line("Phone", candidate.phone));
  } else {
    out.push("Email/Phone: [Omitted by user preference]");
  }
  out.push(line("LinkedIn URL", candidate.linkedinUrl));
  out.push(line("Portfolio URL", candidate.portfolioUrl));
  out.push(line("GitHub URL", candidate.githubUrl));
  out.push(line("Location/country", candidate.location));
  out.push(line("Preferred job market", candidate.jobMarket));
  out.push(line("Target role", candidate.targetRole));
  out.push(line("Additional achievements", candidate.achievements));
  out.push("");

  // 4. Resume
  out.push("4. RESUME");
  out.push("-".repeat(40));
  if (normalize(resume.text)) {
    out.push(normalize(resume.text));
  } else {
    out.push("[No resume text provided]");
  }
  out.push("");

  // 5. Target opportunity
  out.push("5. TARGET OPPORTUNITY");
  out.push("-".repeat(40));
  out.push(line("Target role/title", opportunity.targetTitle));
  out.push(line("Job posting URL", opportunity.jobPostingUrl));
  out.push(line("Required skills/qualifications", opportunity.requiredSkills));
  out.push(line("Preferred experience level", opportunity.experienceLevel));
  out.push(line("Industry/domain", opportunity.industry));
  out.push(line("Additional hiring context", opportunity.hiringContext));
  out.push("");
  if (normalize(opportunity.jobDescription)) {
    out.push("Job description (full text):");
    out.push(normalize(opportunity.jobDescription));
  } else {
    out.push(
      "Job description: [Not provided — assess fit against the target title only and clearly label any inferred expectations as inferred, not confirmed hiring criteria.]",
    );
  }
  out.push("");

  // 6. Outreach preferences
  out.push("6. OUTREACH PREFERENCES");
  out.push("-".repeat(40));
  const objectiveLabel =
    preferences.objective === "custom" && preferences.objectiveCustom.trim()
      ? normalize(preferences.objectiveCustom)
      : preferences.objective.replace(/_/g, " ");
  const toneLabel =
    preferences.tone === "custom" && preferences.toneCustom.trim()
      ? normalize(preferences.toneCustom)
      : preferences.tone.replace(/_/g, " ");
  out.push(line("Objective", objectiveLabel));
  out.push(line("Tone", toneLabel));
  out.push(line("Email length", preferences.length));
  out.push(line("Preferred language", preferences.language));
  out.push(line("Preferred sign-off", preferences.signOff));
  out.push(line("Achievements to emphasize", preferences.achievementsToEmphasize));
  out.push(line("Call-to-action preference", preferences.callToAction));
  out.push(line("Avoided phrases/constraints", preferences.avoidedPhrases));
  out.push(`Include networking alternative: ${preferences.includeNetworkingAlternative ? "Yes" : "No"}`);
  out.push(`Include referral-request alternative: ${preferences.includeReferralAlternative ? "Yes" : "No"}`);
  out.push(`Include shorter email version: ${preferences.includeShortVersion ? "Yes" : "No"}`);
  out.push("");

  // 7. Research & personalization
  out.push("7. RESEARCH & PERSONALIZATION");
  out.push("-".repeat(40));
  out.push(
    line(
      "Research mode",
      research.mode === "research_enabled"
        ? "research-enabled mode requested (a live research integration must actually be connected — otherwise treat as provided-information-only)"
        : "provided information only",
    ),
  );
  if (research.mode !== "research_enabled") {
    out.push(
      "Transparency requirement: no live web research was performed. Personalization must use only the facts supplied here. Do not fabricate personalization, and disclose when personalization is unavailable.",
    );
  }
  out.push(line("Recipient profile URL", research.recipientProfileUrl));
  out.push(line("Company website", research.companyWebsite));
  out.push(line("Known projects/products/initiatives", research.knownProjects));
  out.push(line("Recent company developments", research.recentDevelopments));
  out.push(line("Existing relationship/shared context", research.existingRelationship));
  out.push(line("Research notes", research.researchNotes));
  out.push(
    "Privacy constraint: do not infer private or sensitive traits about the recipient.",
  );
  out.push("");

  // 8. Additional context
  out.push("8. ADDITIONAL CONTEXT");
  out.push("-".repeat(40));
  out.push(line("Previous outreach/conversation", additional.previousOutreach));
  out.push(line("Motivation for contacting", additional.motivation));
  out.push(line("Strongest selling point", additional.strongestSellingPoint));
  out.push(line("Resume concerns", additional.resumeConcerns));
  out.push(line("Custom instructions", additional.customInstructions));
  out.push(line("Anything else", additional.anythingElse));
  out.push("");

  // 9. Required output
  out.push("9. REQUIRED OUTPUT");
  out.push("-".repeat(40));
  out.push(
    [
      "Return the following sections:",
      "1) Outreach strategy",
      "2) Two or three subject lines with a recommended option",
      "3) Primary cold email (recipient, subject, body, CTA, sign-off, signature)",
      "4) Alternative email matched to the objective",
      "5) Resume fit assessment (score /100, weighted category scores, evidence, uncertainty)",
      "6) Resume improvements (rewritten summary, prioritized changes, original vs revised bullets, skills/ATS alignment, missing evidence)",
      "7) Recommended next steps",
      "",
      "If a job description or target title is available, use this weighted rubric:",
      "- Relevant experience and responsibilities: 30",
      "- Evidenced skills and tools: 25",
      "- Achievements and measurable impact: 20",
      "- Industry/domain alignment: 15",
      "- Relevant education and certifications: 10",
      "Explain the score is a heuristic, not a prediction of hiring success. Distinguish skills absent from the resume from skills the candidate demonstrably lacks. Do not force irrelevant sections.",
    ].join("\n"),
  );
  out.push("");

  return out.join("\n");
}

export type AssembledOutput = {
  complete: string;
  prompt: string;
  json: string;
  totalChars: number;
  overContextLimit: boolean;
};

/** Assemble every output variant and compute size metrics. */
export function buildPluginInput(state: FormState): AssembledOutput {
  const prompt = buildPlainText(state);
  const json = JSON.stringify(buildJson(state), null, 2);

  // "Complete" package concatenates the readable prompt and the structured JSON.
  const complete = [
    "##################### PLAIN-TEXT PROMPT #####################",
    prompt,
    "",
    "##################### STRUCTURED JSON #####################",
    json,
  ].join("\n");

  const totalChars = complete.length;
  return {
    complete,
    prompt,
    json,
    totalChars,
    overContextLimit: totalChars > APP_CONFIG.contextLimitChars,
  };
}
