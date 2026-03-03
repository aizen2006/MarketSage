import { prisma } from "db";

const ONRAMP_AMOUNT = 1000;

export abstract class PaymentsService {
	static async onramp(userId: string): Promise<void> {
		await prisma.$transaction(async (tx) => {
			await tx.user.update({
				where: {
					id: userId,
				},
				data: {
					credits: {
						increment: ONRAMP_AMOUNT,
					},
				},
			});

			await tx.transactions.create({
				data: {
					userId,
					amount: ONRAMP_AMOUNT,
				},
			});
		});
	}
}

