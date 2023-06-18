import React from "react";
import { Typography } from "@mui/material";
import { SentimentVeryDissatisfied } from "@mui/icons-material";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <SentimentVeryDissatisfied style={{ fontSize: "96px" }} />
      <Typography variant="h4">Page Not Found</Typography>
    </div>
  );
};

export default NotFound;
