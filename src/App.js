import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import "./App.css";
import "./About.css";
import "./script.js"
import teammatesData from "./teammates.json";


export default function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundImage = "url('2.jpg')";
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundImage = "url('4.jpg')";
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

function Home() {
  const [formData, setFormData] = useState({
    name: "",
    skills: "",
    availability: "",
    preferences: "",
  });
useEffect(() => {
    setTeamList(teammatesData); // Set team list from imported data
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const newTeammate = { ...formData };
  
    setTeamList((prevList) => [...prevList, newTeammate]); // Update the state
    alert("Teammate added successfully!");
  
    setModalVisible(true);
    setFormData({ name: "", skills: "", availability: "", preferences: "" });
  };
  

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/get_teammates");
        const data = await response.json();
        setTeamList(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredTeams = teamList.filter((teammate) =>
    teammate.name.toLowerCase().includes(searchQuery)
  );

  return (
    <main>
      <section className="profile-section">
        <h2>Create Your Profile</h2>
        <form id="profile-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
          />

          <label htmlFor="skills">Skills (comma-separated):</label>
          <input
            type="text"
            id="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="e.g., Frontend, Backend, UI/UX"
            required
          />

          <label htmlFor="availability">Availability (hours/week):</label>
          <input
            type="number"
            id="availability"
            value={formData.availability}
            onChange={handleInputChange}
            min="1"
            max="40"
            style={{color:'black'}}
            required
          />

          <label htmlFor="preferences">Project Preferences:</label>
          <input
            type="text"
            id="preferences"
            value={formData.preferences}
            onChange={handleInputChange}
            placeholder="e.g., Healthcare, EdTech"
            required
          />

          <button type="submit">Submit</button>
        </form>

        {modalVisible && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setModalVisible(false)}>
                &times;
              </span>
              <p>Submitted successfully!</p>
            </div>
          </div>
        )}
      </section>

      <section className="team-section" id="teams">
        <h2>Suggested Teammates</h2>
        <input
          type="text"
          id="searchInput"
          placeholder="Search teams..."
          onChange={handleSearch}
        />
        <ul id="team-list">
          {filteredTeams.map((teammate, index) => (
            <li key={index}>{teammate.name}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">About Our Platform</h1>
        <p className="about-text">
          Welcome to our collaborative platform, where developers and designers 
          come together to build amazing projects! Whether you're a frontend 
          enthusiast, backend guru, or a UI/UX expert, this is the place to connect, 
          collaborate, and create.
        </p>

        {/* Mission Section */}
        <div className="about-grid">
          <div className="about-box">
            <h3 className="about-box-title">Find Your Team</h3>
            <p className="about-box-text">
              Connect with like-minded developers, join projects, and work on 
              exciting ideas together.
            </p>
          </div>

          <div className="about-box">
            <h3 className="about-box-title">Enhance Your Skills</h3>
            <p className="about-box-text">
              Learn and grow by collaborating on real-world projects.
            </p>
          </div>

          <div className="about-box">
            <h3 className="about-box-title">Build a Portfolio</h3>
            <p className="about-box-text">
              Gain hands-on experience by working on real projects and showcasing 
              them to potential employers.
            </p>
          </div>

          <div className="about-box">
            <h3 className="about-box-title">Stay Updated</h3>
            <p className="about-box-text">
              Keep up with the latest industry trends and best practices.
            </p>
          </div>
        </div>

        <button className="about-button">Join Us Today!</button>
      </div>
    </div>
  );
}

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
