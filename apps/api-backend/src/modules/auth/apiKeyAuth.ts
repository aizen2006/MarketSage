import Elysia from "elysia";
import { prisma } from "db";

export const apiKeyAuth = new Elysia({ name: "apiKeyAuth" }).resolve(
	async ({ headers, status }) => {
		const apiKey = headers["x-api-key"] as string | undefined;

		if (!apiKey) {
			throw status(401, {
				error: {
					code: "MISSING_API_KEY",
					message: "Missing x-api-key header",
				},
			});
		}

		const keyRecord = await prisma.apikeys.findFirst({
			where: {
				key: apiKey,
				disabled: false,
			},
		});

		if (!keyRecord) {
			throw status(401, {
				error: {
					code: "INVALID_API_KEY",
					message: "Invalid or disabled API key",
				},
			});
		}

		return {
			userId: keyRecord.userId,
			apiKeyId: keyRecord.id,
		};
	},
).as('global');

