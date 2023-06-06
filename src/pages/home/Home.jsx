import React from "react";
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

const Home = () => {

    return (

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
                                                    <i class="bi bi-shop"></i>
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
                                                    <i class="bi bi-cash-coin"></i>
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
                                                    <i class="bi bi-cart-check"></i>
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

    );

};

export default Home;

