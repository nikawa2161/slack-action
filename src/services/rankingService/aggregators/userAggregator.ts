import { AggregationData } from "@/types/aggregation";

/**
 * スレッドリアクションランキングを生成
 */
export function generateThreadReactionRanking(
  data: AggregationData,
  limit: number = 3,
): [string, number][] {
  return Object.entries(data.threadReactionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

/**
 * ユーザーリアクションランキングを生成
 */
export function generateUserReactionRanking(
  data: AggregationData,
  limit: number = 3,
): [string, number][] {
  return Object.entries(data.userReactionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

/**
 * スレッド返信ランキングを生成
 */
export function generateNonCreatorReplyRanking(
  data: AggregationData,
  limit: number = 3,
): [string, number][] {
  return Object.entries(data.nonCreatorReplyCounts)
    .map(([user, threads]) => [user, threads.size] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}
