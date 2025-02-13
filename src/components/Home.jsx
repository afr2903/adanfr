import React from "react";
import Typewriter from "typewriter-effect";
//import videobg from "../videos/home.mp4";

const Home = ({ classicHeader, darkTheme, handleNavClick }) => {
  return (
    <section id="home">
      <div className="hero-wrap">
        <div className="hero-mask opacity-8 bg-dark" />

        {/* ---------------image background------------------ */}
        {<div
          className="hero-bg parallax"
          style={{ backgroundImage: 'url("images/home-bg.JPG")' }}
  ></div>}

        {/* -------------------video background---------------------- */}

        {/*<div className="player hero-bg parallax">
          <video
            src={videobg}
            autoPlay
            muted
            loop
            style={{ width: "100%", height: "100vh", objectFit: "cover" }}
          ></video>
      </div>*/}

        <div className="hero-content section d-flex min-vh-100">
          <div className="container my-auto">
            <div className="row">
              <div className="col-12 text-center">
                <p className="text-7 fw-500 text-white mb-2 mb-md-3">Hi!</p>
                <h2 className="text-16 fw-600 text-white mb-2 mb-md-3">
                  <Typewriter
                    options={{
                      strings: [
                        "I'm Adán Flores",
                        "I'm a Researcher",
                        "I'm a AI and Software Engineer",
                        "I'm a Mechatronics Major",
                      ],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </h2>
                <p className="text-5 text-light mb-4">
                  from San Luis Potosí, México.
                </p>
                <a
                  href="#contact"
                  className="btn btn-outline-primary rounded-pill shadow-none smooth-scroll mt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("contact");
                  }}
                >
                  Hire Me
                </a>
              </div>
            </div>
          </div>
          <a
            href="#about"
            className="scroll-down-arrow text-white smooth-scroll"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("about");
            }}
          >
            <span className="animated">
              <i className="fa fa-chevron-down" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
