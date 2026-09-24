import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types';
import styles from './ChatWindow.module.css';

interface Props {
    messages: ChatMessage[];
    isPolling: boolean;
}

export function ChatWindow({ messages, isPolling }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={styles.window}>
            <div className={styles.header}>
                <span className={styles.chatName}>Чат</span>
                <span className={styles.status}>
          {isPolling ? '🟢 Получение сообщений активно' : '🔴 Ожидание'}
        </span>
            </div>

            <div className={styles.messages}>
                {messages.length === 0 && (
                    <div className={styles.empty}>
                        Сообщений пока нет. Напишите первое сообщение!
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${styles.message} ${
                            msg.isOutgoing ? styles.outgoing : styles.incoming
                        }`}
                    >
                        {!msg.isOutgoing && msg.senderName && (
                            <span className={styles.senderName}>{msg.senderName}</span>
                        )}
                        <span className={styles.text}>{msg.text}</span>
                        <span className={styles.time}>
              {new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
              })}
            </span>
                    </div>
                ))}

                <div ref={bottomRef} />
            </div>
        </div>
    );
}