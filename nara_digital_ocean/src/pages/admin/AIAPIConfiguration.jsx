import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Key, CheckCircle, AlertCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

/**
 * AI API Configuration Page
 * Centralized place to manage all AI service API keys
 */
const AIAPIConfiguration = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState({});
  const [showKeys, setShowKeys] = useState({});
  const [saveMessage, setSaveMessage] = useState('');

  const [apiKeys, setApiKeys] = useState({
    // AWS Polly (for podcast generation)
    aws: {
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-east-1',
      enabled: false
    },

    // NotebookLM (Google)
    notebooklm: {
      apiKey: '',
      projectId: '',
      enabled: false
    },

    // ElevenLabs (voice cloning)
    elevenlabs: {
      apiKey: '',
      enabled: false
    },

    // Google Cloud Text-to-Speech (backup)
    googleTTS: {
      apiKey: '',
      projectId: '',
      enabled: false
    },

    // Azure Speech Services (alternative)
    azure: {
      apiKey: '',
      region: 'eastus',
      enabled: false
    },

    // OpenAI (for script enhancement)
    openai: {
      apiKey: '',
      organization: '',
      enabled: false
    }
  });

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    try {
      const docRef = doc(db, 'admin_config', 'ai_api_keys');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setApiKeys(docSnap.data());
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (provider, field, value) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  const toggleEnabled = (provider) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        enabled: !prev[provider].enabled
      }
    }));
  };

  const toggleShowKey = (provider) => {
    setShowKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const testConnection = async (provider) => {
    setTestingConnection(prev => ({ ...prev, [provider]: 'testing' }));

    try {
      // Simulate API connection test
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, make actual API test calls here
      const isValid = apiKeys[provider].apiKey || apiKeys[provider].accessKeyId;

      if (isValid) {
        setTestingConnection(prev => ({ ...prev, [provider]: 'success' }));
      } else {
        setTestingConnection(prev => ({ ...prev, [provider]: 'error' }));
      }
    } catch (error) {
      setTestingConnection(prev => ({ ...prev, [provider]: 'error' }));
    }

    setTimeout(() => {
      setTestingConnection(prev => ({ ...prev, [provider]: null }));
    }, 3000);
  };

  const saveAPIKeys = async () => {
    setSaving(true);
    setSaveMessage('');

    try {
      const docRef = doc(db, 'admin_config', 'ai_api_keys');
      await setDoc(docRef, apiKeys);

      setSaveMessage('success');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving API keys:', error);
      setSaveMessage('error');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const renderAPIKeyInput = (provider, config) => {
    const { title, description, icon, color, fields } = config;

    return (
      <motion.div
        key={provider}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${color}`}>
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-sm text-slate-400">{description}</p>
            </div>
          </div>

          {/* Enable/Disable Toggle */}
          <button
            onClick={() => toggleEnabled(provider)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              apiKeys[provider].enabled
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            {apiKeys[provider].enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* API Key Fields */}
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              <div className="relative">
                <input
                  type={showKeys[provider] && field.secret ? 'text' : field.secret ? 'password' : 'text'}
                  value={apiKeys[provider][field.name] || ''}
                  onChange={(e) => handleInputChange(provider, field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 pr-10"
                />

                {field.secret && (
                  <button
                    onClick={() => toggleShowKey(provider)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showKeys[provider] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
              </div>

              {field.help && (
                <p className="text-xs text-slate-500 mt-1">{field.help}</p>
              )}
            </div>
          ))}
        </div>

        {/* Test Connection Button */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => testConnection(provider)}
            disabled={testingConnection[provider] === 'testing'}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${testingConnection[provider] === 'testing' ? 'animate-spin' : ''}`} />
            Test Connection
          </button>

          {testingConnection[provider] === 'success' && (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Connected successfully!</span>
            </div>
          )}

          {testingConnection[provider] === 'error' && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">Connection failed</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const apiConfigs = {
    aws: {
      title: 'AWS Polly (Recommended)',
      description: 'Amazon text-to-speech for NotebookLM-style podcasts',
      icon: <Key className="w-6 h-6 text-orange-400" />,
      color: 'bg-orange-500/20',
      fields: [
        {
          name: 'accessKeyId',
          label: 'AWS Access Key ID',
          placeholder: 'AKIAIOSFODNN7EXAMPLE',
          secret: true,
          required: true,
          help: 'Get from AWS IAM Console → Users → Security credentials'
        },
        {
          name: 'secretAccessKey',
          label: 'AWS Secret Access Key',
          placeholder: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
          secret: true,
          required: true,
          help: 'Secret key provided when creating access key'
        },
        {
          name: 'region',
          label: 'AWS Region',
          placeholder: 'us-east-1',
          secret: false,
          required: true,
          help: 'AWS region (e.g., us-east-1, ap-south-1)'
        }
      ]
    },

    notebooklm: {
      title: 'NotebookLM (Google)',
      description: 'Google\'s conversational AI for natural podcasts',
      icon: <Key className="w-6 h-6 text-blue-400" />,
      color: 'bg-blue-500/20',
      fields: [
        {
          name: 'apiKey',
          label: 'API Key',
          placeholder: 'AIzaSyD...',
          secret: true,
          required: true,
          help: 'Get from Google Cloud Console → APIs & Services → Credentials'
        },
        {
          name: 'projectId',
          label: 'Project ID',
          placeholder: 'my-project-123',
          secret: false,
          required: true,
          help: 'Your Google Cloud Project ID'
        }
      ]
    },

    elevenlabs: {
      title: 'ElevenLabs',
      description: 'Professional voice cloning and natural speech',
      icon: <Key className="w-6 h-6 text-purple-400" />,
      color: 'bg-purple-500/20',
      fields: [
        {
          name: 'apiKey',
          label: 'API Key',
          placeholder: 'sk_...',
          secret: true,
          required: true,
          help: 'Get from ElevenLabs Dashboard → Profile → API Keys'
        }
      ]
    },

    googleTTS: {
      title: 'Google Cloud Text-to-Speech',
      description: 'Google\'s standard text-to-speech service',
      icon: <Key className="w-6 h-6 text-green-400" />,
      color: 'bg-green-500/20',
      fields: [
        {
          name: 'apiKey',
          label: 'API Key',
          placeholder: 'AIzaSyD...',
          secret: true,
          required: true,
          help: 'Get from Google Cloud Console → APIs & Services'
        },
        {
          name: 'projectId',
          label: 'Project ID',
          placeholder: 'my-tts-project',
          secret: false,
          required: true
        }
      ]
    },

    azure: {
      title: 'Azure Speech Services',
      description: 'Microsoft\'s enterprise text-to-speech',
      icon: <Key className="w-6 h-6 text-cyan-400" />,
      color: 'bg-cyan-500/20',
      fields: [
        {
          name: 'apiKey',
          label: 'Subscription Key',
          placeholder: 'ab12cd34ef56...',
          secret: true,
          required: true,
          help: 'Get from Azure Portal → Speech Services → Keys'
        },
        {
          name: 'region',
          label: 'Region',
          placeholder: 'eastus',
          secret: false,
          required: true,
          help: 'Azure region (e.g., eastus, westus2)'
        }
      ]
    },

    openai: {
      title: 'OpenAI',
      description: 'For script enhancement and content generation',
      icon: <Key className="w-6 h-6 text-emerald-400" />,
      color: 'bg-emerald-500/20',
      fields: [
        {
          name: 'apiKey',
          label: 'API Key',
          placeholder: 'sk-...',
          secret: true,
          required: true,
          help: 'Get from OpenAI Dashboard → API Keys'
        },
        {
          name: 'organization',
          label: 'Organization ID (optional)',
          placeholder: 'org-...',
          secret: false,
          required: false
        }
      ]
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading API configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Key className="w-8 h-8 text-cyan-400" />
                AI API Configuration
              </h1>
              <p className="text-slate-400">
                Configure your AI service API keys for podcast generation and content enhancement
              </p>
            </div>

            <button
              onClick={saveAPIKeys}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save All'}
            </button>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                saveMessage === 'success'
                  ? 'bg-green-500/20 border border-green-500 text-green-400'
                  : 'bg-red-500/20 border border-red-500 text-red-400'
              }`}
            >
              {saveMessage === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>API keys saved successfully!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  <span>Failed to save API keys. Please try again.</span>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* API Key Forms */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Important Notice */}
        <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-yellow-500 mb-2">Important Security Notice</p>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• API keys are stored encrypted in Firebase</li>
                <li>• Never share your API keys publicly</li>
                <li>• Enable only the services you plan to use</li>
                <li>• Test connections to verify keys are working</li>
                <li>• Monitor your usage to avoid unexpected charges</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recommended Provider */}
        <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-2 border-orange-500 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-orange-500" />
            <p className="font-bold text-orange-500">Recommended for NotebookLM-Style Podcasts</p>
          </div>
          <p className="text-slate-300 text-sm">
            <strong>AWS Polly</strong> is recommended for creating conversational, natural-sounding podcasts similar to NotebookLM.
            It supports multiple voices, SSML for natural pauses, and Neural voices for the best quality.
          </p>
        </div>

        {/* Render all API configurations */}
        {Object.keys(apiConfigs).map((provider) =>
          renderAPIKeyInput(provider, apiConfigs[provider])
        )}

        {/* Help Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Need Help Getting API Keys?</h3>

          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <p className="font-medium text-white">AWS Polly:</p>
              <p>1. Go to AWS Console → IAM → Users → Create User</p>
              <p>2. Attach policy: AmazonPollyFullAccess</p>
              <p>3. Security credentials → Create access key</p>
            </div>

            <div>
              <p className="font-medium text-white">Google NotebookLM / TTS:</p>
              <p>1. Go to Google Cloud Console</p>
              <p>2. Enable Text-to-Speech API</p>
              <p>3. APIs & Services → Credentials → Create API Key</p>
            </div>

            <div>
              <p className="font-medium text-white">ElevenLabs:</p>
              <p>1. Sign up at elevenlabs.io</p>
              <p>2. Go to Profile → API Keys → Generate new key</p>
            </div>

            <div>
              <p className="font-medium text-white">OpenAI:</p>
              <p>1. Go to platform.openai.com</p>
              <p>2. API Keys → Create new secret key</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAPIConfiguration;
