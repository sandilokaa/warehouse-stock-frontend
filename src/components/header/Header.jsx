import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Container,
    Button
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/css/style.css";
import axios from "axios";


const HeaderGeneral = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const { pathname } = location;

    const splitLocation = pathname.split("/");

    /* -------------------- Current Admin -------------------- */

    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [admin, setAdmin] = useState({});
    const [isRefresh, setIsRefresh] = useState(false);

    useEffect(() => {

        const validateLogin = async () => {

            try {

                const token = localStorage.getItem("token");

                const currentAdminRequest = await axios.get(
                    `http://localhost:2000/v1/auth/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const currentAdminResponse = currentAdminRequest.data;

                if (currentAdminResponse.status) {

                    setAdmin(currentAdminResponse.data.admin);

                }

            } catch (err) {

                setIsLoggedIn(false);

            }

        };

        validateLogin();

        setIsRefresh(false);

    }, [isRefresh]);

    /* -------------------- End Current Admin -------------------- */
    

    return isLoggedIn ? (

        // <HomeLayout>
        <>

            {/* ------------------- Header Content -------------------  */}

            <div id="header-warehouse-content">
                <Container>
                    <div className="header-warehouse-greetings">
                        <Row>
                            <Col className="col-12 col-lg-12">
                                <h1> Welcome Back, {admin.name} </h1>
                                <p> Here’s what’s happening with your store today. </p>
                            </Col>
                        </Row>
                    </div>
                    <div className="header-choose-analytics">
                        <Row>
                            <Col className="col-4 col-lg-2">
                                <Button className={splitLocation[1] === "" ? "active" : "btn-choose-analytics"} onClick={() => navigate(`/`)}> Overview </Button>
                            </Col>
                            <Col className="col-4 col-lg-2">
                                <Button className={splitLocation[1] === "products-data" ? "active" : "btn-choose-analytics"} onClick={() => navigate(`/products-data`)}> Products </Button>
                            </Col>
                            <Col className="col-4 col-lg-2">
                                <Button className={splitLocation[1] === "categories-data" ? "active" : "btn-choose-analytics"} onClick={() => navigate(`/categories-data`)}> Categories </Button>
                            </Col>
                            <Col className="col-4 col-lg-2">
                                <Button className={splitLocation[1] === "sellings-data" ? "active" : "btn-choose-analytics"} onClick={() => navigate(`/sellings-data`)}> Selling </Button>
                            </Col>
                            <Col className="col-4 col-lg-2">
                                <Button className={splitLocation[1] === "reports-data" ? "active" : "btn-choose-analytics"} onClick={() => navigate(`/reports-data`)}> Report </Button>
                            </Col>
                        </Row>
                    </div>
                    <hr />
                </Container>
            </div>

            {/* ------------------- End Header Content -------------------  */}

        </>

        // </HomeLayout>

    ) : ( navigate("/login") );

};

export default HeaderGeneral;

