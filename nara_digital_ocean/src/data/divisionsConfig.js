/**
 * NARA Divisions Configuration
 * Complete data for all 10 core divisions with multilingual support and PDF resources
 */

export const DIVISIONS_CONFIG = [
  {
    id: 'environmental-studies',
    slug: 'environmental-studies-division',
    icon: 'Leaf',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',

    name: {
      en: 'Environmental Studies Division (ESD)',
      si: 'පාරිසරික අධ්‍යයන අංශය (ESD)',
      ta: 'சுற்றுச்சூழல் ஆய்வு பிரிவு (ESD)'
    },

    tagline: {
      en: 'Monitoring and protecting marine ecosystems for sustainable development',
      si: 'තිරසාර සංවර්ධනය සඳහා සමුද්‍ර පරිසර පද්ධති නිරීක්ෂණය සහ ආරක්ෂා කිරීම',
      ta: 'நிலையான வளர்ச்சிக்காக கடல் சுற்றுச்சூழல் அமைப்புகளை கண்காணித்தல் மற்றும் பாதுகாத்தல்'
    },

    description: {
      en: 'The Environmental Studies Division conducts comprehensive environmental monitoring, water quality assessments, and marine ecosystem protection programs to ensure sustainable use of ocean resources.',
      si: 'පාරිසරික අධ්‍යයන අංශය සමුද්‍ර සම්පත් තිරසාර භාවිතය සහතික කිරීම සඳහා විස්තීර්ණ පාරිසරික නිරීක්ෂණ, ජල ගුණාත්මක තක්සේරු සහ සමුද්‍ර පරිසර පද්ධති ආරක්ෂණ වැඩසටහන් සිදු කරයි.',
      ta: 'சுற்றுச்சூழல் ஆய்வு பிரிவு கடல் வளங்களின் நிலையான பயன்பாட்டை உறுதிசெய்ய விரிவான சுற்றுச்சூழல் கண்காணிப்பு, நீர் தர மதிப்பீடுகள் மற்றும் கடல் சுற்றுச்சூழல் அமைப்பு பாதுகாப்பு திட்டங்களை நடத்துகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Environmental-Studies-Division.pdf',
      path: '/pdfs/divisions/NARA-Environmental-Studies-Division.pdf',
      pages: 5,
      sizeKB: 101,
      description: {
        en: 'Comprehensive overview of environmental monitoring, water quality assessment, and ecosystem protection programs',
        si: 'පාරිසරික නිරීක්ෂණ, ජල ගුණාත්මක තක්සේරුව සහ පරිසර පද්ධති ආරක්ෂණ වැඩසටහන්වල සවිස්තරාත්මක දළ විශ්ලේෂණය',
        ta: 'சுற்றுச்சூழல் கண்காணிப்பு, நீர் தர மதிப்பீடு மற்றும் சுற்றுச்சூழல் அமைப்பு பாதுகாப்பு திட்டங்களின் விரிவான கண்ணோட்டம்'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200',

    focusAreas: [
      {
        title: { en: 'Water Quality Monitoring', si: 'ජල ගුණාත්මක නිරීක්ෂණය', ta: 'நீர் தர கண்காணிப்பு' },
        description: { 
          en: 'Continuous monitoring of coastal and ocean water quality parameters including pH, salinity, dissolved oxygen, nutrients, and pollution indicators across 25 monitoring stations',
          si: 'pH, ලවණතාව, විසුරුවා හරින ලද ඔක්සිජන්, පෝෂක සහ දූෂණ දර්ශක ඇතුළුව වෙරළ සහ සාගර ජල ගුණාත්මක පරාමිති 25 නිරීක්ෂණ මධ්‍යස්ථාන හරහා අඛණ්ඩව නිරීක්ෂණය කිරීම',
          ta: 'pH, உப்புத்தன்மை, கரைந்த ஆக்ஸிஜன், ஊட்டச்சத்துக்கள் மற்றும் மாசுபாடு குறிகாட்டிகள் உட்பட கடலோர மற்றும் கடல் நீர் தர அளவுருக்களை 25 கண்காணிப்பு நிலையங்களில் தொடர்ச்சியாக கண்காணித்தல்'
        },
        icon: 'Droplet'
      },
      {
        title: { en: 'Ecosystem Protection', si: 'පරිසර පද්ධති ආරක්ෂණය', ta: 'சுற்றுச்சூழல் அமைப்பு பாதுகாப்பு' },
        description: { 
          en: 'Conservation of marine biodiversity, coral reefs, seagrass beds, and critical coastal habitats through monitoring, restoration, and protection programs',
          si: 'නිරීක්ෂණ, ප්‍රතිසංස්කරණ සහ ආරක්ෂණ වැඩසටහන් හරහා සමුද්‍ර ජෛව විවිධත්වය, කොරල් පර, මුහුදු තණකොළ සහ තීරණාත්මක වෙරළ වාසස්ථාන සංරක්ෂණය කිරීම',
          ta: 'கண்காணிப்பு, மறுசீரமைப்பு மற்றும் பாதுகாப்பு திட்டங்கள் மூலம் கடல் பல்லுயிர், பவளப்பாறைகள், கடற்பாசி படுகைகள் மற்றும் முக்கியமான கடலோர வாழ்விடங்களைப் பாதுகாத்தல்'
        },
        icon: 'Shield'
      },
      {
        title: { en: 'Environmental Impact Assessment', si: 'පාරිසරික බලපෑම් තක්සේරුව', ta: 'சுற்றுச்சூழல் தாக்க மதிப்பீடு' },
        description: { 
          en: 'Scientific assessment of development project impacts on marine ecosystems, providing expert recommendations for sustainable coastal development and marine spatial planning',
          si: 'තිරසාර වෙරළ සංවර්ධනය සහ සමුද්‍ර අවකාශ සැලසුම්කරණය සඳහා ප්‍රවීණ නිර්දේශ සපයමින් සමුද්‍ර පරිසර පද්ධති මත සංවර්ධන ව්‍යාපෘති බලපෑම් විද්‍යාත්මකව තක්සේරු කිරීම',
          ta: 'நிலையான கடலோர மேம்பாடு மற்றும் கடல் இட திட்டமிடலுக்கான நிபுணர் பரிந்துரைகளை வழங்கி, கடல் சுற்றுச்சூழல் அமைப்புகளில் மேம்பாட்டு திட்ட தாக்கங்களின் அறிவியல் மதிப்பீடு'
        },
        icon: 'FileText'
      },
      {
        title: { en: 'Marine Pollution Control', si: 'සමුද්‍ර දූෂණ පාලනය', ta: 'கடல் மாசுபாடு கட்டுப்பாடு' },
        description: {
          en: 'Monitoring and mitigation of plastic pollution, oil spills, heavy metal contamination, and harmful algal blooms with rapid response capabilities',
          si: 'ප්ලාස්ටික් දූෂණය, තෙල් කාන්දු, බැර ලෝහ දූෂණය සහ හානිකර ඇල්ගී පිපීම් වේගවත් ප්‍රතිචාර හැකියාවන් සමඟ නිරීක්ෂණය සහ අවම කිරීම',
          ta: 'பிளாஸ்டிக் மாசுபாடு, எண்ணெய் கசிவுகள், கனரக உலோக மாசுபாடு மற்றும் தீங்கு விளைவிக்கும் பாசி மலர்ச்சியை விரைவான பதில் திறன்களுடன் கண்காணித்தல் மற்றும் தணித்தல்'
        },
        icon: 'AlertTriangle'
      },
      {
        title: { en: 'Climate Change Research', si: 'දේශගුණ විපර්යාස පර්යේෂණ', ta: 'காலநிலை மாற்ற ஆராய்ச்சி' },
        description: {
          en: 'Long-term monitoring of ocean temperature, sea level rise, ocean acidification, and climate impacts on marine ecosystems and coastal communities',
          si: 'සාගර උෂ්ණත්වය, මුහුදු මට්ටම ඉහළ යාම, සාගර ආම්ලීකරණය සහ සමුද්‍ර පරිසර පද්ධති සහ වෙරළ ප්‍රජාවන් කෙරෙහි දේශගුණ බලපෑම් දිගුකාලීනව නිරීක්ෂණය කිරීම',
          ta: 'கடல் வெப்பநிலை, கடல் மட்ட உயர்வு, கடல் அமிலமயமாக்கல் மற்றும் கடல் சுற்றுச்சூழல் அமைப்புகள் மற்றும் கடலோர சமூகங்கள் மீதான காலநிலை தாக்கங்களை நீண்ட கால கண்காணிப்பு'
        },
        icon: 'CloudRain'
      }
    ],

    services: [
      {
        title: { en: 'Water Quality Testing Services', si: 'ජල ගුණාත්මක පරීක්ෂණ සේවා', ta: 'நீர் தர சோதனை சேவைகள்' },
        description: { 
          en: 'Comprehensive laboratory analysis of marine and coastal water samples for physical, chemical, and biological parameters with certified testing protocols',
          si: 'සහතික පරීක්ෂණ ප්‍රොටෝකෝල සමඟ භෞතික, රසායනික සහ ජීව විද්‍යාත්මක පරාමිති සඳහා සමුද්‍ර සහ වෙරළ ජල සාම්පලවල විස්තීර්ණ රසායනාගාර විශ්ලේෂණය',
          ta: 'சான்றளிக்கப்பட்ட சோதனை நெறிமுறைகளுடன் இயற்பியல், வேதியியல் மற்றும் உயிரியல் அளவுருக்களுக்கான கடல் மற்றும் கடலோர நீர் மாதிரிகளின் விரிவான ஆய்வக பகுப்பாய்வு'
        },
        icon: 'TestTube'
      },
      {
        title: { en: 'Environmental Impact Assessment Consulting', si: 'පාරිසරික බලපෑම් තක්සේරු උපදේශන', ta: 'சுற்றுச்சூழல் தாக்க மதிப்பீட்டு ஆலோசனை' },
        description: { 
          en: 'Expert EIA services for coastal and marine development projects including ports, harbors, tourism facilities, and industrial installations with baseline surveys and mitigation recommendations',
          si: 'වරාය, තොටුපළ, සංචාරක පහසුකම් සහ කාර්මික ස්ථාපනයන් ඇතුළු වෙරළ සහ සමුද්‍ර සංවර්ධන ව්‍යාපෘති සඳහා පාදක සමීක්ෂණ සහ අවම කිරීමේ නිර්දේශ සමඟ ප්‍රවීණ EIA සේවා',
          ta: 'துறைமுகங்கள், துறைமுகங்கள், சுற்றுலா வசதிகள் மற்றும் தொழில்துறை நிறுவல்கள் உட்பட கடலோர மற்றும் கடல் மேம்பாட்டு திட்டங்களுக்கான அடிப்படை ஆய்வுகள் மற்றும் தணிப்பு பரிந்துரைகளுடன் நிபுணர் EIA சேவைகள்'
        },
        icon: 'FileSearch'
      },
      {
        title: { en: 'Pollution Monitoring & Emergency Response', si: 'දූෂණ නිරීක්ෂණ සහ හදිසි ප්‍රතිචාර', ta: 'மாசு கண்காணிப்பு & அவசர பதில்' },
        description: {
          en: '24/7 rapid response to marine pollution incidents, algal blooms, and environmental emergencies with on-site assessment, sampling, and technical support for mitigation measures',
          si: 'ආශ්‍රිත ස්ථාන තක්සේරුව, නියැදීම සහ අවම කිරීමේ පියවර සඳහා තාක්ෂණික සහාය සමඟ සමුද්‍ර දූෂණ සිදුවීම්, ඇල්ගී පිපීම් සහ පාරිසරික හදිසි අවස්ථා සඳහා 24/7 වේගවත් ප්‍රතිචාරය',
          ta: 'ஆன்-சைட் மதிப்பீடு, மாதிரி எடுத்தல் மற்றும் தணிப்பு நடவடிக்கைகளுக்கான தொழில்நுட்ப ஆதரவுடன் கடல் மாசு சம்பவங்கள், பாசி மலர்ச்சி மற்றும் சுற்றுச்சூழல் அவசரநிலைகளுக்கு 24/7 விரைவான பதில்'
        },
        icon: 'Siren'
      },
      {
        title: { en: 'Marine Ecosystem Health Reporting', si: 'සමුද්‍ර පරිසර පද්ධති සෞඛ්‍ය වාර්තාකරණය', ta: 'கடல் சுற்றுச்சூழல் அமைப்பு சுகாதார அறிக்கை' },
        description: {
          en: 'Annual and quarterly reports on marine ecosystem health status, biodiversity indices, and environmental trends for policy makers and stakeholders',
          si: 'ප්‍රතිපත්ති සම්පාදකයින් සහ පාර්ශවකරුවන් සඳහා සමුද්‍ර පරිසර පද්ධති සෞඛ්‍ය තත්ත්වය, ජෛව විවිධත්ව දර්ශක සහ පාරිසරික ප්‍රවණතා පිළිබඳ වාර්ෂික සහ කාර්තුමය වාර්තා',
          ta: 'கொள்கை வகுப்பாளர்கள் மற்றும் பங்குதாரர்களுக்கான கடல் சுற்றுச்சூழல் அமைப்பு சுகாதார நிலை, பல்லுயிர் குறியீடுகள் மற்றும் சுற்றுச்சூழல் போக்குகள் பற்றிய வருடாந்திர மற்றும் காலாண்டு அறிக்கைகள்'
        },
        icon: 'FileBarChart'
      }
    ],

    services: [
      {
        title: { en: 'Water Quality Testing Services', si: 'ජල ගුණාත්මක පරීක්ෂණ සේවා', ta: 'நீர் தர சோதனை சேவைகள்' },
        description: { 
          en: 'Comprehensive laboratory analysis of physical, chemical, and biological parameters with ISO-certified testing protocols and rapid turnaround times',
          si: 'ISO සහතික පරීක්ෂණ ප්‍රොටෝකෝල සහ වේගවත් සේවා කාලය සමඟ භෞතික, රසායනික සහ ජීව විද්‍යාත්මක පරාමිතිවල විස්තීර්ණ රසායනාගාර විශ්ලේෂණය',
          ta: 'ISO-சான்றளிக்கப்பட்ட சோதனை நெறிமுறைகள் மற்றும் விரைவான முடிவு நேரங்களுடன் இயற்பியல், வேதியியல் மற்றும் உயிரியல் அளவுருக்களின் விரிவான ஆய்வக பகுப்பாய்வு'
        },
        icon: 'TestTube'
      },
      {
        title: { en: 'Environmental Consulting & EIA Services', si: 'පාරිසරික උපදේශන සහ EIA සේවා', ta: 'சுற்றுச்சூழல் ஆலோசனை & EIA சேவைகள்' },
        description: { 
          en: 'Expert guidance for coastal development projects, marine spatial planning, baseline environmental surveys, and regulatory compliance support',
          si: 'වෙරළ සංවර්ධන ව්‍යාපෘති, සමුද්‍ර අවකාශ සැලසුම්කරණය, පාදක පාරිසරික සමීක්ෂණ සහ නියාමන අනුකූලතා සහාය සඳහා ප්‍රවීණ මග පෙන්වීම',
          ta: 'கடலோர மேம்பாட்டு திட்டங்கள், கடல் இட திட்டமிடல், அடிப்படை சுற்றுச்சூழல் ஆய்வுகள் மற்றும் ஒழுங்குமுறை இணக்க ஆதரவுக்கான நிபுணர் வழிகாட்டுதல்'
        },
        icon: 'FileSearch'
      },
      {
        title: { en: 'Emergency Pollution Response', si: 'හදිසි දූෂණ ප්‍රතිචාරය', ta: 'அவசர மாசுபாடு பதில்' },
        description: {
          en: '24/7 emergency response team for marine incidents including oil spills, chemical contamination, and harmful algal bloom events',
          si: 'තෙල් කාන්දු, රසායනික දූෂණය සහ හානිකර ඇල්ගී පිපීම් සිදුවීම් ඇතුළු සමුද්‍ර සිදුවීම් සඳහා 24/7 හදිසි ප්‍රතිචාර කණ්ඩායම',
          ta: 'எண்ணெய் கசிவுகள், இரசாயன மாசுபாடு மற்றும் தீங்கு விளைவிக்கும் பாசி மலர்ச்சி நிகழ்வுகள் உட்பட கடல் சம்பவங்களுக்கான 24/7 அவசர பதில் குழு'
        },
        icon: 'Siren'
      }
    ],

    contactEmail: 'esd@nara.ac.lk',
    contactPhone: '+94 11 2521000',
    location: 'NARA Headquarters, Crow Island, Colombo 15'
  },

  {
    id: 'fishing-technology',
    slug: 'fishing-technology-division',
    icon: 'Anchor',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500',

    name: {
      en: 'Fishing Technology Division',
      si: 'මසුන් ඇල්ලීමේ තාක්ෂණ අංශය',
      ta: 'மீன்பிடி தொழில்நுட்ப பிரிவு'
    },

    tagline: {
      en: 'Innovative fishing gear and methods for sustainable harvesting',
      si: 'තිරසාර අස්වැන්න සඳහා නව්‍ය මසුන් ඇල්ලීමේ උපකරණ සහ ක්‍රම',
      ta: 'நிலையான அறுவடைக்கான புதுமையான மீன்பிடி கருவிகள் மற்றும் முறைகள்'
    },

    description: {
      en: 'The Fishing Technology Division develops and tests innovative fishing gears and methods that reduce bycatch, minimize environmental impact, and improve fishing efficiency through acoustic pingers and sustainable practices.',
      si: 'මසුන් ඇල්ලීමේ තාක්ෂණ අංශය විසින් අතුරු ඇල්ලීම අඩු කරන, පාරිසරික බලපෑම අවම කරන සහ මසුන් ඇල්ලීමේ කාර්යක්ෂමතාව වැඩි දියුණු කරන නව්‍ය මසුන් ඇල්ලීමේ උපකරණ සහ ක්‍රම සංවර්ධනය කර පරීක්ෂා කරයි.',
      ta: 'மீன்பிடி தொழில்நுட்ப பிரிவு துணை பிடிப்பைக் குறைக்கும், சுற்றுச்சூழல் தாக்கத்தைக் குறைக்கும் மற்றும் மீன்பிடி திறனை மேம்படுத்தும் புதுமையான மீன்பிடி கருவிகள் மற்றும் முறைகளை உருவாக்கி சோதிக்கிறது.'
    },

    pdfResource: {
      filename: 'NARA-Fishing-Technology-Division.pdf',
      path: '/pdfs/divisions/NARA-Fishing-Technology-Division.pdf',
      pages: 6,
      sizeKB: 112,
      description: {
        en: 'Detailed information on fishing gear development, bycatch reduction technologies, and sustainable fishing methods',
        si: 'මසුන් ඇල්ලීමේ උපකරණ සංවර්ධනය, අතුරු ඇල්ලීම අඩු කිරීමේ තාක්ෂණයන් සහ තිරසාර මසුන් ඇල්ලීමේ ක්‍රම පිළිබඳ සවිස්තරාත්මක තොරතුරු',
        ta: 'மீன்பிடி கருவி மேம்பாடு, துணை பிடிப்பு குறைப்பு தொழில்நுட்பங்கள் மற்றும் நிலையான மீன்பிடி முறைகள் பற்றிய விரிவான தகவல்'
      }
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
      }
    ],

    services: [
      {
        title: { en: 'Gear Testing', si: 'උපකරණ පරීක්ෂණය', ta: 'கருவி சோதனை' },
        description: { en: 'Scientific testing of fishing gear performance', si: '', ta: '' }
      }
    ],

    contactEmail: 'fishtech@nara.ac.lk',
    contactPhone: '+94 11 2521003',
    location: 'Fishing Technology Center, Galle'
  },

  {
    id: 'inland-aquaculture',
    slug: 'inland-aquatic-aquaculture-division',
    icon: 'Droplet',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',

    name: {
      en: 'Inland Aquatic Resources and Aquaculture Division',
      si: 'අභ්‍යන්තර ජලජ සම්පත් සහ ජලජ වගා අංශය',
      ta: 'உள்நாட்டு நீர்வள வளங்கள் மற்றும் மீன் வளர்ப்பு பிரிவு'
    },

    tagline: {
      en: 'Advancing aquaculture technology for food security and livelihoods',
      si: 'ආහාර සුරක්ෂිතභාවය සහ ජීවනෝපාය සඳහා ජලජ වගා තාක්ෂණය ප්‍රවර්ධනය කිරීම',
      ta: 'உணவு பாதுகாப்பு மற்றும் வாழ்வாதாரத்திற்கான மீன் வளர்ப்பு தொழில்நுட்பத்தை முன்னேற்றுதல்'
    },

    description: {
      en: 'The Aquaculture Division develops sustainable aquaculture technologies for ornamental fish, shrimp, sea bass, sea cucumber, seaweed cultivation, and aquatic plant tissue culture with training and technical support.',
      si: 'ජලජ වගා අංශය විසින් විසිතුරු මත්ස්‍යයන්, ඉස්සන්, මුහුදු බාස්, මුහුදු පිපිඤ්ඤා, මුහුදු පැලෑටි වගාව සහ ජලජ ශාක පටක සංස්කෘතිය සඳහා තිරසාර ජලජ වගා තාක්ෂණයන් සංවර්ධනය කරයි.',
      ta: 'மீன் வளர்ப்பு பிரிவு அலங்கார மீன், இறால், கடல் பாஸ், கடல் வெள்ளரி, கடல்பாசி சாகுபடி மற்றும் நீர்வள தாவர திசு வளர்ப்பு ஆகியவற்றுக்கான நிலையான மீன் வளர்ப்பு தொழில்நுட்பங்களை உருவாக்குகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Inland-Aquaculture-Division.pdf',
      path: '/pdfs/divisions/NARA-Inland-Aquaculture-Division.pdf',
      pages: 8,
      sizeKB: 148,
      description: {
        en: 'Complete guide to inland aquaculture practices, breeding techniques, and sustainable farming methods',
        si: 'අභ්‍යන්තර ජලජ වගා පිළිවෙත්, අභිජනනය තාක්ෂණ සහ තිරසාර ගොවිතැන් ක්‍රම සඳහා සම්පූර්ණ මාර්ගෝපදේශය',
        ta: 'உள்நாட்டு மீன் வளர்ப்பு நடைமுறைகள், இனப்பெருக்க நுட்பங்கள் மற்றும் நிலையான விவசாய முறைகள் பற்றிய முழுமையான வழிகாட்டி'
      }
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
        description: { en: 'Commercial farming techniques', si: '', ta: '' },
        icon: 'Waves'
      }
    ],

    services: [
      {
        title: { en: 'Aquaculture Training', si: 'ජලජ වගා පුහුණුව', ta: 'மீன் வளர்ப்பு பயிற்சி' },
        description: { en: 'Comprehensive training programs for farmers', si: '', ta: '' }
      }
    ],

    contactEmail: 'aquaculture@nara.ac.lk',
    contactPhone: '+94 11 2521002',
    location: 'Aquaculture Research Station, Dambulla'
  },

  {
    id: 'post-harvest',
    slug: 'post-harvest-technology-division',
    icon: 'Award',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',

    name: {
      en: 'Institute of Post Harvest Technology',
      si: 'අස්වැන්න පසු තාක්ෂණ ආයතනය',
      ta: 'அறுவடைக்கு பிந்தைய தொழில்நுட்ப நிறுவனம்'
    },

    tagline: {
      en: 'ISO/IEC 17025 accredited testing for export quality seafood',
      si: 'අපනයන ගුණාත්මක මුහුදු ආහාර සඳහා ISO/IEC 17025 පිළිගත් පරීක්ෂණ',
      ta: 'ஏற்றுமதி தர கடல் உணவுக்கான ISO/IEC 17025 அங்கீகரிக்கப்பட்ட சோதனை'
    },

    description: {
      en: 'Our ISO/IEC 17025 accredited laboratories provide comprehensive testing services including microbiology, histamine analysis, chemical residues, and quality certification for export seafood.',
      si: 'අපගේ ISO/IEC 17025 පිළිගත් රසායනාගාර ක්ෂුද්‍ර ජීව විද්‍යාව, හිස්ටමින් විශ්ලේෂණය, රසායනික අවශේෂ සහ ගුණාත්මක සහතික කිරීම ඇතුළු විස්තීර්ණ පරීක්ෂණ සේවා සපයයි.',
      ta: 'எங்கள் ISO/IEC 17025 அங்கீகரிக்கப்பட்ட ஆய்வகங்கள் நுண்ணுயிரியல், ஹிஸ்டமைன் பகுப்பாய்வு, இரசாயன எச்சங்கள் மற்றும் தர சான்றிதழ் உட்பட விரிவான சோதனை சேவைகளை வழங்குகின்றன.'
    },

    pdfResource: {
      filename: 'NARA-Post-Harvest-Technology.pdf',
      path: '/pdfs/divisions/NARA-Post-Harvest-Technology.pdf',
      pages: 9,
      sizeKB: 161,
      description: {
        en: 'Comprehensive overview of quality testing, food safety protocols, and certification services',
        si: 'ගුණාත්මක පරීක්ෂණ, ආහාර සුරක්ෂිතතා ප්‍රොටෝකෝල සහ සහතික සේවා පිළිබඳ සවිස්තරාත්මක දළ විශ්ලේෂණය',
        ta: 'தர சோதனை, உணவு பாதுகாப்பு நெறிமுறைகள் மற்றும் சான்றிதழ் சேவைகள் பற்றிய விரிவான கண்ணோட்டம்'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200',

    focusAreas: [
      {
        title: { en: 'Microbiological Testing', si: 'ක්ෂුද්‍ර ජීව විද්‍යා පරීක්ෂණ', ta: 'நுண்ணுயிரியல் சோதனை' },
        description: { en: 'Detection of bacteria and pathogens', si: '', ta: '' },
        icon: 'Microscope'
      },
      {
        title: { en: 'Quality Certification', si: 'ගුණාත්මක සහතික කිරීම', ta: 'தர சான்றிதழ்' },
        description: { en: 'Export quality certificates', si: '', ta: '' },
        icon: 'Award'
      }
    ],

    services: [
      {
        title: { en: 'Laboratory Testing', si: 'රසායනාගාර පරීක්ෂණ', ta: 'ஆய்வக சோதனை' },
        description: { en: 'Comprehensive testing services', si: '', ta: '' }
      }
    ],

    contactEmail: 'quality@nara.ac.lk',
    contactPhone: '+94 11 2521004',
    location: 'NARA Quality Assurance Laboratory, Colombo'
  },

  {
    id: 'marine-biology',
    slug: 'marine-biological-division',
    icon: 'Waves',
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-500',

    name: {
      en: 'Marine Biological Resources Division (MBRD)',
      si: 'සමුද්‍ර ජීව විද්‍යා සම්පත් අංශය (MBRD)',
      ta: 'கடல் உயிரியல் வள பிரிவு (MBRD)'
    },

    tagline: {
      en: 'Protecting marine life and ecosystems for future generations',
      si: 'අනාගත පරම්පරා සඳහා සමුද්‍ර ජීවිතය සහ පරිසර පද්ධති ආරක්ෂා කිරීම',
      ta: 'எதிர்கால சந்ததியினருக்கு கடல் வாழ்க்கை மற்றும் சுற்றுச்சூழல் அமைப்புகளைப் பாதுகாத்தல்'
    },

    description: {
      en: 'The Marine Biological Resources Division focuses on conservation and study of marine mammals, coral reefs, seagrass beds, and critical marine ecosystems with stranding response and environmental forensics.',
      si: 'සමුද්‍ර ජීව විද්‍යා සම්පත් අංශය සමුද්‍ර ක්ෂීරපායින්, කොරල් පර, මුහුදු තණකොළ සහ තීරණාත්මක සමුද්‍ර පරිසර පද්ධති සංරක්ෂණය සහ අධ්‍යයනය කෙරෙහි අවධානය යොමු කරයි.',
      ta: 'கடல் உயிரியல் வள பிரிவு கடல் பாலூட்டிகள், பவளப்பாறைகள், கடற்பாசி படுகைகள் மற்றும் முக்கிய கடல் சுற்றுச்சூழல் அமைப்புகளின் பாதுகாப்பு மற்றும் ஆய்வு மீது கவனம் செலுத்துகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Marine-Biological-Division.pdf',
      path: '/pdfs/divisions/NARA-Marine-Biological-Division.pdf',
      pages: 9,
      sizeKB: 180,
      description: {
        en: 'Detailed information on marine biodiversity, conservation programs, and ecosystem research',
        si: 'සමුද්‍ර ජෛව විවිධත්වය, සංරක්ෂණ වැඩසටහන් සහ පරිසර පද්ධති පර්යේෂණ පිළිබඳ සවිස්තරාත්මක තොරතුරු',
        ta: 'கடல் பல்லுயிர், பாதுகாப்பு திட்டங்கள் மற்றும் சுற்றுச்சூழல் அமைப்பு ஆராய்ச்சி பற்றிய விரிவான தகவல்'
      }
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
        description: { en: 'Monitoring and restoration', si: '', ta: '' },
        icon: 'Layers'
      }
    ],

    services: [
      {
        title: { en: 'Marine Mammal Rescue', si: 'සමුද්‍ර ක්ෂීරපායින් ගලවා ගැනීම', ta: 'கடல் பாலூட்டி மீட்பு' },
        description: { en: 'Emergency response services', si: '', ta: '' }
      }
    ],

    contactEmail: 'marinebio@nara.ac.lk',
    contactPhone: '+94 11 2521001',
    location: 'NARA Marine Laboratory, Colombo'
  },

  {
    id: 'oceanography',
    slug: 'oceanography-marine-sciences-division',
    icon: 'Compass',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',

    name: {
      en: 'National Institute of Oceanography & Marine Sciences',
      si: 'ජාතික සාගර විද්‍යා සහ සමුද්‍ර විද්‍යා ආයතනය',
      ta: 'தேசிய கடலியல் மற்றும் கடல் அறிவியல் நிறுவனம்'
    },

    tagline: {
      en: 'Understanding ocean dynamics through cutting-edge research',
      si: 'අත්‍යාවශ්‍ය පර්යේෂණ හරහා සාගර ගතිකත්වය අවබෝධ කර ගැනීම',
      ta: 'அதிநவீன ஆராய்ச்சி மூலம் கடல் இயக்கவியல் புரிந்துகொள்ளுதல்'
    },

    description: {
      en: 'The National Institute of Oceanography conducts comprehensive research on ocean currents, climate change impacts, marine chemistry, and oceanographic processes affecting Sri Lankan waters.',
      si: 'ජාතික සාගර විද්‍යා ආයතනය සාගර ප්‍රවාහ, දේශගුණ විපර්යාස බලපෑම්, සමුද්‍ර රසායන විද්‍යාව සහ ශ්‍රී ලංකා ජලයට බලපාන සාගර ක්‍රියාවලීන් පිළිබඳ විස්තීර්ණ පර්යේෂණ සිදු කරයි.',
      ta: 'தேசிய கடலியல் நிறுவனம் கடல் நீரோட்டங்கள், காலநிலை மாற்ற தாக்கங்கள், கடல் வேதியியல் மற்றும் இலங்கை நீரை பாதிக்கும் கடலியல் செயல்முறைகள் பற்றிய விரிவான ஆராய்ச்சியை நடத்துகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Oceanography-Division.pdf',
      path: '/pdfs/divisions/NARA-Oceanography-Division.pdf',
      pages: 9,
      sizeKB: 157,
      description: {
        en: 'Comprehensive guide to oceanographic research, climate studies, and marine science programs',
        si: 'සාගර විද්‍යා පර්යේෂණ, දේශගුණ අධ්‍යයන සහ සමුද්‍ර විද්‍යා වැඩසටහන් සඳහා සවිස්තරාත්මක මාර්ගෝපදේශය',
        ta: 'கடலியல் ஆராய்ச்சி, காலநிலை ஆய்வுகள் மற்றும் கடல் அறிவியல் திட்டங்கள் பற்றிய விரிவான வழிகாட்டி'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',

    focusAreas: [
      {
        title: { en: 'Ocean Dynamics', si: 'සාගර ගතිකත්වය', ta: 'கடல் இயக்கவியல்' },
        description: { en: 'Study of currents and circulation patterns', si: '', ta: '' },
        icon: 'Wind'
      },
      {
        title: { en: 'Climate Research', si: 'දේශගුණ පර්යේෂණ', ta: 'காலநிலை ஆராய்ச்சி' },
        description: { en: 'Climate change impact studies', si: '', ta: '' },
        icon: 'CloudRain'
      }
    ],

    services: [
      {
        title: { en: 'Oceanographic Surveys', si: 'සාගර විද්‍යා සමීක්ෂණ', ta: 'கடலியல் ஆய்வுகள்' },
        description: { en: 'Research cruises and data collection', si: '', ta: '' }
      }
    ],

    contactEmail: 'oceanography@nara.ac.lk',
    contactPhone: '+94 11 2521006',
    location: 'NARA Oceanography Center, Colombo'
  },

  {
    id: 'hydrography',
    slug: 'hydrographic-division',
    icon: 'Map',
    color: 'sky',
    gradient: 'from-sky-500 to-blue-500',

    name: {
      en: 'Hydrographic Division - National Hydrographic Office',
      si: 'ජල මිතීම් අංශය - ජාතික ජල මිතීම් කාර්යාලය',
      ta: 'நீர்வியல் பிரிவு - தேசிய நீர்வியல் அலுவலகம்'
    },

    tagline: {
      en: 'Precise nautical charts for safe navigation in Sri Lankan waters',
      si: 'ශ්‍රී ලංකා ජලයේ ආරක්ෂිත යාත්‍රා කිරීම සඳහා නිරවද්‍ය සමුද්‍ර සිතියම්',
      ta: 'இலங்கை நீரில் பாதுகாப்பான வழிசெலுத்தலுக்கான துல்லியமான கடல்சார் வரைபடங்கள்'
    },

    description: {
      en: 'The Hydrographic Division produces Electronic Navigational Charts (ENCs), conducts bathymetric surveys, and maps coastal areas contributing to GEBCO and Seabed 2030 initiatives.',
      si: 'ජල මිතීම් අංශය විසින් ඉලෙක්ට්‍රොනික යාත්‍රා සිතියම් (ENCs) නිෂ්පාදනය කරයි, ගැඹුරු මිතීමේ සමීක්ෂණ පවත්වයි, සහ වෙරළ ප්‍රදේශ සිතියම්ගත කරයි.',
      ta: 'நீர்வியல் பிரிவு மின்னணு வழிசெலுத்தல் வரைபடங்களை தயாரிக்கிறது, குளிர்நீர் ஆய்வுகளை நடத்துகிறது மற்றும் கடலோர பகுதிகளை வரைபடமாக்குகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Hydrographic-Division.pdf',
      path: '/pdfs/divisions/NARA-Hydrographic-Division.pdf',
      pages: 10,
      sizeKB: 201,
      description: {
        en: 'Complete overview of nautical chart production, bathymetric surveys, and hydrographic services',
        si: 'සමුද්‍ර සිතියම් නිෂ්පාදනය, ගැඹුරු මිතීම් සමීක්ෂණ සහ ජල මිතීම් සේවා පිළිබඳ සම්පූර්ණ දළ විශ්ලේෂණය',
        ta: 'கடல்சார் வரைபட தயாரிப்பு, குளிர்நீர் ஆய்வுகள் மற்றும் நீர்வியல் சேவைகள் பற்றிய முழுமையான கண்ணோட்டம்'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1200',

    focusAreas: [
      {
        title: { en: 'Electronic Charts (ENCs)', si: 'ඉලෙක්ට්‍රොනික සිතියම්', ta: 'மின்னணு வரைபடங்கள்' },
        description: { en: 'Production of S-57/S-100 standard charts', si: '', ta: '' },
        icon: 'Map'
      },
      {
        title: { en: 'Bathymetric Surveys', si: 'ගැඹුරු මිතීමේ සමීක්ෂණ', ta: 'குளிர்நீர் ஆய்வுகள்' },
        description: { en: 'Seafloor mapping', si: '', ta: '' },
        icon: 'Layers'
      }
    ],

    services: [
      {
        title: { en: 'Chart Production', si: 'සිතියම් නිෂ්පාදනය', ta: 'வரைபட தயாரிப்பு' },
        description: { en: 'Custom nautical charts', si: '', ta: '' }
      }
    ],

    contactEmail: 'hydrography@nara.ac.lk',
    contactPhone: '+94 11 2521007',
    location: 'Hydrographic Office, Colombo'
  },

  {
    id: 'socio-economics',
    slug: 'socio-economic-marketing-division',
    icon: 'TrendingUp',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',

    name: {
      en: 'Socio-Economic & Marketing Research Division',
      si: 'සමාජ-ආර්ථික සහ අලෙවිකරණ පර්යේෂණ අංශය',
      ta: 'சமூக-பொருளாதாரம் & சந்தைப்படுத்தல் ஆராய்ச்சி பிரிவு'
    },

    tagline: {
      en: 'Empowering fishing communities through economic research and market development',
      si: 'ආර්ථික පර්යේෂණ සහ වෙළඳපල සංවර්ධනය තුළින් ධීවර ප්‍රජාවන් සවිබල ගැන්වීම',
      ta: 'பொருளாதார ஆராய்ச்சி மற்றும் சந்தை மேம்பாடு மூலம் மீன்பிடி சமூகங்களுக்கு அதிகாரம் அளித்தல்'
    },

    description: {
      en: 'The Socio-Economics Division conducts research on fisheries economics, market trends, value chain analysis, and fisher welfare providing industry outlook and policy recommendations.',
      si: 'සමාජ-ආර්ථික අංශය මත්ස්‍ය ආර්ථික විද්‍යාව, වෙළඳපල ප්‍රවණතා, වටිනාකම් දාම විශ්ලේෂණය සහ ධීවර සුභසාධනය පිළිබඳ පර්යේෂණ සිදු කරයි.',
      ta: 'சமூக-பொருளாதார பிரிவு மீன்வள பொருளாதாரம், சந்தை போக்குகள், மதிப்பு சங்கிலி பகுப்பாய்வு மற்றும் மீனவர் நலன் பற்றிய ஆராய்ச்சியை நடத்துகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Socio-Economic-Division.pdf',
      path: '/pdfs/divisions/NARA-Socio-Economic-Division.pdf',
      pages: 11,
      sizeKB: 197,
      description: {
        en: 'Detailed analysis of fisheries economics, market research, and community development programs',
        si: 'මත්ස්‍ය ආර්ථික විද්‍යාව, වෙළඳපල පර්යේෂණ සහ ප්‍රජා සංවර්ධන වැඩසටහන් පිළිබඳ සවිස්තරාත්මක විශ්ලේෂණය',
        ta: 'மீன்வள பொருளாதாரம், சந்தை ஆராய்ச்சி மற்றும் சமூக மேம்பாடு திட்டங்கள் பற்றிய விரிவான பகுப்பாய்வு'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',

    focusAreas: [
      {
        title: { en: 'Industry Outlook', si: 'කර්මාන්ත දැක්ම', ta: 'தொழில் கண்ணோட்டம்' },
        description: { en: 'Economic forecasting', si: '', ta: '' },
        icon: 'TrendingUp'
      },
      {
        title: { en: 'Fisher Welfare', si: 'ධීවර සුභසාධනය', ta: 'மீனவர் நலன்' },
        description: { en: 'Community development', si: '', ta: '' },
        icon: 'Heart'
      }
    ],

    services: [
      {
        title: { en: 'Market Research', si: 'වෙළඳපල පර්යේෂණ', ta: 'சந்தை ஆராய்ச்சி' },
        description: { en: 'Market analysis and reports', si: '', ta: '' }
      }
    ],

    contactEmail: 'socioeco@nara.ac.lk',
    contactPhone: '+94 11 2521008',
    location: 'NARA Socio-Economics Unit, Colombo'
  },

  {
    id: 'monitoring-evaluation',
    slug: 'monitoring-evaluation-division',
    icon: 'BarChart3',
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500',

    name: {
      en: 'Monitoring and Evaluation Division',
      si: 'නිරීක්ෂණ සහ ඇගයීම් අංශය',
      ta: 'கண்காணிப்பு மற்றும் மதிப்பீட்டு பிரிவு'
    },

    tagline: {
      en: 'Ensuring excellence through systematic monitoring and evaluation',
      si: 'ක්‍රමානුකූල නිරීක්ෂණ සහ ඇගයීම හරහා විශිෂ්ටත්වය සහතික කිරීම',
      ta: 'முறையான கண்காணிப்பு மற்றும் மதிப்பீடு மூலம் சிறப்பை உறுதிசெய்தல்'
    },

    description: {
      en: 'The Monitoring and Evaluation Division tracks research progress, assesses project impacts, and ensures quality standards across all NARA divisions through systematic evaluation frameworks.',
      si: 'නිරීක්ෂණ සහ ඇගයීම් අංශය පර්යේෂණ ප්‍රගතිය නිරීක්ෂණය කරයි, ව්‍යාපෘති බලපෑම් තක්සේරු කරයි, සහ ක්‍රමානුකූල ඇගයීම් රාමු හරහා සියලුම NARA අංශවල ගුණාත්මක ප්‍රමිතීන් සහතික කරයි.',
      ta: 'கண்காணிப்பு மற்றும் மதிப்பீட்டு பிரிவு ஆராய்ச்சி முன்னேற்றத்தை கண்காணிக்கிறது, திட்ட தாக்கங்களை மதிப்பிடுகிறது மற்றும் முறையான மதிப்பீட்டு கட்டமைப்புகள் மூலம் அனைத்து NARA பிரிவுகளிலும் தர தரங்களை உறுதிசெய்கிறது.'
    },

    pdfResource: {
      filename: 'NARA-Monitoring-Evaluation-Division.pdf',
      path: '/pdfs/divisions/NARA-Monitoring-Evaluation-Division.pdf',
      pages: 12,
      sizeKB: 196,
      description: {
        en: 'Comprehensive guide to M&E frameworks, performance indicators, and quality assurance systems',
        si: 'M&E රාමු, කාර්ය සාධන දර්ශක සහ ගුණාත්මක සහතික පද්ධති සඳහා සවිස්තරාත්මක මාර්ගෝපදේශය',
        ta: 'M&E கட்டமைப்புகள், செயல்திறன் குறிகாட்டிகள் மற்றும் தர உத்தரவாத அமைப்புகள் பற்றிய விரிவான வழிகாட்டி'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',

    focusAreas: [
      {
        title: { en: 'Performance Tracking', si: 'කාර්ය සාධන නිරීක්ෂණය', ta: 'செயல்திறன் கண்காணிப்பு' },
        description: { en: 'Systematic monitoring of research outputs', si: '', ta: '' },
        icon: 'Activity'
      },
      {
        title: { en: 'Impact Assessment', si: 'බලපෑම් තක්සේරුව', ta: 'தாக்க மதிப்பீடு' },
        description: { en: 'Evaluation of project outcomes', si: '', ta: '' },
        icon: 'Target'
      }
    ],

    services: [
      {
        title: { en: 'M&E Framework Development', si: 'M&E රාමු සංවර්ධනය', ta: 'M&E கட்டமைப்பு மேம்பாடு' },
        description: { en: 'Custom evaluation frameworks', si: '', ta: '' }
      }
    ],

    contactEmail: 'monitoring@nara.ac.lk',
    contactPhone: '+94 11 2521009',
    location: 'NARA M&E Division, Colombo'
  },

  {
    id: 'aquaculture-center',
    slug: 'aquaculture-research-center',
    icon: 'Building2',
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-500',

    name: {
      en: 'Aquaculture Research Center',
      si: 'ජලජ වගා පර්යේෂණ මධ්‍යස්ථානය',
      ta: 'மீன் வளர்ப்பு ஆராய்ச்சி மையம்'
    },

    tagline: {
      en: 'Leading aquaculture innovation and sustainable farming practices',
      si: 'ජලජ වගා නවෝත්පාදන සහ තිරසාර ගොවිතැන් පිළිවෙත් ප්‍රමුඛත්වය දීම',
      ta: 'மீன் வளர்ப்பு புதுமை மற்றும் நிலையான விவசாய நடைமுறைகளை முன்னணியில் கொண்டு செல்லுதல்'
    },

    description: {
      en: 'The Aquaculture Research Center serves as a hub for practical research, farmer training, and technology demonstration in ornamental fish, shrimp, and marine aquaculture systems.',
      si: 'ජලජ වගා පර්යේෂණ මධ්‍යස්ථානය විසිතුරු මත්ස්‍යයන්, ඉස්සන් සහ සමුද්‍ර ජලජ වගා පද්ධතිවල ප්‍රායෝගික පර්යේෂණ, ගොවි පුහුණුව සහ තාක්ෂණ ප්‍රදර්ශන සඳහා මධ්‍යස්ථානයක් ලෙස සේවය කරයි.',
      ta: 'மீன் வளர்ப்பு ஆராய்ச்சி மையம் அலங்கார மீன், இறால் மற்றும் கடல் மீன் வளர்ப்பு அமைப்புகளில் நடைமுறை ஆராய்ச்சி, விவசாயி பயிற்சி மற்றும் தொழில்நுட்ப விளக்கத்திற்கான மையமாக செயல்படுகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Aquaculture-Research-Center.pdf',
      path: '/pdfs/divisions/NARA-Aquaculture-Research-Center.pdf',
      pages: 14,
      sizeKB: 222,
      description: {
        en: 'Complete overview of research facilities, training programs, and aquaculture technologies',
        si: 'පර්යේෂණ පහසුකම්, පුහුණු වැඩසටහන් සහ ජලජ වගා තාක්ෂණයන් පිළිබඳ සම්පූර්ණ දළ විශ්ලේෂණය',
        ta: 'ஆராய்ச்சி வசதிகள், பயிற்சி திட்டங்கள் மற்றும் மீன் வளர்ப்பு தொழில்நுட்பங்கள் பற்றிய முழுமையான கண்ணோட்டம்'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=1200',

    focusAreas: [
      {
        title: { en: 'Research Facilities', si: 'පර්යේෂණ පහසුකම්', ta: 'ஆராய்ச்சி வசதிகள்' },
        description: { en: 'State-of-the-art aquaculture labs', si: '', ta: '' },
        icon: 'Building2'
      },
      {
        title: { en: 'Farmer Training', si: 'ගොවි පුහුණුව', ta: 'விவசாயி பயிற்சி' },
        description: { en: 'Hands-on training programs', si: '', ta: '' },
        icon: 'GraduationCap'
      }
    ],

    services: [
      {
        title: { en: 'Technology Demonstration', si: 'තාක්ෂණ ප්‍රදර්ශන', ta: 'தொழில்நுட்ப விளக்கம்' },
        description: { en: 'Practical aquaculture demonstrations', si: '', ta: '' }
      }
    ],

    contactEmail: 'arcenter@nara.ac.lk',
    contactPhone: '+94 11 2521010',
    location: 'Aquaculture Research Center, Dambulla'
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

/**
 * Get divisions with PDF resources
 */
export const getDivisionsWithPDFs = () => {
  return DIVISIONS_CONFIG.filter(div => div.pdfResource);
};

export default DIVISIONS_CONFIG;
