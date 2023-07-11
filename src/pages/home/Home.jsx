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


    /* -------------------- Get Product Sale -------------------- */

    const [productSaleData, setProductSaleData] = useState([]);

    useEffect(() => {

        const onProductSaleData = async () => {

            const token = localStorage.getItem("token");

            const productSaleDataRequest = await axios.get(
                `http://localhost:2000/v1/sales/transaction/search`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*"
                    },
                }
            );

            const getProductSale = await productSaleDataRequest.data.data.get_all_product_sale;

            console.log(getProductSale);

            setProductSaleData(getProductSale);
        };

        onProductSaleData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    /* -------------------- End Get Product Sale -------------------- */


    /* -------------------- Get Product Purchase -------------------- */

    const [productPurchaseData, setProductPurchaseData] = useState([]);

    useEffect(() => {

        const onProductPurchaseData = async () => {

            const token = localStorage.getItem("token");

            const productPurchaseDataRequest = await axios.get(
                `http://localhost:2000/v1/purchases/transaction/search`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*"
                    },
                }
            );

            const getProductPurchase = await productPurchaseDataRequest.data.data.get_all_product_purchase;

            setProductPurchaseData(getProductPurchase);
        };

        onProductPurchaseData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    /* -------------------- End Get Product Sale -------------------- */


    /* -------------------- Get Category -------------------- */

    const [category, setCategory] = useState([]);

    const onSearch = async () => {

        const token = localStorage.getItem("token");

        const categoriesDataRequest = await axios.get(
            `http://localhost:2000/v1/category/search`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const getCategory = await categoriesDataRequest.data.data.get_all_category;

        setCategory(getCategory);
    };


    useEffect(() => {
        
        onSearch();

    }, []);

    /* -------------------- End Get Category -------------------- */


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
                            <Col className="col-12 col-lg-3 mt-3">
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
                            <Col className="col-12 col-lg-3 mt-3">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>
                                            <Row>
                                                <Col className="col-3 col-lg-3">
                                                    <i className="bi bi-tag"></i>
                                                </Col>
                                                <Col className="col-9 col-lg-9">
                                                    Total Category
                                                </Col>
                                            </Row>
                                        </Card.Title>
                                        <Card.Text>
                                            { category.length } Categories
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col className="col-12 col-lg-3 mt-3">
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
                                            {productSaleData.length} Sales
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="col-12 col-lg-3 mt-3">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>
                                            <Row>
                                                <Col className="col-3 col-lg-3">
                                                    <i className="bi bi-bag-plus"></i>
                                                </Col>
                                                <Col className="col-9 col-lg-9">
                                                    Total Purchases
                                                </Col>
                                            </Row>
                                        </Card.Title>
                                        <Card.Text>
                                            {productPurchaseData.length} Purchases
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
                                                centerCoordinates={[-6.225014, 106.900447]}
                                                coordinatesPosition={[-6.225014, 106.900447]}
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

