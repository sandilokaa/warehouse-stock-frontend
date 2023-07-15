import React, { useRef } from "react";
import { Link } from 'react-router-dom';
import {
    Row,
    Col,
    Container,
    Image,
    Form,
    Button
} from "react-bootstrap";
import LoginImage from "../../assets/images/bg-login.png";
import "../../assets/css/style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from 'notistack';


const Login = () => {

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const emailField = useRef();
    const passwordField = useRef();

    const onLogin = async (e) => {

        e.preventDefault();

        try {
            
            const adminToLoginPayload = {
                email: emailField.current.value,
                password: passwordField.current.value,
            };


            const adminLoginRequest = await axios.post(
                `http://localhost:2000/v1/auth/login`,
                adminToLoginPayload
            );

            const adminLoginResponse = adminLoginRequest.data;

            console.log(adminLoginResponse)

            enqueueSnackbar(adminLoginResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (adminLoginResponse.status) {

                localStorage.setItem("token", adminLoginResponse.data.token);

                navigate("/");

            }
        } catch (err) {
            
            enqueueSnackbar('Token telah expired', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });
        
        }
    
    };


    return (

        <div>
            <Container>
                <Row className="warehouse-row-login">
                    <Col className="col-12 col-lg-6 warehouse-col-login">
                        <h2>Login <Image src="https://img.icons8.com/external-flat-juicy-fish/60/null/external-peace-hands-and-gestures-flat-flat-juicy-fish.png" /></h2>
                        <p>Login untuk informasi lebih lanjut</p>
                        <Form className="warehouse-form-login">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control className="warehouse-form-email" type="email" ref={emailField} placeholder="Masukkan email mu" autoComplete="off" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control className="warehouse-form-password" type="text" ref={passwordField} placeholder="Masukkan password mu" autoComplete="off" />
                            </Form.Group>
                        </Form>
                        <Row>
                            <Col className="col-6 col-lg-6 warehouse-content-link-register">
                                <Link className="warehouse-content-hyperlink" to="/register">
                                    <p>Belum Punya Akun?</p>
                                </Link>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="col-12 col-lg-12 warehouse-content-loggedin d-flex justify-content-start">
                                <Button onClick={onLogin}>
                                    <p>Login</p>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="col-12 col-lg-6 warehouse-login-image">
                        <Image src={LoginImage} />
                    </Col>
                </Row>
            </Container>
        </div>

    );
};

export default Login;