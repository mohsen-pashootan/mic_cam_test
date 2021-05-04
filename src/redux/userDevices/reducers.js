const initialState = {
  devicesSelected: false,
  noDeviceFound: false,
  Default_Video_Active:
    !!localStorage.getItem("CamActivation") &&
    localStorage.getItem("CamActivation") === "true"
      ? true
      : !!localStorage.getItem("CamActivation") &&
        localStorage.getItem("CamActivation") === "false"
      ? false
      : false,
  Default_Audio_Active:
    !!localStorage.getItem("MicActivation") &&
    localStorage.getItem("MicActivation") === "true"
      ? true
      : !!localStorage.getItem("MicActivation") &&
        localStorage.getItem("MicActivation") === "false"
      ? false
      : false,
  initAudioDev: [],
  initVideoDev: [],
  publisherErrorMessage: "",
  getDeviceErrorMessage: "",
  micCanvas: {},
};

const selectDeviceStatus = (state = initialState, action) => {
  switch (action.type) {
    case "DEVICE_SELECTED":
      let devicesSelected = action.payload;
      return { ...state, devicesSelected };
    case "ACTIVATE_CAM":
      return { ...state, Default_Video_Active: action.payload };
    case "ACTIVATE_MIC":
      return { ...state, Default_Audio_Active: action.payload };
    case "INIT_AUDIO_DEVICES":
      let AudioDevices = action.payload?.filter((dev) => dev.label !== "None");
      return { ...state, initAudioDev: AudioDevices };
    case "INIT_VIDEO_DEVICES":
      let VideoDevices = action.payload?.filter((dev) => dev.label !== "None");
      return { ...state, initVideoDev: VideoDevices };
    case "PUBLISHER_ERROR":
      return { ...state, publisherErrorMessage: action.payload };
    case "GET_DEVICE_ERROR":
      return { ...state, getDeviceErrorMessage: action.payload };
    case "NO_DEVICES_FOUND":
      return { ...state, noDeviceFound: action.payload };
    case "MIC_CANVAS_REF":
      return { ...state, micCanvas: action.payload };
    default: {
      return state;
    }
  }
};

export default selectDeviceStatus;
