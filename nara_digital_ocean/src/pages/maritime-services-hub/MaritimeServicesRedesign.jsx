import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import * as Icons from 'lucide-react';
import {
  getVessels,
  getPorts,
  getMaritimeServices,
  getMaritimeAlerts,
  getChartCatalog,
  submitChartRequest,
  submitHydroSurveyRequest,
  submitHydroDataRequest,
  submitBathymetryContribution
} from '../../services/maritimeService';
import OceanDataVisualizations from '../../components/maritime/OceanDataVisualizations';

const fallbackCharts = [
  {
    id: 'chart-colombo',
    chartNumber: 'SL-101',
    title: {
      en: 'Colombo Harbour Approaches'
    },
    scale: '1:50 000',
    scaleCategory: 'harbour',
    format: 'digital',
    coverage: 'Western Province · Colombo Port to Kalutara',
    publication: 'Edition 7 · 2024-08-12',
    updatedAt: '2024-08-12T00:00:00Z',
    priceLKR: 8500,
    status: 'available',
    soundings: 'Metres',
    datum: 'WGS84',
    regions: ['west-coast']
  },
  {
    id: 'chart-trinco',
    chartNumber: 'SL-214',
    title: {
      en: 'Trincomalee Bay and Approaches'
    },
    scale: '1:25 000',
    scaleCategory: 'harbour',
    format: 'bundle',
    coverage: 'Eastern Province · Trincomalee Port limits',
    publication: 'Edition 4 · 2024-06-28',
    updatedAt: '2024-06-28T00:00:00Z',
    priceLKR: 9100,
    status: 'available',
    soundings: 'Metres',
    datum: 'Sri Lanka National Grid',
    regions: ['east-coast']
  },
  {
    id: 'chart-north',
    chartNumber: 'SL-305',
    title: {
      en: 'Jaffna Peninsula to Palk Strait'
    },
    scale: '1:150 000',
    scaleCategory: 'coastal',
    format: 'digital',
    coverage: 'Northern Province · Delft Island to Puttalam',
    publication: 'Edition 5 · 2023-11-04',
    updatedAt: '2023-11-04T00:00:00Z',
    priceLKR: 7600,
    status: 'available',
    soundings: 'Metres',
    datum: 'WGS84',
    regions: ['north-coast', 'west-coast']
  },
  {
    id: 'chart-offshore',
    chartNumber: 'SL-410',
    title: {
      en: 'Sri Lanka Offshore Energy Blocks Overview'
    },
    scale: '1:500 000',
    scaleCategory: 'offshore',
    format: 'digital',
    coverage: 'Exclusive Economic Zone • Bathymetry and leased blocks',
    publication: 'Edition 2 · 2024-09-15',
    updatedAt: '2024-09-15T00:00:00Z',
    priceLKR: 11200,
    status: 'available',
    soundings: 'Metres',
    datum: 'WGS84',
    regions: ['offshore']
  }
];

const seaLevelStations = [
  {
    id: 'colombo',
    code: 'colo',
    name: 'Colombo',
    coordinates: '6.9271° N, 79.8612° E',
    region: 'Western Province',
    update: '6-minute realtime feed',
    docs: 'https://www.ioc-sealevelmonitoring.org/station.php?code=colo',
    apiEndpoint: 'https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=colo&format=json',
    fallback: {
      value: 0.45,
      change: 0.03,
      trend: 'rising',
      timestamp: '2024-01-20T06:10:00Z',
      source: 'sample',
      quality: 'verified',
      sampleCount: 240
    }
  },
  {
    id: 'trincomalee',
    code: 'trin',
    name: 'Trincomalee',
    coordinates: '8.5874° N, 81.2152° E',
    region: 'Eastern Province',
    update: '6-minute realtime feed',
    docs: 'https://www.ioc-sealevelmonitoring.org/station.php?code=trin',
    apiEndpoint: 'https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=trin&format=json',
    fallback: {
      value: 0.38,
      change: -0.01,
      trend: 'falling',
      timestamp: '2024-01-20T06:10:00Z',
      source: 'sample',
      quality: 'verified',
      sampleCount: 240
    }
  }
];

const initialSeaLevelSnapshot = seaLevelStations.reduce((accumulator, station) => {
  accumulator[station.id] = { ...station.fallback };
  return accumulator;
}, {});

const initialSeaLevelTimestamp =
  seaLevelStations.find((station) => station.fallback?.timestamp)?.fallback.timestamp || null;

const fallbackMarineWeather = {
  location: 'Colombo Offshore',
  observationTime: '2024-01-20T06:00:00Z',
  waveHeight: 1.2,
  waterTemperature: 28.4,
  seaLevel: 0.44,
  provider: 'Stormglass sample dataset',
  coordinates: '6.9271, 79.8612',
  source: 'sample'
};

const oceanDataIntegrationHighlights = [
  {
    title: 'Unified Observation Streams',
    description:
      'Merge IOC tide gauges, satellite SST, and hindcast models into a single normalized timeline for Sri Lankan waters.',
    metrics: [
      { label: 'Live feeds', value: 'IOC · NOAA' },
      { label: 'Refresh rate', value: '6 min – daily' }
    ]
  },
  {
    title: 'Quality & Compliance Pipeline',
    description:
      'Automated QA/QC following IHO S-100 and NARA validation rules keeps regulatory-grade datasets ready for operations.',
    metrics: [
      { label: 'QC checks', value: '18 automated' },
      { label: 'Data uptime', value: '99.8%' }
    ]
  },
  {
    title: 'Analyst & Operations Delivery',
    description:
      'Expose bathymetry, currents, and environmental layers via dashboards, APIs, batch downloads, and alerting workflows.',
    metrics: [
      { label: 'Delivery modes', value: 'API · SFTP · Email' },
      { label: 'User segments', value: 'Ports · Navy · Research' }
    ]
  }
];

const freeOceanDataSources = [
  {
    id: 'ioc',
    name: 'IOC Sea Level Monitoring (UNESCO)',
    access: 'Open · No auth',
    description:
      'Real-time sea level observations for Colombo and Trincomalee including tidal harmonics, surge, and tsunami alerts.',
    baseUrl: 'https://www.ioc-sealevelmonitoring.org/',
    update: 'Every 6 minutes',
    coverage: 'Sri Lankan tide gauge network',
    formats: 'JSON · XML · CSV',
    endpoints: [
      'https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=colo&format=json',
      'https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=trin&format=json'
    ]
  },
  {
    id: 'noaa',
    name: 'NOAA Tides & Currents',
    access: 'Open · Station selection required',
    description:
      'Water level, tide predictions, and meteorological data for the closest reference stations to Sri Lanka coasts.',
    baseUrl: 'https://api.tidesandcurrents.noaa.gov/api/prod/',
    update: '1 minute – hourly (product dependent)',
    coverage: 'Global reference network',
    formats: 'JSON · CSV',
    endpoints: [
      'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_level&begin_date=20250101&end_date=20250124&datum=MLLW&station=XXXXX&time_zone=GMT&units=metric&format=json'
    ]
  },
  {
    id: 'copernicus',
    name: 'Copernicus Marine Service',
    access: 'Free · Registration with credentials',
    description:
      'Daily satellite and model products covering the Indian Ocean: currents, sea surface height, salinity, waves, and more.',
    baseUrl: 'https://marine.copernicus.eu/',
    update: 'Daily',
    coverage: 'Indian Ocean (0.25°)',
    formats: 'NetCDF · CSV',
    endpoints: ['https://my.cmems-du.eu/thredds/dodsC/']
  },
  {
    id: 'nasa',
    name: 'NASA Ocean Color & EarthData',
    access: 'Free · EarthData login',
    description:
      'Sea surface temperature, chlorophyll-a, and ocean color observations from MODIS, VIIRS, and SeaWiFS missions.',
    baseUrl: 'https://oceancolor.gsfc.nasa.gov/',
    update: 'Daily to weekly',
    coverage: 'Global',
    formats: 'HDF · NetCDF',
    endpoints: ['https://oceandata.sci.gsfc.nasa.gov/api/']
  }
];

const paidOceanDataSources = [
  {
    id: 'stormglass',
    name: 'Stormglass Maritime Weather API',
    pricing: 'Free 50 req/day · US$50–500/mo',
    description:
      'High-resolution wave, sea temperature, currents, salinity, and tide forecasts for custom coordinates.',
    baseUrl: 'https://api.stormglass.io/v2/',
    sampleEndpoint:
      'https://api.stormglass.io/v2/weather/point?lat=6.9271&lng=79.8612&params=waveHeight,waterTemperature,seaLevel',
    notes: 'Requires `VITE_STORMGLASS_API_KEY` header Authorization.'
  },
  {
    id: 'weatherapi',
    name: 'WeatherAPI.com Marine',
    pricing: 'Free tier · US$10–50/mo',
    description:
      'Marine forecasts, tide tables, swell direction, and wave height for Sri Lankan coastal coordinates.',
    baseUrl: 'https://api.weatherapi.com/v1/',
    sampleEndpoint: 'https://api.weatherapi.com/v1/marine.json?key=YOUR_KEY&q=6.9271,79.8612',
    notes: 'Set `VITE_WEATHERAPI_KEY` for authenticated requests.'
  },
  {
    id: 'marine-traffic',
    name: 'Marine Traffic AIS API',
    pricing: '€200–€2000/mo',
    description: 'Vessel tracking, port intelligence, and ocean condition overlays for operational planning.',
    baseUrl: 'https://www.marinetraffic.com/en/ais-api-services',
    sampleEndpoint: 'https://services.marinetraffic.com/en/api/',
    notes: 'Enterprise subscription required. Integrate via secure backend proxy.'
  }
];

