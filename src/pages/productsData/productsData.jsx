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
// import { useNavigate } from "react-router-dom";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import CurrencyFormatter from "../../assets/js/currencyFormatter";
import axios from "axios";
import { useSnackbar } from 'notistack';

const ProductsData = () => {

    // const navigate = useNavigate();


    /* -------------------- Get Category -------------------- */

    const [category, setCategory] = useState([]);

    useEffect(() => {

        const categoriesData = async () => {

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

        categoriesData();

    }, []);

    /* -------------------- End Get Category -------------------- */


    /* -------------------- Get Product -------------------- */

    const [productData, setProductData] = useState([]);

    const nameFieldToSeacrh = useRef();

    const onSearch = async () => {

        const getProductData = nameFieldToSeacrh.current.value;

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


    /* -------------------- Delete Product By Id -------------------- */

    const { enqueueSnackbar } = useSnackbar();

    const onDeleteProductById = async (id) => {

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

                window.location.reload("/products-data")

            }

        } catch (err) {

            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

        }

    };

    /* -------------------- End Delete Product By Id -------------------- */


    /* -------------------- Get Product By Id -------------------- */

    const [showFormProduct, setShowFormProduct] = useState(false);
    const [productDataById, setProductDataById] = useState([]);

    const handleCloseFormProduct = () => setShowFormProduct(false);

    const handleShowFormProduct = async (id) => {

        const token = localStorage.getItem("token");

        const productsDataRequest = await axios.get(
            `http://localhost:2000/v1/products/search/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const getProductByIdResponse = await productsDataRequest.data;

        console.log(getProductByIdResponse.data.product_by_id);

        setProductDataById(getProductByIdResponse.data.product_by_id);

        setShowFormProduct(true);

        localStorage.setItem("id", id);

        return id;

    };

    /* -------------------- End Get Product By Id -------------------- */


    /* -------------------- Update Product By Id -------------------- */

    const nameField = useRef();
    const lengthField = useRef();
    const stockField = useRef();
    const priceField = useRef();

    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSelectCategoryChange = (e) => {

        const selectedCategoryValue = e.target.value;

        setSelectedCategory(selectedCategoryValue);

    };

    const onUpdateProduct = async (id) => {

        try {

            const token = localStorage.getItem("token");
            const id = localStorage.getItem("id")

            const updateProductPayload = {
                name: nameField.current.value,
                length: lengthField.current.value,
                stock: stockField.current.value,
                price: priceField.current.value,
                categoryId: selectedCategory
            };

            const updateProductRequest = await axios.put(
                `http://localhost:2000/v1/products/update/${id}`,
                updateProductPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*"
                    },
                }
            );

            console.log(updateProductRequest);

            const updateProductResponse = updateProductRequest.data;

            enqueueSnackbar(updateProductResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (updateProductResponse.status) {

                localStorage.removeItem("id")
                
                window.location.reload("/products-data")

            }

        } catch (err) {

            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

        }

    };

    /* -------------------- End Update Product By Id -------------------- */



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
                                ref={nameFieldToSeacrh}
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
                                    <i className="bi bi-trash" onClick={() => onDeleteProductById(product.id)}></i>
                                    <i className="bi bi-pencil-square" onClick={() => handleShowFormProduct(product.id)}></i>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </Table>


                {/* ----------------- Modal Form Product ----------------- */}

                <Modal show={showFormProduct} onHide={handleCloseFormProduct} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Form Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" autoComplete="off" defaultValue={productDataById ? productDataById.name : null} ref={nameField} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Length</Form.Label>
                                <Form.Control type="number" autoComplete="off" defaultValue={productDataById ? productDataById.length : null} ref={lengthField} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control type="number" autoComplete="off" defaultValue={productDataById ? productDataById.stock : null} ref={stockField} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" autoComplete="off" defaultValue={productDataById ? productDataById.price : null} ref={priceField} />
                            </Form.Group>
                            <Form.Select aria-label="Default select example" onChange={handleSelectCategoryChange} value={selectedCategory}>
                                <option>Category</option>
                                {category.map((data) =>
                                    <option value={data.id} key={data.id}>{data.categoryName}</option>
                                )}
                            </Form.Select>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFormProduct}>
                            Close
                        </Button>
                        <Button variant="success" onClick={onUpdateProduct}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* ----------------- End Modal Form Product ----------------- */}

            </Container>

        </HomeLayout>

    );

};

export default ProductsData;

