"use client";

import { useState } from "react";
import Reveal from "./Reveal";

// API: newsletter { eyebrow, titleLines[], text, placeholder, buttonLabel,
//      privacyNote } — see getNewsletter() in lib/content.js.
//
// Future: onSubmit should POST { email } to the real subscribe endpoint
// (e.g. `${process.env.WP_API_BASE}/mfwa/v1/newsletter`) instead of the
// simulated delay below.
export default function Newsletter({ data }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="newsletter" id="newsletter">
      <Reveal as="div" className="newsletter__inner">
        <p className="eyebrow newsletter__eyebrow">{data.eyebrow}</p>
        <h2 className="newsletter__title">
          {data.titleLines[0]}
          <br />
          {data.titleLines[1]}
        </h2>
        <p className="newsletter__text">{data.text}</p>

        {status === "success" ? (
          <p className="newsletter__success" role="status">
            Thanks! Check your inbox to confirm your subscription.
          </p>
        ) : (
          <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
            <label className="newsletter__label" htmlFor="newsletter-email">
              Email address
            </label>
            <div className="newsletter__field">
              <input
                id="newsletter-email"
                className="newsletter__input"
                type="email"
                required
                placeholder={data.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "submitting"}
              />
              <button className="newsletter__submit" type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "..." : data.buttonLabel}
              </button>
            </div>
            <p className="newsletter__privacy">{data.privacyNote}</p>
          </form>
        )}
      </Reveal>
    </section>
  );
}
