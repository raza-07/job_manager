import { Star } from "lucide-react"

interface RatingStarsProps {
  rating: number
  onChange?: (rating: number) => void
  interactive?: boolean
}

export default function RatingStars({ rating, onChange, interactive = false }: RatingStarsProps) {
  const fullStars = Math.floor(rating)

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <Star
              key={i}
              className={`w-4 h-4 transition-colors ${
                i < fullStars 
                  ? "fill-warning text-warning" 
                  : "text-muted-foreground/30"
              } ${interactive ? "cursor-pointer hover:scale-110" : ""}`}
              onClick={() => interactive && onChange && onChange(starValue)}
            />
          );
        })}
      </div>
      <span className="text-xs font-semibold text-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}
