export interface Comment {
  id: string; ideaId: string; authorName: string; content: string; createdAt: string;
}

export interface CommentFormData { ideaId: string; authorName: string; content: string; }
