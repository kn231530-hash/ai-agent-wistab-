import React, { useEffect, useState } from "react";
import { ArrowLeft, Bot, CheckCircle2, LogOut, Plus, ShieldCheck, Trash2, Users, X } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://lpjztyejziaunlndpjmg.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const OWNER_EMAIL = "kn231530@gmail.com";
type User = { id: string; email: string };
type Agent = { id: string; name: string; slug: string; description: string | null; category: string | null; price: number; is_published: boolean };

async function api(path: string, token?: string, init: RequestInit = {}) {
  if (!SUPABASE_KEY) throw new Error("Authentication is not configured yet. Please try again after the website setup is complete.");
  const response = await fetch(SUPABASE_URL + path, {
    ...init,
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}), ...(init.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.msg || data.message || data.error_description || data.error || "Request failed. Please try again.");
  return data;
}

export default function AuthPortal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "signup" | "reset" | "new-password">(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (params.get("reset") === "1" || hash.get("type") === "recovery") return hash.get("type") === "recovery" ? "new-password" : "reset";
    return params.get("signup") === "1" ? "signup" : "login";
  });
  const [email, setEmail] = useState(OWNER_EMAIL);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("wist-ai-access-token") || "");
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("user");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentName, setAgentName] = useState("");
  const [agentCategory, setAgentCategory] = useState("Business");
  const [agentDescription, setAgentDescription] = useState("");
  const [agentPrice, setAgentPrice] = useState("0");
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadAccount = async (accessToken: string) => {
    const current = await api("/auth/v1/user", accessToken);
    setUser({ id: current.id, email: current.email });
    const profiles = await api("/rest/v1/profiles?select=role,display_name&id=eq." + encodeURIComponent(current.id), accessToken);
    const currentRole = profiles?.[0]?.role || "user";
    setRole(currentRole);
    if (currentRole === "owner") {
      const rows = await api("/rest/v1/agents?select=id,name,slug,description,category,price,is_published&order=created_at.desc", accessToken);
      setAgents(rows || []);
    }
  };

  useEffect(() => {
    if (token) loadAccount(token).catch(() => { localStorage.removeItem("wist-ai-access-token"); setToken(""); setUser(null); });
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      if (mode === "reset") {\n        await api("/auth/v1/recover?redirect_to=" + encodeURIComponent(window.location.origin + window.location.pathname + "?reset=1"), undefined, { method: "POST", body: JSON.stringify({ email: email.trim().toLowerCase() }) });\n        setRecoveryEmailSent(true); setNotice("Password reset email sent. Open the email on this device and follow its secure link to choose a new password.");\n      } else if (mode === "new-password") {\n        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));\n        const recoveryToken = hash.get("access_token");\n        if (!recoveryToken) throw new Error("The password-reset link is missing or expired. Request a new reset email.");\n        await api("/auth/v1/user", recoveryToken, { method: "PUT", body: JSON.stringify({ password: newPassword }) });\n        window.history.replaceState({}, document.title, window.location.pathname + "?login=1");\n        setMode("login"); setPassword(""); setNewPassword(""); setNotice("Password updated. You can now sign in with your new password.");\n      } else if (mode === "signup") {
        const result = await api("/auth/v1/signup", undefined, { method: "POST", body: JSON.stringify({ email: email.trim().toLowerCase(), password, data: { display_name: displayName } , gotrue_meta_security: {} }) });
        if (result.access_token) {
          localStorage.setItem("wist-ai-access-token", result.access_token); setToken(result.access_token); await loadAccount(result.access_token);
        } else setNotice("Signup received. Check your inbox and verify your email, then return here to sign in.");
      } else {
        const result = await api("/auth/v1/token?grant_type=password", undefined, { method: "POST", body: JSON.stringify({ email: email.trim().toLowerCase(), password }) });
        localStorage.setItem("wist-ai-access-token", result.access_token); setToken(result.access_token); await loadAccount(result.access_token);
      }
    } catch (e: any) { setError(e.message || "Unable to complete authentication."); }
    finally { setBusy(false); }
  };

  const logout = async () => {
    try { await api("/auth/v1/logout", token, { method: "POST" }); } catch { /* clear local session even if the network is unavailable */ }
    localStorage.removeItem("wist-ai-access-token"); setToken(""); setUser(null); setRole("user"); setAgents([]); setNotice("You have signed out.");
  };

  const refreshAgents = async () => {
    const rows = await api("/rest/v1/agents?select=id,name,slug,description,category,price,is_published&order=created_at.desc", token);
    setAgents(rows || []);
  };

  const saveAgent = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    const slug = agentName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try {
      if (editingId) {
        await api("/rest/v1/agents?id=eq." + encodeURIComponent(editingId), token, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ name: agentName, description: agentDescription, category: agentCategory, price: Number(agentPrice) || 0 }) });
      } else {
        await api("/rest/v1/agents", token, { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ owner_id: user?.id, name: agentName, slug: slug + "-" + Date.now().toString(36), description: agentDescription, category: agentCategory, price: Number(agentPrice) || 0, is_published: false, config: {} }) });
      }
      setAgentName(""); setAgentDescription(""); setAgentPrice("0"); setEditingId(null); await refreshAgents(); setNotice("Agent saved successfully.");
    } catch (e: any) { setError(e.message); }
    finally { setBusy(false); }
  };

  const togglePublish = async (agent: Agent) => {
    setError(""); setNotice("");
    try { await api("/rest/v1/agents?id=eq." + encodeURIComponent(agent.id), token, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ is_published: !agent.is_published }) }); await refreshAgents(); }
    catch (e: any) { setError(e.message); }
  };

  const deleteAgent = async (agent: Agent) => {
    if (!window.confirm("Delete " + agent.name + "? This cannot be undone.")) return;
    try { await api("/rest/v1/agents?id=eq." + encodeURIComponent(agent.id), token, { method: "DELETE" }); await refreshAgents(); }
    catch (e: any) { setError(e.message); }
  };

  const editAgent = (agent: Agent) => {
    setEditingId(agent.id); setAgentName(agent.name); setAgentCategory(agent.category || "Business"); setAgentDescription(agent.description || ""); setAgentPrice(String(agent.price || 0));
  };

  return <div className="wist-auth-portal">
    <div className="wist-auth-top"><span className="wist-auth-brand"><span><Bot size={19}/></span> Wist AI</span><button onClick={onClose} aria-label="Close"><X size={19}/></button></div>
    {error && <div className="wist-auth-alert error">{error}</div>}
    {notice && <div className="wist-auth-alert success"><CheckCircle2 size={16}/>{notice}</div>}
    {!user ? <div className="wist-auth-body">
      <div className="wist-auth-icon"><ShieldCheck size={25}/></div><p className="wist-auth-kicker">SECURE ACCOUNT ACCESS</p>
      <h3>{mode === "login" ? "Welcome back" : mode === "signup" ? "Create your Wist AI account" : mode === "reset" ? "Reset your password" : "Choose a new password"}</h3>
      <p className="wist-auth-copy">{mode === "login" ? "Sign in to save your workspace and manage your AI tools. The verified owner email receives the Owner dashboard." : mode === "signup" ? "Create an account to save your workspace and access your AI tools." : mode === "reset" ? "Enter your account email and we will send you a secure password-reset link." : "Enter a new password for your Wist AI account."}</p>
      <form onSubmit={submit} className="wist-auth-form">
        {mode === "signup" && <label>Your name<input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Your name" required/></label>}
        <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/></label>
        {mode === "login" && <><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} autoComplete="current-password" placeholder="Your password" required/></label><button type="button" className="wist-auth-forgot" onClick={()=>{setMode("reset");setError("");setNotice("");}}>Forgot password?</button></>}\n        {mode === "signup" && <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} autoComplete="new-password" placeholder="At least 8 characters" required/></label>}\n        {mode === "new-password" && <label>New password<input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} minLength={8} autoComplete="new-password" placeholder="At least 8 characters" required/></label>}
        <button className="wist-auth-submit" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Update password"}</button>
      </form>
      <p className="wist-auth-switch">{mode === "login" ? "New to Wist AI?" : mode === "signup" ? "Already have an account?" : "Remembered your password?"} <button onClick={()=>{setMode(mode==="login"?"signup":"login");setError("");setNotice("");setRecoveryEmailSent(false);}}>{mode==="login"?"Create an account":"Back to sign in"}</button></p>
      <p className="wist-auth-foot">Email verification may be required. Never share your password with anyone.</p>
    </div> : <div className="wist-auth-body wist-account-body">
      <div className="wist-account-heading"><div className="wist-auth-icon"><ShieldCheck size={25}/></div><div><p className="wist-auth-kicker">SIGNED IN</p><h3>{role === "owner" ? "Owner dashboard" : "Your account"}</h3><p className="wist-auth-copy">{user.email}</p></div></div>
      {role === "owner" ? <>
        <div className="wist-owner-stats"><div><Users size={18}/><b>{agents.length}</b><small>AI agents</small></div><div><CheckCircle2 size={18}/><b>{agents.filter(a=>a.is_published).length}</b><small>Published</small></div><div><ShieldCheck size={18}/><b>Owner</b><small>Access level</small></div></div>
        <div className="wist-owner-title"><h4><Bot size={17}/> Manage AI agents</h4><span>OWNER ACCESS</span></div>
        <form className="wist-agent-form" onSubmit={saveAgent}>
          <label>Agent name<input value={agentName} onChange={e=>setAgentName(e.target.value)} placeholder="e.g. Business Growth Assistant" required/></label>
          <div className="wist-agent-form-row"><label>Category<select value={agentCategory} onChange={e=>setAgentCategory(e.target.value)}>{["Business","Writing","Research","Design","Development","Marketing","Productivity","Voice AI"].map(c=><option key={c}>{c}</option>)}</select></label><label>Monthly price (USD)<input type="number" min="0" step="0.01" value={agentPrice} onChange={e=>setAgentPrice(e.target.value)}/></label></div>
          <label>Description<textarea value={agentDescription} onChange={e=>setAgentDescription(e.target.value)} rows={2} placeholder="What does this agent do?"/></label>
          <div className="wist-agent-form-actions">{editingId && <button type="button" className="wist-agent-cancel" onClick={()=>{setEditingId(null);setAgentName("");setAgentDescription("");}}>Cancel edit</button>}<button className="wist-auth-submit" disabled={busy}>{editingId ? "Save changes" : <><Plus size={16}/> Add agent</>}</button></div>
        </form>
        <div className="wist-agent-list">{agents.map(agent=><div className="wist-agent-row" key={agent.id}><div className="wist-agent-symbol"><Bot size={18}/></div><div className="wist-agent-info"><b>{agent.name}</b><small>{agent.category || "General"} · ${Number(agent.price).toFixed(2)} / month</small></div><span className={agent.is_published?"published":"draft"}>{agent.is_published?"Published":"Draft"}</span><button title="Edit" onClick={()=>editAgent(agent)}><ArrowLeft size={15}/></button><button title={agent.is_published?"Unpublish":"Publish"} onClick={()=>togglePublish(agent)}>{agent.is_published?"Hide":"Publish"}</button><button title="Delete" onClick={()=>deleteAgent(agent)}><Trash2 size={15}/></button></div>)}</div>
      </> : <div className="wist-user-welcome"><p>Your account is active. Owner controls are available only to the verified website owner.</p><span>Access: Standard user</span></div>}
      <button className="wist-auth-logout" onClick={logout}><LogOut size={16}/> Sign out</button>
    </div>}
  </div>;
}