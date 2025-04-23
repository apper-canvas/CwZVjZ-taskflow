/**
 * Task Service
 * Handles all operations related to tasks
 */
import apperService from './apperService';

const TABLE_NAME = 'task6';

// Define fields to fetch for tasks based on the provided schema
const TASK_FIELDS = [
  'Id', 
  'Name', 
  'title', 
  'description', 
  'status', 
  'priority', 
  'due_date', 
  'assigned_to', 
  'category',
  'CreatedOn',
  'CreatedBy',
  'ModifiedOn'
];

class TaskService {
  async getTasks(filters = {}, page = 0, limit = 10, sortField = 'due_date', sortDirection = 'asc') {
    try {
      const params = {
        fields: TASK_FIELDS,
        pagingInfo: { 
          limit, 
          offset: page * limit 
        },
        orderBy: [{ 
          field: sortField, 
          direction: sortDirection 
        }]
      };
      
      // Add filters if provided
      if (Object.keys(filters).length > 0) {
        params.filters = this.buildFilters(filters);
      }
      
      const response = await apperService.fetchRecords(TABLE_NAME, params);
      return response;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }
  
  async getTaskById(taskId) {
    try {
      const params = {
        fields: TASK_FIELDS,
        filters: [
          {
            field: 'Id',
            operator: 'Equal',
            value: taskId
          }
        ]
      };
      
      const response = await apperService.fetchRecords(TABLE_NAME, params);
      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      throw error;
    }
  }
  
  async createTask(taskData) {
    try {
      const params = {
        record: {
          ...taskData
        }
      };
      
      const response = await apperService.createRecord(TABLE_NAME, params);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }
  
  async updateTask(taskId, taskData) {
    try {
      const params = {
        record: {
          ...taskData
        }
      };
      
      const response = await apperService.updateRecord(TABLE_NAME, taskId, params);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  }
  
  async deleteTask(taskId) {
    try {
      const response = await apperService.deleteRecord(TABLE_NAME, taskId);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  }
  
  async getTaskStatistics() {
    try {
      // Get counts by status
      const statuses = ['To Do', 'In Progress', 'Done'];
      const statusCounts = {};
      
      for (const status of statuses) {
        const params = {
          fields: ['Id'],
          filters: [
            {
              field: 'status',
              operator: 'Equal',
              value: status
            }
          ]
        };
        
        const response = await apperService.fetchRecords(TABLE_NAME, params);
        statusCounts[status] = response.data ? response.data.length : 0;
      }
      
      // Get counts by priority
      const priorities = ['Low', 'Medium', 'High'];
      const priorityCounts = {};
      
      for (const priority of priorities) {
        const params = {
          fields: ['Id'],
          filters: [
            {
              field: 'priority',
              operator: 'Equal',
              value: priority
            }
          ]
        };
        
        const response = await apperService.fetchRecords(TABLE_NAME, params);
        priorityCounts[priority] = response.data ? response.data.length : 0;
      }
      
      return {
        statusCounts,
        priorityCounts
      };
    } catch (error) {
      console.error('Error fetching task statistics:', error);
      throw error;
    }
  }
  
  buildFilters(filters) {
    return Object.entries(filters).map(([field, value]) => ({
      field,
      operator: 'Equal',
      value
    }));
  }
}

export default new TaskService();