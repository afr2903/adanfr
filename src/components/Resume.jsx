import React, { useEffect, useRef, useState } from "react";
import ExperienceDetailsModal from "./ExperienceDetailsModal";

const Resume = ({ classicHeader, darkTheme }) => {
  const [imagesLoaded, setimagesLoaded] = useState(0);
  const [selectedExperienceDetails, setSelectedExperienceDetails] = useState();
  const educationDetails = [
    {
      yearRange: "2021 - 2025",
      title: "B.S. in Mechatronics Engineering",
      place: "Instituto Tecnológico y de Estudios Superiores de Monterrey (ITESM)",
      src: "images/logos/tec.png",
      desc: "Academic Scolarship holder, Robotics Research Team, Smart Factory. Relevant Coursework: Programming of Data Structures and Fundamental Algorithms, Object-Oriented Programming, Multi-Agent Systems with Computer Graphics, Industrial Automation",
    },
    {
      yearRange: "2018 - 2021",
      title: "Bicultural High School Diploma",
      place: "Instituto Tecnológico y de Estudios Superiores de Monterrey (ITESM)",
      src: "images/logos/tec.png",
      desc: "FIRST Robotics Competition Alumni, Academic honorific mention, Leadership 'Borrego de Oro' winner. Relevant Coursework: CS50, AP Calculus, AP English",
    },
  ];

  const experienceDetails = [
    {
      yearRange: "Sep 2024 - Dec 2024",
      title: "Incoming Research Intern",
      place: "Massachussets Institute of Technology - Device Realization Laboratory",
      src: "images/logos/mit.png",
      keypoints: "",
      desc: "Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
    },
    {
      yearRange: "Jun 2024 - Sep 2024",
      title: "Software Engineer Intern",
      place: "Google - Cloud AI",
      src: "images/logos/google.jpg",
      keypoints: "Vertex AI Self Service team. Developing parallel data processing pipelines in C++ to enhance data synchronization frequencies for clients.",
      desc: "Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
    },
    {
      yearRange: "Jan 2023 - Present",
      title: "Robotics Engineer & PM Intern",
      place: "ITESM - Smart Factory",
      src: "images/logos/smart_factory.jpg",
      keypoints: "Leading the development of a Cyber-Physical factory currently used by undergrad students and as a research project. Managing and assigning tasks to other interns in Automation, Robotics, VR and Computer vision.",
      desc: "Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
    },
    {
      yearRange: "Aug 2023 - March 2024",
      title: "Software Engineer - AI Integration",
      place: "Ixmatix Robotics",
      src: "images/logos/ixmatix.jpg",
      keypoints: "Developing AI features with Python and Elixir for the company's math learning platform, including a dynamic content generator and a real-time voice assistant tutor. Implementing Generative AI, Text-to-Speech and Speech generation models through APIs (OpenAI, Azure, ElevenLabs).",
      desc: "Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
    },
    {
      yearRange: "Dec 2023 - Present",
      title: "Freelance Software Engineer",
      place: "Scale AI",
      src: "images/logos/scaleai.jpg",
      keypoints: "Improving the performance of LLMs by providing full-stack, troubleshooting and deployment solutions to miscellaneous prompts, developing and testing in different frameworks and programming languages.",
      desc: "Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
    },
    {
      yearRange: "Sep 2022 - Present",
      title: "Team Leader & Software Developer",
      place: "ITESM - RoBorregos",
      src: "images/logos/roborregos.jpg",
      keypoints: "In charge of the internal organization of the university robotics team and handling public relations with the institution, sponsors and visitors. Developing software for different robotics areas (Behavior Integration, Manipulation, Control, etc.). Competing in national and international competitions.",
      desc: "Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
    },
    {
      yearRange: "Nov 2020 - Aug 2023",
      title: "Unity Developer",
      place: "Catapulta Academy",
      src: "images/logos/catapulta.jpg",
      keypoints: "Developing an embedded video game for an educational platform from concept to completion using Unity 3D. Implemented a synchronous communication structure from React functions to Unity",
      desc: "Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
    },
    {
      yearRange: "Jul 2021 - May 2022",
      title: "FIRST Robotics Competition Mentor",
      place: "ITESM - LamBot 3478",
      src: "images/logos/lambot.jpg",
      keypoints: "Teaching High school students about Object-Oriented Programming and Robotics Engineering for the international competition FIRST. Led the team task distribution & performance of the software area, promoting teamwork and STEM skills.",
      desc: "Lisque persius interesset his et, in quot quidam persequeris vim, ad mea essent possim iriure.",
    },
  ];

  const skills = [
    {
      name: "Web Design",
      percent: 65,
    },
    {
      name: "HTML/CSS",
      percent: 95,
    },
    {
      name: "JavaScript",
      percent: 80,
    },
    {
      name: "React JS",
      percent: 70,
    },
    {
      name: "Angular Js",
      percent: 60,
    },
    {
      name: "Bootstrap",
      percent: 99,
    },
  ];

  return (
    <>
    <section
      id="resume"
      className={"section " + (darkTheme ? "bg-dark-2" : "")}
    >
      <div className={"container " + (classicHeader ? "" : "px-lg-5")}>
        {/* Heading */}
        <div className="position-relative d-flex text-center mb-5">
          <h2
            className={
              "text-24  text-uppercase fw-600 w-100 mb-0 " +
              (darkTheme ? "text-muted opacity-1" : "text-light opacity-4")
            }
          >
            Summary
          </h2>
          <p
            className={
              "text-9 text-dark fw-600 position-absolute w-100 align-self-center lh-base mb-0 " +
              (darkTheme ? "text-white" : "text-dark")
            }
          >
            {" "}
            Resume
            <span className="heading-separator-line border-bottom border-3 border-primary d-block mx-auto" />
          </p>
        </div>
        {/* Heading end*/}
        <div className="row gx-5">
          {/* My Education */}
          <div className="portfolio popup-ajax-gallery">
          <div className="col-md-12">
            <h2
              className={
                "text-6 fw-600 mb-4 " + (darkTheme ? "text-white" : "")
              }
            >
              My Education
            </h2>
            {educationDetails.length > 0 &&
              educationDetails.map((value, index) => (
                <div
                  key={index}
                  className={
                    "bg-white rounded p-4 mb-4 " +
                    (darkTheme ? "bg-dark" : "bg-white border")
                  }
                >
                  <div className="d-flex align-items-center mt-auto mb-2">
                    <img
                      className="img-fluid rounded-circle border d-inline-block w-auto"
                      src={value.src}
                      alt=""
                      style={{ width: "50px", height: "50px"}}
                    />
                    <div className="ms-3 mb-0 col-md-8">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <p className="badge bg-primary text-2 fw-400 mb-0">
                            {value.yearRange}
                          </p>
                          <button className="btn btn-primary btn-rounded btn-sm shadow-none"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedExperienceDetails(educationDetails[index]);
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#expModal"
                            style={{
                              padding: ".15rem 0.5rem",
                              lineHeight: "1.25",
                              fontSize: "0.875rem",
                            }}
                          >
                          +
                          </button>
                        </div>
                        <h5 className={darkTheme ? "text-primary" : "text-danger"}>
                          {value.place}
                        </h5>
                    </div>
                  </div>
                        <h3 className={"text-5 " + (darkTheme ? "text-white" : "")}>
                          {value.title}
                        </h3>
                  <p className={"mb-0 " + (darkTheme ? "text-white-50" : "")}>
                    {value.desc}
                  </p>
                </div>
              ))}
          </div>
          {/* My Experience */}
          <div className="col-md-12">
            <h2
              className={
                "text-6 fw-600 mb-4 " + (darkTheme ? "text-white" : "")
              }
            >
              My Experience
            </h2>
            {experienceDetails.length > 0 &&
              experienceDetails.map((value, index) => (
                <div
                  key={index}
                  className={
                    "bg-white  rounded p-4 mb-4 " +
                    (darkTheme ? "bg-dark" : "bg-white border")
                  }
                >
                  <div className="d-flex align-items-center mt-auto mb-2">
                    <img
                      className="img-fluid rounded-circle border d-inline-block w-auto"
                      src={value.src}
                      alt=""
                      style={{ width: "50px", height: "50px"}}
                    />

                    <div className="ms-3 mb-0 col-md-8">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <p className="badge bg-primary text-2 fw-400 mb-0">
                            {value.yearRange}
                          </p>
                          <button className="btn btn-primary btn-rounded btn-sm shadow-none"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedExperienceDetails(experienceDetails[index]);
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#expModal"
                            style={{
                              padding: ".15rem 0.5rem",
                              lineHeight: "1.25",
                              fontSize: "0.875rem",
                            }}
                          >
                          +
                          </button>
                        </div>
                        <h5 className={darkTheme ? "text-primary" : "text-danger"}>
                          {value.place}
                        </h5>
                    </div>
                  </div>
                        <h3 className={"text-5 " + (darkTheme ? "text-white" : "")}>
                          {value.title}
                        </h3>
                  <p className={"mb-0 " + (darkTheme ? "text-white-50" : "")}>
                    {value.keypoints}
                  </p>
                </div>
              ))}
          </div>
        </div>


        <div className="row gx-5">
          <div className="portfolio popup-ajax-gallery">
          <div className="col-md-12">
            <h2
              className={
                "text-6 fw-600 mb-4 " + (darkTheme ? "text-white" : "")
              }
            >
              My Skills
            </h2>
                <div
                  className={
                    "bg-white  rounded p-4 mb-4 " +
                    (darkTheme ? "bg-dark" : "bg-white border")
                  }
                >
                        <h3 className={"text-5 " + (darkTheme ? "text-white" : "")}>
                        Programming Languages
                        </h3>
                        <br></br>
                  <p className={"mb-0 " + (darkTheme ? "text-white-50" : "")} align="left">
                    <a href="https://skillicons.dev" rel="noreferrer noopener" target="_blank">
                      <img src="https://skillicons.dev/icons?i=cpp" style={{marginRight: "5px"}} alt="cpp"/>
                    </a>
                      <img src="https://skillicons.dev/icons?i=py" style={{marginRight: "5px"}} alt="py"/>
                      <img src="https://skillicons.dev/icons?i=java" style={{marginRight: "5px"}} alt="java"/>
                      <img src="https://skillicons.dev/icons?i=js" style={{marginRight: "5px"}} alt="js"/>
                      <img src="https://skillicons.dev/icons?i=cs" style={{marginRight: "5px"}} alt="cs"/>
                      <img src="https://skillicons.dev/icons?i=c" style={{marginRight: "5px"}} alt="c"/>
                      <img src="https://skillicons.dev/icons?i=elixir" style={{marginRight: "5px"}} alt="elixir"/>
                      <img src="https://skillicons.dev/icons?i=latex" style={{marginRight: "5px"}} alt="latex"/>
                      <img src="https://skillicons.dev/icons?i=matlab" style={{marginRight: "5px"}} alt="matlab"/>
                      <img src="https://skillicons.dev/icons?i=php" style={{marginRight: "5px"}} alt="php"/>
                  </p>
                </div>
                <div
                  className={
                    "bg-white  rounded p-4 mb-4 " +
                    (darkTheme ? "bg-dark" : "bg-white border")
                  }
                >
                        <h3 className={"text-5 " + (darkTheme ? "text-white" : "")}>
                        Technologies
                        </h3>
                        <br></br>
                  <p className={"mb-0 " + (darkTheme ? "text-white-50" : "")} align="left">
                    <a href="https://skillicons.dev" rel="noreferrer noopener" target="_blank">
                      <img src="https://skillicons.dev/icons?i=ros" style={{marginRight: "5px"}} alt="ros"/>
                    </a>
                      <img src="https://skillicons.dev/icons?i=opencv" style={{marginRight: "5px"}} alt="opencv"/>
                      <img src="https://skillicons.dev/icons?i=gcp" style={{marginRight: "5px"}} alt="gcp"/>
                      <img src="https://skillicons.dev/icons?i=tensorflow" style={{marginRight: "5px"}} alt="tensorflow"/>
                      <img src="https://skillicons.dev/icons?i=unity" style={{marginRight: "5px"}} alt="unity"/>
                      <img src="https://skillicons.dev/icons?i=sklearn" style={{marginRight: "5px"}} alt="sklearn"/>
                      <img src="https://skillicons.dev/icons?i=pytorch" style={{marginRight: "5px"}} alt="pytorch"/>
                      <img src="https://skillicons.dev/icons?i=git" style={{marginRight: "5px"}} alt="git"/>
                      <img src="https://skillicons.dev/icons?i=docker" style={{marginRight: "5px"}} alt="docker"/>
                      <img src="https://skillicons.dev/icons?i=linux" style={{marginRight: "5px"}} alt="linux"/>
                      <img src="https://skillicons.dev/icons?i=arduino" style={{marginRight: "5px"}} alt="arduino"/>
                      <img src="https://skillicons.dev/icons?i=raspberrypi" style={{marginRight: "5px"}} alt="raspberrypi"/>
                      <img src="https://skillicons.dev/icons?i=html" style={{marginRight: "5px"}} alt="html"/>
                      <img src="https://skillicons.dev/icons?i=laravel" style={{marginRight: "5px"}} alt="laravel"/>
                      <img src="https://skillicons.dev/icons?i=anaconda" style={{marginRight: "5px"}} alt="anaconda"/>
                      <img src="https://skillicons.dev/icons?i=blender" style={{marginRight: "5px"}} alt="blender"/>
                      <img src="https://skillicons.dev/icons?i=bash" style={{marginRight: "5px"}} alt="bash"/>
                      <img src="https://skillicons.dev/icons?i=vscode" style={{marginRight: "5px"}} alt="vscode"/>
                  </p>
                </div>
              </div>
            </div>
        </div>


        </div>
        <div className="text-center mt-5">
          <a
            className="btn btn-outline-secondary rounded-pill shadow-none"
            href={"https://adanfr.com/Adan_Flores_resume.pdf"}
            download
          >
            Download CV
            <span className="ms-1">
              <i className="fas fa-download" />
            </span>
          </a>
        </div>
      </div>
    </section>
      <div className="experience-details-modal">
        {/* Modal */}
        <ExperienceDetailsModal
          experienceDetails={selectedExperienceDetails}
          darkTheme={darkTheme}
        ></ExperienceDetailsModal>
      </div>
    </>
  );
};

export default Resume;
