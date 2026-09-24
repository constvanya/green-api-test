export interface AuthData {
    idInstance: string;
    apiTokenInstance: string;
}

export interface SendMessageRequest {
    chatId: string;
    message: string;
}

export interface SendMessageResponse {
    idMessage: string;
}

export interface ReceiveNotificationResponse {
    receiptId: number;
    body: NotificationBody;
}

export interface NotificationBody {
    typeWebhook: string;
    instanceData: {
        idInstance: number;
        wid: string;
        typeInstance: string;
    };
    timestamp: number;
    idMessage: string;
    senderData: {
        chatId: string;
        chatName: string;
        sender: string;
        senderName: string;
    };
    messageData: {
        typeMessage: string;
        textMessageData?: {
            textMessage: string;
        };
    };
}

export interface ChatMessage {
    id: string;
    text: string;
    isOutgoing: boolean;
    timestamp: number;
    senderName?: string;
}

export interface DeleteNotificationResponse {
    result: boolean;
}