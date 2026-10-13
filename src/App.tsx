import React, { useMemo, useState } from "react";
import {
  Search, Sparkles, Bot, Code2, PenLine, BriefcaseBusiness, Palette, BookOpen, Mic, MicOff,
  CalendarDays, ArrowUpRight, X, Send, Menu, Heart, CheckCircle2,
  ChevronDown, Headphones, ShieldCheck, Zap, Star, SlidersHorizontal, UserRound,
  ArrowRight, Grid2X2, TrendingUp, MessageCircle, QrCode
} from "lucide-react";

type Agent = {
  id: number; name: string; role: string; category: string; icon: React.ReactNode;
  description: string; tags: string[]; badge?: string; color: string; rating: string;
  uses: string; price: string;
};
const agents: Agent[] = [
  { id: 1, name: "Content Studio", role: "Writing & content assistant", category: "Writing", icon: <PenLine />, description: "Create blog drafts, product descriptions, social captions, and polished professional messages.", tags: ["Copywriting", "Blogs", "Social media"], badge: "BESTSELLER", color: "coral", rating: "4.9", uses: "2.4k", price: "$8 / month" },
  { id: 2, name: "Business Planner", role: "Business growth assistant", category: "Business", icon: <BriefcaseBusiness />, description: "Turn your ideas into practical plans, clear goals, and step-by-step business checklists.", tags: ["Strategy", "Planning", "Startups"], badge: "POPULAR", color: "gold", rating: "4.8", uses: "1.8k", price: "$10 / month" },
  { id: 3, name: "Research Helper", role: "Research & learning assistant", category: "Research", icon: <BookOpen />, description: "Break down complex topics, organize research questions, and summarize your own notes.", tags: ["Learning", "Summaries", "Analysis"], color: "blue", rating: "4.9", uses: "1.6k", price: "$8 / month" },
  { id: 4, name: "Design Brainstormer", role: "Creative design assistant", category: "Design", icon: <Palette />, description: "Explore visual directions, brand concepts, campaign ideas, and creative briefs.", tags: ["Branding", "Ideas", "Creative"], badge: "TRENDING", color: "pink", rating: "4.7", uses: "980", price: "$8 / month" },
  { id: 5, name: "Code Helper", role: "Developer assistant", category: "Development", icon: <Code2 />, description: "Understand code, plan features, troubleshoot errors, and map out website improvements.", tags: ["Coding", "Debugging", "Web"], color: "mint", rating: "4.9", uses: "3.1k", price: "$10 / month" },
  { id: 6, name: "Daily Focus", role: "Productivity assistant", category: "Productivity", icon: <CalendarDays />, description: "Turn a busy to-do list into a realistic schedule with focused priorities.", tags: ["Tasks", "Focus", "Planning"], color: "violet", rating: "4.8", uses: "1.2k", price: "$8 / month" },
];
const categories = [
  { name: "All agents", subtitle: "Explore everything", icon: <Grid2X2 /> },
  { name: "Writing", subtitle: "Content & copy", icon: <PenLine /> },
  { name: "Business", subtitle: "Grow your work", icon: <BriefcaseBusiness /> },
  { name: "Research", subtitle: "Learn faster", icon: <BookOpen /> },
  { name: "Design", subtitle: "Creative ideas", icon: <Palette /> },
  { name: "Development", subtitle: "Build & debug", icon: <Code2 /> },
  { name: "Productivity", subtitle: "Plan your day", icon: <CalendarDays /> },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All agents");
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Recommended");
  const [isListening, setIsListening] = useState(false);

  const visibleAgents = useMemo(() => {
    const list = agents.filter(a =>
      (category === "All agents" || a.category === category) &&
      (a.name + " " + a.role + " " + a.description + " " + a.tags.join(" ")).toLowerCase().includes(query.toLowerCase())
    );
    if (sortBy === "Top rated") list.sort((a, b) => Number(b.rating) - Number(a.rating));
    if (sortBy === "Most used") list.sort((a, b) => parseFloat(b.uses) - parseFloat(a.uses));
    return list;
  }, [category, query, sortBy]);

  const openAgent = (agent: Agent) => {
    setActiveAgent(agent);
    setAccountOpen(false);
    setSavedOpen(false);
    setMessages(["Hi! I am the " + agent.name + " preview. Tell me what you would like help with."]);
    setChatInput("");
  };
  const startVoiceInput = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) { window.alert("Voice input is not supported in this browser. Please try Google Chrome."); return; }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US"; recognition.interimResults = false; recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => setChatInput((previous: string) => (previous ? previous + " " : "") + event.results[0][0].transcript);
    recognition.start();
  };
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = chatInput.trim();
    if (!msg || !activeAgent) return;
    setMessages(prev => [...prev, "You: " + msg, "Demo reply: Start by defining your goal, sharing the relevant context, and describing what a useful result should look like. This preview is not connected to a live AI model yet."]);
    setChatInput("");
  };
  const chooseCategory = (name: string) => {
    setCategory(name);
    document.getElementById("agents")?.scrollIntoView({ behavior: "smooth" });
  };

  return <div className="site-shell daraz-shell">
    <div className="market-topline"><div className="container market-topline-inner"><span>Save more with Wistab AI deals</span><div><a href="#agents">SELL AN AI AGENT</a><a href="#contact">HELP & SUPPORT</a><button onClick={() => setAccountOpen(true)}>SIGN IN / REGISTER</button></div></div></div>
    <header className="site-header market-header"><div className="container market-nav">
      <a className="brand market-brand" href="#" aria-label="Wistab AI home"><span className="brand-mark"><Sparkles size={22}/></span><span>wistab<span className="brand-accent">AI</span><i>.</i></span></a>
      <form className="market-search" onSubmit={e => { e.preventDefault(); document.getElementById("agents")?.scrollIntoView({ behavior: "smooth" }); }}>
        <input aria-label="Search AI agents" placeholder="Search AI agents, tools, or tasks..." value={query} onChange={e => setQuery(e.target.value)}/>
        <button type="submit" aria-label="Search"><Search size={21}/></button>
      </form>
      <button className="market-action" onClick={() => setSavedOpen(true)}><span className="market-action-icon"><Heart size={20}/>{saved.length > 0 && <i>{saved.length}</i>}</span><span>Saved agents</span></button>
      <button className="market-action qr-action" onClick={() => setQrOpen(true)} aria-label="Show website QR code"><QrCode size={20}/><span>QR Code</span></button>
      <button className="market-action account-action" onClick={() => setAccountOpen(true)}><UserRound size={20}/><span>Account</span><ChevronDown size={14}/></button>
      <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X/> : <Menu/>}</button>
    </div>
    <div className={"market-category-nav " + (mobileMenu ? "market-nav-open" : "")}><div className="container market-category-inner">
      <a href="#categories" className="all-categories"><Grid2X2 size={17}/> Categories <ChevronDown size={14}/></a>
      <a href="#agents">AI Agent Mall</a><a href="#agents" onClick={() => setCategory("Business")}>Business Tools</a><a href="#agents" onClick={() => setCategory("Writing")}>Writing & Content</a><a href="#agents" onClick={() => setCategory("Development")}>Coding Helpers</a><a href="#creators">Become a Creator</a>
      <span className="category-nav-promo"><Zap size={14}/> Find your next AI teammate</span>
    </div></div></header>

    <main>
      <section className="market-hero-section"><div className="container">
        <div className="market-hero-layout">
          <aside className="market-side-categories"><div className="side-category-heading">Shop by category</div>{categories.slice(1).map(c => <button key={c.name} onClick={() => chooseCategory(c.name)} className={category === c.name ? "side-category active" : "side-category"}><span>{c.icon}</span>{c.name}<ArrowRight size={14}/></button>)}</aside>
          <div className="market-hero-banner"><div className="market-hero-copy"><span className="market-eyebrow"><Sparkles size={14}/> YOUR AI WORKSPACE</span><h1>Welcome to<br/><em>Wistab AI.</em></h1><p>Discover powerful AI agents designed to simplify your work, boost productivity, and grow your business.</p><div className="market-hero-actions"><button className="market-primary-btn" onClick={() => document.getElementById("agents")?.scrollIntoView({behavior:"smooth"})}>Explore AI agents <ArrowRight size={17}/></button><button className="market-how-btn" onClick={() => document.getElementById("categories")?.scrollIntoView({behavior:"smooth"})}><span>▷</span> How it works</button></div><div className="hero-delivery-note"><CheckCircle2 size={15}/> Easy to explore <span>•</span> Free demos available</div></div>
            <div className="market-hero-art" aria-hidden="true"><div className="hero-sunburst"></div><div className="hero-product-orbit orbit-a"></div><div className="hero-product-orbit orbit-b"></div><div className="hero-bot-tile"><Bot size={78}/><Sparkles className="bot-sparkle" size={26}/></div><div className="hero-floating-label label-one"><span className="label-icon"><PenLine size={17}/></span><span><b>Content Studio</b><small>Write faster</small></span></div><div className="hero-floating-label label-two"><span className="label-icon label-purple"><Code2 size={17}/></span><span><b>Code Helper</b><small>Build smarter</small></span></div><div className="hero-sticker">AI<br/>MALL</div></div>
          </div>
        </div>
        <div className="market-promise-row"><div><span className="promise-icon"><ShieldCheck/></span><span><b>Curated assistants</b><small>Explore useful AI tools</small></span></div><div><span className="promise-icon"><Zap/></span><span><b>Fast discovery</b><small>Find your perfect match</small></span></div><div><span className="promise-icon"><Headphones/></span><span><b>Friendly support</b><small>Here to help you get started</small></span></div><div><span className="promise-icon"><CheckCircle2/></span><span><b>Try before you choose</b><small>Preview agent experiences</small></span></div></div>
      </div></section>

      <section className="market-section" id="categories"><div className="container"><div className="market-section-heading"><div><span className="market-kicker"><Sparkles size={14}/> FIND WHAT YOU NEED</span><h2>Shop by <em>category</em></h2><p>Pick a category and discover your next useful AI tool.</p></div><button className="market-text-link" onClick={() => chooseCategory("All agents")}>View all categories <ArrowRight size={16}/></button></div>
        <div className="market-category-grid">{categories.slice(1).map((c, i) => <button key={c.name} className={"market-category-card category-tone-" + i + (category === c.name ? " chosen" : "")} onClick={() => chooseCategory(category === c.name ? "All agents" : c.name)}><span className="market-category-icon">{c.icon}</span><b>{c.name}</b><small>{c.subtitle}</small><span className="market-category-arrow"><ArrowUpRight size={15}/></span></button>)}</div>
      </div></section>

      <section className="market-section marketplace-listings" id="agents"><div className="container">
        <div className="market-section-heading listings-heading"><div><span className="market-kicker">THE AI AGENT MALL</span><h2>Popular AI <em>agents</em></h2><p>Browse assistants, compare what they do, and try a demo.</p></div><div className="market-listing-side"><span><TrendingUp size={15}/> Trending now</span><label className="market-sort"><SlidersHorizontal size={15}/><select aria-label="Sort agents" value={sortBy} onChange={e => setSortBy(e.target.value)}><option>Recommended</option><option>Top rated</option><option>Most used</option></select></label></div></div>
        <div className="market-filter-strip"><div className="market-filter-chips">{["All agents", ...categories.slice(1).map(c => c.name)].map(c => <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="market-result-count">{visibleAgents.length} agents found</div></div>
        {visibleAgents.length ? <div className="market-product-grid">{visibleAgents.map(agent => <article className="market-product-card" key={agent.id}>
          <div className={"market-product-image product-" + agent.color}><img className="agent-photo" loading="lazy" alt="" src={([ "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80" ])[agent.id - 1]} /><div className="product-image-top"><span className="product-type-label">WISTAB AI</span><span className="agent-price-badge">{agent.price}</span><button className={"market-heart " + (saved.includes(agent.id) ? "is-saved" : "")} aria-label={saved.includes(agent.id) ? "Remove saved agent" : "Save agent"} onClick={() => setSaved(prev => prev.includes(agent.id) ? prev.filter(id => id !== agent.id) : [...prev, agent.id])}><Heart size={19} fill={saved.includes(agent.id) ? "currentColor" : "none"}/></button></div><div className="product-art-icon">{agent.icon}<Sparkles className="product-art-sparkle" size={19}/></div>{agent.badge && <span className="product-ribbon">{agent.badge}</span>}<span className="product-image-caption">{agent.category.toUpperCase()} ASSISTANT</span></div>
          <div className="market-product-info"><div className="product-category-label">{agent.category}</div><h3>{agent.name}</h3><p className="product-role">{agent.role}</p><p className="product-description">{agent.description}</p><div className="product-tags">{agent.tags.slice(0,2).map(tag => <span key={tag}>{tag}</span>)}</div><div className="product-rating-row"><span className="product-rating"><Star size={13} fill="currentColor"/> {agent.rating}</span><span className="product-divider">|</span><span>{agent.uses} uses</span><span className="product-available"><i/> Demo</span></div><div className="product-price-row"><div><strong>{agent.price}</strong><small>Preview before choosing</small></div><button className="market-try-btn" onClick={() => openAgent(agent)}>Try now <ArrowUpRight size={15}/></button></div></div>
        </article>)}</div> : <div className="market-empty"><Search size={28}/><h3>No agents found</h3><p>Try another keyword or category.</p><button className="market-primary-btn" onClick={() => {setQuery("");setCategory("All agents");}}>Clear filters</button></div>}
        <div className="market-view-more"><span>Showing {visibleAgents.length} of {agents.length} sample agents</span><button onClick={() => {setQuery("");setCategory("All agents");}}>Explore all agents <ArrowRight size={15}/></button></div>
      </div></section>

      <section className="market-promo-section" id="creators"><div className="container"><div className="market-promo-banner"><div className="promo-badge"><Bot size={31}/></div><div className="promo-copy"><span className="market-kicker">FOR BUILDERS & CREATORS</span><h2>Have an AI agent to share?</h2><p>Bring your assistant to the Wistab AI marketplace and help people work smarter.</p></div><a href="mailto:hello@wistab.ai?subject=List%20an%20AI%20Agent" className="market-primary-btn">List your agent <ArrowUpRight size={16}/></a><Sparkles className="promo-decoration" size={100}/></div></div></section>
      <section className="market-support-section" id="contact"><div className="container market-support-inner"><div><span className="market-kicker">NEED A HAND?</span><h2>We’re here to help.</h2><p>Have a question or a suggestion for the marketplace? Get in touch with our team.</p></div><a className="market-support-link" href="mailto:hello@wistab.ai"><MessageCircle size={20}/><span><b>Contact Wistab AI</b><small>hello@wistab.ai</small></span><ArrowUpRight size={17}/></a></div></section>
      <section className="market-about-strip" id="about"><div className="container"><Sparkles size={19}/><p><b>About Wistab AI:</b> A friendly marketplace for discovering AI assistants across writing, business, research, design, development, and productivity.</p><a href="#agents">Explore the mall <ArrowRight size={14}/></a></div></section>
    </main>

    <footer className="market-footer"><div className="container market-footer-main"><div className="market-footer-brand"><a className="brand market-brand" href="#"><span className="brand-mark"><Sparkles size={20}/></span><span>wistab<span className="brand-accent">AI</span><i>.</i></span></a><p>Your marketplace for helpful AI teammates. Discover, explore, and find a new way to get things done.</p></div><div className="market-footer-links"><div><b>Marketplace</b><a href="#agents">Explore agents</a><a href="#categories">Categories</a><a href="#creators">For creators</a></div><div><b>Help & information</b><a href="#about">About Wistab AI</a><a href="#contact">Contact support</a><a href="mailto:hello@wistab.ai">Email us</a></div></div></div><div className="container market-footer-bottom"><span>© {new Date().getFullYear()} Wistab AI. All rights reserved.</span><span>Sample agent listings · Live AI and accounts require backend setup.</span></div></footer>

    {(activeAgent || accountOpen || savedOpen || qrOpen) && <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget){setActiveAgent(null);setAccountOpen(false);setSavedOpen(false);setQrOpen(false);}}}><div className="dialog market-dialog" role="dialog" aria-modal="true" aria-label={qrOpen ? "Website QR code" : accountOpen ? "Wistab account" : savedOpen ? "Saved agents" : activeAgent?.name}>
      <div className="dialog-heading"><div><span className="market-kicker">{qrOpen ? "SCAN TO VISIT" : accountOpen ? "YOUR WISTAB ACCOUNT" : savedOpen ? "YOUR SHORTLIST" : "AGENT PREVIEW"}</span><h2>{qrOpen ? "Wistab AI QR Code" : accountOpen ? "Welcome to Wistab AI" : savedOpen ? "Saved agents" : activeAgent?.name}</h2></div><button className="dialog-close" aria-label="Close" onClick={() => {setActiveAgent(null);setAccountOpen(false);setSavedOpen(false);setQrOpen(false);}}><X/></button></div>
      {qrOpen ? <div className="website-qr-content"><p className="dialog-intro">Scan this QR code with your phone camera to open the Wistab AI marketplace.</p><img className="website-qr-image" src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=https%3A%2F%2Fai-agent-wistab-x4py.vercel.app%2F" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "https://quickchart.io/qr?text=https%3A%2F%2Fai-agent-wistab-x4py.vercel.app%2F&size=240"; }} alt="QR code linking to the Wistab AI marketplace website"/><a className="website-qr-url" href="https://ai-agent-wistab-x4py.vercel.app/" target="_blank" rel="noreferrer">ai-agent-wistab-x4py.vercel.app</a><a className="market-primary-btn dialog-wide" href="https://ai-agent-wistab-x4py.vercel.app/" target="_blank" rel="noreferrer">Open website <ArrowUpRight size={16}/></a><button className="market-secondary-btn dialog-wide" onClick={() => {setQrOpen(false);}}>Done</button></div> : accountOpen ? <><p className="dialog-intro">Sign-in is not connected yet. Authentication and a database must be configured before accounts can be created or saved across devices.</p><button className="market-primary-btn dialog-wide" onClick={() => setAccountOpen(false)}>Got it</button></> : savedOpen ? <><p className="dialog-intro">Your saved agents are kept in this browser session for now.</p>{saved.length ? <div className="saved-agent-list">{agents.filter(a => saved.includes(a.id)).map(a => <div className="saved-agent-row" key={a.id}><span className={"saved-agent-icon product-" + a.color}>{a.icon}</span><span><b>{a.name}</b><small>{a.category} · {a.price}</small></span><button onClick={() => openAgent(a)}>Try <ArrowUpRight size={14}/></button></div>)}</div> : <div className="saved-empty"><Heart size={25}/><p>You haven’t saved any agents yet.</p><small>Tap the heart on an agent card to save it here.</small></div>}<button className="market-primary-btn dialog-wide" onClick={() => {setSavedOpen(false);document.getElementById("agents")?.scrollIntoView({behavior:"smooth"});}}>Explore agents</button></> : <><p className="dialog-intro">Try a sample conversation with {activeAgent?.name}. This preview is not connected to a live AI model yet.</p><div className="chat-log">{messages.map((m,i)=><div key={i} className={m.startsWith("You:") ? "chat-bubble user-bubble" : "chat-bubble"}>{m}</div>)}</div><form className="chat-form" onSubmit={sendMessage}><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Describe what you need..." required/><button className={"voice-input-btn " + (isListening ? "listening" : "")} type="button" onClick={startVoiceInput} aria-label={isListening ? "Listening for voice input" : "Use microphone"} title={isListening ? "Listening…" : "Speak your message"}>{isListening ? <MicOff size={17}/> : <Mic size={17}/>}</button><button className="market-primary-btn" type="submit" aria-label="Send message"><Send size={17}/></button></form></>}
    </div></div>}
  </div>;
}
