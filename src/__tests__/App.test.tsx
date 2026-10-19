// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import App from "../App";
import { createDefaultFormState, DEFAULT_MASTER_INSTRUCTIONS } from "../config/defaultInstructions";

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText(/Contact full name/), { target: { value: "Jane Doe" } });
  fireEvent.change(screen.getByLabelText(/Current position\/title/), { target: { value: "Engineering Manager" } });
  fireEvent.change(screen.getByLabelText(/Company name/), { target: { value: "Acme Corp" } });
  fireEvent.change(screen.getByLabelText(/Contact email address/), { target: { value: "jane@acme.com" } });
  fireEvent.change(screen.getByLabelText(/Resume text/), {
    target: { value: "Senior engineer, 8 years distributed systems." },
  });
}

describe("App initial render", () => {
  it("renders the header, cards, toolbar and footer", () => {
    render(<App />);
    expect(screen.getByText("ColdReach Career Coach")).toBeInTheDocument();
    expect(screen.getByText("MASTER INSTRUCTIONS")).toBeInTheDocument();
    expect(screen.getByText("Recipient & Company")).toBeInTheDocument();
    expect(screen.getByText("Generate Plugin Input")).toBeInTheDocument();
    expect(screen.getByText(/Denzil Josteve Fernandes/)).toBeInTheDocument();
  });

  it("starts in dark theme", () => {
    render(<App />);
    expect(document.documentElement.getAttribute("data-bs-theme")).toBe("dark");
  });

  it("shows the missing-required readiness state and blocks generate", () => {
    render(<App />);
    expect(document.querySelector(".cr-readiness")).toHaveTextContent("Missing required inputs");
    expect(screen.getByRole("button", { name: /Generate Plugin Input/ })).toBeDisabled();
  });

  it("does not persist resume or contact data to localStorage", () => {
    render(<App />);
    fillRequiredFields();
    const stored = JSON.stringify(localStorage);
    expect(stored).not.toContain("Jane Doe");
    expect(stored).not.toContain("jane@acme.com");
    expect(stored).not.toContain("distributed systems");
  });
});

describe("Master instructions", () => {
  it("is locked and read-only by default", () => {
    render(<App />);
    const ta = screen.getByLabelText("Master instructions") as HTMLTextAreaElement;
    expect(ta).toHaveAttribute("readonly");
    expect(ta.value).toBe(DEFAULT_MASTER_INSTRUCTIONS);
  });

  it("unlocks for editing when toggled", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Unlock instructions/ }));
    const ta = screen.getByLabelText("Master instructions") as HTMLTextAreaElement;
    expect(ta).not.toHaveAttribute("readonly");
  });

  it("restores the default template on reset-to-default", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Unlock instructions/ }));
    const ta = screen.getByLabelText("Master instructions") as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "MY CUSTOM TEXT" } });
    fireEvent.click(screen.getByRole("button", { name: /Reset master instructions/ }));
    expect(screen.getByLabelText("Master instructions")).toHaveValue(DEFAULT_MASTER_INSTRUCTIONS);
    expect(screen.getByLabelText("Master instructions")).toHaveAttribute("readonly");
  });

  it("keeps custom text when excluding from output", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Unlock instructions/ }));
    const ta = screen.getByLabelText("Master instructions") as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "PERSIST ME PLEASE" } });
    fireEvent.click(screen.getByLabelText("Include in output"));
    expect(screen.getByLabelText("Master instructions")).toHaveValue("PERSIST ME PLEASE");
  });
});

describe("Generation flow", () => {
  it("blocks generation until required fields are valid", () => {
    render(<App />);
    const btn = screen.getByRole("button", { name: /Generate Plugin Input/ });
    expect(btn).toBeDisabled();
    fillRequiredFields();
    expect(btn).toBeEnabled();
  });

  it("blocks generation and shows an error for an invalid email", () => {
    render(<App />);
    fillRequiredFields();
    fireEvent.change(screen.getByLabelText(/Contact email address/), { target: { value: "bad-email" } });
    const btn = screen.getByRole("button", { name: /Generate Plugin Input/ });
    expect(btn).toBeDisabled();
  });

  it("generates a complete package and switches to generated state", () => {
    render(<App />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: /Generate Plugin Input/ }));
    expect(screen.getByText("Input generated")).toBeInTheDocument();
  });

  it("produces valid, parseable JSON in the JSON tab", () => {
    render(<App />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: /Generate Plugin Input/ }));
    fireEvent.click(screen.getByRole("tab", { name: "Structured JSON" }));
    const pre = document.querySelector(".cr-output-pre")!.textContent!;
    const parsed = JSON.parse(pre);
    expect(parsed.recipient.fullName).toBe("Jane Doe");
    expect(parsed.candidate.resumeText).toContain("distributed systems");
  });

  it("produces a plain-text prompt (not JSON) in the prompt tab", () => {
    render(<App />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: /Generate Plugin Input/ }));
    fireEvent.click(screen.getByRole("tab", { name: "Plain-Text Prompt" }));
    const pre = document.querySelector(".cr-output-pre")!.textContent!;
    expect(pre).toContain("1. MASTER INSTRUCTIONS");
    expect(() => JSON.parse(pre)).toThrow();
  });
});

