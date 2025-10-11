import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const RegionalDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');

  const regions = [
    { id: 'all', name: 'All Regions', color: '#003366' },
    { id: 'colombo', name: 'Colombo', color: '#1E40AF' },
    { id: 'galle', name: 'Galle', color: '#40E0D0' },
    { id: 'trincomalee', name: 'Trincomalee', color: '#FF6B35' },
    { id: 'jaffna', name: 'Jaffna', color: '#059669' },
    { id: 'batticaloa', name: 'Batticaloa', color: '#D97706' },
    { id: 'hambantota', name: 'Hambantota', color: '#DC2626' }
  ];

  const timeRanges = [
    { id: '24h', name: '24 Hours' },
    { id: '7d', name: '7 Days' },
    { id: '30d', name: '30 Days' },
    { id: '90d', name: '90 Days' }
  ];

  // Mock data for different visualizations
  const weatherData = [
    { region: 'Colombo', temperature: 28.5, humidity: 78, windSpeed: 12, waveHeight: 1.2 },
    { region: 'Galle', temperature: 27.8, humidity: 82, windSpeed: 15, waveHeight: 1.8 },
    { region: 'Trincomalee', temperature: 29.2, humidity: 75, windSpeed: 18, waveHeight: 2.1 },
    { region: 'Jaffna', temperature: 30.1, humidity: 71, windSpeed: 14, waveHeight: 1.5 },
    { region: 'Batticaloa', temperature: 28.9, humidity: 79, windSpeed: 16, waveHeight: 1.7 },
    { region: 'Hambantota', temperature: 29.5, humidity: 73, windSpeed: 20, waveHeight: 2.3 }
  ];

  const fishingConditionsData = [
    { time: '00:00', excellent: 2, good: 3, fair: 1, poor: 0 },
    { time: '04:00', excellent: 4, good: 2, fair: 0, poor: 0 },
    { time: '08:00', excellent: 5, good: 1, fair: 0, poor: 0 },
    { time: '12:00', excellent: 3, good: 2, fair: 1, poor: 0 },
    { time: '16:00', excellent: 2, good: 3, fair: 1, poor: 0 },
    { time: '20:00', excellent: 3, good: 2, fair: 1, poor: 0 }
  ];

  const waterQualityTrends = [
    { date: 'Jan 15', ph: 8.1, dissolved_oxygen: 7.2, turbidity: 2.1, temperature: 27.5 },
    { date: 'Jan 16', ph: 8.0, dissolved_oxygen: 7.4, turbidity: 1.9, temperature: 27.8 },
    { date: 'Jan 17', ph: 8.2, dissolved_oxygen: 7.1, turbidity: 2.3, temperature: 28.1 },
    { date: 'Jan 18', ph: 8.1, dissolved_oxygen: 7.3, turbidity: 2.0, temperature: 27.9 },
    { date: 'Jan 19', ph: 8.0, dissolved_oxygen: 7.5, turbidity: 1.8, temperature: 28.2 },
    { date: 'Jan 20', ph: 8.1, dissolved_oxygen: 7.2, turbidity: 2.1, temperature: 28.0 },
    { date: 'Jan 21', ph: 8.2, dissolved_oxygen: 7.4, turbidity: 1.9, temperature: 28.3 }
  ];

  const marineLifeActivity = [
    { species: 'Dolphins', count: 45, color: '#003366' },
    { species: 'Sea Turtles', count: 23, color: '#1E40AF' },
    { species: 'Whales', count: 8, color: '#40E0D0' },
    { species: 'Sharks', count: 12, color: '#FF6B35' },
    { species: 'Rays', count: 18, color: '#059669' }
  ];

  const alertsSummary = [
    {
      type: 'weather',
      count: 3,
      severity: 'medium',
      icon: 'Cloud',
      title: 'Weather Advisories',
      description: 'Strong wind warnings active'
    },
    {
      type: 'marine',
      count: 1,
      severity: 'low',
      icon: 'Fish',
      title: 'Marine Life Alerts',
      description: 'Whale migration in progress'
    },
    {
      type: 'water',
      count: 2,
      severity: 'low',
      icon: 'Droplets',
      title: 'Water Quality',
      description: 'Monitoring algae activity'
    },
    {
      type: 'safety',
      count: 0,
      severity: 'none',
      icon: 'Shield',
      title: 'Safety Alerts',
      description: 'All clear'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h3 className="font-headline text-xl font-bold text-text-primary">Regional Data Dashboard</h3>
            <p className="font-body text-text-secondary mt-1">Real-time monitoring across NARA's research network</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e?.target?.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {regions?.map((region) => (
                <option key={region?.id} value={region?.id}>{region?.name}</option>
              ))}
            </select>
            
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {timeRanges?.map((range) => (
                <option key={range?.id} value={range?.id}>{range?.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {alertsSummary?.map((alert, index) => (
            <div key={index} className={`rounded-lg border p-4 ${getSeverityColor(alert?.severity)}`}>
              <div className="flex items-center justify-between mb-2">
                <Icon name={alert?.icon} size={20} />
                <span className="font-headline text-lg font-bold">{alert?.count}</span>
              </div>
              <div className="font-cta-medium text-sm">{alert?.title}</div>
              <div className="font-body text-xs mt-1">{alert?.description}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Weather Conditions */}
      <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-headline text-lg font-bold text-text-primary">Current Weather Conditions</h4>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="RefreshCw" size={16} />
            <span>Updated 5 min ago</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {weatherData?.map((data, index) => (
            <div key={index} className="bg-muted rounded-lg p-4 text-center">
              <div className="font-cta-medium text-sm text-text-primary mb-2">{data?.region}</div>
              <div className="space-y-2">
                <div>
                  <div className="font-headline text-lg font-bold text-primary">{data?.temperature}°C</div>
                  <div className="font-body text-xs text-text-secondary">Temperature</div>
                </div>
                <div>
                  <div className="font-headline text-sm font-bold text-secondary">{data?.humidity}%</div>
                  <div className="font-body text-xs text-text-secondary">Humidity</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="region" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="windSpeed" fill="#003366" name="Wind Speed (km/h)" />
              <Bar dataKey="waveHeight" fill="#40E0D0" name="Wave Height (m)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fishing Conditions */}
        <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
          <h4 className="font-headline text-lg font-bold text-text-primary mb-6">Fishing Conditions (24h)</h4>
          
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fishingConditionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="excellent" stackId="a" fill="#059669" name="Excellent" />
                <Bar dataKey="good" stackId="a" fill="#40E0D0" name="Good" />
                <Bar dataKey="fair" stackId="a" fill="#D97706" name="Fair" />
                <Bar dataKey="poor" stackId="a" fill="#DC2626" name="Poor" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="font-body text-text-secondary">Excellent</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-ocean-light rounded"></div>
              <span className="font-body text-text-secondary">Good</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-warning rounded"></div>
              <span className="font-body text-text-secondary">Fair</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span className="font-body text-text-secondary">Poor</span>
            </div>
          </div>
        </div>

        {/* Marine Life Activity */}
        <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
          <h4 className="font-headline text-lg font-bold text-text-primary mb-6">Marine Life Sightings (7 days)</h4>
          
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marineLifeActivity}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {marineLifeActivity?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {marineLifeActivity?.map((species, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: species?.color }}></div>
                  <span className="font-body text-sm text-text-secondary">{species?.species}</span>
                </div>
                <span className="font-cta-medium text-sm text-text-primary">{species?.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Water Quality Trends */}
      <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
        <h4 className="font-headline text-lg font-bold text-text-primary mb-6">Water Quality Trends</h4>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waterQualityTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="ph" 
                stroke="#003366" 
                strokeWidth={2} 
                name="pH Level"
                dot={{ fill: '#003366', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="dissolved_oxygen" 
                stroke="#1E40AF" 
                strokeWidth={2} 
                name="Dissolved Oxygen (mg/L)"
                dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="turbidity" 
                stroke="#40E0D0" 
                strokeWidth={2} 
                name="Turbidity (NTU)"
                dot={{ fill: '#40E0D0', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#FF6B35" 
                strokeWidth={2} 
                name="Temperature (°C)"
                dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="font-body text-text-secondary">pH Level</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded"></div>
            <span className="font-body text-text-secondary">Dissolved Oxygen</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-ocean-light rounded"></div>
            <span className="font-body text-text-secondary">Turbidity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded"></div>
            <span className="font-body text-text-secondary">Temperature</span>
          </div>
        </div>
      </div>
      {/* Data Export & API Access */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div>
            <h4 className="font-headline text-lg font-bold text-text-primary mb-2">Access Regional Data</h4>
            <p className="font-body text-text-secondary">
              Download datasets or integrate with our API for real-time regional monitoring data.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-cta-medium text-sm hover:bg-primary/90 transition-colors duration-ocean flex items-center space-x-2">
              <Icon name="Download" size={16} />
              <span>Export Data</span>
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-cta-medium text-sm hover:bg-secondary/90 transition-colors duration-ocean flex items-center space-x-2">
              <Icon name="Code" size={16} />
              <span>API Access</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalDashboard;