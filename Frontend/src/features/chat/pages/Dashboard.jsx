import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "../hooks/useChat.js";
import { useAuth } from "../../auth/hook/useAuth.js";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { chats, currentChatId, isLoading, error } = useSelector((state) => state.chat);
  const {
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
    initializeSocketConnection,
  } = useChat();
  const { handleLogout } = useAuth();

  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    handleGetChats();
    const socket = initializeSocketConnection();
    return () => socket?.disconnect();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatId, chats]);

  const currentChat = currentChatId ? chats[currentChatId] : null;
  const messages = currentChat?.messages || [];

  const sortedChats = useMemo(
    () => Object.values(chats).sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)),
    [chats]
  );

  async function submitMessage(event) {
    event.preventDefault();
    const message = input.trim();
    if (!message || isLoading) return;

    setInput("");
    await handleSendMessage({
      message,
      chatId: currentChatId,
    });
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function startNewChat() {
    window.location.reload();
  }

  return (
    <div className="dashboard">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .dashboard { min-height: 100vh; display: flex; background: #070b14; color: #e8f0fe; font-family: Inter, system-ui, sans-serif; }
        .sidebar { width: 280px; background: #0a0f1b; border-right: 1px solid #182235; padding: 20px; display: flex; flex-direction: column; gap: 18px; }
        .brand { font-size: 20px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
        .brand-icon { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: linear-gradient(135deg,#63b3ed,#4fd1c5); color:#07101a; }
        .new-btn { border: 1px solid #26354e; background: #101827; color: #e8f0fe; border-radius: 12px; padding: 11px 14px; cursor: pointer; text-align: left; }
        .new-btn:hover, .chat-item:hover { background: #151f32; }
        .chat-list { overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 5px; }
        .chat-item { width:100%; border:0; background:transparent; color:#b8c5d9; padding:10px; border-radius:10px; text-align:left; cursor:pointer; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .chat-item.active { background:#162238; color:#fff; }
        .chat-item-row { display:flex; gap:5px; }
        .delete-btn { border:0; background:transparent; color:#71809a; cursor:pointer; border-radius:8px; }
        .delete-btn:hover { color:#f87171; background:#1c1820; }
        .profile { border-top:1px solid #182235; padding-top:14px; display:flex; align-items:center; gap:10px; }
        .avatar { width:34px; height:34px; border-radius:50%; background:#1c2a40; display:grid; place-items:center; font-weight:700; }
        .profile-text { flex:1; min-width:0; }
        .profile-name { font-size:13px; font-weight:700; overflow:hidden; text-overflow:ellipsis; }
        .profile-email { font-size:11px; color:#71809a; overflow:hidden; text-overflow:ellipsis; }
        .logout { border:0; background:transparent; color:#8190a8; cursor:pointer; }
        .main { flex:1; min-width:0; display:flex; flex-direction:column; height:100vh; }
        .topbar { height:64px; border-bottom:1px solid #182235; display:flex; align-items:center; padding:0 24px; gap:14px; }
        .mobile-menu { display:none; }
        .top-title { font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .status { margin-left:auto; color:#7dd3a7; font-size:12px; }
        .messages { flex:1; overflow-y:auto; padding:30px max(20px,calc((100% - 820px)/2)); }
        .empty { min-height:100%; display:grid; place-items:center; text-align:center; }
        .empty h1 { margin:0 0 8px; font-size:32px; }
        .empty p { color:#8190a8; margin:0; }
        .message { display:flex; margin-bottom:24px; }
        .message.user { justify-content:flex-end; }
        .bubble { max-width:760px; line-height:1.65; white-space:pre-wrap; }
        .user .bubble { background:#172238; border:1px solid #26354e; padding:12px 16px; border-radius:18px 18px 4px 18px; }
        .ai .bubble { width:100%; }
        .ai-label { color:#63b3ed; font-size:12px; font-weight:800; margin-bottom:6px; }
        .markdown p { margin:0 0 12px; }
        .markdown pre { overflow:auto; background:#0b111d; border:1px solid #1b293e; padding:14px; border-radius:10px; }
        .markdown code { background:#111a29; padding:2px 5px; border-radius:5px; }
        .sources { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
        .source { display:block; max-width:280px; border:1px solid #1d2c42; background:#0c1422; color:#9ec8ee; padding:9px 11px; border-radius:10px; text-decoration:none; font-size:12px; }
        .source span { display:block; color:#64748b; margin-top:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .composer { padding:16px max(20px,calc((100% - 820px)/2)); border-top:1px solid #182235; }
        .composer form { display:flex; align-items:flex-end; gap:10px; background:#0d1523; border:1px solid #26354e; border-radius:16px; padding:7px; }
        textarea { flex:1; resize:none; border:0; outline:0; background:transparent; color:#fff; padding:10px; font:inherit; min-height:44px; max-height:130px; }
        .send { width:44px; height:44px; border:0; border-radius:12px; background:linear-gradient(135deg,#63b3ed,#4fd1c5); cursor:pointer; font-size:18px; }
        .send:disabled { opacity:.4; cursor:not-allowed; }
        .hint { color:#5f708a; font-size:11px; text-align:center; margin-top:7px; }
        .error { color:#fca5a5; background:#28161a; border:1px solid #512129; padding:9px 12px; border-radius:10px; margin-bottom:14px; font-size:13px; }
        .loading { color:#7d8ba2; font-size:13px; }
        @media (max-width: 800px) {
          .sidebar { position:fixed; z-index:10; inset:0 auto 0 0; transform:translateX(-100%); transition:.2s; }
          .sidebar.open { transform:translateX(0); }
          .mobile-menu { display:block; border:0; background:transparent; color:#fff; font-size:20px; }
          .status { display:none; }
        }
      `}</style>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand"><div className="brand-icon">✦</div> Perplexity</div>
        <button className="new-btn" onClick={startNewChat}>＋ New conversation</button>

        <div className="chat-list">
          {sortedChats.length === 0 ? (
            <div className="loading">No conversations yet.</div>
          ) : (
            sortedChats.map((chat) => (
              <div className="chat-item-row" key={chat.id}>
                <button
                  className={`chat-item ${currentChatId === chat.id ? "active" : ""}`}
                  onClick={() => { handleOpenChat(chat.id); setSidebarOpen(false); }}
                >
                  {chat.title}
                </button>
                <button className="delete-btn" onClick={() => handleDeleteChat(chat.id)} title="Delete chat">×</button>
              </div>
            ))
          )}
        </div>

        <div className="profile">
          <div className="avatar">{user?.username?.[0]?.toUpperCase() || "U"}</div>
          <div className="profile-text">
            <div className="profile-name">{user?.username}</div>
            <div className="profile-email">{user?.email}</div>
          </div>
          <button className="logout" onClick={handleLogout} title="Logout">↪</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="top-title">{currentChat?.title || "New conversation"}</div>
          <div className="status">● AI online</div>
        </header>

        <section className="messages">
          {error && <div className="error">{error}</div>}

          {messages.length === 0 ? (
            <div className="empty">
              <div>
                <h1>Ask anything.</h1>
                <p>Search the web and get an AI-generated answer with sources.</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div className={`message ${message.role === "ai" ? "ai" : "user"}`} key={message.id}>
                  <div className="bubble">
                    {message.role === "ai" && <div className="ai-label">✦ AI ANSWER</div>}
                    {message.role === "ai" ? (
                      <div className="markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                    {message.role === "ai" && message.sources?.length > 0 && (
                      <div className="sources">
                        {message.sources.map((source, index) => (
                          <a className="source" href={source.url} target="_blank" rel="noreferrer" key={`${source.url}-${index}`}>
                            {source.title || `Source ${index + 1}`}
                            <span>{source.url}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && <div className="loading">Generating answer…</div>}
            </>
          )}
          <div ref={endRef} />
        </section>

        <footer className="composer">
          <form onSubmit={submitMessage}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              disabled={isLoading}
            />
            <button className="send" type="submit" disabled={!input.trim() || isLoading}>↑</button>
          </form>
          <div className="hint">Enter to send · Shift + Enter for a new line</div>
        </footer>
      </main>
    </div>
  );
}
