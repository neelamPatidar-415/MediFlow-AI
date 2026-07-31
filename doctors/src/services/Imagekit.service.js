const ImageKit = require('imagekit');
const { v4: uuidv4 } = require('uuid');

let imagekit; // lazy singleton

const getImageKit = () => {
  if (!imagekit) {
    if (
      !process.env.IMAGEKIT_PUBLIC_KEY ||
      !process.env.IMAGEKIT_PRIVATE_KEY ||
      !process.env.IMAGEKIT_URL_ENDPOINT
    ) {
      throw new Error('❌ ImageKit env variables missing');
    }

    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }

  return imagekit;
};

const uploadImage = async (buffer, folder = '/products') => {
  if (!buffer) return null;

  const result = await getImageKit().upload({
    file: buffer,
    fileName: uuidv4(),
    folder,
  });

  return {
    url: result.url,
    thumbnail: result.thumbnailUrl || result.url,
    id: result.fileId,
  };
};

module.exports = { uploadImage };