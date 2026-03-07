import { t, type UnwrapSchema } from "elysia";

export const UserModel = {
	getCreditsResponseSchema: t.Object({
		credits: t.Number(),
	}),
	getCreditsNotFoundSchema: t.Object({
		message: t.Literal("User not found"),
	}),
	getUsageLogsResponseSchema: t.Object({
		usageLogs: t.Array(
			t.Object({
				id: t.String(),
				userId: t.String(),
				apikeyId: t.String(),
				credits: t.Number(),
				createdAt: t.String(),
			}),
		),
	}),
	getTransactionsResponseSchema: t.Object({
		transactions: t.Array(
			t.Object({
				id: t.String(),
				userId: t.String(),
				amount: t.Number(),
				createdAt: t.String(),
			}),
		),
	}),
	getConversationsResponseSchema: t.Object({
		conversations: t.Array(
			t.Object({
				id: t.String(),
				title: t.String(),
				lastMessagePreview: t.String(),
				updatedAt: t.String(),
				unreadCount: t.Number(),
			}),
		),
	}),
	createConversationBodySchema: t.Object({
		title: t.Optional(t.String()),
	}),
	createConversationResponseSchema: t.Object({
		id: t.String(),
		title: t.String(),
		lastMessagePreview: t.String(),
		updatedAt: t.String(),
		unreadCount: t.Number(),
	}),
	patchConversationBodySchema: t.Object({
		title: t.String(),
	}),
	getInsightsResponseSchema: t.Object({
		signals: t.Array(
			t.Object({
				id: t.String(),
				title: t.String(),
				value: t.String(),
				valueTrend: t.Union([
					t.Literal("positive"),
					t.Literal("negative"),
					t.Literal("neutral"),
				]),
				confidence: t.Number(),
				sparklineData: t.Array(t.Number()),
				isNew: t.Boolean(),
			}),
		),
		insights: t.Array(
			t.Object({
				id: t.String(),
				title: t.String(),
				summary: t.String(),
			}),
		),
	}),
} as const;

export type UserModel = {
	[k in keyof typeof UserModel]: UnwrapSchema<(typeof UserModel)[k]>;
};

