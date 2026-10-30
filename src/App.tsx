import React, { useMemo, useState } from "react";
import {
  Activity, ArrowUpRight, Bot, Boxes, BrainCircuit, Check, ChevronDown, CircleHelp,
  Code2, Command, Database, FileText, Globe2, LayoutDashboard, Menu, Mic2,
  Plus, Search, Settings2, ShieldCheck, Sparkles, WandSparkles, Workflow, X, Zap
} from "lucide-react";

type Tool = { title: string; description: string; icon: React.ReactNode; label: string; status: string };
const tools: Tool[] = [
  { title: "AI Website Builder", description: "Turn a plain-language brief into a responsive website plan and starter project.", icon: <Globe2 />, label: "BUILD", status: "Connect an AI provider to generate" },
  { title: "AI App Builder", description: "Plan application screens, data models, APIs and implementation steps.", icon: <Code2 />, label: "CREATE", status: "Development workspace" },
  { title: "Agent Studio", description: "Design specialist agents with instructions, knowledge and controlled tools.", icon: <Bot />, label: "CONFIGURE", status: "Agent configuration" },
  { title: "Automation Studio", description: "Map workflows, triggers, conditions and approved actions.", icon: <Workflow />, label: "DESIGN", status: "Workflow designer" },
  { title: "Voice AI", description: "Plan multilingual voice assistants and customer conversations.", icon: <Mic2 />, label: "EXPLORE", status: "Voice provider required" },
  { title: "Knowledge Hub", description: "Organize documents and prepare a permission-aware knowledge base.", icon: <Database />, label: "MANAGE", status: "Storage integration required" },
];
const nav = [
  ["Overview", <LayoutDashboard size={17}/>], ["Website Builder", <Globe2 size={17}/>],
  ["App Builder", <Code2 size={17}/>], ["Agent Studio", <Bot size={17}/>],
  ["Automation Studio", <Workflow size={17}/>], ["Voice AI", <Mic2 size={17}/>],
  ["Knowledge Hub", <Database size={17}/>], ["Integrations", <Boxes size={17}/>],
  ["Analytics", <Activity size={17}/>], ["Settings", <Settings2 size={17}/>],
] as const;

