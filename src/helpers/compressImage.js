const compressImage = (file, options = {}) => {
  const {
    maxWidth = 1600,
    maxHeight = 2000,
    webpQuality = 0.8,
  } = options;

  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const url = URL.createObjectURL(file);

    const tryWebP = (width, height) => {
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (webpBlob) => {
          if (webpBlob) {
            const pngCanvas = document.createElement("canvas");
            const pngCtx = pngCanvas.getContext("2d");
            pngCanvas.width = width;
            pngCanvas.height = height;
            pngCtx.clearRect(0, 0, width, height);
            pngCtx.drawImage(img, 0, 0, width, height);
            pngCanvas.toBlob((pngBlob) => {
              URL.revokeObjectURL(url);
              if (pngBlob && webpBlob.size < pngBlob.size && webpBlob.size < file.size) {
                const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
                resolve(new File([webpBlob], newName, { type: "image/webp" }));
              } else if (pngBlob && pngBlob.size < file.size) {
                const newName = file.name.replace(/\.[^.]+$/, "") + ".png";
                resolve(new File([pngBlob], newName, { type: "image/png" }));
              } else {
                resolve(file);
              }
            }, "image/png");
          } else {
            canvas.toBlob((pngBlob) => {
              URL.revokeObjectURL(url);
              if (pngBlob && pngBlob.size < file.size) {
                const newName = file.name.replace(/\.[^.]+$/, "") + ".png";
                resolve(new File([pngBlob], newName, { type: "image/png" }));
              } else {
                resolve(file);
              }
            }, "image/png");
          }
        },
        "image/webp",
        webpQuality
      );
    };

    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
      tryWebP(width, height);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
};

export default compressImage;