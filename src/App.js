import React from "react";
import "./Blog.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import BlogView from "./BlogView";
import BlogUpdater from "./BlogUpdater";
import Editor from "./Editor";

const App = () => (
  <Router>
    <div>
      <Nav />
      <Route exact path="/" component={BlogView} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/editor" component={Editor} />
      <Route path="/blogUpdater" component={BlogUpdater} />
    </div>
  </Router>
);

const About = () => (
  <div>
    <h2>About section</h2>
  </div>
);

const Contact = () => (
  <div>
    <h2>Contact me section</h2>
  </div>
);

const Nav = () => (
  <nav>
    <ul>
      <li><Link to="/">Blogs</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/contact">Contact Me</Link></li>
      <li><Link to="/editor">Editor (Restricted Access)</Link></li>
      <li><Link to="/blogUpdater">Blog Updater (Restricted Access)</Link></li>
    </ul>
  </nav>
);

export default App;
