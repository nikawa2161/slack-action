import { SlackMessage } from "@/types";
import { AggregationData } from "@/types/aggregation";
import { getReplies } from "@/services/slackService";
import {
  aggregateThreadReplyReactions,
  addThreadReactionsToParent,
} from "./reactionAggregator";

/**
 * スレッドの返信数を集計
 */
export function aggregateThreadReplyCounts(
  message: SlackMessage,
  channelId: string,
  data: AggregationData,
): void {
  if (!message.reply_count || message.reply_count === 0) return;

  const messageKey = `${channelId}:${message.ts}`;
  data.messageThreadCounts.set(messageKey, {
    channelId,
    messageTs: message.ts,
    text: message.text || "(メッセージ内容なし)",
    count: message.reply_count,
  });
}

/**
 * スレッド作成者以外の返信回数を集計
 */
export function aggregateNonCreatorReplies(
  replies: SlackMessage[],
  threadCreator: string,
  threadTs: string,
  data: AggregationData,
): void {
  for (const reply of replies.slice(1)) {
    if (reply.user === threadCreator) continue;

    if (!data.nonCreatorReplyCounts[reply.user]) {
      data.nonCreatorReplyCounts[reply.user] = new Set();
    }
    data.nonCreatorReplyCounts[reply.user].add(threadTs);
  }
}

/**
 * スレッド全体（返信とリアクション）を集計
 */
export async function aggregateThreadData(
  message: SlackMessage,
  channelId: string,
  data: AggregationData,
): Promise<void> {
  if (!message.reply_count || message.reply_count === 0) return;

  const replies = await getReplies(channelId, message.ts);

  // スレッド内返信のリアクション数を集計
  const threadRepliesReactionCount = aggregateThreadReplyReactions(
    replies,
    data,
  );

  // 親メッセージのリアクション数に加算
  addThreadReactionsToParent(
    channelId,
    message.ts,
    message.text || "(メッセージ内容なし)",
    threadRepliesReactionCount,
    data,
  );

  // スレッド作成者以外の返信回数を集計
  aggregateNonCreatorReplies(replies, message.user, message.thread_ts!, data);
}
