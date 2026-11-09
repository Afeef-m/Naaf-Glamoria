
export function getOptimizedCloudinaryUrl(url: string): string {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  const uploadPath = "/image/upload/";

  if (!url.includes(uploadPath)) {
    return url;
  }

  const [base, assetPath] = url.split(uploadPath);

  // Remove the original extension so Cloudinary selects
  // the appropriate output format for the requesting browser.
  const pathWithoutExtension = assetPath.replace(/\.(jpg|jpeg|png|webp|avif)$/i, "");

  return `${base}${uploadPath}f_auto/q_auto/${pathWithoutExtension}`;
}
