import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import "./App.css";
import "./About.css";
// import { submitbutton } from "./script";
import "./Support.css";
// import teamData from "./teams.json";
// import teammatesData from "./teammates.json";
import "./Front.css";
import "./Responsive.css";
import "./Login.css";
import "./Messages.css"
import data from "./Friends.json";
import "./Friends.css"
// import Data from "./messagesData.json";
import "./Posts.css";
import "./Explore.css";
import "./Projects.css";
import "./Announcement.css";
import Chatbot from "./chatbot.js";
import "./Teams.css"




export default function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundImage = "url('3.jpg')";
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundImage = "url('4.jpg')";
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser")) || null
  );

  return (
    <Router>
      <div>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home currentUser={currentUser} />} />
          <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/teams" element={<Teams currentUser={currentUser} />} />
          <Route path="/search" element={<Search />} />
          <Route path="/friends" element={<Friends currentUser={currentUser} />} />
          <Route path="/messages" element={<Messages currentUser={currentUser} />} />
          <Route path="/posts" element={<Posts currentUser={currentUser} />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/announcements" element={<Announcements currentUser={currentUser} />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

function Header({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const filtered = teammates.filter(teammate =>
      teammate.name.toLowerCase().includes(input.toLowerCase()) ||
      teammate.skills.toLowerCase().includes(input.toLowerCase()) ||
      teammate.preferences.toLowerCase().includes(input.toLowerCase())
    );

    navigate('/search', { state: { results: filtered } });
    setResults(filtered);
    setResults(results);
  };
  // Load teammates once
  const [teammates, setTeammates] = useState([]);
  useEffect(() => {
    fetch("https://teamfinder-53lz.onrender.com/api/teammates")
      .then((res) => res.json())
      .then((data) => {
        console.log("Teammates loaded:", data); // ✅ Check data format
        setTeammates(data);
      })
      .catch((err) => console.error("Error loading teammates:", err));
  }, []);

  // Handle search
  return (
    <>
      <header className="header">
        {/* Sidebar Toggle */}
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        {/* Sidebar */}
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
          <ul>
            {/* Friends */}
            {["Messages", "Posts", "Explore", "Projects", "Announcements"].map(
              (item, index) => (
                <li key={index}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Navbar */}
        <img src="/1.jpg" alt="Logo" className="imglogo" href="src/app.js" />
        <nav className="top-nav">
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/support">Support</Link>
          <Link to="/teams">Teams</Link>
        </nav>

        {/* Search bar */}
        <div className="search-container" style={{ width: '50vh' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search..."
          />
          <button onClick={handleSearch}>
            🔍
          </button>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full transition-all duration-300 bulb"
        >
          {darkMode ? <Sun size={30} color="yellow" /> : <Moon size={30} color="black" />}
        </button>
      </header>

      {/* Search results below header */}

    </>

  );
}

function Home() {


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    availability: "",
    preferences: "",
    password: "",
    confirmPassword: ""
  });
  useEffect(() => {
    fetch("https://teamfinder-53lz.onrender.com/api/teammates")
      .then((res) => res.json())
      .then((data) => setTeamList(data))
      .catch((err) => console.error("Error loading teammates:", err));
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [signedUpUser, setSignedUpUser] = useState(null);


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };



  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const newTeammate = {
      name: formData.name,
      email: formData.email,
      skills: formData.skills,
      availability: formData.availability,
      preferences: formData.preferences,
      password: formData.password,
    };
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`;
    setSignedUpUser({
      name: formData.name,
      avatar: avatar
    });


    // ✅ POST the data to your backend
    fetch("https://teamfinder-53lz.onrender.com/api/teammates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTeammate),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save teammate");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Teammate saved:", data);
        setTeamList((prevList) => [...prevList, newTeammate]);
        setModalVisible(true);
        alert("Teammate added successfully!");

        // 👇 Set signed-up user with avatar
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`;
        setSignedUpUser({
          name: formData.name,
          avatar: avatarUrl
        });

        setFormData({
          name: "",
          email: "",
          skills: "",
          availability: "",
          preferences: "",
          password: "",
          confirmPassword: "",
        });
      })
      .catch((err) => {
        console.error("❌ Error saving teammate:", err);
        alert("Something went wrong while saving.");
      });

  };





  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredTeams = teamList.filter((teammate) =>
    teammate.name.toLowerCase().includes(searchQuery)
  );

  return (
    <main>
      <section className="profile-section">
        {signedUpUser ? (
          <div className="user-profile">
            <div className="avatar-wrapper">
              <img
                src={signedUpUser.avatar}
                alt="User Avatar"
                style={{ width: 80, height: 80, borderRadius: '50%', cursor: 'pointer' }}
                onClick={() => setModalVisible(!modalVisible)}
              />
              {modalVisible && (
                <div className="dropdown">
                  <p>👋 Hello, {signedUpUser.name}</p>
                  <button onClick={() => setSignedUpUser(null)}>Logout</button>
                </div>
              )}
            </div>
            <h2>Welcome {signedUpUser.name}!</h2>
            <p>Thanks for signing up. This is your custom dashboard space.</p>
          </div>
        ) : (
          <>
            <h2>Create Your Profile</h2>

            <form id="profile-form" onSubmit={handleSubmit} >
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
              <label htmlFor="email">Email:</label>
              <input type="text" id="email" value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
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
              <Link to="/login" className="login-link">or Login</Link>
              <button type="submit" id="submitBtn">Submit</button>
            </form>
          </>
        )}
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
  const navigate = useNavigate();
  const Connect = () => {
    navigate("/home"); // Replace with your chatbot route
  };
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
        {/* <Link to="/home" element="/Home" className="about-button">Join Us Today</Link> */}
        <button className="about-button" onClick={Connect}>Join Us Today</button>
      </div>
    </div>
  );
}

function Support() {
  const [showEmails, setShowEmails] = useState(false);
  const [showPhones, setShowPhones] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleStartChat = () => {
    setShowChatbot(true);
  };

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
            <button
              className="support-button"
              onClick={() => setShowEmails(!showEmails)}
            >
              Email Us
            </button>
            {showEmails && (
              <ul className="support-contact-list">
                <li>support@teamfinder.com</li>
                <li>ab2005maurya@gmail.com</li>
              </ul>
            )}
          </div>

          {/* Phone Support */}
          <div className="support-box">
            <Phone className="support-icon" size={32} />
            <h3 className="support-box-title">Call Us</h3>
            <p className="support-box-text">Talk to our team directly for immediate assistance.</p>
            <button
              className="support-button"
              onClick={() => setShowPhones(!showPhones)}
            >
              Call Now
            </button>
            {showPhones && (
              <ul className="support-contact-list">
                <li>+91 7011399153</li>
                <li>+91 9876543210</li>
              </ul>
            )}
          </div>
          <div className="support-box">
            <MessageCircle className="support-icon" size={32} />
            <h3 className="support-box-title">Live Chat</h3>
            <p className="support-box-text">Chat with our team and get real-time support.</p>
            <Link to="/chatbot" className="support-button" onClick={handleStartChat}>Start Chat</Link>
            {/* <button className="support-button" onClick={handleStartChat}>Start Chat</button> */}
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
        {showChatbot && <Chatbot />}
      </div>
    </div>
  );
}
function Teams({ currentUser }) {
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
    fetch("https://teamfinder-53lz.onrender.com/api/teams")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched teams:", data); // ✅ log to inspect
        setTeams(data.teams || []); // ensure it's an array
      })
      .catch((err) => {
        console.error("Error fetching teams:", err);
        setTeams([]); // fallback
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

  const handleJoinTeam = (teamId) => {
    if (!currentUser || !currentUser.name || !currentUser.email) {
      alert("Please log in with a valid account to join a team.");
      return;
    }

    const newMember = {
      name: currentUser.name,
      email: currentUser.email,
      image: currentUser.avatar || "", // match server expectations
      role: "Member",
      socials: {},
    };

    fetch(`${process.env.REACT_APP_API_BASE}/api/teammates/${teamId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember), // ✅ send the object directly
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Backend error:", errorText);
          alert(`Failed to join team: ${errorText}`);
          return;
        }
        return res.json();
      })
      .then((updatedTeam) => {
        if (!updatedTeam) return;

        alert(`🎉 Successfully joined ${updatedTeam.name}!`);
        // Update local team state
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.id === updatedTeam.id ? updatedTeam : team
          )
        );
      })
      .catch((err) => {
        console.error("❌ Join error:", err);
        alert("Something went wrong while joining the team.");
      });
  };




  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse members and skills into arrays (optional depending on backend expectation)
    const membersArray = newTeam.members.split(',').map(name => ({
      name: name.trim(),
      email: '',
      image: '',
      role: '',
      socials: {}
    }));

    const formattedTeam = {
      ...newTeam,
      id: Date.now(), // assign a unique id
      members: membersArray,
      skills: newTeam.skills.split(',').map(skill => skill.trim())
    };

    fetch("https://teamfinder-53lz.onrender.com/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formattedTeam)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add team");
        return res.text();
      })
      .then(() => {
        alert("Your team is created successfully!");

        // Add new team to the UI
        setTeams((prev) => [...prev, formattedTeam]);

        // Reset form
        setNewTeam({
          name: "",
          members: "",
          description: "",
          skills: ""
        });

        setShowForm(false);
      })
      .catch((err) => {
        console.error("Error submitting team:", err);
        alert("There was an error creating the team.");
      });
  };


  return (
    <div className="wrapper">
      <div className="top-bar">
        <h1>Our Teams</h1>
        <button className="create-btn" onClick={() => setShowForm(true)}>Create Your Team</button>
      </div>
    <ul className="group-items">
  {Array.isArray(teams) && teams.map((team, index) => (
    <li key={team.id} className="card">
      <strong>{team.name}</strong>
      <button className="action-btn" onClick={() => handleJoinTeam(team.id)}>
        Join
      </button>

      <button className="action-btn" onClick={() => toggleMembers(index)}>
        {showMembers[index] ? "Hide Members" : "Show Members"}
      </button>

      {showMembers[index] && (
        <ul className="details-list">
          {Array.isArray(team.members) && team.members.map((member) => (
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
                  {member.socials && Object.entries(member.socials).map(([platform, link]) => (
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


      {showForm && (
        <>
          <div className="form-overlay" onClick={() => setShowForm(false)} />
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
        </>
      )}
    </div>
  );
}


function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} TeamFinder | All Rights Reserved</p>
    </footer>
  );
}
// 

function Search() {
  const location = useLocation();
  const results = location.state?.results || [];

  return (
    <div className="popup">
      {results.length > 0 ? (
        results.map((item, index) => (
          <div className="result-item" key={index}>
            <strong>{item.name}</strong>
            <p><b>Skills:</b> {item.skills}</p>
            <p><b>Preferences:</b> {item.preferences}</p>
            <p><b>Availability:</b> {item.availability}</p>
          </div>
        ))
      ) : (
        <div className="no-results">No results found.</div>
      )}
    </div>
  );
}

// 
function Friends({ currentUser }) {
  const [users, setUsers] = useState([]);

  // Ensure currentUser is set properly
  const currentUserId = currentUser?.id;

  useEffect(() => {
    if (currentUser) {
      // Make sure each user has default structure
      const initialized = data.map(user => ({
        ...user,
        friends: user.friends || [],
        requestsSent: user.requestsSent || [],
        requestsReceived: user.requestsReceived || [],
      }));
      setUsers(initialized);
    }
  }, [currentUser]);

  const updateUsers = (updatedUsers) => {
    setUsers(updatedUsers);
  };

  const getName = (id) => users.find(u => u.id === id)?.name || 'Unknown';

  const sendRequest = (id) => {
    const updated = users.map(user => {
      if (user.id === currentUserId) {
        return {
          ...user,
          requestsSent: [...new Set([...user.requestsSent, id])]
        };
      }
      if (user.id === id) {
        return {
          ...user,
          requestsReceived: [...new Set([...user.requestsReceived, currentUserId])]
        };
      }
      return user;
    });
    updateUsers(updated);
  };

  const acceptRequest = (id) => {
    const updated = users.map(user => {
      if (user.id === currentUserId) {
        return {
          ...user,
          friends: [...user.friends, id],
          requestsReceived: user.requestsReceived.filter(req => req !== id)
        };
      }
      if (user.id === id) {
        return {
          ...user,
          friends: [...user.friends, currentUserId],
          requestsSent: user.requestsSent.filter(req => req !== currentUserId)
        };
      }
      return user;
    });
    updateUsers(updated);
  };

  const declineRequest = (id) => {
    const updated = users.map(user => {
      if (user.id === currentUserId) {
        return {
          ...user,
          requestsReceived: user.requestsReceived.filter(req => req !== id)
        };
      }
      if (user.id === id) {
        return {
          ...user,
          requestsSent: user.requestsSent.filter(req => req !== currentUserId)
        };
      }
      return user;
    });
    updateUsers(updated);
  };

  const me = users.find(u => u.id === currentUserId);

  return (
    <div className="friends-page">
      <h2>Friends of {me?.name}</h2>

      <div className="section">
        {me?.friends?.length > 0 ? (
          me.friends.map(id => (
            <div key={id} className="card">
              <p>{getName(id)}</p>
            </div>
          ))
        ) : (
          <p className="empty">No friends yet.</p>
        )}
      </div>

      <h3>📥 Friend Requests</h3>
      <div className="section">
        {me?.requestsReceived?.length > 0 ? (
          me.requestsReceived.map(id => (
            <div key={id} className="card">
              <p>{getName(id)}</p>
              <button onClick={() => acceptRequest(id)}>✅ Accept</button>
              <button onClick={() => declineRequest(id)}>❌ Decline</button>
            </div>
          ))
        ) : (
          <p className="empty">No incoming requests.</p>
        )}
      </div>

      <h3>➕ Suggested Friends</h3>
      <div className="section">
        {users
          .filter(u =>
            u.id !== currentUserId &&
            !me?.friends.includes(u.id) &&
            !me?.requestsSent.includes(u.id) &&
            !me?.requestsReceived.includes(u.id)
          )
          .map(user => (
            <div key={user.id} className="card">
              <p>{user.name}</p>
              <button onClick={() => sendRequest(user.id)}>Send Request</button>
            </div>
          ))}
      </div>
    </div>
  );
}
function Messages({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    if (!currentUser?.email) return;

    fetch("https://teamfinder-53lz.onrender.com/api/teammates")
      .then(res => res.json())
      .then(data => {
        setUsers(data.filter(u => u.email !== currentUser.email));
      });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.email || !selectedUser?.email) return;

    console.log("Fetching messages between:", currentUser.email, selectedUser.email);

    fetch("https://teamfinder-53lz.onrender.com/api/messages")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(msg =>
          (msg.senderId === currentUser.email && msg.receiverId === selectedUser.email) ||
          (msg.senderId === selectedUser.email && msg.receiverId === currentUser.email)
        );
        setMessages(filtered);
      })
      .catch(err => {
        console.error("❌ Error fetching messages:", err);
      });
  }, [selectedUser?.email, currentUser?.email]);

  const handleSend = () => {
    if (!currentUser || !selectedUser) {
      alert("❌ Please select a user to chat with and ensure you're logged in.");
      return;
    }

    if (!newMsg.trim()) return;

    const message = {
      senderId: currentUser.email,
      receiverId: selectedUser.email,
      text: newMsg,
      timestamp: new Date().toISOString(),
    };

    fetch("https://teamfinder-53lz.onrender.com/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then(res => res.json())
      .then(savedMsg => {
        setMessages(prev => [...prev, savedMsg]);
        setNewMsg("");
      })
      .catch(err => {
        console.error("❌ Error sending message:", err);
        alert("Failed to send message.");
      });
  };

  return (
    <div className="messages-container">
      <aside className="user-list">
        <h3>Start Chat</h3>
        {users.map(user => (
          <div
            key={user.email}
            className={`user-item ${selectedUser?.email === user.email ? "active" : ""}`}
            onClick={() => setSelectedUser(user)}
          >
            <div className="avatar">{user.name.charAt(0)}</div>
            <div className="name">{user.name}</div>
          </div>
        ))}
      </aside>

      <main className="chat-box">
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.name}</h3>
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${msg.senderId === currentUser.email ? "sent" : "received"}`}
                >
                  <p>{msg.text}</p>
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting.</p>
        )}
      </main>
    </div>
  );
}


