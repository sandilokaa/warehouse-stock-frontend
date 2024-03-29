import React, { useState, useEffect } from "react";
import {
    Container,
    Table,
    Button
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import axios from "axios";
import CurrencyFormatter from "../../assets/js/currencyFormatter";


const SalesDetailData = () => {

    const navigate = useNavigate();

    const params = useLocation();

    const saleId = (params.pathname).split('/')[2];

    const [productSaleData, setProductSaleData] = useState([]);
    const [accumulateData, setAccumulateData] = useState();

    const onSearch = async () => {

        try {

            const token = localStorage.getItem("token");

            const getProductSaleDataRequest = await axios.get(
                `http://localhost:2000/v1/sales/${saleId}/product-sale/search`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*"
                    }
                }
            );

            const getProductSaleDataResponse = getProductSaleDataRequest.data;

            const getSubTotal = []
            
            getSubTotal.push(...getProductSaleDataResponse.data.product_sale_by_sale_id.map(item => item.subTotal));

            const convertedSubTotal = getSubTotal.map(item => parseFloat(item));
            
            const total = convertedSubTotal.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            setAccumulateData(total)

            setProductSaleData(getProductSaleDataResponse.data.product_sale_by_sale_id);

        } catch (err) {

            alert(err.message);

        }

    };

    useEffect(() => {

        onSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saleId]);

    return (

        <HomeLayout>
            <Container>

                <Button className="btn btn-back-page" onClick={() => navigate('/sales-data')}> Back To Sales Page </Button>

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
                    {
                        productSaleData.map((item, index) =>
                            <tbody key={item.id}>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item ? item.product.name : null}</td>
                                    <td>{item ? item.product.category.categoryName : null}</td>
                                    <td>{item ? item.quantity : null}</td>
                                    <td>{item ? CurrencyFormatter(item.product.price) : null}</td>
                                    <td>{item ? CurrencyFormatter(item.subTotal) : null}</td>
                                </tr>
                            </tbody>
                        )
                    }

                    <tbody>
                        <tr>
                            <td colSpan="5" className="text-center">Total</td>
                            <td>{CurrencyFormatter(accumulateData)}</td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </HomeLayout>

    );

};

export default SalesDetailData;

