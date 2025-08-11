import React from "react";

const TermsAndConditions = ({ darkTheme }) => {
  return (
    <div
      id="terms-policy"
      className="modal fade"
      role="dialog"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        role="document"
      >
        <div
          className={
            "modal-content " + (darkTheme ? "bg-dark-2 text-light" : "")
          }
        >
          <div className="modal-header">
            <h5 className={"modal-title " + (darkTheme ? "text-white" : "")}>
              Terms &amp; Policy
            </h5>
            <button
              type="button"
              className={"btn-close " + (darkTheme ? "btn-close-white" : "")}
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body p-4">
            <p>
              Simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's standard dummy text ever since the
              1500s, when an unknown printer took a galley of type and scrambled
              it to make a type specimen book. It has survived not only five
              centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged.
            </p>
            <h3 className={"mb-3 mt-4 mt-4 " + (darkTheme ? "text-white" : "")}>
              Terms of Use
            </h3>
            <p>
              It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. Simply
              dummy text of the printing and typesetting industry.
            </p>
            <h5 className={"text-4 mt-4 " + (darkTheme ? "text-white" : "")}>
              Part I – Information Simone collects and controls
            </h5>
            <p>
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </p>
            <h5 className={"text-4 mt-4 " + (darkTheme ? "text-white" : "")}>
              Part II – Information that Simone processes on your behalf
            </h5>
            <p>
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </p>
            <h5 className={"text-4 mt-4 " + (darkTheme ? "text-white" : "")}>
              Part III – General
            </h5>
            <p>
              It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. Lorem
              Ipsum has been the industry's standard dummy text ever since the
              1500s, when an unknown printer took a galley of type and scrambled
              it to make a type specimen book.
            </p>
            <h3 className={"mb-3 mt-4 " + (darkTheme ? "text-white" : "")}>
              Privacy Policy
            </h3>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <ol className="lh-lg">
              <li>
                Lisque persius interesset his et, in quot quidam persequeris
                vim, ad mea essent possim iriure.
              </li>
              <li>
                Quidam lisque persius interesset his et, Lisque persius
                interesset his et, in quot quidam persequeris vim, ad mea essent
                possim iriure.
              </li>
              <li>
                In quot quidam persequeris vim, ad mea essent possim iriure.
                Quidam lisque persius interesset his et.
              </li>
              <li>
                Quidam lisque persius interesset his et, Lisque persius
                interesset his et.
              </li>
              <li>
                Interesset his et, Lisque persius interesset his et, in quot
                quidam persequeris vim, ad mea essent possim iriure.
              </li>
              <li>
                Persius interesset his et, Lisque persius interesset his et, in
                quot quidam persequeris vim, ad mea essent possim iriure.
              </li>
              <li>
                Quot quidam persequeris vim Quidam lisque persius interesset his
                et, Lisque persius interesset his et, in quot quidam persequeris
                vim, ad mea essent possim iriure.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
