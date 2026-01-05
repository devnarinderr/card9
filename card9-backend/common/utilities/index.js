const crypto = require("crypto");
const fs = require("fs");

const base64ToMedia = (name, data, contentType) => {
  if (data.length !== 0) {
    let randomName;
    if (!name) {
      randomName = crypto.randomBytes(5).toString("hex");
    }

    let mediaData = data.split(";base64,").pop();

    const extension = contentType === "mp4" ? "mp4" : "png";

    const fileName = name ? name : randomName;
    const filePath = `./uploads/${fileName}.${extension}`;

    fs.writeFile(filePath, mediaData, "base64", function (err) {
      if (err) {
        console.error("Error saving media:", err);
      } else {
        console.log("Media saved:", filePath);
      }
    });

    return fileName;
  }
  return undefined;
};

const base64ToImage = (name, image) => {
  let randomName;
  let orignalName;

  if (image.length !== 0) {
    if (name != undefined) {
      orignalName = name;
    } else {
      randomName = crypto.randomBytes(5).toString("hex");
    }

    let profileImageData = image.split(";base64,").pop();

    require("fs").writeFile(
      `./uploads/${orignalName ? orignalName : randomName}.png`,
      profileImageData,
      "base64",
      function (err) {
        console.log(err);
      }
    );
    return orignalName ? orignalName : randomName;
  }
  return undefined;
};

const base64_encode = (file, contentType) => {
  if (file) {
    if (file.length !== 0) {
      if (contentType === "mp4") {
        try {
          return (
            "data:video/mp4;base64," +
            fs.readFileSync(`./uploads/${file}.${contentType}`, "base64")
          );
        } catch (error) {
          console.error("Error reading video file:", error);
          return null;
        }
      } else {
        try {
          return (
            "data:image/png;base64," +
            fs.readFileSync(`./uploads/${file}.${contentType}`, "base64")
          );
        } catch (error) {
          console.error("Error reading image file:", error);
          return null;
        }
      }
    }
    return;
  }
  return;
};

const deleteLocalImage = (fileName) => {
  const directory = "./uploads/";

  fs.readdirSync(directory).forEach((file) => {
    if (file.startsWith(fileName)) {
      const filePath = `${directory}${file}`;
      try {
        fs.unlinkSync(filePath);
        console.log(`File ${filePath} has been deleted.`);
      } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
      }
    }
  });

  return;
};

const addOneYear = (date) => {
  const oneYear = new Date(date);
  oneYear.setFullYear(oneYear.getFullYear() + 1);
  return oneYear;
};

function extractExtensionFromBase64(dataURI) {
  const regex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9]+);base64,/;
  const match = dataURI.match(regex);

  if (match && match.length > 1) {
    const mimeType = match[1];
    const parts = mimeType.split("/");
    if (parts.length === 2) {
      return parts[1];
    }
  }

  return null;
}

module.exports = {
  base64ToMedia,
  base64ToImage,
  base64_encode,
  deleteLocalImage,
  addOneYear,
  extractExtensionFromBase64,
};
