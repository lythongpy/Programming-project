import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/homepage.css";
import "../../styles/style.css";
import "../../styles/styleguide.css";
import React, { useState, useEffect, useRef } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaCalendarAlt, FaGlobeAmericas, FaBell, FaClock } from "react-icons/fa";



const MainHomepage = () => {
  const [date, setDate] = useState(new Date());

  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [faqVisible, setFaqVisible] = useState(false);

  const featureRef = useRef(null);
  const faqRef = useRef(null);


  // separate both feature and FAQ
  useEffect(() => {
    // Animate logo and heading
    setTimeout(() => setLogoVisible(true), 100);
    setTimeout(() => setTextVisible(true), 200);
  }, []);

  // feature
  useEffect(() => {
    const featureObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setFeaturesVisible(true);
            featureObserver.unobserve(entry.target);
          }
        },
        {
          threshold: 0.4,
          rootMargin: "0px 0px -150px 0px",
        }
    );

    // FAQ
    const faqObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setFaqVisible(true);
            faqObserver.unobserve(entry.target);
          }
        },
        {
          threshold: 0.5,
          rootMargin: "0px 0px -200px 0px",
        }
    );

    const featTarget = featureRef.current;
    const faqTarget  = faqRef.current;
    if (featTarget) featureObserver.observe(featTarget);
    if (faqTarget)  faqObserver.observe(faqTarget);

    return () => {
      if (featTarget) featureObserver.unobserve(featTarget);
      if (faqTarget)  faqObserver.unobserve(faqTarget);
    };
  }, []);

  // Footer
  const footerRef     = useRef(null);
  const [footerVisible, setFooterVisible] = useState(false);
  
  useEffect(() => {
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFooterVisible(true);
          footerObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -100px 0px" }
    );
  
    const footerTarget = footerRef.current;
    if (footerTarget) footerObserver.observe(footerTarget);
    return () => {
      if (footerTarget) footerObserver.unobserve(footerTarget);
    };
  }, []);



  return (
      <div>
        <div className="main-homepage">
          {/* Navbar */}
          <div className="logo-box">
            <Link to="/" className="logo-left" style={{ textDecoration: "none" }}>
              <img src="/image/img_logo.svg" alt="Logo" width={40} />
              <span className="navbar-title">Appointment Scheduler</span>
            </Link>
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
                    tileClassName={() => "calendar-tile"}
                />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section ref={featureRef} className="features">
            <div className={`feature ${featuresVisible ? "animate-slide" : ""}`}>
              <h3><FaCalendarAlt className="feature-icon" /> Easy Scheduling</h3>
              <p>Streamline your booking process across all devices.</p>
            </div>

            <div className={`feature ${featuresVisible ? "animate-slide" : ""}`}>
              <h3><FaGlobeAmericas className="feature-icon" /> World wide Clients</h3>
              <p>Instant access to clients across the globe with one click.</p>
            </div>

            <div className={`feature ${featuresVisible ? "animate-slide" : ""}`}>
              <h3><FaBell className="feature-icon" /> Automatic Reminders</h3>
              <p>Send automatic email or SMS reminders before meetings.</p>
            </div>

            <div className={`feature ${featuresVisible ? "animate-slide" : ""}`}>
              <h3><FaClock className="feature-icon" /> No-wait</h3>
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
              <Link to="/login" className="start-btn no-underline">
                Start now
              </Link>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer   className={`footer ${footerVisible ? "animate-footer" : ""}`}
                  ref={footerRef}>
          <div className="footer-section">
            <h3>Contact</h3>
            <ul>
              <li>
                <a href="https://www.facebook.com/nam.phan.280704" target="_blank" rel="noopener noreferrer" className="fb-link">
                  <FaFacebookF className="fb-icon" /> Nam
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/tgb.1107" target="_blank" rel="noopener noreferrer" className="fb-link">
                  <FaFacebookF className="fb-icon" /> Gia Bảo
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/phan.bao.633083" target="_blank" rel="noopener noreferrer" className="fb-link">
                  <FaFacebookF className="fb-icon" /> Quốc Bảo
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/le.ucanh.23592" target="_blank" rel="noopener noreferrer" className="fb-link">
                  <FaFacebookF className="fb-icon" /> Đức Anh
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/le.bao.653926" target="_blank" rel="noopener noreferrer" className="fb-link">
                  <FaFacebookF className="fb-icon" /> Vĩnh Bảo
                </a>
              </li>
            </ul>

          </div>

          <div className="footer-section">
            <h3><Link to="/AboutUs" className="footer-link">About us</Link></h3>
          </div>

          <div className="footer-section">
            <h3>Term of Use</h3>
            <p>© 2025 Appointment Scheduler</p>
          </div>

          <div className="footer-section">
            <h3>Account</h3>
            <Link to="/signup" className="footer-link">Sign up</Link><br />
            <Link to="/login" className="footer-link">Login</Link>
          </div>
        </footer>

      </div>
  );
};

export default MainHomepage;
