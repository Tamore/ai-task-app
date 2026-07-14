"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { LogOut, Plus, Clock, CheckCircle2, XCircle, Loader2, PlayCircle, Inbox, Activity, Check, X, Calendar, Trash2, Sparkles } from 'lucide-react';

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

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Running': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'Success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)]">
      <nav className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[#a65421] flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-text-main)] font-serif tracking-tight">
                AI Task Platform
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors active:scale-95"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">Your Tasks</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[#a65421] text-white rounded-xl font-medium transition-all shadow-[0_4px_14px_0_rgba(194,101,42,0.39)] hover:shadow-[0_6px_20px_rgba(194,101,42,0.23)] active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">No AI tasks yet</h3>
            <p className="text-[var(--color-text-muted)] mb-6 text-center max-w-sm">Create your first processing task to begin analyzing and transforming your text.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-5 py-2.5 bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-xl font-medium transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task._id} className="bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-2xl p-7 flex flex-col h-[550px] relative group hover:-translate-y-1 hover:shadow-xl hover:border-[var(--color-primary)]/30 transition-all duration-300 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-start mb-5 gap-4 shrink-0">
                  <h3 className="font-bold text-xl text-[var(--color-text-main)] pr-4 break-words leading-tight flex-1">{task.title}</h3>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {task.status === 'Pending' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">{getStatusIcon('Pending')}<span className="ml-1.5">Pending</span></span>}
                    {task.status === 'Running' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">{getStatusIcon('Running')}<span className="ml-1.5">Running</span></span>}
                    {task.status === 'Success' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">{getStatusIcon('Success')}<span className="ml-1.5">Success</span></span>}
                    {task.status === 'Failed' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">{getStatusIcon('Failed')}<span className="ml-1.5">Failed</span></span>}
                    
                    <button 
                      onClick={() => handleDeleteTask(task._id)}
                      className="p-1.5 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1 active:scale-95"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-5 shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[var(--color-bg-base)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]">
                    <Activity className="w-3.5 h-3.5 mr-1.5 text-[var(--color-primary)]" />
                    {task.operationType}
                  </span>
                </div>
                
                <div className="space-y-4 text-sm flex-1 overflow-y-auto pr-2">
                  <div>
                    <span className="text-[var(--color-text-muted)] block text-xs font-bold uppercase tracking-wider mb-1.5">Input</span>
                    <p className="text-[var(--color-text-main)] bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] p-3 rounded-xl whitespace-pre-wrap break-words leading-relaxed">{task.inputText}</p>
                  </div>

                  {task.status === 'Success' && task.result && (
                    <div className="pt-2">
                      <span className="text-[var(--color-text-muted)] block text-xs font-bold uppercase tracking-wider mb-1.5">Result</span>
                      <p className="text-emerald-800 font-medium bg-emerald-50 p-3 rounded-xl border border-emerald-100 whitespace-pre-wrap break-words leading-relaxed">{task.result}</p>
                    </div>
                  )}

                  {task.status === 'Failed' && task.logs && (
                    <div className="pt-2">
                      <span className="text-[var(--color-text-muted)] block text-xs font-bold uppercase tracking-wider mb-1.5">Error Log</span>
                      <p className="text-red-800 text-sm bg-red-50 p-3 rounded-xl border border-red-100 whitespace-pre-wrap break-words font-mono">{task.logs}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-5 pt-4 border-t border-[var(--color-border-subtle)] flex items-center text-xs text-[var(--color-text-muted)] font-medium shrink-0">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  {new Date(task.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-[var(--color-border-subtle)] flex justify-between items-center bg-[var(--color-bg-base)]">
              <h3 className="text-2xl font-bold text-[var(--color-text-main)]">Create New Task</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-border-subtle)] p-2 rounded-full transition-colors active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-8 space-y-6 overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Task Title</label>
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none text-[var(--color-text-main)] transition-all font-medium"
                    placeholder="E.g., Process quarterly report"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Operation Type</label>
                  <div className="relative">
                    <select
                      value={newTaskOperation}
                      onChange={(e) => setNewTaskOperation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none text-[var(--color-text-main)] transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="Uppercase">Uppercase</option>
                      <option value="Lowercase">Lowercase</option>
                      <option value="Reverse String">Reverse String</option>
                      <option value="Word Count">Word Count</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Input Text</label>
                  <textarea
                    required
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none min-h-[160px] text-[var(--color-text-main)] transition-all leading-relaxed resize-y"
                    placeholder="Enter the text you want to transform..."
                  />
                </div>
              </div>

              <div className="px-8 py-5 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-border-subtle)] transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[#a65421] text-white rounded-xl font-medium transition-all disabled:opacity-50 flex items-center shadow-[0_4px_14px_0_rgba(194,101,42,0.39)] hover:shadow-[0_6px_20px_rgba(194,101,42,0.23)] active:scale-95"
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
