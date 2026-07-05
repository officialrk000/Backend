/**
 * GOOGLE APPS SCRIPT CODE
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any existing code and paste this code.
 * 4. Create two sheets in your Spreadsheet: "auth" and "data".
 *    - "auth" sheet headers: Mobile Number, Password, Name
 *    - "data" sheet headers: Form Type, Post Name, Department Name, Important Dates, Application Fees, Age, Eligibility, Post Wise Details, How To Fill, Apply Link, Notification Link, Official Website, Remark, Submitted By, Timestamp
 * 5. Click "Deploy" > "New Deployment".
 * 6. Select "Web App".
 * 7. Execute as: "Me".
 * 8. Who has access: "Anyone".
 * 9. Copy the Web App URL and paste it into the "APPS_SCRIPT_URL" in /src/lib/config.ts
 */

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var action = params.action;
    var data = params.data;
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var authSheet = ss.getSheetByName("auth");
    var dataSheet = ss.getSheetByName("data");

    // Handle Login
    if (action === "login") {
      var mobile = data.mobile;
      var password = data.password;
      var rows = authSheet.getDataRange().getValues();
      
      for (var i = 1; i < rows.length; i++) {
        var sheetMobile = rows[i][0].toString().trim();
        var sheetPass = rows[i][1].toString().trim();
        
        if (sheetMobile === mobile.toString().trim() && sheetPass === password.toString().trim()) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: true, 
            name: rows[i][2] 
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        message: "Invalid Mobile Number or Password" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Handle Data Submission
    if (action === "submitData") {
      dataSheet.appendRow([
        data.formType,
        data.postName,
        data.departmentName,
        data.importantDates,
        data.applicationFees,
        data.age,
        data.eligibility,
        data.postWiseDetails,
        data.howToFill,
        data.applyLink,
        data.notificationLink,
        data.officialWebsiteLink,
        data.remark,
        data.submittedBy,
        data.timestamp
      ]);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Handle Dashboard Stats
    if (action === "getStats") {
      var rows = dataSheet.getDataRange().getValues();
      var total = rows.length - 1;
      if (total < 0) total = 0;
      
      var recent = [];
      // Get last 10 entries
      var startIndex = Math.max(1, rows.length - 10);
      for (var j = rows.length - 1; j >= startIndex; j--) {
        recent.push({
          postName: rows[j][1],
          formType: rows[j][0],
          submittedBy: rows[j][13]
        });
      }
      
      return ContentService.createTextOutput(JSON.stringify({ 
        total: total, 
        recent: recent 
      })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
