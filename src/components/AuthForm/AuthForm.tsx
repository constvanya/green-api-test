import { useState } from 'react';
import type { AuthData } from '../../types';
import styles from './AuthForm.module.css';

interface Props {
    onAuth: (data: AuthData) => void;
}

export function AuthForm({ onAuth }: Props) {
    const [idInstance, setIdInstance] = useState('');
    const [apiTokenInstance, setApiTokenInstance] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!idInstance.trim() || !apiTokenInstance.trim()) return;
        onAuth({
            idInstance: idInstance.trim(),
            apiTokenInstance: apiTokenInstance.trim(),
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>GREEN-API Мессенджер</h1>
                <p className={styles.subtitle}>
                    Введите данные из личного кабинета GREEN-API
                </p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="idInstance">idInstance</label>
                        <input
                            id="idInstance"
                            type="text"
                            placeholder="Например: 1101000001"
                            value={idInstance}
                            onChange={(e) => setIdInstance(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="apiTokenInstance">apiTokenInstance</label>
                        <input
                            id="apiTokenInstance"
                            type="text"
                            placeholder="Ваш API-токен"
                            value={apiTokenInstance}
                            onChange={(e) => setApiTokenInstance(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <button type="submit" className={styles.button}>
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}