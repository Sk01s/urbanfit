import { useLayoutEffect } from "react";

const useDocumentTitle = (title) => {
  useLayoutEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = "Urbanfit - Clothing Brand";
    }
  }, [title]);
};

export default useDocumentTitle;
