import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CheckIcon, ClockIcon, TagIcon } from '@/components/ui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useLocalStorageState from 'use-local-storage-state';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  tags: string[];
  assignee?: string;
  estimatedHours?: number;
  completedAt?: string;
  attachments?: string[];
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Diseñar nueva página de inicio 🎨',
    description: 'Crear mockups y wireframes para la nueva página principal con enfoque en UX/UI moderno',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-02-15',
    createdAt: '2025-01-15',
    tags: ['diseño', 'ui/ux', 'homepage'],
    assignee: 'Ana García',
    estimatedHours: 16,
    attachments: ['mockup.figma', 'wireframe.pdf']
  },
  {
    id: '2',
    title: 'Implementar sistema de autenticación 🔐',
    description: 'Configurar NextAuth.js con múltiples proveedores (Google, GitHub, Email)',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2025-02-20',
    createdAt: '2025-01-14',
    tags: ['desarrollo', 'backend', 'seguridad'],
    assignee: 'Carlos López',
    estimatedHours: 24
  },
  {
    id: '3',
    title: 'Documentación de API completa 📚',
    description: 'Escribir documentación detallada de todos los endpoints con ejemplos de uso',
    status: 'done',
    priority: 'low',
    dueDate: '2025-01-30',
    createdAt: '2025-01-10',
    tags: ['documentación', 'api', 'openapi'],
    assignee: 'María Rodríguez',
    estimatedHours: 12,
    completedAt: '2025-01-28'
  },
  {
    id: '4',
    title: 'Testing automatizado E2E 🧪',
    description: 'Implementar tests end-to-end con Playwright para flujos críticos',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-02-25',
    createdAt: '2025-01-16',
    tags: ['testing', 'qa', 'automatización'],
    assignee: 'David Chen',
    estimatedHours: 20
  },
  {
    id: '5',
    title: 'Optimización de performance ⚡',
    description: 'Mejorar Core Web Vitals y tiempo de carga inicial',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-02-18',
    createdAt: '2025-01-17',
    tags: ['performance', 'seo', 'optimización'],
    assignee: 'Sophie Martin',
    estimatedHours: 18
  }
];

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
};

const priorityIcons = {
  low: '🟢',
  medium: '🟡', 
  high: '🔴'
};

const statusConfig = {
  todo: {
    title: 'Por Hacer',
    color: 'bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
    icon: ClockIcon,
    gradient: 'from-gray-500 to-slate-600'
  },
  'in-progress': {
    title: 'En Progreso',
    color: 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20',
    icon: ClockIcon,
    gradient: 'from-blue-500 to-cyan-600'
  },
  done: {
    title: 'Completado',
    color: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20',
    icon: CheckIcon,
    gradient: 'from-green-500 to-emerald-600'
  }
};

