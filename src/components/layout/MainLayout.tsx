import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";

function MainLayout() {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <SideBar />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {/* Vista hija según la URL actual (por ejemplo la vista de rol) */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;