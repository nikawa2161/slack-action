export interface SlackChannel {
  id: string;
  name: string;
}

export interface SlackReaction {
  name: string;
  count: number;
  users: string[];
}

export interface SlackMessage {
  user: string;
  ts: string;
  thread_ts?: string;
  text?: string;
  reply_count?: number;
  reactions?: SlackReaction[];
}

/**
 * Slack Block Kit のブロック型
 */
export interface SlackBlock {
  type: "section" | "divider" | "header" | "context";
  text?: {
    type: "mrkdwn" | "plain_text";
    text: string;
  };
}
