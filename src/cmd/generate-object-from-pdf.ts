import { generateObjectFromPdf } from "@/actions/generate-object-from-pdf";

if (require.main === module) {
  generateObjectFromPdf("example.pdf")
    .then((object) => {
      console.log(object);
    })
    .catch((err) => {
      console.error(err);
    });
}
