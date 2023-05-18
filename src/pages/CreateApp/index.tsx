import { api } from "@/utils/api";
import { SubmitHandler, useForm } from "react-hook-form";
import MyFileUploader from "@/components/ui/FileUploader";

type Inputs = {
  ownerId: string;
  title: string;
  description: string;
  type: "WEB" | "MOBILE" | "DESKTOP";
  url: string | null | undefined;
  sourceCodeUrl: string | null | undefined;
};

export default function CreateApp() {
  const { mutate } = api.apps.create.useMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  console.log(watch("title"));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 md:flex-row"
    >
      <div className="mt-12 w-full md:w-1/2">
        <label htmlFor="" className="label">
          App Images
        </label>
        <MyFileUploader />
      </div>
      <div className="w-full space-y-4 md:w-1/2">
        <label htmlFor="" className="label">
          Title
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="input-bordered input w-full"
        />
        <label htmlFor="" className="label">
          Description
        </label>
        <textarea
          className="textarea-primary textarea w-full"
          placeholder="Bio"
        ></textarea>
        <label htmlFor="" className="label">
          Url
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="input-bordered input w-full"
        />
        <input
          type="submit"
          className="btn-primary btn w-full md:w-auto"
          value="Submit"
        />
      </div>
    </form>
  );
}
