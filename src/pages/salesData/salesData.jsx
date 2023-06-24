import React, { useState, useEffect } from "react";
import {
    Container,
    Table
} from "react-bootstrap";
import { Link } from "react-router-dom";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import axios from "axios";
import CurrencyFormatter from "../../assets/js/currencyFormatter";


const SalesData = () => {


    /* -------------------- Get Product Sale -------------------- */

    const [productSaleData, setProductSaleData] = useState([]);

    const onSearch = async () => {

        const token = localStorage.getItem("token");

        const productSaleDataRequest = await axios.get(
            `http://localhost:2000/v1/sales/search`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const getProductSale = await productSaleDataRequest.data.data.get_all_product_sale;

        setProductSaleData(getProductSale);
    };

    useEffect(() => {

        onSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* -------------------- End Get Product Sale -------------------- */

    return (

        <HomeLayout>
            <Container>
                <Table striped bordered hover className="warehouse-product-sale-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Transaction Code</th>
                            <th>Sale Date</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {productSaleData.map((productSale, index) =>
                        <tbody key={productSale.id}>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{productSale.transactionCode}</td>
                                <td>{productSale.salesDate}</td>
                                <td>{CurrencyFormatter(productSale.subTotal)}</td>
                                <td>
                                    <Link to={`/sales-data/detail/${productSale.id}`}>
                                        <i className="bi bi-info-circle"></i>
                                    </Link>
                                    <i className="bi bi-filetype-pdf"></i>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </Table>
            </Container>
        </HomeLayout>

    );

};

export default SalesData;

