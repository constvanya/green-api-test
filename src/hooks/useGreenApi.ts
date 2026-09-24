import { useCallback, useEffect, useRef, useState } from 'react';
import GreenApiClient from '../api/greenApi';
import type { AuthData, ChatMessage } from '../types';

export function useGreenApi(auth: AuthData | null) {
    const clientRef = useRef<GreenApiClient | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isPolling, setIsPolling] = useState(false);
    const pollingRef = useRef<boolean>(false);

    useEffect(() => {
        if (auth?.idInstance && auth?.apiTokenInstance) {
            clientRef.current = new GreenApiClient(auth);
        } else {
            clientRef.current = null;
        }
    }, [auth]);

    const sendMessage = useCallback(async (chatId: string, text: string) => {
        if (!clientRef.current) throw new Error('Клиент не инициализирован');

        const result = await clientRef.current.sendMessage({
            chatId,
            message: text,
        });

        setMessages((prev) => [
            ...prev,
            {
                id: result.idMessage,
                text,
                isOutgoing: true,
                timestamp: Date.now(),
            },
        ]);

        return result;
    }, []);

    const startPolling = useCallback(() => {
        if (!clientRef.current || pollingRef.current) return;

        pollingRef.current = true;
        setIsPolling(true);

        const poll = async () => {
            if (!pollingRef.current || !clientRef.current) return;

            try {
                const notification = await clientRef.current.receiveNotification();

                if (notification) {
                    const { receiptId, body } = notification;

                    await clientRef.current.deleteNotification(receiptId);

                    if (
                        body.typeWebhook === 'incomingMessageReceived' &&
                        body.messageData?.typeMessage === 'textMessage'
                    ) {
                        const text =
                            body.messageData.textMessageData?.textMessage ?? '';

                        setMessages((prev) => [
                            ...prev,
                            {
                                id: body.idMessage,
                                text,
                                isOutgoing: false,
                                timestamp: body.timestamp * 1000,
                                senderName: body.senderData?.senderName,
                            },
                        ]);
                    }
                }
            } catch (err) {
                console.error('Ошибка polling:', err);
            }

            if (pollingRef.current) {
                setTimeout(poll, 1500);
            }
        };

        poll();
    }, []);

    const stopPolling = useCallback(() => {
        pollingRef.current = false;
        setIsPolling(false);
    }, []);

    useEffect(() => {
        return () => {
            pollingRef.current = false;
        };
    }, []);

    return {
        messages,
        setMessages,
        sendMessage,
        startPolling,
        stopPolling,
        isPolling,
    };
}