function Posts({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    fetch("https://teamfinder-53lz.onrender.com/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Failed to load posts:", err));
  }, []);

  const updatePost = async (updatedPost) => {
    try {
      await fetch(`https://teamfinder-53lz.onrender.com/api/posts/${updatedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });
    } catch (err) {
      console.error("❌ Error updating post:", err);
    }
  };

  const handleLike = (postId) => {
    const updated = posts.map(post => {
      if (post.id === postId && !post.likes.includes(currentUser.id)) {
        const updatedPost = {
          ...post,
          likes: [...post.likes, currentUser.id],
          dislikes: post.dislikes.filter(id => id !== currentUser.id),
        };
        updatePost(updatedPost);
        return updatedPost;
      }
      return post;
    });
    setPosts(updated);
  };

  const handleDislike = (postId) => {
    const updated = posts.map(post => {
      if (post.id === postId && !post.dislikes.includes(currentUser.id)) {
        const updatedPost = {
          ...post,
          dislikes: [...post.dislikes, currentUser.id],
          likes: post.likes.filter(id => id !== currentUser.id),
        };
        updatePost(updatedPost);
        return updatedPost;
      }
      return post;
    });
    setPosts(updated);
  };

  const handleShare = (postId) => {
    const updated = posts.map(post =>
      post.id === postId ? { ...post, shares: post.shares + 1 } : post
    );
    const sharedPost = updated.find(p => p.id === postId);
    updatePost(sharedPost);
    setPosts(updated);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost = {
      authorId: currentUser.id,
      authorName: currentUser.name,
      content: newPostContent,
      likes: [],
      dislikes: [],
      shares: 0
    };

    fetch("https://teamfinder-53lz.onrender.com/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then(res => res.json())
      .then(savedPost => {
        setPosts([savedPost, ...posts]);
        setNewPostContent('');
      })
      .catch(err => {
        console.error("❌ Error creating post:", err);
      });
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="posts-container">
      <div className="create-post">
        <textarea
          placeholder="What's on your mind?"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
        <button onClick={handleCreatePost}>Post</button>
      </div>

      <input
        className="search-bar"
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredPosts.map(post => (
        <div key={post.id} className="post-card">
          <p className="post-author">Posted by {post.authorName || `User ${post.authorId}`}</p>
          <p className="post-content">{post.content}</p>
          <div className="post-actions">
            <button onClick={() => handleLike(post.id)}>👍 {post.likes.length}</button>
            <button onClick={() => handleDislike(post.id)}>👎 {post.dislikes.length}</button>
            <button onClick={() => handleShare(post.id)}>🔁 {post.shares}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// const mockContent = [
//   { id: 1, type: 'image', url: 'https://source.unsplash.com/random/300x300?sig=1', user: 'Aarav', likes: 0, comments: [] },
//   { id: 2, type: 'image', url: 'https://source.unsplash.com/random/300x300?sig=2', user: 'Meera', likes: 0, comments: [] },
//   { id: 3, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', user: 'Rahul', likes: 0, comments: [] },
//   { id: 4, type: 'text', content: 'Just finished building my first full-stack app!', user: 'Sneha', likes: 0, comments: [] },
//   { id: 5, type: 'image', url: 'https://source.unsplash.com/random/300x300?sig=5', user: 'Dev', likes: 0, comments: [] },
//   { id: 6, type: 'video', url: 'https://www.w3schools.com/html/movie.mp4', user: 'Priya', likes: 0, comments: [] },
//   { id: 7, type: 'text', content: 'Traveling to the mountains. Peace. ☁️', user: 'Ankit', likes: 0, comments: [] },
//   { id: 8, type: 'image', url: 'https://source.unsplash.com/random/300x300?sig=8', user: 'Tanvi', likes: 0, comments: [] },
// ];
function Explore() {
  const [content, setContent] = useState([]);
  const [search, setSearch] = useState('');
  const [likeStates, setLikeStates] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
  fetch("https://teamfinder-53lz.onrender.com/api/explore")
    .then(res => res.json())
    .then(data => {
      setContent(data);
      const initialLikes = {};
      data.forEach(post => {
        initialLikes[post.id] = false; // all unliked initially
      });
      setLikeStates(initialLikes);
    })
    .catch(err => console.error("Failed to load explore data:", err));
}, []);


  const updatePost = (updatedItem) => {
    fetch(`https://teamfinder-53lz.onrender.com/api/explore/${updatedItem.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    })
      .then(res => res.json())
      .then(data => console.log("✅ Post updated:", data))
      .catch(err => console.error("❌ Failed to update post", err));
  };

  const handleLike = async (postId) => {
  const liked = likeStates[postId]; // get current like state

  const updated = content.map(item =>
    item.id === postId
      ? { ...item, likes: item.likes + (liked ? -1 : 1) }
      : item
  );

  setContent(updated);

  // Toggle the like state locally
  setLikeStates(prev => ({ ...prev, [postId]: !liked }));

  try {
    const post = updated.find(p => p.id === postId);
    await fetch(`https://teamfinder-53lz.onrender.com/api/explore/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    });
  } catch (err) {
    console.error("Failed to update like:", err);
  }
};

  const handleCommentChange = (id, value) => {
    setCommentInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleAddComment = (id) => {
    if (!commentInputs[id]) return;

    setContent(prev => {
      const updated = prev.map(item =>
        item.id === id
          ? { ...item, comments: [...item.comments, commentInputs[id]] }
          : item
      );

      const updatedItem = updated.find(i => i.id === id);
      updatePost(updatedItem);  // <-- 🔥 Save comment

      return updated;
    });

    setCommentInputs(prev => ({ ...prev, [id]: '' }));
  };


  const handleShare = (id) => {
    const fakeLink = `https://yourapp.com/explore/${id}`;
    navigator.clipboard.writeText(fakeLink).then(() => {
      alert('Post link copied to clipboard!');
    });
  };

  const filtered = content.filter(item =>
    item.user?.toLowerCase().includes(search.toLowerCase()) ||
    (item.type === 'text' && item.content?.toLowerCase().includes(search.toLowerCase()))
  );


  return (
    <div className="explore-container">
      <h2>Explore</h2>

      <input
        type="text"
        placeholder="Search by user or content..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="explore-search"
      />

      <div className="explore-grid">
        {filtered.map(item => (
          <div key={item.id} className="explore-item">
            <p className="username">@{item.user}</p>

            {item.type === 'image' && <img src={item.url} alt="Explore" />}
            {item.type === 'video' && (
              <video controls muted>
                <source src={item.url} type="video/mp4" />
              </video>
            )}
            {item.type === 'text' && <p className="text-post">{item.content}</p>}

            <div className="actions">
              <button onClick={() => handleLike(item.id)}>
                {likeStates[item.id] ? '❤️' : '🤍'} {item.likes}
              </button>
              <button onClick={() => handleShare(item.id)}>🔗 Share</button>
            </div>

            <div className="comments">
              {item.comments.map((comment, idx) => (
                <p key={idx} className="comment">💬 {comment}</p>
              ))}
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInputs[item.id] || ''}
                onChange={e => handleCommentChange(item.id, e.target.value)}
              />
              <button onClick={() => handleAddComment(item.id)}>Send</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: '',
    tech: '',
    github: '',
    image: '',
    file: ''
  });
  useEffect(() => {
    // Fetch existing projects
    fetch("https://teamfinder-53lz.onrender.com/api/projects")
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error loading projects:", err));
  }, []);

  const [search, setSearch] = useState('');

  const formRef = useRef(null); // 👉 Ref for scrolling to form

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setForm({ ...form, [name]: files[0] });  // ✅ Use actual File object
    } else {
      setForm({ ...form, [name]: value });
    }
  };





  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("tech", form.tech);
    formData.append("github", form.github);

    if (form.image) formData.append("image", form.image);
    if (form.file) formData.append("file", form.file);

    try {
      const res = await fetch("https://teamfinder-53lz.onrender.com/api/projects", {
        method: "POST",
        body: formData,
      });
      const saved = await res.json();

      if (!res.ok) throw new Error(saved.error || "Upload failed");

      setProjects([saved, ...projects]);
      setForm({ title: "", tech: "", github: "", image: "", file: "" });
    } catch (err) {
      alert("❌ Failed to add project");
      console.error(err);
    }
  };



  const filtered = projects.filter(p =>
    (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.tech || "").toLowerCase().includes(search.toLowerCase())
  );


  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="projects-container">

      {/* 🆕 Banner Section */}
      <section className="projects-banner">
        <div className="projects-banner-text">
          <h1>Wanna share your skills with others?</h1>
          <p>Publish your exciting projects and connect with teammates ready to collaborate!</p>
          <button onClick={scrollToForm} className="share-project-btn">
            Share Project
          </button>
        </div>
      </section>

      {/* 👇 Your Existing Part Starts Here */}
      <h2>📁 Project Showcase</h2>

      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <div className="project-grid">
        {filtered.map((project) => (
          <div key={project.id} className="project-card">

            {/* ✅ If Image uploaded */}
            {project.image ? (
              <img src={project.image} alt="Project Preview" className="project-image" />
            ) : project.file ? (
              // ✅ Show generic PDF or ZIP icon if only file is uploaded
              <div className="file-preview">
                {project.file.toLowerCase().endsWith(".pdf") && (
                  <img src="./pdf-icon.png" alt="PDF File" className="file-icon" />
                )}
                {(project.file.toLowerCase().endsWith(".zip") || project.file.toLowerCase().endsWith(".rar")) && (
                  <img src="./zip-icon.png" alt="ZIP File" className="file-icon" />
                )}
              </div>
            ) : null}

            <h4>{project.title}</h4>
            <p><strong>Tech:</strong> {project.tech}</p>

            {project.file && (
              <>
                {project.file.toLowerCase().endsWith(".pdf") && (
                  <a href={`http://localhost:5000${project.file}`} target="_blank" rel="noopener noreferrer">
                    📄 View PDF
                  </a>

                )}

                {(project.file.toLowerCase().endsWith(".zip") ||
                  project.file.toLowerCase().endsWith(".rar")) && (
                    <a href={`http://localhost:5000${project.file}`} download>📦 Download ZIP</a>
                  )}
              </>
            )}

            <a href={project.github} target="_blank" rel="noopener noreferrer">🔗 GitHub</a>


          </div>
        ))}
      </div>


      {/* 👇 Move the form here BELOW the list */}
      <form ref={formRef} onSubmit={handleSubmit} className="project-form">
        <h3>Share Your Project</h3>
        <input
          type="text"
          name="title"
          value={form.title}
          placeholder="Project Title"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="tech"
          value={form.tech}
          placeholder="Tech Stack"
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="github"
          value={form.github}
          placeholder="GitHub Link"
          onChange={handleChange}
        />
        <label>
          Upload Image:
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </label>
        <label>
          Upload File (PDF/ZIP):
          <input type="file" name="file" accept=".pdf,.zip,.rar" onChange={handleChange} />
        </label>
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
}



function Announcements({ currentUser }) {

  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', tags: '', link: '' });
  const [search, setSearch] = useState('');
  const [commentInput, setCommentInput] = useState({}); // Track comments per post
  const [showForm, setShowForm] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  useEffect(() => {
    fetch('https://teamfinder-53lz.onrender.com/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAnnouncements(data);
        } else {
          console.error('Unexpected data format for announcements:', data);
          setAnnouncements([]); // fallback to empty array
        }
      })
      .catch(err => {
        console.error('Failed to fetch announcements', err);
        setAnnouncements([]); // ensure fallback on failure
      });
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      tags: form.tags.split(',').map(tag => tag.trim()),
      link: form.link,
      user: currentUser,
      date: new Date().toLocaleString(),
      likes: [],
      comments: []
    };
    fetch('https://teamfinder-53lz.onrender.com/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        setAnnouncements(prev => [newPost, ...prev]);
        setForm({ title: '', description: '', tags: '', link: '' });
      })
      .catch(err => console.error('Failed to post announcement:', err));
  };

  const toggleLike = (postId) => {
    const updated = announcements.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(currentUser.id);
        return {
          ...post,
          likes: hasLiked
            ? post.likes.filter(id => id !== currentUser.id)
            : [...post.likes, currentUser.id]
        };
      }
      return post;
    });
    setAnnouncements(updated);

    const likedPost = updated.find(p => p.id === postId);
    fetch(`https://teamfinder-53lz.onrender.com/api/announcements/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(likedPost)
    });

  };

  const addComment = (postId) => {
    const text = commentInput[postId]?.trim();
    if (!text) return;

    const updated = announcements.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            user: currentUser,
            text,
            time: new Date().toLocaleTimeString()
          }]
        };
      }
      return post;
    });

    setAnnouncements(updated);
    const commentedPost = updated.find(p => p.id === postId);
    fetch(`https://teamfinder-53lz.onrender.com/api/announcements/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentedPost)
    });

  };

  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.tags.join(',').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="announcements-container">
      <h2>📢 Announcements</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <input
          className="search-input"
          type="text"
          placeholder="Search by title or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="toggle-form-button"
        >
          Wanna announce something?
        </button>
      </div>

      {showForm && (

        <form className="announcement-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (e.g. #react, #remote)"
            value={form.tags}
            onChange={handleChange}
          />
          <input
            type="url"
            name="link"
            placeholder="Optional Link"
            value={form.link}
            onChange={handleChange}
          />
          <button type="submit">Post</button>

        </form>
      )}
      <div className="announcement-feed">
        {filtered.map((post) => (
          <div key={post.id} className="announcement-card">
            <div className="user-info">
              <img src={post.user.avatar} alt="avatar" />
              <div>
                <strong>{post.user.name}</strong>
                <p className="date">🕒 {post.date}</p>
              </div>
            </div>

            <h3>{post.title}</h3>
            <p className="desc">{post.description}</p>
            <div className="tags">
              {post.tags.map((tag, i) => (
                <span key={i} className="tag">#{tag}</span>
              ))}
            </div>
            {post.link && (
              <a href={post.link} target="_blank" rel="noreferrer" className="post-link">
                🔗 Learn More
              </a>
            )}

            <div className="actions">
              <button onClick={() => toggleLike(post.id)}>
                {post.likes.includes(currentUser.id) ? '❤️' : '🤍'} Like ({post.likes.length})
              </button>
            </div>

            <div className="comments">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInput[post.id] || ''}
                onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
              />
              <button onClick={() => addComment(post.id)}>Comment</button>

              {post.comments.map((c, i) => (
                <div key={i} className="comment">
                  <img src={c.user.avatar} alt="commenter" />
                  <div>
                    <strong>{c.user.name}</strong>
                    <p>{c.text}</p>
                    <span className="comment-time">{c.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Login({ onLogin }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [teammates, setTeammates] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setCurrentUser(loggedInUser); // If a user is logged in, update the state
    }

    // Fetch teammates list on load
    fetch("https://teamfinder-53lz.onrender.com/api/teammates")
      .then((res) => res.json())
      .then((data) => setTeammates(data))
      .catch((err) => console.error("Error loading teammates:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = teammates.find(
      (t) =>
        t.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        t.password === password
    );



    if (user) {
      alert("✅ Login successful!");
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      onLogin(user); // 👈 pass user back to parent
      navigate("/home");
    } else {
      alert("❌ Invalid credentials!");
    }

    setEmail("");
    setPassword("");
  };

  // Assuming this is part of a functional component
  return (
    currentUser ? (
      <div className="user-profile">
        <div className="avatar-wrapper">
          <img
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed`}
            alt="User Avatar"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              cursor: 'pointer',
            }}
            onClick={() => setModalVisible(!modalVisible)}
          />
          {modalVisible && (
            <div className="dropdown">
              <p>👋 Hello, {currentUser.name}</p>
              <button className="logout-button"
                onClick={() => {
                  setCurrentUser(null);
                  localStorage.removeItem('loggedInUser');
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <h2>Welcome {currentUser.name}!</h2>
        <p>This is your dashboard area. Glad to see you back!</p>
      </div>
    ) : (
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    )
  );
}
