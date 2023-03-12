import React from "react";
import STInput from "./components/inputs/dev-input";
import { Events } from "utils/events";

export default function UI(): JSX.Element {
  return (
    <div style={{ display: "flex", justifyContent: "end", padding: 15 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h3 style={{ textAlign: "center" }}>Dev UI</h3>
        <STInput event={Events.HERO_SPEED} label="hero speed" />
      </div>
    </div>
  );
}
