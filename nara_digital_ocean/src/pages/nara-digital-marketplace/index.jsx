// Redesigned Digital Marketplace page with NASA/SpaceX theme
import React from 'react';
import ThemeNavbar from '../../components/ui/ThemeNavbar';
import DigitalMarketplaceRedesign from './DigitalMarketplaceRedesign';

const Page = () => {
  return (
    <>
      <ThemeNavbar />
      <div style={{ paddingTop: '80px' }}>
        <DigitalMarketplaceRedesign />
      </div>
    </>
  );
};

export default Page;
