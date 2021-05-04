import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import useMicCamTest from "../../hooks/useMicCamTest";
import { store } from "../../App";
import * as userDevices from "../../redux/userDevices/actions";
import { useSelector } from "react-redux";
import SwitchToggle from "../switchToggle/SwitchToggle";

function MicCamTest(props) {
  // Variables
  //==================================

  const { handleCloseModal } = props;
  const {
    Default_Audio_Active,
    Default_Video_Active,
    initAudioDev,
    initVideoDev,
    getDeviceErrorMessage,
  } = useSelector((state) => state.selectDeviceStatus);

  const {
    _videoElm,
    _audioMeter,
    _videoSelect,
    _audioSelect,
    noCamDevices,
    noMicDevices,
    handleChangeCam,
    handleChangeMic,
    hasStream,
    noDevices,
  } = useMicCamTest({
    initAudioDev,
    initVideoDev,
    Default_Audio_Active,
    Default_Video_Active,
  });

  // Methods
  //==================================
  const handleOnSubmit = () => {
    if (!getDeviceErrorMessage) {
      props.onSubmitTestDevice();
      store.dispatch(userDevices.submitDevices(true));
      handleCloseModal();
    }
  };

  const handleOnResetSetting = () => {
    localStorage.setItem("MicActivation", false);
    localStorage.setItem("CamActivation", false);
    store.dispatch(userDevices.activateMic(false));
    store.dispatch(userDevices.activateCam(false));
    props.onSubmitTestDevice();
    handleCloseModal();
  };

  const handleActivationMic = () => {
    store.dispatch(userDevices.activateMic(!Default_Audio_Active));
  };

  const handleActivationCam = () => {
    store.dispatch(userDevices.activateCam(!Default_Video_Active));
  };

  useEffect(() => {
    localStorage.setItem("MicActivation", Default_Audio_Active);
  }, [Default_Audio_Active]);

  useEffect(() => {
    localStorage.setItem("CamActivation", Default_Video_Active);
  }, [Default_Video_Active]);

  useEffect(() => {
    if (getDeviceErrorMessage || noDevices || noMicDevices) {
      store.dispatch(userDevices.activateMic(false));
    }
  }, []);

  // ## using createPortal feature of ReactJs to put this confirm modal above the component.  ## //
  // So we can put it where ever we need to reach the data ## //

  return (
    <>
      {ReactDOM.createPortal(
        <div className="micCamTest">
          <div
            onClick={(e) => e.stopPropagation()}
            className="micCamTest__modal"
          >
            <div className="micCamTest__header">
              <bdi className="micCamTest__header--first">
                <img src="webrtc.png" alt="webrtc" />
                <h5 className="micCamTest__header--welcome">
                  <>TEST YOUR MIC OR CAM</>
                </h5>
              </bdi>
              <p
                className={`micCamTest__header--subHeader ${
                  !noDevices &&
                  !hasStream &&
                  "micCamTest__header--subHeader--alert micCamTest__header--subHeader--alert--top"
                }`}
              >
                <bdi>
                  {!noDevices &&
                    (!hasStream
                      ? "Allow Access to cam and mic"
                      : "Try your cam and mic devices")}
                </bdi>
              </p>
            </div>

            <div className="micCamTest__testDevice">
              <div className="micCamTest__cam-select">
                <label
                  htmlFor="videoSource"
                  className={`micCamTest__toggle micCamTest--camIcon ${
                    getDeviceErrorMessage ||
                    noCamDevices ||
                    noDevices ||
                    !hasStream
                      ? "micCamTest__toggle micCamTest--camIcon--blockAccess"
                      : ""
                  }`}
                >
                  {/* <i className="fa fa-video-camera" aria-hidden="true" /> */}
                  <h6>Camera</h6>
                  <span className="micCamTest__switchToggle">
                    <SwitchToggle
                      name="camActivatex"
                      onClick={handleActivationCam}
                      checked={Default_Video_Active}
                      id="camActivatex"
                      disabled={
                        !!getDeviceErrorMessage ||
                        noDevices ||
                        noCamDevices ||
                        !hasStream
                      }
                    />
                  </span>
                </label>
                <div className="micCamTest__test-container micCamTest__test-container__mic-cam-deactive">
                  <video
                    className={`${Default_Video_Active ? "d-block" : "d-none"}`}
                    ref={_videoElm}
                    autoPlay={true}
                    muted={true}
                    playsInline
                  ></video>
                  <>
                    {!getDeviceErrorMessage && !noCamDevices && !noDevices && (
                      <p className="font-size-8px">Cam Disabled</p>
                    )}
                    {(noCamDevices || noDevices) && (
                      <p className="font-size-8px">No Cam Detected</p>
                    )}
                  </>
                </div>
                <p>Select Camera</p>
                <select
                  id="videoSource"
                  ref={_videoSelect}
                  onChange={handleChangeCam}
                  className={`micCamTest__cam-select--input ${
                    getDeviceErrorMessage ||
                    noCamDevices ||
                    noDevices ||
                    !hasStream
                      ? "micCamTest__cam-select--input--blockAccess"
                      : ""
                  }`}
                  disabled={
                    !!getDeviceErrorMessage ||
                    noDevices ||
                    noCamDevices ||
                    !hasStream
                  }
                >
                  {initVideoDev?.map((e, key) => {
                    return (
                      <option
                        key={key}
                        value={e.deviceId && e.deviceId}
                        className="font-family-roboto font-size-12px"
                      >
                        {e.label
                          ? e.label
                          : hasStream
                          ? `camera ${key + 1}`
                          : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="micCamTest__mic-select">
                <label
                  htmlFor="audioSource"
                  className={`micCamTest__toggle micCamTest--micIcon ${
                    getDeviceErrorMessage ||
                    noMicDevices ||
                    noDevices ||
                    !hasStream
                      ? "micCamTest__toggle micCamTest--micIcon--blockAccess"
                      : ""
                  }`}
                >
                  <h6>Microphone</h6>
                  <span className="micCamTest__switchToggle">
                    <SwitchToggle
                      name="micActivatex"
                      onClick={handleActivationMic}
                      checked={
                        !!getDeviceErrorMessage ||
                        noDevices ||
                        noMicDevices ||
                        !hasStream
                          ? false
                          : Default_Audio_Active
                      }
                      id="micActivatex"
                      disabled={
                        !!getDeviceErrorMessage ||
                        noDevices ||
                        noMicDevices ||
                        !hasStream
                      }
                    />
                  </span>
                </label>
                <div className="micCamTest__test-container micCamTest__test-container__mic-cam-deactive">
                  <>
                    {!getDeviceErrorMessage &&
                      !noMicDevices &&
                      !noDevices &&
                      (Default_Audio_Active ? (
                        <p className="font-size-8px">Speake to Test</p>
                      ) : (
                        <p className="font-size-8px">Mic Disabled</p>
                      ))}
                    {(noMicDevices || noDevices) && (
                      <p className="font-size-8px">No Mic Detected</p>
                    )}
                    {!getDeviceErrorMessage && !noMicDevices && !noDevices && (
                      <>
                        <canvas
                          ref={_audioMeter}
                          width="179"
                          height="8"
                          className={`${
                            Default_Audio_Active ? "d-block" : "d-none"
                          }`}
                        ></canvas>

                        <span
                          className={`${
                            !Default_Audio_Active
                              ? "micCamTest__fakeCanvas"
                              : "d-none"
                          }`}
                        ></span>
                      </>
                    )}
                  </>
                </div>
                <p>Select Mic</p>
                <select
                  id="audioSource"
                  ref={_audioSelect}
                  onChange={handleChangeMic}
                  className={`micCamTest__mic-select--input ${
                    getDeviceErrorMessage ||
                    noMicDevices ||
                    noDevices ||
                    !hasStream
                      ? "micCamTest__mic-select--input--blockAccess"
                      : ""
                  }`}
                  disabled={
                    !!getDeviceErrorMessage ||
                    noDevices ||
                    noMicDevices ||
                    !hasStream
                  }
                >
                  {initAudioDev?.map((e, key) => {
                    return (
                      <option key={key} value={e.deviceId && e.deviceId}>
                        {e.label
                          ? e.label
                          : hasStream
                          ? `microphone ${key + 1}`
                          : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <p className="micCamTest__header--subHeader--alert micCamTest__header--subHeader--alert--bottom">
              {!noDevices && !hasStream && (
                <bdi>After choose "Allow" you can check your device</bdi>
              )}
            </p>
            <div className="micCamTest__buttons">
              <button
                className={`micCamTest__buttons--accept ${!hasStream && ""}`}
                type="button"
                disabled={!!getDeviceErrorMessage || noDevices || !hasStream}
                onClick={handleOnSubmit}
              >
                Set Settings
              </button>
              <button
                className="micCamTest__buttons--deny"
                type="button"
                onClick={handleOnResetSetting}
              >
                Close and Set Off
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default MicCamTest;
