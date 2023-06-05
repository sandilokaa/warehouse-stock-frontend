import React from "react";
import {
    Row,
    Col,
    Container,
    Button
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/css/style.css";


const HeaderGeneral = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const { pathname } = location;

    const splitLocation = pathname.split("/");

    return (

        // <HomeLayout>
        <>

            {/* ------------------- Header Content -------------------  */}

            <div id="header-warehouse-content">
                <Container>
                    <div className="header-warehouse-greetings">
                        <Row>
                            <Col className="col-12 col-lg-12">
                                <h1> Welcome Back, John Doe </h1>
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
                                <Button className={splitLocation[1] === "sellings-data" ? "active" : "btn-choose-analytics"} onClick={() => navigate(`/sellings-data`)}> Selling </Button>
                            </Col>
                        </Row>
                    </div>
                    <hr />
                </Container>
            </div>

            {/* ------------------- End Header Content -------------------  */}

        </>

        // </HomeLayout>

    );

};

export default HeaderGeneral;

