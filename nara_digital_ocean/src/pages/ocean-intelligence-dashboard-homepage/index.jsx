import React from 'react';
import ThemeNavbar from '../../components/ui/ThemeNavbar';
import NewHomePage from './NewHomePage';

const OceanIntelligenceDashboardHomepage = () => {
  return (
    <>
      <ThemeNavbar />
      <div style={{ paddingTop: '80px' }}>
        <NewHomePage />
      </div>
    </>
  );
};

export default OceanIntelligenceDashboardHomepage;
