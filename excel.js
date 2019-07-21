var fs = require("fs");
var xlsx = require("node-xlsx");

// function walk(obj) {
//   for (let i in obj) {
//     if (typeof obj[i] === "object" && !(obj[i] instanceof Array)) {
//       walk(obj[i]);
//       console.log(obj[i]);
//     }
//   }
// }
const getDataFromExcel = async () => {
  var obj = xlsx.parse(__dirname + "/input.xlsx"); // parses a file

  var obj = xlsx.parse(fs.readFileSync(__dirname + "/input.xlsx")); // parses a buffer

  return obj;
  // walk(obj);
};

exports.getDataFromExcel = getDataFromExcel;
