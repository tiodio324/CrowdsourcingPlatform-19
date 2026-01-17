export type IdeaStatus = 'pending' | 'approved' | 'implemented' | 'rejected';

export interface Idea {
  id: string; title: string; description: string; categoryId: string;
  authorName: string; votes: number; status: IdeaStatus;
  isActive: boolean; createdAt: string; updatedAt: string;
}

export interface IdeaFormData { title: string; description: string; categoryId: string; authorName: string; }

export const getIdeaStatusLabel = (s: IdeaStatus): string => ({ pending: 'На рассмотрении', approved: 'Одобрена', implemented: 'Реализована', rejected: 'Отклонена' }[s]);
export const getIdeaStatusColor = (s: IdeaStatus): string => ({ pending: 'warning', approved: 'info', implemented: 'success', rejected: 'error' }[s]);
