import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import * as Icons from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPages: 0,
    totalEmails: 0,
    totalMedia: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats from Firestore
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      setStats({
        totalUsers: usersSnapshot.size,
        totalPages: 15, // Update based on your pages
        totalEmails: 0,
        totalMedia: 0
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Icons.Users, label: 'Total Users', value: stats.totalUsers, change: '+12%', color: 'cyan' },
    { icon: Icons.FileText, label: 'Pages', value: stats.totalPages, change: '+3', color: 'blue' },
    { icon: Icons.Mail, label: 'Emails Sent', value: stats.totalEmails, change: '+24', color: 'purple' },
    { icon: Icons.Image, label: 'Media Files', value: stats.totalMedia, change: '+8', color: 'green' }
  ];

  const quickActions = [
    { icon: Icons.FilePlus, label: 'Add New Page', path: '/admin/content/new', color: 'cyan' },
    { icon: Icons.UserPlus, label: 'Add User', path: '/admin/users/new', color: 'blue' },
    { icon: Icons.Mail, label: 'Send Email', path: '/admin/emails/compose', color: 'purple' },
    { icon: Icons.Upload, label: 'Upload Media', path: '/admin/media/upload', color: 'green' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2">
          <Icons.Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value.toLocaleString()}</h3>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-6 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-all group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Page Views (Last 7 Days)</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 82, 70, 95, 88, 92, 78].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t-lg transition-all hover:from-cyan-400 hover:to-blue-500"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-slate-500">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New user registered', time: '2 minutes ago', icon: Icons.UserPlus, color: 'green' },
              { action: 'Page content updated', time: '15 minutes ago', icon: Icons.FileEdit, color: 'blue' },
              { action: 'Email campaign sent', time: '1 hour ago', icon: Icons.Mail, color: 'purple' },
              { action: 'Media file uploaded', time: '2 hours ago', icon: Icons.Upload, color: 'cyan' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition">
                <div className={`w-10 h-10 bg-${activity.color}-500/20 rounded-lg flex items-center justify-center`}>
                  <activity.icon className={`w-5 h-5 text-${activity.color}-400`} />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{activity.action}</p>
                  <p className="text-slate-500 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Icons.CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-white font-medium">Database</p>
              <p className="text-green-400 text-sm">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Icons.CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-white font-medium">API Services</p>
              <p className="text-green-400 text-sm">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Icons.CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-white font-medium">Storage</p>
              <p className="text-green-400 text-sm">75% Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
