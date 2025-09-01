import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function StreakPage() {
  const [streak, setStreak] = useState(0);
  const [freezes, setFreezes] = useState(0);
  const { token, logout } = useContext(AuthContext);

  const addStreak = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/streak/add`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setStreak(response.data.current_streak);
      setFreezes(response.data.freezes);
    } catch (err) {
      console.error("Error adding streak:", err);
    }
  };

  const resetStreak = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/streak/reset`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setStreak(response.data.current_streak);
      setFreezes(response.data.freezes);
    } catch (err) {
      console.error("Error resetting streak:", err);
    }
  };

  return (
    <main>
      <section class="task-done">
        <p>
          Doing a task every day? Pin this page and click the green button daily
          to keep track of your progress! (If you forget to do the task, it will
          use up a freeze if available...)
        </p>
        <button type="button" onClick={addStreak}>
          Done!
        </button>
        <div id="task-done-text"></div>
        <div id="new-freezes"></div>
        <div class="amounts">
          <p id="streak-amount">Streak amount: {streak}</p>
          <p id="freeze-amount">Freeze amount: {freezes}</p>
        </div>
      </section>
      <section class="options">
        <p>
          Be careful, use this button only if you want to restart another task.
          It will reset your streak and freezes!
        </p>
        <button type="button" onClick={resetStreak}>
          Reset
        </button>
        <div id="reset-text"></div>
        <label for="difficulty">
          Choose difficulty (how commited are you?):
        </label>
        <select id="difficulty" onChange="updateDifficulty()">
          <option value="easy">Not so...</option>
          <option value="medium">Decently</option>
          <option value="hard">Very!</option>
        </select>
      </section>
    </main>
  );
}

export default StreakPage;
