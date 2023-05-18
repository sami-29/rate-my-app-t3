// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import {
  makeUploadRequest,
  makeDeleteRequest,
} from "@/cloudinary/cloudinaryHelper";
import { useState } from "react";

const MyFileUploader = () => {
  const [files, setFiles] = useState<any>([]);

  const revert = (token: any, successCallback: any, errorCallback: any) => {
    makeDeleteRequest({
      token,
      successCallback,
      errorCallback,
    });
  };

  const process = (
    fieldName: any,
    file: any,
    metadata: any,
    load: any,
    error: any,
    progress: any,
    abort: any,
    transfer: any,
    options: any
  ) => {
    const abortRequest = makeUploadRequest({
      file,
      fieldName,
      successCallback: load,
      errorCallback: error,
      progressCallback: progress,
    });
    return {
      abort: async () => {
        (await abortRequest)();
        abort();
      },
    };
  };

  return (
    <FilePond
      files={files}
      onupdatefiles={setFiles}
      allowMultiple={true}
      server={{ process, revert }}
      name="file"
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      onprocessfile={() => {
        // Do nothing when files are processed
      }}
      onremovefile={() => {
        // Do nothing when files are removed
      }}
      onaddfile={() => {
        // Do nothing when files are added
      }}
      onprocessfilerevert={() => {
        // Do nothing when files are reverted
      }}
    />
  );
};

export default MyFileUploader;
