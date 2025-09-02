import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, data);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setRegisterError("Registration failed. Try again later.");
      } else {
        setRegisterError("Server not available.");
      }
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input
            {...register("username", { required: "Username is required" })}
            type="text"
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <label>Difficulty</label>
          <select
            {...register("difficulty", { required: "Difficulty is required" })}
            defaultValue="medium"
          >
            <option value="easy">Not so...</option>
            <option value="medium">Decently</option>
            <option value="hard">Very!</option>
          </select>
          {errors.difficulty && <p>{errors.difficulty.message}</p>}
        </div>

        <p>Difficulty can be changed later on as well.</p>

        {registerError && <p style={{ color: "red" }}>{registerError}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
