import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ─── DOOR 1 QUESTIONS (CODING) ───────────────────────────────────────────────
const door1Questions = [
{
title: "🚑 Integrated Emergency Response Failure",
scenario: `You are the technical lead overseeing a district-wide emergency response system deployed after a massive earthquake. The system is supposed to:

Identify high-risk patients
Allocate ambulance dispatch priority
Send final instructions to field teams

However, field teams report that critically injured children are not receiving higher priority, even though policy clearly states they should.

You audit the system:

Doctors argue that advanced ambulances should have been deployed, but the system output differs.

Question: What decision will the system ultimately send to the field team?`,
codeBlocks: [
`def triage(patients):
score = 0
for p in patients:
if p["critical"]:
score += 1
elif p["critical"] and p["age"] < 18:
score += 2
return score`,
`def dispatch(score):
if score > 3:
return "Send Advanced Ambulance"
return "Send Basic Ambulance"`,
`patients = [
{"critical": True, "age": 10},
{"critical": True, "age": 35},
{"critical": True, "age": 8},
{"critical": False, "age": 50},
]

print(dispatch(triage(patients)))`
],
options: [
"Send Advanced Ambulance",
"Send Basic Ambulance",
"No dispatch due to system error",
"Random allocation"
],
answer: 1,
codeValue: "X7p"
},

{
title: "🌊 Contaminated Water Alert Suppression",
scenario: `You are investigating a rural water monitoring system after villagers fall sick despite multiple high contamination readings.

The system is designed to:

Detect unsafe readings
Convert them into warnings
Send alerts to authorities

However, officials insist the system reported “SAFE” status.

Villagers claim warnings were needed, but system behaved differently.

Question: What action will the system actually take?`,
codeBlocks: [
`def detect(samples):
alert = False
for s in samples:
if s > 50:
alert = True
else:
alert = False
return alert`,
`def decision(alert):
if alert:
return "Issue Public Warning"
return "No Action Needed"`,
`samples = [45, 60, 30, 80, 20]
print(decision(detect(samples)))`
],
options: [
"Issue Public Warning",
"No Action Needed",
"System Crash",
"Delayed Response"
],
answer: 1,
codeValue: "mK2"
},

{
title: "🌧️ Flood Risk Underestimation",
scenario: `You are part of a national disaster analytics team. A predictive model estimates flood spread and classifies risk levels:

LOW → No evacuation
MEDIUM → Prepare evacuation
HIGH → Immediate evacuation

However, field officers report that evacuation was delayed despite dangerous conditions.

Officials assumed worst-case action would be triggered.

Question: What decision does the system actually produce?`,
codeBlocks: [
`def spread(n):
if n <= 0:
return 0
if n == 1:
return 1
return spread(n-1) + spread(n-2) + 1`,
`def classify(value):
if value > 10:
return "Immediate evacuation"
elif value > 5:
return "Prepare evacuation"
return "No evacuation"`,
`print(classify(spread(4)))`
],
options: [
"Immediate evacuation",
"Prepare evacuation",
"No evacuation",
"System failure"
],
answer: 1,
codeValue: "Q9z"
},

{
title: "🧪 Disease Simulation Resource Misjudgment",
scenario: `A national health lab runs a simulation to estimate how intensive a disease outbreak response will be.

Based on interaction count:

LOW → Minimal resources
HIGH → Emergency response

However, decision-makers underestimated the required response.

Authorities believed routine monitoring would be enough.

Question: What action will the system actually trigger?`,
codeBlocks: [
`def interactions(n, m):
total = 0
for i in range(n):
for j in range(m):
total += 1
return total`,
`def response(total):
if total > 40:
return "Emergency Response Activated"
return "Routine Monitoring"`,
`print(response(interactions(6, 7)))`
],
options: [
"Routine Monitoring",
"Emergency Response Activated",
"No Action",
"Data Error"
],
answer: 1,
codeValue: "T5x"
},

{
title: "🔋 Rural Power Monitoring Failure",
scenario: `You are evaluating a rural electrification dashboard. Engineers confirm that the system calculates backup duration correctly, but no usable data appears on the dashboard.

Officials expected a proper backup report, but instead saw missing data.

Question: What will the system display?`,
codeBlocks: [
`def backup(hours):
duration = hours * 2`,
`def display(value):
if value:
return f"Backup: {value} hours"
return "No Data Available"`,
`print(display(backup(8)))`
],
options: [
"Backup: 16 hours",
"Backup: 8 hours",
"No Data Available",
"System Error"
],
answer: 2,
codeValue: "L2a"
}
];

