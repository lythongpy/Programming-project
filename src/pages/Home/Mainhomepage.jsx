import { Link } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/homepage.css';
import '../../styles/style.css';
import '../../styles/styleguide.css';
// import '../../styles/index.css'; 
import React, { useState, useEffect, useRef } from "react";

import { FaFacebookF } from "react-icons/fa";

const MainHomepage = () => {
  const faqRef = useRef(null);
  const [faqVisible, setFaqVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setFaqVisible(true);
            observer.disconnect(); // only trigger once
          }
        },
        { threshold: 0.2 }
    );

    if (faqRef.current) {
      observer.observe(faqRef.current);
    }

    return () => {
      if (faqRef.current) observer.unobserve(faqRef.current);
    };
  }, []);


  const [date, setDate] = useState(new Date());

  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlideIn(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setFaqVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLogoVisible(true), 100); // short delay
    return () => clearTimeout(timer);
  }, []);

  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div>
      <div className="main-homepage">
        {/* Logo Navigation */}
        <div className="logo-box">
          <div className="logo-left">
            <img src="/image/img_logo.svg" alt="Logo" width={40} />
            <span className="navbar-title">Appointment Scheduler</span>
          </div>
          <div className="auth-buttons">
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-left">
            <img
                className={`hero-logo ${logoVisible ? "animate-logo" : ""}`}
                src="/image/img_logo.svg"
                alt="Main Logo"
            />

            <h1 className={`hero-heading ${textVisible ? "animate-fade" : ""}`}>
              #1 online scheduling website
            </h1>
            <p className={`hero-description ${textVisible ? "animate-fade" : ""}`}>
              Book your schedule for free. Fast booking service in less than 30 seconds
            </p>
            <Link
                to="/signup"
                className={`start-btn no-underline start-delayed ${textVisible ? "animate-fade" : ""}`}
            >
              Start now
            </Link>
          </div>


          <div className="hero-right calendar-fixed-width">
            <h3>Select a Date</h3>
            <div className="calendar-wrapper">
              <Calendar
                  onChange={setDate}
                  value={date}
                  className="calendar-box"
                  tileClassName={() => 'calendar-tile'}
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features">
          <div className={`feature ${slideIn ? "animate-slide" : ""}`}>
            <h3>Easy Scheduling</h3>
            <p>Streamline your booking process across all devices.</p>
          </div>
          <div className={`feature ${slideIn ? "animate-slide" : ""}`}>
            <h3>World wide Clients</h3>
            <p>Instant access to clients across the globe with one click.</p>
          </div>
          <div className={`feature ${slideIn ? "animate-slide" : ""}`}>
            <h3>Automatic Reminders</h3>
            <p>Send automatic email or SMS reminders before meetings.</p>
          </div>
          <div className={`feature ${slideIn ? "animate-slide" : ""}`}>
            <h3>No-wait</h3>
            <p>Fast response time thanks to high-speed hosting.</p>
          </div>
        </section>

        {/* FAQ Section */}
        <section ref={faqRef} className="faq">
          <h2>Frequently Asked Questions</h2>

          <div className={`faq-item ${faqVisible ? "animate-fade-left delay-1" : ""}`}>
            <h3>What integrations are available?</h3>
            <p>The software connects to Google Calendar, Zoom, Outlook, PayPal, and more.</p>
          </div>

          <div className={`faq-item ${faqVisible ? "animate-fade-left delay-2" : ""}`}>
            <h3>Can I accept payment for appointments?</h3>
            <p>Yes, via PayPal, Stripe, or online banking before the appointment is confirmed.</p>
          </div>

          <div className={`faq-item ${faqVisible ? "animate-fade-left delay-3" : ""}`}>
            <h3>Can I manually approve the booking?</h3>
            <p>Yes, enable the "require approval" option in your event settings.</p>
          </div>

          <div className={`faq-item ${faqVisible ? "animate-fade-left delay-4" : ""}`}>
            <h3>Can I customize the booking page?</h3>
            <p>NO!!</p>
          </div>

          <div className={`start-btn-container ${faqVisible ? "animate-fade-left delay-5" : ""}`}>
            <Link to="/login" className="start-btn no-underline">Start now</Link>
          </div>
        </section>
      </div>

      <footer className="footer">
        <hr />
        <div className="footer-grid">
          <div className="footer-section">
            <h3>Contact</h3>
            <ul>
              <li>
                <FaFacebookF className="fb-icon" />
                <a href="https://www.facebook.com/nam.phan.280704" target="_blank" rel="noopener noreferrer">Nam</a>
              </li>
              <li>
                <FaFacebookF className="fb-icon" />
                <a href="https://www.facebook.com/tgb.1107" target="_blank" rel="noopener noreferrer">Gia Bảo</a>
              </li>
              <li>
                <FaFacebookF className="fb-icon" />
                <a href="https://www.facebook.com/phan.bao.633083" target="_blank" rel="noopener noreferrer">Quốc Bảo</a>
              </li>
              <li>
                <FaFacebookF className="fb-icon" />
                <a href="https://www.facebook.com/le.ucanh.23592" target="_blank" rel="noopener noreferrer">Đức Anh</a>
              </li>
              <li>
                <FaFacebookF className="fb-icon" />
                <a href="https://www.facebook.com/le.bao.653926" target="_blank" rel="noopener noreferrer">Vĩnh Bảo</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3><Link to="/about" className="footer-link">About us</Link></h3>
          </div>
          <div className="footer-section">
            <h3>Term of Use</h3>
          </div>
          <div className="footer-section">
            <h3>Account</h3>
            <Link to="/register" className="footer-link">Sign up</Link>
            <Link to="/login" className="footer-link">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainHomepage;
