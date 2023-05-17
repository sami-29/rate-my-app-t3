import { api } from "@/utils/api";
import { SubmitHandler, useForm } from "react-hook-form";

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

  return (
    <>
      <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="" className="label">
          Title
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="input-bordered input max-w-xs"
        />
        <label htmlFor="" className="label">
          Description
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="input-bordered input max-w-xs"
        />
        <label htmlFor="" className="label">
          Url
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="input-bordered input max-w-xs"
        />
        <button className="btn-primary btn ">Submit</button>
      </form>
    </>
  );
}
