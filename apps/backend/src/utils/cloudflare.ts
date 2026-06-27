import { Cloudflare } from 'cloudflare';

export const client = new Cloudflare({
    apiToken:process.env.CLOUDFLARE_API_KEY,
});

if(!process.env.NAMESPACE_ID || !process.env.ACCOUNT_ID){
    throw Error('namespaceId or accountId is missing')
}

type BodySchema = {
    key:string,
    value:string,
    expiration?:number,
    expiration_ttl?: number,
    metadata?: unknown
}[]

export async function writeBulkKeyPair(body: BodySchema) {
    try {
        const response = await client.kv.namespaces.bulkUpdate(
            process.env.NAMESPACE_ID!,
            {
            account_id: process.env.ACCOUNT_ID!,
            body:body,
            }
        );
        let retry;

        if (response?.unsuccessful_keys?.length) {
            const failedKeyNames = new Set(
            response.unsuccessful_keys.map((key) => key)
            );
            const retryBody = body.filter((item) =>
            failedKeyNames.has(item.key)
            );
    
            if (retryBody.length) {

            retry = await client.kv.namespaces.bulkUpdate(
                process.env.NAMESPACE_ID!,
                {
                account_id: process.env.ACCOUNT_ID!,
                body: retryBody,
                }
            );
            }
        }
        return {
            message:"Set the KV pair successfully",
            unsuccessful_kv: retry?.unsuccessful_keys
        }
    } catch (error) {
        console.error("Failed to write KV pairs:", error);
        throw error;
    }
}

export async function getBulkKeyPair(keys:string[]){
    try{
        const response = await client
        .kv
        .namespaces
        .bulkGet(
            process.env.NAMESPACE_ID!,
            {
                account_id:process.env.ACCOUNT_ID!,
                keys:keys
            }
        );
        return response?.values
    }catch(e){
        console.error("Failed to get KV pairs:", e);
        throw e;
    }
}

export async function deleteBulkKeyPair(keys:string[]){
    try{
        const response = await client
        .kv
        .namespaces
        .bulkDelete(
            process.env.NAMESPACE_ID!,
            {
                account_id:process.env.ACCOUNT_ID!,
                body:keys
            }
        );
        return response?.successful_key_count
    }catch(e){
        console.error("Failed to get KV pairs:", e);
        throw e;
    }
}

export async function getValue(key:string){
    try {
        const res = await client.kv.namespaces.values.get(process.env.NAMESPACE_ID!,key,{
            account_id:process.env.ACCOUNT_ID!
        });

        return res;
    } catch (e) {
        console.error("Failed to get KV pair:", e);
        throw e;
    }
}

export async function updateValue(
    key:string,
    value:string,
    expiration?:number,
    expiration_ttl?: number,
    metadata?: unknown){
    try{
        const res = await client.kv.namespaces.values.update(
            process.env.NAMESPACE_ID!,
            key,
            {
                account_id:process.env.ACCOUNT_ID!,
                value:value,
                expiration,
                expiration_ttl,
                metadata
            }
        );
        
    }catch(e){
        console.error("Failed to update KV pair:", e);
        throw e;
    }
}

export async function deleteValue(key:string){
    try {
        const res = await client.kv.namespaces.values.delete(process.env.NAMESPACE_ID!,key,{
            account_id:process.env.ACCOUNT_ID!
        });

        return res;
    } catch (e) {
        console.error("Failed to get KV pair:", e);
        throw e;
    }
}