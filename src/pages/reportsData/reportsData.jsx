import React from "react";
import {
    Row,
    Col,
    Container,
    Button,
    Card
} from "react-bootstrap";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";

const ReportsData = () => {

    return (

        <HomeLayout>
            <div className="report-card">
                <Container className="card-download-report">
                    <Row>
                        <Col className="col-12 col-lg-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Download Product Reports</Card.Title>
                                    <Card.Text>
                                        Jika anda memerlukan, anda dapat memperoleh salinan dari laporan
                                        produk dengan klik button "Download" di bawah ini.
                                    </Card.Text>
                                    <Button className="btn btn-download"> Download </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="col-12 col-lg-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Download Category Reports</Card.Title>
                                    <Card.Text>
                                        Jika anda memerlukan, anda dapat memperoleh salinan dari laporan
                                        kategory dengan klik button "Download" di bawah ini.
                                    </Card.Text>
                                    <Button className="btn btn-download"> Download </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="col-12 col-lg-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Download Sale Reports</Card.Title>
                                    <Card.Text>
                                        Jika anda memerlukan, anda dapat memperoleh salinan dari laporan
                                        penjualan dengan klik button "Download" di bawah ini.
                                    </Card.Text>
                                    <Button className="btn btn-download"> Download </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </HomeLayout>

    );

};

export default ReportsData;

