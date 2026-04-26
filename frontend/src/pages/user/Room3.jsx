import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../../context/GameContext';
import axios from 'axios';

const room3Questions = [
  {
    title: "Q1 — Chapter 1: Counting the survivors",
    scenario: `In the city of Alvara, five people work together at a humanitarian aid center: Maya (the logistics manager), Arjun (the data analyst), Leena (the field coordinator), Zaid (the supply officer), and Priya (the volunteer head). One week, a flood hits a nearby village. Each question builds on the last — the answer from one chapter affects the next.

Arjun receives three separate reports from three rescue teams.
Team A rescued 48 people.
Team B rescued half the number that Team A rescued.
Team C rescued 10 more than Team B.
Arjun must report the total to Maya so she can arrange supplies.

Question: How many survivors did all three teams rescue in total?`,
    options: ["106","110","100","118"],
    answer: 0,
    codeValue: "A1x"
  },
  {
    title: "Q2 — Chapter 2: Packing the supply boxes",
    scenario: `Maya now knows there are 106 survivors (from Q1).
Each supply box fits exactly 8 items.
Maya has 850 items in the warehouse.
She wants to pack as many complete boxes as possible using all 850 items.
Each survivor must receive at least 1 box.
Zaid tells her: "If you have leftover items that don't fill a complete box, we will hand-deliver those separately."

Question: How many items will be left over after packing as many complete boxes as possible?`,
    options: ["2","4","6","0"],
    answer: 0,
    codeValue: "B2k"
  },
  {
    title: "Q3 — Chapter 3: Leena's delivery schedule",
    scenario: `Leena must visit 5 flood zones — Zone 1, Zone 2, Zone 3, Zone 4, and Zone 5 — in one day.
The rules are:
She must visit Zone 3 before Zone 5.
Zone 1 must be visited first.
Zone 4 must be visited immediately after Zone 2.
Zone 5 is not the last zone she visits.

Question: What is the correct order of Leena's visits?`,
    options: [
      "Zone 1 → Zone 3 → Zone 2 → Zone 4 → Zone 5",
      "Zone 1 → Zone 2 → Zone 4 → Zone 3 → Zone 5",
      "Zone 1 → Zone 2 → Zone 4 → Zone 5 → Zone 3",
      "Zone 1 → Zone 3 → Zone 5 → Zone 2 → Zone 4"
    ],
    answer: 1,
    codeValue: "C3p"
  },
  {
    title: "Q4 — Chapter 4: The missing volunteers",
    scenario: `Priya sent 4 volunteer teams to the last zone.
Each team had a different number of volunteers: 3, 5, 7, and 9.
After the mission, Priya counted and found only 19 volunteers returned.
She knows that exactly one full team did not return.

Question: Which team (by size) did not return?`,
    options: [
      "The team of 3",
      "The team of 5",
      "The team of 7",
      "The team of 9"
    ],
    answer: 1,
    codeValue: "D4z"
  },
  {
    title: "Q5 — Chapter 5: The stolen supplies",
    scenario: `Zaid discovers that 30 supply boxes are missing from the warehouse.
Five people had access to the warehouse that week: Maya, Arjun, Leena, Zaid himself, and Priya.
Zaid collected these facts:

Fact 1: The person who took the boxes did so on the day Leena was doing deliveries (the day from Q3).
Fact 2: Arjun was in the data room all day that day — three colleagues confirm this.
Fact 3: Maya was in meetings from 9 AM to 5 PM — the meeting log confirms this.
Fact 4: Zaid himself was in the field with Leena all day.
Fact 5: The warehouse key log shows the boxes were removed between 2 PM and 4 PM.
Fact 6: Priya had no alibi for that time window and her volunteer team (the team of 5 from Q4) was unaccounted for during those same hours.

Question: Who is the most logically probable person responsible for the missing boxes?`,
    options: [
      "Arjun — he had access to warehouse data and could have planned it.",
      "Maya — she manages logistics so she knew where everything was.",
      "Leena — she was in the field but could have sent someone back.",
      "Priya — she is the only person without a confirmed alibi during the exact time window, and her team was also unaccounted for at the same time."
    ],
    answer: 3,
    codeValue: "E5m"
  }
];

