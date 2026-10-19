import axios from 'axios';

export const SESSION_STORAGE_KEY = "eventplus:session"
export const UNAUTHORIZED_EVENT = "eventplus:unauthorized"

export class ApiError extends Error
{
    status?: number;
    validationErrors?:Record<string,string[]>;

    constructor(
        message: string,
        status?: number,
        validationErrors?: Record<string, string[]>,
    ){
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.validationErrors = validationErrors;
    }
}

export const axiosInstance = axios.create({
    baseURL: 'https://localhost:7182/api/',
    timeout: 15000,
    headers: {
        Accept: "application/json"
    }
});

export function getApiErrormessage(error: unknown)
{
    return error instanceof ApiError ? error.message : "Ocorreu um erro inesperado. Tente novamente"
}