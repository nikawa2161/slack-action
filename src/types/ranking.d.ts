export interface MessageRanking {
  channelId: string;
  messageTs: string;
  text: string;
  count: number;
}

export interface RankingResults {
  // 既存のユーザーランキング
  sortedThreadReactions: [string, number][];
  sortedUserReactions: [string, number][];
  sortedNonCreatorReplies: [string, number][];

  // 新しい記事（メッセージ）ランキング
  topReactionMessages: MessageRanking[];
  topThreadMessages: MessageRanking[];
  topTotalEngagementMessages: MessageRanking[];

  // リアクション種類のランキング
  topReactionTypes: [string, number][];
}

/**
 * ランキングブロック生成の設定
 */
export interface RankingBlockConfig {
  title: string;
  emoji: string;
  showMedals?: boolean;
}
