import { getUserFilesUrls } from "@/models/user";

//getMortgageById("BQnYtsKkA82Q").then(console.log).catch(console.error)
getUserFilesUrls("user_2yTSTZNUJgoVw7AbZWYID4b4Eip")
	.then(console.log)
	.catch(console.error);
