import weaviateClient, { type WeaviateClient } from "weaviate-client";

if (!process.env.WEAVIATE_REST_URL || !process.env.WEAVIATE_API_KEY) {
	throw new Error("WEAVIATE_REST_URL and WEAVIATE_API_KEY must be set");
}

export const weaviate: WeaviateClient =
	await weaviateClient.connectToWeaviateCloud(process.env.WEAVIATE_REST_URL, {
		authCredentials: new weaviateClient.ApiKey(process.env.WEAVIATE_API_KEY),
	});
