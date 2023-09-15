import { useLayoutEffect } from "react";

const useDocumentTitle = (title) => {
  useLayoutEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = "urbanfit - eCommerce React App";
    }
  }, [title]);
};

export default useDocumentTitle;
