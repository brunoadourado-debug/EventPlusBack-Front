import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import type { AuthSession, LoginPayload } from "../types/api";
import { SESSION_STORAGE_KEY, UNAUTHORIZED_EVENT } from "../service/api";
import { authService, usuarioService } from "../service/Eventplusservice";
import { AuthContext } from "./Auth";

function readSession(): AuthSession | null {
    try {
        const value = localStorage.getItem(SESSION_STORAGE_KEY);
        if (!value) return null;

        const session = JSON.parse(value) as AuthSession;

       
        if (!session?.token || !session?.usuario) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            return null;
        }

    
        if (session.expiracao) {
            const expTime = new Date(session.expiracao).getTime();
            
           
            if (Number.isNaN(expTime) || expTime <= Date.now()) {
                localStorage.removeItem(SESSION_STORAGE_KEY);
                return null;
            }
        }

        return session;
    } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
    }
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<AuthSession | null>(() => readSession());
    const initialSession = useRef(session);
    const [carregandoSessao, setCarregandoSessao] = useState(Boolean(session));

    function persist(next: AuthSession | null) {
        setSession(next);
        if (next) {
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
        } else {
            localStorage.removeItem(SESSION_STORAGE_KEY);
        }
    }

    async function atualizarUsuario() {
        if (!session) return;
        const usuario = await usuarioService.buscar(session.usuario.usuarioId);
        persist({ ...session, usuario });
    }

    async function login(payload: LoginPayload) {
        const loginResponse = await authService.login(payload);
        const baseSession: AuthSession = loginResponse;
        persist(baseSession);

        try {
            const usuario = await usuarioService.buscar(loginResponse.usuario.usuarioId);
            persist({ ...baseSession, usuario });
        } catch {
            
        }
    }

    function logout() {
        persist(null);
    }

   
    useEffect(() => {
        const handleUnauthorized = () => persist(null);

        window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

        return () => {
            window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
        };
    }, []);

   
    useEffect(() => {
        const restored = initialSession.current;

        if (!restored) {
            setCarregandoSessao(false);
            return;
        }

        usuarioService
            .buscar(restored.usuario.usuarioId)
            .then((usuario) => {
                const next = { ...restored, usuario };
                persist(next);
            })
            .catch(() => {
                persist(null); 
            })
            .finally(() => {
                setCarregandoSessao(false);
            });
    }, []); 

    const perfil = session?.usuario.tipoUsuario?.titulo.toLowerCase() ?? "";

    return (
        <AuthContext.Provider
            value={{
                session,
                usuario: session?.usuario ?? null,
                perfil,
                autenticado: Boolean(session),
                carregandoSessao,
                login,
                logout,
                atualizarUsuario,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}