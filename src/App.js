import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import Login from "./components/Login";
import UpdatePost from "./components/UpdatePost";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState } from "react";
import { signOut } from "firebase/auth";
import {auth } from "./firebase.js"
import Delete from './components/Delete.js'
import Detail from './components/Detail.js'
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";

function App() {
  let isLogged = (localStorage.getItem("isLogged")===null ? false : true);
  const signUserOut = () => {
    signOut(auth).then(() =>{
      localStorage.clear();
      window.location.pathname = "/login";
    })
  }

  let uid = localStorage.getItem("uid");

  return (
    <Router>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Blog</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {isLogged ? <Nav.Link href="/create">Create</Nav.Link> : <Nav.Link href="/login">Create</Nav.Link>}
            {!isLogged ? <Nav.Link href="/login">Login</Nav.Link> : <Button onClick={() =>{
              signUserOut()
            }}>Log Out</Button>}
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/update/:postId" element={<UpdatePost />} />
        <Route path="/delete" element={<Delete />} />
        <Route path="/detail/:postId" element={<Detail />} />
      </Routes>
    </Router>
  );
}

export default App;
