import { generative, vectorizer } from "weaviate-client";

import { weaviate } from "@/clients/weaviate";
import { MORTGAGE_KNOWLEDGE_COLLECTION } from "@/models/constants";

await weaviate.collections.create({
  name: MORTGAGE_KNOWLEDGE_COLLECTION,
  vectorizers: vectorizer.text2VecWeaviate(),
  generative: generative.cohere(),
});

console.log(`Collection ${MORTGAGE_KNOWLEDGE_COLLECTION} created`);
