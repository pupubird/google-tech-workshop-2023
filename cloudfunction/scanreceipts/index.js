/**
 * Parses a 'multipart/form-data' upload request
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
const path = require("path");
const os = require("os");
const fs = require("fs");
const { scan } = require("./docai");

const functions = require("@google-cloud/functions-framework");

// Node.js doesn't have a built-in multipart/form-data parsing library.
// Instead, we can use the 'busboy' library from NPM to parse these requests.
const Busboy = require("busboy");

functions.http("scanreceipt", (req, res) => {
  if (req.method !== "POST") {
    // Return a "method not allowed" error
    return res.status(405).end();
  }
  const busboy = Busboy({ headers: req.headers });
  const tmpdir = os.tmpdir();

  // This object will accumulate all the fields, keyed by their name
  const fields = {};

  // This object will accumulate all the uploaded files, keyed by their name.
  const uploads = {};

  // This code will process each non-file field in the form.
  busboy.on("field", (fieldname, val) => {
    /**
     *  TODO(developer): Process submitted field values here
     */
    fields[fieldname] = val;
  });

  const fileWrites = [];

  // This code will process each file uploaded.
  busboy.on("file", (fieldname, file, { filename }) => {
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    console.log(`Processed file ${filename}`);
    const filepath = path.join(tmpdir, filename);
    uploads[fieldname] = filepath;

    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    // File was processed by Busboy; wait for it to be written.
    // Note: GCF may not persist saved files across invocations.
    // Persistent files must be kept in other locations
    // (such as Cloud Storage buckets).
    const promise = new Promise((resolve, reject) => {
      file.on("end", () => {
        writeStream.end();
      });
      writeStream.on("close", resolve);
      writeStream.on("error", reject);
    });
    fileWrites.push(promise);
  });

  // Triggered once all uploaded files are processed by Busboy.
  // We still need to wait for the disk writes (saves) to complete.
  
  busboy.on("finish", async () => {
    await Promise.all(fileWrites);

    /**
     * TODO(developer): Process saved files here
     */
    const results = [];
    for (const file in uploads) {
      results.push(await scan(uploads[file]));
      fs.unlinkSync(uploads[file]);
    }
    console.log("GOTTEN NEW REQUESTT!!");
    res.send(results);
  });

  busboy.end(req.rawBody);
});
