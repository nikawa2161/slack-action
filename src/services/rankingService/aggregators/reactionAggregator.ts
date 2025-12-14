import { SlackMessage } from "@/types";
import { AggregationData } from "@/types/aggregation";

/**
 * メッセージのリアクションを集計（親メッセージ）
 */
export const aggregateParentMessageReactions = (
  message: SlackMessage,
  channelId: string,
  data: AggregationData
): void => {
  if (message.thread_ts || !message.reactions) return;

  const messageKey = `${channelId}:${message.ts}`;
  let totalReactions = 0;

  for (const reaction of message.reactions) {
    // スレッド作成者へのリアクション数を加算
    data.threadReactionCounts[message.user] =
      (data.threadReactionCounts[message.user] || 0) +
      reaction.count * reaction.users.length;

    totalReactions += reaction.count;

    // リアクション種類を集計
    data.reactionTypeCounts[reaction.name] =
      (data.reactionTypeCounts[reaction.name] || 0) + reaction.count;
  }

  // メッセージごとのリアクション数を記録
  data.messageReactionCounts.set(messageKey, {
    channelId,
    messageTs: message.ts,
    text: message.text || "(メッセージ内容なし)",
    count: totalReactions,
  });
};

/**
 * スレッド内返信のリアクションを集計
 */
export const aggregateThreadReplyReactions = (
  replies: SlackMessage[],
  data: AggregationData
): number => {
  let threadRepliesReactionCount = 0;

  for (const reply of replies) {
    if (!reply.reactions) continue;

    for (const reaction of reply.reactions) {
      // ユーザーごとのリアクション数を集計
      for (const user of reaction.users) {
        data.userReactionCounts[user] =
          (data.userReactionCounts[user] || 0) + 1;
      }

      // リアクション種類を集計
      data.reactionTypeCounts[reaction.name] =
        (data.reactionTypeCounts[reaction.name] || 0) + reaction.count;

      threadRepliesReactionCount += reaction.count;
    }
  }

  return threadRepliesReactionCount;
};

/**
 * スレッド内返信のリアクション数を親メッセージに加算
 */
export const addThreadReactionsToParent = (
  channelId: string,
  messageTs: string,
  messageText: string,
  reactionCount: number,
  data: AggregationData
): void => {
  if (reactionCount === 0) return;

  const messageKey = `${channelId}:${messageTs}`;
  const existing = data.messageReactionCounts.get(messageKey);

  if (existing) {
    existing.count += reactionCount;
  } else {
    // 親メッセージにリアクションがない場合、新規作成
    data.messageReactionCounts.set(messageKey, {
      channelId,
      messageTs,
      text: messageText || "(メッセージ内容なし)",
      count: reactionCount,
    });
  }
};
