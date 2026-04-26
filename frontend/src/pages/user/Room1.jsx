import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import axios from 'axios';

const QUESTIONS = [
{
text: "What does IEEE stand for?",
options: [
"A) International Electrical Engineering Experts",
"B) Institute of Electrical and Electronics Engineers",
"C) Indian Engineering and Electronics Entity",
"D) International Engineers and Electrical Experts"
],
answer: 1,
code: "u"
},
{
text: "What does SIGHT stand for in IEEE SIGHT?",
options: [
"A) Social Initiative for Global Human Technology",
"B) Scientific Innovation Group for Human Transformation",
"C) Special Interest Group on Humanitarian Technology",
"D) Systematic Initiative for Global Help Team"
],
answer: 2,
code: "7"
},
{
text: "A team installs an advanced AI-based healthcare diagnostic system in a rural area, but locals cannot operate or maintain it. According to SIGHT principles, what was the key mistake?",
options: [
"A) Lack of advanced technology",
"B) Ignoring sustainability and local usability",
"C) Not using AI in the system",
"D) Not involving international partners"
],
answer: 1,
code: "X"
},
{
text: "A SIGHT project proposes using drones for delivering medicines in remote villages, but the cost is extremely high and unsustainable. What should be the best alternative approach?",
options: [
"A) Replace drones with cost-effective and maintainable solutions",
"B) Proceed anyway to showcase innovation",
"C) Focus only on urban deployment",
"D) Cancel the project completely"
],
answer: 0,
code: "p"
},
{
text: "A team collects data from a community but designs a solution without consulting them further. The solution fails adoption. What principle was violated?",
options: [
"A) Technical documentation",
"B) Funding allocation",
"C) Stakeholder engagement and participatory design",
"D) Marketing strategy"
],
answer: 2,
code: "3"
},
{
text: "A project successfully solves a water crisis using simple filtration, but lacks documentation and scalability planning. What is the major limitation here?",
options: [
"A) Poor scalability and knowledge transfer",
"B) Lack of innovation",
"C) Excessive funding",
"D) No community involvement"
],
answer: 0,
code: "Z"
},
{
text: "A SIGHT group collaborates with local artisans to develop solar-powered tools that enhance productivity. What makes this project strong?",
options: [
"A) High complexity design",
"B) Dependence on external experts",
"C) Focus on export business",
"D) Integration of local knowledge with technology"
],
answer: 3,
code: "k"
},
{
text: "During evaluation, a project is rejected because it benefits only a small group without long-term impact. Which SIGHT criterion is most relevant here?",
options: [
"A) Use of emerging technology",
"B) Market competition",
"C) Aesthetic design",
"D) Scalability and broader social impact"
],
answer: 3,
code: "9"
},
{
text: "A team builds a mobile app for farmers, but most farmers do not have smartphones or internet access. What should have been done first?",
options: [
"A) Launch the app globally",
"B) Conduct a needs and resource assessment",
"C) Focus on urban users",
"D) Develop a more advanced app"
],
answer: 1,
code: "Q"
},
{
text: "A SIGHT project introduces a new energy solution but depends entirely on external funding and imported parts. What risk does this create?",
options: [
"A) Faster implementation",
"B) Dependency and lack of sustainability",
"C) Increased efficiency",
"D) Better innovation"
],
answer: 1,
code: "m"
}
];

