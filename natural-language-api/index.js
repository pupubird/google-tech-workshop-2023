async function quickstart() {
  // Imports the Google Cloud client library
  const language = require("@google-cloud/language");

  // Instantiates a client
  const client = new language.LanguageServiceClient({
    keyFile: "credentials.json",
  });

  // The text to analyze
  // Take reference from https://github.com/GoogleCloudPlatform/python-docs-samples/tree/main/language/snippets/classify_text/resources/texts
  const text = `IMPORTANT TERMS
1. MECHANICS
Mechanics refers to the branch of Physics, which involves the study of
movement of physical objects.
It may be broadly categorized into following branches:
1.1 Statics
It is the branch of mechanics, which involves the study of physical objects
at rest.
1.2 Kinematics
It is the branch of mechanics, which involves the study of movement of
physical objects without considering the factors that cause movement.
1.3 Dynamics
It is the branch of mechanics, which involves the study of movement of
physical objects considering the factors that cause movement.`;

  const document = {
    content: text,
    type: "PLAIN_TEXT",
  };

  // Detects the sentiment of the text
  const [result] = await client.classifyText(
    { document: document },
    {
      v2Model: {
        contentCategoriesVersion: "V2",
      },
    }
  );
  console.log(result);
}
quickstart();
