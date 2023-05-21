import { getAuth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f
    // Set permissions and file types for this FileRoute
    .fileTypes(["image"])
    .maxSize("8MB")
    .middleware(async (req, res) => {
      // This code runs on your server before upload
      const user = await getAuth(req);

      console.log(user);
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.sessionId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("uploaded with the following metadata:", metadata);
      file;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
