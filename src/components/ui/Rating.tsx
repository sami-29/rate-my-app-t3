import { useMutation } from "@tanstack/react-query";

const RatingComponent = ({ type }: { type: string }) => {
  const mutation = useMutation;
  return (
    <div className="flex gap-2">
      <span className="w-12">{type} </span>
      <div className="rating">
        <input
          type="radio"
          name="rating-1"
          className="mask mask-star "
          value={1}
        />
        <input
          type="radio"
          name="rating-1"
          className="mask mask-star"
          defaultChecked
          value={2}
        />
        <input
          type="radio"
          name="rating-1"
          className="mask mask-star"
          value={3}
        />
        <input
          type="radio"
          name="rating-1"
          className="mask mask-star"
          value={4}
        />
        <input
          type="radio"
          name="rating-1"
          className="mask mask-star"
          value={5}
        />
      </div>
    </div>
  );
};

export default RatingComponent;
