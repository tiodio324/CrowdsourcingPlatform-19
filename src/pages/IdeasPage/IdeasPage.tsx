import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { dataStore, authStore } from '@/store';
import { Card, Button, Input, Select, Badge, Modal } from '@/components/UI';
import { IdeaFormData, getIdeaStatusLabel, getIdeaStatusColor } from '@/types';
import styles from './IdeasPage.module.scss';

export const IdeasPage = observer(() => {
  const { filteredIdeas, activeCategories, ideasLoading, setFilter, createIdea, voteIdea, getCategoryById } = dataStore;
  const { isContributor } = authStore;
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<IdeaFormData>({ title: '', description: '', categoryId: '', authorName: '' });

  useEffect(() => { const t = setTimeout(() => setFilter('search', searchValue || undefined), 300); return () => clearTimeout(t); }, [searchValue, setFilter]);

  const handleSubmit = async () => { await createIdea(formData); setIsModalOpen(false); setFormData({ title: '', description: '', categoryId: '', authorName: '' }); };
  const handleVote = async (id: string, value: 1 | -1) => { await voteIdea(id, value); };

  const categoryOptions = [{ value: '', label: 'Все категории' }, ...activeCategories.map(c => ({ value: c.id, label: c.name }))];
  const statusOptions = [{ value: '', label: 'Все статусы' }, { value: 'pending', label: 'На рассмотрении' }, { value: 'approved', label: 'Одобрено' }, { value: 'implemented', label: 'Реализовано' }];

  return (
    <div className={styles.page}>
      <div className={styles.header}><h1 className={styles.title}>Идеи</h1>{isContributor && <Button variant="primary" onClick={() => setIsModalOpen(true)}>Предложить идею</Button>}</div>
      <div className={styles.filters}>
        <Input placeholder="Поиск..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className={styles.searchInput} />
        <Select options={categoryOptions} value="" onChange={(e) => setFilter('categoryId', e.target.value || undefined)} />
        <Select options={statusOptions} value="" onChange={(e) => setFilter('status', e.target.value || undefined)} />
      </div>
      {ideasLoading ? <div className={styles.loading}>Загрузка...</div> : filteredIdeas.length === 0 ? <div className={styles.empty}>Идеи не найдены</div> : (
        <div className={styles.grid}>
          {filteredIdeas.map(idea => (
            <Card key={idea.id} className={styles.ideaCard}>
              <div className={styles.ideaHeader}><h3>{idea.title}</h3><Badge variant={getIdeaStatusColor(idea.status) as 'success'|'warning'|'info'|'error'}>{getIdeaStatusLabel(idea.status)}</Badge></div>
              <p className={styles.description}>{idea.description}</p>
              <div className={styles.meta}><span>{getCategoryById(idea.categoryId)?.name}</span><span>by {idea.authorName}</span></div>
              <div className={styles.voting}>
                {isContributor && <Button size="sm" variant="secondary" onClick={() => handleVote(idea.id, 1)}>👍</Button>}
                <span className={styles.votes}>{idea.votes}</span>
                {isContributor && <Button size="sm" variant="secondary" onClick={() => handleVote(idea.id, -1)}>👎</Button>}
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Предложить идею">
        <div className={styles.form}>
          <Input label="Название" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <Input label="Описание" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          <Select label="Категория" options={activeCategories.map(c => ({ value: c.id, label: c.name }))} value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required />
          <Input label="Ваше имя" value={formData.authorName} onChange={(e) => setFormData({ ...formData, authorName: e.target.value })} required />
          <div className={styles.formActions}><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Отмена</Button><Button variant="primary" onClick={handleSubmit}>Отправить</Button></div>
        </div>
      </Modal>
    </div>
  );
});
