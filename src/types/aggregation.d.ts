import { MessageRanking } from "./ranking";

/**
 * 集計処理の中間データ構造
 */
export interface AggregationData {
  // メッセージ関連の集計
  messageReactionCounts: Map<string, MessageRanking>;
  messageThreadCounts: Map<string, MessageRanking>;

  // ユーザー関連の集計
  threadReactionCounts: Record<string, number>;
  userReactionCounts: Record<string, number>;
  nonCreatorReplyCounts: Record<string, Set<string>>;

  // リアクション種類の集計
  reactionTypeCounts: Record<string, number>;
}

/**
 * 集計処理の設定
 */
export interface AggregationConfig {
  channelIds: string[];
  oldest: number;
  latest: number;
}
