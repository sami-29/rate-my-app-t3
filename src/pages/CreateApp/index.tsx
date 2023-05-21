import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadDropzone } from "@uploadthing/react";
import { useUser } from "@clerk/nextjs";
import type { OurFileRouter } from "@/server/uploadthing/router";

// You need to import our styles for the button to look right. Best to import in the root /_app.tsx but this is fine
import "@uploadthing/react/styles.css";
import { z } from "zod";
import { useRef, useState } from "react";

const AppField = z.object({
  title: z.string().min(1).max(63),
  description: z.string().min(1).max(1023),
  type: z.enum(["WEB", "MOBILE", "DESKTOP"]),
  url: z.union([z.string().url().nullish(), z.literal("")]),
  sourceCodeUrl: z.union([z.string().url().nullish(), z.literal("")]),
});

export default function CreateApp() {
  const user = useUser();
  const [images, setImages] = useState([]);
  const { mutate } = api.apps.create.useMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(AppField) });

  return (
    <div className="container mx-auto xl:max-w-screen-xl">
      <form
        onSubmit={handleSubmit((d) => {
          d.ownerId = user.user?.id!;
          d.images = images.map((image: any) => image.fileUrl);
          console.log(d);

          // TO BE FIXED
          if (d.ownerId && d.images.length > 0) {
            mutate(d as any);
          }
        })}
        className="flex flex-col gap-12 md:flex-row"
      >
        <div className="mt-12 w-full md:w-1/2">
          <label htmlFor="" className="label">
            App Images
          </label>
          <UploadDropzone<OurFileRouter>
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log("Files: ", res);
              setImages(res as any);
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
        <div className="mt-12 w-full space-y-4 md:w-1/2">
          <label htmlFor="" className="label">
            Title
          </label>
          <input
            type="text"
            {...register("title")}
            placeholder="Type here"
            className="input-bordered input w-full"
          />
          {errors.title?.message && <p>{errors.title?.message.toString()}</p>}
          <label htmlFor="" className="label">
            Description
          </label>
          <textarea
            className="textarea-primary textarea w-full"
            placeholder="Type here"
            {...register("description")}
          ></textarea>
          {errors.description?.message && (
            <p>{errors.description?.message.toString()}</p>
          )}
          <label htmlFor="" className="label">
            Type of app
          </label>
          <select
            {...register("type", {
              setValueAs: (v: string) => v.toUpperCase(),
            })}
            className="select-primary select w-full max-w-xs"
          >
            <option value="Web">Web</option>
            <option value="Mobile">Mobile</option>
            <option value="Desktop">Desktop</option>
          </select>
          {errors.type?.message && <p>{errors.type?.message.toString()}</p>}

          <label htmlFor="" className="label">
            Project Url
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input-bordered input w-full"
            {...register("url")}
          />
          {errors.url?.message && <p>{errors.url?.message.toString()}</p>}
          <label htmlFor="" className="label">
            Source code Url
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input-bordered input w-full"
            {...register("sourceCodeUrl")}
          />
          {errors.sourceCodeUrl?.message && (
            <p>{errors.sourceCodeUrl?.message.toString()}</p>
          )}
          <input
            disabled={(() => {
              if (images.length > 0 && images.length < 5) {
                return false;
              }
              return true;
            })()}
            type="submit"
            className="btn-secondary btn w-full md:w-auto"
            value="Submit"
          />
        </div>
      </form>
    </div>
  );
}
