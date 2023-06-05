import React from "react";
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import ProductsData from "./pages/productsData/productsData";
import SellingsData from "./pages/sellingsData/sellingsData";
import { SnackbarProvider } from 'notistack';

const roots = document.getElementById('root');
const root = createRoot(roots);

root.render(
    <Router>
        <SnackbarProvider maxSnack={3}>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/products-data" element={<ProductsData />}></Route>
                <Route path="/sellings-data" element={<SellingsData />}></Route>
            </Routes>
        </SnackbarProvider>
    </Router>
);