import React from "react";

export default function SwitchToggle(props) {
  return (
    <label className="toggle">
      <input
        className="toggle-checkbox"
        type="checkbox"
        disabled={props.disabled}
        name={props.name}
        checked={props.checked}
        onChange={props.onClick}
        id={`card-checkbox-${props.id}`}
      />
      <div className="toggle-switch"></div>
      {/* <span className="toggle-label">Wi-fi</span> */}
    </label>
  );
}
