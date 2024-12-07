export interface RankingResults {
  sortedThreadReactions: [string, number][];
  sortedUserReactions: [string, number][];
  sortedNonCreatorReplies: [string, number][];
}
