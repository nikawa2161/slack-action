import { SlackChannel, SlackMessage } from "@/types";
import { WebClient } from "@slack/web-api";

const web = new WebClient(import.meta.env.VITE_SLACK_TOKEN);

export async function getChannels(
  searchTerms: string[]
): Promise<SlackChannel[]> {
  const response = await web.conversations.list({
    exclude_archived: true,
    limit: 999,
  });

  const channels = (response.channels || []) as SlackChannel[];
  const filteredChannels = channels.filter((channel) =>
    searchTerms.some((term) => channel.name?.includes(term))
  );

  return filteredChannels;
}

export async function getMessages(
  channelId: string,
  oldest: number,
  latest: number
): Promise<SlackMessage[]> {
  const response = await web.conversations.history({
    channel: channelId,
    oldest: oldest.toString(),
    latest: latest.toString(),
  });

  return (response.messages || []) as SlackMessage[];
}

export async function getReplies(
  channelId: string,
  threadTs: string
): Promise<SlackMessage[]> {
  const response = await web.conversations.replies({
    channel: channelId,
    ts: threadTs,
  });
  return (response.messages || []) as SlackMessage[];
}

export async function sendSlackMessage(
  channelId: string,
  blocks: any[]
): Promise<void> {
  // Slackへ投稿しない場合コメントアウト
  const result = await web.chat.postMessage({
    channel: channelId,
    blocks: blocks,
  });
  console.log("Message sent: ", result.ts);
}
