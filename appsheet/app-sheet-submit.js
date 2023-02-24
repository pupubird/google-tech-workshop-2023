function onSubmit(e) {
    // 1. Define the constants
    const sheetID = "180fdg41xqNGlNH1eihTxMkKzwNsbe9AoHwgvn3Wgljk";
    const cloudfunctionURL =
      "https://us-central1-bright-anagram-378309.cloudfunctions.net/scanreceipt";
  
    // 2. Get the latest response from the form and the sheet
    var sheet = SpreadsheetApp.openById(sheetID).getActiveSheet();
    var range = sheet.getDataRange();
    var values = range.getValues();
  
    var latestResponse = values[values.length - 1];
    var file = DriveApp.getFilesByName(latestResponse[0].split('/')[1]).next();
    var blob = file.getBlob();
  
    // 3. Upload the file to the cloud function and get the result
    const req = UrlFetchApp.fetch(cloudfunctionURL, {
      method: "POST",
      payload: {
        file: blob,
      },
    });
    const result = JSON.parse(req.getContentText())[0];
    const total_amount = result.find((r) => r.type == "total_amount");
  
    // 4. Update the values in the row with the form response
    range.getCell(values.length, 2).setValue(total_amount.mentionText);
  }
  