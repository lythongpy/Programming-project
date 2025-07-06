import { Link } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../../styles/homepage.css";
import "../../styles/style.css";
import "../../styles/styleguide.css";
import React, { useState, useEffect, useRef } from "react";
import { FaFacebookF } from "react-icons/fa";




const AboutUs = () => {

    // about us card
    const cardRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.4 }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);



    const ProfileCard = ({ role, name, id, likes, quote, image }) => (
        <div className="card">
            <div className="badge">{role}</div>
            <img className="avatar" src={image} alt={name} />
            <div className="info">
                <div className="name">Name: {name}</div>
                <div className="id">ID: {id}</div>
                <div className="likes">{likes}</div>
                <div className="quote">"{quote}"</div>
            </div>
        </div>
    );


    // Footer
    const footerRef = useRef(null);
    const [footerVisible, setFooterVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setFooterVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.4,
                rootMargin: "0px 0px -100px 0px"
            }
        );

        const target = footerRef.current;
        if (target) observer.observe(target);
        return () => {
        if (target) observer.unobserve(target);
        };
    }, []);



        return (
            <div>

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
                <div className="card-grid" ref={cardRef}>
                    <div className={`card-wrapper ${visible ? "slide-left" : ""}`}>
                        <ProfileCard role="Manager" name="Phan Thái Nam" id="16184" likes="Cổ đông Massage Melisa" quote="Đời không massage đời không nể." image="/image/Nam.jpg" />
                    </div>
                    <div className={`card-wrapper ${visible ? "slide-down" : ""}`}>
                        <ProfileCard role="DEV" name="Trần Gia Bảo" id="10421069" likes="Like Cocain and Fish" quote="Code is life, not me..." image="/image/GBao.jpg" />
                    </div>
                    <div className={`card-wrapper ${visible ? "slide-right" : ""}`}>
                        <ProfileCard role="DEV" name="Phan Lê Quốc Bảo" id="10421125" likes="Like Monster energy" quote="Monster Energy: fuel for bad decisions." image="/image/QBao.jpg" />
                    </div>
                    <div className={`card-wrapper ${visible ? "slide-left" : ""}`}>
                        <ProfileCard role="DEV" name="Lê Mạnh Đức Anh" id="10421003" likes="Simp Lỏ" quote="Meow ís the best" image="/image/DAnh.jpg" />
                    </div>
                    <div className={`card-wrapper ${visible ? "slide-right" : ""}`}>
                        <ProfileCard role="Dog" name="Lê Văn Vĩnh Bảo" id="10422012" likes="Like Treats" quote="WOOF" image="/image/LBao.jpg" />
                    </div>
                </div>







                {/* Footer */}
                <footer className={`footer ${footerVisible ? "animate-footer" : ""}`}
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
                        <Link to="/signup" className="footer-link">Sign up</Link><br/>
                        <Link to="/login" className="footer-link">Login</Link>
                    </div>
                </footer>

            </div>
        );
    };

    export default AboutUs;