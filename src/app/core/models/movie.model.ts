import { SubscriptionTier } from './user.model';

export interface Movie {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  durationMinutes: number;
  thumbnailUrl: string;
  trailerUrl?: string;
  requiredSubscriptionTier: SubscriptionTier;
  averageRating?: number;
  totalReviews: number;
  isPublished: boolean;
  genres: string[];
  topics: string[];
}

export interface MovieFilter {
  searchTerm?: string;
  genreIds?: string[];
  topicIds?: string[];
  minReleaseYear?: number;
  maxReleaseYear?: number;
  maxTier?: SubscriptionTier;
  minRating?: number;
  sortBy?: string;
  sortDescending?: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  movieId: string;
  rating: number;
  title?: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface MyReview extends Review{
  movieTitle: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  movieId: string;
  parentCommentId?: string;
  content: string;
  level: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt?: string;
  replies: Comment[];
}