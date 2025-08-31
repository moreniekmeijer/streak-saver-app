import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, data);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setRegisterError("Registratie mislukt. Probeer opnieuw.");
      } else {
        setRegisterError("Server niet bereikbaar.");
      }
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Registreren</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input
            {...register("username", { required: "Username is verplicht" })}
            type="text"
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            {...register("password", { required: "Wachtwoord is verplicht" })}
            type="password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {registerError && <p style={{ color: "red" }}>{registerError}</p>}

        <button type="submit">Registreren</button>
      </form>
    </div>
  );
}

export default RegisterPage;
