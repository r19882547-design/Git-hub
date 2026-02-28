import { useState, useRef, useEffect } from "react";

const COUNTRIES = [
  {f:"🇮🇳",n:"India",c:"+91"},{f:"🇺🇸",n:"United States",c:"+1"},
  {f:"🇬🇧",n:"United Kingdom",c:"+44"},{f:"🇦🇪",n:"UAE",c:"+971"},
  {f:"🇵🇰",n:"Pakistan",c:"+92"},{f:"🇧🇩",n:"Bangladesh",c:"+880"},
  {f:"🇳🇵",n:"Nepal",c:"+977"},{f:"🇸🇦",n:"Saudi Arabia",c:"+966"},
  {f:"🇶🇦",n:"Qatar",c:"+974"},{f:"🇩🇪",n:"Germany",c:"+49"},
  {f:"🇫🇷",n:"France",c:"+33"},{f:"🇨🇦",n:"Canada",c:"+1"},
  {f:"🇦🇺",n:"Australia",c:"+61"},{f:"🇸🇬",n:"Singapore",c:"+65"},
  {f:"🇲🇾",n:"Malaysia",c:"+60"},{f:"🇯🇵",n:"Japan",c:"+81"},
  {f:"🇨🇳",n:"China",c:"+86"},{f:"🇷🇺",n:"Russia",c:"+7"},
  {f:"🇧🇷",n:"Brazil",c:"+55"},{f:"🇿🇦",n:"South Africa",c:"+27"},
];

