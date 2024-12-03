import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

@Injectable()
export class SlackService {
  private slackClient: WebClient;

  constructor() {
    this.slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  async sendMessage(channel: string, text: string) {
    try {
      const response = await this.slackClient.chat.postMessage({
        channel,
        text,
      });
      console.log('Message sent: ', response);
      return response;
    } catch (error) {
      console.error('Error sending message to Slack: ', error);
      throw error;
    }
  }
}
