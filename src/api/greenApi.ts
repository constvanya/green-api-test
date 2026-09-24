import type {
    AuthData,
    SendMessageRequest,
    SendMessageResponse,
    ReceiveNotificationResponse,
    DeleteNotificationResponse,
} from '../types';

const API_URL = 'https://api.green-api.com';

class GreenApiClient {
    private idInstance: string;
    private apiTokenInstance: string;

    constructor(auth: AuthData) {
        this.idInstance = auth.idInstance;
        this.apiTokenInstance = auth.apiTokenInstance;
    }

    private getUrl(method: string): string {
        return `${API_URL}/waInstance${this.idInstance}/${method}/${this.apiTokenInstance}`;
    }

    async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
        const response = await fetch(this.getUrl('sendMessage'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Ошибка отправки: ${response.status} — ${error}`);
        }

        return response.json();
    }

    async receiveNotification(): Promise<ReceiveNotificationResponse | null> {
        const response = await fetch(this.getUrl('receiveNotification'), {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Ошибка получения уведомлений: ${response.status}`);
        }

        const text = await response.text();

        if (!text || text === 'null') {
            return null;
        }

        return JSON.parse(text) as ReceiveNotificationResponse;
    }

    async deleteNotification(receiptId: number): Promise<DeleteNotificationResponse> {
        const url = `${API_URL}/waInstance${this.idInstance}/deleteNotification/${encodeURIComponent(this.apiTokenInstance)}/${receiptId}`;

        const response = await fetch(url, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Ошибка удаления уведомления: ${response.status}`);
        }

        return response.json();
    }
}

export default GreenApiClient;