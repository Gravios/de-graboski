import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer"

export const Layout = () => {
    return (
        <>
            <div id="page-container">
                <div id="content-wrap">
                    <Navbar />
                    <Outlet />
                </div>
                <Footer />
            </div>
        </>
    );
};

