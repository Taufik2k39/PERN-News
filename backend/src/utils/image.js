export const getUploadedImagePath = (req) => {
  if (!req.file) {
    return undefined;
  }

  return `/uploads/${req.file.filename}`;
};

export const toPublicImageUrl = (req, imageValue) => {
  if (!imageValue) {
    return null;
  }

  const imageString = String(imageValue).trim();

  if (/^https?:\/\//i.test(imageString)) {
    return imageString;
  }

  const normalizedPath = imageString.replace(/\\/g, "/");
  const relativePath = normalizedPath.startsWith("/")
    ? normalizedPath
    : `/${normalizedPath}`;

  return `${req.protocol}://${req.get("host")}${relativePath}`;
};
