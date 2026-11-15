import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import LegalLinks from "./LegalLinks";

describe("the legal pages", () => {
  it("links the privacy and terms pages from the footer, inline in the home page footer's own text too", () => {
    render(<LegalLinks inline />);
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });

  it("says plainly that analytics and replay are off until the visitor agrees, and that typed text is masked", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Privacy" })).toBeInTheDocument();
    expect(screen.getByText(/off until you choose Yes/i)).toBeInTheDocument();
    expect(screen.getByText(/masked and never recorded/i)).toBeInTheDocument();
  });

  it("keeps the public text to North Carolina, with no street, town, or address", () => {
    const { container } = render(<PrivacyPage />);
    expect(container).toHaveTextContent("North Carolina");
    expect(container).not.toHaveTextContent(/Rockingham|Aberdeen|\bRoad\b|\bStreet\b/);
  });

  it("says it is not affiliated with NASA and that the numbers are made up", () => {
    const { container } = render(<TermsPage />);
    expect(container).toHaveTextContent(/not affiliated with, endorsed by, or sponsored by NASA/);
    expect(container).toHaveTextContent(/made up/);
  });
});
