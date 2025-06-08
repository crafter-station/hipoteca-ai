import fs from "node:fs";
import { mistral } from "@/clients/mistral";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function generateObjectFromPdf(fileUrlOrPath: string) {
	try {
		const fileUrl = isUrl(fileUrlOrPath)
			? fileUrlOrPath
			: await uploadPdf(fileUrlOrPath);

		const text = await getTextFromPdf(fileUrl);

		return generateObjectFromText(text);
	} catch (error) {
		throw new Error("Error generating object from PDF", { cause: error });
	}
}

function isUrl(fileUrlOrPath: string) {
	return fileUrlOrPath.startsWith("http");
}

async function uploadPdf(path: string) {
	const uploadedFile = fs.readFileSync(path);
	const uploadedPdf = await mistral.files.upload({
		file: {
			fileName: generateFileName(path),
			content: uploadedFile,
		},
		purpose: "ocr",
	});

	const signedUrl = await mistral.files.getSignedUrl({
		fileId: uploadedPdf.id,
	});

	return signedUrl.url;
}

function generateFileName(path: string) {
	return (path.split("/").pop() || "uploaded_file.pdf") + Date.now();
}

async function getTextFromPdf(fileUrl: string) {
	const ocrResponse = await mistral.ocr.process({
		model: "mistral-ocr-latest",
		document: {
			type: "document_url",
			documentUrl: fileUrl,
		},
		includeImageBase64: false,
	});

	const text = ocrResponse.pages
		.toSorted((a, b) => a.index - b.index)
		.map((page) => page.markdown)
		.join("\n");

	return text;
}

async function generateObjectFromText(text: string) {
	const { object } = await generateObject({
		model: openai("gpt-4o-mini"),
		schema: mortgagePreapprovalSchema,
		prompt: `Extract the mortgage preapproval information from the following text: ${text}. Be sure to follow the schema ${JSON.stringify(MORTGAGE_PREAPPROVAL_SCHEMA_DESCRIPTION)}`,
	});

	return object;
}

const amountSchema = z.object({
	amount: z.number().describe("Cantidad numérica"),
	currency: z.string().describe("Código de moneda ISO (por ejemplo, EUR)"),
});

const interestRateSchema = z.object({
	spread_tin: z.string().describe("Diferencial sobre Euribor para TIN"),
	tae_percent: z
		.number()
		.describe("Tasa Anual Equivalente (TAE) en porcentaje"),
});

const mortgagePreapprovalSchema = z
	.object({
		mortgage_preapproval: z
			.object({
				loan_amount: amountSchema.describe(
					"Importe total del préstamo solicitado",
				),

				term: z
					.object({
						years: z
							.number()
							.int()
							.describe("Número de años para amortizar el préstamo"),
					})
					.describe("Duración del préstamo"),

				opening_fee: z
					.string()
					.describe("Comisión de apertura aplicada (si la hay)"),

				interest_rate: z
					.object({
						initial_period: z
							.object({
								duration_months: z
									.number()
									.int()
									.describe("Duración en meses del periodo inicial"),
								tin_percent: z
									.number()
									.describe("Tipo de interés nominal (TIN) en porcentaje"),
							})
							.describe("Tipo de interés y duración del periodo inicial fijo"),

						subsequent_period: z
							.object({
								non_bonus: interestRateSchema.describe(
									"Condiciones sin bonificación adicional",
								),
								bonus: interestRateSchema.describe(
									"Condiciones con bonificación máxima",
								),
							})
							.describe("Tipo de interés y TAE tras el periodo inicial"),
					})
					.describe("Tipos de interés aplicables en diferentes periodos"),

				monthly_payment: z
					.object({
						first_6_months: amountSchema.describe(
							"Cuota mensual durante los primeros 6 meses",
						),
						subsequent_months: z
							.object({
								with_bonus: amountSchema.describe(
									"Cuota mensual aplicable con bonificación",
								),
								without_bonus: amountSchema.describe(
									"Cuota mensual sin aplicar bonificación",
								),
							})
							.describe(
								"Cuota mensual tras el periodo inicial, con o sin bonificación",
							),
					})
					.describe("Cuota mensual estimada según periodo y bonificaciones"),

				conditions_for_bonus: z
					.record(
						z.object({
							description: z.string().describe("Descripción de la condición"),
							bonus_points: z
								.number()
								.describe("Puntos porcentuales de bonificación que aporta"),
						}),
					)
					.describe(
						"Requisitos para obtener bonificaciones en el tipo de interés",
					),

				TAE_calculation: z
					.object({
						non_bonus: z.number().describe("TAE sin bonificación"),
						with_bonus: z.number().describe("TAE con bonificación máxima"),
					})
					.describe(
						"Resumen de la TAE según se cumplan o no las bonificaciones",
					),

				other_conditions: z
					.object({
						account_requirement: z
							.string()
							.describe("Requisito de apertura o mantenimiento de cuenta"),
						insurance_requirement: z
							.string()
							.describe("Seguro obligatorio asociado al préstamo"),
					})
					.describe(
						"Otras condiciones asociadas a la concesión de la hipoteca",
					),
			})
			.describe("Datos de la preaprobación de la hipoteca"),
	})
	.describe(
		"Esquema para representar una oferta de preaprobación hipotecaria con sus condiciones",
	);

export type MortgagePreapproval = z.infer<typeof mortgagePreapprovalSchema>;

