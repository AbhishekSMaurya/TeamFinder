// Header.js
import React, { useEffect, useRef } from 'react';
import './App.css'; // Ensure your styles are loaded

const Header = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        headerRef.current.classList.add('is-sticky');
      } else {
        headerRef.current.classList.remove('is-sticky');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header ref={headerRef} className="header">
      <img src="/path/to/your/logo.png" alt="TeamFinder Logo" className="imglogo" />
      <nav className="top-nav">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/support">Support</a>
        <a href="/teams">Teams</a>
      </nav>
      <div className="searchbar">
        <input type="text" placeholder="Search teammates..." />
      </div>
      <button className="toggle-btn" aria-label="Toggle Sidebar">&#9776;</button>
    </header>
  );
};

export default Header;
