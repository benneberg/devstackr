import React, { useState, useRef } from 'react';
import { Search, Sparkles, Globe, MessageSquare, Bot, User, Send, Loader2, Code2, Terminal, ShieldAlert } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

const EXPERTS = [
  { id: 'web-scraper', name: 'Scraper Expert', role: 'Web Data Extraction', icon: Globe, color: 'text-blue-500', prompt: 'You are a web scraping expert. Help the user extract data from websites using modern tools like Playwright, Puppeteer, or BeautifulSoup. Provide code snippets and best practices.' },
  { id: 'security-analyst', name: 'Security Analyst', role: 'Vulnerability Research', icon: ShieldAlert, color: 'text-red-500', prompt: 'You are a security analyst. Help the user identify potential vulnerabilities in their code or architecture. Focus on OWASP Top 10 and secure coding practices.' },
  { id: 'devops-engineer', name: 'DevOps Engineer', role: 'Infrastructure & CI/CD', icon: Terminal, color: 'text-emerald-500', prompt: 'You are a DevOps engineer. Help the user with Docker, Kubernetes, CI/CD pipelines, and cloud infrastructure optimization.' },
  { id: 'frontend-architect', name: 'Frontend Architect', role: 'UI/UX & Performance', icon: Code2, color: 'text-indigo-500', prompt: 'You are a frontend architect. Help the user build performant, accessible, and beautiful user interfaces using React, Tailwind, and modern web APIs.' }
];

const MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Fast)', description: 'Optimized for speed and efficiency.' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro (Smart)', description: 'Advanced reasoning and complex tasks.' }
];

export const ScraperExpert: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(EXPERTS[0]);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: selectedModel.id,
        contents: userMessage,
        config: {
          systemInstruction: selectedExpert.prompt,
        }
      });

      const text = response.text || "I'm sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Failed to connect to the AI service. Please check your configuration." }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-[700px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Expert AI Assistant</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Powered by Gemini & Groq-Fast Logic</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="text-xs font-bold bg-white border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedModel.id}
            onChange={(e) => setSelectedModel(MODELS.find(m => m.id === e.target.value) || MODELS[0])}
          >
            {MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Expert Selector */}
        <div className="w-64 border-r border-gray-100 bg-gray-50/30 p-4 space-y-4 overflow-y-auto">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-2">Select Expert</label>
          <div className="space-y-1">
            {EXPERTS.map((expert) => (
              <button
                key={expert.id}
                onClick={() => setSelectedExpert(expert)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${selectedExpert.id === expert.id ? 'bg-white shadow-sm border border-gray-100' : 'hover:bg-white/50'}`}
              >
                <expert.icon size={18} className={expert.color} />
                <div>
                  <div className="text-xs font-bold text-gray-900">{expert.name}</div>
                  <div className="text-[10px] text-gray-500 font-medium truncate w-32">{expert.role}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-700 mb-1">
                <Sparkles size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Expert Mode</span>
              </div>
              <p className="text-[10px] text-indigo-600 leading-relaxed font-medium">
                Switching experts updates the AI's persona and specialized knowledge base.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <div className={`w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 ${selectedExpert.color}`}>
                  <selectedExpert.icon size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">I am your {selectedExpert.name}</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Ask me anything about {selectedExpert.role.toLowerCase()}. I'm here to help you build better tools.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-800 border border-gray-100'}`}>
                    <div className="prose prose-sm max-w-none prose-indigo">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Bot size={16} className="text-gray-400" />
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-indigo-500" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100">
            <div className="relative flex items-center gap-2">
              <input 
                type="text" 
                placeholder={`Ask the ${selectedExpert.name.toLowerCase()}...`}
                className="flex-1 pl-4 pr-12 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-md shadow-indigo-200"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
