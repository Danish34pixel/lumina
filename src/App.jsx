import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./componenets/Landing"; // Make sure this path is correct

// If Sparkle is needed inside Landing, use it there

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  );
}

export default App;
