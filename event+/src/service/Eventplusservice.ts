import { axiosInstance } from "./api";
import {
    type UsuarioPayload,
    type Presenca,
    type Evento,
    type PresencaPayload,
    type LoginPayload,
    type LoginResponse,
    type Usuario,
    type Comentario,
    type TipoEvento,
    type Instituicao,
    type TipoUsuario} from "../types/api";
import Usuarios from "../page/Usuarios/Usuarios";

export const authService = {
    async login(payload: LoginPayload) {
        const { data } = await axiosInstance.post<LoginResponse>("Login", payload);
        return data;
    }
};

export const usuarioService = {
    async listar() {
        const { data } = await axiosInstance.get<Usuario[]>("Usuario/Listar");
        return data;
    },

    async buscar(id: string) {
        const { data } = await axiosInstance.get<Usuario>(`Usuario/${id}`);
        return data;
    },

    async cadastrar(payload: UsuarioPayload) {
        const { data } = await axiosInstance.post<Usuario>("Usuario", payload);
        return data;
    },

    async atualizar(id: string, payload: UsuarioPayload) {
        const { data } = await axiosInstance.patch<Usuario>(`Usuario/${id}`, payload);
        return data;
    },

    async deletar(id: string) {
        await axiosInstance.delete(`Usuario/${id}`);
    }
};

export const eventoService = {
    async listar() {
        const { data } = await axiosInstance.get<Evento[]>("Evento/ListarEvento");
        return data;
    },

    async listar_proximos() {
        const { data } = await axiosInstance.get<Evento[]>("Evento/ListarProximos");
        return data;
    },

    async buscar(id: string) {
        const { data } = await axiosInstance.get<Evento>(`Evento/${id}`);
        return data;
    },

    async cadastrar(evento: Partial<Evento>) {
        const { data } = await axiosInstance.post<Evento>("Evento", evento);
        return data;
    },

    async atualizar(id: string, evento: Partial<Evento>) {
        const { data } = await axiosInstance.put<Evento>(`Evento/${id}`, evento);
        return data;
    },

    async deletar(id: string) {
        await axiosInstance.delete(`Evento/${id}`);
    }
};

export const presencaService = {
    async listar() {
        const { data } = await axiosInstance.get<Presenca[]>("Presenca");
        return data;
    },

    async listarMinhas(usuarioId: string) {
        const { data } = await axiosInstance.get<Presenca[]>(
            `Presenca/ListarPresencaPorId/${usuarioId}`
        );
        return data;
    },

    
    async buscarPorUsuario(usuarioId: string) {
        const { data } = await axiosInstance.get<Presenca[]>(
            `Presenca/ListarPresencaPorId/${usuarioId}`
        );
        return data;
    },

    async cadastrar(payload: PresencaPayload) {
        const { data } = await axiosInstance.post<Presenca>("Presenca", payload);
        return data;
    },

    async atualizar(presencaId: string, payload: Partial<PresencaPayload>) {
        const { data } = await axiosInstance.put<Presenca>(`Presenca/${presencaId}`, payload);
        return data;
    },

    async deletar(presencaId: string) {
        await axiosInstance.delete(`Presenca/${presencaId}`);
    }
};



export const comentarioService = {
    async listarPorEvento(eventoId: string) {
        const { data } = await axiosInstance.get<Comentario[]>(`Comentario/ListarPorEventoId/${eventoId}`);
        return data;
    },

    async cadastrar(comentario: Partial<Comentario>) {
        const { data } = await axiosInstance.post<Comentario>("Comentario", comentario);
        return data;
    },

    async deletar(id: string) {
        await axiosInstance.delete(`ComentariosEvento/${id}`);
    }
};

export const tipoEventoService = {
    async listar() {
        const { data } = await axiosInstance.get<TipoEvento[]>("TipoEvento");
        return data;
    },

    async buscar(id: string) {
        const { data } = await axiosInstance.get<TipoEvento>(`TipoEvento/${id}`);
        return data;
    },

    async cadastrar(tipoEvento: Partial<TipoEvento>) {
        const { data } = await axiosInstance.post<TipoEvento>("TipoEvento", tipoEvento);
        return data;
    },

    async atualizar(id: string, tipoEvento: Partial<TipoEvento>) {
        const { data } = await axiosInstance.put<TipoEvento>(`TipoEvento/${id}`, tipoEvento);
        return data;
    },

    async deletar(id: string) {
        await axiosInstance.delete(`TipoEvento/${id}`);
    }
};

export const instituicaoService = {
    async listar() {
        const { data } = await axiosInstance.get<Instituicao[]>("Instituicao");
        return data;
    },

    async buscar(id: string) {
        const { data } = await axiosInstance.get<Instituicao>(`Instituicao/${id}`);
        return data;
    },

    async cadastrar(instituicao: Partial<Instituicao>) {
        const { data } = await axiosInstance.post<Instituicao>("Instituicao", instituicao);
        return data;
    },

    async atualizar(id: string, instituicao: Partial<Instituicao>) {
        const { data } = await axiosInstance.put<Instituicao>(`Instituicao/${id}`, instituicao);
        return data;
    },

    async deletar(id: string) {
        await axiosInstance.delete(`Instituicao/${id}`);
    }
};

function tipoService<T extends {titulo : string}>(endpoint:string)
{
return{
    async listar()
    {
        const { data } = await axiosInstance.get<T[]>(endpoint);
        return data;
    },
    async cadastrar(titulo:string){
        const {data} = await axiosInstance.post<T>(endpoint, titulo);
        return data;
    },

    async atualizar(id:string, titulo:string){
        await axiosInstance.put(`${endpoint}/${id}`, {titulo})
    },
    async excluir(id: string){
        await axiosInstance.delete(`${endpoint}/${id}`)
    }
}
}

export const tipoUsuarioService = tipoService<TipoUsuario>("TipoEvento");