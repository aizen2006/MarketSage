// Controller (HTTP adapter) eg. routing, request validation
// You can define another Controller that is not tied with Elysia
import { Elysia } from 'elysia'

import { Auth } from './service'
import { AuthModel } from './model'

export const auth = new Elysia({ prefix: '/auth' })
	.get(
		'/sign-in',
		async ({ body, cookie: { session } }) => {
			const response = await Auth.signIn(body)
			session!.value = response.token
			return response
		}, {
			body: AuthModel.signInBody,
			response: {
				200: AuthModel.signInResponse,
				400: AuthModel.signInInvalid
			}
		}
	)