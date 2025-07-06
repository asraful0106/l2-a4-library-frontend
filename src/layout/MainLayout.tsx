import Footer from "@/components/shared/Footer";
import Navigation from "@/components/shared/Navigation";
import { Outlet } from "react-router";
import {ToastContainer} from "react-toastify";

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen min-w-screen">
            <Navigation />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="flex-1">
                <Outlet />
            </div>
            <Footer/>
        </div>
    );
};

export default MainLayout;