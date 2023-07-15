import React, { useState, useEffect, useRef } from "react";
import {
    Container,
    Nav,
    Navbar,
    NavDropdown,
    Image,
    Modal,
    Button,
    Form
} from "react-bootstrap";
import "../../assets/css/style.css";
import LogoWarehouseHub from "../../assets/images/logo-warehouse.png";
import ProfileAdminImage from "../../assets/images/undraw_profile_2.svg";
import StandLineNavbar from "../../assets/images/stand-line-navbar.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';

const NavbarGeneral = () => {

    /* -------------------- Global Variable -------------------- */

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    /* -------------------- Global Variable -------------------- */


    /* -------------------- Form Category -------------------- */

    const [showFormCategory, setShowFormCategory] = useState(false);

    const handleCloseFormCategory = () => setShowFormCategory(false);
    const handleShowFormCategory = () => setShowFormCategory(true);

    /* -------------------- End Form Category -------------------- */


    /* -------------------- Form Create Product -------------------- */

    const [showFormProduct, setShowFormProduct] = useState(false);

    const handleCloseFormProduct = () => setShowFormProduct(false);
    const handleShowFormProduct = () => setShowFormProduct(true);

    /* -------------------- End Form Create Product -------------------- */

    /* -------------------- Current Admin -------------------- */

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

    /* -------------------- End Current Admin -------------------- */


    /* -------------------- Logout Account -------------------- */

    const onLogout = () => {

        localStorage.removeItem('token');

        navigate("/login");

    };

    /* -------------------- End Logout Account -------------------- */


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


    /* -------------------- Create Category -------------------- */

    const categoryField = useRef();

    const onCreateCategory = async () => {

        try {

            const token = localStorage.getItem("token");

            const adminToCreateCategoryPayload = {
                categoryName: categoryField.current.value
            };

            const createCategoryRequest = await axios.post(
                `http://localhost:2000/v1/category/create`,
                adminToCreateCategoryPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const createCategoryResponse = createCategoryRequest.data;

            enqueueSnackbar(createCategoryResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (createCategoryResponse.status) {

                handleCloseFormCategory();

                window.location.reload("/categories-data");

            }

        } catch (err) {

            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

        }

    };

    /* -------------------- End Create Category -------------------- */


    /* -------------------- Create Product -------------------- */

    const nameField = useRef();
    const lengthField = useRef();
    const stockField = useRef();
    const priceField = useRef();

    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSelectCategoryChange = (e) => {

        const selectedCategoryValue = e.target.value;

        setSelectedCategory(selectedCategoryValue);

    };

    const onCreateProduct = async () => {

        try {

            if (!selectedCategory) {
                enqueueSnackbar('Silakan pilih kategori dahulu (:', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });
                return;
            }

            const token = localStorage.getItem("token");

            const adminToCreateProductPayload = {
                name: nameField.current.value,
                length: lengthField.current.value,
                stock: stockField.current.value,
                price: priceField.current.value,
                categoryId: selectedCategory
            };

            const createProductRequest = await axios.post(
                `http://localhost:2000/v1/products/create`,
                adminToCreateProductPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const createProductResponse = createProductRequest.data;

            enqueueSnackbar(createProductResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (createProductResponse.status) {

                handleCloseFormProduct();

                window.location.reload("/products-data");

            }

        } catch (err) {

            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

        }

    };

    /* -------------------- End Create Product -------------------- */


    return isLoggedIn ? (

        <Navbar className="navbar" expand="lg" fixed="top">
            <Container>
                <Navbar.Brand href="#home">
                    <Image src={LogoWarehouseHub} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link className="nav-item">
                            <i className="bi bi-speedometer"></i>
                            Dashboard
                        </Nav.Link>
                        <NavDropdown className="nav-dropdown-master" title={
                            <span>
                                <i className="bi bi-database-add"></i>
                                Master Data
                            </span>
                        } id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={handleShowFormCategory}>
                                Add Category
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={handleShowFormProduct}>
                                Add Product
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link className="nav-item" onClick={() => navigate('/sales-data')}>
                            <i className="bi bi-cart-check"></i>
                            Sale
                        </Nav.Link>
                        <Nav.Link className="nav-item" onClick={() => navigate('/purchases-data')}>
                            <i className="bi bi-cash"></i>
                            Purchase
                        </Nav.Link>
                        <Nav.Link className="nav-profile">
                            <div className="profile-admin">
                                <Image className="stand-line-navbar" src={StandLineNavbar} />
                                <Image className="profile-admin-image" src={ProfileAdminImage} />
                                {admin.name}
                            </div>
                        </Nav.Link>
                        <Nav.Link className="nav-button">
                            <Button className="btn-logout" onClick={onLogout}>
                                Logout
                            </Button>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>

                {/* ----------------- Modal Form Category ----------------- */}

                <Modal show={showFormCategory} onHide={handleCloseFormCategory} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Form Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Category</Form.Label>
                                <Form.Control type="text" placeholder="Add your category" ref={categoryField} autoComplete="off" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFormCategory}>
                            Close
                        </Button>
                        <Button variant="success" onClick={onCreateCategory}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* ----------------- End Modal Form Category ----------------- */}


                {/* ----------------- Modal Form Create Product ----------------- */}

                <Modal show={showFormProduct} onHide={handleCloseFormProduct} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Form Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Example: Kanopi" autoComplete="off" ref={nameField} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Length</Form.Label>
                                <Form.Control type="number" placeholder="Example: 8" autoComplete="off" ref={lengthField} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control type="number" placeholder="Example: 10" autoComplete="off" ref={stockField} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" placeholder="Example: 30000" autoComplete="off" ref={priceField} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Category</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={handleSelectCategoryChange} value={selectedCategory}>
                                    <option>Category</option>
                                    {category.map((data) =>
                                        <option value={data.id} key={data.id}>{data.categoryName}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFormProduct}>
                            Close
                        </Button>
                        <Button variant="success" onClick={onCreateProduct}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* ----------------- End Modal Form Create Product ----------------- */}

            </Container>
        </Navbar>

    ) : (navigate("/login"));

};

export default NavbarGeneral;