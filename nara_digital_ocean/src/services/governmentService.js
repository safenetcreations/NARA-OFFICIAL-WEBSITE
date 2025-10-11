import { supabase } from '../lib/supabase.js';

// EIA Management Services
export const eiaService = {
  // Create new EIA submission
  async create(eiaData) {
    try {
      const { data, error } = await supabase?.from('eia_submissions')?.insert([{
          ...eiaData,
          submitter_id: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get user's EIA submissions
  async getUserSubmissions() {
    try {
      const { data, error } = await supabase?.from('eia_submissions')?.select(`
          *,
          reviewer:user_profiles!eia_submissions_reviewer_id_fkey(full_name, email)
        `)?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update EIA submission
  async update(id, updates) {
    try {
      const { data, error } = await supabase?.from('eia_submissions')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', id)?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Submit EIA (change status to submitted)
  async submit(id) {
    try {
      const { data, error } = await supabase?.from('eia_submissions')?.update({ 
          status: 'submitted',
          submission_date: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString()
        })?.eq('id', id)?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }
};

// Digital Licensing Services
export const licensingService = {
  // Create license application
  async create(licenseData) {
    try {
      const { data, error } = await supabase?.from('license_applications')?.insert([{
          ...licenseData,
          applicant_id: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get user's license applications
  async getUserApplications() {
    try {
      const { data, error } = await supabase?.from('license_applications')?.select('*')?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update application
  async update(id, updates) {
    try {
      const { data, error } = await supabase?.from('license_applications')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', id)?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Process payment
  async processPayment(id, paymentData) {
    try {
      const { data, error } = await supabase?.from('license_applications')?.update({ 
          fee_paid: true,
          status: 'submitted',
          updated_at: new Date()?.toISOString()
        })?.eq('id', id)?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }
};

// Compliance Monitoring Services
export const complianceService = {
  // Get user's compliance records
  async getUserRecords() {
    try {
      const { data, error } = await supabase?.from('compliance_records')?.select(`*,inspector:user_profiles!compliance_records_inspector_id_fkey(full_name, email)`)?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update compliance status
  async updateStatus(id, updates) {
    try {
      const { data, error } = await supabase?.from('compliance_records')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', id)?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get compliance analytics
  async getAnalytics() {
    try {
      const { data, error } = await supabase?.from('compliance_records')?.select('compliance_score, compliance_type, created_at')?.order('created_at', { ascending: false })?.limit(50);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }
};

// Emergency Response Services
export const emergencyService = {
  // Report emergency incident
  async reportIncident(incidentData) {
    try {
      const { data, error } = await supabase?.from('emergency_incidents')?.insert([{
          ...incidentData,
          reporter_id: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get user's reported incidents
  async getUserIncidents() {
    try {
      const { data, error } = await supabase?.from('emergency_incidents')?.select('*')?.order('reported_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update incident status
  async updateStatus(id, updates) {
    try {
      const { data, error } = await supabase?.from('emergency_incidents')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', id)?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get active incidents
  async getActiveIncidents() {
    try {
      const { data, error } = await supabase?.from('emergency_incidents')?.select('*')?.eq('status', 'active')?.order('reported_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }
};

// Inter-Agency Collaboration Services
export const collaborationService = {
  // Create workspace
  async createWorkspace(workspaceData) {
    try {
      const { data, error } = await supabase?.from('collaboration_workspaces')?.insert([{
          ...workspaceData,
          created_by: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get user's workspaces
  async getUserWorkspaces() {
    try {
      const { data, error } = await supabase?.from('collaboration_workspaces')?.select(`
          *,
          creator:user_profiles!collaboration_workspaces_created_by_fkey(full_name, email),
          members:workspace_members(
            id,
            role,
            joined_at,
            member:user_profiles(full_name, email)
          )
        `)?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Add workspace member
  async addMember(workspaceId, memberId, role = 'member') {
    try {
      const { data, error } = await supabase?.from('workspace_members')?.insert([{
          workspace_id: workspaceId,
          member_id: memberId,
          role: role
        }])?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get workspace tasks
  async getWorkspaceTasks(workspaceId) {
    try {
      const { data, error } = await supabase?.from('workspace_tasks')?.select(`
          *,
          assignee:user_profiles!workspace_tasks_assigned_to_fkey(full_name, email),
          creator:user_profiles!workspace_tasks_created_by_fkey(full_name, email)
        `)?.eq('workspace_id', workspaceId)?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Create task
  async createTask(taskData) {
    try {
      const { data, error } = await supabase?.from('workspace_tasks')?.insert([{
          ...taskData,
          created_by: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update task
  async updateTask(id, updates) {
    try {
      const { data, error } = await supabase?.from('workspace_tasks')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', id)?.select()?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get workspace messages
  async getMessages(workspaceId) {
    try {
      const { data, error } = await supabase?.from('workspace_messages')?.select(`
          *,
          sender:user_profiles!workspace_messages_sender_id_fkey(full_name, email)
        `)?.eq('workspace_id', workspaceId)?.order('sent_at', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Send message
  async sendMessage(messageData) {
    try {
      const { data, error } = await supabase?.from('workspace_messages')?.insert([{
          ...messageData,
          sender_id: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select(`
          *,
          sender:user_profiles!workspace_messages_sender_id_fkey(full_name, email)
        `)?.single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }
};

// Document Management Services
export const documentService = {
  // Upload document to private storage
  async upload(file, documentType, relatedId = null) {
    try {
      const user = (await supabase?.auth?.getUser())?.data?.user;
      if (!user) throw new Error('User not authenticated');

      const fileName = `${Date.now()}-${file?.name}`;
      const filePath = `${user?.id}/${documentType}/${fileName}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase?.storage?.from('government-documents')?.upload(filePath, file);

      if (uploadError) throw uploadError;

      // Record in database
      const documentData = {
        uploader_id: user?.id,
        document_type: documentType,
        file_name: file?.name,
        file_path: filePath,
        file_size: file?.size,
        access_level: 'restricted'
      };

      // Add related IDs based on type
      if (relatedId) {
        if (documentType === 'eia_report') {
          documentData.related_application_id = relatedId;
        } else if (documentType === 'incident_report') {
          documentData.related_incident_id = relatedId;
        } else if (documentType === 'collaboration_agreement') {
          documentData.related_workspace_id = relatedId;
        }
      }

      const { data, error } = await supabase?.from('government_documents')?.insert([documentData])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get user's documents
  async getUserDocuments() {
    try {
      const { data, error } = await supabase?.from('government_documents')?.select('*')?.order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get signed URL for private document
  async getDocumentUrl(filePath) {
    try {
      const { data, error } = await supabase?.storage?.from('government-documents')?.createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;
      return { data: data?.signedUrl, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Download document
  async download(filePath) {
    try {
      const { data, error } = await supabase?.storage?.from('government-documents')?.download(filePath);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }
};

export default {
  eia: eiaService,
  licensing: licensingService,
  compliance: complianceService,
  emergency: emergencyService,
  collaboration: collaborationService,
  documents: documentService
};