import { SlackBlock, MessageRanking } from "@/types";
import { UserRankingWithName } from "@/utils/userNameResolver";

/**
 * ランキングブロックの設定
 */
interface RankingBlockConfig<T> {
  title: string;
  data: T[];
  formatItem: (item: T, index: number) => string;
  emptyMessage?: string;
  useMedals?: boolean;
}

/**
 * 汎用ランキングブロック生成
 */
function createRankingBlocks<T>(config: RankingBlockConfig<T>): SlackBlock[] {
  const {
    title,
    data,
    formatItem,
    emptyMessage = "該当なし…！！",
    useMedals = true,
  } = config;

  const medals = ["🥇", "🥈", "🥉"];

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: title,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          data.length > 0
            ? data.map((item, index) => formatItem(item, index)).join("\n")
            : emptyMessage,
      },
    },
    {
      type: "divider",
    },
  ];
}

/**
 * メッセージランキングブロック作成
 */
export function createMessageRankingBlocks(
  title: string,
  data: MessageRanking[],
): SlackBlock[] {
  return createRankingBlocks({
    title,
    data,
    formatItem: (item, index) => {
      const medals = ["🥇", "🥈", "🥉"];
      const messageLink = `https://slack.com/archives/${item.channelId}/p${item.messageTs.replace(".", "")}`;
      const truncatedText =
        item.text.length > 50 ? item.text.substring(0, 50) + "..." : item.text;
      return `${medals[index]} <${messageLink}|${truncatedText}>: ${item.count}回`;
    },
  });
}

/**
 * ユーザーランキングブロック作成（ユーザー名解決済み）
 */
export function createUserRankingBlocks(
  title: string,
  data: UserRankingWithName[],
): SlackBlock[] {
  return createRankingBlocks({
    title,
    data,
    formatItem: (item, index) => {
      const medals = ["🥇", "🥈", "🥉"];
      return `${medals[index]} ${item.userName}: ${item.count}回`;
    },
    emptyMessage: "該当者なし…！！",
  });
}

/**
 * リアクション種類ランキングブロック作成
 */
export function createReactionTypeRankingBlocks(
  title: string,
  data: [string, number][],
): SlackBlock[] {
  return createRankingBlocks({
    title,
    data,
    formatItem: (item, index) => {
      const medals = ["🥇", "🥈", "🥉"];
      const [reactionName, count] = item;
      return `${medals[index]} :${reactionName}: : ${count}回`;
    },
  });
}

/**
 * 開始メッセージブロック作成
 */
export function createOpeningMessageBlocks(
  startDate: string,
  endDate: string,
): SlackBlock[] {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `🎉 *${startDate}～${endDate}の間で、リアクション数トップの皆さんを表彰します* 🎉`,
      },
    },
    {
      type: "divider",
    },
  ];
}

/**
 * 終了メッセージブロック作成
 */
export function createClosingMessageBlocks(): SlackBlock[] {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "🔥 次回も積極的にリアクションして、さらに盛り上げていきましょう！ 💪",
      },
    },
    {
      type: "divider",
    },
  ];
}
