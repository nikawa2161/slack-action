import { getUserName } from "@/services/slackService";

export interface UserRankingWithName {
  userId: string;
  userName: string;
  count: number;
}

/**
 * ユーザーIDの配列からユーザー名マップを作成
 */
export async function resolveUserNames(
  userIds: Set<string>,
): Promise<Record<string, string>> {
  const userIdToName: Record<string, string> = {};

  for (const userId of userIds) {
    userIdToName[userId] = await getUserName(userId);
  }

  return userIdToName;
}

/**
 * ユーザーランキングにユーザー名を追加
 */
export function attachUserNamesToRanking(
  ranking: [string, number][],
  userNameMap: Record<string, string>,
): UserRankingWithName[] {
  return ranking.map(([userId, count]) => ({
    userId,
    userName: userNameMap[userId],
    count,
  }));
}