export default function App() {
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [brief, setBrief] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const filtered = useMemo(() => tools.filter(t => (t.title + " " + t.description).toLowerCase().includes(query.toLowerCase())), [query]);
  const startBuild = () => {
    if (!brief.trim()) { setNotice("Describe what you want to build first."); return; }
    setNotice("Your brief is saved in this session. Connect an AI provider and project database to enable real generation.");
  };
  return <div className="app-shell">
    <aside className={mobileOpen ? "sidebar sidebar-open" : "sidebar"}>
      <a className="brand" href="#"><span className="brand-symbol"><Sparkles size={19}/></span><span>WISTAB<span className="brand-next"> NEXT</span></span></a>
      <div className="workspace-switch"><div className="workspace-avatar">W</div><div><b>Personal workspace</b><small>Free workspace</small></div><ChevronDown size={15}/></div>
      <div className="side-label">WORKSPACE</div>
      <nav className="side-nav">{nav.map(([name, icon]) => <button key={name} className={active === name ? "nav-item active" : "nav-item"} onClick={() => {setActive(name);setMobileOpen(false);}}>{icon}<span>{name}</span>{name === "Integrations" && <span className="nav-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-icon"><Zap size={17}/></div><b>Build without limits</b><p>Explore plans for more projects and AI usage.</p><button onClick={() => setNotice("Plans and billing will be enabled after payment configuration.")}>View plans <ArrowUpRight size={14}/></button></div><button className="help-link" onClick={() => setNotice("Help center is coming in a later development phase.")}><CircleHelp size={16}/> Help & support</button><div className="profile-row"><div className="profile-avatar">AK</div><div><b>Workspace owner</b><small>Owner account</small></div><ChevronDown size={15}/></div></div>
    </aside>
    {mobileOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <b>{active}</b></div><div className="top-actions"><div className="system-status"><span/> Systems ready for setup</div><button className="icon-button" aria-label="Help" onClick={() => setNotice("Help center is coming soon.")}><CircleHelp size={18}/></button><div className="top-avatar">AK</div></div></header>
      <div className="content-wrap">
        <section className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> YOUR AI WORKSPACE</div><h1>Build something <span>extraordinary.</span></h1><p>One workspace for AI websites, apps, agents and business workflows.</p></div><button className="primary-button" onClick={() => document.getElementById("quick-build")?.scrollIntoView({behavior:"smooth"})}><Plus size={17}/> New project</button></section>
        <section className="hero-builder" id="quick-build"><div className="hero-orb"><BrainCircuit size={35}/></div><div className="hero-copy"><div className="hero-tag">WISTAB NEXT · AI BUILD STUDIO</div><h2>Your idea is the starting point.</h2><p>Describe what you want to create. WISTAB NEXT will help structure the project and prepare the right tools.</p><div className="prompt-box"><textarea value={brief} onChange={e => {setBrief(e.target.value);setNotice("");}} placeholder="Example: Build a modern booking website for a boutique hotel in Hunza..."/><div className="prompt-bottom"><span><WandSparkles size={14}/> Be clear about your goal and features</span><button onClick={startBuild}>Create project <ArrowUpRight size={16}/></button></div></div>{notice && <div className="inline-notice"><Check size={15}/>{notice}</div>}</div><div className="hero-decoration"><div className="deco-ring ring-a"/><div className="deco-ring ring-b"/><div className="deco-chip chip-a"><Globe2 size={16}/> Websites</div><div className="deco-chip chip-b"><Bot size={16}/> AI agents</div><div className="deco-chip chip-c"><Workflow size={16}/> Workflows</div></div></section>
        <section className="metrics-grid"><div className="metric-card"><span className="metric-icon"><LayoutDashboard size={18}/></span><small>Projects</small><b>0</b><em>Start your first project</em></div><div className="metric-card"><span className="metric-icon mint"><Bot size={18}/></span><small>AI agents</small><b>0</b><em>Create a specialist agent</em></div><div className="metric-card"><span className="metric-icon amber"><Workflow size={18}/></span><small>Workflows</small><b>0</b><em>Automate a repeatable task</em></div><div className="metric-card"><span className="metric-icon blue"><Activity size={18}/></span><small>Usage this month</small><b>—</b><em>Available after usage tracking setup</em></div></section>
        <section className="tools-section"><div className="section-heading"><div><div className="eyebrow">THE WISTAB TOOLKIT</div><h2>Everything you need to <span>build.</span></h2><p>Choose a workspace to start designing your next digital product.</p></div><div className="tool-search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a tool"/></div></div><div className="tool-grid">{filtered.map(tool => <article className="tool-card" key={tool.title}><div className="tool-card-top"><div className="tool-icon">{tool.icon}</div><span>{tool.label}</span></div><h3>{tool.title}</h3><p>{tool.description}</p><div className="tool-card-footer"><small>{tool.status}</small><button onClick={() => {setActive(tool.title.replace("AI ",""));setNotice(tool.status + ". This module is part of the staged build.");}} aria-label={"Open "+tool.title}><ArrowUpRight size={17}/></button></div></article>)}</div></section>
        <section className="bottom-grid"><div className="panel"><div className="panel-title"><div><h3>Recent projects</h3><p>Your latest work will appear here.</p></div><FileText size={19}/></div><div className="empty-state"><div><Command size={23}/></div><b>No projects yet</b><span>Start with an idea above to create your first project.</span></div></div><div className="panel security-panel"><div className="panel-title"><div><h3>Built with control</h3><p>Security and permissions come first.</p></div><ShieldCheck size={20}/></div><ul><li><Check size={15}/> Private workspace by design</li><li><Check size={15}/> External actions require approval</li><li><Check size={15}/> API secrets stay server-side</li><li><Check size={15}/> Usage and audit tracking planned</li></ul></div></section>
        <footer className="footer"><span>© 2026 WISTAB NEXT</span><span>Build thoughtfully. Automate responsibly.</span><a href="mailto:support@wistab.ai">Contact support</a></footer>
      </div>
    </main>
  </div>;
}
