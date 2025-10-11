import { useState, useEffect, useCallback } from 'react';
import researchService from 'services/researchService';

// Fallback mock data for when Supabase is not available
const mockPublications = [
  {
    id: 1,
    title: "Deep Ocean Biodiversity Mapping of Sri Lankan Waters",
    authors: "Dr. Sarah Chen, Prof. Kumar Silva, Dr. Amanda Roberts",
    year: 2024,
    journal: "Nature Ocean Sciences",
    impact: 12.5,
    citations: 245,
    category: "Marine Biology",
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
    abstract: "Comprehensive analysis of deep-sea ecosystems revealing 127 new species...",
    tags: ["Deep Sea", "Biodiversity", "New Species"],
    downloadCount: 3847
  },
  {
    id: 2,
    title: "Climate Impact on Coral Reef Systems: A 10-Year Study",
    authors: "Prof. Michael Thompson, Dr. Priya Fernando",
    year: 2024,
    journal: "Science Advances",
    impact: 9.8,
    citations: 189,
    category: "Climate Science",
    thumbnail: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
    abstract: "Long-term monitoring reveals critical temperature thresholds for coral survival...",
    tags: ["Climate Change", "Coral Reefs", "Conservation"],
    downloadCount: 2156
  },
  {
    id: 3,
    title: "AI-Powered Ocean Current Prediction Models",
    authors: "Dr. James Liu, Prof. Nimal Perera",
    year: 2023,
    journal: "Journal of Marine Technology",
    impact: 8.2,
    citations: 156,
    category: "Ocean Technology",
    thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
    abstract: "Machine learning algorithms achieving 94% accuracy in current predictions...",
    tags: ["AI", "Ocean Currents", "Predictive Modeling"],
    downloadCount: 1892
  }
];

const mockTeams = [
  {
    name: "Marine Biodiversity Unit",
    lead: "Dr. Sarah Chen",
    members: 12,
    projects: 8,
    funding: "$2.5M",
    icon: "Fish",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Climate Research Division",
    lead: "Prof. Kumar Silva",
    members: 18,
    projects: 12,
    funding: "$4.2M",
    icon: "Thermometer",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Ocean Technology Lab",
    lead: "Dr. James Liu",
    members: 15,
    projects: 10,
    funding: "$3.8M",
    icon: "Cpu",
    color: "from-green-500 to-teal-500"
  },
  {
    name: "Conservation Research",
    lead: "Prof. Amanda Roberts",
    members: 10,
    projects: 6,
    funding: "$1.9M",
    icon: "Shield",
    color: "from-orange-500 to-red-500"
  }
];

const mockMetrics = [
  { label: "Active Projects", value: 47, change: "+12%", icon: "Briefcase" },
  { label: "Publications (2024)", value: 89, change: "+23%", icon: "FileText" },
  { label: "International Collaborations", value: 32, change: "+8%", icon: "Globe" },
  { label: "Research Funding", value: "$12.4M", change: "+15%", icon: "TrendingUp" }
];

export const useResearchData = () => {
  const [researchData, setResearchData] = useState(null);
  const [publications, setPublications] = useState([]);
  const [teams, setTeams] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to fetch from Supabase first
      try {
        const [publicationsResult, teamsResult, metricsResult] = await Promise.all([
          researchService.divisions.getAll(),
          // Using divisions as teams for now since there's no dedicated teams endpoint
          Promise.resolve({ data: mockTeams, error: null }),
          // Using mock metrics since there's no dedicated metrics endpoint
          Promise.resolve({ data: mockMetrics, error: null })
        ]);

        if (publicationsResult.data) {
          // Transform divisions data to publications format if needed
          const transformedPublications = publicationsResult.data.map((division, index) => ({
            id: index + 1,
            title: `${division.name} Research Overview`,
            authors: division.description || 'Research Team',
            year: new Date().getFullYear(),
            journal: 'NARA Research Journal',
            impact: 8.5,
            citations: Math.floor(Math.random() * 100) + 50,
            category: division.name.includes('Marine') ? 'Marine Biology' : 'Research',
            thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
            abstract: division.description || `Research initiatives from ${division.name}`,
            tags: [division.name, 'Research', 'Science'],
            downloadCount: Math.floor(Math.random() * 1000) + 500
          }));

          setPublications(transformedPublications);
        } else {
          setPublications(mockPublications);
        }

        setTeams(teamsResult.data || mockTeams);
        setMetrics(metricsResult.data || mockMetrics);

      } catch (supabaseError) {
        // Fallback to mock data if Supabase fails
        console.warn('Supabase not available, using mock data:', supabaseError);
        setPublications(mockPublications);
        setTeams(mockTeams);
        setMetrics(mockMetrics);
      }

      setResearchData({
        publications: publications.length > 0 ? publications : mockPublications,
        teams: teams.length > 0 ? teams : mockTeams,
        metrics: metrics.length > 0 ? metrics : mockMetrics,
        lastUpdate: new Date()
      });

    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch research data:', err);

      // Set fallback data even on error
      setPublications(mockPublications);
      setTeams(mockTeams);
      setMetrics(mockMetrics);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    researchData,
    publications,
    teams,
    metrics,
    isLoading,
    error,
    refreshData
  };
};