// ─── DOOR 2 QUESTIONS (LOGIC) ────────────────────────────────────────────────
const door2Questions = [
{
title: "🚑 Flash Flood Command Decision",
scenario: `You are the district disaster response officer during a sudden flash flood in a hilly region. Communication lines are weak, and you have one rescue boat team that can make only two trips before nightfall.

Three locations have sent distress signals:

Riverside School: 40 children stranded on the roof, water rising slowly
Old Age Home: 25 elderly people, some bedridden, water rising rapidly
Market Area: 60 people, mostly healthy adults, but panic spreading

Additional constraints:

If panic escalates in the market, stampede deaths are possible
The elderly cannot survive prolonged exposure to cold water
Children are currently safe but may not remain so after nightfall
Only two locations can be covered before dark

You must decide the rescue order, knowing one group will not be reached in time.

Question: Which location is most likely to be left without rescue?`,
options: [
"Riverside School",
"Old Age Home",
"Market Area",
"Cannot be determined"
],
answer: 2,
codeValue: "Z1m"
},

{
title: "🏥 District Hospital Power Allocation",
scenario: `You are the administrator of a district hospital facing a complete power outage. Backup generators can support only two departments simultaneously:

ICU (life support patients)
Emergency Ward (incoming trauma cases)
Dialysis Unit (patients need scheduled treatment)
Neonatal Unit (newborn critical care)

Constraints:

ICU patients will not survive without power
Neonatal unit requires continuous support if active
Emergency Ward can stabilize patients temporarily without full power
Dialysis patients can survive short delays but not long ones

Doctors suggest multiple combinations, but only one option minimizes total loss of life under these conditions.

Question: Which two departments should remain operational?`,
options: [
"ICU & Emergency",
"ICU & Neonatal",
"Emergency & Dialysis",
"Neonatal & Dialysis"
],
answer: 1,
codeValue: "R8k"
},

{
title: "🍲 Famine Relief Logistics",
scenario: `You are coordinating food distribution in a drought-affected region. Due to transport issues, you can supply only 3 out of 5 villages today.

Village conditions:

Village A: Moderate population, food shortage just beginning
Village B: Large population, currently stable but declining
Village C: Small population, severe malnutrition cases rising
Village D: Medium population, no food for 2 days
Village E: Remote, very small population, extreme starvation

Constraints:

Severe malnutrition cases require immediate attention
Large populations increase total survival impact
Remote villages may not survive delay due to lack of alternatives
You must balance urgency and scale

After applying all considerations, two villages will not receive supplies today.

Question: Which village is most likely excluded despite high severity?`,
options: [
"Village A",
"Village B",
"Village C",
"Village E"
],
answer: 3,
codeValue: "Y6p"
},

{
title: "🧬 Epidemic Source Containment",
scenario: `You are leading a medical investigation in a densely populated camp after an outbreak.

Timeline data:

Day 1: Meena falls sick
Day 2: Rafiq and Sohan show symptoms
Day 3: Kavita falls sick after meeting Rafiq
Day 4: Entire cluster spreads

Observations:

Meena had no known contact with Rafiq or Sohan before illness
Rafiq had traveled outside camp recently
Sohan had only interacted within the camp
Kavita only interacted with Rafiq

Officials initially suspect Meena as the first case, but inconsistencies appear.

Question: Who is the most probable original source?`,
options: [
"Meena",
"Rafiq",
"Sohan",
"Kavita"
],
answer: 1,
codeValue: "D4t"
},

{
title: "⚖️ Policy Decision Under Pressure",
scenario: `You are part of a national task force allocating limited funds across sectors during a crisis:

Rural healthcare expansion (low coverage, high mortality)
Urban infrastructure repair (affects large population)
Nutrition programs (targets vulnerable groups)
Economic stimulus (long-term recovery)

Constraints:

Immediate survival must be prioritized
Long-term recovery cannot be ignored completely
Urban pressure is politically high
Vulnerable populations are at highest risk

After deliberation, one sector is not prioritized in the current phase.

Question: Which sector is most likely deprioritized?`,
options: [
"Rural healthcare",
"Urban infrastructure",
"Nutrition programs",
"Economic stimulus"
],
answer: 3,
codeValue: "N3x"
}
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  .room2-container {
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
  }
  .d1-card { border-color: #00ffcc; box-shadow: 0 10px 30px rgba(0,255,204,0.1); }
  .d2-card { border-color: #ffaa00; box-shadow: 0 10px 30px rgba(255,170,0,0.1); }

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
  }
  .d1-text { color: #00ffcc; }
  .d2-text { color: #ffaa00; }

  .problem-scenario {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
    color: #e0e0e0;
  }

  .code-block {
    background: #0d0d12;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1.5rem;
    font-family: 'Courier New', Courier, monospace;
    color: #a8b2d1;
    white-space: pre-wrap;
    margin-bottom: 1.5rem;
    overflow-x: auto;
  }

  .data-block {
    background: rgba(255,170,0,0.05);
    border: 1px solid rgba(255,170,0,0.2);
    border-radius: 8px;
    padding: 1.5rem;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.2rem;
    color: #ffaa00;
    margin-bottom: 1.5rem;
    text-align: center;
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
  }
  
  .d1-opt:hover:not(.disabled):not(.locked) { border-color: #00ffcc; }
  .d2-opt:hover:not(.disabled):not(.locked) { border-color: #ffaa00; }

  /* Selection Screen Inputs */
  .doors-container {
    display: flex;
    gap: 2rem;
    justify-content: center;
    margin-top: 3rem;
  }

  .door-select {
    border: 2px solid;
    padding: 3rem;
    border-radius: 12px;
    background: rgba(0,0,0,0.5);
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    width: 280px;
    text-align: center;
  }

  .door-d1 {
    border-color: #00ffcc;
    box-shadow: 0 0 15px rgba(0,255,204,0.2);
  }
  .door-d1:hover {
    background: rgba(0,255,204,0.1);
    transform: translateY(-5px);
  }

  .door-d2 {
    border-color: #ffaa00;
    box-shadow: 0 0 15px rgba(255,170,0,0.2);
  }
  .door-d2:hover {
    background: rgba(255,170,0,0.1);
    transform: translateY(-5px);
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

const Room2 = () => {
  const navigate = useNavigate();

  // Root States
  const [doorMode, setDoorMode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [gameOver, setGameOver] = useState(false);
  const [roomUnlocked, setRoomUnlocked] = useState(false);
  
  // Game States
  const [qIndex, setQIndex] = useState(() => Number(localStorage.getItem("r2_qIndex")) || 0);
  const [codes, setCodes] = useState(() => JSON.parse(localStorage.getItem("r2_codes") || "[]"));
  const [penaltyTime, setPenaltyTime] = useState(() => {
    const savedEnd = localStorage.getItem("room2PenaltyEnd");
    if (savedEnd) {
      const remaining = Math.ceil((Number(savedEnd) - Date.now()) / 1000);
      if (remaining > 0) return remaining;
      localStorage.removeItem("room2PenaltyEnd");
    }
    return 0;
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  // Final Form States
  const [showFinal, setShowFinal] = useState(() => localStorage.getItem("r2_showFinal") === "true");
  const [finalInput, setFinalInput] = useState("");

  const questions = doorMode === 'd1' ? door1Questions : door2Questions;
  const currentQ = questions ? questions[qIndex] : null;

  const [isLoading, setIsLoading] = useState(true);

  // ─── INITIALIZATION ────────────────────────────────────────────────────────
  useEffect(() => {
    const isFreshEntry = sessionStorage.getItem("room2Fresh");

    if (!isFreshEntry) {
      localStorage.removeItem("room2Door");
      sessionStorage.setItem("room2Fresh", "true");
    }
  }, []);

  useEffect(() => {
    const savedDoor = localStorage.getItem("room2Door");
    const savedProgress = localStorage.getItem("r2_qIndex");

    if (savedDoor && savedProgress) {
      setDoorMode(savedDoor);
    }
  }, []);
  useEffect(() => {
    const initRoom = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.post("https://escape-room-vgd1.onrender.com/api/game/start-room2", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const { room2Start, room2Completed } = res.data;
        
        if (room2Completed) {
          navigate('/dashboard', { replace: true });
          return;
        }

        const startMs = new Date(room2Start).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startMs) / 1000);
        const remaining = Math.max(0, 600 - elapsed);
        
        setTimeLeft(remaining);
        setIsLoading(false);
      } catch (err) {
        console.error("Room 2 Start Error:", err);
        setIsLoading(false);
        if (err.response && err.response.status === 403) {
          alert("Admin has not unlocked this room yet!");
          navigate('/dashboard', { replace: true });
        }
      }
    };
    initRoom();
  }, [navigate]);

  // Sync to localStorage
  useEffect(() => {
    if (doorMode) localStorage.setItem("r2_doorMode", doorMode);
    localStorage.setItem("r2_qIndex", qIndex);
    localStorage.setItem("r2_codes", JSON.stringify(codes));
    localStorage.setItem("r2_showFinal", showFinal);
  }, [doorMode, qIndex, codes, showFinal]);

  // ─── TICKER ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading || gameOver || roomUnlocked || doorMode === null) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      const token = sessionStorage.getItem('token');
      axios.post("https://escape-room-vgd1.onrender.com/api/game/fail-room", { roomNumber: 2 }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error("Fail Sync Error:", err));
      return;
    }
    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, gameOver, roomUnlocked, doorMode, isLoading]);

  // ─── PENALTY TICKER ──────────────────────────────────────────────────────
  useEffect(() => {
    if (penaltyTime > 0) {
      const interval = setInterval(() => setPenaltyTime(p => p - 1), 1000);
      return () => clearInterval(interval);
    } else if (penaltyTime === 0 && message.type === "error" && !showFinal) {
      setMessage({ text: "", type: "" });
      setIsProcessing(false);
      localStorage.removeItem("room2PenaltyEnd");
    }
  }, [penaltyTime, message.type, showFinal]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleDoorSelect = async (mode) => {
    setDoorMode(mode);
    localStorage.setItem("room2Door", mode);
    setTimeLeft(600); // Start 10 mins explicitly
    try {
      const token = sessionStorage.getItem('token');
      await axios.post("https://escape-room-vgd1.onrender.com/api/game/start-room2", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to log start:", err);
    }
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
        if (qIndex + 1 < questions.length) {
          setQIndex(prev => prev + 1);
        } else {
          setShowFinal(true);
        }
      }, 1500);

    } else {
      setMessage({ text: "System Locked for 10 seconds...", type: "error" });
      setPenaltyTime(10);
      localStorage.setItem("room2PenaltyEnd", Date.now() + 10000);
      // isProcessing stays true until penaltyTime reaches 0 (handled by effect)
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing || penaltyTime > 0) return;
    
    // Exact expected hash generated dynamically from questions
    const expectedFinal = questions.map(q => q.codeValue).join('');

    if (finalInput.trim() === expectedFinal) {
      setMessage({ text: "ROOM ESCAPED", type: "success" });
      try {
        await axios.post(
          "https://escape-room-vgd1.onrender.com/api/game/complete-room2",
          {
            door: doorMode
          },
          {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
          }
        );
        sessionStorage.setItem("progress", 2);
        
        // Clear local storage on completion
        localStorage.removeItem("r2_doorMode");
        localStorage.removeItem("r2_qIndex");
        localStorage.removeItem("r2_codes");
        localStorage.removeItem("r2_showFinal");
        localStorage.removeItem("room2PenaltyEnd");

        setTimeout(() => setRoomUnlocked(true), 1500);
      } catch (err) {
        console.error("FULL ERROR:", err.response?.data || err.message);
        setMessage({ text: "API Sync Error. Connection Lost.", type: "error" });
      }
    } else {
      setMessage({ text: "Incorrect Override Sequence.", type: "error" });
      setFinalInput("");
      setPenaltyTime(3); // Minor penalty for wrong final
      localStorage.setItem("room2PenaltyEnd", Date.now() + 3000);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        localStorage.removeItem("room2PenaltyEnd");
      }, 3000);
    }
  };

  // ─── RENDERERS ────────────────────────────────────────────────────────────

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
      <div className="room2-container" style={{ justifyContent: 'center' }}>
        <style>{styles}</style>
        <div style={{ color: '#00ffcc', fontSize: '2rem' }}>Loading Interface...</div>
      </div>
    );
  }

  if (roomUnlocked) {
    return (
      <div className="room2-container" style={{ justifyContent: 'center' }}>
        <style>{styles}</style>
        <h1 style={{ fontSize: '4rem', color: '#b026ff', textShadow: '0 0 20px #b026ff' }}>ROOM ESCAPED 🎉</h1>
        <p style={{ fontSize: '1.5rem', color: '#fff', margin: '2rem 0' }}>Bypass protocols executed successfully.</p>
        <button 
          className="door-btn" 
          onClick={() => navigate('/dashboard', { replace: true })}
        >
          Enter Sector 3 &rarr;
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="room2-container" style={{ justifyContent: 'center' }}>
        <style>{styles}</style>
        <div className="game-over-container panel">
          <h1 className="glitch-text" data-text="ACCESS DENIED" style={{ color: '#ff3366' }}>ACCESS DENIED</h1>
          <p style={{ margin: '2rem 0', fontSize: '1.2rem' }}>Timer expired. The system has locked you out permanently.</p>
          <button className="door-btn" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="room2-container">
      <style>{styles}</style>

      {/* Door Selector */}
      {doorMode === null && (
        <div style={{ textAlign: 'center', marginTop: '10vh' }}>
          <h1 style={{ fontSize: '3rem', color: '#fff', marginBottom: '1rem' }}>Sector Firewall Reach</h1>
          <p style={{ color: '#888', fontSize: '1.2rem' }}>Choose your decryption node to begin.</p>
          
          <div className="doors-container">
            <div className="door-select door-d1" onClick={() => handleDoorSelect('d1')}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⌨</div>
              Signal Detected<br/>
              <span style={{ fontSize: '0.9rem', color: '#00ffcc', fontWeight: 'normal', display: 'block', marginTop: '10px', lineHeight: '1.4' }}>
                Fragments of broken systems echo from this path.<br/>Only those who understand machines can survive here.
              </span>
            </div>
            <div className="door-select door-d2" onClick={() => handleDoorSelect('d2')}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🗺</div>
              Pattern Distortion<br/>
              <span style={{ fontSize: '0.9rem', color: '#ffaa00', fontWeight: 'normal', display: 'block', marginTop: '10px', lineHeight: '1.4' }}>
                Hidden structures and shifting logic dominate this path.<br/>Only those who see beyond patterns can proceed.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Interface */}
      {doorMode !== null && (
        <>
          <div className="header-desc">
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

          <div className={`problem-card ${doorMode === 'd1' ? 'd1-card' : 'd2-card'}`}>
            
            {showFinal ? (
              <div style={{ textAlign: 'center' }}>
                <h2 className={`problem-title ${doorMode === 'd1' ? 'd1-text' : 'd2-text'}`} style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>MASTER OVERRIDE</h2>
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
                <div className="problem-progress">Security Node {qIndex + 1} / {questions.length}</div>
                <div className={`problem-title ${doorMode === 'd1' ? 'd1-text' : 'd2-text'}`}>{currentQ.title}</div>
                <div className="problem-scenario">{currentQ.scenario}</div>
                
                {currentQ.codeBlocks && currentQ.codeBlocks.map((block, idx) => (
                  <div key={idx} className="code-block">
                    <div style={{ color: "#888", marginBottom: "6px" }}>
                      Code Block {idx + 1}
                    </div>
                    <pre style={{ margin: 0 }}>{block}</pre>
                  </div>
                ))}
                {currentQ.data && (
                  <div className="data-block">{currentQ.data}</div>
                )}

                <div className="options-grid">
                  {currentQ.options.map((opt, i) => {
                    let cls = "opt-btn " + (doorMode === 'd1' ? "d1-opt" : "d2-opt");
                    if (isProcessing && message.type === "success") {
                      if (i === currentQ.answer) cls += " opt-btn locked"; // Just disabled look
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
                        <span style={{ fontWeight: 'bold', color: doorMode === 'd1' ? '#00ffcc' : '#ffaa00' }}>
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
        </>
      )}
    </div>
  );
};

export default Room2;
