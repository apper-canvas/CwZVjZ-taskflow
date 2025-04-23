/**
 * Core Apper Backend Service
 * Initializes the ApperClient with the Canvas ID and provides base methods
 */

const CANVAS_ID = "128a33f8f41149b9ba2cc2cdbb77ce27";

class ApperService {
  constructor() {
    this.initialize();
  }

  initialize() {
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.client = new ApperClient(CANVAS_ID);
    } else {
      console.error("Apper SDK not found. Make sure the script is loaded in index.html");
    }
  }

  getClient() {
    if (!this.client) {
      this.initialize();
    }
    return this.client;
  }

  async fetchRecords(tableName, params) {
    try {
      const client = this.getClient();
      const response = await client.fetchRecords(tableName, params);
      return response;
    } catch (error) {
      console.error(`Error fetching records from ${tableName}:`, error);
      throw error;
    }
  }

  async createRecord(tableName, params) {
    try {
      const client = this.getClient();
      const response = await client.createRecord(tableName, params);
      return response;
    } catch (error) {
      console.error(`Error creating record in ${tableName}:`, error);
      throw error;
    }
  }

  async updateRecord(tableName, recordId, params) {
    try {
      const client = this.getClient();
      const response = await client.updateRecord(tableName, recordId, params);
      return response;
    } catch (error) {
      console.error(`Error updating record ${recordId} in ${tableName}:`, error);
      throw error;
    }
  }

  async deleteRecord(tableName, recordId) {
    try {
      const client = this.getClient();
      const response = await client.deleteRecord(tableName, recordId);
      return response;
    } catch (error) {
      console.error(`Error deleting record ${recordId} from ${tableName}:`, error);
      throw error;
    }
  }

  setupAuth(targetId, onSuccess, onError) {
    if (window.ApperSDK) {
      const { ApperUI } = window.ApperSDK;
      const client = this.getClient();
      
      ApperUI.setup(client, {
        target: targetId,
        clientId: CANVAS_ID,
        view: 'both', // 'login', 'signup', or 'both'
        onSuccess: onSuccess,
        onError: onError
      });
      
      return ApperUI;
    } else {
      console.error("Apper SDK not found. Make sure the script is loaded in index.html");
      return null;
    }
  }
}

// Export singleton instance
export default new ApperService();