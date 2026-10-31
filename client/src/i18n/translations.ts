export type Language = 'en' | 'te' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    dashboard: string;
    recommend: string;
    compare: string;
    library: string;
    history: string;
    about: string;
    tryDemo: string;
  };
  hero: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    getRecommendation: string;
    exploreCrops: string;
    quickStats: {
      crops: string;
      accuracy: string;
      factors: string;
    };
  };
  form: {
    title: string;
    subtitle: string;
    trySampleData: string;
    soilSection: string;
    soilType: string;
    soilPh: string;
    npkTitle: string;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    envSection: string;
    temperature: string;
    humidity: string;
    rainfall: string;
    season: string;
    optionalSection: string;
    state: string;
    district: string;
    irrigation: string;
    waterAvailability: string;
    analyzeBtn: string;
    analyzing: string;
    unknown: string;
    selectSoilType: string;
    selectSeason: string;
  };
  results: {
    title: string;
    subtitle: string;
    topMatches: string;
    suitabilityScore: string;
    whatIfTitle: string;
    whatIfDesc: string;
    compareBtn: string;
    viewDetailsBtn: string;
    exportPdfBtn: string;
    positivePoints: string;
    limitations: string;
    missingWarning: string;
    recalculate: string;
  };
  comparison: {
    title: string;
    subtitle: string;
    selectCrops: string;
    radarTitle: string;
    tableTitle: string;
    metric: string;
  };
  library: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    allSeasons: string;
  };
  history: {
    title: string;
    subtitle: string;
    guestNotice: string;
    empty: string;
    viewResults: string;
    delete: string;
  };
  dashboard: {
    welcome: string;
    greeting: string;
    totalAnalyses: string;
    savedCrops: string;
    recentRecommendations: string;
    soilProfileTitle: string;
    newAnalysisBtn: string;
    emptyState: string;
  };
  common: {
    disclaimerTitle: string;
    disclaimerText: string;
    loading: string;
    error: string;
    close: string;
    yes: string;
    no: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'AgroSmart AI',
    tagline: 'Grow Smarter, Farm Better.',
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      recommend: 'Crop Advisor',
      compare: 'Compare Crops',
      library: 'Crop Library',
      history: 'History',
      about: 'Methodology',
      tryDemo: 'Try Demo'
    },
    hero: {
      badge: 'Scientific Precision Agriculture • Hackathon Prototype',
      title: 'Smart Farming Starts With',
      highlight: 'Smart Decisions',
      subtitle: 'Analyze your soil chemistry, weather trends, and regional seasons with an explainable AI decision-support engine. Minimize risk and maximize crop yield sustainably.',
      getRecommendation: 'Get Crop Recommendations',
      exploreCrops: 'Explore Crop Library',
      quickStats: {
        crops: '15+ Documented Crops',
        accuracy: '100% Explainable',
        factors: '9 Agronomic Factors'
      }
    },
    form: {
      title: 'Farm Soil & Climate Assessment',
      subtitle: 'Enter your field measurements. Our rule-based engine evaluates suitability against documented ICAR/FAO agronomic ranges.',
      trySampleData: 'Try Sample Data',
      soilSection: '1. Soil Chemical & Physical Properties',
      soilType: 'Soil Type / Texture',
      soilPh: 'Soil pH (Reaction)',
      npkTitle: 'Primary Nutrients (NPK in kg/ha)',
      nitrogen: 'Available Nitrogen (N)',
      phosphorus: 'Available Phosphorus (P)',
      potassium: 'Available Potassium (K)',
      envSection: '2. Environmental & Climate Factors',
      temperature: 'Average Temperature (°C)',
      humidity: 'Relative Humidity (%)',
      rainfall: 'Seasonal Rainfall (mm)',
      season: 'Cultivation Season',
      optionalSection: '3. Geographic & Water Context (Optional)',
      state: 'State',
      district: 'District',
      irrigation: 'Assured Irrigation Available?',
      waterAvailability: 'General Water Availability',
      analyzeBtn: 'Analyze My Soil & Recommend Crops',
      analyzing: 'Evaluating Agronomic Suitability...',
      unknown: 'Unknown / Not Measured',
      selectSoilType: 'Select Soil Texture',
      selectSeason: 'Select Growing Season'
    },
    results: {
      title: 'Suitability Analysis Results',
      subtitle: 'Ranked crop recommendations based on multi-factor weighted agronomic evaluation.',
      topMatches: 'Top Recommended Crops',
      suitabilityScore: 'Suitability Score',
      whatIfTitle: 'What-If Interactive Simulator',
      whatIfDesc: 'Adjust temperature, rainfall, or pH below to see real-time recalculations.',
      compareBtn: 'Compare Crops',
      viewDetailsBtn: 'View Crop Profile',
      exportPdfBtn: 'Export PDF Report',
      positivePoints: 'Favorable Factors',
      limitations: 'Agronomic Cautions / Bottlenecks',
      missingWarning: 'Uncertainty Advisory',
      recalculate: 'Recalculating...'
    },
    comparison: {
      title: 'Side-by-Side Crop Comparison',
      subtitle: 'Compare agronomic thresholds, water requirements, and management demands.',
      selectCrops: 'Select 2 or more crops to compare:',
      radarTitle: 'Agronomic Resilience Radar Chart',
      tableTitle: 'Detailed Metric Comparison',
      metric: 'Agronomic Parameter'
    },
    library: {
      title: 'Crop Knowledge Library',
      subtitle: 'Verified agronomic benchmarks, climate ranges, and field management guides.',
      searchPlaceholder: 'Search by crop name, scientific name, or soil...',
      allCategories: 'All Categories',
      allSeasons: 'All Seasons'
    },
    history: {
      title: 'Recommendation History',
      subtitle: 'Review past crop recommendations and saved soil analyses.',
      guestNotice: 'Guest Mode: Records are securely saved in your local browser cache.',
      empty: 'No recommendation history found yet. Run an analysis or try our demo!',
      viewResults: 'Reopen Results',
      delete: 'Delete'
    },
    dashboard: {
      welcome: 'Welcome to AgroSmart AI',
      greeting: 'Empowering your farm decisions with data-driven agronomic science.',
      totalAnalyses: 'Total Soil Analyses',
      savedCrops: 'Documented Crops',
      recentRecommendations: 'Recent Recommendations',
      soilProfileTitle: 'Recent Soil Condition Summary',
      newAnalysisBtn: 'New Crop Assessment',
      emptyState: 'No farm analyses recorded yet. Start by analyzing your field conditions!'
    },
    common: {
      disclaimerTitle: 'Advisory Guidance Disclaimer',
      disclaimerText: 'AgroSmart AI recommendations are scientific decision-support guidelines based on ICAR/FAO suitability ranges and do not constitute a guaranteed crop outcome. Local microclimate, soil depth, and seed variety may influence results.',
      loading: 'Loading agronomic data...',
      error: 'An error occurred. Please try again.',
      close: 'Close',
      yes: 'Yes',
      no: 'No'
    }
  },
  te: {
    appName: 'ఆగ్రోస్మార్ట్ AI',
    tagline: 'తెలివిగా పండించండి, మెరుగ్గా సాగు చేయండి.',
    nav: {
      home: 'హోమ్',
      dashboard: 'డ్యాష్‌బోర్డ్',
      recommend: 'పంట సిఫార్సు',
      compare: 'పంటల పోలిక',
      library: 'పంటల గ్రంథాలయం',
      history: 'చరిత్ర',
      about: 'విధానం',
      tryDemo: 'డెమో ప్రయత్నించండి'
    },
    hero: {
      badge: 'శాస్త్రీయ వ్యవసాయ నిర్ణయ వ్యవస్థ • హ్యాకథాన్ ప్రోటోటైప్',
      title: 'స్మార్ట్ వ్యవసాయం ప్రారంభం',
      highlight: 'సరైన నిర్ణయాలతో',
      subtitle: 'మీ నేల రసాయనాలు, వాతావరణం మరియు కాలానుగుణ పరిస్థితులను విశ్లేషించి అనువైన పంటలను ఎంచుకోండి. నష్టభయాన్ని తగ్గించి మంచి దిగుబడి పొందండి.',
      getRecommendation: 'పంట సిఫార్సులు పొందండి',
      exploreCrops: 'పంటల సమాచారం చూడండి',
      quickStats: {
        crops: '15+ నమోదిత పంటలు',
        accuracy: '100% పారదర్శకత',
        factors: '9 వ్యవసాయ కారకాలు'
      }
    },
    form: {
      title: 'నేల & వాతావరణ సమాచార ఫారమ్',
      subtitle: 'మీ పొలం వివరాలను నమోదు చేయండి. మా నియమ-ఆధారిత ఇంజిన్ ICAR నిబంధనల ప్రకారం పంట అనుకూలతను గణిస్తుంది.',
      trySampleData: 'నమూనా డేటా నింపండి',
      soilSection: '1. నేల భౌతిక & రసాయన గుణాలు',
      soilType: 'నేల రకం',
      soilPh: 'నేల pH (ఉదజసూచిక)',
      npkTitle: 'ప్రధాన పోషకాలు (NPK - కేజీ/హెక్టార్)',
      nitrogen: 'నత్రజని (N)',
      phosphorus: 'భాస్వరం (P)',
      potassium: 'పొటాష్ (K)',
      envSection: '2. పర్యావరణ & వాతావరణ వివరాలు',
      temperature: 'సగటు ఉష్ణోగ్రత (°C)',
      humidity: 'తేమ శాతం (%)',
      rainfall: 'వర్షపాతం (మి.మీ)',
      season: 'సాగు కాలం (సీజన్)',
      optionalSection: '3. నీటిపారుదల & జిల్లా వివరాలు (ఐచ్ఛికం)',
      state: 'రాష్ట్రం',
      district: 'జిల్లా',
      irrigation: 'నీటిపారుదల సౌకర్యం ఉందా?',
      waterAvailability: 'నీటి లభ్యత స్థాయి',
      analyzeBtn: 'నేలను విశ్లేషించి పంటలను సిఫార్సు చేయండి',
      analyzing: 'పంట అనుకూలతను లెక్కిస్తోంది...',
      unknown: 'తెలియదు / కొలవలేదు',
      selectSoilType: 'నేల రకాన్ని ఎంచుకోండి',
      selectSeason: 'సాగు కాలాన్ని ఎంచుకోండి'
    },
    results: {
      title: 'పంట అనుకూలత విశ్లేషణ ఫలితాలు',
      subtitle: 'మీ నేల మరియు వాతావరణానికి అత్యంత అనువైన పంటల ర్యాంకింగ్.',
      topMatches: 'సిఫార్సు చేయబడిన ప్రధాన పంటలు',
      suitabilityScore: 'అనుకూలత శాతం',
      whatIfTitle: 'వాతావరణ మార్పు సిమ్యులేటర్',
      whatIfDesc: 'ఉష్ణోగ్రత, వర్షపాతం లేదా pH మార్చి పంటల ర్యాంకులు ఎలా మారుతాయో వెంటనే చూడండి.',
      compareBtn: 'పంటలను పోల్చండి',
      viewDetailsBtn: 'వివరాలు చూడండి',
      exportPdfBtn: 'PDF నివేదిక డౌన్‌లోడ్',
      positivePoints: 'అనుకూల అంశాలు',
      limitations: 'పరిమితులు / సవాళ్లు',
      missingWarning: 'సమాచార లోపం హెచ్చరిక',
      recalculate: 'తిరిగి లెక్కిస్తోంది...'
    },
    comparison: {
      title: 'పంటల మధ్య ముఖాముఖి పోలిక',
      subtitle: 'నీటి అవసరాలు, ఉష్ణోగ్రత మరియు నేల గుణాలను పోల్చి చూడండి.',
      selectCrops: 'పోల్చడానికి కనీసం 2 పంటలను ఎంచుకోండి:',
      radarTitle: 'పంటల తట్టుకునే శక్తి (రాడార్ చార్ట్)',
      tableTitle: 'సమగ్ర పట్టిక పోలిక',
      metric: 'వ్యవసాయ ప్రమాణం'
    },
    library: {
      title: 'పంటల విజ్ఞాన భాండాగారం',
      subtitle: 'ప్రామాణిక ICAR/FAO శాస్త్రీయ మార్గదర్శకాలు మరియు సాగు పద్ధతులు.',
      searchPlaceholder: 'పంట పేరు లేదా నేల ద్వారా శోధించండి...',
      allCategories: 'అన్ని విభాగాలు',
      allSeasons: 'అన్ని సీజన్లు'
    },
    history: {
      title: 'సిఫార్సుల చరిత్ర',
      subtitle: 'గతంలో చేసిన నేల పరీక్షలు మరియు పొందిన పంట సూచనలు.',
      guestNotice: 'గెస్ట్ మోడ్: మీ సమాచారం బ్రౌజర్‌లో సురక్షితంగా భద్రపరచబడుతుంది.',
      empty: 'ఇంకా ఎలాంటి సిఫార్సులు లేవు. కొత్త పరీక్షను ప్రారంభించండి!',
      viewResults: 'ఫలితాలు చూడండి',
      delete: 'తొలగించు'
    },
    dashboard: {
      welcome: 'ఆగ్రోస్మార్ట్ AI కి స్వాగతం',
      greeting: 'శాస్త్రీయ డేటాతో మీ వ్యవసాయానికి సరైన తోడ్పాటు.',
      totalAnalyses: 'మొత్తం నేల పరీక్షలు',
      savedCrops: 'నమోదైన పంటలు',
      recentRecommendations: 'ఇటీవలి సిఫార్సులు',
      soilProfileTitle: 'ఇటీవలి నేల స్థితి వివరాలు',
      newAnalysisBtn: 'కొత్త పంట విశ్లేషణ',
      emptyState: 'ఇంకా నేల పరీక్షలు చేయలేదు. ఇప్పుడే ప్రారంభించండి!'
    },
    common: {
      disclaimerTitle: 'గమనిక / సలహా ప్రకటన',
      disclaimerText: 'ఈ సిఫార్సులు కేవలం శాస్త్రీయ మార్గదర్శకాలు మాత్రమే. స్థానిక సూక్ష్మవాతావరణం, విత్తన రకం మరియు నిర్వహణపై దిగుబడి ఆధారపడి ఉంటుంది.',
      loading: 'డేటా లోడ్ అవుతోంది...',
      error: 'లోపం సంభవించింది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
      close: 'మూసివేయి',
      yes: 'అవును',
      no: 'కాదు'
    }
  },
  hi: {
    appName: 'एग्रोस्मार्ट AI',
    tagline: 'सही समझें, बेहतर उगाएं।',
    nav: {
      home: 'होम',
      dashboard: 'डैशबोर्ड',
      recommend: 'फसल सलाहकार',
      compare: 'फसल तुलना',
      library: 'फसल ज्ञानकोश',
      history: 'इतिहास',
      about: 'कार्यप्रणाली',
      tryDemo: 'डेमो देखें'
    },
    hero: {
      badge: 'वैज्ञानिक कृषि निर्णय प्रणाली • हैकथॉन प्रोटोटाइप',
      title: 'स्मार्ट खेती की शुरुआत',
      highlight: 'सही निर्णयों से',
      subtitle: 'अपनी मिट्टी के पोषक तत्वों, मौसम और मौसम चक्र का पारदर्शी AI द्वारा विश्लेषण करें। जोखिम घटाएं और उपज बढ़ाएं।',
      getRecommendation: 'फसल सिफारिशें प्राप्त करें',
      exploreCrops: 'फसल लाइब्रेरी देखें',
      quickStats: {
        crops: '15+ प्रमाणित फसलें',
        accuracy: '100% पारदर्शी नियम',
        factors: '9 कृषि कारक'
      }
    },
    form: {
      title: 'खेत की मिट्टी व मौसम मूल्यांकन फॉर्म',
      subtitle: 'अपने खेत के माप दर्ज करें। हमारा पारदर्शी इंजन ICAR और FAO के वैज्ञानिक मानकों के आधार पर गणना करता है।',
      trySampleData: 'नमूना डेटा भरें',
      soilSection: '1. मिट्टी के भौतिक व रासायनिक गुण',
      soilType: 'मिट्टी का प्रकार',
      soilPh: 'मिट्टी का pH मान',
      npkTitle: 'मुख्य पोषक तत्व (NPK किग्रा/हेक्टेयर)',
      nitrogen: 'नाइट्रोजन (N)',
      phosphorus: 'फास्फोरस (P)',
      potassium: 'पोटेशियम (K)',
      envSection: '2. मौसमी व पर्यावरणीय कारक',
      temperature: 'औसत तापमान (°C)',
      humidity: 'सापेक्ष आर्द्रता (%)',
      rainfall: 'मौसमी वर्षा (मिमी)',
      season: 'फसल का मौसम (ऋतु)',
      optionalSection: '3. भौगोलिक व सिंचाई स्थिति (वैकल्पिक)',
      state: 'राज्य',
      district: 'जिला',
      irrigation: 'क्या सिंचाई की सुविधा उपलब्ध है?',
      waterAvailability: 'जल उपलब्धता स्तर',
      analyzeBtn: 'मिट्टी का विश्लेषण करें और फसल जानें',
      analyzing: 'उपयुक्तता की गणना हो रही है...',
      unknown: 'अज्ञात / मापा नहीं गया',
      selectSoilType: 'मिट्टी का प्रकार चुनें',
      selectSeason: 'फसल का मौसम चुनें'
    },
    results: {
      title: 'फसल उपयुक्तता परिणाम',
      subtitle: 'वैज्ञानिक मानकों पर आधारित सबसे उपयुक्त फसलों की रैंकिंग।',
      topMatches: 'शीर्ष अनुशंसित फसलें',
      suitabilityScore: 'उपयुक्तता स्कोर',
      whatIfTitle: 'मौसम परिवर्तन सिम्युलेटर (What-If)',
      whatIfDesc: 'तापमान, वर्षा या pH बदलकर तुरंत देखें कि फसलों की रैंकिंग कैसे बदलती है।',
      compareBtn: 'फसल तुलना करें',
      viewDetailsBtn: 'विस्तृत विवरण',
      exportPdfBtn: 'PDF रिपोर्ट डाउनलोड करें',
      positivePoints: 'अनुकूल कारक',
      limitations: 'कमियां या सावधानियां',
      missingWarning: 'अधूरी जानकारी की चेतावनी',
      recalculate: 'पुनर्गणना जारी...'
    },
    comparison: {
      title: 'फसलों की आमने-सामने तुलना',
      subtitle: 'जल आवश्यकता, तापमान सीमा और प्रबंधन लागत की विस्तृत तुलना।',
      selectCrops: 'तुलना के लिए कम से कम 2 फसलें चुनें:',
      radarTitle: 'फसल प्रतिरोधक क्षमता (रडार चार्ट)',
      tableTitle: 'विस्तृत तुलनात्मक तालिका',
      metric: 'कृषि पैरामीटर'
    },
    library: {
      title: 'फसल ज्ञानकोश पुस्तकालय',
      subtitle: 'ICAR/FAO संदर्भ डेटा, जलवायु आवश्यकताएं और प्रबंधन सुझाव।',
      searchPlaceholder: 'फसल के नाम या मिट्टी से खोजें...',
      allCategories: 'सभी श्रेणियां',
      allSeasons: 'सभी मौसम'
    },
    history: {
      title: 'सिफारिश इतिहास',
      subtitle: 'पूर्व में किए गए विश्लेषण और सहेजी गई फसल रिपोर्ट।',
      guestNotice: 'अतिथि मोड: रिकॉर्ड आपके ब्राउज़र में सुरक्षित रूप से सहेजे जाते हैं।',
      empty: 'अभी कोई रिकॉर्ड नहीं है। नया विश्लेषण चलाएं या डेमो देखें!',
      viewResults: 'परिणाम पुनः देखें',
      delete: 'हटाएं'
    },
    dashboard: {
      welcome: 'एग्रोस्मार्ट AI में आपका स्वागत है',
      greeting: 'वैज्ञानिक कृषि डेटा के साथ सही निर्णय लेने में आपकी सहायता।',
      totalAnalyses: 'कुल मिट्टी विश्लेषण',
      savedCrops: 'दर्ज फसलें',
      recentRecommendations: 'हालिया सिफारिशें',
      soilProfileTitle: 'हालिया मिट्टी की स्थिति का सारांश',
      newAnalysisBtn: 'नया फसल मूल्यांकन',
      emptyState: 'अभी तक कोई विश्लेषण नहीं किया गया। अपने खेत का विवरण दर्ज करके शुरुआत करें!'
    },
    common: {
      disclaimerTitle: 'सलाहकारी अस्वीकरण (Disclaimer)',
      disclaimerText: 'यह सिफारिशें केवल वैज्ञानिक मार्गदर्शन के लिए हैं। स्थानीय सूक्ष्म-जलवायु, बीज किस्म और प्रबंधन के आधार पर वास्तविक पैदावार भिन्न हो सकती है।',
      loading: 'डेटा लोड हो रहा है...',
      error: 'त्रुटि हुई। कृपया पुनः प्रयास करें।',
      close: 'बंद करें',
      yes: 'हाँ',
      no: 'नहीं'
    }
  }
};