const styles = `
  .room3-container {
    min-height: 100vh;
    background-color: #0a0a0c;
    color: #ffffff;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background-image: radial-gradient(circle at 50% 0%, #1a1a24 0%, #0a0a0c 70%);
  }

  /* Timer Box */
  .timer-box {
    font-size: 3rem;
    font-weight: 800;
    color: #00ffcc;
    text-shadow: 0 0 10px #00ffcc;
    margin-bottom: 2rem;
    padding: 1rem 2.5rem;
    border: 2px solid #00ffcc;
    border-radius: 12px;
    background: rgba(0, 255, 204, 0.05);
    box-shadow: inset 0 0 20px rgba(0, 255, 204, 0.15), 0 0 20px rgba(0, 255, 204, 0.2);
    letter-spacing: 2px;
    transition: all 0.3s ease;
  }

  .timer-warning {
    color: #ff3366;
    border-color: #ff3366;
    text-shadow: 0 0 10px #ff3366, 0 0 20px #cc0033;
    box-shadow: inset 0 0 20px rgba(255, 51, 102, 0.15), 0 0 20px rgba(255, 51, 102, 0.2);
  }

  .penalty-banner {
    background: #ff3366;
    color: white;
    padding: 1rem;
    width: 100%;
    max-width: 600px;
    text-align: center;
    font-weight: bold;
    font-size: 1.2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 0 15px rgba(255,51,102,0.5);
    animation: pulse 1s infinite alternate;
  }

  @keyframes pulse {
    from { opacity: 0.8; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1.02); }
  }

  /* Main Card */
  .problem-card {
    background: rgba(20, 20, 30, 0.85);
    border: 1px solid #333;
    border-radius: 16px;
    padding: 2.5rem;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    border-color: #ffaa00;
    box-shadow: 0 10px 30px rgba(255,170,0,0.1);
  }

  .problem-progress {
    color: #888;
    font-size: 1rem;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .problem-title {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
    color: #ffaa00;
  }

  .problem-scenario {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
    color: #e0e0e0;
    white-space: pre-line;
  }

  /* Options */
  .options-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .opt-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 16px 20px;
    color: #ddd;
    font-size: 1rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    gap: 15px;
  }

  .opt-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .opt-btn.locked {
    opacity: 0.3;
    cursor: not-allowed;
    background: rgba(255,51,102,0.1);
    border-color: #ff3366;
  }

  .opt-btn:hover:not(.disabled):not(.locked) {
    background: rgba(255,255,255,0.1);
    color: #fff;
    transform: translateX(5px);
    border-color: #ffaa00;
  }

  /* Final Escape */
  .answer-input {
    width: 100%;
    padding: 12px 16px;
    font-size: 24px;
    letter-spacing: 5px;
    text-align: center;
    border-radius: 8px;
    border: 2px solid #555;
    background: #0f172a;
    color: white;
    outline: none;
    margin-bottom: 15px;
    font-family: monospace;
    transition: all 0.3s;
  }
  .answer-input:focus { border-color: #b026ff; box-shadow: 0 0 10px #b026ff; }

  .submit-btn {
    background: #b026ff;
    color: #fff;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    font-weight: 800;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
    width: 100%;
  }
  .submit-btn:hover:not(:disabled) {
    background: #d178ff;
    box-shadow: 0 0 15px #b026ff;
    transform: translateY(-2px);
  }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Message Pop */
  .system-msg {
    margin-top: 1.5rem;
    font-weight: bold;
    font-size: 1.3rem;
    text-align: center;
  }
  .msg-success { color: #00ffcc; text-shadow: 0 0 10px #00ffcc; }
  .msg-error { color: #ff3366; text-shadow: 0 0 10px #ff3366; }

  /* Codes Collected */
  .codes-tracker {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 2rem;
  }
  .code-chip {
    background: #111;
    border: 1px solid #b026ff;
    color: #b026ff;
    padding: 5px 15px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 1.2rem;
    box-shadow: 0 0 10px rgba(176,38,255,0.2);
  }
`;

