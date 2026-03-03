import { prisma } from "db";

export abstract class UserService {
	static async getCredits(userId: string): Promise<number | null> {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				credits: true,
			},
		});

		if (!user) {
			return null;
		}

		return user.credits;
	}

	static async getUsageLogs(userId: string): Promise<
		{
			id: string;
			userId: string;
			apikeyId: string;
			credits: number;
			createdAt: string;
		}[]
	> {
		const logs = await prisma.usageLogs.findMany({
			where: {
				userId,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return logs.map((log) => ({
			id: log.id.toString(),
			userId: log.userId,
			apikeyId: log.apikeyId,
			credits: log.credits,
			createdAt: log.createdAt.toISOString(),
		}));
	}

	static async getTransactions(userId: string): Promise<
		{
			id: string;
			userId: string;
			amount: number;
			createdAt: string;
		}[]
	> {
		const transactions = await prisma.transactions.findMany({
			where: {
				userId,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return transactions.map((tx) => ({
			id: tx.id.toString(),
			userId: tx.userId,
			amount: tx.amount,
			createdAt: tx.createdAt.toISOString(),
		}));
	}
}

