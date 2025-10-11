import { supabase } from '../lib/supabase';

// Government Database Connections Service
export const governmentConnectionsService = {
  // Get all government connections
  async getAll() {
    try {
      const { data, error } = await supabase?.from('government_connections')?.select('*')?.order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching government connections:', error);
      return [];
    }
  },

  // Create new government connection
  async create(connectionData) {
    try {
      const { data, error } = await supabase?.from('government_connections')?.insert([{
          ...connectionData,
          created_by: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error('Error creating government connection:', error);
      throw error;
    }
  },

  // Update connection status
  async updateStatus(id, status) {
    try {
      const { data, error } = await supabase?.from('government_connections')?.update({ connection_status: status })?.eq('id', id)?.select()?.single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error('Error updating connection status:', error);
      throw error;
    }
  },

  // Delete connection
  async delete(id) {
    try {
      const { error } = await supabase?.from('government_connections')?.delete()?.eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      return true;
    } catch (error) {
      console.error('Error deleting government connection:', error);
      throw error;
    }
  }
};

// Research Institutions Service
export const researchInstitutionsService = {
  // Get all research institutions
  async getAll() {
    try {
      const { data, error } = await supabase?.from('research_institutions')?.select(`
          *,
          data_sharing_agreements:data_sharing_agreements(*)
        `)?.order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching research institutions:', error);
      return [];
    }
  },

  // Create new research institution
  async create(institutionData) {
    try {
      const { data, error } = await supabase?.from('research_institutions')?.insert([{
          ...institutionData,
          created_by: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error('Error creating research institution:', error);
      throw error;
    }
  },

  // Update partnership status
  async updatePartnershipStatus(id, status) {
    try {
      const { data, error } = await supabase?.from('research_institutions')?.update({ partnership_status: status })?.eq('id', id)?.select()?.single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error('Error updating partnership status:', error);
      throw error;
    }
  }
};

// Satellite Data Sources Service
export const satelliteDataService = {
  // Get all satellite data sources
  async getAllSources() {
    try {
      const { data, error } = await supabase?.from('satellite_data_sources')?.select(`
          *,
          processing_jobs:satellite_processing_jobs(*)
        `)?.order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching satellite data sources:', error);
      return [];
    }
  },

  // Get processing jobs
  async getProcessingJobs() {
    try {
      const { data, error } = await supabase?.from('satellite_processing_jobs')?.select(`
          *,
          data_source:satellite_data_sources(satellite_name, satellite_type)
        `)?.order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching processing jobs:', error);
      return [];
    }
  },

  // Create new processing job
  async createProcessingJob(jobData) {
    try {
      const { data, error } = await supabase?.from('satellite_processing_jobs')?.insert([{
          ...jobData,
          created_by: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error('Error creating processing job:', error);
      throw error;
    }
  },

  // Update processing status
  async updateProcessingStatus(id, status, errorMessage = null) {
    try {
      const updates = { processing_status: status };
      if (errorMessage) {
        updates.error_message = errorMessage;
      }
      if (status === 'completed') {
        updates.completed_at = new Date()?.toISOString();
      }

      const { data, error } = await supabase?.from('satellite_processing_jobs')?.update(updates)?.eq('id', id)?.select()?.single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error('Error updating processing status:', error);
      throw error;
    }
  }
};

// API Management Service
export const apiManagementService = {
  // Get all API endpoints
  async getAllEndpoints() {
    try {
      const { data, error } = await supabase?.from('api_endpoints')?.select('*')?.order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching API endpoints:', error);
      return [];
    }
  },

  // Get API usage analytics
  async getUsageAnalytics(endpointId, startDate, endDate) {
    try {
      let query = supabase?.from('api_usage_analytics')?.select(`
          *,
          endpoint:api_endpoints(name, endpoint_url)
        `)?.order('request_timestamp', { ascending: false });

      if (endpointId) {
        query = query?.eq('endpoint_id', endpointId);
      }
      if (startDate) {
        query = query?.gte('request_timestamp', startDate);
      }
      if (endDate) {
        query = query?.lte('request_timestamp', endDate);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching usage analytics:', error);
      return [];
    }
  },

  // Create new API endpoint
  async createEndpoint(endpointData) {
    try {
      const { data, error } = await supabase?.from('api_endpoints')?.insert([{
          ...endpointData,
          created_by: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error('Error creating API endpoint:', error);
      throw error;
    }
  },

  // Toggle endpoint status
  async toggleEndpointStatus(id, isActive) {
    try {
      const { data, error } = await supabase?.from('api_endpoints')?.update({ is_active: isActive })?.eq('id', id)?.select()?.single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error('Error toggling endpoint status:', error);
      throw error;
    }
  }
};

// Integration Monitoring Service
export const integrationMonitoringService = {
  // Get monitoring dashboard data
  async getDashboardData() {
    try {
      const { data, error } = await supabase?.from('integration_monitoring')?.select('*')?.order('last_health_check_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      return [];
    }
  },

  // Update health metrics
  async updateHealthMetrics(id, healthScore, responseTime, errorCount) {
    try {
      const { data, error } = await supabase?.from('integration_monitoring')?.update({
          health_score: healthScore,
          average_response_time_ms: responseTime,
          error_count_24h: errorCount,
          last_health_check_at: new Date()?.toISOString(),
          alert_threshold_breached: healthScore < 80
        })?.eq('id', id)?.select()?.single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error('Error updating health metrics:', error);
      throw error;
    }
  },

  // Get integration alerts
  async getAlerts() {
    try {
      const { data, error } = await supabase?.from('integration_monitoring')?.select('*')?.or('alert_threshold_breached.eq.true,health_score.lt.80,status.eq.error')?.order('last_health_check_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching integration alerts:', error);
      return [];
    }
  }
};

// Document Management Service
export const integrationDocumentsService = {
  // Upload integration document
  async uploadDocument(file, folder, userId) {
    try {
      const fileName = `${userId}/${folder}/${Date.now()}_${file?.name}`;
      
      const { data, error } = await supabase?.storage?.from('integration-documents')?.upload(fileName, file);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return {
        path: data?.path,
        fullPath: data?.fullPath
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Get user documents
  async getUserDocuments(userId, folder = 'general') {
    try {
      const { data: files, error } = await supabase?.storage?.from('integration-documents')?.list(`${userId}/${folder}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        throw new Error(error.message);
      }

      // Generate signed URLs for each file
      const filesWithUrls = await Promise.all(
        (files || [])?.map(async (file) => {
          const filePath = `${userId}/${folder}/${file?.name}`;
          const { data: urlData } = await supabase?.storage?.from('integration-documents')?.createSignedUrl(filePath, 3600); // 1 hour expiry

          return {
            ...file,
            fullPath: filePath,
            signedUrl: urlData?.signedUrl,
            downloadUrl: urlData?.signedUrl
          };
        })
      );

      return filesWithUrls?.filter(file => file?.signedUrl);
    } catch (error) {
      console.error('Error getting user documents:', error);
      return [];
    }
  },

  // Delete document
  async deleteDocument(filePath) {
    try {
      const { error } = await supabase?.storage?.from('integration-documents')?.remove([filePath]);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
};

export default {
  governmentConnectionsService,
  researchInstitutionsService,
  satelliteDataService,
  apiManagementService,
  integrationMonitoringService,
  integrationDocumentsService
};