import React from "react";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "#FFFFFF",
  };

  return (
    <div style={styles} className="die" onClick={props.holdDice}>
      <h5>{props.value}</h5>
    </div>
  );
}
