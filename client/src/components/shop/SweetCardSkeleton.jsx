import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function SweetCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden border-1 animate-pulse shadow-sm">
      {/* Image Section Skeleton */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <Skeleton className="h-full w-full" />
        
        {/* Heart Button Skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Category Badge Skeleton */}
        <div className="absolute bottom-3 left-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Content Section Skeleton */}
      <CardContent className="flex-1 p-6 space-y-4">
        {/* Title and Description */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col space-y-1">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>

      {/* Footer Section Skeleton */}
      <CardFooter className="px-6 pt-0">
        <div className="w-full space-y-4">
          {/* Quantity Selector Skeleton */}
          <div className="flex items-center justify-center">
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="flex-1 h-11 rounded-md" />
            <Skeleton className="flex-1 h-11 rounded-md" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default SweetCardSkeleton;