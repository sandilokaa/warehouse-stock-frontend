import React, { useRef } from "react";
import {
    Row,
    Col,
    Container,
    Image,
    Form,
    Button
} from "react-bootstrap";
import RegisterImage from "../../assets/images/bg-login.png";
import "../../assets/css/style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from 'notistack';


const Register = () => {

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const nameField = useRef();
    const phoneNumberField = useRef();
    const cityField = useRef();
    const roleField = useRef();
    const emailField = useRef();
    const passwordField = useRef();
    const confirmPasswordField = useRef();

    const onRegister = async (e) => {

        if (passwordField.current.value === confirmPasswordField.current.value) {

            try {

                const adminToRegisterPayload = {
                    name: nameField.current.value,
                    phoneNumber: phoneNumberField.current.value,
                    city: cityField.current.value,
                    role: roleField.current.value,
                    email: emailField.current.value,
                    password: passwordField.current.value
                };

                const adminToRegisterRequest = await axios.post(
                    `http://localhost:2000/v1/auth/register`,
                    adminToRegisterPayload,
                );

                const adminToRegisterResponse = adminToRegisterRequest.data;

                enqueueSnackbar(adminToRegisterResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

                if (adminToRegisterResponse.status) navigate('/login');

            } catch (err) {
                enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });
            }

        } else {
            enqueueSnackbar('Please check the registration form again ):', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });
        }

    };

    return (

        <div>
            <Container>
                <Row className="warehouse-row-register">
                    <Col className="col-12 col-lg-6 warehouse-col-register">
                        <h2>Register <Image src="https://img.icons8.com/external-flat-juicy-fish/60/null/external-peace-hands-and-gestures-flat-flat-juicy-fish.png" /></h2>
                        <p>Daftar akunmu sekarang</p>
                        <Form className="warehouse-form-register">
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control className="warehouse-form-name" type="text" ref={nameField} placeholder="Masukkan nama mu" autoComplete="off"/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control className="warehouse-form-phone-number" type="text" ref={phoneNumberField} placeholder="Masukkan nomor telepon mu" autoComplete="off"/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>City</Form.Label>
                                <Form.Control className="warehouse-form-city" type="text" ref={cityField} placeholder="Masukkan kota mu" autoComplete="off"/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Control className="warehouse-form-role" type="text" ref={roleField} placeholder="Masukkan role mu" autoComplete="off"/>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control className="warehouse-form-email" type="email" ref={emailField} placeholder="Masukkan email mu" autoComplete="off"/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Row>
                                    <Col className="col-12 col-lg-6 mt-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control className="warehouse-form-password" ref={passwordField} type="text" placeholder="Masukkan password mu" autoComplete="off"/>
                                    </Col>
                                    <Col className="col-12 col-lg-6 mt-3">
                                        <Form.Label>Konfirmasi Password</Form.Label>
                                        <Form.Control className="warehouse-form-confirm-password" ref={confirmPasswordField} type="text" placeholder="Masukkan password mu" autoComplete="off"/>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Form>
                        <Row>
                            <Col className="col-12 col-lg-12 warehouse-content-loggedin d-flex justify-content-center">
                                <Button onClick={onRegister}>
                                    <p>Continue</p>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="col-12 col-lg-6 warehouse-col-register-image">
                        <Image src={RegisterImage} />
                    </Col>
                </Row>
            </Container>
        </div>

    );
};

export default Register;