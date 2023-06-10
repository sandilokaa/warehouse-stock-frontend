import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Container,
    Image,
    Button,
    Card
} from "react-bootstrap";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Home = () => {

    const navigate = useNavigate();
    
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

    return isLoggedIn ? (

        <HomeLayout>

            {/* ------------------- Card Result Content -------------------  */}

            <div id="warehouse-overview">
                <Container>
                    <div className="card-result-total">
                        <Row className="row-result-total">
                            <Col className="col-12 col-lg-4 mt-3">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>
                                            <Row>
                                                <Col className="col-3 col-lg-3">
                                                    <i className="bi bi-shop"></i>
                                                </Col>
                                                <Col className="col-9 col-lg-9">
                                                    Total Products
                                                </Col>
                                            </Row>
                                        </Card.Title>
                                        <Card.Text>
                                            Some quick example text to build on the card title and make up the
                                            bulk of the card's content.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="col-12 col-lg-4 mt-3">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>
                                            <Row>
                                                <Col className="col-3 col-lg-3">
                                                    <i className="bi bi-cash-coin"></i>
                                                </Col>
                                                <Col className="col-9 col-lg-9">
                                                    Total Sales
                                                </Col>
                                            </Row>
                                        </Card.Title>
                                        <Card.Text>
                                            Some quick example text to build on the card title and make up the
                                            bulk of the card's content.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="col-12 col-lg-4 mt-3">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>
                                            <Row>
                                                <Col className="col-3 col-lg-3">
                                                    <i className="bi bi-cart-check"></i>
                                                </Col>
                                                <Col className="col-9 col-lg-9">
                                                    Total Orders
                                                </Col>
                                            </Row>
                                        </Card.Title>
                                        <Card.Text>
                                            Some quick example text to build on the card title and make up the
                                            bulk of the card's content.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    <div className="card-analytics-diagram">
                        <Row>
                            <Col className="col-12 col-lg-8">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>
                                            Diagram Analytics
                                        </Card.Title>
                                        <Card.Text>
                                            Some quick example text to build on the card title and make up the
                                            bulk of the card's content.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="col-12 col-lg-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>
                                            Diagram Analytics
                                        </Card.Title>
                                        <Card.Text>
                                            Some quick example text to build on the card title and make up the
                                            bulk of the card's content.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>

            {/* ------------------- End Card Result Content  -------------------  */}

        </HomeLayout>

    ) : ( navigate("/login") );

};

export default Home;

