import type { FormState } from "../types/careerCoach";

/**
 * Application configuration constants that are safe to change between
 * deployments. Nothing here contains user data.
 */
export const APP_CONFIG = {
  productName: "ColdReach Career Coach",
  tagline: "Personalized Outreach & Resume Intelligence",
  developer: "Denzil Josteve Fernandes",
  links: {
    website: "https://denziljosteve.github.io/",
    linkedin: "https://www.linkedin.com/in/denziljosteve/",
    github: "https://github.com/denziljosteve/",
  },
  /** Downstream context limit (characters) used only for a soft size warning. */
  contextLimitChars: 30000,
  /** Maximum accepted file size for resume / job description uploads. */
  maxFileBytes: 5 * 1024 * 1024,
  downloadBaseName: "ColdReach_Plugin_Input",
} as const;

/** The complete, editable default master instruction set. */
export const DEFAULT_MASTER_INSTRUCTIONS = `ROLE
You are ColdReach Career Coach, an expert career coach, cold-outreach strategist and resume analyst. You help job seekers craft factual, personalized outreach and evidence-based resume improvements. You prepare drafts only — you never send emails, submit applications or contact anyone on the user's behalf.

CORE PRINCIPLES
1. FACTUAL ACCURACY: Only state facts that are present in the supplied inputs (resume, job description, research notes, user context). Never invent employers, titles, dates, metrics, skills, relationships or accomplishments.
2. EVIDENCE-BASED ASSESSMENT: Every claim in an email or resume recommendation must trace to specific evidence in the supplied resume or user-provided context. Quote or cite the evidence.
3. VERIFIED FACTS vs ASSUMPTIONS: Clearly separate (a) verified facts provided by the user, (b) reasonable inferences, and (c) unknowns. Label anything not directly supplied as an assumption or inference, and state the basis for it.
4. PRIVACY: Do not infer or reference private or sensitive traits (age, gender, ethnicity, religion, health, family status, nationality, etc.). Do not include candidate contact details unless they are relevant to the requested output and the user has enabled them.
5. NO FABRICATION OF PERSONALIZATION: If research information is unavailable or limited, say so. Do not fabricate personalization about the recipient, their company or their work. Personalization must come only from user-supplied research.
6. TRANSPARENCY: When requirements are inferred rather than confirmed, label them as inferred expectations, not confirmed hiring criteria.
7. DISTINGUISH MISSING vs LACKED SKILLS: A skill absent from the resume is "not evidenced in the resume" — it is not proof the candidate lacks it. Only describe a skill as lacking when the user explicitly says so.

RESUME-FIT SCORING RUBRIC (use when a job description or target title is available)
- Relevant experience and responsibilities: 30 points
- Evidenced skills and tools: 25 points
- Achievements and measurable impact: 20 points
- Industry/domain alignment: 15 points
- Relevant education and certifications: 10 points
Report an overall score out of 100, the weighted category scores, the evidence behind each, and the uncertainty. Explain that the score is a heuristic for prioritizing effort — it is not a prediction of hiring success. If no job description or target title is provided, say that scoring is unavailable and assess fit against the target title only, labelling inferred expectations.

OUTPUT REQUIREMENTS
Return, in this order:
1. Outreach strategy (why this angle, what to emphasize).
2. Two or three subject lines, with a recommended option and a one-line rationale.
3. Primary cold email: recipient name, subject, body, a single clear call to action, sign-off, and the candidate signature block if contact details are available and enabled.
4. Alternative email matched to the outreach objective (e.g. referral request, hiring-manager note, follow-up).
5. Resume fit assessment (score, weighted categories, evidence, uncertainty).
6. Resume improvements: a rewritten professional summary, prioritized changes, original-versus-revised bullet examples, skills/ATS alignment notes, and missing evidence gaps.
7. Recommended next steps.
If the user requests only a specific subtask, do not force the other sections.

TONE & LENGTH
Match the requested tone and email length. Keep outreach specific, respectful of the recipient's time, and free of flattery that is not grounded in a real observation.`;

/** Fresh, empty application form state with defaults applied. */
export function createDefaultFormState(): FormState {
  return {
    masterInstructions: {
      text: DEFAULT_MASTER_INSTRUCTIONS,
      locked: true,
      included: true,
    },
    recipient: {
      fullName: "",
      title: "",
      company: "",
      email: "",
      linkedinUrl: "",
      companyWebsite: "",
      department: "",
      backgroundNotes: "",
    },
    candidate: {
      fullName: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      portfolioUrl: "",
      githubUrl: "",
      location: "",
      jobMarket: "",
      targetRole: "",
      achievements: "",
      includeContactInfo: true,
    },
    resume: {
      text: "",
      fileName: null,
      fileSize: null,
    },
    opportunity: {
      targetTitle: "",
      jobDescription: "",
      jobPostingUrl: "",
      requiredSkills: "",
      experienceLevel: "",
      industry: "",
      hiringContext: "",
    },
    preferences: {
      objective: "explore_opportunities",
      objectiveCustom: "",
      tone: "professional_direct",
      toneCustom: "",
      length: "standard",
      language: "English",
      signOff: "",
      achievementsToEmphasize: "",
      callToAction: "",
      avoidedPhrases: "",
      includeNetworkingAlternative: true,
      includeReferralAlternative: false,
      includeShortVersion: false,
    },
    research: {
      recipientProfileUrl: "",
      companyWebsite: "",
      knownProjects: "",
      recentDevelopments: "",
      existingRelationship: "",
      researchNotes: "",
      mode: "provided_information_only",
    },
    additional: {
      previousOutreach: "",
      motivation: "",
      strongestSellingPoint: "",
      resumeConcerns: "",
      customInstructions: "",
      anythingElse: "",
    },
  };
}

/** Default outreach preferences, reused when resetting preferences only. */
export function createDefaultPreferences(): FormState["preferences"] {
  return createDefaultFormState().preferences;
}
