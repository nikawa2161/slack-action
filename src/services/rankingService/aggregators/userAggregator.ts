import { AggregationData } from "@/types/aggregation";

/**
 * スレッドリアクションランキングを生成
 */
export const generateThreadReactionRanking = (
  data: AggregationData,
  limit: number = 3,
): [string, number][] => {
  return Object.entries(data.threadReactionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
};

/**
 * ユーザーリアクションランキングを生成
 */
export const generateUserReactionRanking = (
  data: AggregationData,
  limit: number = 3,
): [string, number][] => {
  return Object.entries(data.userReactionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
};

/**
 * スレッド返信ランキングを生成
 */
export const generateNonCreatorReplyRanking = (
  data: AggregationData,
  limit: number = 3,
): [string, number][] => {
  return Object.entries(data.nonCreatorReplyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
};
