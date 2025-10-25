import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation('maritime');
  const hero = t('hero', { returnObjects: true }) || {};

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-cyan-500/20 backdrop-blur-sm rounded-full mb-6 border border-cyan-400/30">
              <Icons.Radio className="w-4 h-4 text-cyan-300 mr-2" />
              <span className="text-cyan-100 text-sm font-medium">{hero?.badge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {hero?.title}
              <span className="block text-cyan-400 mt-2">{hero?.highlight}</span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {hero?.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-400 transition-all shadow-xl hover:shadow-2xl hover:shadow-cyan-500/50 flex items-center justify-center space-x-2">
                <Icons.Activity className="w-5 h-5" />
                <span>{hero?.primaryCta}</span>
              </button>
              <button className="px-8 py-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 flex items-center justify-center space-x-2">
                <Icons.MapPin className="w-5 h-5" />
                <span>{hero?.secondaryCta}</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              {(hero?.stats || []).map((item, index) => (
                <div key={item?.id || index}>
                  <div className="text-3xl font-bold text-cyan-400">{item?.value}</div>
                  <div className="text-sm text-blue-200">{item?.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                      <Icons.Waves className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Sea Level Monitoring</h3>
                      <p className="text-blue-200 text-sm">Colombo Station</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Live</span>
                  </div>
                </div>

                {/* Mock Data Display */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-blue-200">Current Level</span>
                    <span className="text-2xl font-bold text-white">0.45 m</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-blue-200">Trend</span>
                    <div className="flex items-center space-x-2">
                      <Icons.TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-semibold">Rising</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-blue-200">Data Quality</span>
                    <span className="text-cyan-400 font-semibold">Excellent</span>
                  </div>
                </div>

                {/* Mini Chart Placeholder */}
                <div className="mt-6 h-24 bg-white/5 rounded-lg flex items-center justify-center">
                  <Icons.LineChart className="w-8 h-8 text-cyan-400 opacity-50" />
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 blur-xl"
              ></motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 blur-xl"
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave SVG Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-current text-slate-50">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
