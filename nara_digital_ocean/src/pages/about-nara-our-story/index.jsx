import React, { useState, useEffect, useRef } from 'react';
import ThemeNavbar from '../../components/ui/ThemeNavbar';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  Waves, 
  Fish, 
  Globe, 
  Users, 
  Award, 
  TrendingUp, 
  Eye, 
  Target,
  Heart,
  Anchor,
  Navigation,
  BookOpen,
  Lightbulb,
  MapPin,
  Calendar,
  BarChart3,
  Microscope,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const AboutNARAStoryPage = () => {
  const [counters, setCounters] = useState({
    territory: 0,
    publications: 0,
    programs: 0,
    partners: 0,
    scientists: 0,
    centers: 0,
    projects: 0,
    years: 0
  });

  // Timeline data based on NARA's historical milestones
  const timeline = [
    {
      year: '1981',
      title: 'NARA Established',
      description: 'Founded under Parliament Act No. 54 of 1981 to manage Sri Lanka\'s 200 nautical miles Exclusive Economic Zone - 8 times larger than the country\'s land area',
      impact: '460,000 sq km of ocean territory under scientific management',
      icon: <Anchor className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      year: '1983',
      title: 'Kalpitiya Research Center',
      description: 'First regional research center established to decentralize research activities',
      impact: 'Expanded field research capabilities',
      icon: <MapPin className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      year: '1984',
      title: 'Hydrographic Division Accreditation',
      description: 'Became Sri Lanka\'s focal point for hydrography, accredited by International Hydrographic Organization (IHO)',
      impact: 'International recognition for maritime navigation services',
      icon: <Navigation className="w-8 h-8" />,
      color: 'from-purple-500 to-violet-500'
    },
    {
      year: '1997',
      title: 'Socio-Economic Division Established',
      description: 'Created dedicated division for fisheries economics and social research',
      impact: 'Enhanced understanding of fishing industry\'s socio-economic impact',
      icon: <Users className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500'
    },
    {
      year: '2008',
      title: 'Fish Forecasting Service Launched',
      description: 'Pioneered satellite-based fishing ground advisory using oceanographic data',
      impact: 'Revolutionized Sri Lankan fishing industry with technology',
      icon: <Lightbulb className="w-8 h-8" />,
      color: 'from-teal-500 to-blue-500'
    },
    {
      year: '2012',
      title: 'Panapitiya Center Reactivated',
      description: 'Resumed ornamental fish research operations in Western Province',
      impact: 'Strengthened aquaculture research capabilities',
      icon: <Fish className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      year: '2017',
      title: 'International Research Partnerships',
      description: 'Signed MOUs with China Academy of Sciences and Second Institute of Oceanography',
      impact: 'Enhanced global research collaboration',
      icon: <Globe className="w-8 h-8" />,
      color: 'from-cyan-500 to-teal-500'
    },
    {
      year: '2021',
      title: 'X-Press Pearl Response',
      description: 'Led scientific response to major maritime environmental disaster',
      impact: 'Demonstrated crisis management and environmental monitoring excellence',
      icon: <Award className="w-8 h-8" />,
      color: 'from-red-500 to-pink-500'
    },
    {
      year: '2024',
      title: 'Ocean Forecast Website Launch',
      description: 'Launched trilingual ocean weather forecasting platform with University of Western Australia',
      impact: 'Enhanced maritime safety and environmental monitoring',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      year: '2025',
      title: 'Digital Transformation',
      description: 'Comprehensive digital platform development with world-class capabilities',
      impact: 'Positioning as regional leader in marine science digitalization',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-violet-500 to-purple-500'
    }
  ];

  // Statistics data
  const stats = [
    { key: 'territory', value: 460000, suffix: ' sq km territory', icon: <MapPin />, label: 'Ocean Territory' },
    { key: 'publications', value: 1000, suffix: '+ publications', icon: <BookOpen />, label: 'Research Publications' },
    { key: 'programs', value: 500, suffix: '+ training programs', icon: <Users />, label: 'Training Programs' },
    { key: 'partners', value: 15, suffix: '+ global partners', icon: <Globe />, label: 'International Partners' },
    { key: 'scientists', value: 80, suffix: '+ scientists', icon: <Microscope />, label: 'Expert Scientists' },
    { key: 'centers', value: 6, suffix: ' regional centers', icon: <MapPin />, label: 'Regional Centers' },
    { key: 'projects', value: 50, suffix: '+ annual projects', icon: <BarChart3 />, label: 'Research Projects' },
    { key: 'years', value: 44, suffix: ' years of excellence', icon: <Calendar />, label: 'Years of Excellence' }
  ];

  // Achievements data
  const achievements = [
    {
      category: 'Research Excellence',
      items: [
        '1,000+ research publications and technical reports',
        'Presidential Awards for Scientific Research (2020, 2023)',
        'International recognition in marine sciences',
        'Leading contributor to Indian Ocean research databases'
      ],
      icon: <BookOpen className="w-12 h-12" />,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      category: 'Innovation Leadership',
      items: [
        'First satellite-based fish forecasting in South Asia',
        'Pioneered marine biotechnology in Sri Lanka',
        'Advanced sea cucumber aquaculture techniques',
        'Real-time ocean monitoring network'
      ],
      icon: <Lightbulb className="w-12 h-12" />,
      color: 'bg-gradient-to-br from-purple-500 to-violet-500'
    },
    {
      category: 'International Impact',
      items: [
        'Official data provider to Indian Ocean Tuna Commission (IOTC)',
        'Partnerships with 15+ international institutions',
        'Regional hub for Bay of Bengal Programme (BOBP-IGO)',
        'UNESCO IOC collaboration on ocean science'
      ],
      icon: <Globe className="w-12 h-12" />,
      color: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      category: 'Technology Transfer',
      items: [
        '500+ community training programs conducted',
        'Technology adoption by 1,000+ fish farmers',
        'SME development support across Sri Lanka',
        'Mobile app innovations for fishing community'
      ],
      icon: <Users className="w-12 h-12" />,
      color: 'bg-gradient-to-br from-orange-500 to-red-500'
    }
  ];

  // Animation controls
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);

  // Counter animation effect
  useEffect(() => {
    if (inView) {
      stats?.forEach(stat => {
        let start = 0;
        const end = stat?.value;
        const duration = 2000;
        const increment = end / (duration / 16);
        
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            start = end;
            clearInterval(timer);
          }
          setCounters(prev => ({
            ...prev,
            [stat?.key]: Math.floor(start)
          }));
        }, 16);
      });
    }
  }, [inView]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <ThemeNavbar />
      <div style={{ height: '72px' }} />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with ocean animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
          <div className="absolute inset-0 opacity-20">
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
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)]?.map((_, i) => (
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

        {/* Hero content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Waves className="w-20 h-20 mx-auto mb-8 text-cyan-300" />
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              About NARA
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              National Aquatic Resources Research and Development Agency
            </p>
            <div className="text-lg md:text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              <p className="mb-4">
                <strong className="text-cyan-300">44 years of excellence</strong> in marine science, 
                protecting and researching Sri Lanka's <strong className="text-cyan-300">460,000 sq km</strong> 
                of ocean territory - eight times larger than our land area.
              </p>
              <p>
                From pioneering satellite-based fish forecasting to leading environmental crisis response, 
                NARA stands as the <strong className="text-cyan-300">premier marine research institution</strong> 
                in South Asia.
              </p>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Vision & Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Foundation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Established under Parliament Act No. 54 of 1981, guided by our vision, mission, and values
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100">
                <div className="flex items-center mb-6">
                  <Eye className="w-8 h-8 text-blue-600 mr-4" />
                  <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To be the <strong className="text-blue-600">premier institution</strong> for 
                  Scientific Research in Conservation, Management and Development of 
                  Aquatic Resources in the Region.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-green-100">
                <div className="flex items-center mb-6">
                  <Target className="w-8 h-8 text-green-600 mr-4" />
                  <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To provide <strong className="text-green-600">innovative solutions</strong> for 
                  national development issues in the aquatic resources sector utilizing 
                  scientific and technological knowledge & resource base.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-100">
                <div className="flex items-center mb-6">
                  <Heart className="w-8 h-8 text-red-600 mr-4" />
                  <h3 className="text-2xl font-bold text-gray-800">Our Values</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  <strong className="text-red-600">Scientific Excellence</strong>, Environmental Stewardship, 
                  Innovation, Collaboration, and Sustainable Development for the benefit of 
                  Sri Lanka and the region.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-1">
                <div className="bg-white rounded-2xl p-8 h-full">
                  <h3 className="text-3xl font-bold text-gray-800 mb-6">
                    The Dolphin Symbol
                  </h3>
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Fish className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    The Dolphin on the NARA logo symbolizes <strong className="text-blue-600">knowledge and intelligence</strong> in the sea, 
                    representing our role in the national context. Like the dolphin, we are a 
                    <strong className="text-blue-600"> friend to humanity</strong>, signifying conservation and representing 
                    both freshwater and marine environments with confidence and forward-looking vision.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Statistics Section */}
      <section ref={ref} className="py-20 bg-gradient-to-r from-blue-900 to-cyan-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Four decades of scientific excellence, innovation, and service to Sri Lanka and the global marine research community
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats?.map((stat, index) => (
              <motion.div
                key={stat?.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-cyan-300 mb-4 flex justify-center">
                  {stat?.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {counters?.[stat?.key]?.toLocaleString?.()}{stat?.suffix?.includes('+') ? '+' : ''}
                </div>
                <div className="text-blue-200 text-sm">
                  {stat?.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Journey Through Time
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones that shaped NARA into Sri Lanka's premier marine research institution
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>

            {timeline?.map((item, index) => (
              <motion.div
                key={item?.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-16 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className={`flex items-center mb-4 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <div className={`bg-gradient-to-r ${item?.color} rounded-full p-3 text-white ${index % 2 === 0 ? 'mr-4' : 'ml-4 order-2'}`}>
                        {item?.icon}
                      </div>
                      <div className={index % 2 === 0 ? '' : 'order-1'}>
                        <div className="text-3xl font-bold text-gray-800">{item?.year}</div>
                        <div className="text-lg font-semibold text-gray-600">{item?.title}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-3">{item?.description}</p>
                    <div className="text-sm text-blue-600 font-medium">
                      <strong>Impact:</strong> {item?.impact}
                    </div>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-blue-500 rounded-full z-10"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Achievements Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Achievements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recognition and impact across research excellence, innovation, international collaboration, and technology transfer
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements?.map((achievement, index) => (
              <motion.div
                key={achievement?.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <div className={`${achievement?.color} rounded-2xl p-4 mb-6 text-white flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {achievement?.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  {achievement?.category}
                </h3>
                <ul className="space-y-3">
                  {achievement?.items?.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-600 flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-cyan-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-blue-200 mb-8 leading-relaxed">
              Partner with us in advancing marine science, protecting our oceans, 
              and building a sustainable future for Sri Lanka and the region.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Explore Our Research
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Partner With Us
                <Users className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              National Aquatic Resources Research and Development Agency
            </h3>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-6 text-gray-600">
                <div className="flex flex-col items-center">
                  <MapPin className="w-6 h-6 mb-2 text-blue-600" />
                  <div className="font-medium">Location</div>
                  <div className="text-sm">Crow Island, Mattakkuliya</div>
                  <div className="text-sm">Colombo 15, Sri Lanka</div>
                </div>
                <div className="flex flex-col items-center">
                  <Phone className="w-6 h-6 mb-2 text-blue-600" />
                  <div className="font-medium">Phone</div>
                  <div className="text-sm">+94 11-2521000</div>
                  <div className="text-sm">+94 11-2521006</div>
                </div>
                <div className="flex flex-col items-center">
                  <Mail className="w-6 h-6 mb-2 text-blue-600" />
                  <div className="font-medium">Email</div>
                  <div className="text-sm">postmaster@nara.ac.lk</div>
                  <div className="text-sm">dg@nara.ac.lk</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutNARAStoryPage;