// Redesigned page wrapper
import React from 'react';
import ThemeNavbar from '../../components/ui/ThemeNavbar';

const Page = () => {
  return (
    <>
      <ThemeNavbar />
      <div style={{ height: '72px' }} />
      <div className='min-h-screen bg-black text-white flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-4'>
            Emergency Response Network
          </h1>
          <p className='text-xl text-gray-400'>Page under redesign - NASA/SpaceX theme</p>
        </div>
      </div>
    </>
  );
};

export default Page;
