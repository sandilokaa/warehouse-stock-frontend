import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Container,
    Button,
    Card
} from "react-bootstrap";
import HomeLayout from "../../layouts/home/HomeLayout";
import "../../assets/css/style.css";
import axios from "axios";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportsData = () => {


    /* -------------------- Get Product -------------------- */

    const [productData, setProductData] = useState([]);

    const handleGetDownloadProduct = async () => {

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

        const data = await productsDataRequest.data.data.get_all_product;

        setProductData(data);

    };

    useEffect(() => {

        handleGetDownloadProduct();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* -------------------- End Get Product -------------------- */


    /* -------------------- Get Category -------------------- */

    const [category, setCategory] = useState([]);

    const handleGetDownloadCategory = async () => {

        const token = localStorage.getItem("token");

        const categoriesDataRequest = await axios.get(
            `http://localhost:2000/v1/category/search`,
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
        
        handleGetDownloadCategory();

    }, []);

    /* -------------------- Get Category -------------------- */


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


    /* -------------------- Create PDF Product -------------------- */

    const createPDFToProductData = () => {

        let doc;

        if (!doc) {

            doc = new jsPDF();

            /* ------ Set Title ------ */

            doc.setFont('Times New Roman');
            doc.setFontSize(14);
            doc.text('WarehouseHub', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

            doc.setFont('Times New Roman');
            doc.setFontSize(12);
            doc.text('Laporan Data Produk', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

            doc.setFont('Times New Roman');
            doc.setFontSize(12);
            doc.text('Jalan Balai Rakyat 10, Jakarta Timur, DKI Jakarta', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

            /* ------ End Set Title ------ */

            /* ------ Set Table ------ */

            const tableHeaders = ['No', 'Nama', 'Kategori', 'Panjang', 'Stok', 'Price'];
            const tableData = productData.map((item, index) => [index + 1, item.name, item.category.categoryName, item.length, item.stock, item.price]);
            const startY = 50;

            doc.autoTable({
                head: [tableHeaders],
                body: tableData,
                startY: startY,
                margin: { top: startY + 15 },
                theme: 'grid',
                headStyles: { fillColor: [0, 0, 0] },
                alternateRowStyles: { fillColor: [235, 235, 235] },
                columnStyles: { 0: { cellWidth: 15 } },
            });

            /* ------ End Set Table ------ */

        }

        // Unduh dokumen PDF

        doc.save('product-reports.pdf', { autoDownload: false });
    };

    /* -------------------- End Create PDF Product -------------------- */


    /* -------------------- Create PDF Category -------------------- */

    const createPDFToCategoryData = () => {

        let doc;

        if (!doc) {

            doc = new jsPDF();

            /* ------ Set Title ------ */

            doc.setFont('Times New Roman');
            doc.setFontSize(14);
            doc.text('WarehouseHub', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

            doc.setFont('Times New Roman');
            doc.setFontSize(12);
            doc.text('Laporan Data Kategori', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

            doc.setFont('Times New Roman');
            doc.setFontSize(12);
            doc.text('Jalan Balai Rakyat 10, Jakarta Timur, DKI Jakarta', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

            /* ------ End Set Title ------ */

            /* ------ Set Table ------ */

            const tableHeaders = ['No', 'Nama'];
            const tableData = category.map((item, index) => [index + 1, item.categoryName]);
            const startY = 50;

            doc.autoTable({
                head: [tableHeaders],
                body: tableData,
                startY: startY,
                margin: { top: startY + 15 },
                theme: 'grid',
                headStyles: { fillColor: [0, 0, 0] },
                alternateRowStyles: { fillColor: [235, 235, 235] },
                columnStyles: { 0: { cellWidth: 15 } },
            });

            /* ------ End Set Table ------ */

        }

        // Unduh dokumen PDF

        doc.save('category-reports.pdf', { autoDownload: false });
    };
    
    /* -------------------- End Create PDF Category -------------------- */


    /* -------------------- Create PDF Product Sale -------------------- */

    const createPDFToProductSale = () => {

        let doc;

        if (!doc) {

            doc = new jsPDF();

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

            const tableHeaders = ['No', 'Nama', 'Kategori', 'Kode Transaksi', 'Tanggal', 'Total' ];
            const tableData = productSaleData.map((item, index) => [index + 1, item.product.name, item.product.category.categoryName, item.transactionCode, item.salesDate, item.subTotal]);
            const startY = 50;

            doc.autoTable({
                head: [tableHeaders],
                body: tableData,
                startY: startY,
                margin: { top: startY + 15 },
                theme: 'grid',
                headStyles: { fillColor: [0, 0, 0] },
                alternateRowStyles: { fillColor: [235, 235, 235] },
                columnStyles: { 0: { cellWidth: 15 } },
            });

            /* ------ End Set Table ------ */

        }

        // Unduh dokumen PDF

        doc.save('product-sale-reports.pdf', { autoDownload: false });
    };
    
    /* -------------------- End Create PDF Category Product Sale -------------------- */


    return (

        <HomeLayout>
            <div className="report-card">
                <Container className="card-download-report">
                    <Row>
                        <Col className="col-12 col-lg-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Download Product Reports</Card.Title>
                                    <Card.Text>
                                        Jika anda memerlukan, anda dapat memperoleh salinan dari laporan
                                        produk dengan klik button "Download" di bawah ini.
                                    </Card.Text>
                                    <Button className="btn btn-download" onClick={createPDFToProductData}> Download </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="col-12 col-lg-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Download Category Reports</Card.Title>
                                    <Card.Text>
                                        Jika anda memerlukan, anda dapat memperoleh salinan dari laporan
                                        kategori dengan klik button "Download" di bawah ini.
                                    </Card.Text>
                                    <Button className="btn btn-download" onClick={createPDFToCategoryData}> Download </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="col-12 col-lg-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Download Sale Reports</Card.Title>
                                    <Card.Text>
                                        Jika anda memerlukan, anda dapat memperoleh salinan dari laporan
                                        penjualan dengan klik button "Download" di bawah ini.
                                    </Card.Text>
                                    <Button className="btn btn-download" onClick={createPDFToProductSale}> Download </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </HomeLayout>

    );

};

export default ReportsData;

