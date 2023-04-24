export interface IRabbitMQService {
  sendEmailNotification(email: string, message: string): Promise<void>;
  onApplicationShutdown(signal?: string): Promise<void>;
  closeConnection(): Promise<void>;
}
