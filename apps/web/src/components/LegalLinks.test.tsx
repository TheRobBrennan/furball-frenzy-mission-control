import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import LegalLinks from "./LegalLinks";

describe("the legal pages", () => {
  it("links the privacy and terms pages from the footer, inline in the home page footer's own text too", () => {
    render(<LegalLinks inline />);
    expect(screen.getByRole("link", { name: /^Privacy policy$/ })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: /^Terms of use$/ })).toHaveAttribute("href", "/terms");
  });

  it("explains default analytics and where to opt out", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Privacy" })).toBeInTheDocument();
    expect(screen.getByText(/anonymous page views are enabled by default/i)).toBeInTheDocument();
    expect(screen.getByText(/use Settings to turn analytics off or on/i)).toBeInTheDocument();
  });

  it("keeps the public text to North Carolina, with no street, town, or address", () => {
    const { container } = render(<PrivacyPage />);
    expect(container).toHaveTextContent("North Carolina");
    expect(container).not.toHaveTextContent(/Rockingham|Aberdeen|\bRoad\b|\bStreet\b/);
  });

  it("discloses mild adult themes in the terms", () => {
    render(<TermsPage />);
    expect(screen.getByRole("heading", { name: "Content note" })).toBeInTheDocument();
    expect(screen.getByText(/characters drinking beer/i)).toBeInTheDocument();
  });

  it("says it is not affiliated with NASA and that the numbers are made up", () => {
    const { container } = render(<TermsPage />);
    expect(container).toHaveTextContent(/not affiliated with, endorsed by, or sponsored by NASA/);
    expect(container).toHaveTextContent(/made up/);
  });
});
