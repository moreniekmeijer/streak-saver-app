import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function StreakPage() {
  const [streakData, setStreakData] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/streak`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStreakData(response.data);
      } catch (err) {
        console.error("Error fetching streak:", err);
      }
    };
    fetchStreak();
  }, [token]);

  const addStreak = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/streak/add`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStreakData(response.data);
    } catch (err) {
      console.error("Error adding streak:", err);
    }
  };

  const resetStreak = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/streak/reset`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStreakData(response.data);
    } catch (err) {
      console.error("Error resetting streak:", err);
    }
  };

  const updateDifficulty = async (e) => {
    const newDifficulty = e.target.value;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/streak/update_difficulty`,
        { difficulty: newDifficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStreakData((prev) => ({
        ...prev,
        difficulty: response.data.difficulty,
      }));
    } catch (err) {
      console.error("Error updating difficulty:", err);
    }
  };

  if (!streakData) return <p>Loading...</p>;

  return (
    <>
      <section className="taskDone">
        <p>
          Doing a task every day? Pin this page and click the green button daily
          to keep track of your progress! (If you forget to do the task, it will
          use up a freeze if available...)
        </p>
        <button type="button" onClick={addStreak}>
          Done!
        </button>
        <div className="streakData">
          <p>Streak amount: {streakData.current_streak}</p>
          <p>Freeze amount: {streakData.freezes}</p>
          <p>Difficulty: {streakData.difficulty}</p>
        </div>
      </section>
      <section className="options">
        <p>
          Be careful, use this button only if you want to restart another task.
          It will reset your streak and freezes!
        </p>
        <button type="button" onClick={resetStreak}>
          Reset
        </button>
        <label htmlFor="difficulty">
          Choose difficulty (how commited are you?):
        </label>
        <select
          id="difficulty"
          value={streakData.difficulty}
          onChange={updateDifficulty}
        >
          <option value="easy">Not so...</option>
          <option value="medium">Decently</option>
          <option value="hard">Very!</option>
        </select>
      </section>
    </>
  );
}

export default StreakPage;
