import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      setStatus("❌ Please enter your feedback.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/feedback", {
        email,
        feedback,
      });
      console.log("Server response:", response.data);
      setStatus("✅ Thank you! Your feedback has been submitted.");
      setFeedback("");
      setEmail("");
    } catch (error) {
      console.error("Feedback error:", error);
      setStatus("❌ Error submitting feedback. Please try again.");
    }
  };

  return (
     <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url('/path-to-your-image.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(249, 249, 249, 0.9)", // Slightly transparent white
          color: "#333",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Feedback Form</h2>
        <p style={{ marginBottom: "20px", fontSize: "15px", color: "#555" }}>
          Have a question or issue? Let us know and we’ll get back to you soon.
        </p>

        <input
          type="email"
          placeholder="Your email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        <textarea
          placeholder="Your feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={5}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
            resize: "vertical",
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Submit
        </button>

        {status && (
          <p style={{ marginTop: "15px", fontSize: "14px", color: "#28a745" }}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
};
  
export default Chatbot;

