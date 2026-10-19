import type { FormState } from "../types/careerCoach";
import { APP_CONFIG } from "../config/defaultInstructions";

/**
 * Structured JSON schema for the plugin input.
 * Missing values are represented as `null` or empty strings consistently —
 * never as literal placeholder text such as "...".
 */
export interface PluginInputJson {
  product: string;
  generatedAt: string;
  masterInstructions: { included: boolean; text: string | null };
  recipient: {
    fullName: string;
    title: string;
    company: string;
    email: string;
    linkedinUrl: string | null;
    companyWebsite: string | null;
    department: string | null;
    backgroundNotes: string | null;
  };
  candidate: {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    linkedinUrl: string | null;
    portfolioUrl: string | null;
    githubUrl: string | null;
    location: string | null;
    jobMarket: string | null;
    targetRole: string | null;
    achievements: string | null;
    contactInfoIncluded: boolean;
    resumeText: string | null;
  };
  opportunity: {
    targetTitle: string | null;
    jobDescription: string | null;
    jobPostingUrl: string | null;
    requiredSkills: string | null;
    experienceLevel: string | null;
    industry: string | null;
    hiringContext: string | null;
  };
  preferences: {
    objective: string;
    objectiveCustom: string | null;
    tone: string;
    toneCustom: string | null;
    length: string;
    language: string | null;
    signOff: string | null;
    achievementsToEmphasize: string | null;
    callToAction: string | null;
    avoidedPhrases: string | null;
    includeNetworkingAlternative: boolean;
    includeReferralAlternative: boolean;
    includeShortVersion: boolean;
  };
  research: {
    mode: string;
    recipientProfileUrl: string | null;
    companyWebsite: string | null;
    knownProjects: string | null;
    recentDevelopments: string | null;
    existingRelationship: string | null;
    notes: string | null;
  };
  additionalContext: {
    previousOutreach: string | null;
    motivation: string | null;
    strongestSellingPoint: string | null;
    resumeConcerns: string | null;
    customInstructions: string | null;
    anythingElse: string | null;
  } | null;
  requestedOutputs: string[];
}

const n = (v: string): string | null => (v.trim() ? v.trim() : null);

/** Build the structured JSON object from the current form state. */
export function buildJson(state: FormState): PluginInputJson {
  const { masterInstructions, recipient, candidate, resume, opportunity, preferences, research, additional } = state;

  const additionalAny =
    n(additional.previousOutreach) ||
    n(additional.motivation) ||
    n(additional.strongestSellingPoint) ||
    n(additional.resumeConcerns) ||
    n(additional.customInstructions) ||
    n(additional.anythingElse);

  return {
    product: APP_CONFIG.productName,
    generatedAt: new Date().toISOString(),
    masterInstructions: {
      included: masterInstructions.included,
      text: masterInstructions.included ? masterInstructions.text.trim() : null,
    },
    recipient: {
      fullName: recipient.fullName.trim(),
      title: recipient.title.trim(),
      company: recipient.company.trim(),
      email: recipient.email.trim(),
      linkedinUrl: n(recipient.linkedinUrl),
      companyWebsite: n(recipient.companyWebsite),
      department: n(recipient.department),
      backgroundNotes: n(recipient.backgroundNotes),
    },
    candidate: {
      fullName: n(candidate.fullName),
      email: candidate.includeContactInfo ? n(candidate.email) : null,
      phone: candidate.includeContactInfo ? n(candidate.phone) : null,
      linkedinUrl: n(candidate.linkedinUrl),
      portfolioUrl: n(candidate.portfolioUrl),
      githubUrl: n(candidate.githubUrl),
      location: n(candidate.location),
      jobMarket: n(candidate.jobMarket),
      targetRole: n(candidate.targetRole),
      achievements: n(candidate.achievements),
      contactInfoIncluded: candidate.includeContactInfo,
      resumeText: resume.text.trim() || null,
    },
    opportunity: {
      targetTitle: n(opportunity.targetTitle),
      jobDescription: n(opportunity.jobDescription),
      jobPostingUrl: n(opportunity.jobPostingUrl),
      requiredSkills: n(opportunity.requiredSkills),
      experienceLevel: n(opportunity.experienceLevel),
      industry: n(opportunity.industry),
      hiringContext: n(opportunity.hiringContext),
    },
    preferences: {
      objective: preferences.objective,
      objectiveCustom: preferences.objective === "custom" ? n(preferences.objectiveCustom) : null,
      tone: preferences.tone,
      toneCustom: preferences.tone === "custom" ? n(preferences.toneCustom) : null,
      length: preferences.length,
      language: n(preferences.language),
      signOff: n(preferences.signOff),
      achievementsToEmphasize: n(preferences.achievementsToEmphasize),
      callToAction: n(preferences.callToAction),
      avoidedPhrases: n(preferences.avoidedPhrases),
      includeNetworkingAlternative: preferences.includeNetworkingAlternative,
      includeReferralAlternative: preferences.includeReferralAlternative,
      includeShortVersion: preferences.includeShortVersion,
    },
    research: {
      mode: research.mode,
      recipientProfileUrl: n(research.recipientProfileUrl),
      companyWebsite: n(research.companyWebsite),
      knownProjects: n(research.knownProjects),
      recentDevelopments: n(research.recentDevelopments),
      existingRelationship: n(research.existingRelationship),
      notes: n(research.researchNotes),
    },
    additionalContext: additionalAny
      ? {
          previousOutreach: n(additional.previousOutreach),
          motivation: n(additional.motivation),
          strongestSellingPoint: n(additional.strongestSellingPoint),
          resumeConcerns: n(additional.resumeConcerns),
          customInstructions: n(additional.customInstructions),
          anythingElse: n(additional.anythingElse),
        }
      : null,
    requestedOutputs: [
      "outreach_strategy",
      "subject_lines",
      "primary_email",
      "alternative_email",
      "resume_fit_assessment",
      "resume_improvements",
      "recommended_next_steps",
    ],
  };
}
