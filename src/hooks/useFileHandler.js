/* eslint-disable no-alert */
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import compressImage from "@/helpers/compressImage";

const useFileHandler = (initState) => {
  const [imageFile, setImageFile] = useState(initState);
  const [isFileLoading, setFileLoading] = useState(false);

  const removeImage = ({ id, name }) => {
    const items = imageFile[name].filter((item) => item.id !== id);

    setImageFile({
      ...imageFile,
      [name]: items,
    });
  };

  const onFileChange = async (event, { name, type }) => {
    const val = event.target.value;
    const regex = /(\.jpg|\.jpeg|\.png|\.webp)$/i;

    setFileLoading(true);

    if (!regex.exec(val)) {
      alert("File type must be JPEG or PNG", "error");
      setFileLoading(false);
      return;
    }

    if (type === "multiple") {
      for (const file of Array.from(event.target.files)) {
        const compressed = await compressImage(file);
        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
          setImageFile((oldFiles) => ({
            ...oldFiles,
            [name]: [
              ...oldFiles[name],
              { file: compressed, url: e.target.result, id: uuidv4() },
            ],
          }));
        });
        reader.readAsDataURL(compressed);
      }
      setFileLoading(false);
    } else {
      const img = event.target.files[0];
      const compressed = await compressImage(img);
      const reader = new FileReader();

      reader.addEventListener("load", (e) => {
        setImageFile({
          ...imageFile,
          [name]: { file: compressed, url: e.target.result },
        });
        setFileLoading(false);
      });
      reader.readAsDataURL(compressed);
    }
  };

  return {
    imageFile,
    setImageFile,
    isFileLoading,
    onFileChange,
    removeImage,
  };
};

export default useFileHandler;