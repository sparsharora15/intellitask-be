const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function upload(files) {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "uploads",
          resource_type: "auto",
          filename_override: file.originalname,
        },
        function (error, result) {
          console.log(result);
          if (error) reject(error);
          else
            resolve({
              fileName: result.original_filename,
              url: result.url,
            });
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  });

  let attachments = await Promise.all(uploadPromises);

  return attachments;
}
module.exports = {
  upload,
};
