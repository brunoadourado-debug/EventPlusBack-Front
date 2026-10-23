import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../page/home/Home"
import Eventos from "../page/home/Evento/evento";

import DetalhesEvento from "../page/home/DetalhesEvento/DetalhesEvento";
import Login from "../page/Login/login";
import Usuarios from "../page/Usuarios/Usuarios";
import TiposEvento from "../page/tipoEvento/tipoEvento";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/home" element={<Home/>}/>

            <Route path="/eventos" element={<Eventos/>}/>

            <Route path="/eventos/:id" element={<DetalhesEvento/>}></Route>

            <Route path="/login" element={<Login/>}></Route>

            <Route path="/usuarios" element={<Usuarios/>}></Route>

            <Route path="/tipoEvento" element={<TiposEvento/>}></Route>

            <Route path="*" element={<Navigate to="/home" replace/>}/>
        </Routes>
    )
}

export default AppRoutes;