const S = {
  app: { display:"flex", flexDirection:"column", height:"100vh", background:"#f4f4f4", fontFamily:"'Segoe UI',sans-serif", maxWidth:480, margin:"0 auto", position:"relative", overflow:"hidden" },
  topbar: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"#fff", borderBottom:"1px solid #eee", flexShrink:0 },
  tl: { display:"flex", alignItems:"center", gap:12 },
  tr: { display:"flex", gap:8 },
  ibtn: { width:42, height:42, borderRadius:"50%", background:"#f0f0f0", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" },
  aname: { fontSize:"1.4rem", fontWeight:900, letterSpacing:4, color:"#111" },
  body: { flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:10 },
  botbar: { display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"#fff", borderTop:"1px solid #eee", flexShrink:0 },
  pbtn: { width:44, height:44, borderRadius:"50%", background:"#f0f0f0", border:"none", fontSize:"1.5rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  ibox: { flex:1, height:44, borderRadius:22, border:"1.5px solid #ddd", padding:"0 16px", fontSize:"0.95rem", outline:"none" },
  sbtn: (d) => ({ width:44, height:44, borderRadius:"50%", background:d?"#ccc":"#1a1a1a", border:"none", color:"#fff", fontSize:"1.2rem", cursor:d?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }),
  msgU: { alignSelf:"flex-end", background:"#1a1a1a", color:"#fff", padding:"10px 15px", borderRadius:18, borderBottomRightRadius:4, maxWidth:"80%", fontSize:"0.93rem", lineHeight:1.6, whiteSpace:"pre-wrap", wordBreak:"break-word" },
  msgB: { alignSelf:"flex-start", background:"#fff", color:"#222", border:"1.5px solid #e8e8e8", padding:"10px 15px", borderRadius:18, borderBottomLeftRadius:4, maxWidth:"80%", fontSize:"0.93rem", lineHeight:1.6, whiteSpace:"pre-wrap", wordBreak:"break-word" },
  typing: { alignSelf:"flex-start", background:"#fff", color:"#999", border:"1.5px solid #e8e8e8", padding:"10px 15px", borderRadius:18, borderBottomLeftRadius:4, fontStyle:"italic", fontSize:"0.9rem" },
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" },
  sheet: { background:"#fff", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:480, padding:"28px 24px 40px", position:"relative", animation:"none" },
  mTitle: { fontSize:"1.2rem", fontWeight:800, color:"#111", marginBottom:6 },
  mSub: { fontSize:"0.85rem", color:"#999", marginBottom:20 },
  mainBtn: (d) => ({ width:"100%", height:52, background:d?"#ccc":"#111", color:"#fff", border:"none", borderRadius:14, fontSize:"1rem", fontWeight:700, cursor:d?"not-allowed":"pointer", marginTop:4 }),
  fullInp: { width:"100%", height:50, border:"1.5px solid #ddd", borderRadius:12, padding:"0 14px", fontSize:"1rem", outline:"none", marginBottom:16 },
  banner: { background:"linear-gradient(135deg,#111,#444)", color:"#fff", padding:"14px 18px", borderRadius:14, alignSelf:"stretch" },
  placeholder: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, color:"#ccc", marginTop:60 },
  plusMenu: { position:"absolute", bottom:70, left:14, background:"#fff", borderRadius:18, boxShadow:"0 6px 30px rgba(0,0,0,.18)", zIndex:50, minWidth:220, overflow:"hidden" },
  popt: { display:"flex", alignItems:"center", gap:14, padding:"15px 18px", cursor:"pointer", fontSize:"0.95rem", color:"#222", borderBottom:"1px solid #f2f2f2" },
  ppMenu: { position:"absolute", top:66, right:14, background:"#fff", borderRadius:16, boxShadow:"0 6px 30px rgba(0,0,0,.15)", zIndex:50, minWidth:200, overflow:"hidden" },
  ppopt: { display:"flex", alignItems:"center", gap:12, padding:"14px 18px", cursor:"pointer", fontSize:"0.9rem", color:"#222", borderBottom:"1px solid #f2f2f2" },
  sidebar: (o) => ({ position:"fixed", top:0, left:o?0:-290, bottom:0, width:275, background:"#fff", zIndex:201, transition:"left 0.3s", display:"flex", flexDirection:"column", boxShadow:"6px 0 24px rgba(0,0,0,.12)" }),
  hItem: { display:"flex", alignItems:"center", padding:"13px 16px", borderBottom:"1px solid #f5f5f5", gap:8, cursor:"pointer" },
  toast: { position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)", background:"#222", color:"#fff", padding:"9px 22px", borderRadius:20, fontSize:"0.82rem", zIndex:500, whiteSpace:"nowrap" },
  otpRow: { display:"flex", gap:10, justifyContent:"center", marginBottom:20 },
  otpBox: { width:46, height:56, border:"2px solid #ddd", borderRadius:12, textAlign:"center", fontSize:"1.4rem", fontWeight:700, outline:"none" },
  demoBadge: { background:"#fff8e1", border:"1.5px solid #ffe082", borderRadius:10, padding:"10px 14px", fontSize:"0.85rem", color:"#555", marginBottom:16, textAlign:"center" },
};

const SK = "yug_v7";
const getH = () => { try { return JSON.parse(localStorage.getItem(SK) || "[]"); } catch { return []; } };
const setH = h => localStorage.setItem(SK, JSON.stringify(h));
const getUser = () => { try { return JSON.parse(localStorage.getItem("yug_user") || "null"); } catch { return null; } };
const setUserLS = u => localStorage.setItem("yug_user", JSON.stringify(u));

