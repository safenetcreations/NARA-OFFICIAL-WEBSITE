import { supabase } from '../lib/supabase';

// Research Divisions Service
export const researchDivisionsService = {
  // Get all research divisions
  async getAll() {
    try {
      const { data, error } = await supabase?.from('research_divisions')?.select('*')?.order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get division by ID with expertise areas
  async getById(id) {
    try {
      const { data: division, error: divisionError } = await supabase?.from('research_divisions')?.select(`
          *,
          expertise_areas (*)
        `)?.eq('id', id)?.single();

      if (divisionError) throw divisionError;

      // Get researcher count for this division
      const { count: researcherCount } = await supabase?.from('research_projects')?.select('lead_researcher_id', { count: 'exact', head: true })?.eq('division_id', id);

      // Get active projects count
      const { count: activeProjects } = await supabase?.from('research_projects')?.select('id', { count: 'exact', head: true })?.eq('division_id', id)?.eq('status', 'active');

      // Get publications count for 2024
      const { count: publications2024 } = await supabase?.from('research_publications')?.select('id', { count: 'exact', head: true })?.gte('publication_date', '2024-01-01')?.lte('publication_date', '2024-12-31')?.in('project_id', await this.getProjectIdsByDivision(id));

      return {
        data: {
          ...division,
          researcherCount: researcherCount || 0,
          activeProjects: activeProjects || 0,
          publications2024: publications2024 || 0,
          internationalPartners: 8 // Mock data for now
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Helper function to get project IDs by division
  async getProjectIdsByDivision(divisionId) {
    try {
      const { data, error } = await supabase?.from('research_projects')?.select('id')?.eq('division_id', divisionId);

      if (error) throw error;
      return data?.map(p => p?.id) || [];
    } catch (error) {
      return [];
    }
  }
};

// Research Projects Service
export const researchProjectsService = {
  // Get all public research projects
  async getPublic() {
    try {
      const { data, error } = await supabase?.from('research_projects')?.select(`
          *,
          lead_researcher:user_profiles!lead_researcher_id(*),
          division:research_divisions(*),
          project_collaborators(
            *,
            user:user_profiles(*)
          )
        `)?.eq('is_public', true)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user's projects (as lead researcher or collaborator)
  async getUserProjects(userId) {
    try {
      // Get projects where user is lead researcher
      const { data: leadProjects, error: leadError } = await supabase?.from('research_projects')?.select(`
          *,
          lead_researcher:user_profiles!lead_researcher_id(*),
          division:research_divisions(*),
          project_collaborators(
            *,
            user:user_profiles(*)
          )
        `)?.eq('lead_researcher_id', userId)?.order('created_at', { ascending: false });

      if (leadError) throw leadError;

      // Get projects where user is collaborator
      const { data: collabProjects, error: collabError } = await supabase?.from('project_collaborators')?.select(`
          project:research_projects(
            *,
            lead_researcher:user_profiles!lead_researcher_id(*),
            division:research_divisions(*),
            project_collaborators(
              *,
              user:user_profiles(*)
            )
          )
        `)?.eq('user_id', userId)?.eq('is_active', true);

      if (collabError) throw collabError;

      // Combine and deduplicate projects
      const allProjects = [
        ...(leadProjects || []),
        ...(collabProjects?.map(cp => cp?.project) || [])
      ];

      // Remove duplicates based on project ID
      const uniqueProjects = allProjects?.filter((project, index, self) =>
        index === self?.findIndex(p => p?.id === project?.id)
      );

      return { data: uniqueProjects, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create new research project
  async create(projectData) {
    try {
      const { data, error } = await supabase?.from('research_projects')?.insert([projectData])?.select(`
          *,
          lead_researcher:user_profiles!lead_researcher_id(*),
          division:research_divisions(*)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update research project
  async update(id, updates) {
    try {
      const { data, error } = await supabase?.from('research_projects')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', id)?.select(`
          *,
          lead_researcher:user_profiles!lead_researcher_id(*),
          division:research_divisions(*)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Add collaborator to project
  async addCollaborator(projectId, collaboratorData) {
    try {
      const { data, error } = await supabase?.from('project_collaborators')?.insert([{ ...collaboratorData, project_id: projectId }])?.select(`
          *,
          user:user_profiles(*)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Research Publications Service
export const publicationsService = {
  // Get all published publications
  async getPublished() {
    try {
      const { data, error } = await supabase?.from('research_publications')?.select(`
          *,
          project:research_projects(*),
          publication_authors(
            *,
            user:user_profiles(*)
          )
        `)?.eq('status', 'published')?.order('publication_date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user's publications (as author)
  async getUserPublications(userId) {
    try {
      const { data, error } = await supabase?.from('publication_authors')?.select(`
          publication:research_publications(
            *,
            project:research_projects(*),
            publication_authors(
              *,
              user:user_profiles(*)
            )
          )
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (error) throw error;
      
      const publications = data?.map(pa => pa?.publication) || [];
      return { data: publications, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create new publication
  async create(publicationData) {
    try {
      const { data, error } = await supabase?.from('research_publications')?.insert([publicationData])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Add author to publication
  async addAuthor(publicationId, authorData) {
    try {
      const { data, error } = await supabase?.from('publication_authors')?.insert([{ ...authorData, publication_id: publicationId }])?.select(`
          *,
          user:user_profiles(*)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Collaboration Opportunities Service
export const collaborationService = {
  // Get all open collaboration opportunities
  async getOpen() {
    try {
      const { data, error } = await supabase?.from('collaboration_opportunities')?.select(`
          *,
          contact_person:user_profiles!contact_person_id(*)
        `)?.eq('status', 'open')?.order('deadline', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create new collaboration opportunity
  async create(opportunityData) {
    try {
      const { data, error } = await supabase?.from('collaboration_opportunities')?.insert([opportunityData])?.select(`
          *,
          contact_person:user_profiles!contact_person_id(*)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Apply for collaboration opportunity
  async apply(opportunityId, applicationData) {
    try {
      const { data, error } = await supabase?.from('collaboration_applications')?.insert([{ ...applicationData, opportunity_id: opportunityId }])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user's collaboration applications
  async getUserApplications(userId) {
    try {
      const { data, error } = await supabase?.from('collaboration_applications')?.select(`
          *,
          opportunity:collaboration_opportunities(
            *,
            contact_person:user_profiles!contact_person_id(*)
          )
        `)?.eq('applicant_id', userId)?.order('applied_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// User Profiles Service  
export const userProfilesService = {
  // Get user profile by ID
  async getById(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select(`
          *,
          user_expertise(
            *,
            expertise_area:expertise_areas(
              *,
              division:research_divisions(*)
            )
          )
        `)?.eq('id', userId)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update user profile
  async update(userId, updates) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', userId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Search researchers by expertise or institution
  async search(query, filters = {}) {
    try {
      let queryBuilder = supabase?.from('user_profiles')?.select(`
          *,
          user_expertise(
            *,
            expertise_area:expertise_areas(
              *,
              division:research_divisions(*)
            )
          )
        `)?.eq('is_public', true)?.eq('is_active', true);

      // Apply text search if query provided
      if (query) {
        queryBuilder = queryBuilder?.or(`
          full_name.ilike.%${query}%,
          institution.ilike.%${query}%,
          bio.ilike.%${query}%
        `);
      }

      // Apply filters
      if (filters?.role) {
        queryBuilder = queryBuilder?.eq('role', filters?.role);
      }

      if (filters?.institution) {
        queryBuilder = queryBuilder?.ilike('institution', `%${filters?.institution}%`);
      }

      queryBuilder = queryBuilder?.order('created_at', { ascending: false });

      const { data, error } = await queryBuilder;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Grant Applications Service
export const grantsService = {
  // Get user's grant applications
  async getUserGrants(userId) {
    try {
      const { data, error } = await supabase?.from('grant_applications')?.select(`*,project:research_projects(*),grant_co_investigators(*,user:user_profiles(*))`)?.eq('principal_investigator_id', userId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create new grant application
  async create(grantData) {
    try {
      const { data, error } = await supabase?.from('grant_applications')?.insert([grantData])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update grant application
  async update(id, updates) {
    try {
      const { data, error } = await supabase?.from('grant_applications')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Research Impact Metrics Service
export const metricsService = {
  // Get overall research impact metrics
  async getOverallMetrics() {
    try {
      // Get total publications count
      const { count: totalPublications } = await supabase?.from('research_publications')?.select('id', { count: 'exact', head: true })?.eq('status', 'published');

      // Get total citations (sum of citation_count)
      const { data: citationsData } = await supabase?.from('research_publications')?.select('citation_count')?.eq('status', 'published');

      const totalCitations = citationsData?.reduce((sum, pub) => 
        sum + (pub?.citation_count || 0), 0) || 0;

      // Get active projects count
      const { count: activeProjects } = await supabase?.from('research_projects')?.select('id', { count: 'exact', head: true })?.eq('status', 'active');

      // Get total funding (sum of budget_amount for approved grants)
      const { data: fundingData } = await supabase?.from('grant_applications')?.select('award_amount')?.eq('status', 'approved');

      const totalFunding = fundingData?.reduce((sum, grant) => 
        sum + (grant?.award_amount || 0), 0) || 0;

      // Get international partners count (mock for now)
      const internationalPartners = 67;

      return {
        data: {
          totalPublications: totalPublications || 0,
          publicationsChange: 15.2,
          totalCitations: totalCitations,
          citationsChange: 22.8,
          activeProjects: activeProjects || 0,
          projectsChange: 8.5,
          totalFunding: totalFunding,
          fundingChange: 18.7,
          internationalPartners,
          partnersChange: 12.3,
          hIndex: 42,
          hIndexChange: 7.1
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Research Networks Service
export const networksService = {
  // Get all active research networks
  async getActive() {
    try {
      const { data, error } = await supabase?.from('research_networks')?.select('*')?.eq('is_active', true)?.order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user's network memberships
  async getUserMemberships(userId) {
    try {
      const { data, error } = await supabase?.from('network_memberships')?.select(`
          *,
          network:research_networks(*)
        `)?.eq('user_id', userId)?.eq('is_active', true);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Research Events Service
export const eventsService = {
  // Get upcoming research events
  async getUpcoming() {
    try {
      const { data, error } = await supabase?.from('research_events')?.select(`
          *,
          creator:user_profiles!created_by(*)
        `)?.gte('start_date', new Date()?.toISOString()?.split('T')?.[0])?.order('start_date', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Register for event
  async register(eventId, userId, participationType = 'attendee') {
    try {
      const { data, error } = await supabase?.from('event_participants')?.insert([{
          event_id: eventId,
          user_id: userId,
          participation_type: participationType
        }])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Export default service object
const researchService = {
  divisions: researchDivisionsService,
  projects: researchProjectsService,
  publications: publicationsService,
  collaboration: collaborationService,
  profiles: userProfilesService,
  grants: grantsService,
  metrics: metricsService,
  networks: networksService,
  events: eventsService
};

export default researchService;