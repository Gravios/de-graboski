import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout } from "./Layout";
import { Home } from "./Home.jsx";
import { Thesis } from "./Thesis";

import "./styles.css";
import App from "./App";
import { Game } from './game';

export default function Site() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="thesis" element={<Thesis />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}


window.addEventListener("load", function () {
  const canvas = this.document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 400;

  const game = new Game(canvas.width, canvas.height);

  ReactDOM.render(<Site />, this.document.getElementById("root"));
  
  createRoot(document.getElementById("mocap")).render(<App />);
  
});
