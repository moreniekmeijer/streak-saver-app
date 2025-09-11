import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function StreakPage() {
  const [streakData, setStreakData] = useState(null);
  const { token, user } = useContext(AuthContext);
  const today = new Date().toISOString().split("T")[0];
  const alreadyDoneToday = streakData?.last_action_date === today;
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

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
        if (err.response && err.response.status === 401) {
          logout();
        } else {
          console.error("Error fetching streak:", err);
          setError("Could not load streak data");
        }
      }
    };
    fetchStreak();
  }, [token]);

  const addStreak = async () => {
    try {
      const prevFreezes = streakData?.freezes ?? 0;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/streak/add`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newData = response.data;
      setStreakData(newData);

      if (newData.freezes < prevFreezes) {
        const used = prevFreezes - newData.freezes;
        showMessage(
          `You missed some days, ${used} freeze${used > 1 ? "s" : ""} ${
            used > 1 ? "were" : "was"
          } used!`,
          "warning"
        );
      } else {
        showMessage("Good job!", "success");
      }
    } catch (err) {
      console.error("Error adding streak:", err);
      showMessage(err.response?.data?.error || "Could not add streak.");
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
      showMessage("Streak resetted", "success");
    } catch (err) {
      console.error("Error resetting streak:", err);
      showMessage("Could not reset streak");
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
      showMessage("Difficulty changed", "success");
    } catch (err) {
      console.error("Error updating difficulty:", err);
      showMessage("Could not update difficulty");
    }
  };

  if (!streakData) return <p>Loading...</p>;

  return (
    <>
      <section className="taskDone">
        {user && <h3>Hello {user?.username}!</h3>}
        <p>
          Doing a task every day? Pin this page and click the green button daily
          to keep track of your progress! (If you forget to do the task, it will
          use up a freeze if available...)
        </p>
        <button type="button" disabled={alreadyDoneToday} onClick={addStreak}>
          {alreadyDoneToday ? "Already done today" : "Done!"}
        </button>
        {message && <p className={message.type}>{message.text}</p>}

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
