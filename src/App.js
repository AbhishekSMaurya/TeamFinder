import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import "./App.css";
import "./About.css";
import { submitbutton } from "./script";
import "./Support.css";
// import teamData from "./teams.json";
import teammatesData from "./teammates.json";
import "./Front.css";
import "./Teams.css"




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
        <div className="searchbar" style={{ width: '50vh' }}>
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
    password: "",
    confirmPassword: ""
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");  // ✅ Error message if passwords mismatch
      return;
    }

    const newTeammate = { ...formData };

    setTeamList((prevList) => [...prevList, newTeammate]);
    alert("Teammate added successfully!");

    setModalVisible(true);
    setFormData({
      name: "",
      skills: "",
      availability: "",
      preferences: "",
      password: "",
      confirmPassword: "",
    });
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
            style={{ color: 'black' }}
            placeholder="Availablity(in hours)"
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
            required
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword" // ✅ Fix: Ensure it matches the state key
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            required
          />

          <button type="submit" id="submitBtn" onClick={submitbutton}>Submit</button>
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
        <ul id="team-list" className="team-list">
          {filteredTeams.map((teammate, index) => (
            <li key={index} className="text-tr">{teammate.name}</li>
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

function Support() {
  return (
    <div className="support-container">
      <div className="support-content">
        <h1 className="support-title">Need Help? We're Here!</h1>
        <p className="support-text">
          Our team is always ready to assist you. Reach out to us for support,
          feedback, or general inquiries.
        </p>

        {/* Contact Options */}
        <div className="support-grid">
          <div className="support-box">
            <Mail className="support-icon" size={32} />
            <h3 className="support-box-title">Email Support</h3>
            <p className="support-box-text">Drop us an email, and we’ll get back to you soon.</p>
            <a href="mailto:support@example.com" className="support-button">Email Us</a>
          </div>

          <div className="support-box">
            <Phone className="support-icon" size={32} />
            <h3 className="support-box-title">Call Us</h3>
            <p className="support-box-text">Talk to our team directly for immediate assistance.</p>
            <a href="tel:+1234567890" className="support-button">Call Now</a>
          </div>

          <div className="support-box">
            <MessageCircle className="support-icon" size={32} />
            <h3 className="support-box-title">Live Chat</h3>
            <p className="support-box-text">Chat with our team and get real-time support.</p>
            <button className="support-button">Start Chat</button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq">
            <h4 className="faq-question">🔹 How can I reset my password?</h4>
            <p className="faq-answer">Go to the login page and click "Forgot Password" to reset it.</p>
          </div>
          <div className="faq">
            <h4 className="faq-question">🔹 How do I contact customer support?</h4>
            <p className="faq-answer">You can email, call, or use our live chat for assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
function Teams() {
  const [teams, setTeams] = useState([]);
  const [showMembers, setShowMembers] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    members: "",
    description: "",
    skills: "",
  });

  useEffect(() => {
    fetch("/teams.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setTeams(data.teams))
      .catch((error) => {
        console.error("Error fetching teams:", error);
        alert("Failed to load teams.");
      });
  }, []);

  const toggleMembers = (index) => {
    setShowMembers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleChange = (e) => {
    setNewTeam({ ...newTeam, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your team is created successfully!");
    setShowForm(false);
  };

  return (
    <div className="wrapper">
      <h1>Our Teams</h1>
      <ul className="group-items">
        {teams.map((team, index) => (
          <li key={team.id} className="card">
            <strong>{team.name}</strong>
            <button className="action-btn" onClick={() => alert(`Joined ${team.name}!`)}>Join</button>
            <button className="action-btn" onClick={() => toggleMembers(index)}>
              {showMembers[index] ? "Hide Members" : "Show Members"}
            </button>

            {showMembers[index] && (
              <ul className="details-list">
                {team.members.map((member) => (
                  <li key={member.id} className="details-item">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="avatar"
                    />
                    <div className="content">
                      <strong>{member.name}</strong>
                      <p>{member.role}</p>
                      <a href={`mailto:${member.email}`}>{member.email}</a>
                      <div className="links">
                        {Object.entries(member.socials).map(([platform, link]) => (
                          <a key={platform} href={link} target="_blank" rel="noopener noreferrer">
                            {platform}
                          </a>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <button className="create-btn" onClick={() => setShowForm(true)}>Create Your Team</button>

      {showForm && (
        <form className="form-box" onSubmit={handleSubmit}>
          <h2>Create a Team</h2>
          <input
            type="text"
            name="name"
            placeholder="Team Name"
            value={newTeam.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="members"
            placeholder="Members (comma separated)"
            value={newTeam.members}
            onChange={handleChange}
            style={{ color: 'black' }}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newTeam.description}
            onChange={handleChange}
            style={{ color: 'black' }}
            required
          />
          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={newTeam.skills}
            onChange={handleChange}
            style={{ color: 'black' }}
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}


function Frontend() {
  const [frontendDevs, setFrontendDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filtering developers with frontend-related skills
        const frontendRelated = data.filter((dev) =>
          dev.skills.toLowerCase().includes("react") ||
          dev.skills.toLowerCase().includes("javascript") ||
          dev.skills.toLowerCase().includes("ui/ux")
        );
        setFrontendDevs(frontendRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load frontend developers.");
      });
  }, []);

  return (
    <div className="frontend-container">
      <h2>Frontend Developers</h2>
      <ul>
        {frontendDevs.length > 0 ? (
          frontendDevs.map((dev, index) => (
            <li key={index} className="frontend-card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No frontend developers found.</p>
        )}
      </ul>
    </div>
  );
}
function Backend() {
  const [backendDevs, setBackendDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filtering developers with backend-related skills
        const backendRelated = data.filter((dev) =>
          dev.skills.toLowerCase().includes("node.js") ||
          dev.skills.toLowerCase().includes("express") ||
          dev.skills.toLowerCase().includes("mongodb") ||
          dev.skills.toLowerCase().includes("sql") ||
          dev.skills.toLowerCase().includes("python")
        );
        setBackendDevs(backendRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load backend developers.");
      });
  }, []);

  return (
    <div className="frontend-container">
      <h2>Backend Developers</h2>
      <ul>
        {backendDevs.length > 0 ? (
          backendDevs.map((dev, index) => (
            <li key={index} className="end-card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No backend developers found.</p>
        )}
      </ul>
    </div>
  );
}
function FullStack() {
  const [fullStackDevs, setFullStackDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filter developers who have both frontend and backend-related skills
        const fullStackRelated = data.filter((dev) => {
          const skills = dev.skills.toLowerCase();
          return (
            (skills.includes("react") || skills.includes("javascript")) &&
            (skills.includes("node.js") ||
              skills.includes("express") ||
              skills.includes("mongodb") ||
              skills.includes("sql") ||
              skills.includes("python"))
          );
        });
        setFullStackDevs(fullStackRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load full-stack developers.");
      });
  }, []);

  return (
    <div className="wrapper">
      <h2>Full Stack Developers</h2>
      <ul className="group-items">
        {fullStackDevs.length > 0 ? (
          fullStackDevs.map((dev, index) => (
            <li key={index} className="card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No full-stack developers found.</p>
        )}
      </ul>
    </div>
  );
}

function DSA() {
  const [dsaDevs, setDsaDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filter developers with DSA-related skills
        const dsaRelated = data.filter((dev) => {
          const skills = dev.skills.toLowerCase();
          return (
            skills.includes("dsa") ||
            skills.includes("data structures") ||
            skills.includes("algorithms") ||
            skills.includes("competitive programming")
          );
        });
        setDsaDevs(dsaRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load DSA developers.");
      });
  }, []);

  return (
    <div className="wrapper">
      <h2>DSA Enthusiasts</h2>
      <ul className="group-items">
        {dsaDevs.length > 0 ? (
          dsaDevs.map((dev, index) => (
            <li key={index} className="card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No DSA enthusiasts found.</p>
        )}
      </ul>
    </div>
  );
}

function Java() {
  const [javaDevs, setJavaDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filter developers with Java-related skills
        const javaRelated = data.filter((dev) => {
          const skills = dev.skills.toLowerCase();
          return skills.includes("java");
        });
        setJavaDevs(javaRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load Java developers.");
      });
  }, []);

  return (
    <div className="wrapper">
      <h2>Java Developers</h2>
      <ul className="group-items">
        {javaDevs.length > 0 ? (
          javaDevs.map((dev, index) => (
            <li key={index} className="card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No Java developers found.</p>
        )}
      </ul>
    </div>
  );
}
function Python() {
  const [pythonDevs, setPythonDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filter developers with Python-related skills
        const pythonRelated = data.filter((dev) => {
          const skills = dev.skills.toLowerCase();
          return skills.includes("python");
        });
        setPythonDevs(pythonRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load Python developers.");
      });
  }, []);

  return (
    <div className="wrapper">
      <h2>Python Developers</h2>
      <ul className="group-items">
        {pythonDevs.length > 0 ? (
          pythonDevs.map((dev, index) => (
            <li key={index} className="card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No Python developers found.</p>
        )}
      </ul>
    </div>
  );
}
function Cpp() {
  const [cppDevs, setCppDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filter developers with C++-related skills
        const cppRelated = data.filter((dev) => {
          const skills = dev.skills.toLowerCase();
          return skills.includes("c++");
        });
        setCppDevs(cppRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load C++ developers.");
      });
  }, []);

  return (
    <div className="wrapper">
      <h2>C++ Developers</h2>
      <ul className="group-items">
        {cppDevs.length > 0 ? (
          cppDevs.map((dev, index) => (
            <li key={index} className="card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No C++ developers found.</p>
        )}
      </ul>
    </div>
  );
}

function C() {
  const [cDevs, setCDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filter developers with C-related skills
        const cRelated = data.filter((dev) => {
          const skills = dev.skills.toLowerCase();
          return skills.includes("c");
        });
        setCDevs(cRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load C developers.");
      });
  }, []);

  return (
    <div className="wrapper">
      <h2>C Developers</h2>
      <ul className="group-items">
        {cDevs.length > 0 ? (
          cDevs.map((dev, index) => (
            <li key={index} className="card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No C developers found.</p>
        )}
      </ul>
    </div>
  );
}
function ReactPage() {
  const [reactDevs, setReactDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filter developers with React-related skills
        const reactRelated = data.filter((dev) => {
          const skills = dev.skills.toLowerCase();
          return skills.includes("react");
        });
        setReactDevs(reactRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load React developers.");
      });
  }, []);

  return (
    <div className="wrapper">
      <h2>React Developers</h2>
      <ul className="group-items">
        {reactDevs.length > 0 ? (
          reactDevs.map((dev, index) => (
            <li key={index} className="card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No React developers found.</p>
        )}
      </ul>
    </div>
  );
}
function NodeJs() {
  const [nodeDevs, setNodeDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filter developers with Node.js-related skills
        const nodeRelated = data.filter((dev) => {
          const skills = dev.skills.toLowerCase();
          return skills.includes("node.js") || skills.includes("express");
        });
        setNodeDevs(nodeRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load Node.js developers.");
      });
  }, []);

  return (
    <div className="wrapper">
      <h2>Node.js Developers</h2>
      <ul className="group-items">
        {nodeDevs.length > 0 ? (
          nodeDevs.map((dev, index) => (
            <li key={index} className="card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No Node.js developers found.</p>
        )}
      </ul>
    </div>
  );
}

function UIUX() {
  const [uiuxDevs, setUiuxDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filter developers with UI/UX-related skills
        const uiuxRelated = data.filter((dev) => {
          const skills = dev.skills.toLowerCase();
          return skills.includes("ui/ux") || skills.includes("design");
        });
        setUiuxDevs(uiuxRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load UI/UX developers.");
      });
  }, []);

  return (
    <div className="wrapper">
      <h2>UI/UX Developers</h2>
      <ul className="group-items">
        {uiuxDevs.length > 0 ? (
          uiuxDevs.map((dev, index) => (
            <li key={index} className="card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No UI/UX developers found.</p>
        )}
      </ul>
    </div>
  );
}

function EdTech() {
  const [edTechDevs, setEdTechDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filter developers with EdTech-related preferences
        const edTechRelated = data.filter((dev) =>
          dev.preferences.toLowerCase().includes("edtech")
        );
        setEdTechDevs(edTechRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load EdTech developers.");
      });
  }, []);

  return (
    <div className="wrapper">
      <h2>EdTech Developers</h2>
      <ul className="group-items">
        {edTechDevs.length > 0 ? (
          edTechDevs.map((dev, index) => (
            <li key={index} className="card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No EdTech developers found.</p>
        )}
      </ul>
    </div>
  );
}

function Designing() {
  const [designDevs, setDesignDevs] = useState([]);

  useEffect(() => {
    fetch("/teammates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Filter developers with Designing-related preferences
        const designRelated = data.filter((dev) =>
          dev.preferences.toLowerCase().includes("design")
        );
        setDesignDevs(designRelated);
      })
      .catch((error) => {
        console.error("Error fetching teammates:", error);
        alert("Failed to load designing developers.");
      });
  }, []);

  return (
    <div className="wrapper">
      <h2>Designing Developers</h2>
      <ul className="group-items">
        {designDevs.length > 0 ? (
          designDevs.map((dev, index) => (
            <li key={index} className="card">
              <h3>{dev.name}</h3>
              <p><strong>Skills:</strong> {dev.skills}</p>
              <p><strong>Availability:</strong> {dev.availability}</p>
              <p><strong>Preferences:</strong> {dev.preferences}</p>
            </li>
          ))
        ) : (
          <p>No Designing developers found.</p>
        )}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2025 TeamMate | All Rights Reserved</p>
    </footer>
  );
}
