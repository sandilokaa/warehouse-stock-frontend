import React, { useEffect, useState, useRef } from "react";
import {
    Row,
    Col,
    Container,
    Button,
    Form,
    Modal
} from "react-bootstrap";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import axios from "axios";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import CurrencyFormatter from "../../assets/js/currencyFormatter";
import { useSnackbar } from 'notistack';


const AveragesData = () => {

    /* -------------------- Form Add OpnameData -------------------- */

    const [showFormOpnameData, setShowFormOpnameData] = useState(false);

    const handleCloseFormOpnameData = () => setShowFormOpnameData(false);
    const handleShowFormOpnameData = () => setShowFormOpnameData(true);

    /* -------------------- End Form Add OpnameData -------------------- */


    /* -------------------- Create Opname Data -------------------- */

    const { enqueueSnackbar } = useSnackbar();

    const [selectedProductOpname, setSelectedProductOpnameProduct] = useState('');
    const [selectedDateProductOpname, setSelectedDateProductOpnameProduct] = useState('');

    const handleProductOpnameChange = (e) => {

        const selectedProductOpnameValue = e.target.value;

        setSelectedProductOpnameProduct(selectedProductOpnameValue);

    };

    const handleDateProductOpnameChange = (e) => {

        const selectedDateProductOpnameValue = e.target.value;

        setSelectedDateProductOpnameProduct(selectedDateProductOpnameValue);

    };

    const initialInventoryField = useRef();
    const opnamePriceField = useRef();

    const handleCreateOpnameData = async () => {

        try {

            const token = localStorage.getItem("token");

            const adminToCreateProductOpnamePayload = {
                productId: selectedProductOpname,
                opnameDate: selectedDateProductOpname,
                initialInventory: initialInventoryField.current.value,
                opnamePrice: opnamePriceField.current.value
            };

            const createdProductOpnameRequest = await axios.post(
                `http://localhost:2000/v1/opnames/create`,
                adminToCreateProductOpnamePayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const createdProductOpnameResponse = createdProductOpnameRequest.data;

            enqueueSnackbar(createdProductOpnameResponse.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });

            if (createdProductOpnameResponse.status) {

                handleCloseFormOpnameData();

                window.location.reload("/averages-data");

            }

        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });
        }

    };


    /* -------------------- End Create Opname Data -------------------- */


    /* -------------------- Get Product -------------------- */

    const [productData, setProductData] = useState([]);

    const onSearch = async () => {

        const token = localStorage.getItem("token");

        const productsDataRequest = await axios.get(
            `http://localhost:2000/v1/products/search`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const getProduct = await productsDataRequest.data.data.get_all_product;

        setProductData(getProduct);
    };

    useEffect(() => {

        onSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* -------------------- End Get Product -------------------- */

    // /* -------------------- Get Product -------------------- */

    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const handleProductChange = (e) => {

        const selectedProductValue = e.target.value;

        setSelectedProduct(selectedProductValue);

    };

    const handleMonthChange = (e) => {

        const selectedMonthValue = e.target.value;

        setSelectedMonth(selectedMonthValue);

    };

    const handleYearChange = (e) => {

        const selectedYearValue = e.target.value;

        setSelectedYear(selectedYearValue);

    };

    const onSearchAverage = async () => {

        const token = localStorage.getItem("token");

        const productsDataRequest = await axios.get(
            `http://localhost:2000/v1/opnames/search?productId=${selectedProduct}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const productSaleDataRequest = await axios.get(
            `http://localhost:2000/v1/sales/transaction/search?salesDate=${selectedYear}-${selectedMonth}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const productPurchaseDataRequest = await axios.get(
            `http://localhost:2000/v1/purchases/transaction/search?purchaseDate=${selectedYear}-${selectedMonth}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

        const getProductPurchaseResponse = await productPurchaseDataRequest.data.data.get_all_product_purchase;

        const getProductSale = await productSaleDataRequest.data.data.get_all_product_sale;

        const getProduct = await productsDataRequest.data.data.get_all_opname_data;

        const mergedData = {
            products: getProduct,
            productsSales: getProductSale,
            productsPurchases: getProductPurchaseResponse
        }

        return mergedData
    };

    // /* -------------------- End Get Product -------------------- */


    // /* -------------------- Handle Download Average Report -------------------- */

    const createPDFToAverageReport = async () => {

        const getedDataByAverageDate = await onSearchAverage();

        const getProductData = getedDataByAverageDate.products[0];

        if (getedDataByAverageDate) {

            const doc = new jsPDF();

            /* ------ Set Title ------ */

            doc.setFont('Times-Roman');
            doc.setFontSize(14);
            doc.text('WarehouseHub', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

            doc.setFont('Times-Roman');
            doc.setFontSize(12);
            doc.text('Laporan Kartu Stok Persediaan (Average)', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

            doc.setFont('Times-Roman');
            doc.setFontSize(12);
            doc.text('Jalan Balai Rakyat 10, Jakarta Timur, DKI Jakarta', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

            doc.setFont('Times-Roman');
            doc.setFontSize(12);
            doc.text(`Nama Barang: ${getProductData.product.name}`, 12, 50);

            /* ------ End Set Title ------ */

            /* ------ Set Table ------ */

            const startY = 60;

            const rowStyle = {
                fillColor: "#f2f2f2",
                textColor: "#000000",
                lineWidth: 0.05,
                lineColor: "#000000",
            };

            const tableConfig = {
                startY: startY,
                margin: { top: startY + 15 },
                theme: 'grid',
                styles: rowStyle,
            };

            let tableData = [];

            // Inisialisasi variabel totalBalanceDifference, totalDifferenceInUnits, dan totalPriceDifference
            let totalBalanceDifference = 0;
            let totalDifferenceInUnits = 0;
            let totalPriceDifference = 0;

            // Mengisi data ke dalam tableData
            getedDataByAverageDate.products.forEach((item) => {
                tableData.push([
                    item.opnameDate,
                    "Persediaan Awal",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    item.initialInventory,
                    item.opnamePrice,
                    item.initialInventory * item.opnamePrice,
                ]);
            });

            getedDataByAverageDate.productsSales.forEach((item) => {
                item.salesProducts.forEach((value) => {
                    if (value.productId.toString() === selectedProduct) {
                        const unit = value.quantity;
                        const prevUnit = tableData[tableData.length - 1][8];
                        const differenceInUnits = prevUnit - unit;

                        const priceDifference = tableData[tableData.length - 1][9];

                        const price = unit * priceDifference;
                        const prevPrice = tableData[tableData.length - 1][10];
                        const balanceDifference = prevPrice - price;

                        totalDifferenceInUnits = differenceInUnits;
                        totalBalanceDifference = balanceDifference;
                        totalPriceDifference = priceDifference;

                        let averagePrice = parseInt((totalBalanceDifference / totalDifferenceInUnits).toFixed(0));

                        tableData.push([
                            item.salesDate,
                            item.transactionType,
                            "",
                            "",
                            "",
                            unit,
                            priceDifference,
                            price,
                            totalDifferenceInUnits,
                            averagePrice,
                            totalBalanceDifference,
                        ]);
                    }
                });
            });

            getedDataByAverageDate.productsPurchases.forEach((item) => {
                item.purchasesProducts.forEach((value) => {
                    if (value.productId.toString() === selectedProduct) {
                        const unit = value.quantity;
                        const prevUnit = tableData[tableData.length - 1][8];
                        const differenceInUnits = prevUnit + unit;

                        const price = unit * value.purchasePrice;
                        const prevPrice = tableData[tableData.length - 1][10];
                        const balanceDifference = prevPrice - price;

                        totalDifferenceInUnits = differenceInUnits;
                        totalBalanceDifference = balanceDifference;

                        let averagePrice = parseInt((balanceDifference / differenceInUnits).toFixed(0));

                        tableData.push([
                            item.purchaseDate,
                            item.transactionType,
                            unit,
                            value.purchasePrice,
                            price,
                            "",
                            "",
                            "",
                            totalDifferenceInUnits,
                            averagePrice,
                            totalBalanceDifference,
                        ]);
                    }
                });
            });

            const sortedTableData = [...tableData];

            sortedTableData.sort((a, b) => {
                const dateA = new Date(a[0]);
                const dateB = new Date(b[0]);
                return dateA - dateB;
            });

            const sortedDataOnly = [];
            
            sortedTableData.forEach((item, index) => {
                if (index === 0) {
                    sortedDataOnly.push([
                        item[0],
                        item[1],
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        item[8],
                        item[9],
                        item[10],
                    ]);
                    totalBalanceDifference = item[10];
                    totalDifferenceInUnits = item[8];
                    totalPriceDifference = item[9];
                } else {

                    if (item[1] === 'Penjualan') {
                        const prevItem = sortedTableData[index - 1];
                        const prevUnit = prevItem[8];
                        const unitSale = item[5];
                        const priceDifference = prevItem[9];
                        const price = unitSale * priceDifference;
                        const prevPrice = prevItem[10];
                        const balanceDifference = prevPrice - price;
                        const differenceInUnits = prevUnit - unitSale;

                        totalDifferenceInUnits = differenceInUnits;
                        totalBalanceDifference = balanceDifference;

                        let averagePrice = parseInt((balanceDifference / differenceInUnits).toFixed(0));

                        item[8] = totalDifferenceInUnits;
                        item[9] = averagePrice;
                        item[10] = totalBalanceDifference;
                        sortedDataOnly.push([
                            item[0],
                            item[1],
                            "",
                            "",
                            "",
                            item[5],
                            priceDifference,
                            price,
                            totalDifferenceInUnits,
                            averagePrice,
                            totalBalanceDifference,
                        ]);
                    } else if (item[1] === 'Pembelian') {
                        const prevItem = sortedTableData[index - 1];
                        const prevUnit = prevItem[8];
                        const unitPurchase = item[2];
                        const price = unitPurchase * item[3];
                        const prevPrice = prevItem[10];
                        const balanceDifference = prevPrice + price;
                        const differenceInUnits = prevUnit + unitPurchase;

                        totalDifferenceInUnits = differenceInUnits;
                        totalBalanceDifference = balanceDifference;

                        let averagePrice = parseInt((balanceDifference / differenceInUnits).toFixed(0));

                        item[8] = totalDifferenceInUnits;
                        item[9] = averagePrice;
                        item[10] = totalBalanceDifference;
                        sortedDataOnly.push([
                            item[0],
                            item[1],
                            item[2],
                            item[3],
                            item[4],
                            "",
                            "",
                            "",
                            totalDifferenceInUnits,
                            averagePrice,
                            totalBalanceDifference,
                        ]);
                    }
                }
            });

            doc.autoTable({
                ...tableConfig,
                head: [
                    [
                        { content: "", colSpan: 2, styles: { halign: "center" } },
                        { content: "Pembelian", colSpan: 3, styles: { halign: "center" } },
                        { content: "Penjualan", colSpan: 3, styles: { halign: "center" } },
                        { content: "Saldo", colSpan: 3, styles: { halign: "center" } },
                    ],
                    ["Tanggal", "Keterangan", "Unit", "Harga", "Saldo", "Unit", "Harga", "Saldo", "Unit", "Harga", "Saldo"],
                ],
                body: sortedDataOnly
            });

            /* ------ End Set Table ------ */

            /* ------ Unduh dokumen PDF ------ */

            doc.save('average-report-note.pdf', { autoDownload: false });

        }
    };

    // /* -------------------- End Handle Download Average Report -------------------- */

    return (

        <HomeLayout>

            <Container>
                <div className="average-method">
                    <Row>
                        <Col className="col-12 col-lg-4 extend-product-sale">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Add Opname Data</Form.Label>
                                <Button className="btn btn-add-opname" onClick={handleShowFormOpnameData}> Add Opname Data </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-12 col-lg-4 extend-product-sale">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Select className="mb-3" aria-label="Default select example" value={selectedProduct} onChange={handleProductChange}>
                                    <option>Product</option>
                                    {productData.map((data) =>
                                        <option value={data.id} key={data.id}>{data.name}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col className="col-12 col-lg-4 extend-product-sale">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Month</Form.Label>
                                <Form.Select className="mb-3" aria-label="Default select example" value={selectedMonth} onChange={handleMonthChange}>
                                    <option>Month</option>
                                    <option value="01">Januari</option>
                                    <option value="02">Februari</option>
                                    <option value="03">Maret</option>
                                    <option value="04">April</option>
                                    <option value="05">Mei</option>
                                    <option value="06">Juni</option>
                                    <option value="07">Juli</option>
                                    <option value="08">Agustus</option>
                                    <option value="09">September</option>
                                    <option value="10">Oktober</option>
                                    <option value="11">November</option>
                                    <option value="12">Desember</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col className="col-12 col-lg-4 extend-product-sale">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Year</Form.Label>
                                <Form.Select className="mb-3" aria-label="Default select example" value={selectedYear} onChange={handleYearChange}>
                                    <option>Year</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="2019">2019</option>
                                    <option value="2018">2018</option>
                                    <option value="2017">2017</option>
                                    <option value="2016">2016</option>
                                    <option value="2015">2015</option>
                                    <option value="2014">2014</option>
                                    <option value="2013">2013</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="average-method">
                        <Col className="col-12 col-lg-12">
                            <Button className="btn btn-download-average" onClick={createPDFToAverageReport}> Download </Button>
                        </Col>
                    </Row>
                </div>

                {/* ----------------- Modal Form Create OpnameData ----------------- */}

                <Modal show={showFormOpnameData} onHide={handleCloseFormOpnameData} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Form Opname Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Product</Form.Label>
                                <Form.Select className="mb-3" aria-label="Default select example" value={selectedProductOpname} onChange={handleProductOpnameChange}>
                                    <option>Product</option>
                                    {productData.map((data) =>
                                        <option value={data.id} key={data.id}>{data.name}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Opname Date</Form.Label>
                                <Form.Control type="date" autoComplete="off" value={selectedDateProductOpname} onChange={handleDateProductOpnameChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Initial Inventory</Form.Label>
                                <Form.Control type="number" placeholder="Example: 300" autoComplete="off" ref={initialInventoryField} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Opname Price</Form.Label>
                                <Form.Control type="number" placeholder="Example: 3000000" autoComplete="off" ref={opnamePriceField} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFormOpnameData}>
                            Close
                        </Button>
                        <Button variant="success" onClick={handleCreateOpnameData}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* ----------------- End Modal Form Create Product ----------------- */}

            </Container >

        </HomeLayout >

    );

};

export default AveragesData;

