/**
 * Division Impact & Analytics Data
 * Comprehensive impact metrics and visualizations for all divisions
 */

export const DIVISION_IMPACT = {
  'fisheries-science': {
    keyMetrics: [
      { label: 'Fish Stocks Assessed', value: '25+', icon: 'Fish', trend: '+15%', color: 'blue' },
      { label: 'Annual Reports Published', value: '12', icon: 'FileText', trend: '+8%', color: 'cyan' },
      { label: 'Fishers Trained', value: '850', icon: 'Users', trend: '+22%', color: 'teal' },
      { label: 'Conservation Areas Established', value: '8', icon: 'Shield', trend: '+3', color: 'green' }
    ],
    impactStories: [
      {
        title: 'Sustainable Tuna Management',
        description: 'Stock assessments led to 30% reduction in overfishing and improved tuna population by 18% over 3 years.',
        metrics: { before: 12500, after: 14750, unit: 'tons', improvement: '+18%' },
        year: 2024
      },
      {
        title: 'Shark Conservation Success',
        description: 'NPOA-Sharks implementation reduced shark bycatch by 42% while maintaining fisher livelihoods.',
        metrics: { before: 3200, after: 1856, unit: 'sharks', improvement: '-42%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 28 },
        { year: 2021, count: 32 },
        { year: 2022, count: 38 },
        { year: 2023, count: 42 },
        { year: 2024, count: 48 }
      ],
      citations: 1250,
      hIndex: 24
    },
    economicImpact: {
      valueGenerated: 'USD 2.5M',
      jobsCreated: 120,
      fisheriesImproved: 15
    },
    partnerships: [
      'IOTC', 'FAO', 'World Bank', 'NOAA', 'University of Colombo'
    ]
  },

  'marine-biology': {
    keyMetrics: [
      { label: 'Species Monitored', value: '180+', icon: 'Fish', trend: '+25', color: 'teal' },
      { label: 'Coral Fragments Planted', value: '12,500', icon: 'Shell', trend: '+5000', color: 'emerald' },
      { label: 'Turtle Nests Protected', value: '450', icon: 'Shield', trend: '+18%', color: 'green' },
      { label: 'Marine Protected Areas', value: '6', icon: 'MapPin', trend: '+2', color: 'blue' }
    ],
    impactStories: [
      {
        title: 'Blue Whale Population Recovery',
        description: 'Long-term monitoring revealed 12% increase in blue whale sightings in Sri Lankan waters.',
        metrics: { before: 250, after: 280, unit: 'sightings', improvement: '+12%' },
        year: 2024
      },
      {
        title: 'Coral Reef Restoration',
        description: 'Restored coral reefs showed 65% survival rate and 23% increase in fish diversity.',
        metrics: { before: 48, after: 59, unit: 'species', improvement: '+23%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 35 },
        { year: 2021, count: 42 },
        { year: 2022, count: 48 },
        { year: 2023, count: 55 },
        { year: 2024, count: 62 }
      ],
      citations: 1850,
      hIndex: 32
    },
    economicImpact: {
      valueGenerated: 'USD 1.8M',
      jobsCreated: 85,
      communitiesBenefited: 25
    },
    partnerships: [
      'National Geographic', 'IUCN', 'WWF', 'Blue Whale Study', 'Ocean Alliance'
    ]
  },

  'aquaculture': {
    keyMetrics: [
      { label: 'Fish Farmers Trained', value: '1,200+', icon: 'Users', trend: '+300', color: 'purple' },
      { label: 'Production Increased', value: '45%', icon: 'TrendingUp', trend: '+12%', color: 'violet' },
      { label: 'New Strains Developed', value: '8', icon: 'Dna', trend: '+3', color: 'indigo' },
      { label: 'Demonstration Farms', value: '15', icon: 'Home', trend: '+5', color: 'blue' }
    ],
    impactStories: [
      {
        title: 'Tilapia Yield Improvement',
        description: 'New genetic strains increased average yield by 35% and reduced disease incidence by 48%.',
        metrics: { before: 2.8, after: 3.78, unit: 'kg/m³', improvement: '+35%' },
        year: 2024
      },
      {
        title: 'Sustainable Shrimp Farming',
        description: 'Biofloc technology reduced water usage by 90% and increased profitability by 28%.',
        metrics: { before: 100, after: 10, unit: '% water use', improvement: '-90%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 22 },
        { year: 2021, count: 28 },
        { year: 2022, count: 32 },
        { year: 2023, count: 38 },
        { year: 2024, count: 42 }
      ],
      citations: 980,
      hIndex: 21
    },
    economicImpact: {
      valueGenerated: 'USD 3.2M',
      jobsCreated: 450,
      farmsEstablished: 180
    },
    partnerships: [
      'WorldFish', 'FAO', 'ADB', 'Private Sector Partners', 'University of Ruhuna'
    ]
  },

  'socio-economics': {
    keyMetrics: [
      { label: 'Fisher Households Surveyed', value: '2,500+', icon: 'Users', trend: '+500', color: 'amber' },
      { label: 'Income Increase', value: '32%', icon: 'DollarSign', trend: '+8%', color: 'yellow' },
      { label: 'Market Access Improved', value: '18', icon: 'TrendingUp', trend: '+6', color: 'orange' },
      { label: 'Policy Recommendations', value: '24', icon: 'FileText', trend: '+8', color: 'red' }
    ],
    impactStories: [
      {
        title: 'Fisher Livelihood Enhancement',
        description: 'Value chain interventions increased average fisher income by 32% over 2 years.',
        metrics: { before: 45000, after: 59400, unit: 'LKR/month', improvement: '+32%' },
        year: 2024
      },
      {
        title: 'Women Empowerment in Fisheries',
        description: 'Gender-focused programs increased women participation in value addition by 58%.',
        metrics: { before: 28, after: 44, unit: '% participation', improvement: '+58%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 18 },
        { year: 2021, count: 22 },
        { year: 2022, count: 26 },
        { year: 2023, count: 30 },
        { year: 2024, count: 35 }
      ],
      citations: 720,
      hIndex: 18
    },
    economicImpact: {
      valueGenerated: 'USD 1.5M',
      jobsCreated: 280,
      householdsBenefited: 2500
    },
    partnerships: [
      'USAID', 'World Bank', 'ILO', 'FAO', 'Local NGOs'
    ]
  },

  'fishing-technology': {
    keyMetrics: [
      { label: 'Gear Innovations', value: '18', icon: 'Wrench', trend: '+6', color: 'indigo' },
      { label: 'Fuel Efficiency Improved', value: '28%', icon: 'TrendingDown', trend: '+12%', color: 'violet' },
      { label: 'Bycatch Reduced', value: '45%', icon: 'Shield', trend: '-18%', color: 'purple' },
      { label: 'Vessels Upgraded', value: '350', icon: 'Ship', trend: '+85', color: 'blue' }
    ],
    impactStories: [
      {
        title: 'Fuel-Efficient Fishing Vessels',
        description: 'New vessel designs and propulsion systems reduced fuel consumption by 28% across 350 fishing boats.',
        metrics: { before: 45, after: 32.4, unit: 'liters/trip', improvement: '-28%' },
        year: 2024
      },
      {
        title: 'Selective Fishing Gear',
        description: 'Implementation of improved fishing gear technology reduced unwanted bycatch by 45%.',
        metrics: { before: 22, after: 12, unit: '% bycatch', improvement: '-45%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 16 },
        { year: 2021, count: 20 },
        { year: 2022, count: 24 },
        { year: 2023, count: 28 },
        { year: 2024, count: 32 }
      ],
      citations: 620,
      hIndex: 17
    },
    economicImpact: {
      valueGenerated: 'USD 3.8M',
      jobsCreated: 145,
      vesselsUpgraded: 350
    },
    partnerships: [
      'FAO', 'Private Sector Partners', 'Boat Builders Association', 'Fishing Cooperatives', 'Universities'
    ]
  },

  'hydrography': {
    keyMetrics: [
      { label: 'Nautical Charts Updated', value: '45', icon: 'Map', trend: '+12', color: 'blue' },
      { label: 'Vessels Served Annually', value: '8,500+', icon: 'Ship', trend: '+850', color: 'cyan' },
      { label: 'Monitoring Stations', value: '12', icon: 'Radio', trend: '+3', color: 'indigo' },
      { label: 'Safety Incidents Reduced', value: '38%', icon: 'Shield', trend: '-15%', color: 'green' }
    ],
    impactStories: [
      {
        title: 'Maritime Safety Enhancement',
        description: 'Updated charts and monitoring systems reduced maritime incidents by 38% in 3 years.',
        metrics: { before: 124, after: 77, unit: 'incidents', improvement: '-38%' },
        year: 2024
      },
      {
        title: 'Early Warning System',
        description: 'Real-time ocean monitoring provided 95% accurate weather warnings, saving 200+ lives.',
        metrics: { before: 72, after: 95, unit: '% accuracy', improvement: '+32%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 15 },
        { year: 2021, count: 18 },
        { year: 2022, count: 22 },
        { year: 2023, count: 26 },
        { year: 2024, count: 30 }
      ],
      citations: 580,
      hIndex: 16
    },
    economicImpact: {
      valueGenerated: 'USD 4.5M',
      jobsCreated: 95,
      vesselsSafeguarded: 8500
    },
    partnerships: [
      'IMO', 'NOAA', 'IHO', 'Sri Lanka Navy', 'Ports Authority'
    ]
  },

  'quality-assurance': {
    keyMetrics: [
      { label: 'Post-Harvest Losses Reduced', value: '55%', icon: 'TrendingDown', trend: '-20%', color: 'green' },
      { label: 'Cold Storage Facilities', value: '28', icon: 'Snowflake', trend: '+8', color: 'blue' },
      { label: 'Quality Standards Certified', value: '95%', icon: 'Award', trend: '+15%', color: 'emerald' },
      { label: 'Export Value Increased', value: '42%', icon: 'DollarSign', trend: '+12%', color: 'teal' }
    ],
    impactStories: [
      {
        title: 'Cold Chain Revolution',
        description: 'Improved cold chain infrastructure reduced post-harvest losses from 25% to 11%.',
        metrics: { before: 25, after: 11, unit: '% loss', improvement: '-56%' },
        year: 2024
      },
      {
        title: 'Export Quality Enhancement',
        description: 'HACCP certification program increased export-grade fish from 62% to 95%.',
        metrics: { before: 62, after: 95, unit: '% grade-A', improvement: '+53%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 12 },
        { year: 2021, count: 16 },
        { year: 2022, count: 20 },
        { year: 2023, count: 24 },
        { year: 2024, count: 28 }
      ],
      citations: 450,
      hIndex: 14
    },
    economicImpact: {
      valueGenerated: 'USD 5.8M',
      jobsCreated: 320,
      processingUnitsImproved: 45
    },
    partnerships: [
      'ADB', 'Export Development Board', 'EU', 'Private Sector', 'Industry Associations'
    ]
  },

  'information-outreach': {
    keyMetrics: [
      { label: 'Researchers Trained', value: '450+', icon: 'GraduationCap', trend: '+120', color: 'pink' },
      { label: 'Workshops Conducted', value: '85', icon: 'Users', trend: '+22', color: 'rose' },
      { label: 'Research Grants Awarded', value: '32', icon: 'DollarSign', trend: '+10', color: 'red' },
      { label: 'Institutions Collaborated', value: '28', icon: 'Building', trend: '+8', color: 'purple' }
    ],
    impactStories: [
      {
        title: 'PhD Program Success',
        description: 'Capacity building program produced 24 PhD graduates in marine sciences in 3 years.',
        metrics: { before: 8, after: 32, unit: 'PhDs', improvement: '+300%' },
        year: 2024
      },
      {
        title: 'Research Excellence',
        description: 'Grant program funded 32 projects, resulting in 85 high-impact publications.',
        metrics: { before: 28, after: 85, unit: 'publications', improvement: '+204%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 48 },
        { year: 2021, count: 62 },
        { year: 2022, count: 78 },
        { year: 2023, count: 95 },
        { year: 2024, count: 112 }
      ],
      citations: 2250,
      hIndex: 38
    },
    economicImpact: {
      valueGenerated: 'USD 2.8M',
      jobsCreated: 180,
      professionalsUpskilled: 450
    },
    partnerships: [
      'NSF', 'UNESCO', 'Universities', 'International Research Institutes', 'Private Foundations'
    ]
  },

  'environmental-monitoring': {
    keyMetrics: [
      { label: 'Reservoirs Monitored', value: '22', icon: 'Droplets', trend: '+7', color: 'cyan' },
      { label: 'Water Quality Improved', value: '68%', icon: 'TrendingUp', trend: '+18%', color: 'blue' },
      { label: 'Endemic Species Protected', value: '15', icon: 'Fish', trend: '+5', color: 'teal' },
      { label: 'Communities Benefited', value: '45,000+', icon: 'Users', trend: '+12000', color: 'sky' }
    ],
    impactStories: [
      {
        title: 'Reservoir Water Quality',
        description: 'Monitoring and management interventions improved water quality index by 68% in key reservoirs.',
        metrics: { before: 58, after: 97, unit: 'WQI score', improvement: '+67%' },
        year: 2024
      },
      {
        title: 'Endemic Fish Conservation',
        description: 'Habitat restoration increased endangered species populations by 42% over 3 years.',
        metrics: { before: 1200, after: 1704, unit: 'individuals', improvement: '+42%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 14 },
        { year: 2021, count: 18 },
        { year: 2022, count: 22 },
        { year: 2023, count: 28 },
        { year: 2024, count: 32 }
      ],
      citations: 520,
      hIndex: 15
    },
    economicImpact: {
      valueGenerated: 'USD 1.2M',
      jobsCreated: 65,
      waterBodiesImproved: 22
    },
    partnerships: [
      'Water Board', 'Environmental Ministry', 'IUCN', 'Universities', 'Local Communities'
    ]
  }
};

export const getDefaultImpact = (divisionId) => {
  return DIVISION_IMPACT[divisionId] || null;
};

export default DIVISION_IMPACT;
