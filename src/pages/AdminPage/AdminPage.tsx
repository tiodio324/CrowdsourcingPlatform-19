import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { dataStore } from '@/store';
import { Card, Button, Input, Modal, Table, Select } from '@/components/UI';
import { Idea, Category, CategoryFormData, IdeaStatus } from '@/types';
import styles from './AdminPage.module.scss';

type AdminTab = 'ideas' | 'categories';

export const AdminPage = observer(() => {
  const { ideas, categories, activeCategories, updateIdea, createCategory, updateCategory, deleteCategory, getCategoryById } = dataStore;
  const [activeTab, setActiveTab] = useState<AdminTab>('ideas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({ name: '', description: '' });

  const handleStatusChange = async (id: string, status: IdeaStatus) => { await updateIdea(id, { status }); };
  const handleOpenModal = (cat?: Category) => { if (cat) { setEditingCategory(cat); setFormData({ name: cat.name, description: cat.description }); } else { setEditingCategory(null); setFormData({ name: '', description: '' }); } setIsModalOpen(true); };
  const handleSubmit = async () => { if (editingCategory) await updateCategory(editingCategory.id, formData); else await createCategory(formData); setIsModalOpen(false); };
  const handleDeleteCategory = async (id: string) => { if (confirm('Удалить?')) await deleteCategory(id); };

  const statusOptions = [{ value: 'pending', label: 'На рассмотрении' }, { value: 'approved', label: 'Одобрено' }, { value: 'implemented', label: 'Реализовано' }, { value: 'rejected', label: 'Отклонено' }];
  const ideaColumns = [
    { key: 'title', title: 'Название' },
    { key: 'authorName', title: 'Автор' },
    { key: 'categoryId', title: 'Категория', render: (i: Idea) => getCategoryById(i.categoryId)?.name || '-' },
    { key: 'votes', title: 'Голоса' },
    { key: 'status', title: 'Статус', render: (i: Idea) => <Select options={statusOptions} value={i.status} onChange={(e) => handleStatusChange(i.id, e.target.value as IdeaStatus)} /> }
  ];
  const categoryColumns = [
    { key: 'name', title: 'Название' },
    { key: 'description', title: 'Описание', render: (c: Category) => c.description || '-' },
    { key: 'actions', title: '', render: (c: Category) => <div style={{display:'flex',gap:'8px'}}><Button size="sm" variant="secondary" onClick={() => handleOpenModal(c)}>✏️</Button><Button size="sm" variant="danger" onClick={() => handleDeleteCategory(c.id)}>🗑️</Button></div> }
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Администрирование</h1>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'ideas' ? styles.active : ''}`} onClick={() => setActiveTab('ideas')}>Идеи ({ideas.length})</button>
        <button className={`${styles.tab} ${activeTab === 'categories' ? styles.active : ''}`} onClick={() => setActiveTab('categories')}>Категории ({activeCategories.length})</button>
      </div>
      {activeTab === 'ideas' && <Card className={styles.tableCard}><Table columns={ideaColumns} data={ideas} keyField="id" /></Card>}
      {activeTab === 'categories' && (<><div className={styles.actions}><Button variant="primary" onClick={() => handleOpenModal()}>Добавить категорию</Button></div><Card className={styles.tableCard}><Table columns={categoryColumns} data={categories} keyField="id" /></Card></>)}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}>
        <div className={styles.form}>
          <Input label="Название" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Описание" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <div className={styles.formActions}><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Отмена</Button><Button variant="primary" onClick={handleSubmit}>{editingCategory ? 'Сохранить' : 'Добавить'}</Button></div>
        </div>
      </Modal>
    </div>
  );
});
