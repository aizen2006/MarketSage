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
} as const;

export type UserModel = {
	[k in keyof typeof UserModel]: UnwrapSchema<(typeof UserModel)[k]>;
};

