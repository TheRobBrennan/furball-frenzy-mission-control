// Opening Missions tucks the other folder tabs away, and going back to the cover fans them out again.

/** The home page's section tabs, which fold away on the Missions page. */
export const sectionTabs = [
  { id: "the-brief", label: "The brief", color: "border-t-[#5ac8fa]" },
  { id: "classified", label: "Classified", color: "border-t-[#c792ea]" },
  { id: "launch-sites", label: "Launch sites", color: "border-t-[#ff7a59]" },
  { id: "origin-stories", label: "Origin stories", color: "border-t-[#7ddc8a]" },
];

const KEY = "ff-tabs-folded";

export function rememberFolded(folded: boolean) {
  try {
    if (folded) window.sessionStorage.setItem(KEY, "1");
    else window.sessionStorage.removeItem(KEY);
  } catch {
    // Without storage the tabs just do not fan out, which is fine.
  }
}

export function wereFolded() {
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
