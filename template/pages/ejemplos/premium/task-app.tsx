import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CheckIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
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
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Diseñar nueva página de inicio',
    description: 'Crear mockups y wireframes para la nueva página principal',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-02-15',
    createdAt: '2025-01-15',
    tags: ['diseño', 'ui/ux']
  },
  {
    id: '2',
    title: 'Implementar sistema de autenticación',
    description: 'Configurar NextAuth.js con múltiples proveedores',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2025-02-20',
    createdAt: '2025-01-14',
    tags: ['desarrollo', 'backend']
  },
  {
    id: '3',
    title: 'Documentación de API',
    description: 'Escribir documentación completa de todos los endpoints',
    status: 'done',
    priority: 'low',
    dueDate: '2025-01-30',
    createdAt: '2025-01-10',
    tags: ['documentación', 'api']
  }
];

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const statusConfig = {
  todo: {
    title: 'Por Hacer',
    color: 'bg-gray-100 dark:bg-gray-800',
    icon: ClockIcon
  },
  'in-progress': {
    title: 'En Progreso',
    color: 'bg-blue-100 dark:bg-blue-900',
    icon: ClockIcon
  },
  done: {
    title: 'Completado',
    color: 'bg-green-100 dark:bg-green-900',
    icon: CheckIcon
  }
};

function TaskCard({ task, index }: { task: Task; index: number }) {
  const [tasks, setTasks] = useLocalStorageState<Task[]>('tasks', { defaultValue: initialTasks });

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
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

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 mb-3 transition-shadow ${
            snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {task.title}
            </h3>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
            {task.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                <TagIcon className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority}
            </span>
            
            <span
              className={`text-xs ${
                isOverdue(task.dueDate) ? 'text-red-500 font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {formatDate(task.dueDate)}
            </span>
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
    <div className={`rounded-lg p-4 ${config.color}`}>
      <div className="flex items-center mb-4">
        <Icon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
        <h2 className="font-semibold text-gray-900 dark:text-white">
          {config.title}
        </h2>
        <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-1 text-xs">
          {tasks.length}
        </span>
      </div>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-32 transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <ClockIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No hay tareas aquí</p>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status: 'todo',
      priority,
      dueDate,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setTags('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 relative">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Nueva Tarea
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Título de la tarea"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Descripción detallada..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha límite
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (separados por comas)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="desarrollo, diseño, urgente"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Crear Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TaskApp() {
  const [tasks, setTasks] = useLocalStorageState<Task[]>('tasks', { defaultValue: initialTasks });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'overdue'>('all');

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
  };

  const getFilteredTasks = (status: string) => {
    let filtered = tasks.filter(task => task.status === status);
    
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
    highPriority: tasks.filter(task => task.priority === 'high').length
  };

  return (
    <>
      <Head>
        <title>Task Management App - Full Integration Examples</title>
        <meta name="description" content="Aplicación de gestión de tareas con persistencia local" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos/premium" className="text-blue-600 hover:text-blue-800 mr-4">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    📋 Task Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Gestiona tus tareas con drag & drop
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Nueva Tarea</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">Total</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.completed}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">Completadas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.overdue}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">Vencidas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <TagIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.highPriority}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">Alta Prioridad</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'high'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Alta Prioridad
            </button>
            <button
              onClick={() => setFilter('overdue')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'overdue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Vencidas
            </button>
          </div>

          {/* Kanban Board */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              📚 Características del Task Manager
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Drag & Drop
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• React Beautiful DnD</li>
                  <li>• Reordenamiento en columnas</li>
                  <li>• Movimiento entre estados</li>
                  <li>• Feedback visual</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Persistencia Local
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• LocalStorage automático</li>
                  <li>• Estado persistente</li>
                  <li>• Sincronización en tiempo real</li>
                  <li>• Backup automático</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Funcionalidades
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Prioridades y fechas límite</li>
                  <li>• Sistema de tags</li>
                  <li>• Filtros avanzados</li>
                  <li>• Estadísticas en tiempo real</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}