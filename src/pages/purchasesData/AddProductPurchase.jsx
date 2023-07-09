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


const AddProductPurchase = () => {

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


    /* -------------------- Handle Create Product Purchase -------------------- */

    const quantityField = useRef();
    const purchasePriceField = useRef();

    const [selectedProduct, setSelectedProduct] = useState('');

    const handleSelectProductChange = (e) => {

        const selectedProductValue = e.target.value;

        setSelectedProduct(selectedProductValue);

    };

    const handleCreateProductPurchase = async () => {

        try {

            const token = localStorage.getItem("token");

            const adminToCreateProductPurchasePayload = {
                productId: selectedProduct,
                quantity: quantityField.current.value,
                purchasePrice: purchasePriceField.current.value
            };

            const createdProductPurchaseRequest = await axios.post(
                `http://localhost:2000/v1/purchases/product-purchase/create`,
                adminToCreateProductPurchasePayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const createdProductPurchaseResponse = createdProductPurchaseRequest.data;

            enqueueSnackbar(createdProductPurchaseResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (createdProductPurchaseResponse.status) {

                handleCloseFormProduct();

                window.location.reload("/add-product-purchase");

            }
            
        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });
        }

    };

    /* -------------------- End Handle Create Product Purchase -------------------- */


    /* -------------------- Handle Get Product Purchase Where Purchase Id Null -------------------- */

    const [productDataPurchaseIdNull, setProductDataPurchaseIdNull] = useState([]);

    const onSearchPurchaseIdNull = async () => {

        const token = localStorage.getItem("token");

        const productsDataRequest = await axios.get(
            `http://localhost:2000/v1/purchases/product-purchase/search`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const productsDataResponse = await productsDataRequest.data.data.get_all_product;

        setProductDataPurchaseIdNull(productsDataResponse);
    };

    useEffect(() => {

        onSearchPurchaseIdNull();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* -------------------- End Handle Get Product Purchase Where Purchase Id Null -------------------- */


    /* -------------------- Handle Delete Item Product Purchase -------------------- */

    const onDeleteItemById = async (id) => {

        const token = localStorage.getItem("token");

        try {

            const productsDataRequest = await axios.delete(
                `http://localhost:2000/v1/purchases/product-purchase/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const deletedProductsResponse = await productsDataRequest.data;

            enqueueSnackbar(deletedProductsResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (deletedProductsResponse.status) {

                window.location.reload("/add-product-purchase")

            }

        } catch (err) {

            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

        }

    };

    /* -------------------- End Handle Delete Item Product Purchase -------------------- */


    /* -------------------- Handle Create Transaction Product Purchase -------------------- */

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


    const supplierField = useRef();
    const transactionTypeField = useRef();

    const onCreateTransactionProductPurchase = async () => {

        try {

            const token = localStorage.getItem("token");

            const adminToCreatetransactionProductPurchasePayload = {
                transactionCode: transactionCode,
                purchaseDate: selectedDate,
                supplier: supplierField.current.value,
                transactionType: transactionTypeField.current.value
            };

            const createTransactionProductPurchaseRequest = await axios.post(
                `http://localhost:2000/v1/purchases/transaction/create`,
                adminToCreatetransactionProductPurchasePayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*"
                    },
                }
            );

            const createTransactionProductPurchaseResponse = createTransactionProductPurchaseRequest.data;

            enqueueSnackbar(createTransactionProductPurchaseResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (createTransactionProductPurchaseResponse.status) {

                navigate("/purchases-data");

            }

        } catch (err) {

            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

        }

    };

    /* -------------------- End Handle Create Transaction Product Purchase -------------------- */


    return (

        <HomeLayout>
            <Container>

                <Row>
                    <Col className="col-12 col-lg-6 add-product">
                        <Button onClick={handleShowFormProduct} className="btn btn-add-product"> Add Product </Button>
                    </Col>
                    <Col className="col-12 col-lg-6 d-flex justify-content-end">
                        <Button onClick={() => navigate('/purchases-data')} className="btn btn-back"> Back To Purchase Page </Button>
                    </Col>
                </Row>

                <Row>
                    <Col className="col-12 col-lg-3 extend-product-purchase">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Transaction Code</Form.Label>
                            <Form.Control type="text" value={transactionCode} autoComplete="off" readOnly />
                        </Form.Group>
                    </Col>
                    <Col className="col-12 col-lg-3 extend-product-purchase">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Purchase Date</Form.Label>
                            <Form.Control type="date" autoComplete="off" value={selectedDate} onChange={handleDateChange}/>
                        </Form.Group>
                    </Col>
                    <Col className="col-12 col-lg-3 extend-product-purchase">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Supplier</Form.Label>
                            <Form.Control type="text" autoComplete="off" ref={supplierField}/>
                        </Form.Group>
                    </Col>
                    <Col className="col-12 col-lg-3 extend-product-purchase">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Transaction Type</Form.Label>
                            <Form.Control type="text" autoComplete="off" ref={transactionTypeField} value="Pembelian" readonly />
                        </Form.Group>
                    </Col>
                </Row>

                <Table striped bordered hover className="warehouse-product-purchase-table">
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
                    {productDataPurchaseIdNull.map((item, index) =>
                        <tbody key={item.id}>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.product.name}</td>
                                <td>{item.product.category.categoryName}</td>
                                <td>{item.quantity}</td>
                                <td>{CurrencyFormatter(item.purchasePrice)}</td>
                                <td>{CurrencyFormatter(item.subTotal)}</td>
                                <td>
                                    <i className="bi bi-trash" onClick={() => onDeleteItemById(item.id)}></i>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </Table>

                <Button className="btn btn-submit-transaction" onClick={onCreateTransactionProductPurchase}> Submit Transaction </Button>

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
                                <Form.Control type="number" placeholder="Example: 8" autoComplete="off" ref={quantityField}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Purchase Price</Form.Label>
                                <Form.Control type="number" placeholder="Example: 3000000" autoComplete="off" ref={purchasePriceField}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFormProduct}>
                            Close
                        </Button>
                        <Button variant="success" onClick={handleCreateProductPurchase}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* ----------------- End Modal Form Create Product ----------------- */}

            </Container>
        </HomeLayout>

    );

};

export default AddProductPurchase;

