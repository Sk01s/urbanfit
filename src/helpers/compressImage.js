const compressImage = (file, maxSizeKB = 200) => {
  return new Promise((resolve) => {
    if (file.size / 1024 <= maxSizeKB) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    const ORIGINAL_WIDTH = img.width;
    const ORIGINAL_HEIGHT = img.height;

    img.onload = async () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;
      let quality = 0.92;

      const MIN_DIM = 100;
      const MIN_QUALITY = 0.5;

      const doCompress = (w, h, q) => {
        return new Promise((res) => {
          canvas.width = w;
          canvas.height = h;
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (blob) => res(blob),
            "image/jpeg",
            q
          );
        });
      };

      const shrinkDimensions = (w, h) => {
        const newW = Math.max(Math.floor(w * 0.85), MIN_DIM);
        const newH = Math.max(Math.floor(h * 0.85), MIN_DIM);
        return { width: newW, height: newH };
      };

      let blob = await doCompress(width, height, quality);

      while (blob.size / 1024 > maxSizeKB && quality > MIN_QUALITY) {
        quality -= 0.05;
        quality = Math.round(quality * 100) / 100;
        blob = await doCompress(width, height, quality);
      }

      while (blob.size / 1024 > maxSizeKB) {
        const next = shrinkDimensions(width, height);
        if (next.width === width && next.height === height) break;
        width = next.width;
        height = next.height;
        blob = await doCompress(width, height, quality);
      }

      const compressedFile = new File(
        [blob],
        file.name.replace(/\.[^.]+$/, ".jpg"),
        { type: "image/jpeg" }
      );

      resolve(compressedFile);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
};

export default compressImage;