import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showRating?: boolean;
  totalRatings?: number | null;
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 'md',
  showRating = false,
  totalRatings = null,
}) => {
  const fullStars = Math.floor(rating);
  const partialStar = rating - fullStars;
  const sizeClass = sizeClasses[size];

  const stars = Array.from({ length: 5 }).map((_, i) => {
    if (i < fullStars) {
      // Full star
      return (
        <Star
          key={i}
          className={`${sizeClass} fill-atlas-gold text-atlas-gold`}
        />
      );
    } else if (i === fullStars && partialStar > 0) {
      // Partial star
      return (
        <div key={i} className={`relative ${sizeClass}`}>
          <Star className={`absolute ${sizeClass} text-gray-300`} />
          <div
            className="absolute overflow-hidden"
            style={{ width: `${partialStar * 100}%` }}
          >
            <Star className={`${sizeClass} fill-atlas-gold text-atlas-gold`} />
          </div>
        </div>
      );
    } else {
      // Empty star
      return (
        <Star
          key={i}
          className={`${sizeClass} text-gray-300`}
        />
      );
    }
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">{stars}</div>
      {showRating && (
        <span className={`text-${size === 'sm' ? 'xs' : 'sm'} text-muted-foreground ml-1`}>
          {rating}
          {totalRatings !== null && totalRatings !== undefined && (
            <span> ({Number(totalRatings).toLocaleString()})</span>
          )}
        </span>
      )}
    </div>
  );
}; 