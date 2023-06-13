import React, { useEffect, useState, useRef } from "react";
import {
    Row,
    Col,
    Container,
    InputGroup,
    Button,
    Form,
    Table,
    Modal
} from "react-bootstrap";
// import { Link, useNavigate, useLocation } from "react-router-dom";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import CurrencyFormatter from "../../assets/js/currencyFormatter";
import axios from "axios";
import { useSnackbar } from 'notistack';

const ProductsData = () => {

    /* -------------------- Get Product -------------------- */

    const [productData, setProductData] = useState([]);

    const nameField = useRef();

    const onSearch = async () => {

        const getProductData = nameField.current.value;

        const token = localStorage.getItem("token");

        const productsDataRequest = await axios.get(
            `http://localhost:2000/v1/products/search?name=${getProductData}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const getProduct = await productsDataRequest.data.data.get_all_product;

        setProductData(getProduct);
    };

    useEffect(() => {

        onSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* -------------------- End Get Product -------------------- */


    /* -------------------- Get Id Product -------------------- */

    const fetchIdFromTable = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                'http://localhost:2000/v1/products/search',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*"
                    },
                }
            );

            const id = response.data.data.get_all_product[0].id;

            return id;

        } catch (error) {

            console.log('Error fetching ID:', error);

            return null;

        }

    };

    /* -------------------- End Get Id Product -------------------- */


    /* -------------------- Delete Product By Id -------------------- */

    const { enqueueSnackbar } = useSnackbar();

    const [showFormProduct, setShowFormProduct] = useState(false);

    const handleCloseFormProduct = () => setShowFormProduct(false);
    const handleShowFormProduct = () => setShowFormProduct(true);


    const onDeleteProductById = async () => {

        const id = await fetchIdFromTable();
        const token = localStorage.getItem("token");

        try {

            const productsDataRequest = await axios.delete(
                `http://localhost:2000/v1/products/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const deletedProductsResponse = await productsDataRequest.data;

            enqueueSnackbar(deletedProductsResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (deletedProductsResponse.status) {

                handleCloseFormProduct();

                window.location.reload("/products-data")

            }

        } catch (err) {

            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

        }

    };

    /* -------------------- End Delete Product By Id -------------------- */


    return (

        <HomeLayout>

            <Container>

                <Row>
                    <Col className="col-12 col-lg-5 warehouse-search-col">
                        <InputGroup className="mb-3 warehouse-search-group">
                            <Form.Control
                                className="warehouse-search-control"
                                placeholder="Cari produk disini..."
                                aria-label="Cari produk disini..."
                                aria-describedby="basic-addon2"
                                ref={nameField}
                            />
                            <Button id="button-addon2" onClick={onSearch}>
                                Search
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>

                <Table striped bordered hover className="warehouse-products-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Length</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {productData.map((product) =>
                        <tbody key={product.id}>
                            <tr>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.category.categoryName}</td>
                                <td>{product.length} m</td>
                                <td>{product.stock} pcs</td>
                                <td>{CurrencyFormatter(product.price)}</td>
                                <td>
                                    <i className="bi bi-trash" onClick={handleShowFormProduct}></i>
                                    <i className="bi bi-pencil-square"></i>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </Table>


                {/* ----------------- Modal Form Products ----------------- */}

                <Modal show={showFormProduct} onHide={handleCloseFormProduct} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Yakin untuk menghapus product ini?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFormProduct}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={onDeleteProductById}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* ----------------- End Modal Form Products ----------------- */}

            </Container>

        </HomeLayout>

    );

};

export default ProductsData;

