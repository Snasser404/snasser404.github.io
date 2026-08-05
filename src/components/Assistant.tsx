import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  getResponse,
  getPack,
  askAssistant,
  formatMarkup,
  formatReply,
  escapeHtml,
  ASSISTANT_API_URL,
  type ChatMsg,
  type ApiTurn,
} from '../lib/assistant'
import { useContent, useLang } from '../lib/i18n'
import { track } from '../lib/analytics'

const useAI = !!ASSISTANT_API_URL
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

export default function Assistant() {
  const { lang } = useLang()
  const { ui } = useContent()
  const pack = getPack(lang)
  const welcome = formatMarkup(pack.welcome)

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: 'bot', html: welcome }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [pendingJD, setPendingJD] = useState(false)
  const apiHistory = useRef<ApiTurn[]>([]) // plain-text history for the AI proxy
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking, open])

  /* Switching language mid-chat would leave a bilingual transcript the
     engine can't follow — start the conversation over in the new language. */
  useEffect(() => {
    setMessages([{ role: 'bot', html: formatMarkup(getPack(lang).welcome) }])
    setPendingJD(false)
    apiHistory.current = []
  }, [lang])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250)
  }, [open])

  const addBot = (html: string) => setMessages((m) => [...m, { role: 'bot', html }])

  const submit = async (text: string) => {
    const clean = text.trim()
    if (!clean || thinking) return
    setMessages((m) => [...m, { role: 'user', html: escapeHtml(clean) }])
    setInput('')
    const force = pendingJD
    setPendingJD(false)
    apiHistory.current = [...apiHistory.current, { role: 'user', content: clean }]
    track('assistant_message', { chars: clean.length })
    setThinking(true)

    if (useAI) {
      try {
        const reply = await askAssistant(apiHistory.current, lang)
        apiHistory.current = [...apiHistory.current, { role: 'assistant', content: reply }]
        setThinking(false)
        addBot(formatReply(reply))
      } catch (e) {
        setThinking(false)
        const err = e as { status?: number; reply?: string }
        // Worker sent a friendly rate-limit / daily-cap message → show it.
        // Any other failure → fall back to the built-in engine so the bot still answers.
        addBot(err.reply ? formatReply(err.reply) : getResponse(clean, force, lang))
      }
    } else {
      await sleep(420) // brief, natural typing pause for the local engine
      setThinking(false)
      addBot(getResponse(clean, force, lang))
    }
  }

  const onSuggestion = async (s: string) => {
    if (thinking) return
    if (s === pack.fitPrompt) {
      setMessages((m) => [...m, { role: 'user', html: escapeHtml(s) }])
      const promptText = pack.jdAsk
      apiHistory.current = [
        ...apiHistory.current,
        { role: 'user', content: s },
        { role: 'assistant', content: promptText },
      ]
      setPendingJD(true)
      setThinking(true)
      await sleep(300)
      setThinking(false)
      addBot(formatReply(promptText))
      return
    }
    submit(s)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit(input)
    }
  }

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            className="assistant-launcher"
            onClick={() => { setOpen(true); track('assistant_open') }}
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 12 }}
            transition={{ duration: 0.25 }}
            aria-label={ui.assistant.open}
          >
            <span className="assistant-launcher-dot" />
            <ChatIcon />
            <span className="assistant-launcher-label">{ui.assistant.launcher}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="assistant-panel card"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
            role="dialog"
            aria-label={ui.assistant.title}
          >
            <header className="assistant-head">
              <div className="assistant-head-id">
                <span className="assistant-avatar"><ChatIcon /></span>
                <div>
                  <div className="assistant-title">{ui.assistant.title}</div>
                  <div className="assistant-sub"><span className="assistant-online" /> {ui.assistant.subtitle}</div>
                </div>
              </div>
              <button className="assistant-x" onClick={() => setOpen(false)} aria-label={ui.assistant.close}>
                <CloseIcon />
              </button>
            </header>

            <div className="assistant-messages" ref={scrollRef}>
              {messages.map((m, i) => (
                <div key={i} className={`bubble bubble-${m.role}`}>
                  <span dangerouslySetInnerHTML={{ __html: m.html }} />
                </div>
              ))}
              {thinking && (
                <div className="bubble bubble-bot">
                  <span className="typing"><i /><i /><i /></span>
                </div>
              )}

              {messages.length <= 1 && !thinking && (
                <div className="assistant-suggestions">
                  {pack.suggestions.map((s) => (
                    <button key={s} className="assistant-chip" onClick={() => onSuggestion(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="assistant-input">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                placeholder={pendingJD ? ui.assistant.placeholderJD : ui.assistant.placeholder}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button className="assistant-send" onClick={() => submit(input)} disabled={!input.trim() || thinking} aria-label={ui.assistant.send}>
                <SendIcon />
              </button>
            </div>
            <div className="assistant-foot">{useAI ? ui.assistant.footAI : ui.assistant.footLocal}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
