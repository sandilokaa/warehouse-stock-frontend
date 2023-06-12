import React, { useEffect, useState, useRef } from "react";
import {
    Row,
    Col,
    Container,
    Image,
    Button,
    Table
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import CurrencyFormatter from "../../assets/js/currencyFormatter";
import axios from "axios";


const ProductsData = () => {

    /* -------------------- Get Product -------------------- */

    const [productData, setProductData] = useState([]);

    useEffect(() => {

        const productsData = async () => {

            const token = localStorage.getItem("token");

            const productsDataRequest = await axios.get(
                `http://localhost:2000/v1/products/search`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const getProduct = await productsDataRequest.data.data.get_all_product;

            setProductData(getProduct);
        };

        productsData();

    }, []);

    /* -------------------- End Get Product -------------------- */


    return (

        <HomeLayout>

            <Container>
                <Table striped bordered hover className="warehouse-categories-table">
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
                                    <i className="bi bi-trash"></i>
                                    <i className="bi bi-pencil-square"></i>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </Table>
            </Container>

        </HomeLayout>

    );

};

export default ProductsData;

