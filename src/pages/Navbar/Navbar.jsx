import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
    <header>
      <nav>
        <div className="navbar">
          <i className="bx bx-menu"></i>
          <div className="logo">
            <a href="#justin">
              <img
                className="logo"
                src="img/hippocampus_cajal_white_filtered.png"
                alt="logo"
              />
            </a>
          </div>
          <div className="nav-links">
            <div className="sidebar-logo">
              <span className="logo-name">CodingLab</span>
              <i className="bx bx-x"></i>
            </div>
            <ul className="links">
              <li>
                <a href="/#justin">ABOUT ME</a>
              </li>
              <li>
                <a href="/thesis">PHD THESIS</a>
                <i className="bx bxs-chevron-down htmlcss-arrow arrow"></i>
                <ul className="htmlCss-sub-menu sub-menu">
                  <li>
                    <a href="/thesis#intro">Introduction</a>
                  </li>
                  <li>
                    <a href="/thesis#nav">Navigation</a>
                  </li>
                  <li>
                    <a href="/thesis#bhv">Behavior</a>
                  </li>
                  <li className="more">
                    <span>
                      <a href="#">Hippocampus</a>
                      <i className="bx bxs-chevron-right arrow more-arrow"></i>
                    </span>
                    <ul className="more-sub-menu sub-menu">
                      <li>
                        <a href="#">Anatomy</a>
                      </li>
                      <li>
                        <a href="#">Function</a>
                      </li>
                      <li>
                        <a href="#">Phase Precession</a>
                      </li>
                    </ul>
                  </li>
                  {/* <li className="more">
                <span>
                    <a href="#">Place Cells</a>
                    <i className="bx bxs-chevron-right arrow more-arrow"></i>
                </span>
                <ul className="more-sub-menu sub-menu">
                    <li><a href="#">Remapping</a></li>
                    <li><a href="#">Phase Precession</a></li>
                </ul>
            </li> */}
                  <li className="more">
                    <span>
                      <a href="thesis.html#justin">Place Cells</a>
                      <i className="bx bxs-chevron-right arrow more-arrow"></i>
                    </span>
                    <ul className="more-sub-menu sub-menu">
                      <li>
                        <a href="#">Place Fields</a>
                      </li>
                      <li>
                        <a href="#">Remapping</a>
                      </li>
                      <li>
                        <a href="#">Phase Precession</a>
                      </li>
                    </ul>
                  </li>
                  <li className="more">
                    <span>
                      <a href="#motioncapture">Motion Capture</a>
                      <i className="bx bxs-chevron-right arrow more-arrow"></i>
                    </span>
                    <ul className="more-sub-menu sub-menu">
                      <li>
                        <a href="#">3D Trajectories</a>
                      </li>
                      <li>
                        <a href="#">Annotation</a>
                      </li>
                      <li>
                        <a href="#">Features</a>
                      </li>
                    </ul>
                  </li>
                  {/*<!-- <li className="more">
              <span
                ><a href="#">More</a>
                <i className="bx bxs-chevron-right arrow more-arrow"></i>
              </span>
              <ul className="more-sub-menu sub-menu">
                <li><a href="#">Neumorphism</a></li>
                <li><a href="#">Pre-loader</a></li>
                <li><a href="#">Glassmorphism</a></li>
              </ul>
            </li> --> */}
                </ul>
              </li>
              {/*<!-- <li>
          <a href="#motioncapture">MOTION CAPTURE</a>
          <i className="bx bxs-chevron-down js-arrow arrow"></i>
          <ul className="js-sub-menu sub-menu">
            <li><a href="#">3D Trajectories</a></li>
            <li><a href="#">Annotation</a></li>
            <li><a href="#">Features</a></li>
          </ul>
        </li> -->*/}
              <li>
                <a href="#">SOFTWARE</a>
              </li>
              {/*<!-- <li><a href="#">CONTACT</a></li> -->*/}
            </ul>
          </div>
          {/*<!-- <div className="search-box">
      <i className="bx bx-search"></i>
      <div className="input-box">
        <input type="text" placeholder="Search..." />
      </div>
    </div> --> */}
          <a className="cta" href="#">
            <button>Contact</button>
          </a>
        </div>
      </nav>
      </header>
      <div><h1 className="header-space"></h1></div>
    </>
  );
}
