import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import "./App.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Router>
      <div>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/frontend" element={<Frontend />} />
          <Route path="/backend" element={<Backend />} />
          <Route path="/fullstack" element={<FullStack />} />
          <Route path="/dsa" element={<DSA />} />
          <Route path="/java" element={<Java />} />
          <Route path="/python" element={<Python />} />
          <Route path="/cpp" element={<Cpp />} />
          <Route path="/c" element={<C />} />
          <Route path="/react" element={<ReactPage />} />
          <Route path="/nodejs" element={<NodeJs />} />
          <Route path="/uiux" element={<UIUX />} />
          <Route path="/edtech" element={<EdTech />} />
          <Route path="/designing" element={<Designing />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

function Header({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="header">
        {/* Sidebar Toggle Button */}
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        {/* Sidebar */}
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ✖
          </button>
          <ul>
            {["Frontend", "Backend", "FullStack", "DSA", "Java", "Python", "C++", "C", "React", "Node Js", "UI/UX", "Ed Tech", "Designing"].map(
              (item, index) => (
                <li key={index}>
                  <Link
                    to={`/${item.toLowerCase().replace(/ /g, "").replace("c++", "cpp").replace("ui/ux", "uiux")}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Horizontal Navbar */}
        <img src="/1.jpg" alt="Logo" className="imglogo" />
        <nav className="top-nav">
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/support">Support</Link>
          <Link to="/teams">Teams</Link>
        </nav>
        <div className="searchbar">
          <input type="search" placeholder="Search Here" />
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full transition-all duration-300 bulb"
        >
          {darkMode ? <Sun size={24} color="yellow" /> : <Moon size={24} color="black" />}
        </button>
      </header>
    </>
  );
}

function Home() { return <div><h2>Home</h2></div>; }
function About() { return <div><h2>About Us</h2></div>; }
function Support() { return <div><h2>Support</h2></div>; }
function Teams() { return <div><h2>Teams</h2></div>; }
function Frontend() { return <div><h2>Frontend</h2></div>; }
function Backend() { return <div><h2>Backend</h2></div>; }
function FullStack() { return <div><h2>Full Stack</h2></div>; }
function DSA() { return <div><h2>DSA</h2></div>; }
function Java() { return <div><h2>Java</h2></div>; }
function Python() { return <div><h2>Python</h2></div>; }
function Cpp() { return <div><h2>C++</h2></div>; }
function C() { return <div><h2>C</h2></div>; }
function ReactPage() { return <div><h2>React</h2></div>; }
function NodeJs() { return <div><h2>Node Js</h2></div>; }
function UIUX() { return <div><h2>UI/UX</h2></div>; }
function EdTech() { return <div><h2>Ed Tech</h2></div>; }
function Designing() { return <div><h2>Designing</h2></div>; }

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2025 TeamMate | All Rights Reserved</p>
    </footer>
  );
}
