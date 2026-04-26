import { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [gameState, setGameState] = useState({
    progress: 1,
    startTime: null,
    endTime: null,
    totalTime: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchGameStatus = async () => {
    if (user?.role !== 'team') {
      setLoading(false);
      return;
    }
    try {
      const { data } = await API.get('/game/status');
      setGameState({
        progress: data.progress,
        startTime: data.startTime,
        endTime: data.endTime,
        totalTime: data.totalTime,
        room1Completed: data.room1Completed,
        room2Completed: data.room2Completed,
        room3Completed: data.room3Completed,
        room1Failed: data.room1Failed,
        room2Failed: data.room2Failed,
        room3Failed: data.room3Failed,
        room1Started: data.room1Started,
        room2Started: data.room2Started,
        room3Started: data.room3Started,
      });
    } catch (err) {
      console.error("Error fetching game status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchGameStatus();
    else setLoading(false);
  }, [user]);

  const startGame = async () => {
    try {
      const { data } = await API.post('/game/start');
      setGameState(prev => ({ ...prev, startTime: data.startTime }));
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const submitPuzzle = async (roomNumber, answer) => {
    try {
      const { data } = await API.post('/game/submit', { roomNumber, answer });
      if (data.success) {
        setGameState(prev => ({
          ...prev,
          progress: data.progress,
          endTime: data.endTime,
          totalTime: data.totalTime
        }));
      }
      return data;
    } catch (err) {
      if (err.response) return err.response.data;
      throw err;
    }
  };

  return (
    <GameContext.Provider value={{ gameState, loading, fetchGameStatus, startGame, submitPuzzle }}>
      {children}
    </GameContext.Provider>
  );
};
