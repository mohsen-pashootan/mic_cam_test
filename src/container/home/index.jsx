import React, { useState } from "react";
import MicCamTest from "../../components/micCamTest/micCamTest";

export default function Home() {
  const [modalTest, setModaltest] = useState(false);

  const handleTestModalActivate = () => {
    setModaltest(!modalTest);
  };

  const handleCloseModal = () => {
    setModaltest(false);
  };

  const handleSubmitTestDevice = () => {};
  return (
    <div className="c-main">
      <header className="c-main__header">
        Click the Button to test your Mic or Cam device
      </header>
      <button className="c-main__button" onClick={handleTestModalActivate}>
        Test MicCam
      </button>

      <video
        className="c-main__video"
        autoPlay={true}
        muted={true}
        id={localStorage.getItem("selectedCam")}
      />
      {modalTest && (
        <MicCamTest
          onSubmitTestDevice={handleSubmitTestDevice}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
}
