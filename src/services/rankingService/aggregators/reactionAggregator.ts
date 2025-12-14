import { SlackMessage } from "@/types";
import { AggregationData } from "@/types/aggregation";

/**
 * メッセージのリアクションを集計（親メッセージ）
 */
export const aggregateParentMessageReactions = (
  message: SlackMessage,
  channelId: string,
  data: AggregationData,
): void => {
  if (message.thread_ts || !message.reactions) return;

  const messageKey = `${channelId}:${message.ts}`;

  const totalReactions = message.reactions.reduce((total, reaction) => {
    // スレッド作成者へのリアクション数を加算
    data.threadReactionCounts[message.user] =
      (data.threadReactionCounts[message.user] || 0) +
      reaction.count * reaction.users.length;

    // リアクション種類を集計
    data.reactionTypeCounts[reaction.name] =
      (data.reactionTypeCounts[reaction.name] || 0) + reaction.count;

    return total + reaction.count;
  }, 0);

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
  data: AggregationData,
): number => {
  return replies.reduce((totalCount, reply) => {
    if (!reply.reactions) return totalCount;

    return (
      totalCount +
      reply.reactions.reduce((replyTotal, reaction) => {
        // ユーザーごとのリアクション数を集計
        reaction.users.forEach((user) => {
          data.userReactionCounts[user] =
            (data.userReactionCounts[user] || 0) + 1;
        });

        // リアクション種類を集計
        data.reactionTypeCounts[reaction.name] =
          (data.reactionTypeCounts[reaction.name] || 0) + reaction.count;

        return replyTotal + reaction.count;
      }, 0)
    );
  }, 0);
};

/**
 * スレッド内返信のリアクション数を親メッセージに加算
 */
export const addThreadReactionsToParent = (
  channelId: string,
  messageTs: string,
  messageText: string,
  reactionCount: number,
  data: AggregationData,
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
