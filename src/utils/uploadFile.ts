import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import { replaceName } from "./replaceName";
import Resizer from "react-image-file-resizer";

export const uploadFile = async (file: any) => {
  const newFile: any = await handleResize(file);

  const fileName = replaceName(newFile.name);

  const storageRef = ref(storage, `images/${fileName}`);

  const res = await uploadBytes(storageRef, newFile);

  if (res) {
    if (res.metadata.size === newFile.size) {
      return getDownloadURL(storageRef);
    } else {
      return "Uploading";
    }
  } else {
    return "Error upload";
  }
};

export const handleResize = (file: any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file, // File ảnh
      1080, // Chiều rộng mới
      720, // Chiều cao mới
      "JPEG", // Định dạng ảnh đầu ra (JPEG, PNG, WEBP)
      80, // Chất lượng ảnh (0-100)
      0, // Xoay ảnh (0, 90, 180, 270)
      (newfile) => {
        newfile && resolve(newfile);
      },
      "file"
    );
  });
