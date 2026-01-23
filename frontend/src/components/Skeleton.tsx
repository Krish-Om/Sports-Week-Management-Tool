interface SkeletonProps {
  className?: string;
  count?: number;
}

/**
 * Skeleton component for loading states
 * Shows a shimmer animation while data is being fetched
 */
export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
        />
      ))}
    </>
  );
}

/**
 * Skeleton for a full match card
 */
export function MatchCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}

/**
 * Skeleton for a dashboard stats card
 */
export function StatsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

/**
 * Skeleton for a leaderboard table
 */
export function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for a table row
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="px-6 py-3">
          <Skeleton className="h-4 w-24" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton for a form input
 */
export function FormInputSkeleton() {
  return (
    <div className="space-y-2 mb-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

/**
 * Skeleton for a modal/dialog
 */
export function ModalSkeleton() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}