const historicalArchives = [
  {
    title: 'NARA Internal Archives',
    description: 'Confidential datasets curated by the Hydrographic Division for Sri Lankan waters.',
    items: [
      {
        name: 'Tide Gauge Records',
        detail: 'Colombo, Trincomalee, Galle · Since 1990s',
        format: 'CSV, SQL backups'
      },
      {
        name: 'Samudra Maru Cruise Logs',
        detail: 'Physical & digital oceanography campaigns',
        format: 'NetCDF, XLS, PDF'
      },
      {
        name: 'Research Station Measurements',
        detail: 'Mannar, Jaffna, Kalpitiya laboratories',
        format: 'Excel, CSV'
      }
    ]
  },
  {
    title: 'International Repositories',
    description: 'Freely accessible archives for historical baselines and climate analysis.',
    items: [
      {
        name: 'PSMSL · Station 1283 (Colombo)',
        detail: 'Monthly & annual mean sea level · 1986–present',
        link: 'https://www.psmsl.org/data/obtaining/'
      },
      {
        name: 'CEDA Environmental Data',
        detail: 'Historical ocean temperature, salinity, currents',
        link: 'https://data.ceda.ac.uk/'
      },
      {
        name: 'ARGO Global Floats',
        detail: 'Temperature & salinity profiles · 0–2000m depth',
        link: 'https://argo.ucsd.edu/data/'
      }
    ]
  }
];

const toolkitPackages = [
  { name: 'axios', purpose: 'HTTP client for authenticated backend proxies' },
  { name: 'react-apexcharts / apexcharts', purpose: 'High-frequency time series visualization' },
  { name: 'leaflet / react-leaflet', purpose: 'Interactive map overlays for station coverage' },
  { name: '@turf/turf', purpose: 'Geospatial calculations and EEZ analytics' },
  { name: 'date-fns', purpose: 'Reliable time-range handling in the browser' },
  { name: 'swr', purpose: 'Stale-while-revalidate data fetching for dashboards' }
];

const dashboardSections = [
  {
    path: '/ocean-data/sea-level',
    features: ['Real-time monitoring', 'Historical trends', 'Download data']
  },
  {
    path: '/ocean-data/temperature',
    features: ['Surface temperature', 'Vertical profiles', 'Seasonal variations']
  },
  {
    path: '/ocean-data/currents',
    features: ['Surface currents', 'Direction & speed', 'Seasonal patterns']
  },
  {
    path: '/ocean-data/waves',
    features: ['Wave height', 'Swell direction', 'Period']
  },
  {
    path: '/ocean-data/salinity',
    features: ['Surface salinity', 'Depth profiles', 'Trends']
  },
  {
    path: '/ocean-data/chlorophyll',
    features: ['Phytoplankton concentration', 'Primary productivity', 'Seasonal blooms']
  }
];

const costTiers = [
  {
    tier: 'Free Tier',
    price: '$0 / month',
    inclusions: ['IOC sea level feed', 'Copernicus (registered)', 'NASA Ocean Color', 'NOAA reference stations']
  },
  {
    tier: 'Basic Tier',
    price: '$60 / month',
    inclusions: ['Stormglass Basic', 'WeatherAPI Marine', 'Email alert automations']
  },
  {
    tier: 'Professional Tier',
    price: '≈ $900 / month',
    inclusions: ['Stormglass Pro', 'Marine Traffic API', 'Dedicated processing budget']
  }
];

const roadmapPhases = [
  {
    title: 'Phase 1 · Free Data (Month 1–2)',
    items: [
      'Integrate IOC sea level feed with live dashboards',
      'Display real-time charts with alert thresholds',
      'Launch interactive station map',
      'Provide basic historical downloads'
    ]
  },
  {
    title: 'Phase 2 · Enhanced Products (Month 3–4)',
    items: [
      'Add NASA SST and Copernicus currents & salinity',
      'Expand historical archival search and request flow',
      'Enable CSV/NetCDF packaging with notifications',
      'Introduce automated event alerts'
    ]
  },
  {
    title: 'Phase 3 · Advanced Intelligence (Month 5–6)',
    items: [
      'Integrate paid APIs for wave forecasting & AIS traffic',
      'Deliver mobile app companion dashboards',
      'Launch research portal with analyst workbench',
      'Support premium decision-support services'
    ]
  }
];

const chartRequestInitial = {
  applicantName: '',
  organization: '',
  email: '',
  phone: '',
  usage: '',
  deliveryMode: 'digital',
  notes: ''
};

const surveyFormInitial = {
  contactName: '',
  organization: '',
  contactEmail: '',
  phone: '',
  surveyArea: '',
  coordinates: '',
  depthRange: '',
  startDate: '',
  endDate: '',
  purpose: '',
  deliverables: ''
};

const dataFormInitial = {
  contactName: '',
  organization: '',
  contactEmail: '',
  dataset: '',
  format: 'S-57',
  intent: '',
  deadline: '',
  notes: ''
};

const bathymetryFormInitial = {
  contributorName: '',
  organization: '',
  contributorEmail: '',
  vessel: '',
  sensor: '',
  acquisitionDate: '',
  coverageArea: '',
  depthRange: '',
  fileLink: '',
  consent: false,
  qualityNotes: ''
};

