// src/components/Map/Marker.jsx

import React from "react";
import PropTypes from "prop-types";

/**
 * Marker component to visually represent a player's claim on a hexagonal tile.
 *
 * @param {Object} props - Component props
 * @param {number} props.player - The player number (1 or 2)
 * @param {number} props.size - The size of the hexagon, used to scale the marker
 * @returns {React.Element} A SVG shape representing the player's marker
 */
const Marker = ({ player, size }) => {
  // Scale the marker size relative to the hexagon size
  const markerSize = size * 1;

  // Define player-specific styles
  const styles = {
    1: { fill: "#FF6B6B", stroke: "#FFF" },
    2: { fill: "#4ECDC4", stroke: "#FFF" },
  };

  const style = styles[player] || styles[1]; // Default to player 1 style if invalid player number

  return (
    <svg width={markerSize} height={markerSize} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" {...style} strokeWidth="5" />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="60"
        fill="white"
      >
        {player}
      </text>
    </svg>
  );
};

Marker.propTypes = {
  player: PropTypes.oneOf([1, 2]).isRequired,
  size: PropTypes.number.isRequired,
};

export default Marker;
