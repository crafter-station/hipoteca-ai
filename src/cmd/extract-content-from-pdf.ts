import { extractContentFromPdf } from "@/actions/extract-content-from-pdf";

if (require.main === module) {
  extractContentFromPdf("example.pdf")
    .then((object) => {
      console.log(object);
    })
    .catch((err) => {
      console.error(err);
    });
}
