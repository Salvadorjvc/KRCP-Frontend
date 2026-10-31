import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function Header(){

    const {user, logout} = useAuth();

    return( 

      <header className= "flex flex-nowrap">

           <div>
               <Link className="logo" to= "/dashboard">KRCP</Link>
           </div>

           <nav>
             <ul className="flex flex-nowrap">
                 <li className="decoration solid">
                    <Link to="/dashboard">Inicio</Link>
                 </li>
                 <li className="decoration solid">
                    <Link to="/nosotros">Nosotros</Link>
                 </li>
                 <li className="decoration solid">
                   <Link to="/proyectos">Proximos proyectos</Link>
                 </li>
             </ul>
           </nav>

           <div className="flex items-center">
            <span>Bienvenido, <strong>{user?.nombreCompleto}</strong> | {user?.nombreRol}</span>
           </div>

            <button onClick={logout}>Cerrar sesion</button>
       </header>
    );    
}

export default Header;