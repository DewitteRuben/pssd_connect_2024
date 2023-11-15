import { User } from "firebase/auth";
import {
  UploadTask,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { UrlSafeString } from "../utils/url-safe-string";

const storage = getStorage();

const uploadImageFile = (
  user: User,
  file: File,
  progressCallback?: (percentage: number, name: string, task: UploadTask) => void
): Promise<string> => {
  // Upload file and metadata to the object 'images/mountains.jpg'
  const uniqueID = uuidv4();
  const stringGen = new UrlSafeString();
  const storageRef = ref(
    storage,
    user.uid + "/images/" + uniqueID + "-" + stringGen.sanitize(file.name)
  );

  const uploadTask = uploadBytesResumable(storageRef, file, { contentType: file.type });
  if (progressCallback) {
    progressCallback(0, storageRef.name, uploadTask);
  }

  return new Promise((res, rej) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progressCallback) {
          progressCallback(progress, storageRef.name, uploadTask);
        }
      },
      (error) => {
        rej({ success: false, message: error.code });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          res(downloadURL);
        });
      }
    );
  });
};

export { uploadImageFile };
