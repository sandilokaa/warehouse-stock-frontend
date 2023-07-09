import React, { useState, useEffect, useRef } from "react";
import {
    Container,
    Table,
    InputGroup,
    Button,
    Form,
    Row,
    Col,
    Card
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import axios from "axios";
import CurrencyFormatter from "../../assets/js/currencyFormatter";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const SalesData = () => {

    const navigate = useNavigate();


    /* -------------------- Get Product Sale -------------------- */

    const [productSaleData, setProductSaleData] = useState([]);
    const [accumulateTotalData, setAccumulateTotalData] = useState();

    const transactionCodeFieldToSearch = useRef();

    const onSearch = async () => {

        const token = localStorage.getItem("token");

        const getProductSaleDataByTransactionCode = transactionCodeFieldToSearch.current.value;

        const productSaleDataRequest = await axios.get(
            `http://localhost:2000/v1/sales/transaction/search?transactionCode=${getProductSaleDataByTransactionCode}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const getProductSale = await productSaleDataRequest.data;

        setProductSaleData(getProductSale.data.get_all_product_sale);
    };

    useEffect(() => {

        onSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* -------------------- End Get Product Sale -------------------- */


    /* -------------------- Get Product Sale By Sale Id -------------------- */

    const [accumulateData, setAccumulateData] = useState();

    const handleGetProductSaleBySaleId = async (saleId) => {

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

            const getProductSaleDataResponse = getProductSaleDataRequest.data.data.product_sale_by_sale_id;

            const getSubTotal = []

            getSubTotal.push(...getProductSaleDataResponse.map(item => item.subTotal));

            const convertedSubTotal = getSubTotal.map(item => parseFloat(item));

            const total = convertedSubTotal.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            setAccumulateData(total);

            return getProductSaleDataResponse;

        } catch (err) {

            alert(err.message);

        }

    };

    /* -------------------- End Get Product Sale By Sale Id -------------------- */


    /* -------------------- Handle Create Nota Product Sale By Id -------------------- */

    const createPDFToProductSale = async (saleId) => {

        const productSaleDataBySaleId = await handleGetProductSaleBySaleId(saleId)

        if (productSaleDataBySaleId) {

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

            tableData.push(['No', 'Nama', 'Kategori', 'Jumlah', 'Harga Beli', 'SubTotal']);

            productSaleDataBySaleId.map((item, index) => {
                return tableData.push([index + 1, item.product.name, item.product.category.categoryName, item.quantity, CurrencyFormatter(item.product.price), CurrencyFormatter(item.subTotal)]);
            });

            tableData.push([`Total`, ``, ``, ``, ``, `${CurrencyFormatter(accumulateData)}`]);

            const startY = 50;

            doc.autoTable({
                head: tableData.slice(0, 1),
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


    /* -------------------- Handle Download Sale Report -------------------- */

    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (e) => {

        const selectedDateValue = e.target.value;

        setSelectedDate(selectedDateValue);

    };


    const handleGetProductBySalesDate = async () => {

        const token = localStorage.getItem("token");

        const productSaleDataRequest = await axios.get(
            `http://localhost:2000/v1/sales/transaction/search?salesDate=${selectedDate}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const getedDataBySalesDate = await productSaleDataRequest.data.data.get_all_product_sale;

        return getedDataBySalesDate;

    };

    const createPDFToSaleReport = async () => {

        const getedDataBySalesDate = await handleGetProductBySalesDate()

        if (getedDataBySalesDate) {

            const doc = new jsPDF();

            /* ------ Set Title ------ */

            doc.setFont('Times New Roman');
            doc.setFontSize(14);
            doc.text('WarehouseHub', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

            doc.setFont('Times New Roman');
            doc.setFontSize(12);
            doc.text('Laporan Harian Data Produk Terjual', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

            doc.setFont('Times New Roman');
            doc.setFontSize(12);
            doc.text(`${selectedDate}`, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

            doc.setFont('Times New Roman');
            doc.setFontSize(12);
            doc.text('Jalan Balai Rakyat 10, Jakarta Timur, DKI Jakarta', doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });

            /* ------ End Set Title ------ */

            /* ------ Set Table ------ */

            const tableData = []

            tableData.push(['No', 'Transaction Code', 'Customer', 'Sale Date', 'Total']);

            getedDataBySalesDate.map((item, index) => {
                return tableData.push([index + 1, item.transactionCode, item.customer, item.salesDate]);
            });

            const startY = 60;

            doc.autoTable({
                head: tableData.slice(0, 1),
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

            doc.save('sale-report-note.pdf', { autoDownload: false });

        }
    };

    /* -------------------- End Handle Download Sale Report -------------------- */


    return (

        <HomeLayout>
            <Container>

                <Row>
                    <Col className="col-12 col-lg-6 d-flex justify-content-start">
                        <Button className="btn btn-add-transaction" onClick={() => navigate('/add-product-sale')}> Add Transaction </Button>
                    </Col>
                    <Col className="col-12 col-lg-6 d-flex justify-content-end">
                        <InputGroup className="mb-3 warehouse-search-group">
                            <Form.Control
                                className="warehouse-search-control"
                                placeholder="Cari transaksi disini..."
                                aria-label="Cari transaksi disini..."
                                aria-describedby="basic-addon2"
                                ref={transactionCodeFieldToSearch}
                            />
                            <Button id="button-addon2" onClick={onSearch}>
                                Search
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>

                <Row>
                    <Col className="col-12 col-lg-4 download-sale-report">
                        <Card style={{ width: '100%' }}>
                            <Card.Body>
                                <Card.Title>Download Sale Report</Card.Title>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Control type="date" autoComplete="off" value={selectedDate} onChange={handleDateChange} />
                                </Form.Group>
                                <Button className="btn btn-download-sale-report" onClick={createPDFToSaleReport}> Download </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Table striped bordered hover className="warehouse-product-sale-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Transaction Code</th>
                            <th>Customer</th>
                            <th>Transaction Type</th>
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
                                <td>{productSale.customer}</td>
                                <td>{productSale.transactionType}</td>
                                <td>{productSale.salesDate}</td>
                                <td>
                                    {
                                        CurrencyFormatter(productSale.salesProducts.reduce((total, item) => {
                                            const productPrice = item.product.price;
                                            const quantity = item.quantity;
                                            const subtotal = productPrice * quantity;
                                            return total + subtotal;
                                        }, 0))
                                    }
                                </td>
                                <td>
                                    <Link to={`/sales-data/${productSale.id}/detail`}>
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

