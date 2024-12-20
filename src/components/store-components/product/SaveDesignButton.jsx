import React from "react";

const SaveDesignButton = ({ saveDesign }) => {
  return (
    <button
      onClick={saveDesign}
      style={{
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "20px",
      }}
    >
      Lưu mẫu áo
    </button>
  );
};

export default SaveDesignButton;