export default function TaskApp() {
  const [tasks, setTasks] = useLocalStorageState<Task[]>('tasks', { defaultValue: initialTasks });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'overdue'>('all');
  const [showCode, setShowCode] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addNotification = (message: string) => {
    setNotifications((prev: string[]) => [...prev, message]);
    setTimeout(() => {
      setNotifications((prev: string[]) => prev.slice(1));
    }, 3000);
  };

  const CodeBlock = ({ title, code }: { title: string; code: string }) => (
    <div className="bg-gray-900 rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-green-400 font-mono text-sm">{title}</h4>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            addNotification('Código copiado al portapapeles! 📋');
          }}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
        >
          Copiar
        </button>
      </div>
      <pre className="text-gray-300 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  function TaskCard({ task, index }: { task: Task; index: number }) {
    const deleteTask = (taskId: string) => {
      setTasks(tasks.filter(t => t.id !== taskId));
      addNotification(`Tarea "${task.title}" eliminada 🗑️`);
    };

    const toggleTaskStatus = (taskId: string, currentStatus: Task['status']) => {
      const newStatus = currentStatus === 'done' ? 'todo' : 'done';
      const updatedTasks = tasks.map(t => 
        t.id === taskId 
          ? { 
              ...t, 
              status: newStatus,
              completedAt: newStatus === 'done' ? new Date().toISOString() : undefined
            }
          : t
      );
      setTasks(updatedTasks);
      addNotification(
        newStatus === 'done' 
          ? `¡Tarea completada! 🎉 "${task.title}"` 
          : `Tarea reactivada 🔄 "${task.title}"`
      );
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    };

    const isOverdue = (dueDate: string) => {
      return new Date(dueDate) < new Date() && task.status !== 'done';
    };

    const getDaysUntilDue = (dueDate: string) => {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const daysUntilDue = getDaysUntilDue(task.dueDate);

    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-4 transition-all duration-300 group ${
              snapshot.isDragging ? 'shadow-2xl rotate-2 scale-105' : 'hover:shadow-lg hover:scale-[1.02]'
            } ${isOverdue(task.dueDate) ? 'ring-2 ring-red-200 dark:ring-red-800' : ''}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <button
                    onClick={() => toggleTaskStatus(task.id, task.status)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      task.status === 'done'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
                    }`}
                  >
                    {task.status === 'done' && <CheckIcon className="w-3 h-3" />}
                  </button>
                  
                  <h3 className={`font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                    task.status === 'done' ? 'line-through opacity-60' : ''
                  }`}>
                    {task.title}
                  </h3>
                </div>
                
                <p className={`text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed ${
                  task.status === 'done' ? 'line-through opacity-60' : ''
                }`}>
                  {task.description}
                </p>
              </div>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                >
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Assignee & Hours */}
            {(task.assignee || task.estimatedHours) && (
              <div className="flex items-center space-x-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
                {task.assignee && (
                  <div className="flex items-center space-x-1">
                    <span>👤</span>
                    <span>{task.assignee}</span>
                  </div>
                )}
                {task.estimatedHours && (
                  <div className="flex items-center space-x-1">
                    <span>⏱️</span>
                    <span>{task.estimatedHours}h</span>
                  </div>
                )}
                {task.attachments && task.attachments.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <span>📎</span>
                    <span>{task.attachments.length}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Footer */}
            <div className="flex justify-between items-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                  priorityColors[task.priority]
                }`}
              >
                <span className="mr-1">{priorityIcons[task.priority]}</span>
                {task.priority === 'low' ? 'Baja' : task.priority === 'medium' ? 'Media' : 'Alta'}
              </span>
              
              <div className="flex items-center space-x-2">
                {daysUntilDue <= 3 && daysUntilDue >= 0 && task.status !== 'done' && (
                  <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-1 rounded-full">
                    ⚠️ {daysUntilDue === 0 ? 'Hoy' : `${daysUntilDue}d`}
                  </span>
                )}
                
                <span
                  className={`text-xs font-medium ${
                    isOverdue(task.dueDate) ? 'text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {isOverdue(task.dueDate) ? '🚨 Vencida' : formatDate(task.dueDate)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }

  function TaskColumn({ status, tasks }: { status: string; tasks: Task[] }) {
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <div className={`rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 ${config.color} backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`w-10 h-10 bg-gradient-to-r ${config.gradient} rounded-xl flex items-center justify-center mr-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                {config.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
              </p>
            </div>
          </div>
          
          <span className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-600 dark:text-gray-300 rounded-full px-3 py-1 text-sm font-medium border border-gray-200/50 dark:border-gray-700/50">
            {tasks.length}
          </span>
        </div>
        
        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-40 transition-all duration-300 rounded-xl ${
                snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/10 ring-2 ring-blue-200 dark:ring-blue-800' : ''
              }`}
            >
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
              
              {tasks.length === 0 && (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">No hay tareas aquí</p>
                  <p className="text-xs mt-1">Arrastra tareas desde otras columnas</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    );
  }

  function NewTaskModal({ isOpen, onClose, onSubmit }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [dueDate, setDueDate] = useState('');
    const [tags, setTags] = useState('');
    const [assignee, setAssignee] = useState('');
    const [estimatedHours, setEstimatedHours] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;

      onSubmit({
        title: title.trim(),
        description: description.trim(),
        status: 'todo',
        priority,
        dueDate,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        assignee: assignee.trim() || undefined,
        estimatedHours: estimatedHours ? parseInt(estimatedHours) : undefined
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setTags('');
      setAssignee('');
      setEstimatedHours('');
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-2xl relative border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                ✨ Nueva Tarea
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Crea una nueva tarea para tu proyecto
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Título de la tarea
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Ej: Implementar nueva funcionalidad 🚀"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Descripción detallada
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                placeholder="Describe los detalles de la tarea, objetivos y requisitos..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Prioridad
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="low">🟢 Baja</option>
                  <option value="medium">🟡 Media</option>
                  <option value="high">🔴 Alta</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Fecha límite
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Horas estimadas
                </label>
                <input
                  type="number"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="8"
                  min="1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Asignado a
                </label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Nombre del responsable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tags (separados por comas)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="desarrollo, frontend, urgente"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ✨ Crear Tarea
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const columnTasks = tasks.filter(task => task.status === source.droppableId);
      const task = columnTasks[source.index];
      const newTasks = [...tasks];
      const taskIndex = newTasks.findIndex(t => t.id === task.id);
      newTasks.splice(taskIndex, 1);
      
      const newColumnTasks = tasks.filter(task => task.status === source.droppableId);
      newColumnTasks.splice(destination.index, 0, task);
      
      setTasks([
        ...newTasks.filter(task => task.status !== source.droppableId),
        ...newColumnTasks
      ]);
    } else {
      // Moving between columns
      const newTasks = tasks.map(task => 
        task.id === draggableId 
          ? { ...task, status: destination.droppableId as Task['status'] }
          : task
      );
      setTasks(newTasks);
    }
  };

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, task]);
    addNotification(`¡Nueva tarea creada! 🎉 "${task.title}"`);
  };

  const getFilteredTasks = (status: string) => {
    let filtered = tasks.filter(task => task.status === status);
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filter === 'high') {
      filtered = filtered.filter(task => task.priority === 'high');
    } else if (filter === 'overdue') {
      filtered = filtered.filter(task => 
        new Date(task.dueDate) < new Date() && task.status !== 'done'
      );
    }
    
    return filtered;
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'done').length,
    overdue: tasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status !== 'done'
    ).length,
    highPriority: tasks.filter(task => task.priority === 'high').length,
    totalHours: tasks.reduce((acc, task) => acc + (task.estimatedHours || 0), 0),
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(task => task.status === 'done').length / tasks.length) * 100) : 0
  };

  return (
    <>
      <Head>
        <title>Gestión de Tareas Pro - Ejemplos de Integración Completa</title>
        <meta name="description" content="Aplicación profesional de gestión de tareas con drag & drop y persistencia local" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30">
        {/* Notificaciones */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-xl backdrop-blur-sm border border-white/20 animate-in slide-in-from-right duration-300"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                {notification}
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos" className="text-blue-600 hover:text-blue-800 mr-4 transition-colors">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    <span>📋</span>
                    Task Management Pro
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Gestión de Tareas
                  </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {stats.total} tareas totales
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                      {stats.completionRate}% completado
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCode(showCode === 'kanban' ? null : 'kanban')}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 text-sm font-medium"
                >
                  <span>📝</span>
                  <span>{showCode === 'kanban' ? 'Ocultar' : 'Ver'} Código</span>
                </button>
                
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Nueva Tarea</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showCode === 'kanban' && (
            <div className="mb-8">
              <CodeBlock
                title="Kanban Board con Drag & Drop - React Beautiful DnD"
                code={`// Kanban Board Implementation
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function KanbanBoard({ tasks, onTaskMove }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      // Moving between columns
      const newTasks = tasks.map(task => 
        task.id === draggableId 
          ? { ...task, status: destination.droppableId }
          : task
      );
      onTaskMove(newTasks);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['todo', 'in-progress', 'done'].map(status => (
          <TaskColumn key={status} status={status} tasks={getTasksByStatus(status)} />
        ))}
      </div>
    </DragDropContext>
  );
}

function TaskColumn({ status, tasks }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
          <CheckIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-lg">Por Hacer</h2>
          <p className="text-sm text-gray-600">{tasks.length} tareas</p>
        </div>
      </div>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={\`min-h-40 transition-all duration-300 rounded-xl \${
              snapshot.isDraggingOver ? 'bg-blue-50/50 ring-2 ring-blue-200' : ''
            }\`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

// TaskCard with enhanced features
function TaskCard({ task, index }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={\`bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border p-6 mb-4 transition-all duration-300 group \${
            snapshot.isDragging ? 'shadow-2xl rotate-2 scale-105' : 'hover:shadow-lg hover:scale-[1.02]'
          }\`}
        >
          <div className="flex items-center space-x-3 mb-2">
            <button className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
              {task.status === 'done' && <CheckIcon className="w-3 h-3" />}
            </button>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {task.title}
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {task.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {task.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                {tag}
              </span>
            ))}
          </div>
          
          {/* Footer with priority and date */}
          <div className="flex justify-between items-center">
            <span className={\`px-3 py-1 rounded-full text-xs font-medium \${getPriorityColors(task.priority)}\`}>
              {getPriorityIcon(task.priority)} {task.priority}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(task.dueDate)}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}`}
              />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Total</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.completed}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Completadas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.overdue}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Vencidas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <TagIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.highPriority}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Alta Prioridad</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">⏱️</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalHours}h
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Estimadas</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.completionRate}%
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Progreso</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar tareas... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  Todas ({tasks.length})
                </button>
                <button
                  onClick={() => setFilter('high')}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                    filter === 'high'
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  🔴 Alta Prioridad ({stats.highPriority})
                </button>
                <button
                  onClick={() => setFilter('overdue')}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                    filter === 'overdue'
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  🚨 Vencidas ({stats.overdue})
                </button>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <TaskColumn status="todo" tasks={getFilteredTasks('todo')} />
              <TaskColumn status="in-progress" tasks={getFilteredTasks('in-progress')} />
              <TaskColumn status="done" tasks={getFilteredTasks('done')} />
            </div>
          </DragDropContext>
        </div>

        {/* New Task Modal */}
        <NewTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={addTask}
        />

        {/* Documentation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                🚀 Task Management Pro - Funcionalidades
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
                Sistema completo de gestión de tareas con Kanban, drag & drop y persistencia local
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xl">
                    🎯
                  </div>
                  <h3 className="font-bold text-blue-900 dark:text-blue-100 ml-3">
                    Kanban Board
                  </h3>
                </div>
                <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>React Beautiful DnD</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Drag & Drop fluido</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Estados: Todo, En Progreso, Completado</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Feedback visual en tiempo real</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Animaciones suaves</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl">
                    💾
                  </div>
                  <h3 className="font-bold text-purple-900 dark:text-purple-100 ml-3">
                    Persistencia Local
                  </h3>
                </div>
                <ul className="text-purple-800 dark:text-purple-200 space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>LocalStorage automático</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Estado persistente</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Sync en tiempo real</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>No pérdida de datos</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Recuperación automática</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xl">
                    ⚡
                  </div>
                  <h3 className="font-bold text-green-900 dark:text-green-100 ml-3">
                    Funcionalidades Avanzadas
                  </h3>
                </div>
                <ul className="text-green-800 dark:text-green-200 space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Prioridades con colores</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Fechas límite y alertas</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Sistema de tags</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Asignación de usuarios</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Estimación de horas</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-orange-200/50 dark:border-orange-800/50">
                <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                                     Análisis e Informes
                </h3>
                <ul className="text-orange-800 dark:text-orange-200 space-y-2 text-sm">
                  <li>• Estadísticas en tiempo real</li>
                  <li>• Tasa de completación automática</li>
                  <li>• Tracking de horas estimadas vs reales</li>
                  <li>• Identificación de tareas vencidas</li>
                  <li>• Dashboard de productividad</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-800/50">
                <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🔄</span>
                  Workflow & Automation
                </h3>
                <ul className="text-indigo-800 dark:text-indigo-200 space-y-2 text-sm">
                  <li>• Flujo de trabajo visual</li>
                  <li>• Transiciones automáticas de estado</li>
                  <li>• Notificaciones inteligentes</li>
                  <li>• Filtros y búsqueda avanzada</li>
                  <li>• Integración con APIs externas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
