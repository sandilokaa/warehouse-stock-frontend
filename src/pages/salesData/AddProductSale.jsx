import React, { useState, useEffect, useRef } from "react";
import {
    Container,
    Table,
    InputGroup,
    Button,
    Form,
    Row,
    Col,
    Modal
} from "react-bootstrap";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from 'notistack';
import CurrencyFormatter from "../../assets/js/currencyFormatter";


const AddProductSale = () => {

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    /* -------------------- Form Add Product -------------------- */

    const [showFormProduct, setShowFormProduct] = useState(false);

    const handleCloseFormProduct = () => setShowFormProduct(false);
    const handleShowFormProduct = () => setShowFormProduct(true);

    /* -------------------- End Form Add Product -------------------- */

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

        setProductData(getProduct);
    };

    useEffect(() => {

        onSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* -------------------- End Get Product -------------------- */


    /* -------------------- Handle Create Product Sale -------------------- */

    const quantityField = useRef();

    const [selectedProduct, setSelectedProduct] = useState('');

    const handleSelectProductChange = (e) => {

        const selectedProductValue = e.target.value;

        setSelectedProduct(selectedProductValue);

    };

    const handleCreateProductSale = async () => {

        try {

            const token = localStorage.getItem("token");

            const adminToCreateProductSalePayload = {
                productId: selectedProduct,
                quantity: quantityField.current.value,
            };

            const createdProductSaleRequest = await axios.post(
                `http://localhost:2000/v1/sales/product-sale/create`,
                adminToCreateProductSalePayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const createdProductSaleResponse = createdProductSaleRequest.data;

            enqueueSnackbar(createdProductSaleResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (createdProductSaleResponse.status) {

                handleCloseFormProduct();

                window.location.reload("/add-product-sale");

            }

        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });
        }

    };

    /* -------------------- End Handle Create Product Sale -------------------- */


    /* -------------------- Handle Get Product Sale Where Sale Id Null -------------------- */

    const [productDataSaleIdNull, setProductDataSaleIdNull] = useState([]);
    const [accumulateData, setAccumulateData] = useState();

    const onSearchSaleIdNull = async () => {

        const token = localStorage.getItem("token");

        const productsDataRequest = await axios.get(
            `http://localhost:2000/v1/sales/product-sale/search`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const getProduct = await productsDataRequest.data.data.get_all_product;

        const getSubTotal = []

        getSubTotal.push(...getProduct.map(item => item.subTotal));

        const convertedSubTotal = getSubTotal.map(item => parseFloat(item));

        const total = convertedSubTotal.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        setAccumulateData(total)

        setProductDataSaleIdNull(getProduct);
    };

    useEffect(() => {

        onSearchSaleIdNull();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* -------------------- End Handle Get Product Sale Where Sale Id Null -------------------- */


    /* -------------------- Handle Create Transaction Product Sale -------------------- */

    const [transactionCode, setTransactionCode] = useState('');

    function generateTransactionCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'DNO';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }

        return code;
    }

    useEffect(() => {

        const generatedCode = generateTransactionCode(8);

        setTransactionCode(generatedCode);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (e) => {

        const selectedDateValue = e.target.value;

        setSelectedDate(selectedDateValue);

    };

    const customerNameField = useRef();
    const transactionTypeField = useRef();

    const onCreateTransactionProductSale = async () => {

        try {

            const token = localStorage.getItem("token");

            const adminToCreatetransactionProductSalePayload = {
                transactionCode: transactionCode,
                salesDate: selectedDate,
                customer: customerNameField.current.value,
                transactionType: transactionTypeField.current.value
            };

            const createTransactionProductSaleRequest = await axios.post(
                `http://localhost:2000/v1/sales/transaction/create`,
                adminToCreatetransactionProductSalePayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*"
                    },
                }
            );

            const createTransactionProductSaleResponse = createTransactionProductSaleRequest.data;

            enqueueSnackbar(createTransactionProductSaleResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (createTransactionProductSaleResponse.status) {

                navigate("/sales-data");

            }

        } catch (err) {

            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

        }

    };

    /* -------------------- End Handle Create Transaction Product Sale -------------------- */


    /* -------------------- Handle Delete Item Product Sale -------------------- */

    const onDeleteItemById = async (id) => {

        const token = localStorage.getItem("token");

        try {

            const productsDataRequest = await axios.delete(
                `http://localhost:2000/v1/sales/product-sale/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const deletedProductsResponse = await productsDataRequest.data;

            enqueueSnackbar(deletedProductsResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (deletedProductsResponse.status) {

                window.location.reload("/add-product-sale")

            }

        } catch (err) {

            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

        }

    };

    /* -------------------- End Handle Delete Item Product Sale -------------------- */


    return (

        <HomeLayout>
            <Container>

                <Row>
                    <Col className="col-12 col-lg-6 add-product">
                        <Button onClick={handleShowFormProduct} className="btn btn-add-product"> Add Product </Button>
                    </Col>
                    <Col className="col-12 col-lg-6 d-flex justify-content-end">
                        <Button onClick={() => navigate('/sales-data')} className="btn btn-back"> Back To Sale Page </Button>
                    </Col>
                </Row>

                <Row>
                    <Col className="col-12 col-lg-3 extend-product-sale">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Transaction Code</Form.Label>
                            <Form.Control type="text" value={transactionCode} autoComplete="off" readOnly />
                        </Form.Group>
                    </Col>
                    <Col className="col-12 col-lg-3 extend-product-sale">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Sale Date</Form.Label>
                            <Form.Control type="date" autoComplete="off" value={selectedDate} onChange={handleDateChange} />
                        </Form.Group>
                    </Col>
                    <Col className="col-12 col-lg-3 extend-product-sale">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Customer Name</Form.Label>
                            <Form.Control type="text" autoComplete="off" ref={customerNameField} />
                        </Form.Group>
                    </Col>
                    <Col className="col-12 col-lg-3 extend-product-sale">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Transaction Type</Form.Label>
                            <Form.Control type="text" autoComplete="off" value="Penjualan" ref={transactionTypeField} readOnly />
                        </Form.Group>
                    </Col>
                </Row>

                <Table striped bordered hover className="warehouse-product-sale-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Product Price</th>
                            <th>Sub Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {productDataSaleIdNull.map((item, index) =>
                        <tbody key={item.id}>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.product.name}</td>
                                <td>{item.product.category.categoryName}</td>
                                <td>{item.quantity}</td>
                                <td>{CurrencyFormatter(item.product.price)}</td>
                                <td>{CurrencyFormatter(item.subTotal)}</td>
                                <td>
                                    <i className="bi bi-trash" onClick={() => onDeleteItemById(item.id)}></i>
                                </td>
                            </tr>
                        </tbody>
                    )}
                    <tbody>
                        <tr>
                            <td colSpan="5" className="text-center">Total</td>
                            <td colSpan="2" className="text-center">{CurrencyFormatter(accumulateData)}</td>
                        </tr>
                    </tbody>
                </Table>

                <Button className="btn btn-submit-transaction" onClick={onCreateTransactionProductSale}> Submit Transaction </Button>

                {/* ----------------- Modal Form Create Product ----------------- */}

                <Modal show={showFormProduct} onHide={handleCloseFormProduct} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Form Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Product</Form.Label>
                                <Form.Select className="mb-3" aria-label="Default select example" onChange={handleSelectProductChange} value={selectedProduct}>
                                    <option>Product</option>
                                    {productData.map((data) =>
                                        <option value={data.id} key={data.id}>{data.name}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control type="number" placeholder="Example: 8" autoComplete="off" ref={quantityField} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFormProduct}>
                            Close
                        </Button>
                        <Button variant="success" onClick={handleCreateProductSale}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* ----------------- End Modal Form Create Product ----------------- */}

            </Container>
        </HomeLayout>

    );

};

export default AddProductSale;

