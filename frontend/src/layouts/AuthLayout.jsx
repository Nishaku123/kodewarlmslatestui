import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import BrandLogo from "../components/ui/BrandLogo.jsx";

/**
 * Split-screen layout for login, registration and password reset pages.
 * The form is supplied as children by each auth page.
 */
export default function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  footer,
}) {
  return (
    <div className="auth-scene relative min-h-screen overflow-x-clip lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative z-10 hidden flex-col justify-between overflow-hidden border-r border-white/15 bg-[#041427]/72 p-10 backdrop-blur-sm lg:flex">
        <div
          className="app-backdrop absolute inset-0 opacity-60"
          aria-hidden="true"
        />

        <div className="relative">
          <Link to="/" aria-label="Kodewar LMS home" className="inline-block">
            <BrandLogo />
          </Link>
        </div>

        <div className="relative max-w-md">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">
            <span className="h-px w-8 bg-brand-500" aria-hidden="true" />
            Kodewar Learning Platform
          </p>

          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-white">
            Structured learning,
            <br />
            verified progress.
          </h2>

          <p className="mt-4 text-sm leading-6 text-mist-400">
            Weekly modules, practical assessments and certificates that prove
            what you have actually completed.
          </p>

          <ul className="mt-8 space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand-500/20 bg-brand-500/10 text-brand-300">
                <ShieldCheck size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-mist-200">
                  Progress you can trust
                </p>
                <p className="mt-0.5 text-xs leading-5 text-mist-500">
                  Learning rules are checked by the server, not just the
                  interface.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <Sparkles size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-mist-200">
                  Focused, not crowded
                </p>
                <p className="mt-0.5 text-xs leading-5 text-mist-500">
                  Clear weekly goals and one next action at a time.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-mist-500">
          © {new Date().getFullYear()} Kodewar Technologies
        </p>
      </aside>

      <main className="relative z-10 flex min-h-screen flex-col">
        <div className="flex items-center justify-between bg-[#041427]/70 p-5 backdrop-blur-sm lg:hidden">
          <Link to="/" aria-label="Kodewar LMS home">
            <BrandLogo />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[440px]">
            <div className="auth-card rounded-[28px] px-6 py-7 sm:px-8">
              <div className="mb-6 flex items-center justify-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#071d3c] ring-1 ring-[#ffc21b]/70 shadow-[0_0_22px_rgba(27,113,216,0.3)]">
                  <img
                    src="/kodewar-mark.png"
                    alt=""
                    className="h-8 w-8 object-contain"
                  />
                </span>
                <span className="text-left">
                  <span className="block font-display text-[16px] font-semibold leading-none tracking-[0.28em] text-white">
                    KODEWAR
                  </span>
                  <span className="mt-1.5 block text-[9px] font-medium uppercase tracking-[0.4em] text-mist-400">
                    LMS
                  </span>
                </span>
              </div>

              {eyebrow ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">
                  {eyebrow}
                </p>
              ) : null}

              <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-[26px]">
                {title}
              </h1>

              {description ? (
                <p className="mt-2 text-[12.5px] leading-5 text-mist-300">
                  {description}
                </p>
              ) : null}

              <div className="mt-6">{children}</div>

              {footer ? (
                <div className="mt-6 border-t border-[#2f5f92]/45 pt-4 text-center text-xs text-mist-300">
                  {footer}
                </div>
              ) : null}
            </div>

            <div className="mt-5 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs text-mist-300 transition-colors hover:text-white"
              >
                <ArrowLeft size={13} aria-hidden="true" />
                Back to status page
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
