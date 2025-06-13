import { createHash } from "node:crypto";

// Get the secret key from environment variables
const SECRET_KEY = process.env.USER_ID_SECRET_KEY;

if (!SECRET_KEY) {
	throw new Error("USER_ID_SECRET_KEY environment variable is required");
}

interface RequestHeaders {
	"x-forwarded-for"?: string;
	"user-agent"?: string;
	"accept-language"?: string;
	"sec-ch-ua"?: string;
	"sec-ch-ua-platform"?: string;
}

export function generateUserId(headers: RequestHeaders): string {
	// Get IP address from x-forwarded-for header (first IP in the chain)
	const ip = headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";

	// Get other relevant headers
	const userAgent = headers["user-agent"] || "unknown";
	const acceptLanguage = headers["accept-language"] || "unknown";
	const browserInfo = headers["sec-ch-ua"] || "unknown";
	const platform = headers["sec-ch-ua-platform"] || "unknown";

	// Combine all identifiers into a single string, including the secret key
	const combinedString = `${ip}|${userAgent}|${acceptLanguage}|${browserInfo}|${platform}|${SECRET_KEY}`;

	console.log(combinedString);

	// Create and return the full SHA-256 hash
	return createHash("sha256").update(combinedString).digest("hex");
}
