const xl = require("excel4node");

const automation = require("./google_search");

const wb = new xl.Workbook();
// Add Worksheets to the workbook
const ws = wb.addWorksheet("Sheet 1");

let rowCounter = 1;

// Create a reusable style
const contentStyle = wb.createStyle({
  font: {
    color: "#333333",
    size: 12
  },
  numberFormat: "$#,##0.00; ($#,##0.00); -"
});

const headingStyle = wb.createStyle({
  font: {
    color: "#333333",
    size: 12
  },
  numberFormat: "$#,##0.00; ($#,##0.00); -"
});

async function writeToExcel(metaData) {
  ws.cell(rowCounter, 1)
    .string("Book Titles")
    .style(headingStyle);
  ws.cell(rowCounter, 2)
    .string("Book Authors")
    .style(headingStyle);
  ws.cell(rowCounter, 3)
    .string("Book Ratings")
    .style(headingStyle);
  ws.cell(rowCounter, 4)
    .string("Number Of Ratings")
    .style(headingStyle);
  rowCounter += 1;
  for (let i = 0; i < metaData.titles.length; i++) {
    ws.cell(rowCounter + i, 1)
      .string(metaData.titles[i])
      .style(contentStyle);
    ws.cell(rowCounter + i, 2)
      .string(metaData.authors[i])
      .style(contentStyle);
    ws.cell(rowCounter + i, 3)
      .string(metaData.ratings[i])
      .style(contentStyle);
    ws.cell(rowCounter + i, 4)
      .string(metaData.numberOfRatings[i])
      .style(contentStyle);
  }

  ws.column(1).setWidth(50);
  ws.column(2).setWidth(50);
  ws.column(3).setWidth(20);
  ws.column(3).setWidth(20);

  rowCounter += metaData.titles.length;
  wb.write("output.xlsx");
}

automation.start().then(() => {
  writeToExcel(automation.metaData).then(console.log(automation.metaData));
});

// const json = { name: "Paras", passion: "science and art" };

// const json = {
//   foo: "bar",
//   qux: "moo",
//   poo: 123,
//   stux: new Date()
// };

// const xlsx = json2xlsx(json);
// fs.writeFileSync("output.xlsx", xlsx, "binary");
