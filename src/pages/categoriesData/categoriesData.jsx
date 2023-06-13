import React, { useEffect, useState, useRef } from "react";
import {
    Container,
    Button,
    Table,
    Modal,
    Form,
    Row,
    Col,
    InputGroup
} from "react-bootstrap";
// import { useNavigate, Link } from "react-router-dom";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import axios from "axios";
import { useSnackbar } from 'notistack';


const CategoriesData = () => {


    /* -------------------- Get Category -------------------- */

    const [category, setCategory] = useState([]);

    const nameField = useRef();

    const onSearch = async () => {

        const getCategoryData = nameField.current.value;

        const token = localStorage.getItem("token");

        const categoriesDataRequest = await axios.get(
            `http://localhost:2000/v1/category/search?categoryName=${getCategoryData}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const getCategory = await categoriesDataRequest.data.data.get_all_category;

        setCategory(getCategory);
    };


    useEffect(() => {
        
        onSearch();

    }, []);

    /* -------------------- Get Category -------------------- */


    /* -------------------- Get Id Category -------------------- */

    const fetchIdFromTable = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                'http://localhost:2000/v1/category/search',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*"
                    },
                }
            );

            const id = response.data.data.get_all_category[0].id;

            console.log(id)

            return id;

        } catch (error) {

            console.log('Error fetching ID:', error);

            return null;

        }

    };

    /* -------------------- End Get Id Category -------------------- */


    /* -------------------- Delete Category -------------------- */

    const { enqueueSnackbar } = useSnackbar();

    const [showFormCategory, setShowFormCategory] = useState(false);

    const handleCloseFormCategory = () => setShowFormCategory(false);
    const handleShowFormCategory = () => setShowFormCategory(true);


    const onDeleteCategoryById = async () => {

        const id = await fetchIdFromTable();
        const token = localStorage.getItem("token");

        try {

            const categoriesDataRequest = await axios.delete(
                `http://localhost:2000/v1/category/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const deletedCategoryResponse = await categoriesDataRequest.data;

            enqueueSnackbar(deletedCategoryResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (deletedCategoryResponse.status) {

                handleCloseFormCategory();

                window.location.reload("/categories-data")

            }

        } catch (err) {

            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

        }

    };

    /* -------------------- End Delete Category -------------------- */

    return (

        <HomeLayout>

            <Container>

                <Row>
                    <Col className="col-12 col-lg-5 warehouse-search-col">
                        <InputGroup className="mb-3 warehouse-search-group">
                            <Form.Control
                                className="warehouse-search-control"
                                placeholder="Cari category disini..."
                                aria-label="Cari category disini..."
                                aria-describedby="basic-addon2"
                                ref={nameField}
                            />
                            <Button id="button-addon2" onClick={onSearch}>
                                Search
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>

                <Table striped bordered hover className="warehouse-categories-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Category Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {category.map((category) =>
                        <tbody key={category.id}>
                            <tr>
                                <td>{category.id}</td>
                                <td>{category.categoryName}</td>
                                <td>
                                    <i className="bi bi-trash" onClick={handleShowFormCategory}></i>
                                    <i className="bi bi-pencil-square"></i>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </Table>

                {/* ----------------- Modal Form Category ----------------- */}

                <Modal show={showFormCategory} onHide={handleCloseFormCategory} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Yakin untuk menghapus category ini?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFormCategory}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={onDeleteCategoryById}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* ----------------- End Modal Form Category ----------------- */}

            </Container>

        </HomeLayout>

    );

};

export default CategoriesData;

