import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { authAsyncActions } from "../../store/authSlice";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useAppDispatch();
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(authAsyncActions.login({ idInstance, apiTokenInstance }));
      nav("/rooms");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt=""
        />
        <div className="login_text">
          <h1>Sign in to Whatsapp</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <TextField
            label="ID Instance"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="API Token Instance"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Войти
          </Button>
        </form>
        <Link
          target="_blank"
          className="link-to-api"
          to="https://green-api.com/"
        >
          Get token in Green API
        </Link>
      </div>
    </div>
  );
}

export default Login;