const styles = `
  .room1-container {
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

  .timer-box {
    font-size: 3rem;
    font-weight: 800;
    color: #0ff;
    text-shadow: 0 0 10px #0ff, 0 0 20px #00b3b3;
    margin-bottom: 2rem;
    padding: 1rem 2.5rem;
    border: 2px solid #0ff;
    border-radius: 12px;
    background: rgba(0, 255, 255, 0.05);
    box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.15), 0 0 20px rgba(0, 255, 255, 0.2);
    letter-spacing: 2px;
    transition: all 0.3s ease;
  }

  .timer-warning {
    color: #ff3366;
    border-color: #ff3366;
    text-shadow: 0 0 10px #ff3366, 0 0 20px #cc0033;
    box-shadow: inset 0 0 20px rgba(255, 51, 102, 0.15), 0 0 20px rgba(255, 51, 102, 0.2);
  }

  .question-card {
    background: rgba(20, 20, 30, 0.85);
    border: 1px solid #333;
    border-radius: 16px;
    padding: 2.5rem;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    transition: all 0.4s ease;
  }

  .question-progress {
    color: #888;
    font-size: 1rem;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .question-text {
    font-size: 1.8rem;
    margin-bottom: 2.5rem;
    line-height: 1.4;
    font-weight: 600;
  }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }

  .option-btn {
    background: rgba(255, 255, 255, 0.03);
    color: #fff;
    border: 2px solid #444;
    padding: 1.2rem 1.5rem;
    font-size: 1.1rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    position: relative;
    overflow: hidden;
  }

  .option-btn:hover:not(:disabled) {
    border-color: #b026ff;
    box-shadow: 0 0 15px rgba(176, 38, 255, 0.4);
    background: rgba(176, 38, 255, 0.1);
    transform: translateX(5px);
  }

  .option-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .message-box {
    margin-top: 2rem;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    min-height: 2rem;
    animation: fadeIn 0.3s ease;
  }

  .success-msg {
    color: #00ffcc;
    text-shadow: 0 0 15px #00ffcc;
  }

  .error-msg {
    color: #ff3366;
    text-shadow: 0 0 15px #ff3366;
  }

  .penalty-text {
    font-size: 1.2rem;
    color: #ffaa00;
    margin-top: 1rem;
    animation: pulse 1s infinite;
  }

  .collected-codes-section {
    margin-top: 3rem;
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid #333;
  }

  .collected-codes-title {
    color: #888;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1rem;
  }

  .collected-codes {
    display: flex;
    gap: 0.8rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .code-badge {
    background: #111;
    border: 1px solid #0ff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-family: monospace;
    font-size: 1.4rem;
    color: #0ff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
    animation: bounceIn 0.5s ease;
  }

  .final-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .final-input {
    background: rgba(0,0,0,0.6);
    border: 2px solid #b026ff;
    color: #b026ff;
    font-family: monospace;
    font-size: 2.5rem;
    padding: 1.2rem;
    text-align: center;
    border-radius: 12px;
    width: 100%;
    max-width: 500px;
    outline: none;
    transition: all 0.3s ease;
    letter-spacing: 4px;
  }

  .final-input:focus {
    box-shadow: 0 0 25px rgba(176, 38, 255, 0.5);
    border-color: #d178ff;
  }

  .submit-btn {
    background: #b026ff;
    color: #fff;
    border: none;
    padding: 1.2rem 4rem;
    font-size: 1.3rem;
    font-weight: 800;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
    letter-spacing: 3px;
  }

  .submit-btn:hover {
    background: #d178ff;
    box-shadow: 0 0 20px #b026ff, 0 0 40px #b026ff;
    transform: translateY(-3px);
  }

  .game-over-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    width: 100%;
  }

  .game-over-title {
    font-size: 5rem;
    color: #ff3366;
    text-shadow: 0 0 30px #ff3366;
    margin-bottom: 2rem;
    font-weight: 900;
    letter-spacing: 5px;
    text-transform: uppercase;
  }

  /* --- NEW ESCAPE SCREEN STYLES --- */
  .success-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    text-align: center;
    animation: zoomFadeIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  .success-title {
    font-size: 3.5rem;
    color: #00ffcc;
    text-shadow: 0 0 20px #00ffcc, 0 0 40px #00ccaa;
    margin-bottom: 2rem;
    font-weight: 900;
    letter-spacing: 2px;
  }

  .success-message {
    font-size: 1.6rem;
    color: #fff;
    max-width: 800px;
    line-height: 1.8;
    margin-bottom: 3.5rem;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    background: rgba(0, 255, 204, 0.05);
    padding: 2.5rem;
    border-radius: 16px;
    border: 1px solid rgba(0, 255, 204, 0.2);
    box-shadow: inset 0 0 30px rgba(0, 255, 204, 0.1);
    backdrop-filter: blur(5px);
  }

  .success-message p {
    margin-bottom: 1.2rem;
  }

  .highlight-text {
    color: #b026ff;
    font-weight: 800;
    font-size: 2rem;
    margin-top: 2rem;
    text-shadow: 0 0 15px rgba(176, 38, 255, 0.6);
  }

  .enter-room2-btn {
    background: #00ffcc;
    color: #000;
    border: none;
    padding: 1.5rem 4rem;
    font-size: 1.5rem;
    font-weight: 900;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
    letter-spacing: 3px;
    box-shadow: 0 0 20px #00ffcc;
    animation: pulse-glow 2s infinite;
  }

  .enter-room2-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 40px #00ffcc, 0 0 60px #00ffcc;
    background: #fff;
  }

  @keyframes zoomFadeIn {
    0% { opacity: 0; transform: scale(0.8) translateY(20px); filter: brightness(0.5); }
    100% { opacity: 1; transform: scale(1) translateY(0); filter: brightness(1); }
  }

  @keyframes pulse-glow {
    0% { box-shadow: 0 0 15px #00ffcc; }
    50% { box-shadow: 0 0 30px #00ffcc, 0 0 50px #00ffcc; }
    100% { box-shadow: 0 0 15px #00ffcc; }
  }
  /* ------------------------------- */

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes bounceIn {
    0% { transform: scale(0.5); opacity: 0; }
    70% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const Room1 = () => {
  const navigate = useNavigate();

  // State Declarations
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600s)
  const [gameOver, setGameOver] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [penaltyTime, setPenaltyTime] = useState(() => {
    const savedEnd = localStorage.getItem("room1PenaltyEnd");
    if (savedEnd) {
      const remaining = Math.ceil((Number(savedEnd) - Date.now()) / 1000);
      if (remaining > 0) return remaining;
      localStorage.removeItem("room1PenaltyEnd");
    }
    return 0;
  });
  const [collectedCodes, setCollectedCodes] = useState([]);
  const [showFinalInput, setShowFinalInput] = useState(false);
  const [finalEscapeCode, setFinalEscapeCode] = useState("");
  const [roomUnlocked, setRoomUnlocked] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);

  // Re-lock the UI if penalty persists across reload
  useEffect(() => {
    if (penaltyTime > 0) {
      setIsDisabled(true);
      setMessage({ text: "System Locked...", type: "error" });
    }
  }, []);

  // Initialize Global Timer and record start in DB
  useEffect(() => {
    const initRoom = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.post("https://escape-room-vgd1.onrender.com/api/game/start-room1", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const { room1StartTime, room1Progress, room1Codes, room1Completed } = res.data;
        
        if (room1Completed) {
          navigate('/dashboard', { replace: true });
          return;
        }

        if (room1Progress) setCurrentQuestionIndex(room1Progress);
        if (room1Codes) setCollectedCodes(room1Codes);
        if (room1Progress >= QUESTIONS.length) setShowFinalInput(true);

        const startMs = new Date(room1StartTime).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startMs) / 1000);
        const remaining = Math.max(0, 600 - elapsed);
        
        setTimeLeft(remaining);
        setIsLoading(false);
      } catch (err) {
        console.error("Room 1 Start Error:", err);
        setIsLoading(false);
        if (err.response && err.response.status === 403) {
          alert("Admin has not unlocked this room yet!");
          navigate('/dashboard', { replace: true });
        }
      }
    };
    initRoom();
  }, []);

  useEffect(() => {
    if (isLoading || gameOver || roomUnlocked) return;

    if (timeLeft <= 0) {
      setGameOver(true);
      const token = sessionStorage.getItem('token');
      axios.post("https://escape-room-vgd1.onrender.com/api/game/fail-room", { roomNumber: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error("Fail Sync Error:", err));
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, gameOver, roomUnlocked, isLoading]);

  // Penalty Timer Logic
  useEffect(() => {
    let interval;
    if (penaltyTime > 0) {
      interval = setInterval(() => {
        setPenaltyTime(prev => prev - 1);
      }, 1000);
    } else if (penaltyTime === 0 && message.type === "error") {
      // End penalty
      setIsDisabled(false);
      setMessage({ text: "", type: "" });
      localStorage.removeItem("room1PenaltyEnd");
    }
    return () => clearInterval(interval);
  }, [penaltyTime, message.type]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswer = (selectedIndex) => {
    if (isDisabled) return;

    const currentQ = QUESTIONS[currentQuestionIndex];

    if (selectedIndex === currentQ.answer) {
      // Correct Answer Logic
      setMessage({ text: "Correct!", type: "success" });
      setCollectedCodes(prev => [...prev, currentQ.code]);
      setIsDisabled(true); // Disable temporarily during transition

      setTimeout(async () => {
        setMessage({ text: "", type: "" });
        setIsDisabled(false);
        const newProgress = currentQuestionIndex + 1;
        const newCodes = [...collectedCodes, currentQ.code];
        
        try {
          const token = sessionStorage.getItem('token');
          await axios.post("https://escape-room-vgd1.onrender.com/api/game/update-room1-progress", {
            progressIndex: newProgress,
            collectedCodes: newCodes
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.error("Progress save failed:", err);
        }

        if (newProgress < QUESTIONS.length) {
          setCurrentQuestionIndex(newProgress);
        } else {
          setCurrentQuestionIndex(newProgress); // advance to end
          setShowFinalInput(true);
        }
      }, 1500);
    } else {
      // Wrong Answer Logic
      setMessage({ text: "Wrong Answer", type: "error" });
      setIsDisabled(true);
      setPenaltyTime(10); // 10 seconds penalty
      localStorage.setItem("room1PenaltyEnd", Date.now() + 10000);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const correctFinalCode = QUESTIONS.map(q => q.code).join('');
    
    if (finalEscapeCode === correctFinalCode) {
      try {
        const token = sessionStorage.getItem('token');
        console.log("Room1 completion API called");
        const response = await axios.post("https://escape-room-vgd1.onrender.com/api/game/complete-room1", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Room1 API Success:', response.data);
      } catch (err) {
        console.error('Failed to log completion:', err.response?.data || err.message);
      }
      
      setRoomUnlocked(true); 
      // -------------------------------
    } else {
      setMessage({ text: "Invalid code. Communication failed.", type: "error" });
      setFinalEscapeCode("");
      
      // Short delay before they can type again after fail
      setIsDisabled(true);
      setTimeout(() => {
        setMessage({ text: "", type: "" });
        setIsDisabled(false);
      }, 2000);
    }
  };

  // --- ESCAPE SCREEN RENDER LOGIC ADDED HERE ---
  // Handle Back Button Lockout after success
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

  if (roomUnlocked) {
    return (
      <div className="room1-container" style={{ justifyContent: 'center' }}>
        <style>{styles}</style>
        <div className="success-screen">
          <h1 className="success-title">Room 1 Escaped Successfully 🎉</h1>
          <div className="success-message">
            <p>You didn’t just answer questions…</p>
            <p>You proved your understanding of technology for humanity.</p>
            <p>Like IEEE, you used knowledge to unlock the future.</p>
            <p className="highlight-text">This is just the beginning.</p>
          </div>
          <button 
            className="enter-room2-btn" 
            onClick={() => navigate('/dashboard', { replace: true })}
          >
            Enter Sector 2 &rarr;
          </button>
        </div>
      </div>
    );
  }
  // ---------------------------------------------

  if (isLoading) {
    return (
      <div className="room1-container" style={{ justifyContent: 'center' }}>
        <style>{styles}</style>
        <div style={{ color: '#00ffcc', fontSize: '2rem' }}>Loading Interface...</div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="room1-container" style={{ justifyContent: 'center' }}>
        <style>{styles}</style>
        <div className="game-over-container">
          <h1 className="game-over-title">GAME OVER</h1>
          <p style={{ fontSize: '1.5rem', color: '#aaa', marginBottom: '3rem' }}>
            Time limit exceeded. The room remains locked.
          </p>
          <button className="submit-btn" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="room1-container">
      <style>{styles}</style>
      
      <div className={`timer-box ${timeLeft <= 60 ? 'timer-warning' : ''}`}>
        {formatTime(timeLeft)}
      </div>

      <div className="question-card">
        {showFinalInput ? (
          <form className="final-form" onSubmit={handleFinalSubmit}>
            <div className="question-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              ACCESS TERMINAL
            </div>
            <p style={{ color: '#aaa', fontSize: '1.2rem', textAlign: 'center', marginBottom: '2rem' }}>
              Enter the final escape code to unlock the door.
            </p>
            
            <input
              type="text"
              className="final-input"
              value={finalEscapeCode}
              onChange={(e) => setFinalEscapeCode(e.target.value)}
              placeholder="ENTER CODE"
              autoFocus
              disabled={isDisabled || roomUnlocked}
              maxLength={10}
            />
            
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isDisabled || roomUnlocked || finalEscapeCode.length === 0}
            >
              Unlock Room
            </button>
          </form>
        ) : (
          <>
            <div className="question-progress">
              Terminal Node {currentQuestionIndex + 1} / {QUESTIONS.length}
            </div>
            
            <div className="question-text">
              {QUESTIONS[currentQuestionIndex].text}
            </div>
            
            <div className="options-grid">
              {QUESTIONS[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  className="option-btn"
                  onClick={() => handleAnswer(index)}
                  disabled={isDisabled}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Global Feedback Message Box */}
        <div className="message-box">
          {message.text && (
            <div className={message.type === 'success' ? 'success-msg' : 'error-msg'}>
              {message.text}
            </div>
          )}
          {penaltyTime > 0 && (
            <div className="penalty-text">
              Terminal Locked. Retrying in {penaltyTime}s...
            </div>
          )}
        </div>

        {/* Codes Inventory */}
        {collectedCodes.length > 0 && !roomUnlocked && (
          <div className="collected-codes-section">
            <div className="collected-codes-title">Decrypted Fragments</div>
            <div className="collected-codes">
              {collectedCodes.map((code, idx) => (
                <span key={idx} className="code-badge">{code}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room1;
