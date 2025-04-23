import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import TaskList from './components/Tasks/TaskList';
import TaskForm from './components/Tasks/TaskForm';
import ProjectList from './components/Projects/ProjectList';
import ProjectForm from './components/Projects/ProjectForm';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.user);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected routes */}
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="tasks" 
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="tasks/new" 
          element={
            <ProtectedRoute>
              <TaskForm />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="tasks/edit/:id" 
          element={
            <ProtectedRoute>
              <TaskForm />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="projects" 
          element={
            <ProtectedRoute>
              <ProjectList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="projects/new" 
          element={
            <ProtectedRoute>
              <ProjectForm />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="projects/edit/:id" 
          element={
            <ProtectedRoute>
              <ProjectForm />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect to dashboard if authenticated, login if not */}
        <Route 
          path="/" 
          element={
            <Navigate to="/dashboard" replace />
          } 
        />

        {/* Catch all - redirect to dashboard if authenticated, login if not */}
        <Route 
          path="*" 
          element={
            <Navigate to="/dashboard" replace />
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;