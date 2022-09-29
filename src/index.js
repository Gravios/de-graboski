import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home/Home.jsx";
import { Thesis } from "./pages/Thesis/Thesis.jsx";
import { NoPage } from "./pages/NoPage";

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
  // const canvas = document.getElementById('canvas1');
  // const ctx = canvas.getContext('2d');
  // canvas.width = 500;
  // canvas.height = 400;
  // const game = new Game(canvas.width, canvas.height);

  createRoot(document.getElementById("root")).render(<Site />);  
});
