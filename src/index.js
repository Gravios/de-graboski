import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
import { Game } from './game';

window.addEventListener("load", function () {
  const canvas = this.document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 400;

  const game = new Game(canvas.width, canvas.height);


  createRoot(document.getElementById("mocap")).render(<App />);
});
