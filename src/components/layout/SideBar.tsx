import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {SIDEBAR_MENU} from "@/config/navigation";

function SideBar(){
    const { hasRole } = useAuth();
    const location = useLocation();

    const itemsVisibles = SIDEBAR_MENU.filter((item) => hasRole(item.roles));

    return (
        <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col">
            <nav className=" flex-1 p-4">
                <ul className="space-y-1">
                    {itemsVisibles.map((item) =>{
                        const isActive = location.pathname === item.path;

                        return(
                            <li key={item.path}>
                                <Link 
                                to = {item.path}
                                className={`block px-4 py-2 rounded ${
                                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                                }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    );
}

export default SideBar;