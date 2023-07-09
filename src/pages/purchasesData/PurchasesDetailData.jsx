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


const PurchasesDetailData = () => {

    const navigate = useNavigate();

    const params = useLocation();

    const purchaseId = (params.pathname).split('/')[2];

    const [productPurchaseData, setProductPurchaseData] = useState([]);
    const [accumulateData, setAccumulateData] = useState();

    const onSearch = async () => {

        try {

            const token = localStorage.getItem("token");

            const getProductPurchaseDataRequest = await axios.get(
                `http://localhost:2000/v1/purchases/${purchaseId}/product-purchase/search`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*"
                    }
                }
            );

            const getProductPurchaseDataResponse = getProductPurchaseDataRequest.data;

            const getSubTotal = []
            
            getSubTotal.push(...getProductPurchaseDataResponse.data.product_purchase_by_purchase_id.map(item => item.subTotal));

            const convertedSubTotal = getSubTotal.map(item => parseFloat(item));
            
            const total = convertedSubTotal.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            setAccumulateData(total)

            setProductPurchaseData(getProductPurchaseDataResponse.data.product_purchase_by_purchase_id);

        } catch (err) {

            alert(err.message);

        }

    };

    useEffect(() => {

        onSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [purchaseId]);

    return (

        <HomeLayout>
            <Container>

                <Button className="btn btn-back-page" onClick={() => navigate('/purchases-data')}> Back To Sales Page </Button>

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
                        productPurchaseData.map((item, index) =>
                            <tbody key={item.id}>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item ? item.product.name : null}</td>
                                    <td>{item ? item.product.category.categoryName : null}</td>
                                    <td>{item ? item.quantity : null}</td>
                                    <td>{item ? CurrencyFormatter(item.purchasePrice) : null}</td>
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

export default PurchasesDetailData;

