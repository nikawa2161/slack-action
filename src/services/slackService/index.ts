import { SlackChannel, SlackMessage, SlackBlock } from "@/types";
import { WebClient } from "@slack/web-api";

const web = new WebClient(process.env.VITE_SLACK_TOKEN);

// ユーザー名のキャッシュ
const userNameCache: Record<string, string> = {};

export const getChannelByName = async (
  channelName: string,
): Promise<SlackChannel> => {
  const response = await web.conversations.list({
    exclude_archived: true,
    limit: 999,
  });

  const channels = (response.channels || []) as SlackChannel[];
  const channel = channels.find((ch) => ch.name === channelName);

  if (!channel) {
    throw new Error(`チャンネル "${channelName}" が見つかりません`);
  }

  return channel;
};

/**
 * チャンネル名からチャンネルIDを取得
 */
export const getChannelIdByName = async (
  channelName: string,
): Promise<string> => {
  const response = await web.conversations.list({
    exclude_archived: true,
    limit: 999,
  });

  const channels = (response.channels || []) as SlackChannel[];
  const channel = channels.find((ch) => ch.name === channelName);

  if (!channel) {
    throw new Error(`チャンネル "${channelName}" が見つかりません`);
  }

  return channel.id;
};

export const getMessages = async (
  channelId: string,
  oldest: number,
  latest: number,
): Promise<SlackMessage[]> => {
  const response = await web.conversations.history({
    channel: channelId,
    oldest: oldest.toString(),
    latest: latest.toString(),
  });

  return (response.messages || []) as SlackMessage[];
};

export const getReplies = async (
  channelId: string,
  threadTs: string,
): Promise<SlackMessage[]> => {
  const response = await web.conversations.replies({
    channel: channelId,
    ts: threadTs,
  });
  return (response.messages || []) as SlackMessage[];
};

export const getUserName = async (userId: string): Promise<string> => {
  // キャッシュにあればそれを返す
  if (userNameCache[userId]) {
    return userNameCache[userId];
  }

  try {
    const response = await web.users.info({ user: userId });
    const userName =
      response.user?.profile?.display_name ||
      response.user?.real_name ||
      response.user?.name ||
      userId;
    userNameCache[userId] = userName;
    return userName;
  } catch (error) {
    console.error(`ユーザー情報取得エラー (${userId}):`, error);
    return userId; // エラー時はIDをそのまま返す
  }
};

export const sendSlackMessage = async (
  channelId: string,
  blocks: SlackBlock[],
): Promise<void> => {
  // Slackへ投稿する場合はコメントを外す
  // const result = await web.chat.postMessage({
  //   channel: channelId,
  //   blocks: blocks,
  // });
  // console.log("\n✅ Slackへの投稿が完了しました!");
  // console.log("投稿先チャンネルID:", channelId);
  // console.log("メッセージID:", result.ts);

  // テストモード: ログのみ出力
  console.log("\n========== Slack投稿内容（テストモード） ==========");
  console.log("投稿先チャンネルID:", channelId);
  console.log("\n【投稿メッセージ】:");
  blocks.forEach((block) => {
    if (block.type === "section" && block.text) {
      console.log(block.text.text);
    }
    if (block.type === "divider") {
      console.log("---");
    }
  });
  console.log("================================================\n");
};
