import { useState } from 'react';
import styles from './MessageInput.module.css';

interface Props {
    onSend: (text: string) => Promise<void>;
    disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: Props) {
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || sending || disabled) return;

        setSending(true);
        try {
            await onSend(text.trim());
            setText('');
        } catch (err) {
            console.error('Ошибка отправки:', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введите сообщение..."
                className={styles.input}
                disabled={disabled || sending}
            />
            <button
                type="submit"
                className={styles.button}
                disabled={!text.trim() || sending || disabled}
            >
                {sending ? '...' : 'Отправить'}
            </button>
        </form>
    );
}