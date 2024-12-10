import { Request, Response } from "express";
import { DateTime } from "luxon";
import { SEARCH_TERMS, TARGET_CHANNEL_ID, DAYS_AGO } from "@/constants/";
import {
  calculateRankings,
  createClosingMessageBlocks,
  createOpeningMessageBlocks,
  createRankingBlocks,
} from "@/services/rankingService";
import { getChannels, sendSlackMessage } from "@/services/slackService";

async function main() {
  const now = DateTime.now();
  const startOfLastMonth = now.minus({ months: 1 }).startOf("month");
  const endOfLastMonth = now.minus({ months: 1 }).endOf("month");

  const startDateFormatted = startOfLastMonth.toFormat("yyyy/MM/dd");
  const endDateFormatted = endOfLastMonth.toFormat("yyyy/MM/dd");

  const channels = await getChannels(SEARCH_TERMS);
  const channelIds = channels.map((c) => c.id);

  const {
    sortedThreadReactions,
    sortedUserReactions,
    sortedNonCreatorReplies,
  } = await calculateRankings(
    channelIds,
    startOfLastMonth.toSeconds(),
    endOfLastMonth.toSeconds()
  );

  const threadReactionsBlocks = createRankingBlocks(
    `🏆*最もリアクションを獲得したトップ${sortedThreadReactions.length}は、この方達です！*`,
    sortedThreadReactions
  );

  const userReactionsBlocks = createRankingBlocks(
    `✋*最もリアクションして盛り上げたトップ${sortedUserReactions.length}は、この方達です！*📈`,
    sortedUserReactions
  );

  const nonCreatorRepliesBlocks = createRankingBlocks(
    `💬 *最も返信で会話を動かしたトップ${sortedNonCreatorReplies.length}は、この方達です！* 🚀`,
    sortedNonCreatorReplies
  );
  const blocks = [
    ...createOpeningMessageBlocks(startDateFormatted, endDateFormatted),
    ...threadReactionsBlocks,
    ...userReactionsBlocks,
    ...nonCreatorRepliesBlocks,
    ...createClosingMessageBlocks(),
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
