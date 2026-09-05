import React, { useState } from 'react';
import { ArrowLeft, Plus, Check, X, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TodoListProps {
  onNavigateHome: () => void;
}

interface Todo {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  category: 'personal' | 'work' | 'health' | 'social';
}

const TodoList: React.FC<TodoListProps> = ({ onNavigateHome }) => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      title: 'Morning meditation',
      description: 'Start the day with 10 minutes of mindfulness',
      priority: 'high',
      dueDate: '2024-01-15',
      completed: false,
      category: 'health'
    },
    {
      id: 2,
      title: 'Complete project proposal',
      description: 'Finish the quarterly project proposal for review',
      priority: 'high',
      dueDate: '2024-01-16',
      completed: false,
      category: 'work'
    },
    {
      id: 3,
      title: 'Call mom',
      description: 'Check in with mom and catch up',
      priority: 'medium',
      dueDate: '2024-01-17',
      completed: true,
      category: 'social'
    },
    {
      id: 4,
      title: 'Grocery shopping',
      description: 'Buy healthy food for the week',
      priority: 'low',
      dueDate: '2024-01-18',
      completed: false,
      category: 'personal'
    }
  ]);

  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    category: 'personal' as 'personal' | 'work' | 'health' | 'social'
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const addTodo = () => {
    if (newTodo.title.trim()) {
      const todo: Todo = {
        id: Date.now(),
        title: newTodo.title,
        description: newTodo.description,
        priority: newTodo.priority,
        dueDate: newTodo.dueDate,
        completed: false,
        category: newTodo.category
      };
      setTodos([...todos, todo]);
      setNewTodo({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: 'personal'
      });
      setShowAddForm(false);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-indigo-100 text-indigo-800';
      case 'health': return 'bg-emerald-100 text-emerald-800';
      case 'social': return 'bg-violet-100 text-violet-800';
      case 'personal': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'completed': return todo.completed;
      case 'pending': return !todo.completed;
      default: return true;
    }
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 text-slate-600 hover:text-violet-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-violet-600" />
              <h1 className="text-3xl font-bold text-slate-800">Mindful To-Do List</h1>
            </div>
          </div>

          <div className="text-center mb-8">
            <img 
              src="/to do.png" 
              alt="Task management" 
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover shadow-md"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-violet-400 to-violet-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-100 text-sm">Total Tasks</p>
                  <p className="text-2xl font-bold">{totalCount}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-violet-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Completed</p>
                  <p className="text-2xl font-bold">{completedCount}</p>
                </div>
                <Check className="w-8 h-8 text-emerald-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Pending</p>
                  <p className="text-2xl font-bold">{totalCount - completedCount}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Progress</p>
                  <p className="text-2xl font-bold">{completionPercentage}%</p>
                </div>
                <Calendar className="w-8 h-8 text-indigo-200" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-slate-800">Overall Progress</h3>
              <span className="text-sm text-slate-600">{completionPercentage}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-violet-400 to-violet-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all' 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'pending' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Pending ({totalCount - completedCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'completed' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Add Todo Form */}
          {showAddForm && (
            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Task</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({...newTodo, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                  <select
                    value={newTodo.priority}
                    onChange={(e) => setNewTodo({...newTodo, priority: e.target.value as 'low' | 'medium' | 'high'})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={newTodo.category}
                    onChange={(e) => setNewTodo({...newTodo, category: e.target.value as 'personal' | 'work' | 'health' | 'social'})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="health">Health</option>
                    <option value="social">Social</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={addTodo}
                  className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Todo List */}
          <div className="space-y-4">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-500 mb-2">No tasks found</h3>
                <p className="text-slate-400">
                  {filter === 'all' 
                    ? "Add your first task to get started!" 
                    : `No ${filter} tasks at the moment.`}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    todo.completed 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-white border-slate-200 hover:border-violet-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className={`text-lg font-semibold ${
                          todo.completed ? 'text-emerald-800 line-through' : 'text-slate-800'
                        }`}>
                          {todo.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(todo.category)}`}>
                          {todo.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                          {todo.priority}
                        </span>
                      </div>
                      <p className={`text-slate-600 mb-3 ${todo.completed ? 'line-through' : ''}`}>
                        {todo.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-500">Due: {todo.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          todo.completed
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-slate-200 text-slate-600 hover:bg-violet-500 hover:text-white'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 rounded-full bg-slate-200 text-slate-600 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Motivational Message */}
          <div className="mt-8 p-6 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-violet-600" />
              <div>
                <h4 className="font-semibold text-violet-800">Mindful Productivity Tip</h4>
                <p className="text-violet-700 text-sm">
                  Remember to take breaks between tasks. A well-organized to-do list helps reduce stress and anxiety by giving you a clear sense of direction and accomplishment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;