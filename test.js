const fs = require("fs");
let result = fs.readFile("./library/1984.txt", "utf8", function (error, data) {
  if (error) return console.log(error);
  console.log(data);
});
