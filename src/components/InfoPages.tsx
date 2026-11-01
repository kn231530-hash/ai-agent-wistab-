import React from "react";
import { ArrowLeft, ArrowRight, Sparkles, Bot, Database, Activity, BookOpen, Mail, Home, Info, ListChecks } from "lucide-react";

type PageKey = "home" | "about" | "features" | "how" | "activity" | "contact";
const pages: {id:PageKey;label:string;icon:React.ReactNode}[] = [
 {id:"home",label:"Home",icon:<Home size={16}/>},{id:"about",label:"About",icon:<Info size={16}/>},
 {id:"features",label:"Features",icon:<ListChecks size={16}/>},{id:"how",label:"How it works",icon:<BookOpen size={16}/>},
 {id:"activity",label:"Activity & Data",icon:<Activity size={16}/>},{id:"contact",label:"Contact",icon:<Mail size={16}/>}
];
export default function InfoPages({page,onNavigate,onBack,onForward,canGoBack,canGoForward}:{page:PageKey;onNavigate:(p:PageKey)=>void;onBack:()=>void;onForward:()=>void;canGoBack:boolean;canGoForward:boolean}) {
 const title:Record<PageKey,string>={home:"Your AI workspace for getting work done",about:"What is Wistab AI?",features:"What Wistab AI can do",how:"How Wistab AI works",activity:"Activity, records and data",contact:"Contact Wistab AI"};
 return <main style={{minHeight:"100vh",background:"#f7f8fa",color:"#18202b",fontFamily:"inherit"}}>
  <header style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"14px clamp(16px,4vw,48px)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
   <b style={{fontSize:22,color:"#202938"}}><Sparkles style={{display:"inline",verticalAlign:"middle",color:"#e87924"}}/> wistab<span style={{color:"#e87924"}}>AI</span>.</b>
   <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button disabled={!canGoBack} onClick={onBack}>← Back</button><button disabled={!canGoForward} onClick={onForward}>Forward →</button></div>
  </header>
  <nav style={{background:"#fff",padding:"10px clamp(16px,4vw,48px)",display:"flex",gap:8,flexWrap:"wrap",borderBottom:"1px solid #e5e7eb"}}>
   {pages.map(p=><button key={p.id} onClick={()=>onNavigate(p.id)} style={{border:page===p.id?"1px solid #e87924":"1px solid #e5e7eb",background:page===p.id?"#fff4eb":"#fff",borderRadius:9,padding:"9px 12px",display:"flex",gap:7,alignItems:"center",cursor:"pointer"}}>{p.icon}{p.label}</button>)}
   <button onClick={()=>onNavigate("home")} style={{marginLeft:"auto",border:0,background:"#202938",color:"white",borderRadius:9,padding:"9px 14px",cursor:"pointer"}}>Open AI workspace</button>
  </nav>
  <section style={{maxWidth:1050,margin:"0 auto",padding:"52px 20px"}}>
   <div style={{color:"#e87924",fontWeight:700,fontSize:12,letterSpacing:2}}>WISTAB AI · {page.toUpperCase()}</div><h1 style={{fontSize:"clamp(30px,5vw,48px)",lineHeight:1.1,margin:"14px 0"}}>{title[page]}</h1>
   {page==="home"&&<><p style={{fontSize:18,lineHeight:1.7,maxWidth:760}}>Wistab AI brings an AI chat workspace, an AI agent marketplace and a Smart Client Finder concept together in one place. Use the navigation above to explore each area.</p><Cards items={[["AI Assistant","Chat-style workspace for questions and writing."],["AI Agent Mall","Browse sample assistants for writing, business, research, design and coding."],["Smart Client Finder","Organize prospect examples and prepare outreach drafts."]]}/></>}
   {page==="about"&&<><p style={{fontSize:17,lineHeight:1.8}}>Wistab AI is designed as a digital productivity and business-growth platform. Its purpose is to make AI tools easier to discover and use, help people draft business content, and organize potential client outreach.</p><p style={{lineHeight:1.8}}>The platform is a work in progress. Live AI answers, user accounts, shared cloud records and verified worldwide prospect discovery require secure server-side integrations.</p></>}
   {page==="features"&&<Cards items={[["AI Chat Workspace","Chat interface, recent chat history, voice input where supported, and navigation to other workspaces."],["AI Agent Mall","Browse and filter sample agents by category, save favourites in this browser, and preview demo descriptions."],["Smart Client Finder","Review sample prospects, filter records, prepare personalized message drafts and update lead statuses."],["Business information","Read what the platform is for, what each section does and how the workflow is intended to operate."],["Navigation","Use the page menu, Back and Forward controls to move between sections."]]}/>}
   {page==="how"&&<ol style={{fontSize:17,lineHeight:2,paddingLeft:24}}><li>Open the AI Assistant or browse the AI Agent Mall.</li><li>Choose a tool or describe the task you need help with.</li><li>Use Smart Client Finder to review prospect examples and select a service.</li><li>Prepare and review an outreach message. Verify every business and contact detail yourself.</li><li>Only send outreach after your own approval; automatic sending is not enabled.</li></ol>}
   {page==="activity"&&<><div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:22,marginTop:20}}><Database size={25}/><h2>Current data and storage status</h2><p style={{lineHeight:1.8}}>Chat history and sample lead changes are currently stored in this browser using local storage. This means they are not a secure shared database, may not appear on another device, and can be lost if browser data is cleared.</p><p style={{lineHeight:1.8}}><b>Not connected yet:</b> server database, user authentication, audit logs, verified live lead provider, live AI model API and automatic outreach.</p><p style={{lineHeight:1.8}}>This page describes the current implementation honestly; it does not claim that background collection or automatic data updates are running.</p></div></>}
   {page==="contact"&&<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:22}}><h2>Get in touch</h2><p>For questions, suggestions or partnership enquiries, email the Wistab AI team.</p><a href="mailto:hello@wistab.ai" style={{color:"#c45e18",fontWeight:700}}>hello@wistab.ai</a></div>}
  </section>
  <footer style={{padding:24,textAlign:"center",color:"#6b7280",borderTop:"1px solid #e5e7eb"}}>© {new Date().getFullYear()} Wistab AI · Information reflects the current demo implementation.</footer>
 </main>;
}
function Cards({items}:{items:[string,string][]}){return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginTop:28}}>{items.map(([h,p])=><article key={h} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:20}}><Bot color="#e87924"/><h3>{h}</h3><p style={{lineHeight:1.65,color:"#596273"}}>{p}</p></article>)}</div>}
