import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, AlertTriangle, Trash2, Plus, Edit, X, Calendar, Flag } from "lucide-react";
import { format } from "date-fns";

const priorityColors = {
  high: "text-accent",
  medium: "text-amber-500",
  low: "text-secondary"
};

const priorityIcons = {
  high: <Flag className="w-4 h-4 text-accent" />,
  medium: <Flag className="w-4 h-4 text-amber-500" />,
  low: <Flag className="w-4 h-4 text-secondary" />
};

const MainFeature = ({ listId }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(`taskflow-tasks-${listId}`);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium"
  });
  
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load tasks when listId changes
  useEffect(() => {
    const savedTasks = localStorage.getItem(`taskflow-tasks-${listId}`);
    setTasks(savedTasks ? JSON.parse(savedTasks) : []);
  }, [listId]);

  // Save tasks when they change
  useEffect(() => {
    localStorage.setItem(`taskflow-tasks-${listId}`, JSON.stringify(tasks));
  }, [tasks, listId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({ ...prev, [name]: value }));
  };

  const addTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) return;
    
    const task = {
      id: `task-${Date.now()}`,
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate || null,
      priority: newTask.priority,
      listId
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium"
    });
    setIsFormOpen(false);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const startEditingTask = (task) => {
    setEditingTask({ ...task });
  };

  const saveEditedTask = () => {
    if (!editingTask.title.trim()) return;
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? { ...editingTask } : task
    ));
    
    setEditingTask(null);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    active: tasks.filter(task => !task.completed).length
  };

  return (
    <div className="space-y-6">
      {/* Task Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="card p-4 bg-primary/5 dark:bg-primary/10 border-primary/20"
        >
          <div className="text-2xl font-bold">{taskStats.total}</div>
          <div className="text-sm text-surface-500">Total Tasks</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="card p-4 bg-secondary/5 dark:bg-secondary/10 border-secondary/20"
        >
          <div className="text-2xl font-bold">{taskStats.completed}</div>
          <div className="text-sm text-surface-500">Completed</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="card p-4 bg-accent/5 dark:bg-accent/10 border-accent/20"
        >
          <div className="text-2xl font-bold">{taskStats.active}</div>
          <div className="text-sm text-surface-500">Active</div>
        </motion.div>
      </div>

      {/* Task Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter("all")}
            className={`btn ${filter === "all" ? "btn-primary" : "btn-outline"}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("active")}
            className={`btn ${filter === "active" ? "btn-primary" : "btn-outline"}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter("completed")}
            className={`btn ${filter === "completed" ? "btn-primary" : "btn-outline"}`}
          >
            Completed
          </button>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Task
        </motion.button>
      </div>

      {/* New Task Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6 mb-6 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Task</h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-surface-400 hover:text-accent"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={addTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="Task title"
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Task description"
                  className="input min-h-[80px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date (optional)</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                      <Calendar size={16} />
                    </div>
                    <input
                      type="date"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className="input pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Task
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 text-surface-500"
            >
              <div className="mb-4 flex justify-center">
                <div className="p-4 rounded-full bg-surface-100 dark:bg-surface-800">
                  <Clock size={32} className="text-surface-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-1">No tasks found</h3>
              <p className="text-sm">
                {filter === "all" 
                  ? "Add a new task to get started" 
                  : `No ${filter} tasks available`}
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`card p-4 ${
                  task.completed ? "border-l-4 border-secondary" : ""
                }`}
              >
                {editingTask && editingTask.id === task.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="title"
                      value={editingTask.title}
                      onChange={handleEditChange}
                      className="input font-medium"
                      required
                    />
                    
                    <textarea
                      name="description"
                      value={editingTask.description}
                      onChange={handleEditChange}
                      className="input min-h-[60px] text-sm"
                      placeholder="Description (optional)"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                            <Calendar size={16} />
                          </div>
                          <input
                            type="date"
                            name="dueDate"
                            value={editingTask.dueDate || ""}
                            onChange={handleEditChange}
                            className="input pl-10 text-sm"
                          />
                        </div>
                      </div>
                      
                      <select
                        name="priority"
                        value={editingTask.priority}
                        onChange={handleEditChange}
                        className="input text-sm"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={cancelEditing}
                        className="btn btn-outline text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEditedTask}
                        className="btn btn-primary text-sm"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border ${
                          task.completed 
                            ? "bg-secondary border-secondary text-white" 
                            : "border-surface-300 dark:border-surface-600"
                        } flex items-center justify-center`}
                      >
                        {task.completed && <Check size={12} />}
                      </button>
                      
                      <div className="flex-grow">
                        <h3 className={`font-medium ${
                          task.completed ? "task-item-completed" : ""
                        }`}>
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className={`mt-1 text-sm text-surface-600 dark:text-surface-400 ${
                            task.completed ? "task-item-completed" : ""
                          }`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-surface-500">
                              <Clock size={14} />
                              <span>
                                {format(new Date(task.dueDate), "MMM d, yyyy")}
                              </span>
                            </div>
                          )}
                          
                          <div className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
                            {priorityIcons[task.priority]}
                            <span className="capitalize">{task.priority}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditingTask(task)}
                          className="p-1.5 text-surface-400 hover:text-primary rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 text-surface-400 hover:text-accent rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainFeature;