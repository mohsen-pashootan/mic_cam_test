import React, { useEffect, useRef, useState } from "react";
import MicCamTest from "../../components/micCamTest/micCamTest";
import { useSelector } from "react-redux";
import useMicCamTest from "./../../hooks/useMicCamTest";

export default function Home() {
  const [modalTest, setModaltest] = useState(false);
  const { initAudioDev, initVideoDev } = useSelector(
    (state) => state.selectDeviceStatus
  );
  const { _audioMeter } = useMicCamTest({ initAudioDev, initVideoDev });
  const homeVideo = useRef();

  const handleTestModalActivate = () => {
    setModaltest(!modalTest);
  };

  const handleCloseModal = () => {
    setModaltest(false);
  };

  const handleSubmitTestDevice = () => {
    const videoStream = window.stream;
    homeVideo.current.srcObject = videoStream ? videoStream : "";
  };
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
        ref={homeVideo}
        id={localStorage.getItem("selectedCam")}
      />
      <canvas
        ref={_audioMeter}
        width="179"
        height="8"
        className="c-main__canvas"
      ></canvas>
      {modalTest && (
        <MicCamTest
          onSubmitTestDevice={handleSubmitTestDevice}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
}
