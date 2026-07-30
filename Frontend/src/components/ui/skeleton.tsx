import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return <div className={`skeleton-box ${className}`} style={style} />;
}

export function DishCardSkeleton() {
  return (
    <div className="dish-card-skeleton">
      <Skeleton className="dish-card-skeleton-img" />
      <div className="dish-card-skeleton-content">
        <Skeleton className="h-3.5 w-20 rounded" />
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-5 w-16 rounded mt-2" />
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="event-card-skeleton">
      <Skeleton className="event-card-skeleton-img" />
      <div className="event-card-skeleton-body">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-7 w-4/5 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="flex gap-4 mt-3">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function GallerySkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="gallery-skeleton-grid w-full">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="gallery-item-skeleton" />
      ))}
    </div>
  );
}

export function BranchCardSkeleton() {
  return (
    <div className="bg-white border border-[#e5eae1] rounded-[24px] overflow-hidden p-6 md:p-8 flex flex-col gap-6">
      <Skeleton className="w-full h-[260px] rounded-[16px]" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-1/2 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

export function PageSkeleton({ title = 'Loading...' }: { title?: string }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16 w-full flex flex-col items-center">
      <Skeleton className="h-10 w-48 mb-4 rounded-full" />
      <Skeleton className="h-5 w-72 mb-12 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <DishCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
