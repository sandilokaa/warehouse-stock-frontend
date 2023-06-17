import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Container,
    Card
} from "react-bootstrap";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chart from 'chart.js/auto';
import MapWrapped from "../../components/map/mapWrapped";

const Home = () => {

    const navigate = useNavigate();

    /* -------------------- Get Current Login -------------------- */

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

    /* -------------------- Get Current Login -------------------- */


    /* -------------------- Get Product -------------------- */

    const [productData, setProductData] = useState([]);

    useEffect(() => {

        const productsData = async () => {

            const token = localStorage.getItem("token");

            const productsDataRequest = await axios.get(
                `http://localhost:2000/v1/products/search`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const getProduct = await productsDataRequest.data.data.get_all_product;

            setProductData(getProduct);
        };

        productsData();

    }, []);

    /* -------------------- End Get Product -------------------- */


    /* -------------------- Product Diagram -------------------- */

    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {

        if (chartInstance) {
            chartInstance.destroy();
        }

        const ctx = document.getElementById('myChart').getContext('2d');

        const newChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: productData.map(item => item.name),
                datasets: [{
                    label: 'Stok Produk',
                    data: productData.map(item => item.stock),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        setChartInstance(newChartInstance);

    }, [productData]);

    /* -------------------- End Product Diagram -------------------- */


    return isLoggedIn ? (

        <HomeLayout>

            {/* ------------------- Card Result Content -------------------  */}

            <div id="warehouse-overview">
                <Container>
                    <div className="card-result-total">
                        <Row className="row-result-total">
                            <Col className="col-12 col-lg-4 mt-3">
                                <Card className="card-total-products">
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
                                            {productData.length} Products
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
                                            Some quick
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
                                            Some quick
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
                                            Diagram Stok Produk
                                        </Card.Title>
                                        <Card.Text>
                                            <canvas id="myChart" width="400" height="200"></canvas>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="col-12 col-lg-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>
                                            WarehouseHub Location
                                        </Card.Title>
                                        <Card.Text className="geo-map">
                                            <MapWrapped
                                                centerCoordinates={[ -6.225014, 106.900447]}
                                                coordinatesPosition={[ -6.225014, 106.900447]}
                                            />
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

    ) : (navigate("/login"));

};

export default Home;

