import React, { useState, useEffect } from "react";
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

const NavbarGeneral = () => {

    /* -------------------- Form Category -------------------- */

    const [showFormCategory, setShowFormCategory] = useState(false);

    const handleCloseFormCategory = () => setShowFormCategory(false);
    const handleShowFormCategory = () => setShowFormCategory(true);

    /* -------------------- End Form Category -------------------- */


    /* -------------------- Form Product -------------------- */

    const [showFormProduct, setShowFormProduct] = useState(false);

    const handleCloseFormProduct = () => setShowFormProduct(false);
    const handleShowFormProduct = () => setShowFormProduct(true);

    /* -------------------- End Form Category -------------------- */


    /* -------------------- Current Admin -------------------- */

    const navigate = useNavigate();

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

    }

    /* -------------------- End Logout Account -------------------- */

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
                        <Nav.Link className="nav-item">
                            <i className="bi bi-cart-check"></i>
                            Selling
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
                                <Form.Control type="text" placeholder="Add your category" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFormCategory}>
                            Close
                        </Button>
                        <Button variant="success" onClick={handleCloseFormCategory}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* ----------------- End Modal Form Category ----------------- */}


                {/* ----------------- Modal Form Category ----------------- */}

                <Modal show={showFormProduct} onHide={handleCloseFormProduct} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Form Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Example: Kanopi" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Length</Form.Label>
                                <Form.Control type="text" placeholder="Example: 8" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control type="text" placeholder="Example: 10" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="text" placeholder="Example: 30000" />
                            </Form.Group>
                            <Form.Select aria-label="Default select example">
                                <option>Category</option>
                                <option value="1">Baja Ringan Hollow</option>
                                <option value="2">Baja Ringan Reng</option>
                                <option value="3">Baja Ringan Bondek</option>
                            </Form.Select>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFormProduct}>
                            Close
                        </Button>
                        <Button variant="success" onClick={handleCloseFormProduct}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* ----------------- End Modal Form Category ----------------- */}

            </Container>
        </Navbar>

    ) : ( navigate("/login") );

};

export default NavbarGeneral;