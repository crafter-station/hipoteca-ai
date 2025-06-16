import { generative, vectorizer } from "weaviate-client";

import { weaviate } from "@/clients/weaviate";
import { CONTRACT_CONTEXT_COLLECTION } from "@/models/constants";

await weaviate.collections.create({
	name: CONTRACT_CONTEXT_COLLECTION,
	vectorizers: vectorizer.text2VecWeaviate(),
	generative: generative.cohere(),
});

console.log(`Collection ${CONTRACT_CONTEXT_COLLECTION} created`);
