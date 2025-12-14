import { AggregationData } from "@/types/aggregation";

/**
 * スレッドリアクションランキングを生成
 */
export const generateThreadReactionRanking = (
  data: AggregationData,
  limit: number = 3,
): [string, number][] => {
  const sorted = Object.entries(data.threadReactionCounts).sort(
    (a, b) => b[1] - a[1],
  );

  const result: [string, number][] = [];
  let currentRank = 1;
  let previousCount: number | null = null;

  for (let i = 0; i < sorted.length; i++) {
    const [user, count] = sorted[i];

    // 前の人と回数が異なる場合、順位を更新
    if (previousCount !== null && count !== previousCount) {
      currentRank = i + 1;
    }

    // N位より下になったら終了
    if (currentRank > limit) {
      break;
    }

    result.push([user, count]);
    previousCount = count;
  }

  return result;
};

/**
 * ユーザーリアクションランキングを生成
 */
export const generateUserReactionRanking = (
  data: AggregationData,
  limit: number = 3,
): [string, number][] => {
  const sorted = Object.entries(data.userReactionCounts).sort(
    (a, b) => b[1] - a[1],
  );

  const result: [string, number][] = [];
  let currentRank = 1;
  let previousCount: number | null = null;

  for (let i = 0; i < sorted.length; i++) {
    const [user, count] = sorted[i];

    // 前の人と回数が異なる場合、順位を更新
    if (previousCount !== null && count !== previousCount) {
      currentRank = i + 1;
    }

    // N位より下になったら終了
    if (currentRank > limit) {
      break;
    }

    result.push([user, count]);
    previousCount = count;
  }

  return result;
};

/**
 * スレッド返信ランキングを生成
 */
export const generateNonCreatorReplyRanking = (
  data: AggregationData,
  limit: number = 3,
): [string, number][] => {
  const sorted = Object.entries(data.nonCreatorReplyCounts).sort(
    (a, b) => b[1] - a[1],
  );

  const result: [string, number][] = [];
  let currentRank = 1;
  let previousCount: number | null = null;

  for (let i = 0; i < sorted.length; i++) {
    const [user, count] = sorted[i];

    // 前の人と回数が異なる場合、順位を更新
    if (previousCount !== null && count !== previousCount) {
      currentRank = i + 1;
    }

    // N位より下になったら終了
    if (currentRank > limit) {
      break;
    }

    result.push([user, count]);
    previousCount = count;
  }

  return result;
};