const MORTGAGE_PREAPPROVAL_SCHEMA_DESCRIPTION = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "Preaprobación de Hipoteca",
	type: "object",
	description:
		"Esquema para representar una oferta de preaprobación hipotecaria con sus condiciones.",
	properties: {
		mortgage_preapproval: {
			type: "object",
			description: "Datos de la preaprobación de la hipoteca",
			required: [
				"loan_amount",
				"term",
				"opening_fee",
				"interest_rate",
				"monthly_payment",
				"conditions_for_bonus",
				"TAE_calculation",
				"other_conditions",
			],
			properties: {
				loan_amount: {
					type: "object",
					description: "Importe total del préstamo solicitado.",
					required: ["amount", "currency"],
					properties: {
						amount: {
							type: "number",
							description: "Cantidad numérica del préstamo.",
						},
						currency: {
							type: "string",
							description: "Código de moneda ISO (por ejemplo, EUR).",
						},
					},
				},
				term: {
					type: "object",
					description: "Duración del préstamo.",
					required: ["years"],
					properties: {
						years: {
							type: "integer",
							description: "Número de años para amortizar el préstamo.",
						},
					},
				},
				opening_fee: {
					type: "string",
					description: "Comisión de apertura aplicada (si la hay).",
				},
				interest_rate: {
					type: "object",
					description: "Tipos de interés aplicables en diferentes periodos.",
					required: ["initial_period", "subsequent_period"],
					properties: {
						initial_period: {
							type: "object",
							description:
								"Tipo de interés y duración del periodo inicial fijo.",
							required: ["duration_months", "tin_percent"],
							properties: {
								duration_months: {
									type: "integer",
									description: "Duración en meses del periodo inicial.",
								},
								tin_percent: {
									type: "number",
									description: "Tipo de interés nominal (TIN) en porcentaje.",
								},
							},
						},
						subsequent_period: {
							type: "object",
							description: "Tipo de interés y TAE tras el periodo inicial.",
							required: ["non_bonus", "bonus"],
							properties: {
								non_bonus: {
									type: "object",
									description: "Condiciones sin bonificación adicional.",
									required: ["spread_tin", "tae_percent"],
									properties: {
										spread_tin: {
											type: "string",
											description: "Diferencial sobre Euribor para TIN.",
										},
										tae_percent: {
											type: "number",
											description:
												"Tasa Anual Equivalente (TAE) en porcentaje.",
										},
									},
								},
								bonus: {
									type: "object",
									description: "Condiciones con bonificación máxima.",
									required: ["spread_tin", "tae_percent"],
									properties: {
										spread_tin: {
											type: "string",
											description:
												"Diferencial sobre Euribor para TIN con bonificación.",
										},
										tae_percent: {
											type: "number",
											description: "TAE aplicable con bonificación.",
										},
									},
								},
							},
						},
					},
				},
				monthly_payment: {
					type: "object",
					description: "Cuota mensual estimada según periodo y bonificaciones.",
					required: ["first_6_months", "subsequent_months"],
					properties: {
						first_6_months: {
							type: "object",
							description: "Cuota mensual durante los primeros 6 meses.",
							required: ["amount", "currency"],
							properties: {
								amount: {
									type: "number",
									description: "Importe de la cuota mensual.",
								},
								currency: {
									type: "string",
									description: "Código de moneda ISO.",
								},
							},
						},
						subsequent_months: {
							type: "object",
							description:
								"Cuota mensual tras el periodo inicial, con o sin bonificación.",
							required: ["with_bonus", "without_bonus"],
							properties: {
								with_bonus: {
									type: "object",
									description: "Cuota mensual aplicable con bonificación.",
									required: ["amount", "currency"],
									properties: {
										amount: {
											type: "number",
											description: "Importe de la cuota con bonificación.",
										},
										currency: {
											type: "string",
											description: "Código de moneda ISO.",
										},
									},
								},
								without_bonus: {
									type: "object",
									description: "Cuota mensual sin aplicar bonificación.",
									required: ["amount", "currency"],
									properties: {
										amount: {
											type: "number",
											description: "Importe de la cuota sin bonificación.",
										},
										currency: {
											type: "string",
											description: "Código de moneda ISO.",
										},
									},
								},
							},
						},
					},
				},
				conditions_for_bonus: {
					type: "object",
					description:
						"Requisitos para obtener bonificaciones en el tipo de interés.",
					patternProperties: {
						"^[0-9]+$|^additional_bonus$": {
							type: "object",
							required: ["description", "bonus_points"],
							properties: {
								description: {
									type: "string",
									description: "Descripción de la condición.",
								},
								bonus_points: {
									type: "number",
									description:
										"Puntos porcentuales de bonificación que aporta.",
								},
							},
						},
					},
				},
				TAE_calculation: {
					type: "object",
					description:
						"Resumen de la TAE según se cumplan o no las bonificaciones.",
					required: ["non_bonus", "with_bonus"],
					properties: {
						non_bonus: {
							type: "number",
							description: "TAE sin bonificación.",
						},
						with_bonus: {
							type: "number",
							description: "TAE con bonificación máxima.",
						},
					},
				},
				other_conditions: {
					type: "object",
					description:
						"Otras condiciones asociadas a la concesión de la hipoteca.",
					required: ["account_requirement", "insurance_requirement"],
					properties: {
						account_requirement: {
							type: "string",
							description: "Requisito de apertura o mantenimiento de cuenta.",
						},
						insurance_requirement: {
							type: "string",
							description: "Seguro obligatorio asociado al préstamo.",
						},
					},
				},
			},
		},
	},
	required: ["mortgage_preapproval"],
};
