import { RankingResults } from "@/types";
import { AggregationData } from "@/types/aggregation";
import { getMessages } from "../slackService";
import {
  aggregateParentMessageReactions,
  aggregateThreadData,
  aggregateThreadReplyCounts,
  generateThreadReactionRanking,
  generateUserReactionRanking,
  generateNonCreatorReplyRanking,
} from "./aggregators";

/**
 * 集計データの初期化
 */
const initializeAggregationData = (): AggregationData => {
  return {
    messageReactionCounts: new Map(),
    messageThreadCounts: new Map(),
    threadReactionCounts: {},
    userReactionCounts: {},
    nonCreatorReplyCounts: {},
    reactionTypeCounts: {},
  };
};

/**
 * 単一チャンネルのメッセージを集計
 */
const aggregateChannelMessages = async (
  channelId: string,
  oldest: number,
  latest: number,
  data: AggregationData,
  filterKeyword?: string
): Promise<void> => {
  const messages = await getMessages(channelId, oldest, latest);

  for (const message of messages) {
    // フィルタキーワードが指定されている場合、メッセージテキストに含まれているかチェック
    if (filterKeyword && !message.text?.includes(filterKeyword)) {
      continue;
    }

    // 親メッセージのリアクションを集計
    aggregateParentMessageReactions(message, channelId, data);

    // スレッドの返信数を集計
    aggregateThreadReplyCounts(message, channelId, data);

    // スレッド全体（返信とリアクション）を集計
    await aggregateThreadData(message, channelId, data);
  }
};

/**
 * メッセージランキングを生成
 */
const generateMessageRankings = (data: AggregationData) => {
  // リアクション数ランキング
  const topReactionMessages = Array.from(data.messageReactionCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // スレッド返信数ランキング
  const topThreadMessages = Array.from(data.messageThreadCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // 総反応数（リアクション + スレッド数）ランキング
  const totalEngagementMap = new Map(
    Array.from(data.messageReactionCounts.entries()).map(([key, value]) => [
      key,
      { ...value },
    ])
  );

  data.messageThreadCounts.forEach((threadData, key) => {
    const existing = totalEngagementMap.get(key);
    if (existing) {
      existing.count += threadData.count;
    } else {
      totalEngagementMap.set(key, { ...threadData });
    }
  });

  const topTotalEngagementMessages = Array.from(totalEngagementMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {
    topReactionMessages,
    topThreadMessages,
    topTotalEngagementMessages,
  };
};

/**
 * リアクション種類ランキングを生成
 */
const generateReactionTypeRanking = (
  data: AggregationData
): [string, number][] => {
  return Object.entries(data.reactionTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
};

/**
 * ランキングを計算
 */
export const calculateRankings = async (
  channelId: string,
  oldest: number,
  latest: number,
  filterKeyword?: string
): Promise<RankingResults> => {
  const data = initializeAggregationData();

  // チャンネルのメッセージを集計
  await aggregateChannelMessages(
    channelId,
    oldest,
    latest,
    data,
    filterKeyword
  );

  // ユーザーランキング生成
  const sortedThreadReactions = generateThreadReactionRanking(data);
  const sortedUserReactions = generateUserReactionRanking(data);
  const sortedNonCreatorReplies = generateNonCreatorReplyRanking(data);

  // メッセージランキング生成
  const { topReactionMessages, topThreadMessages, topTotalEngagementMessages } =
    generateMessageRankings(data);

  // リアクション種類ランキング生成
  const topReactionTypes = generateReactionTypeRanking(data);

  return {
    sortedThreadReactions,
    sortedUserReactions,
    sortedNonCreatorReplies,
    topReactionMessages,
    topThreadMessages,
    topTotalEngagementMessages,
    topReactionTypes,
  };
};

// ブロック作成関数はformattersからre-export
export {
  createMessageRankingBlocks,
  createUserRankingBlocks,
  createReactionTypeRankingBlocks,
  createOpeningMessageBlocks,
  createClosingMessageBlocks,
} from "./formatters";
