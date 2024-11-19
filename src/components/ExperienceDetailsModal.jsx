import React, { useEffect, useRef } from "react";

import Slider from "react-slick";

const ExperienceDetailsModal = ({ darkTheme, experienceDetails }) => {
  const sliderRef = useRef();
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    adaptiveHeight: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <>
      <div
        className="modal fade bg-dark-1"
        id="expModal"
        tabIndex={-2}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div
            className={
              "modal-content " + (darkTheme ? "bg-dark-2 text-light" : "")
            }
          >
            <div className="modal-body">
              <button
                type="button"
                className={"btn-close " + (darkTheme ? "btn-close-white" : "")}
                data-bs-dismiss="modal"
                aria-label="Close"
              />
              <div
                className={
                  "container ajax-container " +
                  (darkTheme ? "bg-dark-2 text-light" : "")
                }
              >
                <h2
                  className={
                    "text-6 font-weight-600 text-center mb-4" +
                    (darkTheme ? " text-white" : "")
                  }
                >
                  {experienceDetails?.title}
                </h2>
                <div className="row g-4">
                  {
                  <div className="col-md-7">
                    <Slider {...settings} ref={sliderRef}>
                      <div className="item">
                        <img
                          className="img-fluid"
                          alt=""
                          src={experienceDetails?.thumbImage}
                        />
                      </div>
                      {experienceDetails?.sliderImages?.length > 0 &&
                        experienceDetails?.sliderImages?.map((image, index) => (
                          <div className="item" key={index}>
                            <img className="img-fluid" alt="" src={image} />
                          </div>
                        ))}
                    </Slider>
                  </div>
                  }
                  <div className="col-md-5">
                    <h4
                      className={
                        "text-4 font-weight-600" +
                        (darkTheme ? " text-white" : "")
                      }
                    >
                      Description:
                    </h4>
                      {experienceDetails?.desc.length > 0 &&
                        experienceDetails?.desc.map((bullet, index) => (
                          <p>{bullet}</p>
                        ))}
                    <h4
                      className={
                        "text-4 font-weight-600 mt-4" +
                        (darkTheme ? " text-white" : "")
                      }
                    >
                      Details:
                    </h4>
                    <ul
                      className={
                        "list-style-2 " + (darkTheme ? "list-style-light" : "")
                      }
                    >
                      <li>
                        <span
                          className={
                            "text-dark font-weight-600 me-2" +
                            (darkTheme ? " text-white" : "")
                          }
                        >
                          Organization:
                        </span>
                        {experienceDetails?.place}
                      </li>
                      <li>
                        <span
                          className={
                            "text-dark font-weight-600 me-2" +
                            (darkTheme ? " text-white" : "")
                          }
                        >
                          Period:
                        </span>
                        {experienceDetails?.yearRange}
                      </li>
                      <li>
                        <span
                          className={
                            "text-dark font-weight-600 me-2" +
                            (darkTheme ? " text-white" : "")
                          }
                        >
                          Location:
                        </span>
                        {experienceDetails?.location}
                      </li>
                      <li>
                        <span
                          className={
                            "text-dark font-weight-600 me-2" +
                            (darkTheme ? " text-white" : "")
                          }
                        >
                          Skills:
                        </span>
                        {experienceDetails?.skills}
                      </li>
                    </ul>
                    {/*
                    <div className="row no-gutters align-items-center">
                      <div
                        className={
                          "col-auto text-dark font-weight-600" +
                          (darkTheme ? " text-white" : "")
                        }
                      >
                        Share:
                      </div>
                      <div className="col-auto">
                        <ul
                          className={
                            "social-icons" +
                            (darkTheme ? " social-icons-muted" : "")
                          }
                        >
                          <li className="social-icons-facebook">
                            <a
                              data-toggle="tooltip"
                              href={experienceDetails?.socialLinks?.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-original-title="Facebook"
                            >
                              <i className="fab fa-facebook-f" />
                            </a>
                          </li>
                          <li className="social-icons-twitter">
                            <a
                              data-toggle="tooltip"
                              href={experienceDetails?.socialLinks?.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-original-title="Twitter"
                            >
                              <i className="fab fa-twitter" />
                            </a>
                          </li>
                          <li className="social-icons-google">
                            <a
                              data-toggle="tooltip"
                              href={experienceDetails?.socialLinks?.google}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-original-title="Google"
                            >
                              <i className="fab fa-google" />
                            </a>
                          </li>
                          <li className="social-icons-instagram">
                            <a
                              data-toggle="tooltip"
                              href={experienceDetails?.socialLinks?.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-original-title="Instagram"
                            >
                              <i className="fab fa-instagram" />
                            </a>
                          </li>
                          <li className="social-icons-email">
                            <a
                              data-toggle="tooltip"
                              href={experienceDetails?.socialLinks?.mail}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-original-title="Email"
                            >
                              <i className="fas fa-envelope" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                        */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperienceDetailsModal;
