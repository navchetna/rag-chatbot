import React from "react";
import Typography from "@mui/material/Typography";
import { diffChars } from "diff";

const one = "beep boop";
const other = "beep boob blah";

function DiffView() {
  const diff = diffChars(one, other);

  return (
    <div>
      {diff.map((part, index) => {
        let color = "inherit"; // Default color

        if (part.added) {
          color = "green"; // Color for additions
        } else if (part.removed) {
          color = "red"; // Color for deletions
        }

        return (
          <Typography
            key={index}
            display="inline"
            variant="inherit"
            style={{ color }}
          >
            {part.value}
          </Typography>
        );
      })}
    </div>
  );
}

export default DiffView;
