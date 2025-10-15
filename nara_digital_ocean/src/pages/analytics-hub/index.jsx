import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Target,
  Activity,
  Brain,
  PieChart,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { metricsAggregationService } from '../../services/impactAssessmentService';

const AnalyticsHub = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    const { data } = await metricsAggregationService.aggregateAll();
    if (data) {
      setMetrics(data);
    }
    setLoading(false);
  };

  const tools = [
    {
      id: 'predictive',
      name: 'Predictive Analytics',
      description: 'AI-powered forecasting for fish stocks, climate impacts, and marine trends',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      path: '/analytics/predictive',
      features: ['Fish Stock Forecasting', 'Climate Impact Prediction', 'Trend Analysis', 'Anomaly Detection']
    },
    {
      id: 'impact',
      name: 'Impact Assessment',
      description: 'Measure policy effectiveness and project outcomes with data-driven insights',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      path: '/analytics/impact-assessment',
      features: ['Policy Impact Tracking', 'Project Outcomes', 'ROI Calculation', 'Report Generation']
    },
    {
      id: 'economic',
      name: 'Economic Valuation',
      description: 'Calculate blue economy contributions and investment returns',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      path: '/analytics/economic-valuation',
      features: ['Blue Economy GDP', 'Tourism Revenue', 'Fisheries Value', 'Employment Impact']
    },
    {
      id: 'simulator',
      name: 'Policy Simulator',
      description: 'Model policy changes and simulate outcomes before implementation',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      path: '/analytics/policy-simulator',
      features: ['Scenario Modeling', 'Impact Prediction', 'Cost-Benefit Analysis', 'Risk Assessment']
    }
  ];

  const recentInsights = [
    {
      type: 'success',
      title: 'Fish Stock Recovery Trend Detected',
      description: 'Predictive models show 15% improvement in yellowfin tuna stocks over next 6 months',
      timestamp: '2 hours ago'
    },
    {
      type: 'warning',
      title: 'Policy Review Recommended',
      description: 'Marine conservation policy showing neutral impact - reassessment suggested',
      timestamp: '5 hours ago'
    },
    {
      type: 'info',
      title: 'Blue Economy Growth',
      description: 'Tourism sector contributing 2.3% to GDP, up 0.4% from last year',
      timestamp: '1 day ago'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Analytics Hub - NARA Digital Ocean</title>
        <meta name="description" content="AI-powered analytics and insights for marine resource management and policy decisions" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-yellow-400" />
              <h1 className="text-5xl font-bold">Analytics Hub</h1>
            </div>
            <p className="text-xl text-blue-200 max-w-3xl">
              AI-powered insights and predictive analytics for evidence-based marine policy decisions
            </p>

            {/* Quick Stats */}
            {!loading && metrics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-blue-200">Policy Effectiveness</span>
                  </div>
                  <div className="text-3xl font-bold">{metrics.policyImpact.avgScore}</div>
                  <div className="text-sm text-blue-300 mt-1">{metrics.policyImpact.totalPolicies} policies tracked</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-blue-200">Project Success Rate</span>
                  </div>
                  <div className="text-3xl font-bold">{metrics.projectOutcomes.avgSuccessScore}%</div>
                  <div className="text-sm text-blue-300 mt-1">{metrics.projectOutcomes.totalProjects} projects measured</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-blue-200">Average ROI</span>
                  </div>
                  <div className="text-3xl font-bold">{metrics.roi.avgROI}%</div>
                  <div className="text-sm text-blue-300 mt-1">Net value: LKR {(metrics.roi.netValue / 1000000).toFixed(1)}M</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-blue-200">Platform Health</span>
                  </div>
                  <div className="text-3xl font-bold">{metrics.overall.healthScore}</div>
                  <div className="text-sm text-blue-300 mt-1">Excellent performance</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Analytics Tools Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics Tools</h2>
            <p className="text-gray-600 mb-8">Choose a tool to explore insights and generate reports</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-400"
                  >
                    <div className={`bg-gradient-to-r ${tool.color} p-6`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{tool.name}</h3>
                            <p className="text-white/80 mt-1">{tool.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Key Features:</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {tool.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Insights */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Recent Insights</h2>
            </div>

            <div className="space-y-4">
              {recentInsights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {insight.type === 'success' && (
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  {insight.type === 'warning' && (
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                  )}
                  {insight.type === 'info' && (
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {insight.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Predictions</h3>
              <p className="text-gray-600">
                Machine learning algorithms forecast trends and predict outcomes with confidence intervals
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <PieChart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Data-Driven Decisions</h3>
              <p className="text-gray-600">
                Evidence-based insights help policy makers make informed choices with measurable impact
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Risk Mitigation</h3>
              <p className="text-gray-600">
                Simulate policy changes and assess risks before implementation to avoid costly mistakes
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsHub;
