import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { api, ApiError } from '@/lib/api';

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

interface AssistantResponse {
  reply: string;
  suggestions?: string[];
}

// Fallback intelligent responses in case the backend API is offline or undergoing maintenance
const FALLBACK_KNOWLEDGE: Array<{
  keywords: string[];
  reply: string;
  suggestions: string[];
}> = [
  {
    keywords: ['post', 'need', 'challenge', 'requirement', 'problem', 'tender', 'rfp'],
    reply:
      'To post a departmental need on PilotGov, navigate to the "Identify" section. Specify your department, challenge title, expected outcome, budget band (e.g. ₹10L - ₹50L), and target domain (AgriTech, CleanTech, HealthTech, Smart Mobility, or EdTech). Eligible DPIIT-verified startups will be matched automatically without needing a traditional multi-month RFP process.',
    suggestions: [
      'How does startup matching work?',
      'What are the eligibility criteria for startups?',
      'How are pilot budgets disbursed?',
    ],
  },
  {
    keywords: ['match', 'matching', 'algorithm', 'score', 'criteria', 'vetting', 'verified', 'dpiit'],
    reply:
      'Startup matching uses a multi-factor compatibility engine that evaluates: 1) DPIIT registration & legal compliance, 2) Technology Readiness Level (TRL 6+ field-proven solutions), 3) Domain & past deployment track record, and 4) Departmental problem constraints. Startups receive an AI match score (e.g. 96%) indicating operational fit.',
    suggestions: [
      'What happens after a pilot?',
      'How do I post a need?',
      'What domains are currently supported?',
    ],
  },
  {
    keywords: ['pilot', 'after', 'scale', 'contract', 'procure', 'pipeline', 'stages'],
    reply:
      'Pilots on PilotGov are time-boxed (typically 30–90 days) with milestone-driven funding. Outcomes are measured against predefined KPIs and recorded on a public dashboard. Once verified, successful pilots qualify for fast-track public procurement contracts without restarting the tender cycle.',
    suggestions: [
      'How do I post a need?',
      'How does startup matching work?',
      'Can I request a live demo for my department?',
    ],
  },
  {
    keywords: ['domain', 'agri', 'health', 'clean', 'mobility', 'edtech', 'sector'],
    reply:
      'PilotGov focuses on high-impact public innovation domains: AgriTech (smart farming & yield), CleanTech (waste & renewable energy), HealthTech (remote diagnostics & cold chain), Smart Mobility (traffic AI & transit), and EdTech (vernacular digital education). Explore our Domain Hubs for sector-specific metrics.',
    suggestions: [
      'How do I post a need?',
      'How are startups verified?',
      'What happens after a pilot?',
    ],
  },
];

function getFallbackReply(query: string): AssistantResponse {
  const lower = query.toLowerCase();
  for (const item of FALLBACK_KNOWLEDGE) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return {
        reply: item.reply,
        suggestions: item.suggestions,
      };
    }
  }

  return {
    reply:
      'PilotGov connects government departments with DPIIT-verified startups for rapid pilot deployment. You can post problem statements, review matched innovators, monitor live pilot KPIs, or scale proven solutions.',
    suggestions: [
      'How do I post a need?',
      'How does startup matching work?',
      'What happens after a pilot?',
      'How are startups verified?',
    ],
  };
}

