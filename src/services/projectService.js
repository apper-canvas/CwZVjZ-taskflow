/**
 * Project Service
 * Handles all operations related to projects
 */
import apperService from './apperService';

const TABLE_NAME = 'project2';

// Define fields to fetch for projects based on the provided schema
const PROJECT_FIELDS = [
  'Id', 
  'Name', 
  'description', 
  'status', 
  'start_date', 
  'end_date', 
  'team_members',
  'CreatedOn',
  'CreatedBy',
  'ModifiedOn'
];

class ProjectService {
  async getProjects(filters = {}, page = 0, limit = 10, sortField = 'start_date', sortDirection = 'asc') {
    try {
      const params = {
        fields: PROJECT_FIELDS,
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
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
  
  async getProjectById(projectId) {
    try {
      const params = {
        fields: PROJECT_FIELDS,
        filters: [
          {
            field: 'Id',
            operator: 'Equal',
            value: projectId
          }
        ]
      };
      
      const response = await apperService.fetchRecords(TABLE_NAME, params);
      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error(`Error fetching project ${projectId}:`, error);
      throw error;
    }
  }
  
  async createProject(projectData) {
    try {
      const params = {
        record: {
          ...projectData
        }
      };
      
      const response = await apperService.createRecord(TABLE_NAME, params);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
  
  async updateProject(projectId, projectData) {
    try {
      const params = {
        record: {
          ...projectData
        }
      };
      
      const response = await apperService.updateRecord(TABLE_NAME, projectId, params);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${projectId}:`, error);
      throw error;
    }
  }
  
  async deleteProject(projectId) {
    try {
      const response = await apperService.deleteRecord(TABLE_NAME, projectId);
      return response.data;
    } catch (error) {
      console.error(`Error deleting project ${projectId}:`, error);
      throw error;
    }
  }
  
  async getProjectStatistics() {
    try {
      // Get counts by status
      const statuses = ['Not Started', 'In Progress', 'Completed'];
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
      
      return {
        statusCounts
      };
    } catch (error) {
      console.error('Error fetching project statistics:', error);
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

export default new ProjectService();