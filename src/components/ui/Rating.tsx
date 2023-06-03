import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";

const RatingComponent = ({
  type,
  register,
}: {
  type: string;
  register: UseFormRegister<any>;
}) => {
  const [rating, setRating] = useState(5);

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRating = parseInt(event.target.value);
    setRating(newRating);
  };

  return (
    <div className="flex gap-2">
      <span className="w-12">{type} </span>
      <div className="rating">
        <input
          type="radio"
          className="mask mask-star"
          defaultValue={1}
          {...register(`${type}-rating`)}
          checked={rating === 1}
          onChange={handleRatingChange}
        />
        <input
          type="radio"
          className="mask mask-star"
          defaultValue={2}
          {...register(`${type}-rating`)}
          checked={rating === 2}
          onChange={handleRatingChange}
        />
        <input
          type="radio"
          className="mask mask-star"
          defaultValue={3}
          {...register(`${type}-rating`)}
          checked={rating === 3}
          onChange={handleRatingChange}
        />
        <input
          type="radio"
          className="mask mask-star"
          defaultValue={4}
          {...register(`${type}-rating`)}
          checked={rating === 4}
          onChange={handleRatingChange}
        />
        <input
          type="radio"
          className="mask mask-star"
          defaultValue={5}
          {...register(`${type}-rating`)}
          checked={rating === 5}
          onChange={handleRatingChange}
        />
      </div>
    </div>
  );
};

export default RatingComponent;
