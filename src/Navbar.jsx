import React from "react";
import { BrowserRouter, Route,  Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav>
  <div class="navbar">
    <i class="bx bx-menu"></i>
    <div class="logo">
      <a href="#justin"><img class="logo" src="img/hippocampus_cajal_white_filtered.png"alt="logo"/></a>
    </div>
    <div class="nav-links">
      <div class="sidebar-logo">
        <span class="logo-name">CodingLab</span>
        <i class="bx bx-x"></i>
      </div>
      <ul class="links">
        <li><a href="#justin">ABOUT ME</a></li>
        <li>
          <a href="#placefields">PHD THESIS</a>
          <i class="bx bxs-chevron-down htmlcss-arrow arrow"></i>
          <ul class="htmlCss-sub-menu sub-menu">
            <li><a href="#">Introduction</a></li>
            <li><a href="#">Navigation</a></li>
            <li><a href="#">Behavior</a></li>
            <li class="more">
              <span
                ><a href="#">Hippocampus</a>
                <i class="bx bxs-chevron-right arrow more-arrow"></i>
              </span>
              <ul class="more-sub-menu sub-menu">
                <li><a href="#">Anatomy</a></li>
                <li><a href="#">Function</a></li>
                <li><a href="#">Phase Precession</a></li>
              </ul>
            </li>
            {/* <li class="more">
                <span>
                    <a href="#">Place Cells</a>
                    <i class="bx bxs-chevron-right arrow more-arrow"></i>
                </span>
                <ul class="more-sub-menu sub-menu">
                    <li><a href="#">Remapping</a></li>
                    <li><a href="#">Phase Precession</a></li>
                </ul>
            </li> */}
            <li class="more">
              <span
                ><a href="thesis.html#justin">Place Cells</a>
                <i class="bx bxs-chevron-right arrow more-arrow"></i>
              </span>
              <ul class="more-sub-menu sub-menu">
                <li><a href="#">Place Fields</a></li>
                <li><a href="#">Remapping</a></li>
                <li><a href="#">Phase Precession</a></li>
              </ul>
            </li>
            <li class="more">
              <span
                ><a href="#motioncapture">Motion Capture</a>
                <i class="bx bxs-chevron-right arrow more-arrow"></i>
              </span>
              <ul class="more-sub-menu sub-menu">
                <li><a href="#">3D Trajectories</a></li>
                <li><a href="#">Annotation</a></li>
                <li><a href="#">Features</a></li>
              </ul>
            </li>
            {/*<!-- <li class="more">
              <span
                ><a href="#">More</a>
                <i class="bx bxs-chevron-right arrow more-arrow"></i>
              </span>
              <ul class="more-sub-menu sub-menu">
                <li><a href="#">Neumorphism</a></li>
                <li><a href="#">Pre-loader</a></li>
                <li><a href="#">Glassmorphism</a></li>
              </ul>
            </li> --> */}

          </ul>
        </li>
        {/*<!-- <li>
          <a href="#motioncapture">MOTION CAPTURE</a>
          <i class="bx bxs-chevron-down js-arrow arrow"></i>
          <ul class="js-sub-menu sub-menu">
            <li><a href="#">3D Trajectories</a></li>
            <li><a href="#">Annotation</a></li>
            <li><a href="#">Features</a></li>
          </ul>
        </li> -->*/}
        <li><a href="#">SOFTWARE</a></li>
        {/*<!-- <li><a href="#">CONTACT</a></li> -->*/}
      </ul>
    </div>
    {/*<!-- <div class="search-box">
      <i class="bx bx-search"></i>
      <div class="input-box">
        <input type="text" placeholder="Search..." />
      </div>
    </div> --> */}
    <a class="cta" href="#"><button>Contact</button></a>
  </div> 
</nav>
    );
};

