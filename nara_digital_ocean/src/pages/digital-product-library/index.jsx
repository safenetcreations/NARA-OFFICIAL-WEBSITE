import React from 'react';
import ThemeNavbar from '../../components/ui/ThemeNavbar';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const DigitalProductLibrary = () => {
  return (
    <>
      <ThemeNavbar />
      <div className='min-h-screen' style={{ background: 'var(--bg)', paddingTop: '80px' }}>
        <div className='container' style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center'
          >
            <div className='glass' style={{ padding: '4rem', borderRadius: '2rem', marginBottom: '2rem' }}>
              <Icons.Archive className='w-20 h-20 mx-auto mb-4' style={{ color: 'var(--primary)' }} />
              <h1 className='text-5xl font-bold mb-4' style={{ color: 'var(--text)' }}>
                Digital Product Library
              </h1>
              <p className='text-xl mb-6' style={{ color: 'var(--muted)' }}>
                Access our comprehensive collection of digital ocean research resources
              </p>
              <div className='theme-badge' style={{ display: 'inline-block' }}>
                <Icons.Construction className='w-4 h-4 inline mr-2' />
                Coming Soon - Under Development
              </div>
            </div>
            
            <div className='grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
              {[
                { icon: Icons.Database, title: 'Research Datasets', desc: 'Ocean temperature, currents, and marine life data' },
                { icon: Icons.FileText, title: 'Publications', desc: 'Scientific papers and research reports' },
                { icon: Icons.Code, title: 'Software Tools', desc: 'Analysis software and visualization tools' },
                { icon: Icons.Map, title: 'Interactive Maps', desc: 'Ocean mapping and GIS resources' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className='theme-card'
                  style={{ padding: '2rem', textAlign: 'center' }}
                >
                  <item.icon className='w-12 h-12 mx-auto mb-3' style={{ color: 'var(--accent)' }} />
                  <h3 className='text-xl font-bold mb-2' style={{ color: 'var(--text)' }}>{item.title}</h3>
                  <p style={{ color: 'var(--muted)' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DigitalProductLibrary;
