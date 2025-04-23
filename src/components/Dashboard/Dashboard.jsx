import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import Chart from 'react-apexcharts';
import { CalendarDays, CheckCircle, Clock, Database, List, Users } from 'lucide-react';
import taskService from '../../services/taskService';
import projectService from '../../services/projectService';

function Dashboard() {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({ statusCounts: {}, priorityCounts: {} });
  const [projectStats, setProjectStats] = useState({ statusCounts: {} });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch task statistics
        const taskStatistics = await taskService.getTaskStatistics();
        setTaskStats(taskStatistics);
        
        // Fetch project statistics
        const projectStatistics = await projectService.getProjectStatistics();
        setProjectStats(projectStatistics);
        
        // Fetch recent tasks
        const tasksResponse = await taskService.getTasks({}, 0, 5, 'CreatedOn', 'desc');
        setRecentTasks(tasksResponse.data || []);
        
        // Fetch recent projects
        const projectsResponse = await projectService.getProjects({}, 0, 5, 'CreatedOn', 'desc');
        setRecentProjects(projectsResponse.data || []);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Task status chart options
  const taskStatusChartOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['To Do', 'In Progress', 'Done'],
    colors: ['#f59e0b', '#3b82f6', '#10b981'],
    legend: {
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
        },
      },
    },
  };

  const taskStatusSeries = [
    taskStats.statusCounts['To Do'] || 0,
    taskStats.statusCounts['In Progress'] || 0,
    taskStats.statusCounts['Done'] || 0,
  ];

  // Task priority chart options
  const taskPriorityChartOptions = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        barHeight: '50%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['Low', 'Medium', 'High'],
    },
    colors: ['#10b981', '#3b82f6', '#ef4444'],
    legend: {
      show: false,
    },
  };

  const taskPrioritySeries = [
    {
      name: 'Count',
      data: [
        taskStats.priorityCounts['Low'] || 0,
        taskStats.priorityCounts['Medium'] || 0,
        taskStats.priorityCounts['High'] || 0,
      ],
    },
  ];

  // Project status chart options
  const projectStatusChartOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Not Started', 'In Progress', 'Completed'],
    colors: ['#f59e0b', '#3b82f6', '#10b981'],
    legend: {
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
        },
      },
    },
  };

  const projectStatusSeries = [
    projectStats.statusCounts['Not Started'] || 0,
    projectStats.statusCounts['In Progress'] || 0,
    projectStats.statusCounts['Completed'] || 0,
  ];

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.firstName || 'User'}!</h2>
        <p className="text-gray-600">
          Here's an overview of your tasks and projects.
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <List size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Tasks</p>
              <p className="text-2xl font-semibold">
                {loading ? '...' : taskStatusSeries.reduce((a, b) => a + b, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Completed Tasks</p>
              <p className="text-2xl font-semibold">
                {loading ? '...' : taskStats.statusCounts['Done'] || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <Database size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Projects</p>
              <p className="text-2xl font-semibold">
                {loading ? '...' : projectStatusSeries.reduce((a, b) => a + b, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <p className="text-2xl font-semibold">
                {loading ? '...' : taskStats.statusCounts['In Progress'] || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Task Status</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Chart 
              options={taskStatusChartOptions} 
              series={taskStatusSeries} 
              type="donut" 
              height={300} 
            />
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Task Priority</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Chart 
              options={taskPriorityChartOptions} 
              series={taskPrioritySeries} 
              type="bar" 
              height={300} 
            />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Project Status</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Chart 
              options={projectStatusChartOptions} 
              series={projectStatusSeries} 
              type="donut" 
              height={300} 
            />
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTasks.slice(0, 3).map((task) => (
                <div key={task.Id} className="flex items-start">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <List size={16} />
                  </div>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      Task created on {format(new Date(task.CreatedOn), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
              
              {recentProjects.slice(0, 2).map((project) => (
                <div key={project.Id} className="flex items-start">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                    <Database size={16} />
                  </div>
                  <div>
                    <p className="font-medium">{project.Name}</p>
                    <p className="text-sm text-gray-500">
                      Project created on {format(new Date(project.CreatedOn), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
              
              {recentTasks.length === 0 && recentProjects.length === 0 && (
                <p className="text-gray-500 italic">No recent activity</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : recentTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTasks.map((task) => (
                  <tr key={task.Id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${task.status === 'To Do' ? 'bg-yellow-100 text-yellow-800' : 
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${task.priority === 'Low' ? 'bg-green-100 text-green-800' : 
                          task.priority === 'Medium' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'Not set'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            No tasks found. Start by creating a new task.
          </div>
        )}
      </div>
      
      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {recentProjects.map((project) => (
              <div key={project.Id} className="border rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">{project.Name}</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {project.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <CalendarDays size={16} className="mr-2" />
                    {project.start_date ? format(new Date(project.start_date), 'MMM d, yyyy') : 'Not set'} - 
                    {project.end_date ? format(new Date(project.end_date), 'MMM d, yyyy') : 'Not set'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-2" />
                    {project.team_members && Array.isArray(project.team_members) ? 
                      `${project.team_members.length} members` : '0 members'}
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${project.status === 'Not Started' ? 'bg-yellow-100 text-yellow-800' : 
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            No projects found. Start by creating a new project.
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;