import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import ThemeNavbar from '../../components/ui/ThemeNavbar';
import useThemeStore from '../../store/theme';
import { coursesData } from '../../data/coursesData';

const LearningDevelopmentAcademy = () => {
  const theme = useThemeStore((state) => state?.theme || 'normal');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollmentModal, setEnrollmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  const [filteredCourses, setFilteredCourses] = useState(coursesData.courses);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Filter and sort courses
  useEffect(() => {
    let filtered = coursesData.courses;

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Sorting
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.enrolled - a.enrolled);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredCourses(filtered);
  }, [selectedCategory, searchQuery, selectedLevel, sortBy]);

  const handleEnroll = (course) => {
    setSelectedCourse(course);
    setEnrollmentModal(true);
  };

  const getThemeClasses = () => {
    const baseClasses = 'min-h-screen transition-all duration-500';
    switch(theme) {
      case 'dark':
        return `${baseClasses} bg-gray-900 text-white`;
      case 'glow':
        return `${baseClasses} bg-black text-white`;
      default:
        return `${baseClasses} bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-900`;
    }
  };

  const getCardClasses = () => {
    switch(theme) {
      case 'dark':
        return 'bg-gray-800 border-gray-700 hover:bg-gray-750';
      case 'glow':
        return 'bg-gradient-to-br from-gray-900 to-gray-800 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]';
      default:
        return 'bg-white border-gray-200 hover:shadow-xl';
    }
  };

  const getButtonClasses = (variant = 'primary') => {
    if (variant === 'primary') {
      switch(theme) {
        case 'dark':
          return 'bg-blue-600 hover:bg-blue-700 text-white';
        case 'glow':
          return 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transform hover:scale-105';
        default:
          return 'bg-blue-600 hover:bg-blue-700 text-white';
      }
    } else {
      switch(theme) {
        case 'dark':
          return 'bg-gray-700 hover:bg-gray-600 text-white';
        case 'glow':
          return 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-cyan-400 border border-cyan-500/30';
        default:
          return 'bg-gray-100 hover:bg-gray-200 text-gray-700';
      }
    }
  };

  return (
    <>
      <ThemeNavbar />
      <div className={getThemeClasses()}>
        <div className="pt-24 pb-12">
          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
          >
            <div className="text-center mb-12">
              <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
                theme === 'glow' 
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse'
                  : theme === 'dark'
                  ? 'text-white'
                  : 'text-gray-900'
              }`}>
                Learning Development Academy
              </h1>
              <p className={`text-xl mb-8 max-w-3xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : theme === 'glow' ? 'text-cyan-200' : 'text-gray-600'
              }`}>
                Advance your career with world-class ocean science education. 
                Learn from experts, earn certifications, and join a global community of ocean researchers.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className={`relative rounded-full overflow-hidden ${
                  theme === 'glow' ? 'shadow-[0_0_40px_rgba(6,182,212,0.3)]' : ''
                }`}>
                  <input
                    type="text"
                    placeholder="Search courses, topics, or instructors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full px-6 py-4 pr-12 text-lg rounded-full transition-all ${
                      theme === 'dark' 
                        ? 'bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700'
                        : theme === 'glow'
                        ? 'bg-gray-900 text-cyan-100 placeholder-cyan-400/50 border border-cyan-500/30 focus:border-cyan-400/50'
                        : 'bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                  <Icons.Search className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 ${
                    theme === 'glow' ? 'text-cyan-400' : 'text-gray-400'
                  }`} />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  { icon: Icons.Users, label: 'Active Students', value: '25,000+' },
                  { icon: Icons.BookOpen, label: 'Courses', value: '150+' },
                  { icon: Icons.Award, label: 'Certifications', value: '45' },
                  { icon: Icons.Star, label: 'Average Rating', value: '4.8/5' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border transition-all ${
                      getCardClasses()
                    }`}
                  >
                    <stat.icon className={`w-8 h-8 mx-auto mb-2 ${
                      theme === 'glow' ? 'text-cyan-400' : 'text-blue-600'
                    }`} />
                    <div className={`text-2xl font-bold ${
                      theme === 'glow' ? 'text-cyan-300' : ''
                    }`}>{stat.value}</div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : theme === 'glow' ? 'text-cyan-200/70' : 'text-gray-600'
                    }`}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Navigation Tabs */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex justify-center space-x-2 mb-8">
              {['courses', 'paths', 'instructors', 'events'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full capitalize font-medium transition-all ${
                    activeTab === tab
                      ? getButtonClasses('primary')
                      : getButtonClasses('secondary')
                  }`}
                >
                  {tab === 'paths' ? 'Learning Paths' : tab}
                </button>
              ))}
            </div>
          </section>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'courses' && (
              <motion.section
                key="courses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              >
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        !selectedCategory
                          ? getButtonClasses('primary')
                          : getButtonClasses('secondary')
                      }`}
                    >
                      All Categories
                    </button>
                    {coursesData.categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
                          selectedCategory === category.id
                            ? getButtonClasses('primary')
                            : getButtonClasses('secondary')
                        }`}
                      >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Level Filter */}
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white border-gray-700'
                        : theme === 'glow'
                        ? 'bg-gray-900 text-cyan-100 border-cyan-500/30'
                        : 'bg-white text-gray-900 border-gray-300'
                    } focus:outline-none`}
                  >
                    <option value="all">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white border-gray-700'
                        : theme === 'glow'
                        ? 'bg-gray-900 text-cyan-100 border-cyan-500/30'
                        : 'bg-white text-gray-900 border-gray-300'
                    } focus:outline-none`}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`rounded-xl overflow-hidden border transition-all hover:transform hover:scale-105 ${
                        getCardClasses()
                      }`}
                    >
                      {/* Course Image */}
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-600 relative">
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            theme === 'glow'
                              ? 'bg-cyan-500/30 text-cyan-200 backdrop-blur-md'
                              : 'bg-white/90 text-gray-800 backdrop-blur-md'
                          }`}>
                            {course.level}
                          </span>
                        </div>
                        {course.certification && (
                          <div className="absolute top-4 right-4">
                            <Icons.Award className={`w-6 h-6 ${
                              theme === 'glow' ? 'text-yellow-400' : 'text-yellow-500'
                            }`} />
                          </div>
                        )}
                      </div>

                      {/* Course Content */}
                      <div className="p-6">
                        <h3 className={`text-xl font-bold mb-2 ${
                          theme === 'glow' ? 'text-cyan-100' : ''
                        }`}>
                          {course.title}
                        </h3>
                        <p className={`text-sm mb-4 line-clamp-2 ${
                          theme === 'dark' ? 'text-gray-400' : theme === 'glow' ? 'text-cyan-200/70' : 'text-gray-600'
                        }`}>
                          {course.description}
                        </p>

                        {/* Instructor */}
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 mr-2" />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : theme === 'glow' ? 'text-cyan-200' : 'text-gray-700'
                          }`}>
                            {course.instructor}
                          </span>
                        </div>

                        {/* Course Meta */}
                        <div className="flex items-center justify-between mb-4 text-sm">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Icons.Clock className="w-4 h-4" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icons.Users className="w-4 h-4" />
                              {course.enrolled.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icons.Star className={`w-4 h-4 fill-current ${
                              theme === 'glow' ? 'text-yellow-400' : 'text-yellow-500'
                            }`} />
                            <span>{course.rating}</span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.features.slice(0, 2).map((feature, idx) => (
                            <span 
                              key={idx}
                              className={`text-xs px-2 py-1 rounded-full ${
                                theme === 'dark'
                                  ? 'bg-gray-700 text-gray-300'
                                  : theme === 'glow'
                                  ? 'bg-cyan-500/20 text-cyan-300'
                                  : 'bg-blue-50 text-blue-700'
                              }`}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Price and Action */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`text-2xl font-bold ${
                              theme === 'glow' ? 'text-cyan-300' : ''
                            }`}>
                              ${course.price}
                            </span>
                          </div>
                          <button
                            onClick={() => handleEnroll(course)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${
                              getButtonClasses('primary')
                            }`}
                          >
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredCourses.length === 0 && (
                  <div className="text-center py-16">
                    <Icons.BookX className={`w-16 h-16 mx-auto mb-4 ${
                      theme === 'glow' ? 'text-cyan-400' : 'text-gray-400'
                    }`} />
                    <p className={`text-xl ${
                      theme === 'dark' ? 'text-gray-400' : theme === 'glow' ? 'text-cyan-200' : 'text-gray-600'
                    }`}>
                      No courses found matching your criteria
                    </p>
                  </div>
                )}
              </motion.section>
            )}

            {activeTab === 'paths' && (
              <motion.section
                key="paths"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {coursesData.learningPaths.map((path) => (
                    <motion.div
                      key={path.id}
                      whileHover={{ scale: 1.05 }}
                      className={`rounded-xl overflow-hidden border transition-all ${
                        getCardClasses()
                      }`}
                    >
                      <div className={`h-32 bg-gradient-to-r ${path.gradient} flex items-center justify-center`}>
                        <span className="text-6xl">{path.icon}</span>
                      </div>
                      <div className="p-6">
                        <h3 className={`text-xl font-bold mb-2 ${
                          theme === 'glow' ? 'text-cyan-100' : ''
                        }`}>
                          {path.title}
                        </h3>
                        <p className={`text-sm mb-4 ${
                          theme === 'dark' ? 'text-gray-400' : theme === 'glow' ? 'text-cyan-200/70' : 'text-gray-600'
                        }`}>
                          {path.description}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Icons.Clock className="w-4 h-4" />
                            <span>{path.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Icons.BookOpen className="w-4 h-4" />
                            <span>{path.courses} Courses</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Icons.TrendingUp className="w-4 h-4" />
                            <span>{path.level}</span>
                          </div>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Modules:</h4>
                          <ul className="space-y-1">
                            {path.modules.slice(0, 3).map((module, idx) => (
                              <li key={idx} className="text-xs flex items-center gap-2">
                                <Icons.CheckCircle className={`w-3 h-3 ${
                                  theme === 'glow' ? 'text-cyan-400' : 'text-green-500'
                                }`} />
                                <span>{module}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button className={`w-full px-4 py-2 rounded-full font-medium transition-all ${
                          getButtonClasses('primary')
                        }`}>
                          Start Learning Path
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {activeTab === 'instructors' && (
              <motion.section
                key="instructors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {coursesData.instructors.map((instructor) => (
                    <motion.div
                      key={instructor.id}
                      whileHover={{ scale: 1.05 }}
                      className={`rounded-xl p-6 border text-center transition-all ${
                        getCardClasses()
                      }`}
                    >
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600" />
                      <h3 className={`text-xl font-bold mb-1 ${
                        theme === 'glow' ? 'text-cyan-100' : ''
                      }`}>
                        {instructor.name}
                      </h3>
                      <p className={`text-sm mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : theme === 'glow' ? 'text-cyan-300' : 'text-gray-600'
                      }`}>
                        {instructor.title}
                      </p>
                      <p className="text-sm mb-4 italic">
                        "{instructor.bio}"
                      </p>
                      <div className="flex justify-center gap-6 mb-4 text-sm">
                        <div>
                          <div className="font-bold">{instructor.students.toLocaleString()}</div>
                          <div className={theme === 'dark' ? 'text-gray-400' : theme === 'glow' ? 'text-cyan-200/70' : 'text-gray-600'}>Students</div>
                        </div>
                        <div>
                          <div className="font-bold">{instructor.courses}</div>
                          <div className={theme === 'dark' ? 'text-gray-400' : theme === 'glow' ? 'text-cyan-200/70' : 'text-gray-600'}>Courses</div>
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-1">
                            <Icons.Star className={`w-4 h-4 fill-current ${
                              theme === 'glow' ? 'text-yellow-400' : 'text-yellow-500'
                            }`} />
                            {instructor.rating}
                          </div>
                          <div className={theme === 'dark' ? 'text-gray-400' : theme === 'glow' ? 'text-cyan-200/70' : 'text-gray-600'}>Rating</div>
                        </div>
                      </div>
                      <button className={`px-6 py-2 rounded-full font-medium transition-all ${
                        getButtonClasses('secondary')
                      }`}>
                        View Profile
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {activeTab === 'events' && (
              <motion.section
                key="events"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              >
                <div className="space-y-4">
                  {coursesData.upcomingEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-xl p-6 border transition-all ${
                        getCardClasses()
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                            theme === 'glow'
                              ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20'
                              : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                          }`}>
                            <Icons.Calendar className={`w-8 h-8 ${
                              theme === 'glow' ? 'text-cyan-400' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className={`text-xl font-bold mb-1 ${
                              theme === 'glow' ? 'text-cyan-100' : ''
                            }`}>
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Icons.User className="w-4 h-4" />
                                {event.speaker}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icons.Users className="w-4 h-4" />
                                {event.attendees} attendees
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                theme === 'dark'
                                  ? 'bg-gray-700 text-gray-300'
                                  : theme === 'glow'
                                  ? 'bg-cyan-500/20 text-cyan-300'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {event.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm mb-2 ${
                            theme === 'dark' ? 'text-gray-400' : theme === 'glow' ? 'text-cyan-200/70' : 'text-gray-600'
                          }`}>
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                          <button className={`px-6 py-2 rounded-full font-medium transition-all ${
                            getButtonClasses('primary')
                          }`}>
                            Register
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Enrollment Modal */}
          <AnimatePresence>
            {enrollmentModal && selectedCourse && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setEnrollmentModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`max-w-lg w-full rounded-2xl p-6 ${
                    theme === 'dark'
                      ? 'bg-gray-800'
                      : theme === 'glow'
                      ? 'bg-gray-900 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.3)]'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-2xl font-bold ${
                      theme === 'glow' ? 'text-cyan-100' : ''
                    }`}>
                      Enroll in Course
                    </h2>
                    <button
                      onClick={() => setEnrollmentModal(false)}
                      className={`p-2 rounded-lg transition-all ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700'
                          : theme === 'glow'
                          ? 'hover:bg-gray-800'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Icons.X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <h3 className={`text-xl font-semibold mb-2 ${
                      theme === 'glow' ? 'text-cyan-200' : ''
                    }`}>
                      {selectedCourse.title}
                    </h3>
                    <p className={`text-sm mb-4 ${
                      theme === 'dark' ? 'text-gray-400' : theme === 'glow' ? 'text-cyan-200/70' : 'text-gray-600'
                    }`}>
                      {selectedCourse.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Instructor</span>
                        <span className="font-medium">{selectedCourse.instructor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Duration</span>
                        <span className="font-medium">{selectedCourse.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Modules</span>
                        <span className="font-medium">{selectedCourse.modules} modules</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Certificate</span>
                        <span className="font-medium">
                          {selectedCourse.certification ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Price</span>
                        <span className={`text-2xl font-bold ${
                          theme === 'glow' ? 'text-cyan-300' : ''
                        }`}>
                          ${selectedCourse.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEnrollmentModal(false)}
                      className={`flex-1 px-6 py-3 rounded-full font-medium transition-all ${
                        getButtonClasses('secondary')
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      className={`flex-1 px-6 py-3 rounded-full font-medium transition-all ${
                        getButtonClasses('primary')
                      }`}
                    >
                      Confirm Enrollment
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Achievements Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <h2 className={`text-3xl font-bold text-center mb-8 ${
              theme === 'glow' ? 'text-cyan-100' : ''
            }`}>
              Unlock Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {coursesData.achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    getCardClasses()
                  }`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className={`font-semibold mb-1 ${
                    theme === 'glow' ? 'text-cyan-200' : ''
                  }`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : theme === 'glow' ? 'text-cyan-200/70' : 'text-gray-600'
                  }`}>
                    {achievement.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default LearningDevelopmentAcademy;
