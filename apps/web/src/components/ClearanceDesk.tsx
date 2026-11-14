"use client";

import { useState } from "react";

const files = [
  "Cameras: phones, the DJI Action 5 Pro, GoPro Hero cameras, and camera pens and lights, all for capturing the fun.",
  "Imagery: a knack for pulling up satellite imagery in real time, or close to it, to bring an idea to life.",
  "Records: friendly files and notes on everything they do. An elephant never forgets.",
  "Hobbies: drawing, documenting, illustrating ideas and conversations, and jamming with Little Bunny on their Ableton Push 3 standalone.",
];

const denials = [
  "Access denied. The elephants need convincing.",
  "Access denied. Is that really all you have got?",
  "Access denied. The elephants are unimpressed, try a joke.",
];

// A tiny, silly clearance desk: the elephants keep everything classified unless convinced.
export default function ClearanceDesk() {
  const [pitch, setPitch] = useState("");
  const [released, setReleased] = useState(0);
  const [message, setMessage] = useState("Everything here is classified.");
  const [denied, setDenied] = useState(0);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pitch.trim().length < 12) {
      setMessage(denials[denied % denials.length]);
      setDenied(denied + 1);
      return;
    }
    if (released >= files.length) {
      setMessage("All files released. Clearance level: charmed.");
    } else {
      setReleased(released + 1);
      setMessage(
        released + 1 === files.length
          ? "Convincing. Clearance granted, the last file is yours."
          : "Mildly amusing. One more file released.",
      );
    }
    setPitch("");
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-amber sm:tracking-[0.25em]">
        Classified file: The Polish Elephants
      </p>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <label htmlFor="pitch" className="block text-base text-white/85">
          Convince them: a joke, an argument, or your credentials
        </label>
        <textarea
          id="pitch"
          value={pitch}
          onChange={(event) => setPitch(event.target.value)}
          rows={2}
          className="w-full resize-none rounded-xl border border-white/20 bg-space/60 p-3 text-base text-white placeholder:text-white/40 focus:border-amber focus:outline-none"
          placeholder="Why did the elephant bring a camera to the launch?"
        />
        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-amber px-6 font-bold text-space transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
        >
          Request clearance
        </button>
      </form>
      <p className="mt-4 font-mono text-sm text-ice" role="status" aria-live="polite">
        {message}
      </p>
      <ul className="mt-4 space-y-3 text-white/90">
        {files.slice(0, released).map((file) => (
          <li key={file} className="border-l-2 border-amber pl-3">
            {file}
          </li>
        ))}
        {files.slice(released).map((file) => (
          <li key={file} className="border-l-2 border-white/10 pl-3 text-white/30" aria-hidden="true">
            <span className="select-none bg-white/20 text-transparent">{file}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
