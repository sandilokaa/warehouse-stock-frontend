import React from "react";
import NavbarGeneral from "../../components/navbar/Navbar";
import HeaderGeneral from "../../components/header/Header";

const HomeLayout = ({ children }) => {
    return (
        <>
            <div>
                <NavbarGeneral />
            </div>
            <div>
                <HeaderGeneral />
            </div>
            <div>
                {children}
            </div>
            {/* <div>
                <FooterGeneral />
            </div> */}
        </>
    );
};

export default HomeLayout;