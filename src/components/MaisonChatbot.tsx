import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  Sparkles, 
  ShoppingBag, 
  Tag, 
  Calendar, 
  RefreshCw, 
  Bot, 
  ChevronDown,
  Wheat,
  Clock,
  ExternalLink,
  Check
} from 'lucide-react';
import { MenuItem } from '../types';
import { formatRupee } from '../utils/currency';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedActions?: Array<{
    type: 'add_to_cart' | 'apply_promo' | 'view_section';
    label: string;
    payload?: any;
  }>;
}

interface MaisonChatbotProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, slicing?: 'whole' | 'sandwich' | 'thick', notes?: string, quantity?: number) => void;
  onApplyPromoCode: (code: string) => void;
  appliedPromoCode?: string;
}

const CHAT_WEBHOOK_URL = 'https://jaanukowsi.app.n8n.cloud/webhook/3a734c7c-33a3-4011-984c-146ed89d3283/chat';

export const MaisonChatbot: React.FC<MaisonChatbotProps> = ({
  menuItems,
  onAddToCart,
  onApplyPromoCode,
  appliedPromoCode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Persistent session ID
  const [sessionId] = useState<string>(() => {
    try {
      const existing = localStorage.getItem('maison_chat_session_id');
      if (existing) return existing;
      const newId = 'maison-guest-' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('maison_chat_session_id', newId);
      return newId;
    } catch {
      return 'maison-guest-' + Date.now();
    }
  });

  // Persistent messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('maison_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: "Bonjour! Welcome to Maison Dorée. I’m your AI Concierge, connected live with Mathieu and our baking team. How can I assist your morning today? I can help you pick warm breads, check daily oven drops, reserve workshop seats, or apply holiday discounts.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { type: 'view_section', label: '🥖 Today’s Daily Specials', payload: 'daily-specials' },
          { type: 'apply_promo', label: '🎟️ Apply AUTUMN15 (15% off)', payload: 'AUTUMN15' },
          { type: 'view_section', label: '📅 View Workshops', payload: 'events' }
        ]
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maison_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Temporary action feedback toast
  useEffect(() => {
    if (actionFeedback) {
      const timer = setTimeout(() => setActionFeedback(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [actionFeedback]);

  // Helper to extract actionable suggestions from bot text
  const extractActionsFromText = (text: string) => {
    const actions: Array<{ type: 'add_to_cart' | 'apply_promo' | 'view_section'; label: string; payload?: any }> = [];

    // Check for products
    menuItems.forEach(item => {
      const cleanName = item.name.toLowerCase();
      // Match partial name
      if (
        text.toLowerCase().includes(cleanName) ||
        (cleanName.includes('boule') && text.toLowerCase().includes('boule')) ||
        (cleanName.includes('croissant') && text.toLowerCase().includes('butter croissant')) ||
        (cleanName.includes('pain au chocolat') && text.toLowerCase().includes('pain au chocolat')) ||
        (cleanName.includes('cardamom') && text.toLowerCase().includes('cardamom')) ||
        (cleanName.includes('fig') && text.toLowerCase().includes('fig')) ||
        (cleanName.includes('focaccia') && text.toLowerCase().includes('focaccia'))
      ) {
        if (!actions.some(a => a.payload?.id === item.id)) {
          actions.push({
            type: 'add_to_cart',
            label: `Add ${item.name} (${formatRupee(item.price)})`,
            payload: item
          });
        }
      }
    });

    // Check for promo codes
    const promos = ['AUTUMN15', 'EARLYBIRD', 'SWEETTREAT', 'WORKSHOP10', 'SPOOKY10', 'FRESHCRUST10'];
    promos.forEach(code => {
      if (text.includes(code)) {
        if (!actions.some(a => a.payload === code)) {
          actions.push({
            type: 'apply_promo',
            label: `Apply code ${code}`,
            payload: code
          });
        }
      }
    });

    // Check for events / workshops
    if (text.toLowerCase().includes('workshop') || text.toLowerCase().includes('masterclass') || text.toLowerCase().includes('event')) {
      if (!actions.some(a => a.payload === 'events')) {
        actions.push({
          type: 'view_section',
          label: '📅 View Event Calendar & Tickets',
          payload: 'events'
        });
      }
    }

    return actions.slice(0, 4); // Limit to top 4 clean actions
  };

  const sendMessageToWebhook = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId: sessionId,
          chatInput: userMsg.text
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      let botResponseText = '';

      if (typeof data === 'string') {
        botResponseText = data;
      } else if (data && typeof data.output === 'string') {
        botResponseText = data.output;
      } else if (data && typeof data.message === 'string') {
        botResponseText = data.message;
      } else if (data && typeof data.text === 'string') {
        botResponseText = data.text;
      } else {
        botResponseText = JSON.stringify(data);
      }

      const suggested = extractActionsFromText(botResponseText);

      const botMsg: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: suggested.length > 0 ? suggested : undefined
      };

      setMessages(prev => [...prev, botMsg]);

      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err: any) {
      console.error('Chatbot webhook error:', err);
      const fallbackMsg: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'bot',
        text: "I had a momentary hiccup reaching the bakery workshop ovens. Here is quick access to our fresh sourdough loaves, daily specials, and active discounts!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { type: 'view_section', label: '🥖 Browse Fresh Breads', payload: 'menu' },
          { type: 'apply_promo', label: '🎟️ Apply AUTUMN15', payload: 'AUTUMN15' },
          { type: 'view_section', label: '📅 View Calendar & Events', payload: 'events' }
        ]
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: { type: string; label: string; payload?: any }) => {
    if (action.type === 'add_to_cart' && action.payload) {
      const item: MenuItem = action.payload;
      onAddToCart(item, item.allowSlicing ? 'whole' : undefined, undefined, 1);
      setActionFeedback(`Added 1x ${item.name} to your bag!`);
    } else if (action.type === 'apply_promo' && action.payload) {
      const code: string = action.payload;
      onApplyPromoCode(code);
      setActionFeedback(`Promo code "${code}" applied to your order!`);
    } else if (action.type === 'view_section' && action.payload) {
      const targetId: string = action.payload;
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActionFeedback(`Navigating to ${action.label.replace(/^[^\w]+/, '')}...`);
      }
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('maison_chat_history');
    setMessages([
      {
        id: 'msg-welcome-new',
        sender: 'bot',
        text: "Conversation refreshed. I'm ready to help you with our daily bakery specials, ingredients, custom slicing, and workshops!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { type: 'view_section', label: '🥖 View Today’s Bake Drops', payload: 'daily-specials' },
          { type: 'apply_promo', label: '🎟️ Apply AUTUMN15 (15% off)', payload: 'AUTUMN15' }
        ]
      }
    ]);
  };

  const quickPrompts = [
    "What sourdough is fresh today?",
    "Tell me about the Sourdough Masterclass",
    "Do you have vegan options?",
    "Can you give me a discount code?"
  ];

  // Helper to format bot markdown text cleanly
  const renderFormattedText = (text: string) => {
    // Split into paragraphs/lines
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Check for bullet lines
      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
      const content = isBullet ? line.trim().substring(2) : line;

      // Simple regex for bold text **word**
      const parts = content.split(/(\*\*.*?\*\*)/g);

      const parsedContent = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-stone-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-amber-700 font-bold leading-none mt-1.5">•</span>
            <span className="flex-1">{parsedContent}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="my-1 leading-relaxed">
          {parsedContent}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
        {/* Unread Message Tooltip Bubble if closed */}
        {!isOpen && hasUnread && (
          <div 
            onClick={() => setIsOpen(true)}
            className="mb-2 bg-stone-900 text-stone-100 text-xs px-3 py-2 rounded-xl shadow-lg border border-amber-600/30 flex items-center gap-2 cursor-pointer hover:bg-stone-800 transition-all animate-bounce"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>New message from Baker Concierge</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Bakery AI Concierge"
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-amber-800 to-stone-900 text-amber-50 px-4 py-3 rounded-full shadow-2xl hover:shadow-amber-900/30 border border-amber-600/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-stone-900" />
          </div>

          <span className="text-sm font-medium tracking-wide">
            {isOpen ? 'Close Concierge' : 'Bakery AI Concierge'}
          </span>

          {hasUnread && !isOpen && (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Floating Action Feedback Toast */}
      {actionFeedback && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-stone-900 text-amber-200 px-4 py-3 rounded-xl shadow-2xl border border-amber-500/40 flex items-center gap-2.5 text-sm animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Main Chat Drawer / Window */}
      {isOpen && (
        <div 
          className="fixed bottom-20 sm:bottom-20 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-[420px] max-h-[85vh] sm:max-h-[640px] h-[580px] bg-stone-50 rounded-2xl shadow-2xl border border-amber-900/20 flex flex-col overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-bottom-6 duration-300"
        >
          {/* Header */}
          <div className="bg-stone-900 text-amber-50 px-4 py-3.5 border-b border-amber-800/40 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center border border-amber-500/30 text-amber-200 shadow-inner">
                <Wheat className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-stone-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-semibold text-stone-100 text-sm tracking-wide">
                    Maison Dorée Concierge
                  </h3>
                  <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-700/40 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                    Live AI
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connected to n8n Artisan Workflow
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-stone-400">
              <button
                onClick={handleClearHistory}
                title="Reset conversation"
                className="p-1.5 rounded-lg hover:text-stone-200 hover:bg-stone-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 rounded-lg hover:text-stone-200 hover:bg-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Promo Notice in Chat */}
          {appliedPromoCode && (
            <div className="bg-amber-100/80 px-4 py-1.5 text-xs text-amber-950 border-b border-amber-200/80 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Tag className="w-3.5 h-3.5 text-amber-800" />
                Active Cart Discount: <strong>{appliedPromoCode}</strong>
              </span>
              <span className="text-[11px] text-amber-800/80">Active in bag</span>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-100/60 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Sender Tag */}
                <span className="text-[10px] text-stone-400 mb-1 px-1">
                  {msg.sender === 'user' ? 'You' : 'Baker Concierge'} • {msg.timestamp}
                </span>

                {/* Message Bubble */}
                <div
                  className={`max-w-[88%] text-xs sm:text-sm rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-900 text-stone-50 rounded-tr-none'
                      : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-none font-sans'
                  }`}
                >
                  {msg.sender === 'bot' ? (
                    <div>{renderFormattedText(msg.text)}</div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>

                {/* Interactive Action Buttons if bot suggested any */}
                {msg.sender === 'bot' && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.suggestedActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleActionClick(action)}
                        className="inline-flex items-center gap-1.5 text-xs bg-amber-50 hover:bg-amber-100/90 text-amber-900 border border-amber-300/80 px-2.5 py-1.5 rounded-lg shadow-2xs hover:border-amber-400 transition-all font-medium active:scale-95 text-left"
                      >
                        {action.type === 'add_to_cart' && <ShoppingBag className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                        {action.type === 'apply_promo' && <Tag className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                        {action.type === 'view_section' && <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Live Typing / Workflow execution indicator */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-stone-400 mb-1 px-1">Baker Concierge is formulating an answer...</span>
                <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none p-3 shadow-2xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-700 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-amber-700 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-amber-700 animate-bounce" />
                  <span className="text-xs text-stone-500 italic ml-1">Checking bakery ovens...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-stone-200/50 border-t border-stone-200/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
            <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" /> Suggestions:
            </span>
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                disabled={isLoading}
                onClick={() => sendMessageToWebhook(prompt)}
                className="shrink-0 text-xs text-stone-700 bg-white hover:bg-amber-100 hover:text-amber-950 border border-stone-300/70 hover:border-amber-300 rounded-full px-2.5 py-1 transition-all disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessageToWebhook(inputMessage);
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about bread, events, ingredients, or discounts..."
              disabled={isLoading}
              className="flex-1 bg-stone-100/90 text-stone-900 placeholder-stone-400 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-stone-300/80 focus:outline-hidden focus:ring-2 focus:ring-amber-800/40 focus:bg-white transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-amber-900 hover:bg-amber-800 disabled:opacity-40 text-amber-50 p-2.5 rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
