import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";
import { UserService } from "./service";
import { UserModel } from "./model";

export const app = new Elysia({ prefix: "/user" })
	.use(
		jwt({
			name: "jwt",
			secret: process.env.JWT_SECRET!,
		}),
	)
	.resolve(async ({ cookie: { auth }, status, jwt }) => {
		if (!auth) {
			return status(401);
		}
		const decoded = await jwt.verify(auth.value as string);
		if (!decoded || !decoded.userId) {
			return status(401);
		}

		return {
			userId: decoded.userId as number,
		};
	})
	.get(
		"/credits",
		async ({ status, userId }) => {
			const credits = await UserService.getCredits(String(userId));
			if (credits === null) {
				return status(404, {
					message: "User not found",
				});
			}
			return status(200, {
				credits,
			});
		},
		{
			response: {
				200: UserModel.getCreditsResponseSchema,
				404: UserModel.getCreditsNotFoundSchema,
			},
		},
	)
	.get(
		"/usageLog",
		async ({ status, userId }) => {
			const usageLogs = await UserService.getUsageLogs(String(userId));
			return status(200, {
				usageLogs,
			});
		},
		{
			response: {
				200: UserModel.getUsageLogsResponseSchema,
			},
		},
	)
	.get(
		"/transactions",
		async ({ status, userId }) => {
			const transactions = await UserService.getTransactions(String(userId));
			return status(200, {
				transactions,
			});
		},
		{
			response: {
				200: UserModel.getTransactionsResponseSchema,
			},
		},
	)
	.get(
		"/conversations",
		async ({ status, userId }) => {
			const conversations = await UserService.getConversations(String(userId));
			return status(200, {
				conversations,
			});
		},
		{
			response: {
				200: UserModel.getConversationsResponseSchema,
			},
		},
	);

