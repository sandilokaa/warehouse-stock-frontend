import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Container,
    Button,
    Card,
    Form
} from "react-bootstrap";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import axios from "axios";


const AveragesData = () => {

    /* -------------------- Get Product -------------------- */

    const [productData, setProductData] = useState([]);

    const onSearch = async () => {

        const token = localStorage.getItem("token");

        const productsDataRequest = await axios.get(
            `http://localhost:2000/v1/products/search`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const getProduct = await productsDataRequest.data.data.get_all_product;

        // console.log(getProduct);

        setProductData(getProduct);
    };

    useEffect(() => {

        onSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* -------------------- End Get Product -------------------- */

    return (

        <HomeLayout>

            <Container>
                <div className="average-method">
                    <Row>
                        <Col className="col-12 col-lg-4 extend-product-sale">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Select className="mb-3" aria-label="Default select example">
                                    <option>Product</option>
                                    {productData.map((data) =>
                                        <option value={data.id} key={data.id}>{data.name}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col className="col-12 col-lg-4 extend-product-sale">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Month</Form.Label>
                                <Form.Select className="mb-3" aria-label="Default select example">
                                    <option>Month</option>
                                    <option value="01">Januari</option>
                                    <option value="02">Februari</option>
                                    <option value="03">Maret</option>
                                    <option value="04">April</option>
                                    <option value="05">Mei</option>
                                    <option value="06">Juni</option>
                                    <option value="07">Juli</option>
                                    <option value="08">Agustus</option>
                                    <option value="09">September</option>
                                    <option value="10">Oktober</option>
                                    <option value="11">November</option>
                                    <option value="12">Desember</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col className="col-12 col-lg-4 extend-product-sale">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Year</Form.Label>
                                <Form.Select className="mb-3" aria-label="Default select example">
                                    <option>Year</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="2019">2019</option>
                                    <option value="2018">2018</option>
                                    <option value="2017">2017</option>
                                    <option value="2016">2016</option>
                                    <option value="2015">2015</option>
                                    <option value="2014">2014</option>
                                    <option value="2013">2013</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="average-method">
                        <Col className="col-12 col-lg-12">
                            <Button className="btn btn-download-average"> Download </Button>
                        </Col>
                    </Row>
                </div>

            </Container>

        </HomeLayout>

    );

};

export default AveragesData;

