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

	static async getConversations(userId: string): Promise<
		{
			id: string;
			title: string;
			lastMessagePreview: string;
			updatedAt: string;
			unreadCount: number;
		}[]
	> {
		const conversations = await prisma.conversation.findMany({
			where: {
				userId,
			},
			orderBy: {
				updatedAt: "desc",
			},
			include: {
				messages: {
					orderBy: {
						createdAt: "desc",
					},
					take: 1,
				},
			},
		});

		return conversations.map((conversation) => ({
			id: conversation.id,
			title: conversation.title,
			lastMessagePreview:
				conversation.messages[0]?.content ?? "Start by asking about your portfolio…",
			updatedAt: conversation.updatedAt.toISOString(),
			unreadCount: 0,
		}));
	}

	static async createConversation(
		userId: string,
		title: string = "New conversation",
	): Promise<{
		id: string;
		title: string;
		lastMessagePreview: string;
		updatedAt: string;
		unreadCount: number;
	}> {
		const conversation = await prisma.conversation.create({
			data: {
				userId,
				title: title.trim().slice(0, 255) || "New conversation",
			},
		});
		return {
			id: conversation.id,
			title: conversation.title,
			lastMessagePreview: "Start by asking about your portfolio…",
			updatedAt: conversation.updatedAt.toISOString(),
			unreadCount: 0,
		};
	}

	static async updateConversationTitle(
		userId: string,
		conversationId: string,
		title: string,
	): Promise<{
		id: string;
		title: string;
		lastMessagePreview: string;
		updatedAt: string;
		unreadCount: number;
	} | null> {
		const conversation = await prisma.conversation.findFirst({
			where: { id: conversationId, userId },
			include: {
				messages: {
					orderBy: { createdAt: "desc" },
					take: 1,
				},
			},
		});
		if (!conversation) return null;
		const updated = await prisma.conversation.update({
			where: { id: conversationId },
			data: { title: title.trim().slice(0, 255) || conversation.title },
		});
		return {
			id: updated.id,
			title: updated.title,
			lastMessagePreview:
				conversation.messages[0]?.content ?? "Start by asking about your portfolio…",
			updatedAt: updated.updatedAt.toISOString(),
			unreadCount: 0,
		};
	}

	static async getInsights(userId: string): Promise<{
		signals: Array<{
			id: string;
			title: string;
			value: string;
			valueTrend: "positive" | "negative" | "neutral";
			confidence: number;
			sparklineData: number[];
			isNew: boolean;
		}>;
		insights: Array<{ id: string; title: string; summary: string }>;
	}> {
		const [credits, usageLogs] = await Promise.all([
			UserService.getCredits(userId),
			UserService.getUsageLogs(userId),
		]);
		const creditsNum = credits ?? 0;
		const recentCount = usageLogs.slice(0, 7).reduce((sum, log) => sum + log.credits, 0);
		const lastUsed = usageLogs[0]?.createdAt;
		const now = new Date();
		const lastUsedLabel =
			lastUsed != null
				? (() => {
						const d = new Date(lastUsed);
						const diffMs = now.getTime() - d.getTime();
						const diffMins = Math.floor(diffMs / 60000);
						const diffHours = Math.floor(diffMs / 3600000);
						const diffDays = Math.floor(diffMs / 86400000);
						if (diffMins < 60) return `${diffMins}m ago`;
						if (diffHours < 24) return `${diffHours}h ago`;
						return `${diffDays}d ago`;
					})()
				: "—";

		const signals = [
			{
				id: "credits",
				title: "Available credits",
				value: String(creditsNum),
				valueTrend: creditsNum > 20 ? "positive" : creditsNum > 5 ? "neutral" : "negative",
				confidence: Math.min(100, Math.round((creditsNum / 100) * 100)),
				sparklineData: usageLogs.slice(0, 7).reverse().map((l) => l.credits),
				isNew: false,
			},
			{
				id: "usage",
				title: "Recent usage",
				value: `${recentCount} credits`,
				valueTrend: "neutral" as const,
				confidence: 85,
				sparklineData: usageLogs.slice(0, 7).reverse().map((l) => l.credits),
				isNew: usageLogs.length > 0 && Date.now() - new Date(usageLogs[0].createdAt).getTime() < 3600000,
			},
		];

		const insights = [
			{
				id: "last-used",
				title: "Last activity",
				summary: lastUsed ? `Used ${lastUsedLabel}. Keep exploring your portfolio.` : "No usage yet. Send a message to get started.",
			},
			{
				id: "tip",
				title: "Quick tip",
				summary: "Ask for a portfolio summary, P&L analysis, or risk exposure to see MarketSage in action.",
			},
		];

		return { signals, insights };
	}
}

