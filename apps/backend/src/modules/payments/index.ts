import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";
import { PaymentsService } from "./service";
import { PaymentsModel } from "./model";

export const app = new Elysia({ prefix: "/payments" })
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
	.post(
		"/onramp",
		async ({ status, userId }) => {
			try {
				await PaymentsService.onramp(String(userId));
				return status(200, {
					message: "Onramp successful",
				});
			} catch (e) {
				return status(400, {
					message: "Error while performing onramp",
				});
			}
		},
		{
			response: {
				200: PaymentsModel.onrampResponseSchema,
				400: PaymentsModel.onrampErrorSchema,
			},
		},
	);

