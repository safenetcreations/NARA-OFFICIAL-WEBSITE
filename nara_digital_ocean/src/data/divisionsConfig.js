/**
 * NARA Divisions Configuration
 * Complete data for all 9 core divisions with multilingual support
 */

export const DIVISIONS_CONFIG = [
  {
    id: 'fisheries-science',
    slug: 'marine-inland-fisheries-science',
    icon: 'Fish',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',

    name: {
      en: 'Marine & Inland Fisheries Science',
      si: 'සමුද්‍ර සහ අභ්‍යන්තර මත්ස්‍ය විද්‍යාව',
      ta: 'கடல் மற்றும் உள்நாட்டு மீன்வள அறிவியல்'
    },

    tagline: {
      en: 'Sustainable fisheries through scientific research and data-driven management',
      si: 'විද්‍යාත්මක පර්යේෂණ සහ දත්ත මත පදනම් වූ කළමනාකරණය තුළින් තිරසාර මසුන් ඇල්ලීම',
      ta: 'அறிவியல் ஆராய்ச்சி மற்றும் தரவு சார்ந்த நிர்வாகத்தின் மூலம் நிலையான மீன்பிடித்தல்'
    },

    description: {
      en: 'The Fisheries Science Division conducts comprehensive research on marine and inland fish stocks, providing critical data for sustainable fisheries management. Our work includes stock assessments, pelagic and demersal fish studies, shark conservation planning, and international collaboration through IOTC.',
      si: 'මත්ස්‍ය විද්‍යා අංශය සමුද්‍ර සහ අභ්‍යන්තර මත්ස්‍ය තොග පිළිබඳ විස්තීර්ණ පර්යේෂණ සිදු කරයි, තිරසාර මත්ස්‍ය කළමනාකරණය සඳහා තීරණාත්මක දත්ත සපයයි.',
      ta: 'மீன்வள அறிவியல் பிரிவு கடல் மற்றும் உள்நாட்டு மீன் இருப்பு குறித்து விரிவான ஆராய்ச்சி நடத்துகிறது.'
    },

    heroImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',

    focusAreas: [
      {
        title: {
          en: 'Stock Assessments',
          si: 'තොග තක්සේරු',
          ta: 'பங்கு மதிப்பீடுகள்'
        },
        description: {
          en: 'Scientific evaluation of fish populations to ensure sustainable harvesting levels',
          si: 'තිරසාර අස්වැන්න මට්ටම් සහතික කිරීම සඳහා මත්ස්‍ය ජනගහනයේ විද්‍යාත්මක ඇගයීම',
          ta: 'நிலையான அறுவடை அளவுகளை உறுதிசெய்ய மீன் மக்கள்தொகையின் அறிவியல் மதிப்பீடு'
        },
        icon: 'BarChart'
      },
      {
        title: {
          en: 'Pelagic & Demersal Studies',
          si: 'මුහුදු මත්ස්‍ය අධ්‍යයන',
          ta: 'பெலாஜிக் & டெமர்சல் ஆய்வுகள்'
        },
        description: {
          en: 'Research on open ocean and bottom-dwelling fish species and their ecosystems',
          si: 'විවෘත සාගර සහ තට්ටු මත්ස්‍ය විශේෂ සහ ඒවායේ පරිසර පද්ධති පිළිබඳ පර්යේෂණ',
          ta: 'திறந்த கடல் மற்றும் அடிமட்ட மீன் இனங்கள் மற்றும் அவற்றின் சுற்றுச்சூழல் அமைப்புகள் பற்றிய ஆராய்ச்சி'
        },
        icon: 'Waves'
      },
      {
        title: {
          en: 'Shark Conservation',
          si: 'මෝර සංරක්ෂණය',
          ta: 'சுறா பாதுகாப்பு'
        },
        description: {
          en: 'Development and implementation of shark management and conservation plans',
          si: 'මෝර කළමනාකරණ සහ සංරක්ෂණ සැලසුම් සංවර්ධනය සහ ක්‍රියාත්මක කිරීම',
          ta: 'சுறா மேலாண்மை மற்றும் பாதுகாப்பு திட்டங்களின் வளர்ச்சி மற்றும் செயல்படுத்தல்'
        },
        icon: 'Shield'
      },
      {
        title: {
          en: 'Tuna & IOTC Data',
          si: 'ටූනා සහ IOTC දත්ත',
          ta: 'சூரை & IOTC தரவு'
        },
        description: {
          en: 'Data collection and reporting for Indian Ocean Tuna Commission',
          si: 'ඉන්දියන් සාගර ටූනා කොමිෂන් සභාව සඳහා දත්ත එකතු කිරීම සහ වාර්තා කිරීම',
          ta: 'இந்தியப் பெருங்கடல் சூரை ஆணையத்திற்கான தரவு சேகரிப்பு மற்றும் அறிக்கை'
        },
        icon: 'Database'
      }
    ],

    services: [
      {
        title: { en: 'Stock Assessment Reports', si: 'තොග තක්සේරු වාර්තා', ta: 'பங்கு மதிப்பீடு அறிக்கைகள்' },
        description: { en: 'Comprehensive fish stock assessments for decision-making', si: '', ta: '' }
      },
      {
        title: { en: 'Sustainable Fishing Advice', si: 'තිරසාර මසුන් ඇල්ලීමේ උපදෙස්', ta: 'நிலையான மீன்பிடி ஆலோசனை' },
        description: { en: 'Scientific guidance for sustainable fishing practices', si: '', ta: '' }
      },
      {
        title: { en: 'Data Management Services', si: 'දත්ත කළමනාකරණ සේවා', ta: 'தரவு மேலாண்மை சேவைகள்' },
        description: { en: 'Fisheries data collection and analysis', si: '', ta: '' }
      }
    ],

    contactEmail: 'fisheries@nara.ac.lk',
    contactPhone: '+94 11 2521000',
    location: 'NARA Headquarters, Crow Island, Colombo 15',
    coordinates: { lat: 6.9595, lng: 79.8540 }
  },

  {
    id: 'marine-biology',
    slug: 'marine-biology-ecosystems',
    icon: 'Waves',
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-500',

    name: {
      en: 'Marine Biology & Ecosystems',
      si: 'සමුද්‍ර ජීව විද්‍යාව සහ පරිසර පද්ධති',
      ta: 'கடல் உயிரியல் மற்றும் சுற்றுச்சூழல் அமைப்புகள்'
    },

    tagline: {
      en: 'Protecting marine life and ecosystems for future generations',
      si: 'අනාගත පරම්පරා සඳහා සමුද්‍ර ජීවිතය සහ පරිසර පද්ධති ආරක්ෂා කිරීම',
      ta: 'எதிர்கால சந்ததியினருக்கு கடல் வாழ்க்கை மற்றும் சுற்றுச்சூழல் அமைப்புகளைப் பாதுகாத்தல்'
    },

    description: {
      en: 'Our Marine Biology Division focuses on the conservation and study of marine mammals, coral reefs, seagrass beds, and other critical marine ecosystems. We respond to strandings, conduct environmental forensics for illegal fishing cases, and work to protect Sri Lanka\'s rich marine biodiversity.',
      si: 'අපගේ සමුද්‍ර ජීව විද්‍යා අංශය සමුද්‍ර ක්ෂීරපායින්, කොරල් පර, මුහුදු තණකොළ සහ අනෙකුත් තීරණාත්මක සමුද්‍ර පරිසර පද්ධති සංරක්ෂණය සහ අධ්‍යයනය කෙරෙහි අවධානය යොමු කරයි.',
      ta: 'எங்கள் கடல் உயிரியல் பிரிவு கடல் பாலூட்டிகள், பவளப்பாறைகள், கடற்பாசி படுகைகள் மற்றும் பிற முக்கிய கடல் சுற்றுச்சூழல் அமைப்புகளின் பாதுகாப்பு மற்றும் ஆய்வு மீது கவனம் செலுத்துகிறது.'
    },

    heroImage: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1200',

    focusAreas: [
      {
        title: { en: 'Marine Mammals', si: 'සමුද්‍ර ක්ෂීරපායින්', ta: 'கடல் பாலூட்டிகள்' },
        description: { en: 'Research and conservation of whales, dolphins, and dugongs', si: '', ta: '' },
        icon: 'Fish'
      },
      {
        title: { en: 'Coral Reefs', si: 'කොරල් පර', ta: 'பவளப்பாறைகள்' },
        description: { en: 'Monitoring and restoration of coral reef ecosystems', si: '', ta: '' },
        icon: 'Layers'
      },
      {
        title: { en: 'Seagrass Conservation', si: 'මුහුදු තණකොළ සංරක්ෂණය', ta: 'கடற்பாசி பாதுகாப்பு' },
        description: { en: 'Protection of critical seagrass habitats', si: '', ta: '' },
        icon: 'Leaf'
      },
      {
        title: { en: 'Stranding Response', si: 'ගොඩබෑමට ප්‍රතිචාරය', ta: 'சிக்கல் பதில்' },
        description: { en: '24/7 marine mammal stranding rescue and research', si: '', ta: '' },
        icon: 'AlertCircle'
      },
      {
        title: { en: 'Environmental Forensics', si: 'පාරිසරික අධිකරණ විද්‍යාව', ta: 'சுற்றுச்சூழல் தடயவியல்' },
        description: { en: 'Investigation of illegal fishing and marine crimes', si: '', ta: '' },
        icon: 'Search'
      }
    ],

    services: [
      {
        title: { en: 'Marine Mammal Rescue', si: 'සමුද්‍ර ක්ෂීරපායින් ගලවා ගැනීම', ta: 'கடல் பாலூட்டி மீட்பு' },
        description: { en: 'Emergency response for stranded marine mammals', si: '', ta: '' }
      },
      {
        title: { en: 'Coral Reef Monitoring', si: 'කොරල් පර නිරීක්ෂණය', ta: 'பவளப்பாறை கண்காணிப்பு' },
        description: { en: 'Regular assessments of reef health and biodiversity', si: '', ta: '' }
      },
      {
        title: { en: 'Forensic Analysis', si: 'අධිකරණ විද්‍යා විශ්ලේෂණය', ta: 'தடயவியல் பகுப்பாய்வு' },
        description: { en: 'Scientific evidence for illegal fishing cases', si: '', ta: '' }
      }
    ],

    contactEmail: 'marinebio@nara.ac.lk',
    contactPhone: '+94 11 2521001',
    location: 'NARA Marine Laboratory, Colombo'
  },

  {
    id: 'aquaculture',
    slug: 'inland-aquatic-aquaculture',
    icon: 'Droplet',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',

    name: {
      en: 'Inland Aquatic Resources & Aquaculture',
      si: 'අභ්‍යන්තර ජලජ සම්පත් සහ ජලජ වගාව',
      ta: 'உள்நாட்டு நீர்வள வளங்கள் மற்றும் மீன் வளர்ப்பு'
    },

    tagline: {
      en: 'Advancing aquaculture technology for food security and livelihoods',
      si: 'ආහාර සුරක්ෂිතභාවය සහ ජීවනෝපාය සඳහා ජලජ වගා තාක්ෂණය ප්‍රවර්ධනය කිරීම',
      ta: 'உணவு பாதுகாப்பு மற்றும் வாழ்வாதாரத்திற்கான மீன் வளர்ப்பு தொழில்நுட்பத்தை முன்னேற்றுதல்'
    },

    description: {
      en: 'The Aquaculture Division develops sustainable aquaculture technologies for ornamental fish, shrimp, sea bass, sea cucumber, seaweed cultivation, and aquatic plant tissue culture. We provide training, technical support, and breeding technologies to farmers and entrepreneurs.',
      si: 'ජලජ වගා අංශය විසින් විසිතුරු මත්ස්‍යයන්, ඉස්සන්, මුහුදු බාස්, මුහුදු පිපිඤ්ඤා, මුහුදු පැලෑටි වගාව සහ ජලජ ශාක පටක සංස්කෘතිය සඳහා තිරසාර ජලජ වගා තාක්ෂණයන් සංවර්ධනය කරයි.',
      ta: 'மீன் வளர்ப்பு பிரிவு அலங்கார மீன், இறால், கடல் பாஸ், கடல் வெள்ளரி, கடல்பாசி சாகுபடி மற்றும் நீர்வள தாவர திசு வளர்ப்பு ஆகியவற்றுக்கான நிலையான மீன் வளர்ப்பு தொழில்நுட்பங்களை உருவாக்குகிறது.'
    },

    heroImage: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=1200',

    focusAreas: [
      {
        title: { en: 'Ornamental Fish Breeding', si: 'විසිතුරු මත්ස්‍ය අභිජනනය', ta: 'அலங்கார மீன் இனப்பெருக்கம்' },
        description: { en: 'Breeding technology for export-quality ornamental fish', si: '', ta: '' },
        icon: 'Fish'
      },
      {
        title: { en: 'Shrimp & Sea Bass', si: 'ඉස්සන් සහ මුහුදු බාස්', ta: 'இறால் மற்றும் கடல் பாஸ்' },
        description: { en: 'Commercial farming techniques and hatchery management', si: '', ta: '' },
        icon: 'Waves'
      },
      {
        title: { en: 'Sea Cucumber & Seaweed', si: 'මුහුදු පිපිඤ්ඤා සහ මුහුදු පැලෑටි', ta: 'கடல் வெள்ளரி மற்றும் கடல்பாசி' },
        description: { en: 'Cultivation methods for high-value marine products', si: '', ta: '' },
        icon: 'Leaf'
      },
      {
        title: { en: 'Tissue Culture', si: 'පටක සංස්කෘතිය', ta: 'திசு வளர்ப்பு' },
        description: { en: 'Advanced aquatic plant tissue culture techniques', si: '', ta: '' },
        icon: 'Microscope'
      }
    ],

    services: [
      {
        title: { en: 'Aquaculture Training', si: 'ජලජ වගා පුහුණුව', ta: 'மீன் வளர்ப்பு பயிற்சி' },
        description: { en: 'Comprehensive training programs for farmers', si: '', ta: '' }
      },
      {
        title: { en: 'Breeding Technology', si: 'අභිජනනය තාක්ෂණය', ta: 'இனப்பெருக்க தொழில்நுட்பம்' },
        description: { en: 'Advanced breeding techniques and protocols', si: '', ta: '' }
      },
      {
        title: { en: 'Hatchery Consultation', si: 'තැටි කේන්ද්‍ර උපදේශනය', ta: 'குஞ்சு பொரிப்பகம் ஆலோசனை' },
        description: { en: 'Expert guidance for hatchery setup and operations', si: '', ta: '' }
      }
    ],

    contactEmail: 'aquaculture@nara.ac.lk',
    contactPhone: '+94 11 2521002',
    location: 'Aquaculture Research Station, Dambulla'
  },

  {
    id: 'fishing-technology',
    slug: 'fishing-technology',
    icon: 'Anchor',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500',

    name: {
      en: 'Fishing Technology',
      si: 'මසුන් ඇල්ලීමේ තාක්ෂණය',
      ta: 'மீன்பிடி தொழில்நுட்பம்'
    },

    tagline: {
      en: 'Innovative fishing gear and methods for sustainable harvesting',
      si: 'තිරසාර අස්වැන්න සඳහා නව්‍ය මසුන් ඇල්ලීමේ උපකරණ සහ ක්‍රම',
      ta: 'நிலையான அறுவடைக்கான புதுமையான மீன்பிடி கருவிகள் மற்றும் முறைகள்'
    },

    description: {
      en: 'The Fishing Technology Division develops and tests innovative fishing gears and methods that reduce bycatch, minimize environmental impact, and improve fishing efficiency. We work on acoustic pingers to reduce marine mammal interactions and provide technical support to the fishing industry.',
      si: 'මසුන් ඇල්ලීමේ තාක්ෂණ අංශය විසින් අතුරු ඇල්ලීම අඩු කරන, පාරිසරික බලපෑම අවම කරන සහ මසුන් ඇල්ලීමේ කාර්යක්ෂමතාව වැඩි දියුණු කරන නව්‍ය මසුන් ඇල්ලීමේ උපකරණ සහ ක්‍රම සංවර්ධනය කර පරීක්ෂා කරයි.',
      ta: 'மீன்பிடி தொழில்நுட்ப பிரிவு துணை பிடிப்பைக் குறைக்கும், சுற்றுச்சூழல் தாக்கத்தைக் குறைக்கும் மற்றும் மீன்பிடி திறனை மேம்படுத்தும் புதுமையான மீன்பிடி கருவிகள் மற்றும் முறைகளை உருவாக்கி சோதிக்கிறது.'
    },

    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',

    focusAreas: [
      {
        title: { en: 'Gear Development', si: 'උපකරණ සංවර්ධනය', ta: 'கருவி மேம்பாடு' },
        description: { en: 'Design and testing of innovative fishing gear', si: '', ta: '' },
        icon: 'Settings'
      },
      {
        title: { en: 'Bycatch Mitigation', si: 'අතුරු ඇල්ලීම අවම කිරීම', ta: 'துணை பிடிப்பு தணிப்பு' },
        description: { en: 'Technologies to reduce unwanted catch', si: '', ta: '' },
        icon: 'Shield'
      },
      {
        title: { en: 'Acoustic Pingers', si: 'ශබ්ද සංඥා යන්ත්‍ර', ta: 'ஒலி சமிக்ஞை சாதனங்கள்' },
        description: { en: 'Acoustic devices to reduce marine mammal interactions', si: '', ta: '' },
        icon: 'Radio'
      },
      {
        title: { en: 'Sustainable Methods', si: 'තිරසාර ක්‍රම', ta: 'நிலையான முறைகள்' },
        description: { en: 'Environmentally friendly fishing techniques', si: '', ta: '' },
        icon: 'Leaf'
      }
    ],

    services: [
      {
        title: { en: 'Gear Testing', si: 'උපකරණ පරීක්ෂණය', ta: 'கருவி சோதனை' },
        description: { en: 'Scientific testing of fishing gear performance', si: '', ta: '' }
      },
      {
        title: { en: 'Technology Transfer', si: 'තාක්ෂණ හුවමාරුව', ta: 'தொழில்நுட்ப பரிமாற்றம்' },
        description: { en: 'Training on new fishing technologies', si: '', ta: '' }
      },
      {
        title: { en: 'Design Consultation', si: 'නිර්මාණ උපදේශනය', ta: 'வடிவமைப்பு ஆலோசனை' },
        description: { en: 'Custom gear design for specific needs', si: '', ta: '' }
      }
    ],

    contactEmail: 'fishtech@nara.ac.lk',
    contactPhone: '+94 11 2521003',
    location: 'Fishing Technology Center, Galle'
  },

  {
    id: 'quality-assurance',
    slug: 'post-harvest-quality',
    icon: 'Award',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',

    name: {
      en: 'Post-Harvest & Quality Assurance',
      si: 'අස්වැන්න පසු හා ගුණාත්මක සහතික කිරීම',
      ta: 'அறுவடைக்கு பிந்தைய & தர உத்தரவாதம்'
    },

    tagline: {
      en: 'ISO/IEC 17025 accredited testing for export quality seafood',
      si: 'අපනයන ගුණාත්මක මුහුදු ආහාර සඳහා ISO/IEC 17025 පිළිගත් පරීක්ෂණ',
      ta: 'ஏற்றுமதி தர கடல் உணவுக்கான ISO/IEC 17025 அங்கீகரிக்கப்பட்ட சோதனை'
    },

    description: {
      en: 'Our ISO/IEC 17025 accredited laboratories provide comprehensive testing services including microbiology, histamine analysis, chemical residues, and quality certification. We offer industry training programs and ensure Sri Lankan seafood meets international quality standards.',
      si: 'අපගේ ISO/IEC 17025 පිළිගත් රසායනාගාර ක්ෂුද්‍ර ජීව විද්‍යාව, හිස්ටමින් විශ්ලේෂණය, රසායනික අවශේෂ සහ ගුණාත්මක සහතික කිරීම ඇතුළු විස්තීර්ණ පරීක්ෂණ සේවා සපයයි.',
      ta: 'எங்கள் ISO/IEC 17025 அங்கீகரிக்கப்பட்ட ஆய்வகங்கள் நுண்ணுயிரியல், ஹிஸ்டமைன் பகுப்பாய்வு, இரசாயன எச்சங்கள் மற்றும் தர சான்றிதழ் உட்பட விரிவான சோதனை சேவைகளை வழங்குகின்றன.'
    },

    heroImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200',

    focusAreas: [
      {
        title: { en: 'Microbiological Testing', si: 'ක්ෂුද්‍ර ජීව විද්‍යා පරීක්ෂණ', ta: 'நுண்ணுயிரியல் சோதனை' },
        description: { en: 'Detection of bacteria and pathogens in seafood', si: '', ta: '' },
        icon: 'Microscope'
      },
      {
        title: { en: 'Histamine Analysis', si: 'හිස්ටමින් විශ්ලේෂණය', ta: 'ஹிஸ்டமைன் பகுப்பாய்வு' },
        description: { en: 'Critical testing for fish decomposition indicators', si: '', ta: '' },
        icon: 'Activity'
      },
      {
        title: { en: 'Chemical Residues', si: 'රසායනික අවශේෂ', ta: 'இரசாயன எச்சங்கள்' },
        description: { en: 'Testing for heavy metals and contaminants', si: '', ta: '' },
        icon: 'Droplet'
      },
      {
        title: { en: 'Industry Training', si: 'කර්මාන්ත පුහුණුව', ta: 'தொழில் பயிற்சி' },
        description: { en: 'Quality management training for seafood processors', si: '', ta: '' },
        icon: 'GraduationCap'
      }
    ],

    services: [
      {
        title: { en: 'Laboratory Testing', si: 'රසායනාගාර පරීක්ෂණ', ta: 'ஆய்வக சோதனை' },
        description: { en: 'Comprehensive microbiological and chemical testing', si: '', ta: '' }
      },
      {
        title: { en: 'Quality Certification', si: 'ගුණාත්මක සහතික කිරීම', ta: 'தர சான்றிதழ்' },
        description: { en: 'Export quality certificates for seafood products', si: '', ta: '' }
      },
      {
        title: { en: 'HACCP Training', si: 'HACCP පුහුණුව', ta: 'HACCP பயிற்சி' },
        description: { en: 'Food safety management system training', si: '', ta: '' }
      }
    ],

    contactEmail: 'quality@nara.ac.lk',
    contactPhone: '+94 11 2521004',
    location: 'NARA Quality Assurance Laboratory, Colombo'
  },

  {
    id: 'socio-economics',
    slug: 'socio-economics-marketing',
    icon: 'TrendingUp',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',

    name: {
      en: 'Socio-Economics & Marketing',
      si: 'සමාජ-ආර්ථික විද්‍යාව සහ අලෙවිකරණය',
      ta: 'சமூக-பொருளாதாரம் & சந்தைப்படுத்தல்'
    },

    tagline: {
      en: 'Empowering fishing communities through economic research and market development',
      si: 'ආර්ථික පර්යේෂණ සහ වෙළඳපල සංවර්ධනය තුළින් ධීවර ප්‍රජාවන් සවිබල ගැන්වීම',
      ta: 'பொருளாதார ஆராய்ச்சி மற்றும் சந்தை மேம்பாடு மூலம் மீன்பிடி சமூகங்களுக்கு அதிகாரம் அளித்தல்'
    },

    description: {
      en: 'The Socio-Economics Division conducts research on fisheries economics, market trends, value chain analysis, and fisher welfare. We provide industry outlook reports, market intelligence, and policy recommendations to improve livelihoods and sustainable development of fishing communities.',
      si: 'සමාජ-ආර්ථික අංශය මත්ස්‍ය ආර්ථික විද්‍යාව, වෙළඳපල ප්‍රවණතා, වටිනාකම් දාම විශ්ලේෂණය සහ ධීවර සුභසාධනය පිළිබඳ පර්යේෂණ සිදු කරයි.',
      ta: 'சமூக-பொருளாதார பிரிவு மீன்வள பொருளாதாரம், சந்தை போக்குகள், மதிப்பு சங்கிலி பகுப்பாய்வு மற்றும் மீனவர் நலன் பற்றிய ஆராய்ச்சியை நடத்துகிறது.'
    },

    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',

    focusAreas: [
      {
        title: { en: 'Industry Outlook', si: 'කර්මාන්ත දැක්ම', ta: 'தொழில் கண்ணோட்டம்' },
        description: { en: 'Economic analysis and forecasting for fisheries sector', si: '', ta: '' },
        icon: 'TrendingUp'
      },
      {
        title: { en: 'Value Chain Analysis', si: 'වටිනාකම් දාම විශ්ලේෂණය', ta: 'மதிப்பு சங்கிலி பகுப்பாய்வு' },
        description: { en: 'Mapping and optimization of fisheries value chains', si: '', ta: '' },
        icon: 'GitBranch'
      },
      {
        title: { en: 'Fisher Welfare', si: 'ධීවර සුභසාධනය', ta: 'மீனவர் நலன்' },
        description: { en: 'Research on fisher livelihoods and social development', si: '', ta: '' },
        icon: 'Heart'
      },
      {
        title: { en: 'Market Intelligence', si: 'වෙළඳපල බුද්ධිය', ta: 'சந்தை புத்திசாலித்தனம்' },
        description: { en: 'Market trends and pricing analysis', si: '', ta: '' },
        icon: 'PieChart'
      }
    ],

    services: [
      {
        title: { en: 'Market Research', si: 'වෙළඳපල පර්යේෂණ', ta: 'சந்தை ஆராய்ச்சி' },
        description: { en: 'Comprehensive market analysis and reports', si: '', ta: '' }
      },
      {
        title: { en: 'Economic Impact Studies', si: 'ආර්ථික බලපෑම් අධ්‍යයන', ta: 'பொருளாதார தாக்க ஆய்வுகள்' },
        description: { en: 'Assessment of fisheries policies and interventions', si: '', ta: '' }
      },
      {
        title: { en: 'Community Development', si: 'ප්‍රජා සංවර්ධනය', ta: 'சமூக மேம்பாடு' },
        description: { en: 'Support for fishing community development projects', si: '', ta: '' }
      }
    ],

    contactEmail: 'socioeco@nara.ac.lk',
    contactPhone: '+94 11 2521005',
    location: 'NARA Socio-Economics Unit, Colombo'
  },

  {
    id: 'hydrography',
    slug: 'hydrography-nautical-charts',
    icon: 'Map',
    color: 'sky',
    gradient: 'from-sky-500 to-blue-500',

    name: {
      en: 'Hydrography & Nautical Charts',
      si: 'ජල මිතීම සහ සමුද්‍ර සිතියම්',
      ta: 'நீர்வியல் & கடல்சார் வரைபடங்கள்'
    },

    tagline: {
      en: 'Precise nautical charts for safe navigation in Sri Lankan waters',
      si: 'ශ්‍රී ලංකා ජලයේ ආරක්ෂිත යාත්‍රා කිරීම සඳහා නිරවද්‍ය සමුද්‍ර සිතියම්',
      ta: 'இலங்கை நீரில் பாதுகாப்பான வழிசெலுத்தலுக்கான துல்லியமான கடல்சார் வரைபடங்கள்'
    },

    description: {
      en: 'The Hydrography Division produces Electronic Navigational Charts (ENCs), conducts bathymetric surveys, and maps coastal and harbour areas. We contribute to international initiatives like GEBCO and Seabed 2030, providing critical data for safe maritime navigation and ocean management.',
      si: 'ජල මිතීම් අංශය විසින් ඉලෙක්ට්‍රොනික යාත්‍රා සිතියම් (ENCs) නිෂ්පාදනය කරයි, ගැඹුරු මිතීමේ සමීක්ෂණ පවත්වයි, සහ වෙරළ සහ වරාය ප්‍රදේශ සිතියම්ගත කරයි.',
      ta: 'நீர்வியல் பிரிவு மின்னணு வழிசெலுத்தல் வரைபடங்களை (ENCs) தயாரிக்கிறது, குளிர்நீர் ஆய்வுகளை நடத்துகிறது மற்றும் கடலோர மற்றும் துறைமுக பகுதிகளை வரைபடமாக்குகிறது.'
    },

    heroImage: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1200',

    focusAreas: [
      {
        title: { en: 'Electronic Charts (ENCs)', si: 'ඉලෙක්ට්‍රොනික සිතියම්', ta: 'மின்னணு வரைபடங்கள்' },
        description: { en: 'Production of S-57/S-100 standard nautical charts', si: '', ta: '' },
        icon: 'Map'
      },
      {
        title: { en: 'Bathymetric Surveys', si: 'ගැඹුරු මිතීමේ සමීක්ෂණ', ta: 'குளிர்நீர் ஆய்வுகள்' },
        description: { en: 'Seafloor mapping and depth measurements', si: '', ta: '' },
        icon: 'Layers'
      },
      {
        title: { en: 'Harbour Surveys', si: 'වරාය සමීක්ෂණ', ta: 'துறைமுக ஆய்வுகள்' },
        description: { en: 'Detailed surveys of ports and harbours', si: '', ta: '' },
        icon: 'Anchor'
      },
      {
        title: { en: 'GEBCO/Seabed 2030', si: 'GEBCO/සමුද්‍ර පත්ල 2030', ta: 'GEBCO/கடற்பரப்பு 2030' },
        description: { en: 'Contribution to global ocean mapping initiatives', si: '', ta: '' },
        icon: 'Globe'
      }
    ],

    services: [
      {
        title: { en: 'Chart Production', si: 'සිතියම් නිෂ්පාදනය', ta: 'வரைபட தயாரிப்பு' },
        description: { en: 'Custom nautical charts for specific areas', si: '', ta: '' }
      },
      {
        title: { en: 'Bathymetry Data', si: 'ගැඹුරු දත්ත', ta: 'குளிர்நீர் தரவு' },
        description: { en: 'Seafloor depth data for research and planning', si: '', ta: '' }
      },
      {
        title: { en: 'Chart Updates', si: 'සිතියම් යාවත්කාලීන', ta: 'வரைபட புதுப்பிப்புகள்' },
        description: { en: 'Regular updates to navigational charts', si: '', ta: '' }
      }
    ],

    contactEmail: 'hydrography@nara.ac.lk',
    contactPhone: '+94 11 2521006',
    location: 'Hydrographic Office, Colombo'
  },

  {
    id: 'environmental-monitoring',
    slug: 'environmental-monitoring-advisory',
    icon: 'AlertCircle',
    color: 'green',
    gradient: 'from-green-500 to-teal-500',

    name: {
      en: 'Environmental Monitoring & Advisory',
      si: 'පාරිසරික නිරීක්ෂණ සහ උපදේශන',
      ta: 'சுற்றுச்சூழல் கண்காணிப்பு & ஆலோசனை'
    },

    tagline: {
      en: 'Protecting marine environments through monitoring and rapid response',
      si: 'නිරීක්ෂණ සහ වේගවත් ප්‍රතිචාරය තුළින් සමුද්‍ර පරිසරය ආරක්ෂා කිරීම',
      ta: 'கண்காணிப்பு மற்றும் விரைவான பதில் மூலம் கடல் சூழல்களைப் பாதுகாத்தல்'
    },

    description: {
      en: 'Our Environmental Monitoring Division provides water quality testing, algal bloom monitoring, and rapid incident response services. We operate RV Samudrika for ocean research and conducted extensive post-incident surveys after the X-Press Pearl disaster.',
      si: 'අපගේ පාරිසරික නිරීක්ෂණ අංශය ජල ගුණාත්මක පරීක්ෂණ, ඇල්ගී පිපීම නිරීක්ෂණය සහ වේගවත් සිදුවීම් ප්‍රතිචාර සේවා සපයයි.',
      ta: 'எங்கள் சுற்றுச்சூழல் கண்காணிப்பு பிரிவு நீர் தர சோதனை, பாசி பூக்கும் கண்காணிப்பு மற்றும் விரைவான சம்பவ பதில் சேவைகளை வழங்குகிறது.'
    },

    heroImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200',

    focusAreas: [
      {
        title: { en: 'Water Quality', si: 'ජල ගුණාත්මකභාවය', ta: 'நீர் தரம்' },
        description: { en: 'Continuous monitoring of coastal and ocean water quality', si: '', ta: '' },
        icon: 'Droplet'
      },
      {
        title: { en: 'Algal Blooms', si: 'ඇල්ගී පිපීම', ta: 'பாசி பூக்கள்' },
        description: { en: 'Detection and tracking of harmful algal blooms', si: '', ta: '' },
        icon: 'AlertTriangle'
      },
      {
        title: { en: 'Incident Response', si: 'සිදුවීම් ප්‍රතිචාරය', ta: 'சம்பவ பதில்' },
        description: { en: '24/7 emergency response for marine incidents', si: '', ta: '' },
        icon: 'AlertCircle'
      },
      {
        title: { en: 'RV Samudrika', si: 'RV සමුද්‍රිකා', ta: 'RV சமுத்ரிகா' },
        description: { en: 'Research vessel operations and ocean surveys', si: '', ta: '' },
        icon: 'Ship'
      }
    ],

    services: [
      {
        title: { en: 'Water Testing', si: 'ජල පරීක්ෂණ', ta: 'நீர் சோதனை' },
        description: { en: 'Comprehensive water quality analysis', si: '', ta: '' }
      },
      {
        title: { en: 'Environmental Impact Assessment', si: 'පාරිසරික බලපෑම් තක්සේරුව', ta: 'சுற்றுச்சூழல் தாக்க மதிப்பீடு' },
        description: { en: 'EIA services for marine development projects', si: '', ta: '' }
      },
      {
        title: { en: 'Research Cruises', si: 'පර්යේෂණ නැව් ගමන්', ta: 'ஆராய்ச்சி பயணங்கள்' },
        description: { en: 'Scientific cruises aboard RV Samudrika', si: '', ta: '' }
      }
    ],

    contactEmail: 'environment@nara.ac.lk',
    contactPhone: '+94 11 2521007',
    location: 'Environmental Monitoring Center, Colombo'
  },

  {
    id: 'information-outreach',
    slug: 'information-outreach',
    icon: 'BookOpen',
    color: 'amber',
    gradient: 'from-amber-500 to-yellow-500',

    name: {
      en: 'Information & Outreach',
      si: 'තොරතුරු සහ ප්‍රචාරණය',
      ta: 'தகவல் & விரிவாக்கம்'
    },

    tagline: {
      en: 'Sharing knowledge and fostering scientific collaboration',
      si: 'දැනුම බෙදා හැරීම සහ විද්‍යාත්මක සහයෝගීතාව වර්ධනය කිරීම',
      ta: 'அறிவைப் பகிர்தல் மற்றும் அறிவியல் ஒத்துழைப்பை வளர்த்தல்'
    },

    description: {
      en: 'The Information & Outreach Division manages the NARA Journal, organizes scientific sessions, coordinates training programs, and operates regional research centers. We disseminate research findings, facilitate knowledge exchange, and support capacity building in marine sciences.',
      si: 'තොරතුරු සහ ප්‍රචාරණ අංශය NARA සඟරාව කළමනාකරණය කරයි, විද්‍යාත්මක සැසි සංවිධානය කරයි, පුහුණු වැඩසටහන් සම්බන්ධීකරණය කරයි, සහ කලාපීය පර්යේෂණ මධ්‍යස්ථාන ක්‍රියාත්මක කරයි.',
      ta: 'தகவல் & விரிவாக்க பிரிவு NARA பத்திரிகையை நிர்வகிக்கிறது, அறிவியல் அமர்வுகளை ஒழுங்கமைக்கிறது, பயிற்சி திட்டங்களை ஒருங்கிணைக்கிறது மற்றும் பிராந்திய ஆராய்ச்சி மையங்களை இயக்குகிறது.'
    },

    heroImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200',

    focusAreas: [
      {
        title: { en: 'NARA Journal', si: 'NARA සඟරාව', ta: 'NARA பத்திரிகை' },
        description: { en: 'Peer-reviewed scientific journal publication', si: '', ta: '' },
        icon: 'BookOpen'
      },
      {
        title: { en: 'Scientific Sessions', si: 'විද්‍යාත්මක සැසි', ta: 'அறிவியல் அமர்வுகள்' },
        description: { en: 'Annual conferences and research presentations', si: '', ta: '' },
        icon: 'Users'
      },
      {
        title: { en: 'Training Programs', si: 'පුහුණු වැඩසටහන්', ta: 'பயிற்சி திட்டங்கள்' },
        description: { en: 'Capacity building workshops and courses', si: '', ta: '' },
        icon: 'GraduationCap'
      },
      {
        title: { en: 'Regional Centers', si: 'කලාපීය මධ්‍යස්ථාන', ta: 'பிராந்திய மையங்கள்' },
        description: { en: 'Network of research and outreach centers', si: '', ta: '' },
        icon: 'MapPin'
      }
    ],

    services: [
      {
        title: { en: 'Journal Publication', si: 'සඟරා ප්‍රකාශන', ta: 'பத்திரிகை வெளியீடு' },
        description: { en: 'Publish research in NARA Journal', si: '', ta: '' }
      },
      {
        title: { en: 'Library Services', si: 'පුස්තකාල සේවා', ta: 'நூலக சேவைகள்' },
        description: { en: 'Access to marine science literature', si: '', ta: '' }
      },
      {
        title: { en: 'Training Workshops', si: 'පුහුණු වැඩමුළු', ta: 'பயிற்சி பணிமனைகள்' },
        description: { en: 'Specialized training in marine sciences', si: '', ta: '' }
      }
    ],

    contactEmail: 'info@nara.ac.lk',
    contactPhone: '+94 11 2521008',
    location: 'NARA Information Center, Colombo'
  }
];

/**
 * Get division by ID
 */
export const getDivisionById = (id) => {
  return DIVISIONS_CONFIG.find(div => div.id === id);
};

/**
 * Get division by slug
 */
export const getDivisionBySlug = (slug) => {
  return DIVISIONS_CONFIG.find(div => div.slug === slug);
};

/**
 * Get all division IDs
 */
export const getAllDivisionIds = () => {
  return DIVISIONS_CONFIG.map(div => div.id);
};

/**
 * Get all division slugs for routing
 */
export const getAllDivisionSlugs = () => {
  return DIVISIONS_CONFIG.map(div => div.slug);
};

export default DIVISIONS_CONFIG;
