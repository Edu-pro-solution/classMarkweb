import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, TextField } from "@mui/material";

const Calculator = ({ open, onClose }) => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  const handleButtonClick = (value) => {
    if (value === "C") {
      setExpression("");
      setResult("");
    } else if (value === "=") {
      try {
        // eslint-disable-next-line no-eval
        const evalResult = eval(expression);
        setResult(evalResult);
      } catch (error) {
        setResult("Error");
      }
    } else {
      setExpression(expression + value);
    }
  };

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+",
    "C"
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Calculator</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          value={expression}
          placeholder="0"
          variant="outlined"
          margin="dense"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          fullWidth
          value={result}
          placeholder="Result"
          variant="outlined"
          margin="dense"
          InputProps={{
            readOnly: true,
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5px", marginTop: "10px" }}>
          {buttons.map((btn, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => handleButtonClick(btn)}
            >
              {btn}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Calculator;
