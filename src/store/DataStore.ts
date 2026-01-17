import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { Idea, IdeaFormData, Category, CategoryFormData, Comment, CommentFormData, Vote, FilterParams } from '@/types';
import FirebaseService from '@/firebase';
import { authStore } from './AuthStore';

export class DataStore {
  ideas: Idea[] = []; categories: Category[] = []; comments: Comment[] = []; votes: Vote[] = [];
  ideasLoading = false; categoriesLoading = false;
  error: string | null = null; filters: FilterParams = {};

  constructor() { makeAutoObservable(this, {}, { autoBind: true }); }

  get filteredIdeas(): Idea[] {
    let r = this.ideas.filter(i => i.isActive);
    if (this.filters.categoryId) r = r.filter(i => i.categoryId === this.filters.categoryId);
    if (this.filters.status) r = r.filter(i => i.status === this.filters.status);
    if (this.filters.search) { const s = this.filters.search.toLowerCase(); r = r.filter(i => i.title.toLowerCase().includes(s)); }
    return r.sort((a, b) => b.votes - a.votes);
  }

  get activeCategories(): Category[] { return this.categories.filter(c => c.isActive).sort((a, b) => a.name.localeCompare(b.name, 'ru')); }
  get topIdeas(): Idea[] { return this.filteredIdeas.slice(0, 10); }
  get approvedIdeas(): Idea[] { return this.ideas.filter(i => i.isActive && i.status === 'approved'); }

  getCategoryById = (id: string): Category | undefined => this.categories.find(c => c.id === id);
  getIdeaById = (id: string): Idea | undefined => this.ideas.find(i => i.id === id);
  getCommentsForIdea = (ideaId: string): Comment[] => this.comments.filter(c => c.ideaId === ideaId);

  loadAllData = async (): Promise<void> => { await Promise.all([this.loadCategories(), this.loadIdeas(), this.loadComments(), this.loadVotes()]); };

  loadIdeas = async (): Promise<void> => { this.ideasLoading = true; try { const d = await FirebaseService.getData<Record<string, Idea>>('ideas'); runInAction(() => { this.ideas = d ? Object.values(d) : []; this.ideasLoading = false; }); } catch { runInAction(() => { this.error = 'Ошибка загрузки идей'; this.ideasLoading = false; }); } };
  loadCategories = async (): Promise<void> => { this.categoriesLoading = true; try { const d = await FirebaseService.getData<Record<string, Category>>('categories'); runInAction(() => { this.categories = d ? Object.values(d) : []; this.categoriesLoading = false; }); } catch { runInAction(() => { this.error = 'Ошибка загрузки категорий'; this.categoriesLoading = false; }); } };
  loadComments = async (): Promise<void> => { try { const d = await FirebaseService.getData<Record<string, Comment>>('comments'); runInAction(() => { this.comments = d ? Object.values(d) : []; }); } catch { console.error('Load comments error'); } };
  loadVotes = async (): Promise<void> => { try { const d = await FirebaseService.getData<Record<string, Vote>>('votes'); runInAction(() => { this.votes = d ? Object.values(d) : []; }); } catch { console.error('Load votes error'); } };

  createIdea = async (data: IdeaFormData): Promise<Idea | null> => {
    if (!authStore.canCreateIdeas()) return null;
    const now = new Date().toISOString();
    const idea: Idea = { id: uuidv4(), ...data, votes: 0, status: 'pending', isActive: true, createdAt: now, updatedAt: now };
    try { await FirebaseService.setData(`ideas/${idea.id}`, idea); runInAction(() => { this.ideas.push(idea); }); return idea; } catch { return null; }
  };

  updateIdea = async (id: string, data: Partial<Idea>): Promise<boolean> => {
    if (!authStore.canManageIdeas()) return false;
    const i = this.ideas.findIndex(x => x.id === id); if (i === -1) return false;
    const u = { ...this.ideas[i], ...data, updatedAt: new Date().toISOString() };
    try { await FirebaseService.setData(`ideas/${id}`, u); runInAction(() => { this.ideas[i] = u; }); return true; } catch { return false; }
  };

  voteIdea = async (ideaId: string, value: 1 | -1): Promise<boolean> => {
    if (!authStore.canVote()) return false;
    const i = this.ideas.findIndex(x => x.id === ideaId); if (i === -1) return false;
    const newVotes = this.ideas[i].votes + value;
    try { await FirebaseService.updateData(`ideas/${ideaId}`, { votes: newVotes }); runInAction(() => { this.ideas[i].votes = newVotes; }); return true; } catch { return false; }
  };

  createCategory = async (data: CategoryFormData): Promise<Category | null> => {
    if (!authStore.canManageCategories()) return null;
    const now = new Date().toISOString();
    const cat: Category = { id: uuidv4(), ...data, isActive: true, createdAt: now, updatedAt: now };
    try { await FirebaseService.setData(`categories/${cat.id}`, cat); runInAction(() => { this.categories.push(cat); }); return cat; } catch { return null; }
  };

  updateCategory = async (id: string, data: Partial<CategoryFormData>): Promise<boolean> => {
    if (!authStore.canManageCategories()) return false;
    const i = this.categories.findIndex(c => c.id === id); if (i === -1) return false;
    const u = { ...this.categories[i], ...data, updatedAt: new Date().toISOString() };
    try { await FirebaseService.setData(`categories/${id}`, u); runInAction(() => { this.categories[i] = u; }); return true; } catch { return false; }
  };

  deleteCategory = async (id: string): Promise<boolean> => {
    if (!authStore.canManageCategories()) return false;
    const i = this.categories.findIndex(c => c.id === id); if (i === -1) return false;
    try { await FirebaseService.updateData(`categories/${id}`, { isActive: false }); runInAction(() => { this.categories[i].isActive = false; }); return true; } catch { return false; }
  };

  addComment = async (data: CommentFormData): Promise<Comment | null> => {
    if (!authStore.canComment()) return null;
    const comment: Comment = { id: uuidv4(), ...data, createdAt: new Date().toISOString() };
    try { await FirebaseService.setData(`comments/${comment.id}`, comment); runInAction(() => { this.comments.push(comment); }); return comment; } catch { return null; }
  };

  setFilter = (key: keyof FilterParams, value: string | undefined): void => { this.filters = { ...this.filters, [key]: value }; };
  clearFilters = (): void => { this.filters = {}; };
  clearError = (): void => { this.error = null; };
}

export const dataStore = new DataStore();
