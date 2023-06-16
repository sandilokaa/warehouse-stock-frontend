import React, { useEffect, useState, useRef } from "react";
import {
    Container,
    Button,
    Table,
    Form,
    Row,
    Col,
    InputGroup,
    Modal
} from "react-bootstrap";
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


    /* -------------------- Delete Category -------------------- */

    const { enqueueSnackbar } = useSnackbar();

    const onDeleteCategoryById = async (id) => {

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

                window.location.reload("/categories-data")

            }

        } catch (err) {

            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

        }

    };

    /* -------------------- End Delete Category -------------------- */


    /* --------------------Get Category By Id -------------------- */

    const [showFormCategory, setShowFormCategory] = useState(false);
    const [categoryDataById, setCategoryDataById] = useState([]);

    const handleCloseFormCategory = () => setShowFormCategory(false);

    const handleShowFormCategory = async (id) => {

        const token = localStorage.getItem("token");

        const categoryDataRequest = await axios.get(
            `http://localhost:2000/v1/category/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const getCategoryByIdResponse = await categoryDataRequest.data;

        setCategoryDataById(getCategoryByIdResponse.data.category_by_id);

        setShowFormCategory(true);

        localStorage.setItem("id", id);

        return id;

    };

    /* -------------------- End Get Category By Id -------------------- */


    /* -------------------- Update Category By Id -------------------- */

    const categoryNameField = useRef();

    const onUpdateCategory = async () => {

        try {

            const token = localStorage.getItem("token");
            const id = localStorage.getItem("id")

            const updateCategoryPayload = {
                categoryName: categoryNameField.current.value
            };

            const updateCategoryRequest = await axios.put(
                `http://localhost:2000/v1/category/update/${id}`,
                updateCategoryPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*"
                    },
                }
            );

            const updateCategoryResponse = updateCategoryRequest.data;

            enqueueSnackbar(updateCategoryResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (updateCategoryResponse.status) {

                localStorage.removeItem("id")
                
                window.location.reload("/categories-data")

            }

        } catch (err) {

            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

        }

    };

    /* -------------------- End Update Category By Id -------------------- */

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
                    {category.map((category, index) =>
                        <tbody key={category.id}>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{category.categoryName}</td>
                                <td>
                                    <i className="bi bi-trash" onClick={() => onDeleteCategoryById(category.id)}></i>
                                    <i className="bi bi-pencil-square" onClick={() => handleShowFormCategory(category.id)}></i>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </Table>


                {/* ----------------- Modal Form Category ----------------- */}

                <Modal show={showFormCategory} onHide={handleCloseFormCategory} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Form Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Category Name</Form.Label>
                                <Form.Control type="text" autoComplete="off" defaultValue={categoryDataById ? categoryDataById.categoryName : null} ref={categoryNameField}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFormCategory}>
                            Close
                        </Button>
                        <Button variant="success" onClick={onUpdateCategory}>
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

