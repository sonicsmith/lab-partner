const fs = require("fs")
const Babel = require("@babel/standalone")

/**
 *
 * @param {*} data
 */
const getExportedFunctions = (data) => {
  const transform = Babel.transform(data, { presets: ["env"] })
  var Module = module.constructor
  var m = new Module()
  m._compile(transform.code, "temp.js")
  return Object.keys(m.exports)
}

/**
 *
 * @param {*} originalFilename
 */
const getTestFilename = (originalFilename) => {
  const index = originalFilename.indexOf(".")
  return [
    originalFilename.substr(0, index),
    ".test",
    originalFilename.substr(index),
  ].join("")
}

/**
 *
 * @param {*} originalFilename
 * @param {*} functionNames
 */
const generateTestFile = (originalFilename, functionNames) => {
  const filenameWithoutExtension = originalFilename.substring(
    0,
    originalFilename.indexOf(".")
  )
  const testFilename = getTestFilename(originalFilename)
  const fileContents = [
    `import { ${functionNames.join(", ")} } from "./${originalFilename}"`,
  ]
  fileContents.push(`describe("${filenameWithoutExtension}", () => {`)
  for (functionName of functionNames) {
    fileContents.push(`it("tests ${functionName}", () => {`)
    fileContents.push(`${functionName}()`)
    fileContents.push("})")
  }
  fileContents.push("})")
  fs.writeFile(testFilename, fileContents.join("\n"), (err) => {
    if (err) {
      return console.log(err)
    }
    console.log(`Test file: ${testFilename} created`)
  })
}

/**
 *
 * @param {*} filename
 */
exports.generateTests = function (filename) {
  // Read the file and print its contents.
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
      throw err
    }
    const exportedFunctions = getExportedFunctions(data)
    if (!exportedFunctions.length) {
      console.log("No exported functions found to test")
    } else {
      generateTestFile(filename, exportedFunctions)
    }
  })
}
