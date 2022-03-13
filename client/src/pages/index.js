import React from "react";
import { Link } from "react-router-dom";

import HelloWorld from "../components/HelloWorld";
import Counter from "../components/Counter";
import BlogPosts from "../components/BlogPosts";
import logo from "../logo.svg";
import "../App.css";

function Homepage() {
  return (
    <div className="App">
      <header className="App-header">
        <Counter />

        <HelloWorld />
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <h2>Blog Posts:</h2>
          <Link to="/blog">Blog</Link>
          <Link to="/spades-calculator">Spades Calculator</Link>
        </div>

        <BlogPosts />

        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Homepage;
