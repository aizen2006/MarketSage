import { prisma } from "db";

const DEFAULT_CALL_COST = 1;

export class BillingService {
	static async withBilling<T>(
		userId: string,
		apiKeyId: string,
		costCredits: number,
		runFn: () => Promise<T>,
	): Promise<T> {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { credits: true },
		});

		if (!user || user.credits < costCredits) {
			const error = new Error("INSUFFICIENT_CREDITS");
			// marker property for route handlers
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(error as any).code = "INSUFFICIENT_CREDITS";
			throw error;
		}

		const result = await runFn();

		await prisma.$transaction(async (tx) => {
			await tx.user.update({
				where: { id: userId },
				data: {
					credits: {
						decrement: costCredits,
					},
				},
			});

			await tx.usageLogs.create({
				data: {
					userId,
					apikeyId: apiKeyId,
					credits: costCredits,
				},
			});
		});

		return result;
	}

	static async chargeUpfront(
		userId: string,
		apiKeyId: string,
		costCredits = DEFAULT_CALL_COST,
	): Promise<void> {
		await prisma.$transaction(async (tx) => {
			const user = await tx.user.findUnique({
				where: { id: userId },
				select: { credits: true },
			});

			if (!user || user.credits < costCredits) {
				const error = new Error("INSUFFICIENT_CREDITS");
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(error as any).code = "INSUFFICIENT_CREDITS";
				throw error;
			}

			await tx.user.update({
				where: { id: userId },
				data: {
					credits: {
						decrement: costCredits,
					},
				},
			});

			await tx.usageLogs.create({
				data: {
					userId,
					apikeyId: apiKeyId,
					credits: costCredits,
				},
			});
		});
	}
}

