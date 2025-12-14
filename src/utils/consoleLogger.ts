import { MessageRanking } from "@/types";
import { UserRankingWithName } from "./userNameResolver";

/**
 * メッセージランキングをコンソールに出力
 */
export const logMessageRanking = (
  title: string,
  messages: MessageRanking[],
): void => {
  console.log(`\n${title}:`);
  messages.forEach((msg, i) =>
    console.log(
      `   ${i + 1}位: ${msg.text.substring(0, 30)}... - ${msg.count}回`,
    ),
  );
};

/**
 * ユーザーランキングをコンソールに出力
 */
export const logUserRanking = (
  title: string,
  users: UserRankingWithName[],
): void => {
  console.log(`\n${title}:`);
  users.forEach((user, i) =>
    console.log(`   ${i + 1}位: ${user.userName} - ${user.count}回`),
  );
};

/**
 * リアクション種類ランキングをコンソールに出力
 */
export const logReactionTypeRanking = (
  title: string,
  reactions: [string, number][],
): void => {
  console.log(`\n${title}:`);
  reactions.forEach(([reaction, count], i) =>
    console.log(`   ${i + 1}位: :${reaction}: - ${count}回`),
  );
};

/**
 * 集計期間と対象チャンネルを出力
 */
export const logAggregationInfo = (
  dateRange: { startFormatted: string; endFormatted: string },
  channel: { id: string; name: string },
  channelName: string,
): void => {
  console.log(
    `\n📅 集計期間: ${dateRange.startFormatted} ～ ${dateRange.endFormatted}`,
  );
  console.log(`📺 対象チャンネル: #${channelName} (${channel.id})`);
  console.log("\n⏳ メッセージとリアクションを集計中...\n");
};
