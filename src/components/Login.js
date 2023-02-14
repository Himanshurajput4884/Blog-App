import React from "react";
import { auth, provider } from "../firebase.js";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function Login() {
  let navigate = useNavigate();
    const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      console.log(result);
      localStorage.setItem("isLogged", true);
      localStorage.setItem("uid", result.user.uid);
      // props.setIsLogged(true);
        navigate("/");
    });
  };
  return (
    <Card style={{height:"50vh", padding:"5%", margin:"2%"}}>
      <Card.Body>
        <Card.Title>Login with Google</Card.Title>
        <Card.Text>
          Easy Login with Google using Firebase.
        </Card.Text>
        <Button variant="primary" onClick={()=>signInWithGoogle()}>Login</Button>
      </Card.Body>
    </Card>
  );
}
