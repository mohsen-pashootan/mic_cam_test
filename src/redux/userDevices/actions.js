export const submitDevices = (accept) => {
  return {
    type: "DEVICE_SELECTED",
    payload: accept,
  };
};

export const activateMic = (status) => {
  return {
    type: "ACTIVATE_MIC",
    payload: status,
  };
};

export const activateCam = (status) => {
  return {
    type: "ACTIVATE_CAM",
    payload: status,
  };
};

export const initAudioDevices = (audioDev) => {
  return {
    type: "INIT_AUDIO_DEVICES",
    payload: audioDev,
  };
};

export const initVideoDevices = (videoDev) => {
  return {
    type: "INIT_VIDEO_DEVICES",
    payload: videoDev,
  };
};

export const PublisherError = (message) => {
  return {
    type: "PUBLISHER_ERROR",
    payload: message,
  };
};

export const getDeviceError = (message) => {
  return {
    type: "GET_DEVICE_ERROR",
    payload: message,
  };
};

export const noInputDevicesFound = (status) => {
  return {
    type: "NO_DEVICES_FOUND",
    payload: status,
  };
};

export const micCanvasRef = (status) => {
  return {
    type: "MIC_CANVAS_REF",
    payload: status,
  };
};
