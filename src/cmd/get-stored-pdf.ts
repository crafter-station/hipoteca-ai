import { getUserContractsUrls } from "@/models/user";

//getMortgageById("BQnYtsKkA82Q").then(console.log).catch(console.error)
getUserContractsUrls("user_2yTSTZNUJgoVw7AbZWYID4b4Eip")
	.then(console.log)
	.catch(console.error);
