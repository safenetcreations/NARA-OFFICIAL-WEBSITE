/**
 * Division Projects Data - Active and Past Projects
 */

export const DIVISION_PROJECTS = {
  'fisheries-science': [
    {
      title: { en: 'Tuna Stock Assessment', si: 'ටූනා තොග තක්සේරුව', ta: 'சூரை இருப்பு மதிப்பீடு' },
      description: { en: 'Comprehensive assessment of tuna populations using advanced models and IOTC collaboration' },
      status: 'Active',
      startDate: '2023-01-15',
      endDate: '2025-12-31',
      budget: 'USD 450,000',
      fundingSource: 'IOTC & Ministry',
      teamSize: 8,
      progress: 65,
      category: 'Research'
    },
    {
      title: { en: 'Shark Conservation Plan', si: 'මෝර සංරක්ෂණ සැලැස්ම', ta: 'சுறா பாதுகாப்பு திட்டம்' },
      description: { en: 'NPOA-Sharks development with bycatch reduction and monitoring protocols' },
      status: 'Active',
      startDate: '2022-06-01',
      endDate: '2025-05-31',
      budget: 'USD 300,000',
      fundingSource: 'FAO',
      teamSize: 6,
      progress: 78,
      category: 'Conservation'
    },
    {
      title: { en: 'Demersal Fish Survey', si: 'ගැඹුරු මත්ස්‍ය සමීක්ෂණය', ta: 'ஆழ்கடல் மீன் ஆய்வு' },
      description: { en: 'Bottom trawl surveys assessing fish diversity and distribution' },
      status: 'Active',
      startDate: '2024-02-01',
      endDate: '2026-01-31',
      budget: 'USD 280,000',
      fundingSource: 'World Bank',
      teamSize: 5,
      progress: 35,
      category: 'Survey'
    }
  ],

  'marine-biology': [
    {
      title: { en: 'Blue Whale Migration Study', si: 'නිල් තල්මසුන් සංක්‍රමණ අධ්‍යයනය', ta: 'நீல திமிங்கலம் இடம்பெயர்வு ஆய்வு' },
      description: { en: 'Satellite tagging and acoustic monitoring of blue whale movements in Sri Lankan waters' },
      status: 'Active',
      startDate: '2021-01-15',
      endDate: '2026-01-14',
      budget: 'USD 650,000',
      fundingSource: 'National Geographic',
      teamSize: 10,
      progress: 58,
      category: 'Research'
    },
    {
      title: { en: 'Coral Reef Restoration', si: 'කොරල් පර ප්‍රතිසංස්කරණය', ta: 'பவள பாறை மீட்பு' },
      description: { en: 'Active restoration using coral gardening at Hikkaduwa and Pigeon Island' },
      status: 'Active',
      startDate: '2023-07-01',
      endDate: '2026-06-30',
      budget: 'USD 350,000',
      fundingSource: 'GEF',
      teamSize: 8,
      progress: 42,
      category: 'Restoration'
    },
    {
      title: { en: 'Sea Turtle Nesting Monitoring', si: 'මුහුදු කැස්බෑ අධීක්ෂණය', ta: 'கடல் ஆமை கண்காணிப்பு' },
      description: { en: 'Island-wide monitoring of 25 key nesting beaches and threat assessment' },
      status: 'Completed',
      startDate: '2022-01-01',
      endDate: '2024-12-31',
      budget: 'USD 180,000',
      fundingSource: 'IUCN',
      teamSize: 12,
      progress: 100,
      category: 'Monitoring'
    }
  ],

  'aquaculture': [
    {
      title: { en: 'Sustainable Shrimp Farming', si: 'තිරසාර ඉස්සන් ගොවිතැන', ta: 'நிலையான இறால் வளர்ப்பு' },
      description: { en: 'Biofloc technology and zero water exchange intensive farming systems' },
      status: 'Active',
      startDate: '2023-03-01',
      endDate: '2026-02-28',
      budget: 'USD 420,000',
      fundingSource: 'FAO',
      teamSize: 7,
      progress: 48,
      category: 'Development'
    },
    {
      title: { en: 'Tilapia Breeding Program', si: 'තිලාපියා අභිජනන වැඩසටහන', ta: 'திலாபியா இனப்பெருக்க திட்டம்' },
      description: { en: 'Selective breeding for fast-growing, disease-resistant strains' },
      status: 'Active',
      startDate: '2022-01-01',
      endDate: '2027-12-31',
      budget: 'USD 500,000',
      fundingSource: 'WorldFish',
      teamSize: 9,
      progress: 38,
      category: 'Breeding'
    }
  ],

  'socio-economics': [
    {
      title: { en: 'Fisher Livelihood Study', si: 'ධීවර ජීවනෝපාය අධ්‍යයනය', ta: 'மீனவர் வாழ்வாதார ஆய்வு' },
      description: { en: 'Climate vulnerability and adaptive capacity assessment of fisher households' },
      status: 'Active',
      startDate: '2023-06-01',
      endDate: '2025-05-31',
      budget: 'USD 200,000',
      fundingSource: 'USAID',
      teamSize: 6,
      progress: 55,
      category: 'Research'
    },
    {
      title: { en: 'Seafood Value Chain Analysis', si: 'මුහුදු ආහාර වටිනා දාම විශ්ලේෂණය', ta: 'கடல் உணவு மதிப்பு பகுப்பாய்வு' },
      description: { en: 'Market inefficiencies and value addition opportunities identification' },
      status: 'Completed',
      startDate: '2021-02-01',
      endDate: '2023-12-31',
      budget: 'USD 180,000',
      fundingSource: 'World Bank',
      teamSize: 5,
      progress: 100,
      category: 'Economics'
    }
  ],

  'fishing-technology': [
    {
      title: { en: 'Eco-Friendly Fishing Gear Development', si: 'පරිසර හිතකාමී මසුන් ඇල්ලීමේ උපකරණ සංවර්ධනය', ta: 'சுற்றுச்சூழல் நட்பு மீன்பிடி கருவி மேம்பாடு' },
      description: { en: 'Design and testing of selective fishing gear to reduce bycatch and improve sustainability' },
      status: 'Active',
      startDate: '2023-05-01',
      endDate: '2025-12-31',
      budget: 'USD 320,000',
      fundingSource: 'FAO',
      teamSize: 6,
      progress: 58,
      category: 'Technology'
    },
    {
      title: { en: 'Fuel-Efficient Vessel Design', si: 'ඉන්ධන කාර්යක්ෂම යාත්‍රා නිර්මාණය', ta: 'எரிபொருள் திறனுள்ள கப்பல் வடிவமைப்பு' },
      description: { en: 'Innovation in boat hull design and propulsion systems for 30% fuel savings' },
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2026-06-30',
      budget: 'USD 450,000',
      fundingSource: 'Private Sector',
      teamSize: 5,
      progress: 35,
      category: 'Innovation'
    }
  ],

  'hydrography': [
    {
      title: { en: 'Nautical Chart Update', si: 'නාවික සිතියම් යාවත්කාලීන', ta: 'கடல் வரைபட புதுப்பிப்பு' },
      description: { en: 'Multibeam sonar survey and digital chart production for Sri Lankan waters' },
      status: 'Active',
      startDate: '2022-07-01',
      endDate: '2027-06-30',
      budget: 'USD 2,500,000',
      fundingSource: 'IMO',
      teamSize: 15,
      progress: 42,
      category: 'Survey'
    },
    {
      title: { en: 'Ocean Monitoring System', si: 'සාගර අධීක්ෂණ පද්ධතිය', ta: 'கடல் கண்காணிப்பு அமைப்பு' },
      description: { en: 'Real-time tide gauges, weather buoys and current meters installation' },
      status: 'Active',
      startDate: '2023-01-01',
      endDate: '2025-12-31',
      budget: 'USD 850,000',
      fundingSource: 'NOAA',
      teamSize: 8,
      progress: 68,
      category: 'Monitoring'
    }
  ],

  'quality-assurance': [
    {
      title: { en: 'Cold Chain Development', si: 'සීතල දාම සංවර්ධනය', ta: 'குளிர் சங்கிலி மேம்பாடு' },
      description: { en: 'Ice plants and cold storage facilities at major landing sites' },
      status: 'Active',
      startDate: '2023-04-01',
      endDate: '2026-03-31',
      budget: 'USD 1,200,000',
      fundingSource: 'ADB',
      teamSize: 6,
      progress: 52,
      category: 'Infrastructure'
    },
    {
      title: { en: 'Fish Quality Standards', si: 'මාළු ගුණාත්මක ප්‍රමිති', ta: 'மீன் தர தரநிலைகள்' },
      description: { en: 'HACCP and quality assurance protocols for export market compliance' },
      status: 'Completed',
      startDate: '2020-01-01',
      endDate: '2023-12-31',
      budget: 'USD 150,000',
      fundingSource: 'Government',
      teamSize: 4,
      progress: 100,
      category: 'Quality'
    }
  ],

  'information-outreach': [
    {
      title: { en: 'Capacity Building Program', si: 'ධාරිතා ගොඩනැගීමේ වැඩසටහන', ta: 'திறன் வளர்ப்பு திட்டம்' },
      description: { en: 'Training workshops and certification programs for fisheries professionals' },
      status: 'Active',
      startDate: '2022-01-01',
      endDate: '2026-12-31',
      budget: 'USD 350,000',
      fundingSource: 'Ministry',
      teamSize: 8,
      progress: 60,
      category: 'Training'
    },
    {
      title: { en: 'Research Grant Program', si: 'පර්යේෂණ ප්‍රදාන වැඩසටහන', ta: 'ஆராய்ச்சி மானிய திட்டம்' },
      description: { en: 'Competitive research grants for marine science innovation' },
      status: 'Active',
      startDate: '2023-07-01',
      endDate: '2026-06-30',
      budget: 'USD 500,000',
      fundingSource: 'NSF',
      teamSize: 5,
      progress: 45,
      category: 'Research'
    }
  ],

  'environmental-monitoring': [
    {
      title: { en: 'Reservoir Water Quality Monitoring', si: 'ජලාශ ජල ගුණාත්මකභාවය අධීක්ෂණය', ta: 'நீர்த்தேக்க நீர் தர கண்காணிப்பு' },
      description: { en: 'Monthly water quality assessment of 15 major reservoirs' },
      status: 'Active',
      startDate: '2021-01-01',
      endDate: '2025-12-31',
      budget: 'USD 280,000',
      fundingSource: 'Water Board',
      teamSize: 7,
      progress: 75,
      category: 'Monitoring'
    },
    {
      title: { en: 'Endemic Fish Conservation', si: 'ආවේණික මාළු සංරක්ෂණය', ta: 'உள்ளூர் மீன் பாதுகாப்பு' },
      description: { en: 'Population surveys and habitat restoration for threatened endemic species' },
      status: 'Active',
      startDate: '2023-03-01',
      endDate: '2026-02-28',
      budget: 'USD 180,000',
      fundingSource: 'IUCN',
      teamSize: 6,
      progress: 38,
      category: 'Conservation'
    }
  ]
};

export const getDefaultProjects = (divisionId) => {
  return DIVISION_PROJECTS[divisionId] || [];
};

export default DIVISION_PROJECTS;
