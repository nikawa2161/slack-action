import { RankingResults } from "@/types";
import { getMessages, getReplies } from "../slackService";

export async function calculateRankings(
  channelIds: string[],
  oldest: number
): Promise<RankingResults> {
  const threadReactionCounts: Record<string, number> = {};
  const userReactionCounts: Record<string, number> = {};
  const nonCreatorReplyCounts: Record<string, Set<string>> = {};

  for (const channelId of channelIds) {
    const messages = await getMessages(channelId, oldest);

    for (const message of messages) {
      // スレッド作成者へのスタンプ数集計
      if (!message.thread_ts && message.reactions) {
        for (const reaction of message.reactions) {
          threadReactionCounts[message.user] =
            (threadReactionCounts[message.user] || 0) +
            reaction.count * reaction.users.length;
        }
      }

      // スレッドへの返信および返信内スタンプ集計
      if (message.reply_count && message.reply_count > 0) {
        const replies = await getReplies(channelId, message.ts);

        // スレッド内ユーザーのスタンプ押下数集計
        for (const reply of replies) {
          if (reply.reactions) {
            for (const reaction of reply.reactions) {
              for (const user of reaction.users) {
                userReactionCounts[user] = (userReactionCounts[user] || 0) + 1;
              }
            }
          }
        }

        // スレッド作成者以外の返信回数集計
        const threadCreator = message.user;
        for (const reply of replies.slice(1)) {
          if (reply.user !== threadCreator) {
            if (!nonCreatorReplyCounts[reply.user]) {
              nonCreatorReplyCounts[reply.user] = new Set();
            }
            nonCreatorReplyCounts[reply.user].add(message.thread_ts!);
          }
        }
      }
    }
  }

  // ランキング上位3件
  const sortedThreadReactions = Object.entries(threadReactionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const sortedUserReactions = Object.entries(userReactionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const sortedNonCreatorReplies = Object.entries(nonCreatorReplyCounts)
    .map(([user, threads]) => [user, threads.size] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return {
    sortedThreadReactions,
    sortedUserReactions,
    sortedNonCreatorReplies,
  };
}

export function createRankingBlocks(
  title: string,
  data: [string, number][]
): any[] {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: title,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: data.map(([user, count]) => `<@${user}>: ${count}回`).join("\n"),
      },
    },
    {
      type: "divider",
    },
  ];
}
