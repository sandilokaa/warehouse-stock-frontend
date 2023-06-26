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
import jsPDF from 'jspdf';
import 'jspdf-autotable';


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


    /* -------------------- Handle Get Product Sale By Id -------------------- */

    const handleGetProductSaleById = async (id) => {

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

            const getProductSaleDataResponse = getProductSaleDataRequest.data.data.product_sale_by_id;

            return getProductSaleDataResponse;

        } catch (err) {

            alert(err.message);

        }

    };

    /* -------------------- End Handle Get Product Sale By Id -------------------- */


    /* -------------------- Handle Create Nota Product Sale By Id -------------------- */

    const createPDFToProductSale = async (id) => {

        const productSaleDataByid = await handleGetProductSaleById(id)

        if (productSaleDataByid) {

            const doc = new jsPDF();

            /* ------ Set Title ------ */

            doc.setFont('Times New Roman');
            doc.setFontSize(14);
            doc.text('WarehouseHub', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

            doc.setFont('Times New Roman');
            doc.setFontSize(12);
            doc.text('Laporan Data Produk Terjual', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

            doc.setFont('Times New Roman');
            doc.setFontSize(12);
            doc.text('Jalan Balai Rakyat 10, Jakarta Timur, DKI Jakarta', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

            /* ------ End Set Title ------ */

            /* ------ Set Table ------ */

            const tableData = []
            tableData.push(['No', 'Nama', 'Kategori', 'Jumlah', 'Harga Beli', 'Total' ]);
            tableData.push([1, productSaleDataByid.product.name, productSaleDataByid.product.category.categoryName, productSaleDataByid.quantity, CurrencyFormatter(productSaleDataByid.product.price), CurrencyFormatter(productSaleDataByid.subTotal)]);
            const startY = 50;

            doc.autoTable({
                head:  tableData.slice(0,1),
                body: tableData.slice(1),
                startY: startY,
                margin: { top: startY + 15 },
                theme: 'grid',
                headStyles: { fillColor: [0, 0, 0] },
                alternateRowStyles: { fillColor: [235, 235, 235] },
                columnStyles: { 0: { cellWidth: 15 } },
            });

            /* ------ End Set Table ------ */

            /* ------ Unduh dokumen PDF ------ */

            doc.save('product-sale-note.pdf', { autoDownload: false });

        }
    };

    /* -------------------- End Handle Create Nota Product Sale By Id -------------------- */


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
                                    <i className="bi bi-filetype-pdf" onClick={() => createPDFToProductSale(productSale.id)}></i>
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

