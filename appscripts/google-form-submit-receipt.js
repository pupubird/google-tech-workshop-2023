function onSubmit(e) {
  // 1. Define the constants
  const sheetID = "11A1vNQuanWFJgI1IfKREtcr3wE0VMawpxQudyF8-ghc";
  const cloudfunctionURL =
    "https://us-central1-bright-anagram-378309.cloudfunctions.net/scanreceipt";

  // 2. Get the latest response from the form and the sheet
  var form = FormApp.getActiveForm();
  var allResponses = form.getResponses();
  var latestResponse = allResponses[allResponses.length - 1];

  var sheet = SpreadsheetApp.openById(sheetID).getActiveSheet();
  var row = sheet.getLastRow();
  var range = sheet.getRange(row, 1, 1, sheet.getLastColumn());
  var values = range.getValues()[0];
  var response = latestResponse.getItemResponses();

  // 3. Upload the file to the cloud function and get the result
  const req = UrlFetchApp.fetch(cloudfunctionURL, {
    method: "POST",
    payload: {
      file: DriveApp.getFileById(response[0].getResponse()).getBlob(),
    },
  });
  const result = JSON.parse(req.getContentText())[0];
  const total_amount = result.find((r) => r.type == "total_amount");

  // 4. Update the values in the row with the form response
  values[2] = total_amount.mentionText; // Assuming the third column corresponds to the second question in the form
  range.setValues([values]);
}
