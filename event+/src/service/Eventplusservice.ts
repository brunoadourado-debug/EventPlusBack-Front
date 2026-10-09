import axiosInstance from "./api";

import type { Evento } from "../types/api";

export const eventoService = {
    async listar(){
        const { data } = await axiosInstance.get<Evento[]>("Evento/ListarEvento")
        return data
    },

    async listar_proximos() {
        const { data } = await axiosInstance.get<Evento[]>("Evento/ListarProximos")
        return data
    },

    async buscar(id: string) {
        const { data } = await axiosInstance.get<Evento>(`Evento/${id}`)
        return data
    },
}