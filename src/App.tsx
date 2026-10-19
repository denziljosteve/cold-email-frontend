import { useCallback, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import type {
  AdditionalContext,
  CandidateProfile,
  FormState,
  MasterInstructions,
  Opportunity,
  OutputMode,
  OutreachPreferences,
  RecipientCompany,
  ResearchContext,
  ResumeState,
  ValidationIssue,
} from "./types/careerCoach";

import { APP_CONFIG, createDefaultFormState, createDefaultPreferences } from "./config/defaultInstructions";
import { validateForm } from "./lib/validation";
import { buildPluginInput } from "./lib/promptBuilder";
import { buildJson } from "./lib/jsonSchema";
import { copyToClipboard, downloadTextFile } from "./lib/download";

import { useTheme } from "./hooks/useTheme";
import { AppHeader } from "./components/AppHeader";
import { MasterInstructionsCard } from "./components/MasterInstructionsCard";
import { RecipientCompanyForm } from "./components/RecipientCompanyForm";
import { CandidateProfileForm } from "./components/CandidateProfileForm";
import { ResumeUploadCard } from "./components/ResumeUploadCard";
import { OpportunityForm } from "./components/OpportunityForm";
import { OutreachPreferencesCard } from "./components/OutreachPreferencesCard";
import { ResearchContextCard } from "./components/ResearchContextCard";
import { AdditionalContextCard } from "./components/AdditionalContextCard";
import { OutputPanel } from "./components/OutputPanel";
import { ActionToolbar } from "./components/ActionToolbar";
import { AppFooter } from "./components/AppFooter";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Toast, type ToastState, type ToastKind } from "./components/Toast";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Sensitive form data stays in memory for the session only.
  const [form, setForm] = useState<FormState>(createDefaultFormState);

  const [outputMode, setOutputMode] = useState<OutputMode>("complete");
  const [generated, setGenerated] = useState<{ complete: string; prompt: string; json: string } | null>(null);
  const [overLimit, setOverLimit] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const pushToast = useCallback((message: string, kind: ToastKind = "info") => {
    setToast({ id: Date.now(), message, kind });
  }, []);

  // Generic section updaters.
  const updateMaster = useCallback((u: Partial<MasterInstructions>) => {
    setForm((f) => ({ ...f, masterInstructions: { ...f.masterInstructions, ...u } }));
  }, []);
  const updateRecipient = useCallback((u: Partial<RecipientCompany>) => {
    setForm((f) => ({ ...f, recipient: { ...f.recipient, ...u } }));
  }, []);
  const updateCandidate = useCallback((u: Partial<CandidateProfile>) => {
    setForm((f) => ({ ...f, candidate: { ...f.candidate, ...u } }));
  }, []);
  const updateResume = useCallback((u: Partial<ResumeState>) => {
    setForm((f) => ({ ...f, resume: { ...f.resume, ...u } }));
  }, []);
  const updateOpportunity = useCallback((u: Partial<Opportunity>) => {
    setForm((f) => ({ ...f, opportunity: { ...f.opportunity, ...u } }));
  }, []);
  const updatePreferences = useCallback((u: Partial<OutreachPreferences>) => {
    setForm((f) => ({ ...f, preferences: { ...f.preferences, ...u } }));
  }, []);
  const updateResearch = useCallback((u: Partial<ResearchContext>) => {
    setForm((f) => ({ ...f, research: { ...f.research, ...u } }));
  }, []);
  const updateAdditional = useCallback((u: Partial<AdditionalContext>) => {
    setForm((f) => ({ ...f, additional: { ...f.additional, ...u } }));
  }, []);

  const issues: ValidationIssue[] = useMemo(() => validateForm(form), [form]);
  const ready = issues.length === 0;

  // Which output to display. Regenerate live once the user has generated once,
  // so edits reflect in the panel without needing to click Generate again.
  const displayed = useMemo(() => {
    if (!generated) return { complete: "", prompt: "", json: "" };
    return buildPluginInput(form);
  }, [form, generated]);

  const activeContent =
    outputMode === "json" ? displayed.json : outputMode === "prompt" ? displayed.prompt : displayed.complete;

  const activeChars = hasGenerated ? activeContent.length : 0;

  const readiness = !hasGenerated ? (ready ? "ready" : "missing_required") : "generated";

  const statusMessage = !hasGenerated
    ? ready
      ? "Ready — click Generate Plugin Input."
      : `${issues.length} required field${issues.length === 1 ? "" : "s"} remaining.`
    : "Generated. This assembles an input package — it does not send email or run AI analysis.";

  // ---------- Actions ----------

  const handleGenerate = useCallback(() => {
    if (issues.length > 0) {
      pushToast(`Cannot generate: ${issues[0].label} — ${issues[0].message}`, "error");
      return;
    }
    const result = buildPluginInput(form);
    setGenerated({ complete: result.complete, prompt: result.prompt, json: result.json });
    setOverLimit(result.overContextLimit);
    setHasGenerated(true);
    pushToast("Plugin input assembled.", "success");

    // On narrow screens, bring the output into view.
    if (window.innerWidth < 992) {
      document.querySelector(".cr-output")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [form, issues, pushToast]);

  const handleCopy = useCallback(async () => {
    if (!hasGenerated || !activeContent) {
      pushToast("Nothing to copy yet — generate the input first.", "error");
      return;
    }
    const ok = await copyToClipboard(activeContent);
    pushToast(ok ? "Output copied to clipboard." : "Copy failed — clipboard permission was denied.", ok ? "success" : "error");
  }, [activeContent, hasGenerated, pushToast]);

  const handleDownloadTxt = useCallback(() => {
    if (!hasGenerated || !activeContent) {
      pushToast("Generate the input before downloading.", "error");
      return;
    }
    downloadTextFile(`${APP_CONFIG.downloadBaseName}.txt`, activeContent);
    pushToast("Downloaded ColdReach_Plugin_Input.txt", "success");
  }, [activeContent, hasGenerated, pushToast]);

  const handleDownloadJson = useCallback(() => {
    if (!hasGenerated) {
      pushToast("Generate the input before downloading.", "error");
      return;
    }
    try {
      const obj = buildJson(form);
      const text = JSON.stringify(obj, null, 2);
      JSON.parse(text); // validate before download
      downloadTextFile(`${APP_CONFIG.downloadBaseName}.json`, text, "application/json;charset=utf-8");
      pushToast("Downloaded ColdReach_Plugin_Input.json", "success");
    } catch {
      pushToast("JSON was invalid — download cancelled.", "error");
    }
  }, [form, hasGenerated, pushToast]);

  const handleClearOptional = useCallback(() => {
    setForm((f) => ({
      ...f,
      // Preserve master instructions, recipient essentials, and resume content.
      recipient: {
        ...f.recipient,
        linkedinUrl: "",
        companyWebsite: "",
        department: "",
        backgroundNotes: "",
      },
      candidate: {
        ...f.candidate,
        fullName: "",
        email: "",
        phone: "",
        linkedinUrl: "",
        portfolioUrl: "",
        githubUrl: "",
        location: "",
        jobMarket: "",
        achievements: "",
      },
      opportunity: {
        ...f.opportunity,
        jobDescription: "",
        jobPostingUrl: "",
        requiredSkills: "",
        experienceLevel: "",
        industry: "",
        hiringContext: "",
      },
      preferences: createDefaultPreferences(),
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
    }));
    pushToast("Optional inputs cleared. Required fields and resume were kept.", "success");
  }, [pushToast]);

  const doReset = useCallback(() => {
    setForm(createDefaultFormState());
    setGenerated(null);
    setHasGenerated(false);
    setOverLimit(false);
    setOutputMode("complete");
    setShowResetConfirm(false);
    pushToast("Form reset to defaults.", "success");
  }, [pushToast]);

  return (
    <div className="cr-app">
      <AppHeader theme={theme} onToggleTheme={toggleTheme} onReset={() => setShowResetConfirm(true)} />

      <main className="cr-workspace">
        <div className="cr-inputs" aria-label="Plugin inputs">
          <MasterInstructionsCard value={form.masterInstructions} onChange={updateMaster} />
          <RecipientCompanyForm value={form.recipient} onChange={updateRecipient} errors={issues} />
          <CandidateProfileForm value={form.candidate} onChange={updateCandidate} />
          <ResumeUploadCard value={form.resume} onChange={updateResume} />
          <OpportunityForm value={form.opportunity} onChange={updateOpportunity} />
          <OutreachPreferencesCard value={form.preferences} onChange={updatePreferences} />
          <ResearchContextCard value={form.research} onChange={updateResearch} />
          <AdditionalContextCard value={form.additional} onChange={updateAdditional} />
        </div>

        <OutputPanel
          mode={outputMode}
          onModeChange={setOutputMode}
          content={hasGenerated ? activeContent : ""}
          readiness={readiness}
          statusMessage={statusMessage}
          charCount={activeChars}
          overLimit={overLimit && outputMode !== "json"}
        />
      </main>

      {!ready && issues.length > 0 && (
        <div className="cr-validation-summary" role="alert">
          <AlertTriangle size={14} aria-hidden="true" />
          <span>Missing required inputs: {issues.map((i) => i.label).join(", ")}.</span>
        </div>
      )}

      <ActionToolbar
        onGenerate={handleGenerate}
        onCopy={handleCopy}
        onDownloadTxt={handleDownloadTxt}
        onDownloadJson={handleDownloadJson}
        onClearOptional={handleClearOptional}
        onReset={() => setShowResetConfirm(true)}
        generateDisabled={!ready}
      />

      <AppFooter />

      <ConfirmDialog
        open={showResetConfirm}
        title="Reset entire form?"
        body="This clears all personal data, resume content, and the generated output, and restores the default instructions. This cannot be undone."
        confirmLabel="Reset everything"
        destructive
        onConfirm={doReset}
        onCancel={() => setShowResetConfirm(false)}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
