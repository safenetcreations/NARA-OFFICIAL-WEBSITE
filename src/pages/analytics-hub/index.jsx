import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('analytics');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metricsWarning, setMetricsWarning] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await metricsAggregationService.aggregateAll();
      if (data) {
        setMetrics(data);
        setMetricsWarning(data.source !== 'live');
      } else {
        setMetricsWarning(true);
        setMetrics(getFallbackMetrics());
      }
      if (error) {
        console.warn('Analytics metrics fallback in use:', error);
      }
    } catch (err) {
      console.warn('Analytics metrics unavailable, using fallback:', err);
      setMetricsWarning(true);
      setMetrics(getFallbackMetrics());
    } finally {
      setLoading(false);
    }
  };

  const tools = [
    {
      id: 'predictive',
      name: t('tools.predictive.name'),
      description: t('tools.predictive.description'),
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      path: '/analytics/predictive',
      features: [
        t('tools.predictive.features.forecast'),
        t('tools.predictive.features.climate'),
        t('tools.predictive.features.trends'),
        t('tools.predictive.features.anomaly')
      ]
    },
    {
      id: 'impact',
      name: t('tools.impact.name'),
      description: t('tools.impact.description'),
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      path: '/analytics/impact-assessment',
      features: [
        t('tools.impact.features.policy'),
        t('tools.impact.features.outcomes'),
        t('tools.impact.features.roi'),
        t('tools.impact.features.reports')
      ]
    },
    {
      id: 'economic',
      name: t('tools.economic.name'),
      description: t('tools.economic.description'),
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      path: '/analytics/economic-valuation',
      features: [
        t('tools.economic.features.gdp'),
        t('tools.economic.features.tourism'),
        t('tools.economic.features.fisheries'),
        t('tools.economic.features.employment')
      ]
    },
    {
      id: 'simulator',
      name: t('tools.simulator.name'),
      description: t('tools.simulator.description'),
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      path: '/analytics/policy-simulator',
      features: [
        t('tools.simulator.features.modeling'),
        t('tools.simulator.features.prediction'),
        t('tools.simulator.features.costBenefit'),
        t('tools.simulator.features.risk')
      ]
    }
  ];

  const recentInsights = [
    {
      type: 'success',
      title: t('insights.success.title'),
      description: t('insights.success.description'),
      timestamp: t('insights.timestamp.hours', { count: 2 })
    },
    {
      type: 'warning',
      title: t('insights.warning.title'),
      description: t('insights.warning.description'),
      timestamp: t('insights.timestamp.hours', { count: 5 })
    },
    {
      type: 'info',
      title: t('insights.info.title'),
      description: t('insights.info.description'),
      timestamp: t('insights.timestamp.day')
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('hero.title')} - NARA Digital Ocean</title>
        <meta name="description" content={t('hero.description')} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-yellow-400" />
              <h1 className="text-5xl font-bold">{t('hero.title')}</h1>
            </div>
            <p className="text-xl text-blue-200 max-w-3xl">
              {t('hero.description')}
            </p>
            {metricsWarning && (
              <div className="mt-6 max-w-3xl bg-yellow-100/90 border border-yellow-300 text-yellow-900 rounded-lg p-4 text-sm">
                {t('messages.fallback')}
              </div>
            )}

            {/* Quick Stats */}
            {!loading && metrics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-blue-200">{t('stats.policies')}</span>
                  </div>
                  <div className="text-3xl font-bold">{metrics.policyImpact.avgScore}</div>
                  <div className="text-sm text-blue-300 mt-1">{metrics.policyImpact.totalPolicies} {t('labels.policiesTracked')}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-blue-200">{t('stats.accuracy')}</span>
                  </div>
                  <div className="text-3xl font-bold">{metrics.projectOutcomes.avgSuccessScore}%</div>
                  <div className="text-sm text-blue-300 mt-1">{metrics.projectOutcomes.totalProjects} {t('labels.projectsMeasured')}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-blue-200">{t('labels.avgROI')}</span>
                  </div>
                  <div className="text-3xl font-bold">{metrics.roi.avgROI}%</div>
                  <div className="text-sm text-blue-300 mt-1">{t('labels.netValue')}: LKR {(metrics.roi.netValue / 1000000).toFixed(1)}M</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-blue-200">{t('stats.models')}</span>
                  </div>
                  <div className="text-3xl font-bold">{metrics.overall.healthScore}</div>
                  <div className="text-sm text-blue-300 mt-1">{t('stats.insights')}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Analytics Tools Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('hero.subtitle')}</h2>
            <p className="text-gray-600 mb-8">{t('hero.description')}</p>

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
                      <p className="text-sm font-semibold text-gray-700 mb-3">{t('actions.exploreTool')}:</p>
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
              <h2 className="text-2xl font-bold text-gray-900">{t('insights.title')}</h2>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('valueProps.aiTitle')}</h3>
              <p className="text-gray-600">
                {t('valueProps.aiDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <PieChart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('valueProps.dataTitle')}</h3>
              <p className="text-gray-600">
                {t('valueProps.dataDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('valueProps.riskTitle')}</h3>
              <p className="text-gray-600">
                {t('valueProps.riskDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const getFallbackMetrics = () => ({
  policyImpact: {
    avgScore: '72.50',
    totalPolicies: 18,
    effective: 14
  },
  projectOutcomes: {
    avgSuccessScore: '81.20',
    totalProjects: 24,
    successful: 19
  },
  roi: {
    avgROI: '28.40',
    totalInvestment: 125000000,
    totalReturns: 160000000,
    netValue: 35000000
  },
  overall: {
    healthScore: '73.70'
  },
  source: 'local-fallback'
});

export default AnalyticsHub;
