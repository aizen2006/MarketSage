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

		let keyRecord;
		try {
			keyRecord = await prisma.apikeys.findFirst({
				where: {
					key: apiKey,
					disabled: false,
				},
			});
		} catch (e) {
			console.error("API key lookup failed due to database error:", e);
			throw status(503, {
				error: {
					code: "DB_UNAVAILABLE",
					message: "Database unavailable. Please try again later.",
				},
			});
		}

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
).as("global");

