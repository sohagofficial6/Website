
import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  ChevronRight, 
  Menu, 
  X,
  ExternalLink,
  ShieldCheck,
  Globe,
  ArrowRight,
  MessageSquare,
  Send,
  Loader2,
  Bot,
  Sparkles,
  Trash2,
  Cpu,
  BarChart3
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { EXPERIENCES, SKILL_CATEGORIES, PROJECTS, ICONS, AI_SYSTEM_PROMPT, SUGGESTED_PROMPTS } from './constants';

// --- Components ---

const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, className: "transition-all duration-1000 opacity-0 translate-y-10" };
};

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Welcome! I'm Sohag's AI representative. How can I help you navigate his professional background today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customMsg?: string) => {
    const textToSend = (customMsg || input).trim();
    if (!textToSend || isLoading) return;
    
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Corrected initialization to use process.env.API_KEY directly as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const streamResponse = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: newMessages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: AI_SYSTEM_PROMPT,
          temperature: 0.8,
          maxOutputTokens: 500,
        }
      });

      setMessages(prev => [...prev, { role: 'bot', text: '' }]);
      
      let fullText = '';
      for await (const chunk of streamResponse) {
        // Access text property directly as per guidelines
        const chunkText = chunk.text || '';
        fullText += chunkText;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'bot', text: fullText };
          return updated;
        });
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "My neural link is currently fluctuating. Please try again or email Sohag!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'bot', text: "Chat history cleared. How else can I assist you?" }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-slate-900 border border-slate-800 w-[350px] sm:w-[420px] h-[600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up duration-300">
          <div className="bg-slate-800/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                  <Bot size={22} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-black text-white leading-none">Sohag Intelligence</p>
                <div className="flex items-center mt-1 text-[10px] text-yellow-500 font-bold uppercase tracking-wider">
                  <Sparkles size={10} className="mr-1" />
                  Online
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={clearChat} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto space-y-4 bg-slate-950/80 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-yellow-500 text-slate-950 font-bold rounded-br-none shadow-lg' 
                    : 'bg-slate-800/50 text-slate-200 rounded-bl-none border border-slate-700'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {messages.length < 3 && !isLoading && (
              <div className="pt-4 space-y-2">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3 ml-1">Quick Questions</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button 
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-left px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 hover:border-yellow-500/50 hover:text-yellow-500 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-1 focus-within:border-yellow-500/50 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about my background..."
                className="flex-grow bg-transparent border-none py-3 text-sm text-white focus:outline-none"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-slate-950 hover:bg-yellow-400 disabled:opacity-50 transition-all shadow-lg shadow-yellow-500/10"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:scale-105 hover:rotate-3 transition-all duration-300 active:scale-95"
        >
          <div className="absolute inset-0 bg-yellow-400 rounded-2xl animate-ping opacity-20 group-hover:hidden"></div>
          <MessageSquare size={28} className="relative z-10" />
        </button>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'ABOUT', href: '#about' },
    { name: 'EXPERIENCE', href: '#experience' },
    { name: 'SKILLS', href: '#skills' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 py-3' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <a href="#" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center font-black text-slate-950 text-xl shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-transform group-hover:scale-105">S</div>
                <span className="text-xl font-black tracking-tight text-white group-hover:text-yellow-500 transition-colors">SOHAG<span className="text-yellow-500">.</span></span>
              </a>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-[11px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-[0.25em]">
                  {link.name}
                </a>
              ))}
              <a href="#contact" className="px-6 py-2.5 bg-yellow-500 text-slate-950 rounded-md text-[11px] font-black uppercase tracking-[0.2em] hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg shadow-yellow-500/20">
                HIRE ME
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-400 hover:text-white transition-colors" aria-label="Toggle Menu">
                {isOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 top-[88px] bg-slate-950/98 backdrop-blur-2xl md:hidden transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="flex flex-col items-center justify-center h-full space-y-10 p-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-4xl font-black text-slate-300 hover:text-yellow-500 transition-colors uppercase"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a href="#contact" onClick={() => setIsOpen(false)} className="px-10 py-5 bg-yellow-500 text-slate-950 rounded-xl text-xl font-black uppercase tracking-widest">
                HIRE ME
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[180px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-10 animate-slide-in-left">
            <span className="flex h-2 w-2 rounded-full bg-yellow-500 mr-2 shadow-[0_0_10px_rgba(234,179,8,1)]"></span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">OPERATIONAL EXCELLENCE @ BINANCE</span>
          </div>
          <h1 className="text-6xl sm:text-9xl font-black text-white mb-10 leading-[0.85] tracking-tighter animate-slide-up delay-100 uppercase">
            ENGINEERING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">CRYPTO TRUST.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 mb-14 leading-relaxed max-w-2xl animate-slide-up delay-300 font-medium">
            Hi, I'm <span className="text-white font-black">Sohag</span>. I build and optimize the world's most robust crypto infrastructures through strategic operations and deep blockchain expertise.
          </p>
          <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-6 animate-slide-up delay-500">
            <a href="#experience" className="px-12 py-5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl flex items-center justify-center transition-all group hover:scale-105 shadow-[0_10px_40px_rgba(234,179,8,0.25)] text-sm uppercase tracking-widest">
              MY EXPERIENCE
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="px-12 py-5 bg-slate-900/50 hover:bg-slate-800 text-white font-black rounded-xl border border-slate-700 flex items-center justify-center transition-all hover:border-slate-500 text-sm uppercase tracking-widest">
              LET'S TALK
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const reveal = useReveal();
  return (
    <section id="about" className="py-40 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8" {...reveal}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border border-slate-800 group relative">
              <img src="https://img.sanishtech.com/u/09bc2c7ad825571ad2e46b76f14d73cd.jpg"
                alt="Sohag Profile" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="absolute -bottom-10 -left-10 p-10 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl hidden md:block">
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-yellow-500/20 rounded-2xl text-yellow-500">
                  <ShieldCheck size={44} />
                </div>
                <div>
                  <p className="text-5xl font-black text-white leading-none">50M+</p>
                  <p className="text-[11px] text-slate-500 uppercase font-black tracking-[0.25em] mt-3">Users Impacted</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em] mb-6">BACKGROUND</h2>
            <h3 className="text-4xl sm:text-6xl font-black text-white mb-10 leading-[1.1] tracking-tight">Bridging code and compliance.</h3>
            <p className="text-slate-400 text-xl mb-8 leading-relaxed font-medium">
              My career has been defined by a singular mission: to professionalize the wild west of crypto. Starting in strategic fintech research, I quickly moved to <span className="text-white font-bold">Binance</span>, where I now manage complex operations that keep millions of users safe.
            </p>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed">
              I don't just understand the blockchain; I understand the human and regulatory systems that surround it. My work ensures that decentralized innovation can thrive within global financial structures.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-yellow-500">
                  <Globe size={24} />
                </div>
                <h4 className="text-white font-black text-xl uppercase tracking-tighter">Global Impact</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">Scaling regional initiatives across APAC with localized expertise and global vision.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-yellow-500">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="text-white font-black text-xl uppercase tracking-tighter">Asset Security</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">Protecting platform integrity through advanced transaction monitoring and risk modeling.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  const reveal = useReveal();
  return (
    <section id="experience" className="py-40 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8" {...reveal}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-32">
          <div>
            <h2 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em] mb-6">THE JOURNEY</h2>
            <h3 className="text-4xl sm:text-7xl font-black text-white uppercase tracking-tighter">Career Timeline.</h3>
          </div>
          <div className="h-[2px] bg-slate-800 flex-grow mx-16 hidden lg:block"></div>
        </div>
        
        <div className="space-y-24 relative before:absolute before:left-0 md:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-slate-800">
          {EXPERIENCES.map((exp, idx) => (
            <div key={exp.id} className={`relative flex flex-col md:flex-row items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="absolute left-[-4px] md:left-1/2 md:translate-x-[-50%] w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,1)] z-10"></div>
              
              <div className="md:w-1/2 w-full md:px-16 mb-6 md:mb-0">
                <div className={`flex flex-col ${idx % 2 === 0 ? 'md:items-start' : 'md:items-end'}`}>
                  <span className="text-yellow-500 font-mono text-xs tracking-[0.3em] mb-3 uppercase">{exp.period}</span>
                  <h4 className="text-3xl font-black text-white uppercase tracking-tight">{exp.company}</h4>
                </div>
              </div>
              
              <div className="md:w-1/2 w-full md:px-16">
                <div className="p-10 rounded-[2.5rem] bg-slate-900 border border-slate-800 hover:border-yellow-500/50 transition-all duration-500 group shadow-2xl">
                  <h5 className="text-2xl font-black text-white mb-8 group-hover:text-yellow-500 transition-colors uppercase tracking-tight">{exp.role}</h5>
                  <ul className="space-y-6 mb-10">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-yellow-500 mr-4 mt-1 flex-shrink-0" />
                        <span className="text-slate-400 text-[15px] leading-relaxed font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    {exp.skills.map((skill) => (
                      <span key={skill} className="px-4 py-1.5 bg-slate-950 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-slate-800 group-hover:border-yellow-500/20 transition-all">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const reveal = useReveal();
  return (
    <section id="skills" className="py-40 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8" {...reveal}>
        <div className="text-center mb-32">
          <h2 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em] mb-6">CORE STRENGTHS</h2>
          <h3 className="text-4xl sm:text-7xl font-black text-white uppercase tracking-tighter">Technical Arsenal.</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {SKILL_CATEGORIES.map((category, idx) => (
            <div key={category.title} className="group p-12 rounded-[2.5rem] bg-slate-900 border border-slate-800 hover:bg-slate-800/40 transition-all duration-700 hover:-translate-y-3 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
              <div className="mb-10 p-6 bg-slate-950 rounded-3xl border border-slate-800 text-yellow-500 group-hover:scale-110 transition-transform group-hover:border-yellow-500/30">
                 {/* Fixed missing icons by ensuring Cpu and BarChart3 are imported */}
                 {idx === 0 ? <Cpu size={40} /> : idx === 1 ? <BarChart3 size={40} /> : <ShieldCheck size={40} />}
              </div>
              <h4 className="text-2xl font-black text-white mb-10 relative z-10 uppercase tracking-tight">{category.title}</h4>
              <div className="flex flex-wrap justify-center gap-3 relative z-10">
                {category.skills.map((skill) => (
                  <span key={skill} className="px-5 py-2 bg-slate-950 text-slate-400 text-xs font-bold rounded-xl border border-slate-800 group-hover:border-yellow-500/20 transition-all group-hover:text-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const reveal = useReveal();
  return (
    <section id="projects" className="py-40 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-yellow-500/5 blur-[150px] rounded-full -z-10 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8" {...reveal}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-10">
          <div className="max-w-3xl">
            <h2 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em] mb-6">INITIATIVES</h2>
            <h3 className="text-4xl sm:text-7xl font-black text-white mb-8 uppercase tracking-tighter leading-none">Built & Shipped.</h3>
            <p className="text-slate-400 text-xl font-medium">A deep dive into the projects that define my professional impact in the Web3 space.</p>
          </div>
          <a href="#" className="text-yellow-500 font-black flex items-center hover:translate-x-3 transition-all uppercase tracking-[0.2em] text-sm group">
            EXPLORE ALL <ArrowRight className="ml-3 group-hover:animate-bounce-x" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {PROJECTS.map((project) => (
            <div key={project.id} className="group p-12 rounded-[3rem] bg-slate-900 border border-slate-800 hover:border-yellow-500/50 transition-all duration-700 h-full flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div>
                <div className="mb-10 flex justify-between items-start">
                  <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform shadow-inner border border-slate-800 group-hover:border-yellow-500/30">
                    <Globe size={32} />
                  </div>
                  <div className="px-4 py-1.5 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-yellow-500/20">
                    Active
                  </div>
                </div>
                <h4 className="text-3xl font-black text-white mb-6 leading-none uppercase tracking-tight">{project.title}</h4>
                <p className="text-slate-400 text-[15px] leading-relaxed mb-10 font-medium">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-10 border-t border-slate-800">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black group-hover:text-yellow-500/60 transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const reveal = useReveal();
  return (
    <section id="contact" className="py-40 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8" {...reveal}>
        <div className="max-w-6xl mx-auto bg-slate-900 rounded-[4rem] border border-slate-800 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-16 sm:p-24 bg-gradient-to-br from-yellow-500 to-yellow-600 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
              <div className="relative z-10">
                <h2 className="text-5xl sm:text-7xl font-black text-slate-950 mb-10 leading-[0.9] uppercase tracking-tighter">Start a <br />Conversation.</h2>
                <p className="text-slate-900/80 text-xl mb-16 font-bold">
                  Looking for strategic advice on market growth or crypto compliance? My inbox is always open.
                </p>
              </div>
              
              <div className="space-y-8 relative z-10">
                <a href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJZdkhCBmwthKJGsDgcpscJnQqqHMGfhdHgZfHGzPHtwtgllkLRszMXXGLpJFbTlMRQsxMg" className="flex items-center space-x-5 group">
                  <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-yellow-500 transition-transform group-hover:scale-110 shadow-xl">
                    <Mail size={28} />
                  </div>
                  <span className="text-slate-950 font-black text-lg tracking-wide group-hover:translate-x-1 transition-transform uppercase">sohagofficial6@gmail.com</span>
                </a>
                <div className="flex space-x-5 pt-6">
                  <a href="#" className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-yellow-500 hover:scale-110 transition-transform shadow-xl"><Linkedin size={28} /></a>
                  <a href="#" className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-yellow-500 hover:scale-110 transition-transform shadow-xl"><Twitter size={28} /></a>
                  <a href="https://github.com/sohagofficial6" className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-yellow-500 hover:scale-110 transition-transform shadow-xl"><Github size={28} /></a>
                </div>
              </div>
            </div>
            
            <div className="p-16 sm:p-24 bg-slate-900">
              <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">FULL NAME</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-[1.5rem] p-6 text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-slate-700" placeholder="Jane Cooper" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">WORK EMAIL</label>
                  <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-[1.5rem] p-6 text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-slate-700" placeholder="jane@company.com" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">YOUR REQUEST</label>
                  <textarea rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-[1.5rem] p-6 text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none placeholder:text-slate-700" placeholder="Let me know how I can help..."></textarea>
                </div>
                <button className="w-full py-6 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-[1.5rem] transition-all flex items-center justify-center shadow-2xl hover:shadow-yellow-500/30 uppercase tracking-[0.2em] text-sm">
                  SEND TRANSMISSION
                  <ArrowRight className="ml-3 w-6 h-6" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center font-black text-slate-950 text-xl shadow-[0_0_15px_rgba(234,179,8,0.2)]">S</div>
            <span className="font-black text-white text-2xl tracking-tighter">SOHAG<span className="text-yellow-500">.</span></span>
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] mb-3">DESIGNED FOR THE FUTURE.</p>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} SOHAG. PROOF OF WORK.
            </p>
          </div>
          
          <div className="flex space-x-10">
            <a href="#" className="text-slate-600 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.3em]">Privacy</a>
            <a href="#" className="text-slate-600 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.3em]">Terms</a>
            <a href="#" className="text-slate-600 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.3em]">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-slate-950 selection:bg-yellow-500 selection:text-slate-950 overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <ChatAssistant />
    </div>
  );
}

export default App;
