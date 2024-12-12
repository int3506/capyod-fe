import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import PricingPage from "./pages/PricingPage";
import StorePage from "./pages/StorePage";
import ProductPage from "./pages/ProductPage";
import TranferProducts from "./pages/TranferProducts";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./components/store-components/Dashboard";
import MyProducts from "./components/store-components/MyProducts";
import Products from "./components/store-components/Products";
import MyOrders from "./components/store-components/MyOrders";
import PaymentsPage from "./components/store-components/wallet/PaymentsPage";
import PaymentsDetails from "./components/store-components/wallet/PaymentsDetails";
import Transactions from "./components/store-components/wallet/Transactions";
import Withdrawals from "./components/store-components/wallet/Withdrawals";
import { Navigate } from "react-router-dom";
import PopularProducts from "./components/Catalog/PopularProducts";
import StarterEssentials from "./components/Catalog/StarterEssentials";
import HotNewProducts from "./components/Catalog/HotNewProducts";
import Header from "./components/Catalog/Header";
import DesignPage from "./pages/DesignPage";
import { AuthProvider } from "./contexts/AuthContext";
import BuyPage from "./pages/BuyPage";
import UsersPage from "./pages/UsersPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/users" element={<UsersPage />} />
            {/* <Route path="/*" element={<Navigate to="home" replace />} /> */}
            <Route path="/store" element={<StorePage />}>
              <Route index element={<Navigate to="products" replace />} />
              {/* <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="catalog"
                element={
                  <div>
                    <Header />
                    <PopularProducts />
                    <StarterEssentials />
                    <HotNewProducts />
                  </div>
                }
              /> */}
              <Route path="products" element={<MyProducts />} />
              <Route path="products/create" element={<DesignPage />} />
              <Route
                path="products/preview/:id"
                element={<DesignPage isPreview={true} />}
              />
              <Route path="products/edit/:id" element={<DesignPage />} />
              <Route
                path="products/buy/:id"
                element={<BuyPage buyItem={true} />}
              />
              <Route
                path="orders/info/:id"
                element={<BuyPage isPreview={true} />}
              />
              <Route path="orders/edit/:id" element={<BuyPage />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="wallet" element={<PaymentsPage />}>
                <Route path="details" element={<PaymentsDetails />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="withdrawals" element={<Withdrawals />} />
                <Route path="*" element={<Navigate to="details" replace />} />
              </Route>
              <Route path="*" element={<Navigate to="products" replace />} />
            </Route>
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/products" element={<ProductPage />}>
              <Route path=":productType" element={<Products />} />
            </Route>
            <Route path="/TranferProducts" element={<TranferProducts />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
