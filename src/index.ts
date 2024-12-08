import { Request, Response } from "express";
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

// Cloud Functionsエントリーポイント
exports.runTask = async (req: Request, res: Response) => {
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
