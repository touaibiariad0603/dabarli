import { Routes,Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "@clerk/clerk-react";
import DashboardPage from "./pages/DashboardPage"
import ProductsPage from "./pages/ProductsPage"
import OrdersPage from "./pages/OrdersPage"
import CustomersPage from "./pages/CustomerPage"
import DashboardLayout from "./Layouts/DashboardLayout";

import PageLoader from "./components/PageLoader";
import { useAxios } from "./lib/useAxios";
import CategorysPage from "./pages/CategorysPage"
import SubCategoriesPage from "./pages/SubCategoriesPage"


function App() {
  const {isSignedIn, isLoaded} = useAuth();
   useAxios(); 
  if (!isLoaded) return <PageLoader/>;

  return (
    <Routes>
      <Route path="/login" element={isSignedIn ? <Navigate to={"/dashboard"}/> : <LoginPage/>}/>
     
      <Route path="/" element={isSignedIn ? <DashboardLayout/> : <Navigate to={"/login"}/>}>
        <Route index element={<Navigate to={"dashboard"}/>}/>
        <Route path="dashboard" element={<DashboardPage/>}/>
        <Route path="products" element={<ProductsPage/>}/>
        <Route path="categorys" element={<CategorysPage/>}/>
        <Route path="subcategories" element={<SubCategoriesPage/>}/>
        <Route path="orders" element={<OrdersPage/>}/>
        <Route path="customers" element={<CustomersPage/>}/>
  
      </Route>
    </Routes>
  );
}

export default App;