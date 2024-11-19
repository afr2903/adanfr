import React, { useState } from "react";
import { Tooltip } from "./Tooltip";
import { Link } from "react-scroll";

const Header = ({ classicHeader, darkTheme, homeRef, handleNavClick }) => {
  const [isNavModalClose, setIsNavModalClose] = useState(true);
  return (
    <header id="header" className="sticky-top">
      {/* Navbar */}
      <nav className="primary-menu navbar navbar-expand-lg navbar-dark bg-dark border-bottom-0">
        <div className="container-fluid position-relative h-100 flex-lg-column ps-3 px-lg-3 pt-lg-3 pb-lg-2">
          {/* Logo */}
          <Link
            smooth
            duration={500}
            style={{ cursor: "pointer" }}
            to="home"
            className="mb-lg-auto mt-lg-4"
            onClick={(e) => {
              e.preventDefault();
              setIsNavModalClose(true);
            }}
          >
            <span className="bg-dark-2 rounded-pill p-2 mb-lg-1 d-none d-lg-inline-block">
              <img
                className="img-fluid rounded-pill d-block"
                src="images/me_boston.jpg"
                title="I'm Adán"
                alt="profile"
              />
            </span>
            <h1 className="text-5 text-white text-center mb-0 d-lg-block">
              Adán Flores
            </h1>
          </Link>
          {/* Logo End */}
          <div
            id="header-nav"
            className={
              isNavModalClose
                ? "collapse navbar-collapse w-100 my-lg-auto "
                : "show navbar-collapse w-100 my-lg-auto"
            }
          >
            <ul className="navbar-nav text-lg-center my-lg-auto py-lg-3">
              <li className="nav-item">
                <Link
                  target={homeRef}
                  className="nav-link "
                  smooth
                  duration={500}
                  style={{ cursor: "pointer" }}
                  activeClass="active"
                  spy
                  to="home"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsNavModalClose(true);
                  }}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link "
                  smooth
                  duration={500}
                  style={{ cursor: "pointer" }}
                  activeClass="active"
                  spy
                  to="about"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsNavModalClose(true);
                  }}
                >
                  About Me
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link "
                  smooth
                  duration={500}
                  style={{ cursor: "pointer" }}
                  activeClass="active"
                  spy
                  to="services"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsNavModalClose(true);
                  }}
                >
                  What I Do
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link "
                  smooth
                  duration={500}
                  style={{ cursor: "pointer" }}
                  activeClass="active"
                  spy
                  to="resume"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsNavModalClose(true);
                  }}
                >
                  Resume
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link "
                  smooth
                  duration={500}
                  style={{ cursor: "pointer" }}
                  activeClass="active"
                  spy
                  to="portfolio"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsNavModalClose(true);
                  }}
                >
                  Portfolio
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link "
                  smooth
                  duration={500}
                  style={{ cursor: "pointer" }}
                  activeClass="active"
                  spy
                  to="testimonial"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsNavModalClose(true);
                  }}
                >
                  Testimonial
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link "
                  smooth
                  duration={500}
                  style={{ cursor: "pointer" }}
                  activeClass="active"
                  spy
                  to="contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsNavModalClose(true);
                  }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <ul className="social-icons social-icons-muted social-icons-sm mt-lg-auto ms-auto ms-lg-0 d-flex">
            <li className="social-icons-facebook">
              <Tooltip text="Facebook" placement="top">
                <a
                  href="http://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook-f" />
                </a>
              </Tooltip>
            </li>
            <li className="social-icons-twitter">
              <Tooltip text="Twitter" placement="top">
                <a
                  href="http://www.twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-twitter" />
                </a>
              </Tooltip>
            </li>
            <li className="social-icons-dribbble">
              <Tooltip text="Dribbble" placement="top">
                <a
                  href="http://www.dribbble.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-dribbble" />
                </a>
              </Tooltip>
            </li>
            <li className="social-icons-github">
              <Tooltip text="Google" placement="top">
                <a
                  href="http://www.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-github" />
                </a>
              </Tooltip>
            </li>
          </ul>
          <button
            onClick={(e) => {
              setIsNavModalClose(!isNavModalClose);
            }}
            className={
              isNavModalClose ? "navbar-toggler" : "navbar-toggler show"
            }
            id="navbar-toggler"
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      {/* Navbar End */}
    </header>
  );
};

export default Header;
