"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { LogOut, Plus, Clock, CheckCircle2, XCircle, RefreshCw, Loader2, PlayCircle } from 'lucide-react';

type Task = {
  _id: string;
  title: string;
  inputText: string;
  operationType: string;
  status: 'Pending' | 'Running' | 'Success' | 'Failed';
  result?: string;
  logs?: string;
  createdAt: string;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskInput, setNewTaskInput] = useState('');
  const [newTaskOperation, setNewTaskOperation] = useState('Uppercase');
  const [creating, setCreating] = useState(false);
  
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        Cookies.remove('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Cookies.get('token')) {
      router.push('/login');
      return;
    }
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/tasks', {
        title: newTaskTitle,
        inputText: newTaskInput,
        operationType: newTaskOperation
      });
      setIsModalOpen(false);
      setNewTaskTitle('');
      setNewTaskInput('');
      setNewTaskOperation('Uppercase');
      fetchTasks();
    } catch (err) {
      alert('Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Running': return <PlayCircle className="w-5 h-5 text-blue-500" />;
      case 'Success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'Failed': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <RefreshCw className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)]">
      <nav className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-[var(--color-tertiary)] font-serif">
              AI Task Platform
            </h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-tertiary)] transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold font-serif text-[var(--color-primary)]">Your Tasks</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg font-medium transition-colors shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-xl">
            <p className="text-[var(--color-text-muted)]">No tasks found. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task._id} className="bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-xl p-6 relative overflow-hidden group hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg truncate pr-8">{task.title}</h3>
                  <div className="absolute top-6 right-6">
                    {getStatusIcon(task.status)}
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[var(--color-text-muted)] block text-xs font-bold uppercase tracking-wider">Operation</span>
                    <span className="font-medium px-2 py-1 bg-[var(--color-bg-base)] text-[var(--color-primary)] rounded-md inline-block mt-1 border border-[var(--color-border-subtle)]">
                      {task.operationType}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-[var(--color-text-muted)] block text-xs font-bold uppercase tracking-wider">Input</span>
                    <p className="truncate text-[var(--color-text-main)] mt-1 bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] p-2 rounded-md">{task.inputText}</p>
                  </div>

                  {task.status === 'Success' && task.result && (
                    <div className="pt-3 border-t border-[var(--color-border-subtle)] mt-4">
                      <span className="text-[var(--color-text-muted)] block text-xs font-bold uppercase tracking-wider mb-1">Result</span>
                      <p className="text-emerald-700 font-medium truncate bg-emerald-50 p-2 rounded-md border border-emerald-200">{task.result}</p>
                    </div>
                  )}

                  {task.status === 'Failed' && task.logs && (
                    <div className="pt-3 border-t border-[var(--color-border-subtle)] mt-4">
                      <span className="text-[var(--color-text-muted)] block text-xs font-bold uppercase tracking-wider mb-1">Error Log</span>
                      <p className="text-red-700 text-xs bg-red-50 p-2 rounded-md border border-red-200">{task.logs}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-tertiary)] transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold font-serif text-[var(--color-tertiary)] mb-6">Create New Task</h3>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none text-[var(--color-text-main)]"
                  placeholder="E.g., Process document 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Operation Type</label>
                <select
                  value={newTaskOperation}
                  onChange={(e) => setNewTaskOperation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none text-[var(--color-text-main)]"
                >
                  <option value="Uppercase">Uppercase</option>
                  <option value="Lowercase">Lowercase</option>
                  <option value="Reverse String">Reverse String</option>
                  <option value="Word Count">Word Count</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Input Text</label>
                <textarea
                  required
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none min-h-[100px] text-[var(--color-text-main)]"
                  placeholder="Enter text to process..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-base)] transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center shadow-md"
                >
                  {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
