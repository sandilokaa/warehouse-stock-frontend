import React, { useState, useEffect, useRef } from "react";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
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
import axios from "axios";
import CurrencyFormatter from "../../assets/js/currencyFormatter";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const PurchasesData = () => {

    const navigate = useNavigate();

    /* -------------------- Get Product Purchase -------------------- */

    const [productPurchaseData, setProductPurchaseData] = useState([]);

    const transactionCodeFieldToSearch = useRef();

    const onSearch = async () => {

        const token = localStorage.getItem("token");

        const getProductPurchaseDataByTransactionCode = transactionCodeFieldToSearch.current.value;

        const productPurchaseDataRequest = await axios.get(
            `http://localhost:2000/v1/purchases/transaction/search?transactionCode=${getProductPurchaseDataByTransactionCode}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const getProductPurchaseResponse = await productPurchaseDataRequest.data;

        setProductPurchaseData(getProductPurchaseResponse.data.get_all_product_purchase);
    };

    useEffect(() => {

        onSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* -------------------- End Get Product Purchase -------------------- */


    /* -------------------- Get Product Purchase By Purchase Id -------------------- */
    const [accumulateData, setAccumulateData] = useState();

    const handleGetProductPurchaseByPurchaseId = async (purchaseId) => {

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

            const getProductPurchaseDataResponse = getProductPurchaseDataRequest.data.data.product_purchase_by_purchase_id;

            const getSubTotal = []

            getSubTotal.push(...getProductPurchaseDataResponse.map(item => item.subTotal));

            const convertedSubTotal = getSubTotal.map(item => parseFloat(item));

            const total = convertedSubTotal.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            setAccumulateData(total)

            return getProductPurchaseDataResponse;

        } catch (err) {

            alert(err.message);

        }

    };

    /* -------------------- End Get Product Purchase By Purchase Id -------------------- */


    // /* -------------------- Handle Create Nota Product Purchase By Id -------------------- */


    const createPDFToProductPurchase = async (purchaseId) => {

        const productPurchaseDataByPurchaseId = await handleGetProductPurchaseByPurchaseId(purchaseId);

        if (productPurchaseDataByPurchaseId) {

            const doc = new jsPDF();

            /* ------ Set Title ------ */

            doc.setFont('Times-Roman');
            doc.setFontSize(14);
            doc.text('WarehouseHub', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

            doc.setFont('Times-Roman');
            doc.setFontSize(12);
            doc.text('Laporan Data Pembelian Produk', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

            doc.setFont('Times-Roman');
            doc.setFontSize(12);
            doc.text('Jalan Balai Rakyat 10, Jakarta Timur, DKI Jakarta', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

            /* ------ End Set Title ------ */

            /* ------ Set Table ------ */

            const tableData = []

            tableData.push(['No', 'Nama', 'Kategori', 'Jumlah', 'Harga Beli', 'SubTotal']);

            productPurchaseDataByPurchaseId.map((item, index) => {
                return tableData.push([index + 1, item.product.name, item.product.category.categoryName, item.quantity, CurrencyFormatter(item.purchasePrice), CurrencyFormatter(item.subTotal)]);
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

            doc.save('product-purchase-note.pdf', { autoDownload: false });

        }
    };

    // /* -------------------- End Handle Create Nota Product Purchase By Id -------------------- */


    // /* -------------------- Handle Download Purchase Report -------------------- */

    const [selectedDate, setSelectedDate] = useState('');
    // const [accumulateTotalData, setAccumulateTotalData] = useState();

    const handleDateChange = (e) => {

        const selectedDateValue = e.target.value;

        console.log(selectedDateValue);

        setSelectedDate(selectedDateValue);

    };


    const handleGetProductByPurchaseDate = async () => {

        const token = localStorage.getItem("token");

        const productPurchaseDataRequest = await axios.get(
            `http://localhost:2000/v1/purchases/transaction/search?salesDate=${selectedDate}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const getedDataBySalesDate = await productPurchaseDataRequest.data.data.get_all_product_purchase;

        console.log(getedDataBySalesDate);

        return getedDataBySalesDate;

    };

    const createPDFToPurchaseReport = async () => {

        const getedDataByPurchaseDate = await handleGetProductByPurchaseDate()

        if (getedDataByPurchaseDate) {

            const doc = new jsPDF();

            /* ------ Set Title ------ */

            doc.setFont('Times-Roman');
            doc.setFontSize(14);
            doc.text('WarehouseHub', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

            doc.setFont('Times-Roman');
            doc.setFontSize(12);
            doc.text('Laporan Harian Data Pembelian Produk', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

            doc.setFont('Times-Roman');
            doc.setFontSize(12);
            doc.text(`${selectedDate}`, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

            doc.setFont('Times-Roman');
            doc.setFontSize(12);
            doc.text('Jalan Balai Rakyat 10, Jakarta Timur, DKI Jakarta', doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });

            /* ------ End Set Title ------ */

            /* ------ Set Table ------ */

            const tableData = []

            tableData.push(['No', 'Transaction Code', 'Transaction Type', 'Supplier', 'Purchase Date', 'Total']);

            getedDataByPurchaseDate.map((item, index) => {
                return tableData.push([index + 1, item.transactionCode, item.transactionType, item.supplier, item.purchaseDate]);
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

            // doc.save('purchase-report-note.pdf', { autoDownload: false });

        }
    };

    // /* -------------------- End Handle Download Purchase Report -------------------- */


    return (

        <HomeLayout>

            <Container>

                <Row>
                    <Col className="col-12 col-lg-6 d-flex justify-content-start">
                        <Button className="btn btn-add-transaction" onClick={() => navigate('/add-product-purchase')}> Add Transaction </Button>
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
                    <Col className="col-12 col-lg-4 download-purchase-report">
                        <Card style={{ width: '100%' }}>
                            <Card.Body>
                                <Card.Title>Download Purchase Report</Card.Title>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Control type="date" autoComplete="off" value={selectedDate} onChange={handleDateChange} />
                                </Form.Group>
                                <Button className="btn btn-download-purchase-report" onClick={createPDFToPurchaseReport} > Download </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Table striped bordered hover className="warehouse-product-purchase-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Transaction Code</th>
                            <th>Transaction Type</th>
                            <th>Sale Date</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {productPurchaseData.map((productPurchase, index) =>
                        <tbody key={productPurchase.id}>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{productPurchase.transactionCode}</td>
                                <td>{productPurchase.transactionType}</td>
                                <td>{productPurchase.purchaseDate}</td>
                                <td>
                                    {
                                        CurrencyFormatter(productPurchase.purchasesProducts.reduce((total, item) => {
                                            const purchasePrice = item.purchasePrice;
                                            const quantity = item.quantity;
                                            const subtotal = purchasePrice * quantity;
                                            return total + subtotal;
                                        }, 0))
                                    }
                                </td>
                                <td>
                                    <Link to={`/purchases-data/${productPurchase.id}/detail`}>
                                        <i className="bi bi-info-circle"></i>
                                    </Link>
                                    <i className="bi bi-filetype-pdf" onClick={() => createPDFToProductPurchase(productPurchase.id)}></i>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </Table>
            </Container>

        </HomeLayout>

    );

};

export default PurchasesData;

