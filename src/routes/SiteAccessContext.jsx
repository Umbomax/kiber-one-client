import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const SiteAccessContext = createContext(null);

export function SiteAccessProvider({ children }) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [state, setState] = useState({ loading: true, authorized: false });

    const refresh = useCallback(async () => {
        try {
            const r = await fetch(`${apiUrl}/public/site-access/status`, {
                credentials: "include",
            });

            if (!r.ok) {
                setState({ loading: false, authorized: false });
                return;
            }

            const data = await r.json().catch(() => ({ authorized: false }));
            setState({ loading: false, authorized: Boolean(data.authorized) });
        } catch {
            setState({ loading: false, authorized: false });
        }
    }, [apiUrl]);

    useEffect(() => {
        refresh();

        const onFocus = () => refresh();
        const onVisibility = () => {
            if (!document.hidden) refresh();
        };

        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onVisibility);

        const intervalId = setInterval(() => {
            refresh();
        }, 10000);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [refresh]);

    const login = useCallback(
        async (password) => {
            try {
                const r = await fetch(`${apiUrl}/public/site-access/login`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password }),
                });

                const data = await r.json().catch(() => ({}));
                if (!r.ok) {
                    return { ok: false, message: data.message || "Неверный пароль" };
                }

                setState({ loading: false, authorized: true });
                return { ok: true };
            } catch {
                return { ok: false, message: "Ошибка сети. Попробуйте позже." };
            }
        },
        [apiUrl]
    );

    const logout = useCallback(async () => {
        try {
            await fetch(`${apiUrl}/public/site-access/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch {}
        setState({ loading: false, authorized: false });
    }, [apiUrl]);

    return <SiteAccessContext.Provider value={{ ...state, refresh, login, logout }}>{children}</SiteAccessContext.Provider>;
}

export function useSiteAccess() {
    return (
        useContext(SiteAccessContext) || {
            loading: true,
            authorized: false,
            refresh: () => {},
            login: async () => ({ ok: false }),
            logout: async () => {},
        }
    );
}
