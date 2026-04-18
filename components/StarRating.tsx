import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  maxStars?: number;
  rating?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  className?: string;
  size?: number;
}

export function StarRating({
  maxStars = 5,
  rating = 0,
  onRatingChange,
  readOnly = false,
  className,
  size = 24
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (!readOnly) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index);
    }
  };

  const currentDisplayRating = hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={cn("flex space-x-1", className)}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(currentDisplayRating);

        return (
          <Star
            key={index}
            size={size}
            className={cn(
              "transition-colors duration-200",
              isFilled ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-700",
              !readOnly && "cursor-pointer hover:scale-110"
            )}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
}
