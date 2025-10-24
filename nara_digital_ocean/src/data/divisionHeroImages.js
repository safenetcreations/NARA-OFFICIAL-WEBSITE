/**
 * Division Hero Images Configuration
 * Curated high-quality images for each division's hero carousel
 * These will rotate automatically on division pages
 */

export const DIVISION_HERO_IMAGES = {
  'environmental-studies': [
    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1920&q=80',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
    'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=1920&q=80'
  ],

  'fishing-technology': [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&q=80',
    'https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=1920&q=80',
    'https://images.unsplash.com/photo-1534213761292-5c2f27f0b7da?w=1920&q=80'
  ],

  'inland-aquaculture': [
    'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=1920&q=80',
    'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=1920&q=80',
    'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6d?w=1920&q=80',
    'https://images.unsplash.com/photo-1520990269108-4f12d4d2b3a6?w=1920&q=80'
  ],

  'post-harvest': [
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920&q=80',
    'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=1920&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&q=80'
  ],

  'marine-biology': [
    'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1920&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&q=80',
    'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1920&q=80'
  ],

  'oceanography': [
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80',
    'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=1920&q=80',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&q=80'
  ],

  'hydrography': [
    'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1920&q=80',
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=1920&q=80',
    'https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=1920&q=80',
    'https://images.unsplash.com/photo-1534213761292-5c2f27f0b7da?w=1920&q=80'
  ],

  'socio-economics': [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&q=80',
    'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1920&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920&q=80'
  ],

  'monitoring-evaluation': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80',
    'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1920&q=80',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1920&q=80'
  ],

  'aquaculture-center': [
    'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=1920&q=80',
    'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=1920&q=80',
    'https://images.unsplash.com/photo-1520990269108-4f12d4d2b3a6?w=1920&q=80',
    'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6d?w=1920&q=80'
  ]
};

/**
 * Get hero images for a division
 * @param {string} divisionId - Division identifier
 * @returns {array} Array of image URLs
 */
export const getDivisionHeroImages = (divisionId) => {
  return DIVISION_HERO_IMAGES[divisionId] || [DIVISION_HERO_IMAGES['environmental-studies'][0]];
};

/**
 * Get random hero image for a division
 * @param {string} divisionId - Division identifier
 * @returns {string} Random image URL
 */
export const getRandomHeroImage = (divisionId) => {
  const images = getDivisionHeroImages(divisionId);
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

export default DIVISION_HERO_IMAGES;

