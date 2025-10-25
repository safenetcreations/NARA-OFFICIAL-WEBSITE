import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';

const ResearchersStudentsHub = () => {
  const navigate = useNavigate();
  const { currentUser } = useFirebaseAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const services = {
    research: [
      { id: 'papers', title: 'Research Portal', icon: Icons.FileText, link: '/research-excellence-portal', features: ['Submit Papers', 'Track Citations', 'Peer Review'] },
      { id: 'lab', title: 'Lab Booking', icon: Icons.FlaskConical, link: '/lab-results', features: ['Reserve Labs', 'Equipment', 'Analysis'] },
      { id: 'vessel', title: 'Vessel Booking', icon: Icons.Ship, link: '/admin/research-vessels', features: ['Book Vessels', 'Field Studies'] },
      { id: 'data', title: 'Data Portal', icon: Icons.Database, link: '/open-data-portal', features: ['Datasets', 'API Access'] },
      { id: 'library', title: 'Library', icon: Icons.BookOpen, link: '/library', features: ['E-Books', 'Journals', 'Thesis'] },
      { id: 'collab', title: 'Collaboration', icon: Icons.Users, link: '/knowledge-discovery-center', features: ['Projects', 'Experts'] }
    ],
    student: [
      { id: 'courses', title: 'LDA Courses', icon: Icons.GraduationCap, link: '/learning-development-academy', features: ['Online Courses', 'Certifications'] },
      { id: 'intern', title: 'Internships', icon: Icons.Briefcase, link: '/careers', features: ['Apply', 'Mentorship'] },
      { id: 'projects', title: 'Projects', icon: Icons.Award, link: '/research-excellence-portal', features: ['Showcase', 'Awards'] },
      { id: 'mentor', title: 'Mentorship', icon: Icons.UserCheck, link: '/knowledge-discovery-center', features: ['1-on-1', 'Guidance'] },
      { id: 'shop', title: 'Marketplace', icon: Icons.ShoppingBag, link: '/nara-digital-marketplace', features: ['Equipment', 'Discounts'] }
    ]
  };

  const grants = [
    { title: 'Early Career Grant', amount: 'LKR 2M', deadline: '2025-12-31', icon: Icons.DollarSign },
    { title: 'Student Grant', amount: 'LKR 500K', deadline: '2025-11-30', icon: Icons.GraduationCap },
    { title: 'Collaborative Fund', amount: 'LKR 5M', deadline: '2026-01-15', icon: Icons.Users }
  ];

  const facilities = [
    { name: 'Marine Biology Lab', location: 'Colombo', equipment: 'Microscopes, DNA Sequencing', icon: Icons.Microscope },
    { name: 'Oceanography Lab', location: 'Galle', equipment: 'CTD Sensors, Satellites', icon: Icons.Waves },
    { name: 'Fish Technology', location: 'Negombo', equipment: 'Processing, Testing', icon: Icons.Fish },
    { name: 'Research Vessels', location: 'Multiple Ports', equipment: 'Sonar, GPS', icon: Icons.Ship }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Hero */}
      <section className="relative border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm mb-6">
              <Icons.Sparkles className="w-4 h-4" /> Academic Hub
            </span>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Researcher & Student Engagement Hub
          </h1>
          <p className="mx-auto max-w-3xl text-base text-slate-600 sm:text-lg">
            This area is being prepared as the dedicated knowledge space for academic partners,
            student collaborators, and field researchers. Check back soon for curated resources,
            partner programs, and streamlined submission tools.
          </p>
        </header>

        <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/95 p-10 shadow-xl backdrop-blur-md md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">What&apos;s Coming</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Research partnership briefs and data sharing guidelines</li>
              <li>• Integrated submission workflows for collaborative projects</li>
              <li>• Student innovation programs and scholarship updates</li>
              <li>• Live access to the national ocean knowledge base</li>
            </ul>
          </div>

          <div className="space-y-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-inner">
            <h2 className="text-xl font-semibold text-slate-900">Need Something Today?</h2>
            <p className="text-sm text-slate-600">
              Reach out to the NARA Research Partnerships Desk and we&apos;ll connect you with the
              relevant division.
            </p>
            <a
              href="mailto:research@nara.gov.lk"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              research@nara.gov.lk
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResearchersStudentsHub;
