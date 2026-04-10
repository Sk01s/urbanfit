const compressImage = (file, maxSizeKB = 200) => {
  return new Promise((resolve) => {
    if (file.size / 1024 <= maxSizeKB) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;
      let quality = 0.85;

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

      let blob = await doCompress(width, height, quality);

      while (blob.size / 1024 > maxSizeKB && quality > 0.1) {
        quality -= 0.1;
        blob = await doCompress(width, height, quality);
      }

      while (blob.size / 1024 > maxSizeKB) {
        width = Math.floor(width * 0.75);
        height = Math.floor(height * 0.75);
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