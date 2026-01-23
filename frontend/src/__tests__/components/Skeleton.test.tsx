import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, fireEvent } from '../test-utils';
import { Skeleton, MatchCardSkeleton, StatsSkeleton, LeaderboardSkeleton } from '../../components/Skeleton';

describe('Skeleton Components', () => {
  it('should render skeleton with default class', () => {
    const { container } = renderWithProviders(<Skeleton className="h-4 w-24" />);
    const skeleton = container.querySelector('.animate-pulse');
    
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('h-4', 'w-24');
  });

  it('should render multiple skeletons with count prop', () => {
    const { container } = renderWithProviders(<Skeleton count={3} className="h-4 w-24" />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    
    expect(skeletons).toHaveLength(3);
  });

  it('should render match card skeleton', () => {
    const { container } = renderWithProviders(<MatchCardSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render stats skeleton', () => {
    const { container } = renderWithProviders(<StatsSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render leaderboard skeleton', () => {
    const { container } = renderWithProviders(<LeaderboardSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
