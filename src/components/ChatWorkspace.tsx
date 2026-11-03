import React, { useEffect, useState } from "react";
import { Sparkles, Plus, MessageSquare, Settings, Search, Mic, Send, Bot, Store, Users, PanelLeftClose, PanelLeft, Trash2, ArrowLeft, ArrowRight } from "lucide-react";

type Message = { role: "user" | "assistant"; text: string };
type Chat = { id: string; title: string; messages: Message[] };

export default function ChatWorkspace({ onOpenMall, onOpenClientFinder, onBack, onForward, canGoBack, canGoForward, onOpenInfo }: { onOpenMall: () => void; onOpenClientFinder: () => void; onOpenInfo: (page: "home" | "about" | "features" | "how" | "activity" | "contact") => void; onBack: () => void; onForward: () => void; canGoBack: boolean; canGoForward: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [chats, setChats] = useState<Chat[]>(() => {
    try { return JSON.parse(localStorage.getItem("wistab-chat-history") || "[]"); } catch { return []; }
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeChat = chats.find(c => c.id === activeId) || null;
  const messages = activeChat?.messages || [];

  useEffect(() => { localStorage.setItem("wistab-chat-history", JSON.stringify(chats)); }, [chats]);

  const newChat = () => { setActiveId(null); setInput(""); };
  const [sending, setSending] = useState(false);
  const send = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    const id = activeId || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
    const userMessage: Message = { role: "user", text };
    setChats(previous => {
      const existing = previous.find(c => c.id === id);
      if (existing) return previous.map(c => c.id === id ? { ...c, messages: [...c.messages, userMessage] } : c);
      return [{ id, title: text.slice(0, 42), messages: [userMessage] }, ...previous];
    });
    setActiveId(id);
    setInput("");
    setSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "The AI request failed. Please try again.");
      const reply: Message = { role: "assistant", text: data.reply || "I couldn't generate a response. Please try again." };
      setChats(previous => previous.map(c => c.id === id ? { ...c, messages: [...c.messages, reply] } : c));
    } catch (error: any) {
      const reply: Message = { role: "assistant", text: error?.message || "Unable to connect to Wist AI. Please try again." };
      setChats(previous => previous.map(c => c.id === id ? { ...c, messages: [...c.messages, reply] } : c));
    } finally {
      setSending(false);
    }
  };
  const startVoice = () => {
    const API = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!API) { window.alert("Voice input is not supported in this browser. Please use Google Chrome."); return; }
    const recognition = new API();
    recognition.lang = "en-US"; recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event: any) => setInput(value => value ? value + " " + event.results[0][0].transcript : event.results[0][0].transcript);
    recognition.start();
  };
  const removeChat = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setChats(previous => previous.filter(c => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  return <div className="wistab-chat-app">
    <aside className={"wistab-chat-sidebar " + (sidebarOpen ? "is-open" : "is-closed")}>
      <div className="wistab-chat-brand"><span><Sparkles size={23}/></span><b>wist<span>AI</span>.</b><button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><PanelLeftClose size={19}/></button></div>
      <button className="wistab-new-chat" onClick={newChat}><Plus size={18}/> New chat</button>
      <div className="wistab-sidebar-label">WORKSPACE</div>
      <button className="wistab-side-link active"><MessageSquare size={17}/> AI Assistant</button>
      <button className="wistab-side-link" onClick={onOpenMall}><Store size={17}/> AI Agent Mall</button>
      <button className="wistab-side-link" onClick={onOpenClientFinder}><Users size={17}/> Smart Client Finder</button>
      <div className="wistab-sidebar-label">INFORMATION</div>
      <button className="wistab-side-link" onClick={() => onOpenInfo("about")}>About Wist AI</button>
      <button className="wistab-side-link" onClick={() => onOpenInfo("features")}>Features</button>
      <button className="wistab-side-link" onClick={() => onOpenInfo("how")}>How it works</button>
      <button className="wistab-side-link" onClick={() => onOpenInfo("activity")}>Activity & Data</button>
      <button className="wistab-side-link" onClick={() => onOpenInfo("contact")}>Contact</button>
      <div className="wistab-sidebar-label history-label">RECENT CHATS</div>
      <div className="wistab-history">{chats.map(chat => <button key={chat.id} className={"wistab-history-item " + (chat.id === activeId ? "selected" : "")} onClick={() => setActiveId(chat.id)}><MessageSquare size={14}/><span>{chat.title}</span><i onClick={e => removeChat(chat.id, e)}><Trash2 size={13}/></i></button>)}</div>
      <div className="wistab-sidebar-bottom"><button className="wistab-side-link"><Settings size={17}/> Settings</button><div className="wistab-profile"><div>AK</div><span><b>Wist AI User</b><small>Personal workspace</small></span></div></div>
    </aside>
    <section className="wistab-chat-main">
      <header className="wistab-chat-topbar"><div className="wistab-navigation-controls"><button className="wistab-icon-btn wistab-history-nav" onClick={onBack} disabled={!canGoBack} aria-label="Go back" title="Go back"><ArrowLeft size={18}/></button><button className="wistab-icon-btn wistab-history-nav" onClick={onForward} disabled={!canGoForward} aria-label="Go forward" title="Go forward"><ArrowRight size={18}/></button></div>{!sidebarOpen && <button className="wistab-icon-btn" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><PanelLeft size={19}/></button>}<div className="wistab-model-name"><span><Sparkles size={16}/></span><b>Wist AI</b><small>Assistant</small></div><button className="wistab-agent-mall-link" onClick={onOpenMall}><Store size={16}/> Explore AI Agent Mall</button></header>
      <div className="wistab-chat-content">
        {messages.length === 0 ? <div className="wistab-welcome"><div className="wistab-welcome-icon"><Sparkles size={28}/></div><p className="wistab-overline">YOUR AI WORKSPACE</p><h1>How can I help<br/><em>you today?</em></h1><p className="wistab-welcome-sub">Ask Wist AI anything, explore ideas, or get help with your work.</p><div className="wistab-suggestions"><button onClick={() => setInput("Help me build a professional website")}> <span>✦</span> Build a professional website</button><button onClick={() => setInput("Create a business growth plan")}> <span>↗</span> Create a business plan</button><button onClick={() => setInput("Help me find potential clients")}> <span>◎</span> Find potential clients</button><button onClick={() => setInput("Write content for my business")}> <span>✎</span> Write business content</button></div></div> :
          <div className="wistab-message-list">{messages.map((message, index) => <div key={index} className={"wistab-message-row " + message.role}><div className="wistab-message-avatar">{message.role === "assistant" ? <Sparkles size={17}/> : "AK"}</div><div className="wistab-message-body"><b>{message.role === "assistant" ? "Wist AI" : "You"}</b><p>{message.text}</p></div></div>)}</div>}
      </div>
      <div className="wistab-composer-wrap"><form className="wistab-composer" onSubmit={send}><textarea rows={1} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder={sending ? "Wist AI is thinking..." : "Message Wist AI..."} aria-label="Message Wist AI"/><div className="wistab-composer-actions"><span>Press Enter to send · Shift + Enter for a new line</span><div><button type="button" className={"wistab-mic-btn " + (listening ? "listening" : "")} onClick={startVoice} aria-label="Use microphone"><Mic size={18}/></button><button type="submit" className="wistab-send-btn" disabled={!input.trim() || sending} aria-label="Send message"><Send size={17}/></button></div></div></form><p className="wistab-disclaimer"><Bot size={13}/> Wist AI preview · Live AI model connection is required for real AI answers.</p></div>
    </section>
  </div>;
}
