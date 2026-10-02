"use client";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useT } from "@/lib/i18n";

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
};

const SESSION_ID = "default";

export default function ChatPage() {
  const { lang } = useLang();
  const t = useT(lang);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/chat?sessionId=${SESSION_ID}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.messages && d.messages.length > 0) {
          setMessages(
            d.messages.map((m: { id: string; role: "user" | "assistant"; content: string }) => ({
              id: m.id,
              role: m.role,
              content: m.content,
            }))
          );
        } else {
          setMessages([{ id: "welcome", role: "assistant", content: t.welcomeChat }]);
          setSuggestions(
            lang === "hi"
              ? ["मेरे लिए शीर्ष नौकरियाँ दिखाएँ", "मुफ़्त कौशल कोर्स", "सरकारी योजनाएँ"]
              : ["Show me top jobs", "Free skilling courses", "Government schemes I'm eligible for"]
          );
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setInput("");
    setSuggestions([]);
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", content: msg };
    setMessages((m) => [...m, userMsg]);
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId: SESSION_ID }),
      });
      const d = await r.json();
      setMessages((m) => [
        ...m,
        { id: d.reply.id, role: "assistant", content: d.reply.content },
      ]);
      setSuggestions(d.assistant?.suggestions ?? []);
    } catch {
      setMessages((m) => [
        ...m,
        { id: `err-${Date.now()}`, role: "assistant", content: lang === "hi" ? "क्षमा करें, कुछ गड़बड़ हुई।" : "Sorry, something went wrong." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col h-[calc(100vh-9rem)]">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-setu-600 text-white flex items-center justify-center"><Bot size={20}/></div>
          <div>
            <h1 className="text-2xl font-extrabold text-ink-900 flex items-center gap-2">
              {t.chatTitle} <span className="chip chip-green"><Sparkles size={12}/> AI</span>
            </h1>
            <p className="text-sm text-gray-600">{t.chatSub}</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin space-y-3 pr-2 pb-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-setu-600 text-white flex items-center justify-center shrink-0"><Bot size={16}/></div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-setu-600 text-white rounded-br-sm"
                  : "bg-white border border-gray-200 rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0"><User size={16}/></div>
            )}
          </div>
        ))}
        {busy && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-setu-600 text-white flex items-center justify-center shrink-0"><Bot size={16}/></div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <Dot delay={0}/><Dot delay={150}/><Dot delay={300}/>
              </div>
            </div>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 pb-3">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s)}
              className="text-sm chip chip-green hover:bg-setu-200 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="flex items-center gap-2 card p-2"
      >
        <input
          className="input !border-0 !shadow-none flex-1"
          placeholder={t.chatPh}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={busy || !input.trim()} className="btn-primary !p-2.5">
          <Send size={18}/>
        </button>
      </form>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="w-2 h-2 rounded-full bg-setu-400 inline-block"
      style={{ animation: `blink 1.2s ${delay}ms infinite ease-in-out` }}
    />
  );
}
