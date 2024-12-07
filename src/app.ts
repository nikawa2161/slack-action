import { DateTime } from "luxon";
import { SEARCH_TERMS, TARGET_CHANNEL_ID, DAYS_AGO } from "@/constants/";
import {
  calculateRankings,
  createRankingBlocks,
} from "@/services/rankingService";
import { getChannels, sendSlackMessage } from "@/services/slackService";

async function main() {
  const oneMonthAgo = DateTime.now().minus({ days: DAYS_AGO }).toSeconds();
  const channels = await getChannels(SEARCH_TERMS);
  const channelIds = channels.map((c) => c.id);

  const {
    sortedThreadReactions,
    sortedUserReactions,
    sortedNonCreatorReplies,
  } = await calculateRankings(channelIds, oneMonthAgo);

  // ブロック生成
  const threadReactionsBlocks = createRankingBlocks(
    "スタンプ獲得ランキング（トップ3）",
    sortedThreadReactions
  );

  const userReactionsBlocks = createRankingBlocks(
    "スタンプを押したユーザーランキング（トップ3）",
    sortedUserReactions
  );

  const nonCreatorRepliesBlocks = createRankingBlocks(
    "返信したユーザーランキング（トップ3）",
    sortedNonCreatorReplies
  );

  const blocks = [
    ...threadReactionsBlocks,
    ...userReactionsBlocks,
    ...nonCreatorRepliesBlocks,
  ];

  await sendSlackMessage(TARGET_CHANNEL_ID, blocks);
}

main().catch(console.error);
