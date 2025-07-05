import Footer from "@/components/shared/Footer";
import Navigation from "@/components/shared/Navigation";
import { Outlet } from "react-router";

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen min-w-screen">
            <Navigation />
            <div className="flex-grow">
                <Outlet />
            </div>
            <Footer/>
        </div>
    );
};

export default MainLayout;