/**
 * Shared domain types for ColdReach Career Coach.
 * These describe the form state that the user edits and that the
 * prompt-assembly engine turns into a plugin input package.
 */

export type OutreachObjective =
  | "explore_opportunities"
  | "informational_interview"
  | "ask_about_team_or_hiring"
  | "request_referral"
  | "contact_hiring_manager"
  | "request_introduction"
  | "follow_up"
  | "custom";

export type OutreachTone =
  | "professional_direct"
  | "warm_conversational"
  | "confident_concise"
  | "formal"
  | "custom";

export type EmailLength = "short" | "standard" | "detailed";

export type ResearchMode = "provided_information_only" | "research_enabled";

export interface MasterInstructions {
  text: string;
  /** Locked instructions are read-only in the UI. */
  locked: boolean;
  /** Whether the instructions are included in the assembled output. */
  included: boolean;
}

export interface RecipientCompany {
  fullName: string;
  title: string;
  company: string;
  email: string;
  linkedinUrl: string;
  companyWebsite: string;
  department: string;
  backgroundNotes: string;
}

export interface CandidateProfile {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  portfolioUrl: string;
  githubUrl: string;
  location: string;
  jobMarket: string;
  targetRole: string;
  achievements: string;
  /** Whether candidate contact details are included in the generated output. */
  includeContactInfo: boolean;
}

export interface ResumeState {
  /** Extracted or pasted resume text. */
  text: string;
  fileName: string | null;
  fileSize: number | null;
}

export interface Opportunity {
  targetTitle: string;
  jobDescription: string;
  jobPostingUrl: string;
  requiredSkills: string;
  experienceLevel: string;
  industry: string;
  hiringContext: string;
}

export interface OutreachPreferences {
  objective: OutreachObjective;
  objectiveCustom: string;
  tone: OutreachTone;
  toneCustom: string;
  length: EmailLength;
  language: string;
  signOff: string;
  achievementsToEmphasize: string;
  callToAction: string;
  avoidedPhrases: string;
  includeNetworkingAlternative: boolean;
  includeReferralAlternative: boolean;
  includeShortVersion: boolean;
}

export interface ResearchContext {
  recipientProfileUrl: string;
  companyWebsite: string;
  knownProjects: string;
  recentDevelopments: string;
  existingRelationship: string;
  researchNotes: string;
  mode: ResearchMode;
}

export interface AdditionalContext {
  previousOutreach: string;
  motivation: string;
  strongestSellingPoint: string;
  resumeConcerns: string;
  customInstructions: string;
  anythingElse: string;
}

export interface FormState {
  masterInstructions: MasterInstructions;
  recipient: RecipientCompany;
  candidate: CandidateProfile;
  resume: ResumeState;
  opportunity: Opportunity;
  preferences: OutreachPreferences;
  research: ResearchContext;
  additional: AdditionalContext;
}

export type OutputMode = "complete" | "json" | "prompt";

export type Readiness =
  | "missing_required"
  | "ready"
  | "generated";

/** A single missing-required-field problem, for validation summaries. */
export interface ValidationIssue {
  field: string;
  label: string;
  message: string;
}

export const REQUESTED_OUTPUTS = [
  "outreach_strategy",
  "subject_lines",
  "primary_email",
  "alternative_email",
  "resume_fit_assessment",
  "resume_improvements",
  "recommended_next_steps",
] as const;

export type RequestedOutput = (typeof REQUESTED_OUTPUTS)[number];