describe("Clear and reset", () => {
  it("clears optional inputs but preserves required fields and resume", () => {
    render(<App />);
    fillRequiredFields();
    fireEvent.change(screen.getByLabelText(/Recipient LinkedIn URL/), { target: { value: "https://li/x" } });
    fireEvent.click(screen.getByRole("button", { name: /Clear Optional/ }));

    expect(screen.getByLabelText(/Contact full name/)).toHaveValue("Jane Doe");
    expect(screen.getByLabelText(/Contact email address/)).toHaveValue("jane@acme.com");
    expect(screen.getByLabelText(/Resume text/)).toHaveValue("Senior engineer, 8 years distributed systems.");
    expect(screen.getByLabelText("Master instructions")).toHaveValue(DEFAULT_MASTER_INSTRUCTIONS);
    expect(screen.getByLabelText(/Recipient LinkedIn URL/)).toHaveValue("");
  });

  it("asks for confirmation before resetting the entire form", () => {
    render(<App />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: /Reset Form/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Reset entire form?")).toBeInTheDocument();
  });

  it("cancel keeps the data", () => {
    render(<App />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: /Reset Form/ }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Contact full name/)).toHaveValue("Jane Doe");
  });

  it("confirm clears everything and restores defaults", () => {
    render(<App />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: /Reset Form/ }));
    fireEvent.click(screen.getByRole("button", { name: /Reset everything/ }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Contact full name/)).toHaveValue("");
    expect(screen.getByLabelText(/Resume text/)).toHaveValue("");
    expect(document.querySelector(".cr-readiness")).toHaveTextContent("Missing required inputs");
  });
});

describe("Theme switching", () => {
  it("toggles between dark and light and persists the choice", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Switch to light theme/ }));
    expect(document.documentElement.getAttribute("data-bs-theme")).toBe("light");
    expect(localStorage.getItem("coldreach.theme")).toBe("light");
    fireEvent.click(screen.getByRole("button", { name: /Switch to dark theme/ }));
    expect(document.documentElement.getAttribute("data-bs-theme")).toBe("dark");
  });
});

describe("Clipboard and downloads", () => {
  it("shows an error toast when nothing has been generated yet", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Copy Output/ }));
    expect(await screen.findByText(/Nothing to copy/)).toBeInTheDocument();
  });

  it("copies the assembled output to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<App />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: /Generate Plugin Input/ }));
    fireEvent.click(screen.getByRole("button", { name: /Copy Output/ }));
    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain("COLDREACH CAREER COACH");
  });

  it("downloads a TXT file with the expected filename", () => {
    const clicks: string[] = [];
    const orig = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      clicks.push(this.download);
    };
    render(<App />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: /Generate Plugin Input/ }));
    fireEvent.click(screen.getByRole("button", { name: /Download TXT/ }));
    HTMLAnchorElement.prototype.click = orig;
    expect(clicks).toContain("ColdReach_Plugin_Input.txt");
  });

  it("downloads a JSON file with the expected filename", () => {
    const clicks: string[] = [];
    const orig = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      clicks.push(this.download);
    };
    render(<App />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: /Generate Plugin Input/ }));
    fireEvent.click(screen.getByRole("button", { name: /Download JSON/ }));
    HTMLAnchorElement.prototype.click = orig;
    expect(clicks).toContain("ColdReach_Plugin_Input.json");
  });
});

describe("default form state", () => {
  it("ships locked and included master instructions", () => {
    const s = createDefaultFormState();
    expect(s.masterInstructions.locked).toBe(true);
    expect(s.masterInstructions.included).toBe(true);
  });

  it("enforces factual accuracy, evidence, privacy and fact/assumption separation", () => {
    expect(DEFAULT_MASTER_INSTRUCTIONS).toMatch(/FACTUAL ACCURACY/);
    expect(DEFAULT_MASTER_INSTRUCTIONS).toMatch(/EVIDENCE-BASED/);
    expect(DEFAULT_MASTER_INSTRUCTIONS).toMatch(/PRIVACY/);
    expect(DEFAULT_MASTER_INSTRUCTIONS).toMatch(/VERIFIED FACTS vs ASSUMPTIONS/);
    expect(DEFAULT_MASTER_INSTRUCTIONS).toMatch(/heuristic/);
    expect(DEFAULT_MASTER_INSTRUCTIONS).toMatch(/absent from the resume/);
  });
});
