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
    <>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input
            {...register("username", { required: "Username is required" })}
            type="text"
          />
          {errors.username && (
            <p className="error">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label>Password</label>
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label>Commitment</label>
          <select
            {...register("difficulty", { required: "Difficulty is required" })}
            defaultValue="medium"
          >
            <option value="easy">Low</option>
            <option value="medium">Decent</option>
            <option value="hard">High</option>
          </select>
          {errors.difficulty && (
            <p className="error">{errors.difficulty.message}</p>
          )}
        </div>

        <p className="note">Difficulty can be changed later on as well.</p>

        {registerError && <p className="error">{registerError}</p>}

        <button type="submit">Register</button>
      </form>
    </>
  );
}

export default RegisterPage;