export default function YUGApp() {
  const [msgs, setMsgs] = useState([]);
  const [apiCtx, setApiCtx] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sid, setSid] = useState("c" + Date.now());
  const [curMsgs, setCurMsgs] = useState([]);
  const [toast, setToast] = useState(null);
  const [showPlus, setShowPlus] = useState(false);
  const [showPP, setShowPP] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(getH());
  const [user, setUser] = useState(getUser());
  const [modal, setModal] = useState(null); // phone|otp|setup|profile
  const [selCC, setSelCC] = useState({ f: "🇮🇳", c: "+91" });
  const [showCC, setShowCC] = useState(false);
  const [ccSearch, setCcSearch] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["","","","","",""]);
  const [demoOtp, setDemoOtp] = useState("");
  const [setupName, setSetupName] = useState("");
  const [setupTitle, setSetupTitle] = useState("");
  const [setupDob, setSetupDob] = useState("");
  const bottomRef = useRef(null);
  const otpRefs = useRef([]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // ── API CALL ──
  async function send() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    const userMsg = { role: "user", content: text };
    const newCtx = [...apiCtx, userMsg];
    setApiCtx(newCtx);
    setMsgs(p => [...p, { role: "user", text }]);
    setCurMsgs(p => [...p, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: "You are YUG, a helpful AI assistant. Reply in same language as user — Hindi or English. Be friendly and concise.",
          messages: newCtx
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Response nahi aaya.";
      setApiCtx(p => [...p, { role: "assistant", content: reply }]);
      setMsgs(p => [...p, { role: "bot", text: reply }]);
      setCurMsgs(p => [...p, { role: "bot", text: reply }]);
    } catch (e) {
      setMsgs(p => [...p, { role: "bot", text: "⚠️ " + e.message }]);
    }
    setLoading(false);
  }

  // ── NEW CHAT ──
  function newChat() {
    if (curMsgs.length > 0) {
      const h = getH();
      const title = curMsgs.find(m => m.role === "user")?.text?.substring(0, 45) || "Chat";
      const idx = h.findIndex(c => c.id === sid);
      const entry = { id: sid, title, messages: curMsgs, time: new Date().toLocaleString("en-IN") };
      if (idx >= 0) h[idx] = entry; else h.unshift(entry);
      setH(h); setHistory(h);
      showToast("✅ Chat save ho gaya!");
    }
    setSid("c" + Date.now()); setMsgs([]); setApiCtx([]); setCurMsgs([]);
  }

  // ── SIGN IN FLOW ──
  function sendOtp() {
    if (phone.length < 6) { showToast("⚠️ Valid number daalo!"); return; }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoOtp(code); setModal("otp"); setOtp(["","","","","",""]);
    setTimeout(() => otpRefs.current[0]?.focus(), 300);
  }

  function verifyOtp() {
    const entered = otp.join("");
    if (entered.length < 6) { showToast("6 digit daalo!"); return; }
    if (entered === demoOtp) {
      const fullPhone = selCC.c + phone;
      const existing = getUser();
      if (existing && existing.phone === fullPhone) {
        setUser(existing); setModal(null);
        showToast("✅ Welcome back, " + existing.name + "!");
      } else {
        setModal("setup");
      }
    } else {
      showToast("❌ Galat OTP!"); setOtp(["","","","","",""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }

  function saveProfile() {
    if (!setupName.trim()) { showToast("Naam daalo!"); return; }
    if (!setupTitle) { showToast("Title select karo!"); return; }
    if (!setupDob) { showToast("Date of birth daalo!"); return; }
    const u = { name: setupName.trim(), title: setupTitle, dob: setupDob, phone: selCC.c + phone, since: new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" }) };
    setUserLS(u); setUser(u); setModal(null);
    showToast("🎉 Welcome, " + setupTitle + " " + setupName + "!");
  }

  function logout() {
    if (confirm("Sign out karna chahte ho?")) {
      localStorage.removeItem("yug_user"); setUser(null); setShowPP(false); showToast("Signed out!");
    }
  }

  function loadChat(c) {
    setSid(c.id); setCurMsgs([...c.messages]);
    setApiCtx(c.messages.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text })));
    setMsgs(c.messages.map(m => ({ role: m.role, text: m.text })));
    setShowHistory(false);
  }

  function delChat(id, e) {
    e.stopPropagation();
    const h = getH().filter(c => c.id !== id); setH(h); setHistory(h);
  }

  const filteredCC = COUNTRIES.filter(c => c.n.toLowerCase().includes(ccSearch.toLowerCase()) || c.c.includes(ccSearch));

  return (
    <div style={S.app} onClick={() => { setShowPlus(false); setShowPP(false); }}>

      {/* TOPBAR */}
      <div style={S.topbar}>
        <div style={S.tl}>
          <button style={S.ibtn} onClick={e => { e.stopPropagation(); setShowHistory(true); }}>
            <svg width="18" height="14" viewBox="0 0 18 14"><rect width="18" height="2.5" rx="1.25" fill="#333"/><rect y="5.5" width="18" height="2.5" rx="1.25" fill="#333"/><rect y="11" width="18" height="2.5" rx="1.25" fill="#333"/></svg>
          </button>
          <span style={S.aname}>YUG</span>
        </div>
        <div style={S.tr}>
          <button style={S.ibtn} onClick={e => { e.stopPropagation(); newChat(); }}>✏️</button>
          <button style={{ ...S.ibtn, background: user ? "#111" : "#f0f0f0", color: user ? "#fff" : "#111", fontWeight: 700 }}
            onClick={e => { e.stopPropagation(); setShowPP(p => !p); }}>
            {user ? user.name[0].toUpperCase() : "👤"}
          </button>
        </div>
      </div>

      {/* PROFILE POPUP */}
      {showPP && (
        <div style={S.ppMenu} onClick={e => e.stopPropagation()}>
          {!user && <div style={S.ppopt} onClick={() => { setShowPP(false); setModal("phone"); }}>📱 Sign In</div>}
          {user && <div style={S.ppopt} onClick={() => { setShowPP(false); setModal("profile"); }}>👤 My Profile</div>}
          {user && <div style={{ ...S.ppopt, borderBottom: "none" }} onClick={logout}>🚪 Sign Out</div>}
        </div>
      )}

      {/* CHAT BODY */}
      <div style={S.body}>
        {user && msgs.length === 0 && (
          <div style={S.banner}>
            <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 2 }}>Namaste, {user.title} {user.name}! 🙏</div>
            <div style={{ fontSize: "0.78rem", opacity: 0.7 }}>YUG mein aapka swagat hai</div>
          </div>
        )}
        {msgs.length === 0 && !user && (
          <div style={S.placeholder}><div style={{ fontSize: 48, opacity: 0.2 }}>🌸</div><p>Kuch bhi pucho...</p></div>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={m.role === "user" ? S.msgU : S.msgB}>{m.text}</div>
        ))}
        {loading && <div style={S.typing}>YUG likh raha hai...</div>}
        <div ref={bottomRef}/>
      </div>

      {/* PLUS MENU */}
      {showPlus && (
        <div style={S.plusMenu} onClick={e => e.stopPropagation()}>
          <label style={S.popt}><span style={{ fontSize: "1.4rem" }}>📷</span> Click Picture
            <input type="file" accept="image/*" capture="environment" style={{ display: "none" }}
              onChange={e => { const f = e.target.files[0]; if (f) { setMsgs(p => [...p, { role: "user", text: "📷 " + f.name }]); setCurMsgs(p => [...p, { role: "user", text: "📷 " + f.name }]); } setShowPlus(false); }} />
          </label>
          <label style={S.popt}><span style={{ fontSize: "1.4rem" }}>🖼️</span> Upload Photo
            <input type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => { const f = e.target.files[0]; if (f) { setMsgs(p => [...p, { role: "user", text: "🖼️ " + f.name }]); setCurMsgs(p => [...p, { role: "user", text: "🖼️ " + f.name }]); } setShowPlus(false); }} />
          </label>
          <label style={{ ...S.popt, borderBottom: "none" }}><span style={{ fontSize: "1.4rem" }}>📎</span> Upload File
            <input type="file" accept="*/*" style={{ display: "none" }}
              onChange={e => { const f = e.target.files[0]; if (f) { setMsgs(p => [...p, { role: "user", text: "📎 " + f.name }]); setCurMsgs(p => [...p, { role: "user", text: "📎 " + f.name }]); } setShowPlus(false); }} />
          </label>
        </div>
      )}

      {/* BOTBAR */}
      <div style={S.botbar}>
        <button style={S.pbtn} onClick={e => { e.stopPropagation(); setShowPlus(p => !p); }}>＋</button>
        <input style={S.ibox} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()} placeholder="Message YUG..." />
        <button style={S.sbtn(loading)} onClick={send} disabled={loading}>↑</button>
      </div>

      {/* HISTORY SIDEBAR */}
      {showHistory && <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:200 }} onClick={() => setShowHistory(false)}/>}
      <div style={S.sidebar(showHistory)}>
        <div style={{ padding:"18px 16px", borderBottom:"1px solid #eee", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontWeight: 700 }}>💬 Chat History</span>
          <button style={{ width:30, height:30, borderRadius:"50%", background:"#f0f0f0", border:"none", cursor:"pointer" }} onClick={() => setShowHistory(false)}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {history.length === 0 ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"50px 20px", color:"#ccc", textAlign:"center", gap:12 }}>
              <span style={{ fontSize:"2rem" }}>💬</span>
              <p style={{ fontSize:"0.85rem", lineHeight:1.6 }}>Koi history nahi.<br/>New Chat karo to save hoga.</p>
            </div>
          ) : history.map((c) => (
            <div key={c.id} style={S.hItem} onClick={() => loadChat(c)}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"0.88rem", fontWeight:600, color:"#222", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.title}</div>
                <div style={{ fontSize:"0.75rem", color:"#bbb", marginTop:2 }}>{c.time}</div>
              </div>
              <button style={{ background:"none", border:"none", color:"#ddd", cursor:"pointer", fontSize:"1rem" }}
                onClick={e => delChat(c.id, e)}>🗑</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODALS ── */}

      {/* PHONE */}
      {modal === "phone" && (
        <div style={S.overlay} onClick={() => setModal(null)}>
          <div style={S.sheet} onClick={e => e.stopPropagation()}>
            <button style={{ position:"absolute", top:16, right:20, background:"none", border:"none", fontSize:"1.3rem", cursor:"pointer", color:"#999" }} onClick={() => setModal(null)}>✕</button>
            <div style={S.mTitle}>📱 Sign In</div>
            <div style={S.mSub}>Apna phone number enter karo</div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              <div style={{ height:50, border:"1.5px solid #ddd", borderRadius:12, padding:"0 10px", background:"#fafafa", display:"flex", alignItems:"center", gap:6, cursor:"pointer", flexShrink:0 }}
                onClick={() => setShowCC(true)}>
                <span>{selCC.f}</span><span style={{ fontSize:"0.9rem" }}>{selCC.c}</span>
              </div>
              <input style={{ flex:1, height:50, border:"1.5px solid #ddd", borderRadius:12, padding:"0 14px", fontSize:"1rem", outline:"none" }}
                value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" type="tel" maxLength={15}/>
            </div>
            <button style={S.mainBtn(false)} onClick={sendOtp}>Send OTP →</button>
          </div>
        </div>
      )}

      {/* OTP */}
      {modal === "otp" && (
        <div style={S.overlay}>
          <div style={S.sheet}>
            <button style={{ position:"absolute", top:16, left:20, background:"none", border:"none", fontSize:"1.3rem", cursor:"pointer", color:"#999" }} onClick={() => setModal("phone")}>←</button>
            <div style={S.mTitle}>🔐 OTP Verify Karo</div>
            <div style={S.mSub}>{selCC.c} {phone} pe OTP bheja gaya</div>
            <div style={S.demoBadge}>Demo OTP: <strong style={{ color:"#e65100", letterSpacing:4 }}>{demoOtp}</strong></div>
            <div style={S.otpRow}>
              {otp.map((v, i) => (
                <input key={i} ref={el => otpRefs.current[i] = el} style={S.otpBox} value={v} maxLength={1} inputMode="numeric"
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g,"").slice(-1);
                    const n = [...otp]; n[i] = val; setOtp(n);
                    if (val && i < 5) otpRefs.current[i+1]?.focus();
                  }}
                  onKeyDown={e => { if (e.key === "Backspace" && !v && i > 0) otpRefs.current[i-1]?.focus(); }}
                />
              ))}
            </div>
            <button style={S.mainBtn(false)} onClick={verifyOtp}>Verify ✓</button>
          </div>
        </div>
      )}

      {/* SETUP */}
      {modal === "setup" && (
        <div style={S.overlay}>
          <div style={S.sheet}>
            <div style={S.mTitle}>👋 Welcome to YUG!</div>
            <div style={S.mSub}>Profile complete karo</div>
            <label style={{ fontSize:"0.78rem", color:"#888", marginBottom:6, display:"block" }}>Naam</label>
            <input style={S.fullInp} value={setupName} onChange={e => setSetupName(e.target.value)} placeholder="e.g. Kaushal"/>
            <label style={{ fontSize:"0.78rem", color:"#888", marginBottom:6, display:"block" }}>Title</label>
            <select style={S.fullInp} value={setupTitle} onChange={e => setSetupTitle(e.target.value)}>
              <option value="">Select karo...</option>
              {["Mr.","Mrs.","Ms.","Dr.","Prof.","Er."].map(t => <option key={t}>{t}</option>)}
            </select>
            <label style={{ fontSize:"0.78rem", color:"#888", marginBottom:6, display:"block" }}>Date of Birth</label>
            <input style={S.fullInp} type="date" value={setupDob} onChange={e => setSetupDob(e.target.value)}/>
            <button style={S.mainBtn(false)} onClick={saveProfile}>Save & Start →</button>
          </div>
        </div>
      )}

      {/* MY PROFILE */}
      {modal === "profile" && user && (
        <div style={S.overlay} onClick={() => setModal(null)}>
          <div style={S.sheet} onClick={e => e.stopPropagation()}>
            <button style={{ position:"absolute", top:16, right:20, background:"none", border:"none", fontSize:"1.3rem", cursor:"pointer", color:"#999" }} onClick={() => setModal(null)}>✕</button>
            <div style={S.mTitle}>My Profile</div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 0 10px" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:"#111", color:"#fff", fontSize:"1.8rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
                {user.name[0].toUpperCase()}
              </div>
              <div style={{ fontSize:"1.1rem", fontWeight:800 }}>{user.title} {user.name}</div>
              <div style={{ fontSize:"0.83rem", color:"#999", marginTop:3 }}>{user.phone}</div>
              <div style={{ width:"100%", marginTop:14 }}>
                {[["Title", user.title], ["Date of Birth", user.dob ? new Date(user.dob).toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"}) : "-"], ["Member Since", user.since]].map(([l,v]) => (
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderBottom:"1px solid #f5f5f5" }}>
                    <span style={{ fontSize:"0.78rem", color:"#aaa" }}>{l}</span>
                    <span style={{ fontSize:"0.88rem", fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COUNTRY PICKER */}
      {showCC && (
        <div style={{ ...S.overlay, zIndex:400 }} onClick={() => setShowCC(false)}>
          <div style={{ background:"#fff", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:480, height:"70vh", display:"flex", flexDirection:"column" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding:"18px 20px", borderBottom:"1px solid #eee", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <span style={{ fontWeight:700 }}>Select Country</span>
              <button style={{ width:30, height:30, borderRadius:"50%", background:"#f0f0f0", border:"none", cursor:"pointer" }} onClick={() => setShowCC(false)}>✕</button>
            </div>
            <input style={{ height:42, border:"1.5px solid #eee", borderRadius:10, padding:"0 14px", fontSize:"0.9rem", outline:"none", margin:"12px 20px", width:"calc(100% - 40px)" }}
              placeholder="Search..." value={ccSearch} onChange={e => setCcSearch(e.target.value)}/>
            <div style={{ flex:1, overflowY:"auto" }}>
              {filteredCC.map(c => (
                <div key={c.n} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px", cursor:"pointer", borderBottom:"1px solid #f5f5f5" }}
                  onClick={() => { setSelCC({ f: c.f, c: c.c }); setShowCC(false); setCcSearch(""); }}>
                  <span style={{ fontSize:"1.4rem" }}>{c.f}</span>
                  <span style={{ flex:1, fontSize:"0.9rem" }}>{c.n}</span>
                  <span style={{ fontSize:"0.85rem", color:"#888", fontWeight:600 }}>{c.c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}
