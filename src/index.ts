import "dotenv/config";
import { Request, Response } from "express";
import { SEARCH_TERMS, TARGET_CHANNEL_ID } from "@/constants/";
import {
  calculateRankings,
  createClosingMessageBlocks,
  createOpeningMessageBlocks,
  createMessageRankingBlocks,
  createReactionTypeRankingBlocks,
  createUserRankingBlocks,
} from "@/services/rankingService";
import { getChannels, sendSlackMessage } from "@/services/slackService";
import { calculateLastMonthRange } from "@/utils/dateUtils";
import {
  resolveUserNames,
  attachUserNamesToRanking,
} from "@/utils/userNameResolver";
import {
  logMessageRanking,
  logUserRanking,
  logReactionTypeRanking,
  logAggregationInfo,
} from "@/utils/consoleLogger";
import { SlackBlock, RankingResults } from "@/types";

/**
 * ランキング結果をコンソールに出力
 */
async function logRankingResults(
  rankings: RankingResults,
): Promise<Record<string, string>> {
  const {
    sortedUserReactions,
    sortedNonCreatorReplies,
    topReactionMessages,
    topThreadMessages,
    topReactionTypes,
    topTotalEngagementMessages,
  } = rankings;

  // ユーザー名を取得
  console.log("⏳ ユーザー名を取得中...\n");
  const userIds = new Set<string>([
    ...sortedUserReactions.map(([id]) => id),
    ...sortedNonCreatorReplies.map(([id]) => id),
  ]);
  const userIdToName = await resolveUserNames(userIds);

  console.log("【ランキング結果】");
  logMessageRanking("📝 リアクションが多かった記事", topReactionMessages);
  logMessageRanking("💬 スレッドが伸びた記事", topThreadMessages);
  logUserRanking(
    "✋ リアクションした回数が多い人",
    attachUserNamesToRanking(sortedUserReactions, userIdToName),
  );
  logUserRanking(
    "💬 スレッドのやりとりした回数が多い人",
    attachUserNamesToRanking(sortedNonCreatorReplies, userIdToName),
  );
  logReactionTypeRanking("😊 よく使われたリアクション", topReactionTypes);
  logMessageRanking("🔥 総反応数が多い記事", topTotalEngagementMessages);

  return userIdToName;
}

/**
 * Slackメッセージブロックを作成
 */
function buildSlackMessageBlocks(
  rankings: RankingResults,
  userIdToName: Record<string, string>,
  dateRange: { startFormatted: string; endFormatted: string },
): SlackBlock[] {
  const {
    sortedUserReactions,
    sortedNonCreatorReplies,
    topReactionMessages,
    topThreadMessages,
    topReactionTypes,
    topTotalEngagementMessages,
  } = rankings;

  return [
    ...createOpeningMessageBlocks(
      dateRange.startFormatted,
      dateRange.endFormatted,
    ),
    ...createMessageRankingBlocks(
      `📝 *リアクションが多かった記事トップ${topReactionMessages.length}*`,
      topReactionMessages,
    ),
    ...createMessageRankingBlocks(
      `💬 *スレッドが伸びた記事トップ${topThreadMessages.length}*`,
      topThreadMessages,
    ),
    ...createUserRankingBlocks(
      `✋ *リアクションした回数が多い人トップ${sortedUserReactions.length}*`,
      attachUserNamesToRanking(sortedUserReactions, userIdToName),
    ),
    ...createUserRankingBlocks(
      `💬 *スレッドのやりとりした回数が多い人トップ${sortedNonCreatorReplies.length}*`,
      attachUserNamesToRanking(sortedNonCreatorReplies, userIdToName),
    ),
    ...createReactionTypeRankingBlocks(
      `😊 *よく使われたリアクショントップ${topReactionTypes.length}*`,
      topReactionTypes,
    ),
    ...createMessageRankingBlocks(
      `🔥 *総反応数が多い記事トップ${topTotalEngagementMessages.length}*`,
      topTotalEngagementMessages,
    ),
    ...createClosingMessageBlocks(),
  ];
}

/**
 * メイン処理
 */
async function main() {
  console.log("========== ランキング集計開始 ==========");

  // 集計期間を計算
  const dateRange = calculateLastMonthRange();

  // 対象チャンネルを取得
  const channels = await getChannels(SEARCH_TERMS);
  const channelIds = channels.map((c) => c.id);

  // 集計情報を出力
  logAggregationInfo(dateRange, channels, SEARCH_TERMS);

  // ランキングを計算
  const rankings = await calculateRankings(
    channelIds,
    dateRange.start.toSeconds(),
    dateRange.end.toSeconds(),
  );

  console.log("✅ 集計完了！\n");

  // ランキング結果をコンソールに出力
  const userIdToName = await logRankingResults(rankings);

  // Slackメッセージブロックを作成して送信
  const blocks = buildSlackMessageBlocks(rankings, userIdToName, dateRange);
  await sendSlackMessage(TARGET_CHANNEL_ID, blocks);
}

// Cloud Functionsエントリーポイント
export const runTask = async (req: Request, res: Response) => {
  console.log(req);
  console.log(res);

  try {
    await main();
    res.status(200).send("Task executed successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error running task");
  }
};

// ローカル実行用
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => {
      console.log("\n✅ 処理が正常に完了しました");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ エラーが発生しました:");
      console.error(error);
      process.exit(1);
    });
}
