import {type FormEvent, useState} from 'react';
import { useGreenApi } from './hooks/useGreenApi';
import type { AuthData } from './types';
import styles from './App.module.css';
import {AuthForm} from "./components/AuthForm/AuthForm.tsx";
import {ChatWindow} from "./components/ChatWindow/ChatWindow.tsx";
import {MessageInput} from "./components/MessageInput/MessageInput.tsx";

export default function App() {
    const [auth, setAuth] = useState<AuthData | null>(null);
    const [chatId, setChatId] = useState('');
    const [chatCreated, setChatCreated] = useState(false);

    const { messages, sendMessage, startPolling, stopPolling, isPolling } =
        useGreenApi(auth);

    const handleAuth = (data: AuthData) => {
        setAuth(data);
    };

    const handleCreateChat = (e: FormEvent) => {
        e.preventDefault();
        if (!chatId.trim()) return;
        setChatCreated(true);
        startPolling();
    };

    const handleSend = async (text: string) => {
        if (!chatId.trim()) return;
        await sendMessage(chatId.trim(), text);
    };

    const handleLogout = () => {
        stopPolling();
        setAuth(null);
        setChatCreated(false);
        setChatId('');
    };

    if (!auth) {
        return <AuthForm onAuth={handleAuth} />;
    }

    if (!chatCreated) {
        return (
            <div className={styles.chatSetup}>
                <div className={styles.setupCard}>
                    <h2 className={styles.setupTitle}>Новый чат</h2>
                    <p className={styles.setupSubtitle}>
                        Введите chatId получателя. Для Telegram — числовой ID (например, <code>123456789</code>),
                    </p>
                    <form onSubmit={handleCreateChat} className={styles.setupForm}>
                        <input
                            type="text"
                            placeholder="123456789"
                            value={chatId}
                            onChange={(e) => setChatId(e.target.value)}
                            className={styles.setupInput}
                        />
                        <button type="submit" className={styles.setupButton}>
                            Создать чат
                        </button>
                    </form>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        Выйти
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.app}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <span className={styles.sidebarTitle}>GREEN-API</span>
                    <button onClick={handleLogout} className={styles.sidebarLogout}>
                        Выйти
                    </button>
                </div>
                <div className={styles.chatItem}>
                    <div className={styles.avatar} />
                    <div className={styles.chatInfo}>
                        <span className={styles.contactName}>{chatId}</span>
                        <span className={styles.lastMessage}>
              {messages.length > 0
                  ? messages[messages.length - 1].text.slice(0, 30)
                  : 'Нет сообщений'}
            </span>
                    </div>
                </div>
            </aside>

            <main className={styles.main}>
                <ChatWindow messages={messages} isPolling={isPolling} />
                <MessageInput onSend={handleSend} />
            </main>
        </div>
    );
}