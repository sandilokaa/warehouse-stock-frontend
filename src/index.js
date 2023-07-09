import React from "react";
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import ProductsData from "./pages/productsData/ProductsData";
import SalesData from "./pages/salesData/SalesData";
import CategoriesData from "./pages/categoriesData/CategoriesData";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AveragesData from "./pages/averagesData/AveragesData";
import SalesDetailData from "./pages/salesData/SalesDetailData";
import PurchasesDetailData from "./pages/purchasesData/PurchasesDetailData";
import PurchasesData from "./pages/purchasesData/PurchasesData";
import AddProductSale from "./pages/salesData/AddProductSale";
import AddProductPurchase from "./pages/purchasesData/AddProductPurchase";
import { SnackbarProvider } from 'notistack';

const roots = document.getElementById('root');
const root = createRoot(roots);

root.render(
    <Router>
        <SnackbarProvider maxSnack={3}>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/products-data" element={<ProductsData />}></Route>
                <Route path="/categories-data" element={<CategoriesData />}></Route>
                <Route path="/sales-data" element={<SalesData />}></Route>
                <Route path="/purchases-data" element={<PurchasesData />}></Route>
                <Route path="/add-product-sale" element={<AddProductSale />}></Route>
                <Route path="/add-product-purchase" element={<AddProductPurchase />}></Route>
                <Route path="/sales-data" element={<SalesDetailData />}>
                    <Route path=":saleId/detail" element={<SalesDetailData />} />
                </Route>
                <Route path="/purchases-data" element={<PurchasesDetailData />}>
                    <Route path=":purchaseId/detail" element={<PurchasesDetailData />} />
                </Route>
                <Route path="/averages-data" element={<AveragesData />}></Route>
                <Route path="/login" element={<Login />}></Route> 
                <Route path="/register" element={<Register />}></Route> 
            </Routes>
        </SnackbarProvider>
    </Router>
);