import React from 'react';
import './HomePage.css'; 
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <>
      {/* Top Info Bar */}
      <div className="top-info-bar">
        <p>
          If you have any questions or want to know more about our product, 
          schedule a free call with us now!
        </p>
        <button className="book-call-btn">Book A Discovery Call</button>
      </div>

      {/* Main Navigation */}
      <nav className="navbar">
        <div className="nav-left">
          {/* Logo or brand name */}
          <span className="nav-logo">MyWebApp</span>
        </div>

        <ul className="nav-links">
          <li>Home</li>
          <li>Customers</li>
          <li>Contact Us</li>
          <li>Enterprise</li>
          <li>Pricing</li>
          <li><Link to="/login?mode=login">Login</Link></li>
          <li>
          <Link to="/login?mode=register">
              <button className="signup-btn">Sign Up</button>
          </Link>
          </li>
        </ul>
      </nav>

      {/* Example main content */}
      <div className="home-content">
        <h1>Welcome to Our Appointment Scheduler</h1>
        <p>
          Simplify your booking process with our user-friendly platform!
        </p>
      </div>
    </>
  );
}

export default HomePage;
