"use client";

import { FormEvent, useState } from "react";

const prompts = [
  "Where you are right now",
  "What you hope could change",
  "Anything making this feel hard",
];

export default function Home() {
  const [story, setStory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const hasStory = story.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (hasStory) setSubmitted(true);
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#start" aria-label="NEXT home">NEXT<span>·</span></a>
        <p>A place to begin</p>
      </header>

      <section className="hero" id="start" aria-labelledby="page-title">
        <div className="eyebrow"><span /> Your path, at your pace</div>
        <h1 id="page-title">You don’t have to figure<br />everything out at once.</h1>
        <p className="intro">When you’re not sure what comes next, start with what’s true for you. We’ll help you make sense of it—one small step at a time.</p>

        <form className="story-card" onSubmit={handleSubmit}>
          <label htmlFor="story">Tell us what’s going on.</label>
          <p className="hint">There’s no right way to say it. Share as much or as little as feels comfortable.</p>
          <textarea
            id="story"
            name="story"
            value={story}
            onChange={(event) => { setStory(event.target.value); setSubmitted(false); }}
            placeholder="I’m feeling stuck because…"
            rows={6}
          />
          <div className="card-footer">
            <p className="privacy-note"><span aria-hidden="true">✦</span> Your story stays yours.</p>
            <button type="submit" disabled={!hasStory}>Continue <span aria-hidden="true">→</span></button>
          </div>
          {submitted && (
            <p className="confirmation" role="status">Thank you for sharing. Your story is ready for the next guided step.</p>
          )}
        </form>

        <aside className="gentle-prompt" aria-label="Ideas for what to share">
          <p>Not sure where to start?</p>
          <ul>{prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ul>
        </aside>
      </section>

      <footer>One small step can be enough for today.</footer>
    </main>
  );
}
