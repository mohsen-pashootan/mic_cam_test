import { useEffect, useRef, useState } from "react";
import { store } from "../App";
import { createAudioMeter } from "../components/micCamTest/volumeMeter";
import * as userDevices from "../redux/userDevices/actions";

export default function useMicCamTest({
  initAudioDev,
  initVideoDev,
  Default_Audio_Active,
  Default_Video_Active,
}) {
  const [hasStream, setHasStream] = useState();
  const [noDevices, setNoDevices] = useState(false);
  const [noCamDevices, setNoCamDevices] = useState(false);
  const [noMicDevices, setNoMicDevices] = useState(false);
  const _videoElm = useRef();
  const _audioMeter = useRef();
  const _audioSelect = useRef();
  const _videoSelect = useRef();
  const _videoDevices = useRef();
  const _audioDevices = useRef();

  let audioContext = null;
  let meter = null;
  let mediaStreamSource = null;
  const WIDTH = 500;
  const HEIGHT = 50;
  let rafID = null;
  let videoElement = _videoElm;
  let audioSelect = [_audioSelect];
  let videoSelect = [_videoSelect];
  let canvasContext = _audioMeter.current?.getContext("2d");
  store.dispatch(userDevices.micCanvasRef(canvasContext));
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();

  // useEffect(() => {
  //   videoSelect[0]?.current?.value
  //     ? setCamSelected(true)
  //     : setCamSelected(false);
  // }, [videoSelect]);

  const drawLoop = (time) => {
    // clear the background
    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

    // check if we're currently clipping
    if (meter.checkClipping()) canvasContext.fillStyle = "red";
    else canvasContext.fillStyle = "green";

    // draw a bar based on the current volume
    canvasContext.fillRect(0, 0, meter.volume * WIDTH * 1.4, HEIGHT);

    // set up the next visual callback
    rafID = window.requestAnimationFrame(drawLoop);
  };

  const getDevices = () => {
    // AFAICT in Safari this only gets default devices until gUM is called :/
    return navigator.mediaDevices.enumerateDevices();
  };

  const gotDevices = (deviceInfos = []) => {
    window.deviceInfos = deviceInfos; // make available to console
    deviceInfos.length > 0
      ? console.log("Available input and output devices:", deviceInfos)
      : console.log("No devices found!");
    const vidDev = deviceInfos.filter((dev) => dev.kind === "videoinput");
    _videoDevices.current = vidDev;
    store.dispatch(userDevices.initVideoDevices(vidDev));
    const audDev = deviceInfos.filter((dev) => dev.kind === "audioinput");
    _audioDevices.current = audDev;
    store.dispatch(userDevices.initAudioDevices(audDev));

    if (
      _videoDevices.current?.length === 0 &&
      _audioDevices.current?.length === 0
    ) {
      console.log("No Input Devices");
      setNoDevices(true);
      store.dispatch(userDevices.noInputDevicesFound(true));
    } else if (_videoDevices.current?.length === 0) {
      setNoCamDevices(true);
    } else if (_audioDevices.current?.length === 0) {
      setNoMicDevices(true);
    }
  };

  const gotStream = (stream) => {
    setHasStream(true);
    window.stream = stream; // make stream available to console
    videoElement.current.srcObject = stream ? stream : "";
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);
    drawLoop();
  };

  const handleError = (error) => {
    let message = String(error);
    if (
      message.includes("Permission denied") ||
      message.includes("NotAllowedError")
    ) {
      store.dispatch(userDevices.getDeviceError(message));
    }
    console.log("#Error:", error);
    console.log("#message:", message);
  };

  const getStream = async () => {
    if (window.stream) {
      await window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    const audioSource = audioSelect[0]?.current?.value;
    const videoSource = videoSelect[0]?.current?.value;

    localStorage.setItem("selectedMic", audioSource);
    localStorage.setItem("selectedCam", videoSource);
    const constraints = {
      audio: audioSource
        ? { deviceId: { exact: audioSource } }
        : _audioDevices.current?.length
        ? true
        : false,
      video: videoSource
        ? { deviceId: { exact: videoSource } }
        : _videoDevices.current?.length
        ? true
        : false,
    };

    return await navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotStream)
      .catch(handleError);
  };

  // getStream().then(getDevices).then(gotDevices);
  // getDevices().then(gotDevices).then(getStream);

  //#1 - first ask for allow useing devices
  useEffect(() => {
    // getStream();
    getDevices().then(gotDevices).then(getStream);
  }, []);

  //#2' Because IOS and Firefox do not support navigator.permissions.query or its camera enum we have to use a state
  useEffect(() => {
    if (hasStream) {
      store.dispatch(userDevices.activateMic(false));
      store.dispatch(userDevices.activateCam(false));
    }
  }, [hasStream]);

  //#3 - third after store updated once more call get stream
  useEffect(() => {
    if (initAudioDev && initVideoDev) getStream();
  }, [initAudioDev, initVideoDev]);

  const handleChangeCam = () => {
    getStream();
  };

  const handleChangeMic = () => {
    getStream();
  };

  return {
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
  };
}
