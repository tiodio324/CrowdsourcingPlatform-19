export type PageId = 'home' | 'ideas' | 'categories' | 'rating' | 'admin' | 'admin-ideas' | 'admin-categories';

export interface PageConfig { id: PageId; title: string; icon: string; requiresAuth: boolean; requiredRole?: 'contributor' | 'admin'; showInNav: boolean; parentId?: PageId; }

export const PAGES_CONFIG: Record<PageId, PageConfig> = {
  home: { id: 'home', title: 'Главная', icon: 'home', requiresAuth: false, showInNav: true },
  ideas: { id: 'ideas', title: 'Идеи', icon: 'lightbulb', requiresAuth: false, showInNav: true },
  categories: { id: 'categories', title: 'Категории', icon: 'folder', requiresAuth: false, showInNav: true },
  rating: { id: 'rating', title: 'Рейтинг', icon: 'star', requiresAuth: false, showInNav: true },
  admin: { id: 'admin', title: 'Администрирование', icon: 'settings', requiresAuth: true, requiredRole: 'admin', showInNav: true },
  'admin-ideas': { id: 'admin-ideas', title: 'Управление идеями', icon: 'edit', requiresAuth: true, requiredRole: 'admin', showInNav: false, parentId: 'admin' },
  'admin-categories': { id: 'admin-categories', title: 'Управление категориями', icon: 'folder-plus', requiresAuth: true, requiredRole: 'admin', showInNav: false, parentId: 'admin' },
};
