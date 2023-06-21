import React, { useState, useEffect } from "react";
import {
    Container,
    Table
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import axios from "axios";
import CurrencyFormatter from "../../assets/js/currencyFormatter";


const SalesDetailData = () => {

    const params = useLocation();

    const id = (params.pathname).split('/')[3];

    const [productSaleData, setProductSaleData] = useState();


    const onSearch = async () => {

        try {

            const token = localStorage.getItem("token");

            const getProductSaleDataRequest = await axios.get(
                `http://localhost:2000/v1/sales/search/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*"
                    }
                }
            );

            const getProductSaleDataResponse = getProductSaleDataRequest.data;

            setProductSaleData(getProductSaleDataResponse.data.product_sale_by_id);

        } catch (err) {

            alert(err.message);

        }

    };

    useEffect(() => {

        onSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (

        <HomeLayout>
            <Container>
                <Table striped bordered hover className="warehouse-product-sale-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Product Name</th>
                            <th>Product Category</th>
                            <th>Quantity</th>
                            <th>Product Price</th>
                            <th>Sub Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>{ productSaleData ? productSaleData.product.name : null}</td>
                            <td>{ productSaleData ? productSaleData.product.category.categoryName : null}</td>
                            <td>{ productSaleData ? productSaleData.quantity : null}</td>
                            <td>{ productSaleData ? CurrencyFormatter(productSaleData.product.price) : null }</td>
                            <td>{ productSaleData ? CurrencyFormatter(productSaleData.subTotal) : null}</td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </HomeLayout>

    );

};

export default SalesDetailData;

