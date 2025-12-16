import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorsIllustration from "../assets/doctors-illustration.gif";

/*
  LoginPage.jsx
  - Self-contained React component for the MEDrax login page.
  - Styles are embedded and match the visual theme used in App.css (dark, bluish accents).
  - After a successful (simulated) login the user is redirected to /reports (change target if you prefer /upload).
  - Place this file at: c:/Users/punna/medraxai/FRONTEND/src/MEDraxLogin/LoginPage.jsx
  - Import it using the exact same casing in App.js:
      import LoginPage from "./MEDraxLogin/LoginPage";
*/

const styles = `
:root{
  --bg-dark: #07101b;
  --panel-dark: #081426;
  --muted: #98a8c7;
  --accent: #60a5fa;
  --accent-2: #2dd4bf;
  --card-bg: linear-gradient(180deg, rgba(8,14,24,0.55), rgba(6,12,22,0.55));
  --glass: rgba(255,255,255,0.02);
  --border: rgba(255,255,255,0.04);
  --card-radius: 12px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}
.login-root{
  min-height: calc(100vh - 72px);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:28px;
  background: linear-gradient(180deg,#07101b 0%, #051021 40%, #020612 100%);
  color:var(--muted);
}

.medical-illustration {
  width: 90%;
  max-width: 350px;
  display: block;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
  transition: transform 0.3s ease-in-out;
}

.medical-illustration:hover {
  transform: scale(1.03);
}

/* card layout similar to App container */
.login-card-wrap{
  width:100%;
  max-width:980px;
  display:flex;
  gap:20px;
  border-radius:16px;
  padding:20px;
  background: linear-gradient(90deg, rgba(3,6,12,0.35), rgba(6,10,18,0.6));
  box-shadow: 0 10px 40px rgba(2,6,15,0.55);
  border:1px solid var(--border);
}

/* left illustration panel */
.login-illustration{
  flex:1;
  min-width:320px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:12px;
  background: linear-gradient(180deg, rgba(8,14,24,0.6), rgba(6,12,22,0.5));
  padding:18px;
  border:1px solid rgba(255,255,255,0.02);
  box-shadow:0 8px 30px rgba(2,6,15,0.4);
}
.login-illustration img{
  max-width:100%;
  border-radius:10px;
  box-shadow:0 8px 30px rgba(0,0,0,0.6);
  animation:float 5600ms ease-in-out infinite;
}
@keyframes float{0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)}}

/* right form panel */
.login-form-panel{
  width:420px;
  display:flex;
  flex-direction:column;
  gap:12px;
  background: var(--card-bg);
  border-radius:12px;
  padding:22px;
  border:1px solid var(--border);
  box-shadow: 0 12px 36px rgba(2,6,15,0.45);
}

/* brand */
.brand{
  display:flex;
  align-items:center;
  gap:12px;
}
.logo-badge{
  width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,var(--accent-2),var(--accent));
  display:flex;align-items:center;justify-content:center;color:#02111a;font-weight:700;font-size:20px;box-shadow:0 6px 18px rgba(92,120,153,0.08);
}
.brand-title{display:flex;flex-direction:column}
.brand-title h1{margin:0;color:#e6f0ff;font-size:18px}
.brand-title p{margin:0;color:var(--muted);font-size:13px}

/* hint */
.hint{color:var(--muted);font-size:13px;margin-top:6px}

/* fields */
.field{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.field-label{font-size:13px;color:var(--muted)}
input[type="text"], input[type="password"]{
  padding:12px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.03);background:rgba(5,10,20,0.6);color:#eaf3ff;
  outline:none;transition:box-shadow .15s ease, transform .08s;
}
input[type="text"]:focus, input[type="password"]:focus{
  box-shadow:0 8px 20px rgba(96,165,250,0.08);border-color: rgba(96,165,250,0.14);transform:translateY(-2px);
}

/* actions */
.actions{display:flex;align-items:center;justify-content:space-between;margin-top:6px}
.checkbox{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:13px}
.login-btn{
  background: linear-gradient(90deg,var(--accent),var(--accent-2));
  color:white;border:none;padding:12px 16px;border-radius:10px;font-weight:700;cursor:pointer;
  box-shadow:0 8px 22px rgba(11,150,165,0.12);transition:transform .14s ease,box-shadow .14s;
}
.login-btn:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(11,150,165,0.18)}
.login-btn[disabled]{opacity:0.7;cursor:wait;transform:none;box-shadow:none}

/* auxiliary */
.small-note{margin-top:12px;color:var(--muted);font-size:13px}
.link{color:var(--accent);text-decoration:none}

/* responsive */
@media (max-width:920px){
  .login-card-wrap{flex-direction:column;padding:14px}
  .login-form-panel{width:100%}
  .login-illustration{min-height:220px}
}
`;

export default function LoginPage({ redirectTo = "/reports" }) {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id.trim()) {
      e.currentTarget.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-8px)" },
          { transform: "translateX(8px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 360, iterations: 1 }
      );
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <style>{styles}</style>

      <div className="login-card-wrap" role="main" aria-label="MEDrax login">
        <div className="login-illustration" aria-hidden="true">
          <img
            src={doctorsIllustration}  // ✅ Correctly imported Doctors.gif
            alt="Medical team illustration"
            draggable="false"
            className="medical-illustration"
          />
        </div>

        <div className="login-form-panel" role="form" aria-labelledby="login-title">
          <div className="brand">
            <div className="logo-badge">💙</div>
            <div className="brand-title">
              <h1 id="login-title">MedRAX AI</h1>
              <p>Welcome back — sign in to continue</p>
            </div>
          </div>

          <p className="hint">
            Enter your email or mobile number to access the dashboard
          </p>

          <form onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Email or mobile number</span>
              <input
                ref={inputRef}
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email or mobile number"
              />
            </label>

            <label className="field">
              <span className="field-label">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                aria-label="Password"
              />
            </label>

            <div className="actions">
              <label className="checkbox">
                <input type="checkbox" /> Remember me
              </label>

              <a href="#" className="link" onClick={(e) => e.preventDefault()}>
                Forgot?
              </a>
            </div>

            <div style={{ marginTop: 12 }}>
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="small-note">
              By signing in you agree to MedRAX AI terms.{" "}
              <a className="link" href="#" onClick={(e) => e.preventDefault()}>
                Need help?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
