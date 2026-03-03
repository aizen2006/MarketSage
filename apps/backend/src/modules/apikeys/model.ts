import { t, type UnwrapSchema } from 'elysia'

export const ApiKeyModel = {
    createApiKeyResponse : t.Object({
        id : t.String(),
        userId : t.String(),
        apikey : t.String(),
        disabled : t.Boolean()
    }),
    createApiKeyInvalidSchema : t.Object({
        message: t.Literal("Error while creating api key")
    }),
    updateApiKeySchema : t.Object({
        apiKeyId:t.String(),
        disabled:t.Boolean()
    }),
    updateApiKeyResponse : t.Object({
        message: t.Literal("Api key has been Updated successfully")
    }),
    updateApiKeyInvalidSchema : t.Object({
        message: t.Literal("Error while updating api key")
    }),
    getApiKeyResponse : t.Object({
        apiKeys: t.Array(t.Object({
            id: t.String(),
            userId: t.String(),
            apikey: t.String(),
            disabled: t.Boolean(),
        }))
    }),
    getApiKeysNotFoundSchema : t.Object({
        message: t.Literal("No api keys found")
    }),


} as const

export type ApiKeyModel = {
	[k in keyof typeof ApiKeyModel]: UnwrapSchema<typeof ApiKeyModel[k]>
}