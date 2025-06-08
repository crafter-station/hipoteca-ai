import { tool } from "ai";
import z from "zod";

import { weaviate } from "@/clients/weaviate";

type Question = Readonly<{
	category: string;
	question: string;
	answer: string;
}>;

export const searchQuestions = tool({
	description: "Search the questions for the best answer to the question",
	parameters: z.object({
		query: z.string(),
	}),
	execute: async ({ query }) => {
		const questions = await weaviate.collections
			.get<Question>("Question")
			.query.nearText(query, {
				limit: 3,
			});

		let result = "<questions>\n";
		for (const question of questions.objects) {
			result += "  <question>\n";
			result += `    <category>${question.properties.category}</category>\n`;
			result += `    <question>${question.properties.question}</question>\n`;
			result += `    <answer>${question.properties.answer}</answer>\n`;
			result += "  </question>\n";
		}
		result += "</questions>\n";
		return result;
	},
});
