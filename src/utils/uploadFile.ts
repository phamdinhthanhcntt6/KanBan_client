import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import { replaceName } from "./replaceName";

export const uploadFile = async (file: any) => {
  const fileName = replaceName(file.name);
  const storageRef = ref(storage, `images/${fileName}`);

  const res = await uploadBytes(storageRef, file);

  if (res) {
    if (res.metadata.size === file.size) {
      return getDownloadURL(storageRef);
    } else {
      return "Uploading...";
    }
  } else {
    return "Error upload";
  }
};
