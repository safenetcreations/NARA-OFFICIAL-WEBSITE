import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, Calendar, Globe, BookOpen, Activity } from 'lucide-react';

const NewsHeader = ({ stats }) => {
  const headerStats = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: 'Total Articles',
      value: stats?.totalArticles || 0,
      color: 'text-blue-600'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Total Views',
      value: (stats?.totalViews || 0)?.toLocaleString(),
      color: 'text-green-600'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      label: 'Categories',
      value: stats?.totalCategories || 0,
      color: 'text-purple-600'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      label: 'Avg. Read Time',
      value: `${stats?.averageReadTime || 0} min`,
      color: 'text-orange-600'
    }
  ];

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="w-full h-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)]?.map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
      {/* Header Content */}
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Icon and Title */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                <Newspaper className="w-10 h-10 text-cyan-300" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              NARA News & Updates Center
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed"
            >
              Stay informed with the latest developments in marine research, conservation efforts, 
              and scientific breakthroughs from Sri Lanka's premier aquatic research institution.
            </motion.p>

            {/* Date Range */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-blue-200"
            >
              <Calendar className="w-5 h-5" />
              <span>
                Coverage: January 2025 - September 2025
              </span>
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {headerStats?.map((stat, index) => (
              <motion.div
                key={stat?.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4 ${stat?.color}`}>
                  {stat?.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {stat?.value}
                </div>
                <div className="text-blue-200 text-sm font-medium">
                  {stat?.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-16 fill-slate-50"
        >
          <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </header>
  );
};

export default NewsHeader;