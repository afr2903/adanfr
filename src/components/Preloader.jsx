import React from "react";

const PreLoader = () => {
  return (
    <div className="preloader">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default PreLoader;
