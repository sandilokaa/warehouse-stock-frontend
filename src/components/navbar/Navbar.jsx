import React from "react";
import {
    Container,
    Nav,
    Navbar,
    NavDropdown,
    Image
} from "react-bootstrap";
import "../../assets/css/style.css";
import LogoWarehouseHub from "../../assets/images/logo-warehouse.png";
import ProfileAdminImage from "../../assets/images/undraw_profile_2.svg";
import StandLineNavbar from "../../assets/images/stand-line-navbar.png";

const NavbarGeneral = () => {

    return (

        <Navbar className="navbar" expand="lg" fixed="top">
            <Container>
                <Navbar.Brand href="#home">
                    <Image src={LogoWarehouseHub}/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link className="nav-item">
                            <i class="bi bi-speedometer"></i>
                            Dashboard
                        </Nav.Link>
                        <NavDropdown className="nav-dropdown-master" title={
                            <span> 
                                <i class="bi bi-database-add"></i>
                                Master Data 
                            </span>
                        } id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.2">
                                Add Category
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.4">
                                Add product
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link className="nav-item">
                            <i class="bi bi-cart-check"></i>
                            Selling
                        </Nav.Link>
                        <Nav.Link className="nav-profile">
                            <div className="profile-admin">
                                <Image className="stand-line-navbar" src={StandLineNavbar} />
                                <Image className="profile-admin-image" src={ProfileAdminImage} />
                                John Doe
                            </div>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );

};

export default NavbarGeneral;