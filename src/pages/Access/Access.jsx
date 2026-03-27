import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSiteAccess } from "../../routes/SiteAccessContext";
import styles from "./Access.module.css";

function Access() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { loading, authorized, login } = useSiteAccess();

    useEffect(() => {
        if (!loading && authorized) {
            navigate("/main", { replace: true });
        }
    }, [loading, authorized, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const pwd = password.trim();
        if (!pwd) {
            setError("Введите пароль");
            return;
        }

        setSubmitting(true);
        const result = await login(pwd);
        setSubmitting(false);

        if (!result.ok) {
            setError(result.message || "Неверный пароль");
            return;
        }

        navigate("/main", { replace: true });
    };

    if (loading) return null;

    return (
        <div className={styles.page}>
            <form className={styles.card} onSubmit={handleSubmit}>
                <h1 className={styles.title}>Вход на сайт</h1>
                <p className={styles.subtitle}>Введите пароль, который вы получили у администратора.</p>

                <input
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                    autoFocus
                    required
                />

                {error ? <p className={styles.error}>{error}</p> : null}

                <button type="submit" className={styles.button} disabled={submitting}>
                    {submitting ? "Проверка..." : "Войти"}
                </button>
            </form>
        </div>
    );
}

export default Access;
