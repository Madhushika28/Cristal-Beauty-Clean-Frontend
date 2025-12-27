import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import { ProductPage } from "./productPage";
import ProductOverview from "./admin/productOverview";
import CartPage from "./cart";
import CheckoutPage from "./checkout";
import AboutPage from "./aboutPage";
import ContactUsPage from "./contactUs";
import HomeContent from "./homeContent";

export default function HomePage() {
    return (
        <div className="w-full h-full bg-primary ">
            <Header/>
            <Routes path="/">
                <Route path="/" element={<HomeContent/>}/>
                <Route path="/products" element={<ProductPage/>}/>
                <Route path="/contact" element={<ContactUsPage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/overview/:id" element={<ProductOverview/>}/>
                <Route path="/cart" element={<CartPage/>}/>
                <Route path="/checkout" element={<CheckoutPage/>}/>
                <Route path="/*" element={<h1>404 - Page Not Found</h1>}/>
            </Routes>
            </div>
    )
}