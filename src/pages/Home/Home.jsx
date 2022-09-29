import React from "react";
import App from "../../App";

export function Home() {
    return(
        <>
        <section id="justin">
          <div className="page-row">
            <div className="content-column">
              <div className="content-row"><div className="content-box"></div></div>
    
              {/* -----PROFILE----- */}
              <div className="content-row">
                <div className="content-box">
                  <img
                    className="profile-pic"
                    src="./img/portrait.png"
                    alt="Justin Graboski"
                  />
                </div>
                <div className="content-text">
                  <h1>
                    Neuroscience &<br />
                    Machine Learning<br />
                  </h1>
                </div>
                <div className="content-box">
                  {/* <!-- <img
                    className="profile"
                    src="./img/hippocampus_cajal_black.png"
                    alt=""
                  /> --> */}
                  <img className="profile-hex" src="./img/neuron-bg-img.png" alt="" />
                </div>
              </div>
    
              <div className="content-row"><div className="content-box"></div></div>
    
              {/* ----- action cards ----> */}
              <div className="content-row">
                <a href="#motioncapture" >
                  <img
                    className="card"
                    src="img/card-capture.png"
                    alt="Motion Capture"
                  />
                </a>
    
                <a href="#motioncapture">
                  <img
                    className="card"
                    src="img/card-annotate.png"
                    alt="Motion Capture"
                  />
                </a>
    
                <a href="#motioncapture">
                  <img
                    className="card"
                    src="img/card-analyze.png"
                    alt="Motion Capture"
                  />
                </a>
    
              </div>
              <div className="content-row">
                <a href="#motioncapture" >
                  <img
                    className="card"
                    src="img/card-implant.png"
                    alt="Motion Capture"
                  />
                </a>
    
                <a href="#motioncapture">
                  <img
                    className="card"
                    src="img/card-record.png"
                    alt="Motion Capture"
                  />
                </a>
    
                <a href="#motioncapture">
                  <img
                    className="card"
                    src="img/card-record.png"
                    alt="Motion Capture"
                  />
                </a>
    
              </div>
            </div>
    
            <div className="nav-column">
              <h2 className="nav-index">{'\u00A0'} 0001 Justin Graboski</h2>
            </div>
          </div>
        </section>
        {/* -----SPACE----- */}
        <section id="placefields">
          <div className="page-row">
            <div className="content-column">
              <h1>
                SPACE
              </h1>
              <p>How do we go from point A to point B with confidence?</p>
              <canvas id="canvas1"></canvas>
            </div>
    
            <img
              id="mocapCamera"
              className="animation-asset"
              src="./img/mocap_iso_down.png"
            />
    
            <div className="nav-column">
              <h2 className="nav-index">{'\u00A0'} 0002 Space</h2>
            </div>
          </div>
        </section>
    
        <section id="motioncapture">
          <div className="page-row">
            <div className="content-canvas" id="mocap">
                <App />
              </div>            
            <div className="nav-column">
              <h2 className="nav-index">{'\u00A0'} 0003 Motion Capture</h2>
            </div>
          </div>
        </section>
    
        {/*<!-- <section id="bayes">	
        <div className="row">
              <div className="content-column" id="bayesianDecoding" >
                <p>Add information about bayesian decoding.</p>
            </div>
            <div className="nav-column">
                <h2 className="nav-index">&nbsp0004 Bayesian Decoder</h2>
            </div>
        </div>
                </section> -->*/}

    </>
    );
}

