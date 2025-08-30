import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
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
          setLoginError("Ongeldige gebruikersnaam of wachtwoord.");
        } else {
          setLoginError("Er is iets misgegaan. Probeer het later opnieuw.");
        }
      } else {
        setLoginError("Server niet bereikbaar.");
      }
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Inloggen</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input
            {...register("email", { required: "Email is verplicht" })}
            type="email"
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Wachtwoord</label>
          <input
            {...register("password", { required: "Wachtwoord is verplicht" })}
            type="password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {loginError && <p style={{ color: "red" }}>{loginError}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
