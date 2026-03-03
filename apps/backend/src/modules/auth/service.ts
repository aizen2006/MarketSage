// Service handle business logic, decoupled from Elysia controller
import { status } from 'elysia'

import
import { AuthModel } from './model'

// If a class doesn't need to store a property,
// you may use `abstract class` to avoid class allocation
export abstract class Auth {
    static async generateAndSaveTokenToDB(userId: string) {
        return 'token'
    }
	static async signIn({ username, password }) {
		

		if (!await Bun.password.verify(password, user.password))
			// You can throw an HTTP error directly
			throw status(
				400,
				'Invalid username or password' 
			)

		return {
			username,
			token: await generateAndSaveTokenToDB(user.id)
		}
	}
}