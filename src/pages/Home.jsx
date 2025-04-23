import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainFeature from "../components/MainFeature";

const Home = () => {
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem("taskflow-lists");
    return savedLists ? JSON.parse(savedLists) : [
      { id: "default", name: "My Tasks", description: "Default task list" }
    ];
  });
  
  const [activeListId, setActiveListId] = useState(() => {
    const savedActiveList = localStorage.getItem("taskflow-active-list");
    return savedActiveList || "default";
  });

  useEffect(() => {
    localStorage.setItem("taskflow-lists", JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem("taskflow-active-list", activeListId);
  }, [activeListId]);

  const addNewList = (listName) => {
    if (!listName.trim()) return;
    
    const newList = {
      id: `list-${Date.now()}`,
      name: listName,
      description: "",
      createdAt: new Date().toISOString()
    };
    
    setLists([...lists, newList]);
    setActiveListId(newList.id);
  };

  const deleteList = (listId) => {
    if (lists.length <= 1) {
      alert("You must have at least one list");
      return;
    }
    
    const updatedLists = lists.filter(list => list.id !== listId);
    setLists(updatedLists);
    
    if (activeListId === listId) {
      setActiveListId(updatedLists[0].id);
    }
  };

  const activeList = lists.find(list => list.id === activeListId) || lists[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-4">My Lists</h2>
            
            <div className="space-y-2 mb-4">
              <AnimatePresence>
                {lists.map(list => (
                  <motion.div
                    key={list.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                      activeListId === list.id 
                        ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary" 
                        : "hover:bg-surface-100 dark:hover:bg-surface-700"
                    }`}
                    onClick={() => setActiveListId(list.id)}
                  >
                    <span className="font-medium truncate">{list.name}</span>
                    
                    {lists.length > 1 && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteList(list.id);
                        }}
                        className="text-surface-400 hover:text-accent"
                      >
                        ×
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.newList;
                addNewList(input.value);
                input.value = "";
              }}
              className="flex gap-2"
            >
              <input 
                type="text" 
                name="newList"
                placeholder="New list name" 
                className="input flex-grow text-sm"
                required
              />
              <button 
                type="submit" 
                className="btn btn-primary text-sm"
              >
                Add
              </button>
            </form>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-9"
        >
          <div className="card p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-primary">{activeList.name}</h1>
              <p className="text-surface-500 dark:text-surface-400">
                {activeList.description || "Manage your tasks efficiently"}
              </p>
            </div>
            
            <MainFeature listId={activeListId} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;