const Room3 = () => {
  const navigate = useNavigate();
  const { gameState, submitPuzzle } = useContext(GameContext);

  const [timeLeft, setTimeLeft] = useState(600);
  const [gameOver, setGameOver] = useState(false);
  const [roomUnlocked, setRoomUnlocked] = useState(false);
  
  const [qIndex, setQIndex] = useState(() => {
    if (!localStorage.getItem("room3Started")) return 0;
    return Number(localStorage.getItem("r3_qIndex")) || 0;
  });
  const [codes, setCodes] = useState(() => {
    if (!localStorage.getItem("room3Started")) return [];
    return JSON.parse(localStorage.getItem("r3_codes") || "[]");
  });
  const [penaltyTime, setPenaltyTime] = useState(() => {
    const savedEnd = localStorage.getItem("room3PenaltyEnd");
    if (savedEnd) {
      const remaining = Math.ceil((Number(savedEnd) - Date.now()) / 1000);
      if (remaining > 0) return remaining;
      localStorage.removeItem("room3PenaltyEnd");
    }
    return 0;
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const [showFinal, setShowFinal] = useState(() => {
    if (!localStorage.getItem("room3Started")) return false;
    return localStorage.getItem("r3_showFinal") === "true";
  });
  const [finalInput, setFinalInput] = useState("");

  const currentQ = room3Questions[qIndex];

  const [isLoading, setIsLoading] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("r3_qIndex", qIndex);
    localStorage.setItem("r3_codes", JSON.stringify(codes));
    localStorage.setItem("r3_showFinal", showFinal);
  }, [qIndex, codes, showFinal]);

  useEffect(() => {
    const initRoom = async () => {
      const localProgress = Number(sessionStorage.getItem("progress"));

      if ((gameState.progress !== undefined && gameState.progress < 2) && localProgress < 2) {
        navigate('/dashboard', { replace: true });
        return;
      } 
      
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.post("https://escape-room-vgd1.onrender.com/api/game/start-room3", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { room3Start, room3Completed } = res.data;

        if (room3Completed) {
          navigate('/dashboard', { replace: true });
          return;
        }

        const startMs = new Date(room3Start).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startMs) / 1000);
        const remaining = Math.max(0, 600 - elapsed);
        
        if (!localStorage.getItem("room3Started")) {
          setQIndex(0);
          setCodes([]);
          setShowFinal(false);
          localStorage.setItem("room3Started", "true");
        }

        setTimeLeft(remaining);
        setIsLoading(false);
      } catch (err) {
        console.log("Room 3 Start Trace:", err.response?.data || err.message);
        setIsLoading(false);
        if (err.response && err.response.status === 403) {
          alert("Admin has not unlocked this room yet!");
          navigate('/dashboard', { replace: true });
        }
      }
    };
    initRoom();
  }, [gameState.progress, navigate]);

  useEffect(() => {
    if (isLoading || gameOver || roomUnlocked) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      const token = sessionStorage.getItem('token');
      axios.post("https://escape-room-vgd1.onrender.com/api/game/fail-room", { roomNumber: 3 }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        localStorage.removeItem("r3_qIndex");
        localStorage.removeItem("r3_codes");
        localStorage.removeItem("r3_showFinal");
        localStorage.removeItem("room3PenaltyEnd");
        localStorage.removeItem("room3Started");
      }).catch(err => console.error("Fail Sync Error:", err));
      return;
    }
    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, gameOver, roomUnlocked, isLoading]);

  useEffect(() => {
    if (penaltyTime > 0) {
      const interval = setInterval(() => setPenaltyTime(p => p - 1), 1000);
      return () => clearInterval(interval);
    } else if (penaltyTime === 0 && message.type === "error" && !showFinal) {
      setMessage({ text: "", type: "" });
      setIsProcessing(false);
      localStorage.removeItem("room3PenaltyEnd");
    }
  }, [penaltyTime, message.type, showFinal]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOptionClick = (idx) => {
    if (isProcessing || penaltyTime > 0) return;
    setIsProcessing(true);

    if (idx === currentQ.answer) {
      setCodes(prev => [...prev, currentQ.codeValue]);
      setMessage({ text: `Fragment Acquired: ${currentQ.codeValue}`, type: "success" });

      setTimeout(() => {
        setMessage({ text: "", type: "" });
        setIsProcessing(false);
        if (qIndex + 1 < room3Questions.length) {
          setQIndex(prev => prev + 1);
        } else {
          setShowFinal(true);
        }
      }, 1500);

    } else {
      setMessage({ text: "System Locked for 10 seconds...", type: "error" });
      setPenaltyTime(10);
      localStorage.setItem("room3PenaltyEnd", Date.now() + 10000);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing || penaltyTime > 0) return;
    
    const expectedFinal = room3Questions.map(q => q.codeValue).join('');

    if (finalInput.trim() === expectedFinal) {
      setMessage({ text: "ACCESS GRANTED. MATRIX DEFEATED.", type: "success" });
      try {
        await axios.post(
          "https://escape-room-vgd1.onrender.com/api/game/complete-room3",
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        sessionStorage.setItem("progress", 3);
        
        localStorage.removeItem("r3_qIndex");
        localStorage.removeItem("r3_codes");
        localStorage.removeItem("r3_showFinal");
        localStorage.removeItem("room3PenaltyEnd");
        localStorage.removeItem("room3Started");

        setTimeout(() => {
          setRoomUnlocked(true);
        }, 1500);
      } catch (err) {
        console.error(err);
        setMessage({ text: "API Sync Error. Connection Lost.", type: "error" });
      }
    } else {
      setMessage({ text: "Incorrect Override Sequence.", type: "error" });
      setFinalInput("");
      setPenaltyTime(3);
      localStorage.setItem("room3PenaltyEnd", Date.now() + 3000);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        localStorage.removeItem("room3PenaltyEnd");
      }, 3000);
    }
  };

  // Route lock out back button
  useEffect(() => {
    if (roomUnlocked) {
      window.history.pushState(null, null, window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, null, window.location.href);
        navigate('/dashboard', { replace: true });
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [roomUnlocked, navigate]);

  if (isLoading) {
    return (
      <div className="room3-container" style={{ justifyContent: 'center' }}>
        <style>{styles}</style>
        <div style={{ color: '#00ffcc', fontSize: '2rem' }}>Loading Interface...</div>
      </div>
    );
  }

  if (roomUnlocked) {
    return (
      <div className="room3-container" style={{ justifyContent: 'center' }}>
        <style>{styles}</style>
        <h1 style={{ fontSize: '4rem', color: '#b026ff', textShadow: '0 0 20px #b026ff' }}>SYSTEM COMPROMISED 🎉</h1>
        <p style={{ fontSize: '1.5rem', color: '#fff', margin: '2rem 0' }}>All nodes unlocked. Extraction complete.</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ background: '#b026ff', color: '#fff', padding: '1rem 3rem', fontSize: '1.5rem', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="room3-container" style={{ justifyContent: 'center' }}>
        <style>{styles}</style>
        <h1 style={{ fontSize: '5rem', color: '#ff3366', textShadow: '0 0 20px #ff3366', marginBottom: '2rem' }}>MISSION FAILED</h1>
        <p style={{ fontSize: '1.5rem', color: '#aaa', marginBottom: '3rem' }}>Time limit exceeded. Node terminated.</p>
        <button style={{ background: '#ff3366', color: '#fff', padding: '1rem 3rem', fontSize: '1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={() => window.location.reload()}>Retry Extraction</button>
      </div>
    );
  }

  return (
    <div className="room3-container">
      <style>{styles}</style>

      <div className="header-desc" style={{ marginBottom: '20px', color: '#aaa' }}>
        Bypass the sequential nodes to formulate the final access code.
      </div>

      <div className={`timer-box ${timeLeft <= 60 ? 'timer-warning' : ''}`}>
        {formatTime(timeLeft)}
      </div>

      {penaltyTime > 0 && (
        <div className="penalty-banner">
          LOCKED: {penaltyTime}s Remaining
        </div>
      )}

      <div className="problem-card">
        
        {showFinal ? (
          <div style={{ textAlign: 'center' }}>
            <h2 className="problem-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>MASTER OVERRIDE</h2>
            <p style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '2rem' }}>Enter Final Escape Code generated from fragments.</p>
            
            <div className="codes-tracker" style={{ marginBottom: "20px" }}>
              <p style={{ color: "#aaa", marginBottom: "10px" }}>
                Collected Fragments:
              </p>
            
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                {codes.map((code, idx) => (
                  <span
                    key={idx}
                    className="code-chip"
                    style={{
                      fontSize: "1.3rem",
                      padding: "8px 16px",
                      border: "1px solid #b026ff",
                      boxShadow: "0 0 10px #b026ff"
                    }}
                  >
                    {code}
                  </span>
                ))}
              </div>
              <p style={{ color: "#666", marginTop: "10px" }}>
                Combine all fragments in correct order.
              </p>
            </div>

            <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input 
                type="text" 
                className="answer-input" 
                placeholder="ENTER CODE" 
                value={finalInput} 
                onChange={e => setFinalInput(e.target.value)}
                disabled={isProcessing || penaltyTime > 0}
                autoFocus
              />
              <button className="submit-btn" type="submit" disabled={isProcessing || penaltyTime > 0 || !finalInput}>
                VERIFY OVERRIDE
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="problem-progress">Security Node {qIndex + 1} / {room3Questions.length}</div>
            <div className="problem-title">{currentQ.title}</div>
            <div className="problem-scenario">{currentQ.scenario}</div>

            <div className="options-grid">
              {currentQ.options.map((opt, i) => {
                let cls = "opt-btn";
                if (isProcessing && message.type === "success") {
                  if (i === currentQ.answer) cls += " locked"; 
                  else cls += " disabled";
                } else if (penaltyTime > 0) {
                  cls += " locked";
                }
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handleOptionClick(i)}
                    disabled={isProcessing || penaltyTime > 0}
                  >
                    <span style={{ fontWeight: 'bold', color: '#ffaa00' }}>
                      {['A','B','C','D'][i]}.
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {message.text && (
          <div className={`system-msg ${message.type === 'success' ? 'msg-success' : 'msg-error'}`}>
            {message.text}
          </div>
        )}

        {!showFinal && (
          <div className="codes-tracker">
            {codes.length === 0 ? (
              <span style={{ color: "#666", fontSize: "0.9rem" }}>
                No fragments collected yet...
              </span>
            ) : (
              codes.map((code, idx) => (
                <span 
                  key={idx} 
                  className="code-chip"
                  style={{
                    boxShadow: idx === codes.length - 1 ? "0 0 15px #b026ff" : "none"
                  }}
                >
                  {code}
                </span>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Room3;
