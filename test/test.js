const { displayImage } = require("../dist")
const { readFileSync } = require("fs")

displayImage(readFileSync("./img_lights.jpg"), "aurealis borealis").then(() => console.log("closed prompt"))