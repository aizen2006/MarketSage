import { t, type UnwrapSchema } from 'elysia'

export const AuthModel = {
	signUpSchema: t.Object({
		email: t.String(),
		password: t.String(),
	}),
	signUpResponseSchema: t.Object({
		id: t.String(),
		status: t.Number()
	}),
	signUpInvalidSchema: t.Object({
		message: t.Literal('Error while signing up')
	}),
    signInSchema: t.Object({
        email: t.String(),
        password: t.String()
    }),
    signInResponseSchema: t.Object({
        message:t.Literal("SignIn successful"),
    }),
    signInFailedSchema: t.Object({
        message: t.Literal("Invalid credentials")
    })
} as const

export type AuthModel = {
	[k in keyof typeof AuthModel]: UnwrapSchema<typeof AuthModel[k]>
}