export default function AssistantWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick starter questions
  const quickQuestions = [
    t('assistant.quick1'),
    t('assistant.quick2'),
    t('assistant.quick3'),
    t('assistant.quick4'),
  ];

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when opened on desktop
      const timer = setTimeout(() => {
        if (window.innerWidth >= 640) {
          inputRef.current?.focus();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend ?? input).trim();
    if (!messageContent || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Send request to backend /assist/chat
      const res = await api<AssistantResponse>('/assist/chat', {
        method: 'POST',
        body: JSON.stringify({ message: messageContent }),
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        suggestions: res.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      if (err instanceof ApiError || err instanceof TypeError || err instanceof Error) {
        // Provide seamless fallback answer if backend is offline/unreachable
        const fallback = getFallbackReply(messageContent);
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: fallback.reply,
          suggestions: fallback.suggestions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating launcher trigger button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? t('assistant.close') : t('assistant.open')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald2-400 ${
            isOpen
              ? 'bg-ink-800 text-white border border-white/20 hover:bg-ink-700'
              : 'bg-emerald2-500 text-ink-950 shadow-emerald2-500/25 hover:bg-emerald2-400'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative"
              >
                <MessageSquare className="h-6 w-6 fill-current" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald2-400 border-2 border-emerald2-500" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Expandable Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[420px] h-[540px] max-h-[calc(100vh-7.5rem)] flex flex-col rounded-2xl border border-white/10 bg-ink-900/95 backdrop-blur-xl shadow-2xl shadow-black/70 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-ink-850/90">
              <div className="flex items-center gap-3">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald2-500/15 text-emerald2-400 border border-emerald2-500/30">
                  <Bot className="h-4 w-4" />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald2-400 ring-2 ring-ink-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white tracking-tight">
                      {t('assistant.title')}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-emerald2-500/10 border border-emerald2-500/20 px-1.5 py-0.2 text-[9px] font-medium text-emerald2-400">
                      <span className="h-1 w-1 rounded-full bg-emerald2-400 animate-pulse" />
                      {t('assistant.status')}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40 leading-none mt-0.5">
                    {t('assistant.subtitle')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    title={t('assistant.clearChat')}
                    aria-label={t('assistant.clearChat')}
                    className="p-1.5 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label={t('assistant.close')}
                  className="p-1.5 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {/* Initial Greeting Bubble */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald2-500/15 text-emerald2-400 border border-emerald2-500/20 mt-0.5">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-3 flex-1">
                  <div className="rounded-2xl rounded-tl-sm bg-ink-850 border border-white/10 px-3.5 py-2.5 text-xs sm:text-sm text-white/90 leading-relaxed shadow-sm">
                    {t('assistant.greeting')}
                  </div>

                  {/* Starter Quick Question Chips */}
                  {messages.length === 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-medium text-white/40 px-1">
                        {t('assistant.suggestedTitle')}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {quickQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(q)}
                            disabled={loading}
                            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-white/70 hover:border-emerald2-500/30 hover:bg-emerald2-500/10 hover:text-emerald2-300 transition-all duration-150 disabled:opacity-50"
                          >
                            <span className="truncate pr-2">{q}</span>
                            <ChevronRight className="h-3 w-3 text-white/30 group-hover:text-emerald2-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Message Stream */}
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-start gap-2.5 max-w-[88%]">
                      {!isUser && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald2-500/15 text-emerald2-400 border border-emerald2-500/20 mt-0.5">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                          isUser
                            ? 'rounded-tr-sm bg-emerald2-500/20 text-emerald2-100 border border-emerald2-500/30'
                            : 'rounded-tl-sm bg-ink-850 text-white/90 border border-white/10'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      {isUser && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10 text-white/70 border border-white/10 mt-0.5">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Dynamic Follow-up Suggestions from Assistant */}
                    {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2.5 ml-9 flex flex-wrap gap-1.5">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(sug)}
                            disabled={loading}
                            className="rounded-full border border-emerald2-500/25 bg-emerald2-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald2-300 hover:bg-emerald2-500/20 hover:border-emerald2-500/40 transition-all text-left disabled:opacity-40"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald2-500/15 text-emerald2-400 border border-emerald2-500/20 mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-ink-850 border border-white/10 px-4 py-3 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald2-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald2-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald2-400 animate-bounce" />
                    <span className="text-[11px] text-white/40 ml-1.5">
                      {t('assistant.thinking')}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Footer */}
            <div className="p-3 border-t border-white/10 bg-ink-850/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('assistant.placeholder')}
                  disabled={loading}
                  className="flex-1 bg-ink-950/70 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-emerald2-500/50 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label={t('assistant.send')}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald2-500 hover:bg-emerald2-400 text-ink-950 font-semibold shadow-md shadow-emerald2-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
