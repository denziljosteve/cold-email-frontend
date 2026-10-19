import { APP_CONFIG } from "../config/defaultInstructions";

export function AppFooter() {
  return (
    <footer className="cr-footer">
      <span className="cr-footer-developer">
        Developer: <strong>{APP_CONFIG.developer}</strong>
      </span>
      <nav className="cr-footer-links" aria-label="Developer links">
        <a href={APP_CONFIG.links.website} target="_blank" rel="noreferrer noopener">
          Website
        </a>
        <a href={APP_CONFIG.links.linkedin} target="_blank" rel="noreferrer noopener">
          LinkedIn
        </a>
        <a href={APP_CONFIG.links.github} target="_blank" rel="noreferrer noopener">
          GitHub
        </a>
      </nav>
      <span className="cr-footer-note">
        All processing is local to your browser. Nothing is uploaded.
      </span>
    </footer>
  );
}