const MaritimeServicesRedesign = () => {
  const { t, i18n } = useTranslation('maritime');
  const [activeTab, setActiveTab] = useState('tracking');
  const [vessels, setVessels] = useState([]);
  const [ports, setPorts] = useState([]);
  const [services, setServices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [charts, setCharts] = useState(fallbackCharts);
  const [chartFilters, setChartFilters] = useState({ format: 'all', scale: 'all', search: '' });
  const [selectedChart, setSelectedChart] = useState(null);
  const [chartRequestForm, setChartRequestForm] = useState(chartRequestInitial);
  const [chartSubmitting, setChartSubmitting] = useState(false);
  const [chartFeedback, setChartFeedback] = useState(null);
  const [surveyForm, setSurveyForm] = useState(surveyFormInitial);
  const [surveySubmitting, setSurveySubmitting] = useState(false);
  const [surveyFeedback, setSurveyFeedback] = useState(null);
  const [dataForm, setDataForm] = useState(dataFormInitial);
  const [dataSubmitting, setDataSubmitting] = useState(false);
  const [dataFeedback, setDataFeedback] = useState(null);
  const [bathymetryForm, setBathymetryForm] = useState(bathymetryFormInitial);
  const [bathymetrySubmitting, setBathymetrySubmitting] = useState(false);
  const [bathymetryFeedback, setBathymetryFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seaLevelSnapshot, setSeaLevelSnapshot] = useState(initialSeaLevelSnapshot);
  const [seaLevelStatus, setSeaLevelStatus] = useState({
    state: 'idle',
    lastUpdated: initialSeaLevelTimestamp,
    error: null
  });
  const [marineWeather, setMarineWeather] = useState(fallbackMarineWeather);
  const [marineWeatherStatus, setMarineWeatherStatus] = useState({ state: 'idle', error: null });

  const stormglassKey = import.meta.env.VITE_STORMGLASS_API_KEY;
  const weatherApiKey = import.meta.env.VITE_WEATHERAPI_KEY;
  const copernicusUsername = import.meta.env.VITE_COPERNICUS_USERNAME;
  const copernicusPassword = import.meta.env.VITE_COPERNICUS_PASSWORD;
  const nasaToken = import.meta.env.VITE_NASA_EARTHDATA_TOKEN;

  useEffect(() => {
    fetchData();
  }, [i18n.language]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        vesselsData,
        portsData,
        servicesData,
        alertsData,
        chartsData
      ] = await Promise.all([
        getVessels({ limit: 50 }).catch(() => []),
        getPorts().catch(() => []),
        getMaritimeServices(i18n.language).catch(() => []),
        getMaritimeAlerts(true).catch(() => []),
        getChartCatalog({ limit: 40 }).catch(() => [])
      ]);
      
      setVessels(vesselsData);
      setPorts(portsData);
      setServices(servicesData);
      setAlerts(alertsData);
      if (chartsData && chartsData.length > 0) {
        setCharts(
          chartsData.map((chart) => ({
            ...chart,
            updatedAt: chart.updatedAt?.toDate ? chart.updatedAt.toDate() : chart.updatedAt,
            publication: chart.publication || chart.edition || chart.updatedAt
          }))
        );
      } else {
        setCharts(fallbackCharts);
      }
    } catch (error) {
      console.error('Error fetching maritime data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartFormatOptions = useMemo(
    () => [
      { value: 'all', label: t('charts.filter.format.all', { defaultValue: 'All formats' }) },
      { value: 'digital', label: t('charts.filter.format.digital', { defaultValue: 'Digital (S-57/GeoTIFF)' }) },
      { value: 'bundle', label: t('charts.filter.format.bundle', { defaultValue: 'Digital + Print Bundle' }) },
      { value: 'printed', label: t('charts.filter.format.printed', { defaultValue: 'Printed Sheets' }) }
    ],
    [t]
  );

  const chartScaleOptions = useMemo(
    () => [
      { value: 'all', label: t('charts.filter.scale.all', { defaultValue: 'All scales' }) },
      { value: 'harbour', label: t('charts.filter.scale.harbour', { defaultValue: 'Harbour (1:1 000 – 1:50 000)' }) },
      { value: 'coastal', label: t('charts.filter.scale.coastal', { defaultValue: 'Coastal (1:50 000 – 1:250 000)' }) },
      { value: 'offshore', label: t('charts.filter.scale.offshore', { defaultValue: 'Offshore (>1:250 000)' }) }
    ],
    [t]
  );

  const filteredCharts = useMemo(() => {
    const searchTerm = chartFilters.search.trim().toLowerCase();
    return charts
      .map((chart) => ({
        ...chart,
        updatedAt: chart.updatedAt ? new Date(chart.updatedAt) : null
      }))
      .filter((chart) => {
        const formatMatch =
          chartFilters.format === 'all' || chart.format === chartFilters.format;
        const scaleCategory = chart.scaleCategory || chart.category || 'general';
        const scaleMatch = chartFilters.scale === 'all' || scaleCategory === chartFilters.scale;
        const searchMatch =
          !searchTerm ||
          (typeof chart.title === 'string'
            ? chart.title.toLowerCase().includes(searchTerm)
            : (chart.title?.en || '').toLowerCase().includes(searchTerm)) ||
          (chart.chartNumber || '').toLowerCase().includes(searchTerm) ||
          (chart.coverage || '').toLowerCase().includes(searchTerm);

        return formatMatch && scaleMatch && searchMatch;
      });
  }, [charts, chartFilters]);

  useEffect(() => {
    if (!selectedChart && charts.length > 0) {
      setSelectedChart(charts[0]);
    }
  }, [charts, selectedChart]);

  const handleChartFilterChange = (field, value) => {
    setChartFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChart = (chart) => {
    setSelectedChart(chart);
    setChartFeedback(null);
  };

  const updateChartRequestField = (field, value) => {
    setChartRequestForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitChartRequest = async (event) => {
    event.preventDefault();
    if (!selectedChart) {
      setChartFeedback({ type: 'error', message: t('charts.requestSelectPrompt', { defaultValue: 'Please choose a chart to request.' }) });
      return;
    }

    setChartSubmitting(true);
    setChartFeedback(null);
    try {
      await submitChartRequest({
        ...chartRequestForm,
        chartId: selectedChart.id,
        chartNumber: selectedChart.chartNumber,
        chartTitle: selectedChart.title?.en || selectedChart.title,
        chartFormat: selectedChart.format,
        language: i18n.language
      });

      setChartFeedback({
        type: 'success',
        message: t('charts.requestSuccess', {
          defaultValue: 'Request received. Our hydrography desk will share payment and delivery instructions within two business days.'
        })
      });
      setChartRequestForm(chartRequestInitial);
      setTimeout(() => setChartFeedback(null), 6000);
    } catch (error) {
      console.error('Error submitting chart request:', error);
      setChartFeedback({
        type: 'error',
        message: t('charts.requestError', {
          defaultValue: 'Unable to submit your chart request right now. Please try again soon.'
        })
      });
    } finally {
      setChartSubmitting(false);
    }
  };

  const updateSurveyField = (field, value) => {
    setSurveyForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSurveySubmit = async (event) => {
    event.preventDefault();
    setSurveySubmitting(true);
    setSurveyFeedback(null);
    try {
      await submitHydroSurveyRequest({
        ...surveyForm,
        language: i18n.language
      });
      setSurveyFeedback({
        type: 'success',
        message: t('surveys.success', {
          defaultValue: 'Survey request logged. We will align schedules and revert with a quoted scope.'
        })
      });
      setSurveyForm(surveyFormInitial);
      setTimeout(() => setSurveyFeedback(null), 6000);
    } catch (error) {
      console.error('Error submitting survey request:', error);
      setSurveyFeedback({
        type: 'error',
        message: t('surveys.error', {
          defaultValue: 'Unable to submit the survey request right now. Please retry.'
        })
      });
    } finally {
      setSurveySubmitting(false);
    }
  };

  const updateDataField = (field, value) => {
    setDataForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDataSubmit = async (event) => {
    event.preventDefault();
    setDataSubmitting(true);
    setDataFeedback(null);
    try {
      await submitHydroDataRequest({
        ...dataForm,
        language: i18n.language
      });
      setDataFeedback({
        type: 'success',
        message: t('data.success', {
          defaultValue: 'Thank you. Our data services team will confirm availability and licensing within 48 hours.'
        })
      });
      setDataForm(dataFormInitial);
      setTimeout(() => setDataFeedback(null), 6000);
    } catch (error) {
      console.error('Error submitting data request:', error);
      setDataFeedback({
        type: 'error',
        message: t('data.error', {
          defaultValue: 'Unable to submit your data request at the moment.'
        })
      });
    } finally {
      setDataSubmitting(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) {
      return '--';
    }
    try {
      const locale =
        i18n.language === 'si' ? 'si-LK' : i18n.language === 'ta' ? 'ta-LK' : 'en-LK';
      return new Date(value).toLocaleString(locale, {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      });
    } catch (error) {
      return value;
    }
  };

  const getTrendLabel = (trend) => {
    switch (trend) {
      case 'rising':
        return 'Rising';
      case 'falling':
        return 'Falling';
      default:
        return 'Stable';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'rising':
        return 'text-emerald-300';
      case 'falling':
        return 'text-rose-300';
      default:
        return 'text-slate-400';
    }
  };

  const formatChangeValue = (change) => {
    if (typeof change !== 'number' || Number.isNaN(change)) {
      return '0.00 m';
    }
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} m`;
  };

  const fetchIocStation = useCallback(async (stationCode, signal) => {
    const url = `https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=${stationCode}&format=json&period=latest`;
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`IOC request failed with status ${response.status}`);
    }
    const payload = await response.json();
    const dataArray = Array.isArray(payload) ? payload : payload?.data;
    if (!dataArray || dataArray.length === 0) {
      throw new Error('No sea level samples returned');
    }
    const latestSamples = dataArray.slice(-2);
    const latest = latestSamples[latestSamples.length - 1];
    const previous = latestSamples.length > 1 ? latestSamples[latestSamples.length - 2] : null;
    const latestValue = parseFloat(latest.slevel);
    const previousValue =
      previous && previous.slevel !== undefined ? parseFloat(previous.slevel) : null;
    const delta =
      latestValue != null && previousValue != null && !Number.isNaN(previousValue)
        ? latestValue - previousValue
        : 0;
    const trend = delta > 0.01 ? 'rising' : delta < -0.01 ? 'falling' : 'steady';

    return {
      value: Number.isFinite(latestValue) ? latestValue : null,
      change: Number.isFinite(delta) ? delta : 0,
      trend,
      timestamp: latest.stime,
      source: 'live',
      quality: latest.qflag || 'unverified',
      sampleCount: dataArray.length
    };
  }, []);

  const loadSeaLevelFeeds = useCallback(
    async (signal) => {
      setSeaLevelStatus((prev) => ({ ...prev, state: 'loading', error: null }));
      try {
        const results = await Promise.all(
          seaLevelStations.map(async (station) => {
            try {
              const data = await fetchIocStation(station.code, signal);
              return { id: station.id, data };
            } catch (error) {
              if (error.name === 'AbortError') {
                throw error;
              }
              console.warn(`Falling back to sample data for ${station.name}:`, error);
              return { id: station.id, data: { ...station.fallback } };
            }
          })
        );

        const snapshot = results.reduce((accumulator, entry) => {
          accumulator[entry.id] = entry.data;
          return accumulator;
        }, {});

        setSeaLevelSnapshot(snapshot);
        setSeaLevelStatus({
          state: 'ready',
          lastUpdated: new Date().toISOString(),
          error: null
        });
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        console.error('Error refreshing sea level feeds:', error);
        setSeaLevelSnapshot(
          seaLevelStations.reduce((accumulator, station) => {
            accumulator[station.id] = { ...station.fallback };
            return accumulator;
          }, {})
        );
        setSeaLevelStatus({
          state: 'error',
          lastUpdated: null,
          error: 'Unable to refresh live sea level data right now.'
        });
      }
    },
    [fetchIocStation]
  );

  const loadMarineWeatherFeeds = useCallback(
    async (signal) => {
      if (!stormglassKey && !weatherApiKey) {
        setMarineWeatherStatus({
          state: 'idle',
          error:
            'Add VITE_STORMGLASS_API_KEY or VITE_WEATHERAPI_KEY to enable live marine forecasts.'
        });
        setMarineWeather((prev) => ({ ...prev, source: 'sample' }));
        return;
      }

      setMarineWeatherStatus({ state: 'loading', error: null });
      try {
        if (stormglassKey) {
          const params = 'waveHeight,waterTemperature,seaLevel';
          const response = await fetch(
            `https://api.stormglass.io/v2/weather/point?lat=6.9271&lng=79.8612&params=${params}`,
            {
              signal,
              headers: {
                Authorization: stormglassKey
              }
            }
          );
          if (!response.ok) {
            throw new Error(`Stormglass request failed with status ${response.status}`);
          }
          const payload = await response.json();
          const hours = Array.isArray(payload?.hours) ? payload.hours : [];
          const latest = hours[hours.length - 1] || hours[0];
          if (!latest) {
            throw new Error('Stormglass returned no data.');
          }
          setMarineWeather({
            location: 'Colombo Offshore',
            observationTime: latest.time,
            waveHeight: latest.waveHeight?.sg ?? null,
            waterTemperature: latest.waterTemperature?.sg ?? null,
            seaLevel: latest.seaLevel?.sg ?? null,
            provider: 'Stormglass.io',
            coordinates: '6.9271, 79.8612',
            source: 'stormglass'
          });
          setMarineWeatherStatus({ state: 'ready', error: null });
          return;
        }

        const response = await fetch(
          `https://api.weatherapi.com/v1/marine.json?key=${weatherApiKey}&q=6.9271,79.8612&days=1`,
          { signal }
        );
        if (!response.ok) {
          throw new Error(`WeatherAPI request failed with status ${response.status}`);
        }
        const payload = await response.json();
        const forecastDay = payload?.forecast?.forecastday?.[0];
        const hour = forecastDay?.hour?.[0];
        const tideEvent = Array.isArray(forecastDay?.day?.tides)
          ? forecastDay.day.tides[0]
          : null;
        setMarineWeather({
          location: payload?.location?.name || 'Sri Lanka Coast',
          observationTime: (hour && hour.time) || payload?.location?.localtime,
          waveHeight: hour?.swell_ht_m ?? (hour?.swell_ht_ft ? hour.swell_ht_ft * 0.3048 : null),
          waterTemperature: hour?.water_temp_c ?? hour?.temp_c ?? null,
          seaLevel: tideEvent?.height_mt ?? null,
          provider: 'WeatherAPI Marine',
          coordinates: `${payload?.location?.lat}, ${payload?.location?.lon}`,
          source: 'weatherapi'
        });
        setMarineWeatherStatus({ state: 'ready', error: null });
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        console.error('Error refreshing marine weather feed:', error);
        setMarineWeather((prev) => ({ ...prev, source: 'sample' }));
        setMarineWeatherStatus({
          state: 'error',
          error: error.message || 'Unable to refresh marine weather feed.'
        });
      }
    },
    [stormglassKey, weatherApiKey]
  );

  useEffect(() => {
    if (activeTab !== 'data') {
      return;
    }

    const controller = new AbortController();
    loadSeaLevelFeeds(controller.signal);
    loadMarineWeatherFeeds(controller.signal);

    const interval = setInterval(() => {
      loadSeaLevelFeeds(controller.signal);
      loadMarineWeatherFeeds(controller.signal);
    }, 600000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [activeTab, loadSeaLevelFeeds, loadMarineWeatherFeeds]);

  const integrationStatuses = [
    {
      name: 'IOC Sea Level (UNESCO)',
      status:
        seaLevelStatus.state === 'ready'
          ? 'Live feed active'
          : seaLevelStatus.state === 'loading'
          ? 'Refreshing feed…'
          : 'Sample dataset',
      detail: seaLevelStatus.error
        ? 'Fallback sample dataset in use'
        : seaLevelStatus.lastUpdated
        ? `Last sync ${formatDateTime(seaLevelStatus.lastUpdated)}`
        : 'Awaiting first sync',
      severity: seaLevelStatus.error ? 'warning' : 'ok'
    },
    {
      name: 'Stormglass',
      status: stormglassKey
        ? marineWeather.source === 'stormglass'
          ? 'Live feed active'
          : 'API key detected'
        : 'Add API key',
      detail: stormglassKey ? 'Env: VITE_STORMGLASS_API_KEY' : 'Set VITE_STORMGLASS_API_KEY',
      severity: stormglassKey ? 'ok' : 'todo'
    },
    {
      name: 'WeatherAPI Marine',
      status: weatherApiKey
        ? marineWeather.source === 'weatherapi'
          ? 'Live feed active'
          : 'API key ready as backup'
        : 'Optional key',
      detail: weatherApiKey ? 'Env: VITE_WEATHERAPI_KEY' : 'Optional: set VITE_WEATHERAPI_KEY',
      severity: weatherApiKey ? 'ok' : 'info'
    },
    {
      name: 'Copernicus Marine Service',
      status:
        copernicusUsername && copernicusPassword
          ? 'Credentials configured'
          : 'Set backend credentials',
      detail: 'Backend env: VITE_COPERNICUS_USERNAME / VITE_COPERNICUS_PASSWORD',
      severity: copernicusUsername && copernicusPassword ? 'ok' : 'todo'
    },
    {
      name: 'NASA EarthData',
      status: nasaToken ? 'Token configured' : 'Set access token',
      detail: 'Env: VITE_NASA_EARTHDATA_TOKEN',
      severity: nasaToken ? 'ok' : 'todo'
    }
  ];

  const updateBathymetryField = (field, value) => {
    setBathymetryForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBathymetrySubmit = async (event) => {
    event.preventDefault();
    if (!bathymetryForm.consent) {
      setBathymetryFeedback({
        type: 'error',
        message: t('crowd.consentError', {
          defaultValue: 'Please confirm that you have permission to share this dataset.'
        })
      });
      return;
    }

    setBathymetrySubmitting(true);
    setBathymetryFeedback(null);
    try {
      await submitBathymetryContribution({
        ...bathymetryForm,
        language: i18n.language
      });
      setBathymetryFeedback({
        type: 'success',
        message: t('crowd.success', {
          defaultValue: 'Thank you for contributing. Our hydrographers will run QC and publish eligible tiles to the open dataset.'
        })
      });
      setBathymetryForm(bathymetryFormInitial);
      setTimeout(() => setBathymetryFeedback(null), 6000);
    } catch (error) {
      console.error('Error submitting bathymetry contribution:', error);
      setBathymetryFeedback({
        type: 'error',
        message: t('crowd.error', {
          defaultValue: 'Unable to upload your contribution right now.'
        })
      });
    } finally {
      setBathymetrySubmitting(false);
    }
  };


  const tabs = [
    { id: 'tracking', label: t('tabs.tracking', { defaultValue: 'Vessel Tracking' }), icon: Icons.Ship },
    { id: 'ports', label: t('tabs.ports', { defaultValue: 'Port Information' }), icon: Icons.Anchor },
    { id: 'weather', label: t('tabs.weather', { defaultValue: 'Weather & Navigation' }), icon: Icons.Cloud },
    { id: 'alerts', label: t('tabs.alerts', { defaultValue: 'Safety Alerts' }), icon: Icons.AlertTriangle },
    { id: 'charts', label: t('tabs.charts', { defaultValue: 'Hydrographic Charts' }), icon: Icons.Map },
    { id: 'surveys', label: t('tabs.surveys', { defaultValue: 'Survey Requests' }), icon: Icons.Compass },
    { id: 'data', label: t('tabs.data', { defaultValue: 'Data Services' }), icon: Icons.Database },
    { id: 'crowd', label: t('tabs.crowd', { defaultValue: 'Crowd Bathymetry' }), icon: Icons.Waves }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900/50 to-transparent"></div>
        <motion.div
          animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute w-96 h-96 border-2 border-cyan-500/30 rounded-full"
        />
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t('hero.title')} <span className="text-cyan-400">{t('hero.highlight')}</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab('tracking')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition-all"
              >
                {t('hero.primaryCta')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'tracking' && (
            <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-6">Live Vessel Tracking</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vessels.length > 0 ? vessels.map((vessel) => (
                  <div key={vessel.id} className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
                    <h3 className="text-lg font-semibold mb-2">{vessel.name?.en || vessel.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">{vessel.type}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Speed</span>
                        <span className="text-white">{vessel.speed} knots</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Heading</span>
                        <span className="text-white">{vessel.heading}°</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-3 text-center py-12 text-slate-400">
                    No vessels currently tracked. Add vessels in the admin panel.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'ports' && (
            <motion.div key="ports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-6">Port Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ports.length > 0 ? ports.map((port) => (
                  <div key={port.id} className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
                    <h3 className="text-lg font-semibold mb-2">{port.name?.en || port.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">{port.code}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vessels</span>
                        <span className="text-white">{port.vessels}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Capacity</span>
                        <span className="text-white">{port.capacity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status</span>
                        <span className="text-green-400">{port.status}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-3 text-center py-12 text-slate-400">
                    No port data available. Add ports in the admin panel.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'weather' && (
            <motion.div key="weather" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-6">Weather & Navigation</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['South Coast', 'East Coast', 'West Coast'].map((zone, i) => (
                  <div key={zone} className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Icons.Cloud className="w-8 h-8 text-blue-400" />
                      <div>
                        <h3 className="text-lg font-semibold">{zone}</h3>
                        <p className="text-sm text-slate-400">Current Conditions</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Temperature</span>
                        <span className="text-white">{28 + i}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Wind Speed</span>
                        <span className="text-white">{12 + i * 3} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Wave Height</span>
                        <span className="text-white">{1 + i * 0.3} m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div key="alerts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-6">Safety Alerts</h2>
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="bg-slate-900/50 backdrop-blur-xl rounded-xl border-l-4 border-red-500 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{alert.title?.en || alert.title}</h3>
                          <p className="text-slate-400">{alert.description?.en || alert.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">{alert.severity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-12 text-center">
                  <Icons.CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-slate-400">No active alerts at this time</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'charts' && (
            <motion.div key="charts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-3">
                      {t('charts.heading', { defaultValue: 'Hydrographic Chart Catalog' })}
                    </h2>
                    <p className="text-slate-300 text-sm max-w-2xl">
                      {t('charts.description', {
                        defaultValue:
                          'Search official ENC and paper chart coverage for Sri Lankan waters. Digital bundles include S-57, GeoTIFF and printable PDFs with latest Notices to Mariners applied.'
                      })}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                    <div className="bg-slate-800/70 rounded-2xl p-4 text-center">
                      <p className="text-3xl font-bold">{charts.length}</p>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {t('charts.metrics.total', { defaultValue: 'Catalogued' })}
                      </p>
                    </div>
                    <div className="bg-slate-800/70 rounded-2xl p-4 text-center">
                      <p className="text-3xl font-bold">
                        {filteredCharts.filter((chart) => chart.format === 'digital').length}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {t('charts.metrics.digital', { defaultValue: 'Digital ready' })}
                      </p>
                    </div>
                    <div className="bg-slate-800/70 rounded-2xl p-4 text-center">
                      <p className="text-3xl font-bold">
                        {filteredCharts.filter((chart) => chart.scaleCategory === 'harbour').length}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {t('charts.metrics.harbour', { defaultValue: 'Harbour charts' })}
                      </p>
                    </div>
                    <div className="bg-slate-800/70 rounded-2xl p-4 text-center">
                      <p className="text-3xl font-bold">
                        {filteredCharts.filter((chart) => chart.scaleCategory === 'offshore').length}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {t('charts.metrics.offshore', { defaultValue: 'Offshore' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[240px]">
                  <Icons.Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={chartFilters.search}
                    onChange={(e) => handleChartFilterChange('search', e.target.value)}
                    placeholder={t('charts.filter.search', { defaultValue: 'Search by chart number, title, or coverage' })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <select
                  value={chartFilters.format}
                  onChange={(e) => handleChartFilterChange('format', e.target.value)}
                  className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {chartFormatOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-900">
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={chartFilters.scale}
                  onChange={(e) => handleChartFilterChange('scale', e.target.value)}
                  className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {chartScaleOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCharts.length > 0 ? (
                  filteredCharts.map((chart) => {
                    const updatedLabel = chart.updatedAt
                      ? chart.updatedAt.toLocaleDateString(
                          i18n.language === 'si'
                            ? 'si-LK'
                            : i18n.language === 'ta'
                              ? 'ta-LK'
                              : 'en-GB'
                        )
                      : '—';
                    return (
                      <div key={chart.id} className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                              <Icons.MapPin className="w-4 h-4" /> {chart.chartNumber}
                            </span>
                            <h3 className="text-xl font-semibold mt-2">
                              {chart.title?.[i18n.language] || chart.title?.en || chart.title}
                            </h3>
                            <p className="text-sm text-slate-400 mt-2">{chart.coverage}</p>
                          </div>
                          <div className="text-right text-sm text-slate-400 space-y-1">
                            <div className="font-semibold text-slate-200">{chart.scale}</div>
                            <div>{chart.publication || updatedLabel}</div>
                            <div>{chart.datum}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-slate-300">
                          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300">{chart.format}</span>
                          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300">{chart.scaleCategory}</span>
                          {chart.status === 'available' ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300">{t('charts.status.available', { defaultValue: 'Ready' })}</span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300">{t('charts.status.processing', { defaultValue: 'Updating' })}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-cyan-300">
                            LKR {chart.priceLKR?.toLocaleString('en-LK')}
                          </span>
                          <button
                            onClick={() => handleSelectChart(chart)}
                            className={`px-4 py-2 rounded-lg ${selectedChart?.id === chart.id ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-100 hover:bg-slate-700'} transition-all`}
                          >
                            {selectedChart?.id === chart.id
                              ? t('charts.requestSelected', { defaultValue: 'Selected' })
                              : t('charts.requestCta', { defaultValue: 'Request access' })}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-16 border border-dashed border-slate-700 rounded-2xl text-slate-400">
                    {t('charts.emptyState', { defaultValue: 'No charts match your filters right now.' })}
                  </div>
                )}
              </div>

              <div className="bg-slate-900/60 border border-slate-700 rounded-3xl p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t('charts.requestForm.heading', { defaultValue: 'Request a licensed chart' })}
                    </h3>
                    <p className="text-sm text-slate-400 max-w-2xl">
                      {t('charts.requestForm.copy', {
                        defaultValue:
                          'Complete the form to receive a download link or arrange collection of printed sheets. Commercial reuse requires a signed licence agreement.'
                      })}
                    </p>
                  </div>
                  {selectedChart && (
                    <div className="text-sm bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-slate-300 min-w-[220px]">
                      <p className="font-semibold text-slate-100 mb-1">{selectedChart.chartNumber}</p>
                      <p>{selectedChart.title?.[i18n.language] || selectedChart.title?.en || selectedChart.title}</p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-cyan-300">
                        {selectedChart.format} · {selectedChart.scale}
                      </p>
                    </div>
                  )}
                </div>

                {chartFeedback && (
                  <div
                    className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                      chartFeedback.type === 'success'
                        ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                        : 'border-red-500/40 text-red-300 bg-red-500/10'
                    }`}
                  >
                    {chartFeedback.message}
                  </div>
                )}

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmitChartRequest}>
                  <div className="col-span-1">
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                      {t('charts.requestForm.applicant', { defaultValue: 'Applicant name*' })}
                    </label>
                    <input
                      type="text"
                      value={chartRequestForm.applicantName}
                      onChange={(e) => updateChartRequestField('applicantName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                      {t('common:organization', { defaultValue: 'Organization' })}
                    </label>
                    <input
                      type="text"
                      value={chartRequestForm.organization}
                      onChange={(e) => updateChartRequestField('organization', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                      {t('common:email', { defaultValue: 'Email*' })}
                    </label>
                    <input
                      type="email"
                      value={chartRequestForm.email}
                      onChange={(e) => updateChartRequestField('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                      {t('common:phone', { defaultValue: 'Phone' })}
                    </label>
                    <input
                      type="tel"
                      value={chartRequestForm.phone}
                      onChange={(e) => updateChartRequestField('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="+94 11 2 XXX XXX"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                      {t('charts.requestForm.usage', { defaultValue: 'Intended use*' })}
                    </label>
                    <input
                      type="text"
                      value={chartRequestForm.usage}
                      onChange={(e) => updateChartRequestField('usage', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder={t('charts.requestForm.usagePlaceholder', { defaultValue: 'Port planning, research, navigation...' })}
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                      {t('charts.requestForm.delivery', { defaultValue: 'Preferred delivery' })}
                    </label>
                    <select
                      value={chartRequestForm.deliveryMode}
                      onChange={(e) => updateChartRequestField('deliveryMode', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="digital" className="bg-slate-900">
                        {t('charts.delivery.digital', { defaultValue: 'Digital download (preferred)' })}
                      </option>
                      <option value="printed" className="bg-slate-900">
                        {t('charts.delivery.printed', { defaultValue: 'Printed sheets' })}
                      </option>
                      <option value="bundle" className="bg-slate-900">
                        {t('charts.delivery.bundle', { defaultValue: 'Bundle (digital + print)' })}
                      </option>
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                      {t('charts.requestForm.notes', { defaultValue: 'Notes' })}
                    </label>
                    <textarea
                      rows={3}
                      value={chartRequestForm.notes}
                      onChange={(e) => updateChartRequestField('notes', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder={t('charts.requestForm.notesPlaceholder', { defaultValue: 'Delivery windows, purchasing account, licence questions…' })}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 flex justify-end gap-3">
                    <button
                      type="submit"
                      disabled={chartSubmitting}
                      className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {chartSubmitting
                        ? t('charts.requestForm.submitting', { defaultValue: 'Submitting…' })
                        : t('charts.requestForm.submit', { defaultValue: 'Send request' })}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'surveys' && (
            <motion.div key="surveys" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-4">
                  {t('surveys.heading', { defaultValue: 'Commission a hydrographic survey' })}
                </h2>
                <p className="text-slate-300 text-sm mb-4 max-w-3xl">
                  {t('surveys.copy', {
                    defaultValue:
                      'NARA Hydrographic Service deploys single- and multi-beam platforms, side-scan sonar, and UAV bathymetry to map harbours, lagoons, and project footprints. Provide a brief scope to receive a mobilisation plan and quotation.'
                  })}
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
                  <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4">
                    <h3 className="font-semibold text-slate-100 mb-2">{t('surveys.capabilities', { defaultValue: 'Capabilities' })}</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>{t('surveys.mb', { defaultValue: 'Dual-head multibeam (IHO S-44 Special Order)' })}</li>
                      <li>{t('surveys.lidar', { defaultValue: 'Coastal LiDAR and UAV photogrammetry' })}</li>
                      <li>{t('surveys.ins', { defaultValue: 'Applanix INS, RTK GNSS control' })}</li>
                    </ul>
                  </div>
                  <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4">
                    <h3 className="font-semibold text-slate-100 mb-2">{t('surveys.deliverables', { defaultValue: 'Deliverables' })}</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>{t('surveys.soundings', { defaultValue: 'Sounding grids (XYZ, BAG, GeoTIFF)' })}</li>
                      <li>{t('surveys.chartUpdates', { defaultValue: 'Chart update proposals & ENC patches' })}</li>
                      <li>{t('surveys.qa', { defaultValue: 'QA/QC report, uncertainty budget' })}</li>
                    </ul>
                  </div>
                  <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4">
                    <h3 className="font-semibold text-slate-100 mb-2">{t('surveys.timelines', { defaultValue: 'Lead times' })}</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>{t('surveys.timelineDesk', { defaultValue: 'Desktop scoping: 5 working days' })}</li>
                      <li>{t('surveys.timelineMobilise', { defaultValue: 'Mobilisation: 10–15 working days' })}</li>
                      <li>{t('surveys.timelineDelivery', { defaultValue: 'Deliverables: 20 working days from acquisition' })}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {surveyFeedback && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    surveyFeedback.type === 'success'
                      ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                      : 'border-red-500/40 text-red-300 bg-red-500/10'
                  }`}
                >
                  {surveyFeedback.message}
                </div>
              )}

              <form className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSurveySubmit}>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('surveys.form.name', { defaultValue: 'Contact name*' })}</label>
                  <input
                    type="text"
                    value={surveyForm.contactName}
                    onChange={(e) => updateSurveyField('contactName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('common:organization', { defaultValue: 'Organization' })}</label>
                  <input
                    type="text"
                    value={surveyForm.organization}
                    onChange={(e) => updateSurveyField('organization', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('common:email', { defaultValue: 'Email*' })}</label>
                  <input
                    type="email"
                    value={surveyForm.contactEmail}
                    onChange={(e) => updateSurveyField('contactEmail', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('common:phone', { defaultValue: 'Phone' })}</label>
                  <input
                    type="tel"
                    value={surveyForm.phone}
                    onChange={(e) => updateSurveyField('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('surveys.form.area', { defaultValue: 'Survey area / asset*' })}</label>
                  <input
                    type="text"
                    value={surveyForm.surveyArea}
                    onChange={(e) => updateSurveyField('surveyArea', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder={t('surveys.form.areaPlaceholder', { defaultValue: 'e.g., Oluvil harbour basin, lagoon mouth, FPSO location' })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('surveys.form.coords', { defaultValue: 'Coordinates / extents' })}</label>
                  <textarea
                    rows={3}
                    value={surveyForm.coordinates}
                    onChange={(e) => updateSurveyField('coordinates', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Lat/Long bounds, shapefile link, or chart references"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('surveys.form.depthRange', { defaultValue: 'Depth range' })}</label>
                  <input
                    type="text"
                    value={surveyForm.depthRange}
                    onChange={(e) => updateSurveyField('depthRange', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="0 – 25 m"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('surveys.form.start', { defaultValue: 'Preferred start' })}</label>
                  <input
                    type="date"
                    value={surveyForm.startDate}
                    onChange={(e) => updateSurveyField('startDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('surveys.form.end', { defaultValue: 'Preferred completion' })}</label>
                  <input
                    type="date"
                    value={surveyForm.endDate}
                    onChange={(e) => updateSurveyField('endDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('surveys.form.purpose', { defaultValue: 'Purpose & stakeholders*' })}</label>
                  <textarea
                    rows={3}
                    value={surveyForm.purpose}
                    onChange={(e) => updateSurveyField('purpose', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('surveys.form.deliverables', { defaultValue: 'Required deliverables' })}</label>
                  <textarea
                    rows={2}
                    value={surveyForm.deliverables}
                    onChange={(e) => updateSurveyField('deliverables', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="XYZ grids, ENC patches, dredging volumes..."
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={surveySubmitting}
                    className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {surveySubmitting
                      ? t('surveys.form.submitting', { defaultValue: 'Submitting…' })
                      : t('surveys.form.submit', { defaultValue: 'Submit survey request' })}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div
              key="data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      {t('data.integrationHeading', { defaultValue: 'Comprehensive Ocean Data Integration System' })}
                    </h2>
                    <p className="text-slate-300 text-sm max-w-3xl mt-3">
                      {t('data.integrationCopy', {
                        defaultValue:
                          'Fuse live observations, satellite products, and licensed archives into a single operational picture for Sri Lankan waters. Every data stream is validated against NARA and IHO quality rules before distribution.'
                      })}
                    </p>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl px-5 py-4 text-sm text-slate-300 space-y-2 min-w-[220px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('data.status.seaLevel', { defaultValue: 'Sea level feed' })}</span>
                      <span
                        className={`font-semibold ${
                          seaLevelStatus.state === 'ready'
                            ? 'text-emerald-300'
                            : seaLevelStatus.state === 'loading'
                            ? 'text-amber-300'
                            : 'text-slate-300'
                        }`}
                      >
                        {seaLevelStatus.state === 'ready'
                          ? t('data.status.live', { defaultValue: 'Live' })
                          : seaLevelStatus.state === 'loading'
                          ? t('data.status.refreshing', { defaultValue: 'Refreshing' })
                          : t('data.status.sample', { defaultValue: 'Sample' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('data.status.lastSync', { defaultValue: 'Last sync' })}</span>
                      <span className="font-medium text-slate-200">
                        {seaLevelStatus.lastUpdated
                          ? formatDateTime(seaLevelStatus.lastUpdated)
                          : t('data.status.pending', { defaultValue: 'Pending' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">
                        {t('data.status.marineForecast', { defaultValue: 'Marine forecast' })}
                      </span>
                      <span
                        className={`font-semibold ${
                          marineWeatherStatus.state === 'ready'
                            ? 'text-emerald-300'
                            : marineWeatherStatus.state === 'loading'
                            ? 'text-amber-300'
                            : marineWeatherStatus.state === 'error'
                            ? 'text-rose-300'
                            : 'text-slate-300'
                        }`}
                      >
                        {marineWeatherStatus.state === 'ready'
                          ? t('data.status.live', { defaultValue: 'Live' })
                          : marineWeatherStatus.state === 'loading'
                          ? t('data.status.refreshing', { defaultValue: 'Refreshing' })
                          : marineWeatherStatus.state === 'error'
                          ? t('data.status.check', { defaultValue: 'Check config' })
                          : t('data.status.sample', { defaultValue: 'Sample' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {oceanDataIntegrationHighlights.map((highlight) => (
                    <div
                      key={highlight.title}
                      className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100">{highlight.title}</h3>
                        <p className="text-sm text-slate-300 mt-2">{highlight.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                        {highlight.metrics.map((metric) => (
                          <div
                            key={metric.label}
                            className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2"
                          >
                            <p className="text-slate-400 uppercase tracking-wide">{metric.label}</p>
                            <p className="text-slate-100 font-semibold mt-1">{metric.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      {t('data.liveHeading', { defaultValue: 'Live observations & marine forecasts' })}
                    </h3>
                    <p className="text-sm text-slate-300 max-w-3xl mt-2">
                      {t('data.liveCopy', {
                        defaultValue:
                          'IOC tide gauges stream sea level anomalies every six minutes. Optional Stormglass and WeatherAPI integrations add wave height, sea temperature, and tide predictions to the operational view.'
                      })}
                    </p>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1 bg-slate-950/30 border border-slate-800 rounded-2xl px-4 py-3">
                    <p>{t('data.refreshInterval', { defaultValue: 'Feeds refresh every 10 minutes while this tab is open.' })}</p>
                    <p>
                      {t('data.configureKeys', {
                        defaultValue: 'Configure API keys via .env to activate premium feeds.'
                      })}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {seaLevelStations.map((station) => {
                    const snapshot = seaLevelSnapshot[station.id] || station.fallback;
                    return (
                      <div
                        key={station.id}
                        className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-cyan-300">
                              {t('data.station', { defaultValue: 'Sea level station' })}
                            </p>
                            <h4 className="text-lg font-semibold text-slate-100 mt-1">{station.name}</h4>
                            <p className="text-xs text-slate-400">{station.coordinates}</p>
                          </div>
                          <a
                            href={station.docs}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-cyan-300 hover:text-cyan-200"
                          >
                            {t('data.viewStation', { defaultValue: 'Station detail' })}
                          </a>
                        </div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-3xl font-bold text-cyan-300">
                            {snapshot?.value != null ? snapshot.value.toFixed(2) : '--'} m
                          </span>
                          <span className={`text-sm font-semibold ${getTrendColor(snapshot?.trend)}`}>
                            {formatChangeValue(snapshot?.change)} · {getTrendLabel(snapshot?.trend)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          <p>{t('data.updated', { defaultValue: 'Updated' })}: {formatDateTime(snapshot?.timestamp)}</p>
                          <p>{t('data.updateCadence', { defaultValue: 'Cadence' })}: {station.update}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2">
                            <p className="text-slate-400 uppercase tracking-wide">
                              {t('data.samples', { defaultValue: 'Samples' })}
                            </p>
                            <p className="text-slate-100 font-semibold mt-1">
                              {snapshot?.sampleCount ?? station.fallback.sampleCount}
                            </p>
                          </div>
                          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2">
                            <p className="text-slate-400 uppercase tracking-wide">
                              {t('data.quality', { defaultValue: 'Quality' })}
                            </p>
                            <p className="text-slate-100 font-semibold mt-1">
                              {(snapshot?.quality || station.fallback.quality || 'unverified').toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">
                          {t('data.region', { defaultValue: 'Region' })}: {station.region}
                        </p>
                      </div>
                    );
                  })}
                  <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-cyan-300">
                          {t('data.marineForecast', { defaultValue: 'Marine forecast snapshot' })}
                        </p>
                        <h4 className="text-lg font-semibold text-slate-100 mt-1">{marineWeather.location}</h4>
                        <p className="text-xs text-slate-400">{marineWeather.provider}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                          marineWeatherStatus.state === 'ready'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : marineWeatherStatus.state === 'loading'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : marineWeatherStatus.state === 'error'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : 'bg-slate-500/10 text-slate-300 border-slate-500/30'
                        }`}
                      >
                        {marineWeatherStatus.state === 'ready'
                          ? t('data.status.live', { defaultValue: 'Live' })
                          : marineWeatherStatus.state === 'loading'
                          ? t('data.status.refreshing', { defaultValue: 'Refreshing' })
                          : marineWeatherStatus.state === 'error'
                          ? t('data.status.check', { defaultValue: 'Check config' })
                          : t('data.status.sample', { defaultValue: 'Sample' })}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
                      <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wide">
                          {t('data.waveHeight', { defaultValue: 'Wave height' })}
                        </p>
                        <p className="text-slate-100 font-semibold mt-1">
                          {marineWeather.waveHeight != null ? `${marineWeather.waveHeight.toFixed(2)} m` : '--'}
                        </p>
                      </div>
                      <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wide">
                          {t('data.waterTemp', { defaultValue: 'Water temp' })}
                        </p>
                        <p className="text-slate-100 font-semibold mt-1">
                          {marineWeather.waterTemperature != null ? `${marineWeather.waterTemperature.toFixed(1)} °C` : '--'}
                        </p>
                      </div>
                      <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 col-span-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wide">
                          {t('data.seaLevelOffset', { defaultValue: 'Sea level offset' })}
                        </p>
                        <p className="text-slate-100 font-semibold mt-1">
                          {marineWeather.seaLevel != null ? `${marineWeather.seaLevel.toFixed(2)} m` : '--'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">
                      {t('data.updated', { defaultValue: 'Updated' })}: {formatDateTime(marineWeather.observationTime)}
                    </p>
                    {marineWeatherStatus.error && (
                      <p className="text-xs text-rose-300">
                        {marineWeatherStatus.error}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      {t('data.forecastNote', {
                        defaultValue: 'Provide Stormglass or WeatherAPI keys to replace sample values.'
                      })}
                    </p>
                  </div>
                </div>
                {(seaLevelStatus.error || marineWeatherStatus.error) && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200 space-y-1">
                    {seaLevelStatus.error && <p>{seaLevelStatus.error}</p>}
                    {marineWeatherStatus.error && <p>{marineWeatherStatus.error}</p>}
                  </div>
                )}
              </div>

              {/* Live Data Visualizations */}
              <OceanDataVisualizations
                seaLevelSnapshot={seaLevelSnapshot}
                marineWeather={marineWeather}
                stations={seaLevelStations}
              />

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-white">
                      {t('data.freeSources', { defaultValue: 'Available data sources · Free' })}
                    </h3>
                    <Icons.Database className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div className="space-y-4">
                    {freeOceanDataSources.map((source) => (
                      <div key={source.id} className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-100">{source.name}</h4>
                            <p className="text-xs uppercase tracking-wide text-cyan-300 mt-1">{source.access}</p>
                          </div>
                          <a href={source.baseUrl} target="_blank" rel="noreferrer" className="text-xs text-cyan-300 hover:text-cyan-200">
                            {t('data.viewDocs', { defaultValue: 'Documentation' })}
                          </a>
                        </div>
                        <p className="text-sm text-slate-300">{source.description}</p>
                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2">
                            <p className="text-slate-400 uppercase tracking-wide">{t('data.update', { defaultValue: 'Update' })}</p>
                            <p className="text-slate-100 font-semibold mt-1">{source.update}</p>
                          </div>
                          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2">
                            <p className="text-slate-400 uppercase tracking-wide">{t('data.coverage', { defaultValue: 'Coverage' })}</p>
                            <p className="text-slate-100 font-semibold mt-1">{source.coverage}</p>
                          </div>
                          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 col-span-2">
                            <p className="text-slate-400 uppercase tracking-wide">{t('data.formats', { defaultValue: 'Formats' })}</p>
                            <p className="text-slate-100 font-semibold mt-1">{source.formats}</p>
                          </div>
                        </div>
                        {source.endpoints && (
                          <div className="space-y-1">
                            {source.endpoints.map((endpoint) => (
                              <p key={endpoint} className="text-[11px] font-mono text-slate-400 bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 break-all">
                                {endpoint}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-white">
                      {t('data.paidSources', { defaultValue: 'Premium & enterprise APIs' })}
                    </h3>
                    <Icons.Shield className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div className="space-y-4">
                    {paidOceanDataSources.map((source) => (
                      <div key={source.id} className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-100">{source.name}</h4>
                            <p className="text-xs uppercase tracking-wide text-cyan-300 mt-1">{source.pricing}</p>
                          </div>
                          <a href={source.baseUrl} target="_blank" rel="noreferrer" className="text-xs text-cyan-300 hover:text-cyan-200">
                            {t('data.viewDocs', { defaultValue: 'Documentation' })}
                          </a>
                        </div>
                        <p className="text-sm text-slate-300">{source.description}</p>
                        <p className="text-xs text-slate-400">{source.notes}</p>
                        <p className="text-[11px] font-mono text-slate-400 bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 break-all">
                          {source.sampleEndpoint}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {historicalArchives.map((archive) => (
                  <div key={archive.title} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-white">{archive.title}</h3>
                      <Icons.Archive className="w-6 h-6 text-cyan-300" />
                    </div>
                    <p className="text-sm text-slate-300">{archive.description}</p>
                    <ul className="space-y-3">
                      {archive.items.map((item) => (
                        <li key={item.name} className="bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-slate-100">{item.name}</span>
                            {item.link && (
                              <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-cyan-300 hover:text-cyan-200">
                                {t('data.download', { defaultValue: 'Open' })}
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{item.detail}</p>
                          {item.format && (
                            <p className="text-xs text-slate-500 mt-1">
                              {t('data.format', { defaultValue: 'Format' })}: {item.format}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-5">
                  <h3 className="text-2xl font-semibold text-white">
                    {t('data.toolkitHeading', { defaultValue: 'Implementation toolkit' })}
                  </h3>
                  <ul className="space-y-3">
                    {toolkitPackages.map((pkg) => (
                      <li key={pkg.name} className="flex items-start gap-3 bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3">
                        <span className="font-mono text-cyan-300 text-sm">{pkg.name}</span>
                        <p className="text-sm text-slate-300">{pkg.purpose}</p>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                      {t('data.integrationStatus', { defaultValue: 'Integration status' })}
                    </h4>
                    <div className="mt-3 space-y-2">
                      {integrationStatuses.map((status) => (
                        <div key={status.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-100">{status.name}</p>
                            <p className="text-xs text-slate-400 mt-1">{status.detail}</p>
                          </div>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                              status.severity === 'ok'
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : status.severity === 'warning'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : status.severity === 'info'
                                ? 'bg-slate-500/10 text-slate-300 border-slate-500/30'
                                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            }`}
                          >
                            {status.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-5">
                  <h3 className="text-2xl font-semibold text-white">
                    {t('data.dashboardHeading', { defaultValue: 'Ocean data dashboard structure' })}
                  </h3>
                  <p className="text-sm text-slate-300">
                    {t('data.dashboardCopy', {
                      defaultValue:
                        'Modular routes keep sea level, waves, currents, salinity, and chlorophyll insights organized for analysts and operational teams.'
                    })}
                  </p>
                  <div className="space-y-3">
                    {dashboardSections.map((section) => (
                      <div key={section.path} className="bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-100">{section.path}</span>
                          <span className="text-xs text-cyan-300">
                            {t('data.sectionReady', { defaultValue: 'Ready for build' })}
                          </span>
                        </div>
                        <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                          {section.features.map((feature) => (
                            <li key={feature}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
                  <h3 className="text-2xl font-semibold text-white">
                    {t('data.costHeading', { defaultValue: 'Cost estimation' })}
                  </h3>
                  <div className="space-y-3">
                    {costTiers.map((tier) => (
                      <div key={tier.tier} className="bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-100">{tier.tier}</span>
                          <span className="text-sm font-semibold text-cyan-300">{tier.price}</span>
                        </div>
                        <ul className="mt-3 text-xs text-slate-400 space-y-1 list-disc list-inside">
                          {tier.inclusions.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
                  <h3 className="text-2xl font-semibold text-white">
                    {t('data.roadmapHeading', { defaultValue: 'Implementation roadmap' })}
                  </h3>
                  <div className="space-y-3">
                    {roadmapPhases.map((phase) => (
                      <div key={phase.title} className="bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-4 space-y-2">
                        <h4 className="text-sm font-semibold text-slate-100">{phase.title}</h4>
                        <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                          {phase.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {dataFeedback && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    dataFeedback.type === 'success'
                      ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                      : 'border-rose-500/40 text-rose-300 bg-rose-500/10'
                  }`}
                >
                  {dataFeedback.message}
                </div>
              )}

              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    {t('data.form.heading', { defaultValue: 'Request licensed hydrographic data' })}
                  </h3>
                  <p className="text-sm text-slate-300 max-w-3xl mt-2">
                    {t('data.form.copy', {
                      defaultValue:
                        'Submit a request to access bathymetric DEMs, ENC change logs, or environmental layers. The NARA data desk will validate licensing and respond within 48 hours.'
                    })}
                  </p>
                </div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleDataSubmit}>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('data.form.name', { defaultValue: 'Contact name*' })}</label>
                    <input
                      type="text"
                      value={dataForm.contactName}
                      onChange={(e) => updateDataField('contactName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('common:organization', { defaultValue: 'Organization' })}</label>
                    <input
                      type="text"
                      value={dataForm.organization}
                      onChange={(e) => updateDataField('organization', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('common:email', { defaultValue: 'Email*' })}</label>
                    <input
                      type="email"
                      value={dataForm.contactEmail}
                      onChange={(e) => updateDataField('contactEmail', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('data.form.dataset', { defaultValue: 'Dataset / tile ID*' })}</label>
                    <input
                      type="text"
                      value={dataForm.dataset}
                      onChange={(e) => updateDataField('dataset', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="e.g., EEZ-Tile-17, ENC SL201"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('data.form.format', { defaultValue: 'Preferred format' })}</label>
                    <select
                      value={dataForm.format}
                      onChange={(e) => updateDataField('format', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="S-57" className="bg-slate-900">S-57</option>
                      <option value="BAG" className="bg-slate-900">BAG</option>
                      <option value="GeoTIFF" className="bg-slate-900">GeoTIFF</option>
                      <option value="XYZ" className="bg-slate-900">XYZ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('data.form.intent', { defaultValue: 'Intended use*' })}</label>
                    <input
                      type="text"
                      value={dataForm.intent}
                      onChange={(e) => updateDataField('intent', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder={t('data.form.intentPlaceholder', { defaultValue: 'Simulation modelling, design dredging, academic study…' })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('data.form.deadline', { defaultValue: 'Required by' })}</label>
                    <input
                      type="date"
                      value={dataForm.deadline}
                      onChange={(e) => updateDataField('deadline', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('data.form.notes', { defaultValue: 'Additional details' })}</label>
                    <textarea
                      rows={3}
                      value={dataForm.notes}
                      onChange={(e) => updateDataField('notes', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={dataSubmitting}
                      className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {dataSubmitting
                        ? t('data.form.submitting', { defaultValue: 'Submitting…' })
                        : t('data.form.submit', { defaultValue: 'Submit data request' })}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'crowd' && (
            <motion.div key="crowd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-4">
                  {t('crowd.heading', { defaultValue: 'Crowd-sourced bathymetry' })}
                </h2>
                <p className="text-slate-300 text-sm max-w-3xl mb-6">
                  {t('crowd.copy', {
                    defaultValue:
                      'Share depth tracks collected by research, commercial, and citizen vessels. We validate submissions against QA thresholds (IHO S-100 Part 8) before merging into the national seabed model.'
                  })}
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
                  <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4">
                    <h3 className="font-semibold text-slate-100 mb-2">{t('crowd.specs', { defaultValue: 'File specifications' })}</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>S-57, XYZ, or CSV with time, depth, position</li>
                      <li>Include metadata: sensor, draft, speed</li>
                      <li>Prefer RTK/differential corrections</li>
                    </ul>
                  </div>
                  <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4">
                    <h3 className="font-semibold text-slate-100 mb-2">{t('crowd.qc', { defaultValue: 'QC process' })}</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Automatic outlier detection</li>
                      <li>Cross-check against latest ENC</li>
                      <li>Manual review by hydrographers</li>
                    </ul>
                  </div>
                  <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4">
                    <h3 className="font-semibold text-slate-100 mb-2">{t('crowd.benefits', { defaultValue: 'Why contribute?' })}</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Accelerate chart updates</li>
                      <li>Improve navigation safety</li>
                      <li>Attribute credit on open datasets</li>
                    </ul>
                  </div>
                </div>
              </div>

              {bathymetryFeedback && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    bathymetryFeedback.type === 'success'
                      ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                      : 'border-red-500/40 text-red-300 bg-red-500/10'
                  }`}
                >
                  {bathymetryFeedback.message}
                </div>
              )}

              <form className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleBathymetrySubmit}>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('crowd.form.name', { defaultValue: 'Contributor name*' })}</label>
                  <input
                    type="text"
                    value={bathymetryForm.contributorName}
                    onChange={(e) => updateBathymetryField('contributorName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('common:organization', { defaultValue: 'Organization' })}</label>
                  <input
                    type="text"
                    value={bathymetryForm.organization}
                    onChange={(e) => updateBathymetryField('organization', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('common:email', { defaultValue: 'Email*' })}</label>
                  <input
                    type="email"
                    value={bathymetryForm.contributorEmail}
                    onChange={(e) => updateBathymetryField('contributorEmail', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('crowd.form.vessel', { defaultValue: 'Vessel / platform' })}</label>
                  <input
                    type="text"
                    value={bathymetryForm.vessel}
                    onChange={(e) => updateBathymetryField('vessel', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('crowd.form.sensor', { defaultValue: 'Sensor / sounder' })}</label>
                  <input
                    type="text"
                    value={bathymetryForm.sensor}
                    onChange={(e) => updateBathymetryField('sensor', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('crowd.form.date', { defaultValue: 'Acquisition date*' })}</label>
                  <input
                    type="date"
                    value={bathymetryForm.acquisitionDate}
                    onChange={(e) => updateBathymetryField('acquisitionDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('crowd.form.coverage', { defaultValue: 'Coverage area*' })}</label>
                  <input
                    type="text"
                    value={bathymetryForm.coverageArea}
                    onChange={(e) => updateBathymetryField('coverageArea', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Bounding box, harbour reach, or polygon reference"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('crowd.form.depth', { defaultValue: 'Depth range' })}</label>
                  <input
                    type="text"
                    value={bathymetryForm.depthRange}
                    onChange={(e) => updateBathymetryField('depthRange', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('crowd.form.file', { defaultValue: 'File download link*' })}</label>
                  <input
                    type="url"
                    value={bathymetryForm.fileLink}
                    onChange={(e) => updateBathymetryField('fileLink', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Secure cloud storage URL"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{t('crowd.form.notes', { defaultValue: 'QC notes' })}</label>
                  <textarea
                    rows={3}
                    value={bathymetryForm.qualityNotes}
                    onChange={(e) => updateBathymetryField('qualityNotes', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Sounder configuration, filters applied, uncertainties..."
                  />
                </div>
                <label className="md:col-span-2 flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={bathymetryForm.consent}
                    onChange={(e) => updateBathymetryField('consent', e.target.checked)}
                    className="w-4 h-4 rounded border border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                    required
                  />
                  {t('crowd.form.consentText', {
                    defaultValue: 'I confirm this dataset may be shared with NARA and published under the national open bathymetry licence (CC-BY 4.0).' })}
                </label>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={bathymetrySubmitting}
                    className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {bathymetrySubmitting
                      ? t('crowd.form.submitting', { defaultValue: 'Uploading…' })
                      : t('crowd.form.submit', { defaultValue: 'Submit contribution' })}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MaritimeServicesRedesign;
