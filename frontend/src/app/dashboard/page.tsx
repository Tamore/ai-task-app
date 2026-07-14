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
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              AI Task Platform
            </h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Your Tasks</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-cyan-500/20"
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
          <div className="text-center py-12 glass-card rounded-xl">
            <p className="text-slate-400">No tasks found. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task._id} className="glass-card rounded-xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg truncate pr-8">{task.title}</h3>
                  <div className="absolute top-6 right-6">
                    {getStatusIcon(task.status)}
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs">Operation</span>
                    <span className="font-medium px-2 py-1 bg-white/5 rounded-md inline-block mt-1 border border-white/5">
                      {task.operationType}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-slate-400 block text-xs">Input</span>
                    <p className="truncate text-slate-300 mt-1 bg-slate-900/50 p-2 rounded-md">{task.inputText}</p>
                  </div>

                  {task.status === 'Success' && task.result && (
                    <div className="pt-3 border-t border-white/5 mt-4">
                      <span className="text-slate-400 block text-xs mb-1">Result</span>
                      <p className="text-green-400 font-medium truncate bg-green-500/10 p-2 rounded-md border border-green-500/20">{task.result}</p>
                    </div>
                  )}

                  {task.status === 'Failed' && task.logs && (
                    <div className="pt-3 border-t border-white/5 mt-4">
                      <span className="text-slate-400 block text-xs mb-1">Error Log</span>
                      <p className="text-red-400 text-xs bg-red-500/10 p-2 rounded-md border border-red-500/20">{task.logs}</p>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 relative animate-in fade-in zoom-in duration-200 border border-slate-700">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold mb-6">Create New Task</h3>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-white"
                  placeholder="E.g., Process document 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Operation Type</label>
                <select
                  value={newTaskOperation}
                  onChange={(e) => setNewTaskOperation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-white"
                >
                  <option value="Uppercase">Uppercase</option>
                  <option value="Lowercase">Lowercase</option>
                  <option value="Reverse String">Reverse String</option>
                  <option value="Word Count">Word Count</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Input Text</label>
                <textarea
                  required
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none min-h-[100px] text-white"
                  placeholder="Enter text to process..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center shadow-lg shadow-cyan-500/20"
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
