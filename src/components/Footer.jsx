import React from "react";

const Footer = ({ classicHeader, darkTheme, handleNavClick }) => {
  return (
    <footer
      id="footer"
      className={"section " + (darkTheme ? "footer-dark bg-dark-1" : "")}
    >
      <div className={"container " + (classicHeader ? "" : "px-lg-5")}>
        <div className="row">
          <div className="col-lg-6 text-center text-lg-start">
            <p className="mb-3 mb-lg-0">
              Adán Flores Ramírez
            </p>
          </div>
          <div className="col-lg-6">
            <ul className="nav nav-separator justify-content-center justify-content-lg-end">
              <li className="nav-item">
              </li>
              <li className="nav-item">
                Last Update: February 12, 2025
              </li>
            </ul>
          </div>
          {/*
          <div className="col-lg-6">
            <ul className="nav nav-separator justify-content-center justify-content-lg-end">
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="modal"
                  data-bs-target="#terms-policy"
                  href="#terms-policy"
                >
                  Terms &amp; Policy
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="modal"
                  data-bs-target="#disclaimer"
                  href="#disclaimer"
                >
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
              */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
