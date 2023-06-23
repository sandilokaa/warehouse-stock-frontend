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


    /* -------------------- Create PDF -------------------- */

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
            // const tableSpacing = 10;
            // const startX = doc.internal.pageSize.getWidth() / 2;
            const startY = 50;
            // const cellWidth = 40;
            // const cellHeight = 10;


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

    /* -------------------- End Create PDF -------------------- */


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
                                        kategory dengan klik button "Download" di bawah ini.
                                    </Card.Text>
                                    <Button className="btn btn-download"> Download </Button>
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
                                    <Button className="btn btn-download"> Download </Button>
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

