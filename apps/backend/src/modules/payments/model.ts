import { t, type UnwrapSchema } from "elysia";

export const PaymentsModel = {
	onrampResponseSchema: t.Object({
		message: t.Literal("Onramp successful"),
	}),
	onrampErrorSchema: t.Object({
		message: t.Literal("Error while performing onramp"),
	}),
} as const;

export type PaymentsModel = {
	[k in keyof typeof PaymentsModel]: UnwrapSchema<(typeof PaymentsModel)[k]>;
};

