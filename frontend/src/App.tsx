import { FormEvent, useState } from 'react'
import { ArrowUp, BarChart3, ChevronRight, Database, Menu, Plus, Search, Sparkles } from 'lucide-react'

type Customer = { code: string; name: string | null; alias: string | null }
type Message = { role: 'user' | 'assistant'; text: string; data?: { items?: Customer[]; matches?: Customer[]; customers?: Customer[]; orders?: Array<{ orderNo: string | null; poNo: string | null; poDate: string | null; lines: Array<{ productCode: string | null; productDescription: string | null; quantity: number | null }> }> } }

const suggestions = ['Cari customer Hino', 'Order Hino bulan ini', 'Cari SO', 'Cek stock part', 'Delivery hari ini']

export function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID())

  const ask = async (message: string) => {
    const value = message.trim()
    if (!value || loading) return
    setMessages((items) => [...items, { role: 'user', text: value }])
    setInput('')
    setLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/ai/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: value, sessionId }) })
      const result = await response.json()
      setMessages((items) => [...items, { role: 'assistant', text: result.answer ?? 'Tidak ada jawaban.', data: result.data }])
    } catch { setMessages((items) => [...items, { role: 'assistant', text: 'Backend belum dapat dihubungi. Periksa service BMC AI.' }]) }
    finally { setLoading(false) }
  }

  const selectCustomer = async (customerCode: string) => {
    if (loading) return
    setLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/ai/select-customer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, customerCode }) })
      const result = await response.json()
      setMessages((items) => [...items, { role: 'assistant', text: result.answer ?? 'Data tidak tersedia.', data: result.data }])
    } catch { setMessages((items) => [...items, { role: 'assistant', text: 'Customer berhasil dipilih, tetapi data order belum dapat diambil.' }]) }
    finally { setLoading(false) }
  }

  const submit = (event: FormEvent) => { event.preventDefault(); void ask(input) }
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Sparkles size={17} /></div><span>BMC <b>AI</b></span></div>
       <button className="new-chat" onClick={() => { setMessages([]); setSessionId(crypto.randomUUID()) }}><Plus size={17} /> New chat</button>
      <div className="side-label">Workspace</div>
      <div className="nav-item active"><BarChart3 size={17} /> Business Intelligence</div>
      <div className="nav-item"><Database size={17} /> Data sources <span className="soon">Soon</span></div>
      <div className="side-label history-label">History</div>
      <div className="empty-history">Your conversations<br />will appear here.</div>
      <div className="sidebar-footer"><div className="status-dot" /> Read-only intelligence</div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="mobile-menu"><Menu size={21} /></button><span className="eyebrow">BMC / Intelligence workspace</span><div className="top-actions"><span className="live"><i /> Systems online</span><div className="avatar">BM</div></div></header>
      <section className={`chat-area ${messages.length ? 'has-messages' : ''}`}>
         {!messages.length ? <div className="welcome"><div className="welcome-icon"><Sparkles size={23} /></div><p className="kicker">BUSINESS & FACTORY INTELLIGENCE</p><h1>What can I help<br /><em>you analyze?</em></h1><p className="welcome-copy">Ask questions about your business data. I will find the right source, keep the facts clear, and show where they came from.</p></div> : <div className="messages">{messages.map((message, index) => <div className={`message-row ${message.role}`} key={`${message.role}-${index}`}><div className="message-avatar">{message.role === 'assistant' ? <Sparkles size={15} /> : 'You'}</div><div className="message-body"><p>{message.text}</p>{(message.data?.items?.length || message.data?.matches?.length) ? <div className="result-card"><div className="result-title"><Search size={14} /> Customer matches</div>{(message.data.matches || message.data.items || []).map((item, itemIndex) => <div className="result-item" key={itemIndex}><strong>{item.name}</strong><span>{item.alias || `Customer code ${item.code}`}</span></div>)}</div> : null}{message.data?.customers?.length ? <div className="candidate-list"><div className="result-title"><Search size={14} /> Select a customer to continue</div>{message.data.customers.map((customer) => <button className="candidate" key={customer.code} onClick={() => void selectCustomer(customer.code)} disabled={loading}><strong>{customer.name}</strong><span>{customer.alias || `Customer code ${customer.code}`}</span><ChevronRight size={15} /></button>)}</div> : null}{message.data?.orders?.length ? <div className="result-card"><div className="result-title"><Database size={14} /> Sales orders</div>{message.data.orders.map((order, orderIndex) => <div className="result-item" key={orderIndex}><strong>{order.orderNo || order.poNo || 'Order without number'}</strong><span>{order.poDate || 'Date unavailable'} · {order.lines.length} line(s)</span></div>)}</div> : null}</div></div>)}{loading && <div className="message-row assistant"><div className="message-avatar"><Sparkles size={15} /></div><div className="typing">Reading approved sources<span>...</span></div></div>}</div>}
        {!messages.length && <div className="prompt-zone"><p className="prompt-label">Try asking</p><div className="suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => void ask(suggestion)}>{suggestion}<ChevronRight size={14} /></button>)}</div></div>}
        <form className="composer" onSubmit={submit}><div className="composer-inner"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about customers, orders, stock, delivery..." /><button type="submit" aria-label="Send" disabled={!input.trim() || loading}><ArrowUp size={18} /></button></div><p className="composer-note">BMC AI uses approved internal tools only · Database access is read-only</p></form>
      </section>
    </main>
  </div>
}
