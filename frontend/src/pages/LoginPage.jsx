import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        data
      );
      login(response.data.token);
      navigate("/");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLoginError("Invalid username or password.");
        } else {
          setLoginError("Something went wrong. Try again later.");
        }
      } else {
        setLoginError("Server not available.");
      }
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Log in</h2>
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
            {...register("password", { required: "password is required" })}
            type="password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {loginError && <p style={{ color: "red" }}>{loginError}</p>}

        <button type="submit">Login</button>

        <p>
          New? Register <NavLink to="/register">here</NavLink>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
