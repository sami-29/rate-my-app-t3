import { cloudName, uploadPreset } from "./cloudinaryConfig";

const baseUrl = `https://api.cloudinary.com/v1_1/${cloudName}`;

export interface UploadRequestParams {
  file: File;
  fieldName: string;
  progressCallback: (
    lengthComputable: boolean,
    loaded: number,
    total: number
  ) => void;
  successCallback: (deleteToken: string) => void;
  errorCallback: (responseText: string) => void;
}

export const makeUploadRequest = async ({
  file,
  fieldName,
  progressCallback,
  successCallback,
  errorCallback,
}: UploadRequestParams): Promise<() => void> => {
  const url = `${baseUrl}/image/upload`;

  const formData = new FormData();
  formData.append(fieldName, file);
  formData.append("upload_preset", uploadPreset || "");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    const { delete_token: deleteToken } = await response.json();
    successCallback(deleteToken);
  } else {
    errorCallback(await response.text());
  }

  return () => {
    // Abort logic if needed
  };
};

export interface DeleteRequestParams {
  token: string;
  successCallback: () => void;
  errorCallback: (responseText: string) => void;
}

export const makeDeleteRequest = async ({
  token,
  successCallback,
  errorCallback,
}: DeleteRequestParams): Promise<void> => {
  const url = `${baseUrl}/delete_by_token`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (response.ok) {
    successCallback();
  } else {
    errorCallback(await response.text());
  }
};
