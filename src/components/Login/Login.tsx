import {
  Button,
  FormControl,
  Input,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import "./Login.css";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import { useAppDispatch } from "../../hooks/typedStoreHooks";
import { login, messengerActions } from "../../store/store";
import { useNavigate } from "react-router-dom";

function Login() {
  // const [{}, dispatch] = useStateValue();
  const dispatch = useAppDispatch();
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login({ idInstance, apiTokenInstance }));
    // setTimeout(() => navigate("/rooms"), [1000]);
  };

  //   const signIn = () => {
  //     auth
  //       .signInWithPopup(provider)
  //       .then((result) => {
  //         dispatch({
  //           type: actionTypes.SET_USER,
  //           //   user: result.user,
  //           idInstance: action.idInstance,
  //           apiTokenInstance: action.apiTokenInstance,
  //         });
  //       })
  //       .catch((error) => alert(error.message));
  //   };

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
        {/* <Button variant="contained" type="submit" onClick={signIn}>
          Sign in with Google
        </Button> */}
        {/* <FormControl variant="standard">
          <InputLabel htmlFor="component-simple">Name</InputLabel>
          <Input id="component-simple" defaultValue="Composed TextField" />
        </FormControl> */}
        {/* <div>
          <TextField required id="outlined-required" label="Id" value="Hi" />
        </div>
        <div>
          <TextField
            required
            id="outlined-required"
            label="Required"
            value="Hi"
          />
        </div> */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="ID Instance"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            required
            fullWidth
            margin="normal"
            // defaultValue="1101829548"
          />
          <TextField
            label="API Token Instance"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            required
            fullWidth
            margin="normal"
            // defaultValue="0362569cefba4d8f9c7c869cb0d390818b8c525da3a24c75b2"
          />
          <Button type="submit" variant="contained" color="primary">
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
