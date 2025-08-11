import React, { useEffect, useRef, useState } from "react";
import ExperienceDetailsModal from "./ExperienceDetailsModal";

const Resume = ({ classicHeader, darkTheme }) => {
  const [imagesLoaded, setimagesLoaded] = useState(0);
  const [selectedExperienceDetails, setSelectedExperienceDetails] = useState();
  const educationDetails = [
    {
      yearRange: "Aug. 2021 - June 2025",
      title: "B.S. in Mechatronics Engineering",
      place: "Tecnológico de Monterrey (ITESM)",
      src: "images/logos/tec.png",
      keypoints: "GPA: 95/100. Outstanding Student Award",
      desc: [
        <> Academic Scolarship holder, Robotics Research Team, Smart Factory. </>,
        <> <b>Relevant Coursework:</b> Programming of Data Structures and Algorithms, Industrial Automation, Automation of Manufacturing Systems </>
      ],
      location: "Monterrey, Mexico",
      skills: "Project Management, Teamwork, Leadership, SolidWorks, Matlab",
      thumbImage: "images/experiences/tec-imt-1.jpg",
    },
    {
      yearRange: "Aug. 2018 - May 2021",
      title: "Bicultural High School",
      place: "Tecnológico de Monterrey (ITESM)",
      src: "images/logos/tec.png",
      keypoints: "GPA: 93/10. Leadership 'Borrego de Oro'",
      desc: [
        <> FIRST Robotics Competition Alumni, Academic honorific mention, Leadership 'Borrego de Oro' winner. </>,
        <> <b>Relevant Coursework:/</b> CS50, AP Calculus, AP English </>
      ],
      location: "San Luis Potosi, Mexico",
      skills: "Teamwork, Leadership, International Affairs, Calculus",
      thumbImage: "images/experiences/tec-prepa-1.jpg",
    },
  ];

  const experienceDetails = [
    {
      yearRange: "Jan. 2025 - Present",
      title: "AI Engineer",
      place: "Pefai",
      src: "images/logos/pefai.jpg",
      keypoints: "Designing and building AI agent microservice",
      desc: [
        <> Optimized API creation with AI from N^2 to constant, by engineering 
        a parallel agent task distribution within the AI service, as measured 
        by total computing time </>,
      ],
      location: "Remote",
      skills: "Autogen, FastAPI, Unity, Python, Kotlin",
    },
    {
      yearRange: "Sep. 2024 - Dec. 2024",
      title: "AI & VR Research Intern",
      place: "Massachussets Institute of Technology",
      src: "images/logos/mit.png",
      keypoints: "Leading research project VIPER at FrED Factory",
      desc: [
        <> Industry 4.0 Research Immersion at FrED Factory from MIT Device 
        Realization Lab. </>,
        <> Leading a research project to enhance KPIs of factory operations, to 
        be published at journal <b>Production & Manufacturing Research</b>. 
        Involves a VR simulation, neural networks and a Small Language Model to 
        create an AI decision support system. </>,
        <> Fills research gaps in upper layers of automation pyramid</>
      ],
      location: "Cambridge, MA",
      skills: "Research writing, TensorFlow, Transformers, Unity, C#, Python",
      thumbImage: "images/experiences/mit-2.jpg", 
    },
    {
      yearRange: "June 2024 - Sep. 2024",
      title: "Software Engineer Intern",
      place: "Google - Cloud AI & Industry Solutions",
      src: "images/logos/google.jpg",
      keypoints: "Building data pipelines for Vertex AI Self Service team",
      desc: [
        <>  Developed core C++ components for a distributed data processing 
        pipeline, increasing data synchronization efficiency and contributing to
        improved search platform performance.</>,
        <> Optimized resource consumption for data ingestion processes by 
        refining critical C++ components and implementing rigorous SQL-based 
        end-to-end testing, leading to a more scalable and reliable data infrastructure.</>
      ],
      location: "Sunnyvale, CA",
      skills: "C++, Data Pipelines, Flume, SQL, Unit Testing, Product Launch Cycle",
      thumbImage: "images/experiences/google-1.jpeg",
    },
    {
      yearRange: "Jan. 2023 - May 2024",
      title: "Robotics Engineer Intern",
      place: "ITESM - Smart Factory",
      src: "images/logos/smart_factory.jpg",
      keypoints: "Leading a Cyber-Physical learning factory to be used as an education and research platform.",
      desc: [
        <>Led the technical development of a research paper for the Conference
        in Learning Factories.</>,
        <>Development and integration of a cyber-physical system using modular 
        manufacturing cells with cutting edge technology, such as, virtual reality,
        industrial robotics, computer vision and machine learning, for a controlled
        production environment. </>,
        <>Manager of the Virtual Reality area, creating digital twins of the 
        physical robots for real-time updates and remote usage.</>,
      ],
      location: "Monterrey, Mexico",
      skills: "Industrial Automation, Unity, Python, ROS, Project Management",
      thumbImage: "images/experiences/smart-factory-1.jpg",
    },
    {
      yearRange: "Aug. 2023 - Mar. 2024",
      title: "Software Engineer - AI Integration",
      place: "Ixmatix Robotics",
      src: "images/logos/ixmatix.jpg",
      keypoints: "Integrating AI features with Python and Elixir for a math learning platform",
      desc: [
        <>Developed and deployed a high-performance, real-time voice assistant 
        platform using Python, showcasing experience in building and deploying 
        AI-driven solutions and integrating with cloud services</>,
        <>Optimized the platform's response times, achieving a 25% reduction in 
        latency by implementing efficient data transfer techniques and 
        multithreading in Python, demonstrating a focus on performance optimization. </>,
      ],
      location: "Remote",
      skills: "Python, Elixir, LLMs, Speech generation, Cloud Services",
      thumbImage: "images/experiences/ixmatix-1.jpg",
    },
    {
      yearRange: "Nov. 2020 - Aug. 2023",
      title: "Unity Developer",
      place: "Catapulta Academy",
      src: "images/logos/catapulta.jpg",
      keypoints: "Developing an embedded video game for an educational platform in Unity3D for Web.",
      desc: [
        <>Developed and debugged complex game features within a resource-constrained 
        Unity environment, demonstrating proficiency in C#, Javascript, and 
        cross-platform development</>,
        <>Successfully reduced application load times by 80% through data-driven
        analysis and optimizations</>,
      ],
      location: "Remote",
      skills: "Unity, C#, Javascript, Game Development, React",
      thumbImage: "images/experiences/catapulta-1.png",
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
            Resume
          </h2>
          <p
            className={
              "text-9 text-dark fw-600 position-absolute w-100 align-self-center lh-base mb-0 " +
              (darkTheme ? "text-white" : "text-dark")
            }
          >
            {" "}
            My Experience
            <span className="heading-separator-line border-bottom border-3 border-primary d-block mx-auto" />
          </p>
        </div>
        {/* Heading end*/}
        <div className="row gx-5">
          {/* My Education */}
          <div className="portfolio popup-ajax-gallery">
          {/* My Experience */}
            <h2
              className={
                "text-6 fw-600 mb-4 " + (darkTheme ? "text-white" : "")
              } style={{textAlign: "center"}}
            >
              Work Experience
            </h2>
          <div className="col-12 d-flex flex-wrap gap-4 justify-content-center">
            {experienceDetails.length > 0 &&
              experienceDetails.map((value, index) => (
                <div
                  key={index}
                  className={
                    "bg-white col-md-5 rounded p-4 mb-1 " +
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

                    <div className="ms-3 mb-0">
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
            <h2
              className={
                "text-6 fw-600 mb-4 mt-4 " + (darkTheme ? "text-white" : "")
              } style={{textAlign: "center"}}
            >
              Education
            </h2>
          <div className="col-12 d-flex flex-wrap gap-4 justify-content-center">
            {educationDetails.length > 0 &&
              educationDetails.map((value, index) => (
                <div
                  key={index}
                  className={
                    "bg-white rounded p-4 col-md-5 mb-1 " +
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
                    <div className="ms-3 mb-0">
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
                "text-6 fw-600 mb-4 mt-4 " + (darkTheme ? "text-white" : "")
              } style={{textAlign: "center"}}
            >
              Technical Skills
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
