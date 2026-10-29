/**
 * Member Directory Repository Layer
 * Interacts with Supabase 'participants' collection with local fallback data.
 */

import { supabase } from '../../lib/supabase';
import { DirectoryMember } from '../../models/types';

export const ALL_EXPERTISE_TAGS = [
  "Solar PV", "Wind Power", "Energy Storage", "Hydrogen", "Smart Grids", 
  "Energy Efficiency", "EV Infrastructure", "Microgrids", 
  "E&P (Exploration & Production)", "LNG Infrastructure", "Offshore Support", 
  "Bunkering", "EPC", "O&M", "Project Management", "Energy Trading", 
  "PPA Structuring", "Legal Counsel", "Financial Advisory", 
  "ESG & Environmental", "Policy & Regulatory"
];

export const INITIAL_DIRECTORY_MEMBERS: DirectoryMember[] = [
  // Utility & Grid Operators
  {
    id: "member-eac",
    name: "Electricity Authority of Cyprus (EAC / AHK)",
    type: "Company",
    roleOrCategory: "State Electricity Utility & Distribution System Operator",
    email: "eacinfo@eac.com.cy",
    phone: "+357 22 201000",
    location: "Nicosia, Cyprus",
    category: "Government & Associations",
    expertiseTags: ["Smart Grids", "Energy Efficiency", "O&M", "Policy & Regulatory"],
    imageUrl: "/logos/eac.svg",
    logoUrl: "/logos/eac.svg",
    website: "https://www.eac.com.cy",
    linkedin: "https://www.linkedin.com/company/eac-cyprus",
    keyContactName: "EAC Corporate Relations",
    description: "Cyprus state utility responsible for power generation, transmission, and distribution grid operation under DTR regulation.",
    description_el: "Αρχή Ηλεκτρισμού Κύπρου: Ημικρατικός οργανισμός παραγωγής, μεταφοράς και διανομής ηλεκτρικής ενέργειας στην Κύπρο.",
    description_ru: "Государственная электрическая компания Кипра (EAC): генерация, передача и управление распределительными сетями электроснабжения.",
    description_he: "רשות החשמל של קפריסין (EAC): הגוף הממשלתי האחראי ייצור, הולכה וחלוקת חשמל ברחבי קפריסין.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Power Generation", "Grid Connection", "Net Billing Metering", "Distribution System Operation"],
    notableProjects: "Vasilikos & Dhekelia Power Stations, Substation Modernization",
    certifications: "DSO Licensed Operator, ISO 9001",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-cera",
    name: "Cyprus Energy Regulatory Authority (CERA / RAEK)",
    type: "Company",
    roleOrCategory: "Independent Energy Market Regulator",
    email: "info@cera.org.cy",
    phone: "+357 22 666363",
    location: "Nicosia, Cyprus",
    category: "Government & Associations",
    expertiseTags: ["Policy & Regulatory", "PPA Structuring", "Energy Trading"],
    imageUrl: "/logos/cera.svg",
    logoUrl: "/logos/cera.svg",
    website: "https://www.cera.org.cy",
    keyContactName: "CERA Secretariat",
    description: "Independent regulatory authority monitoring the open electricity market, issuing generation licenses, and setting energy tariffs.",
    description_el: "Ρυθμιστική Αρχή Ενέργειας Κύπρου (ΡΑΕΚ): Ανεξάρτητος ρυθμιστής αγοράς ηλεκτρισμού, αδειοδοτήσεων ΑΠΕ και τιμολογίων.",
    description_ru: "Регуляторный орган энергетики Кипра (CERA): лицензирование энергорынка, регулирование тарифов и контроль конкуренции.",
    description_he: "רשות הרגולציה לאנרגיה של קפריסין (CERA): רגולטור עצמאי המפקח על שוק החשמל, מעניק רישיונות ומגדיר תעריפים.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Market Licensing", "Tariff Approval", "Regulatory Compliance", "Grid Code Supervision"],
    notableProjects: "Competitive Electricity Market Model Rules, Storage Tariff Framework",
    certifications: "National Energy Regulator",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-tsoc",
    name: "Transmission System Operator Cyprus (TSOC / DSM)",
    type: "Company",
    roleOrCategory: "Independent Transmission System Operator",
    email: "info@tsoc.org.cy",
    phone: "+357 22 201600",
    location: "Nicosia, Cyprus",
    category: "Electricity & Trading",
    expertiseTags: ["Smart Grids", "Energy Trading", "Microgrids", "Policy & Regulatory"],
    imageUrl: "/logos/tsoc.svg",
    logoUrl: "/logos/tsoc.svg",
    website: "https://www.tsoc.org.cy",
    keyContactName: "TSOC Dispatch Center",
    description: "Independent operator ensuring Cyprus high-voltage power system balance, dispatching generation, and running wholesale electricity market settlement.",
    description_el: "Διαχειριστής Συστήματος Μεταφοράς Κύπρου (ΔΣΜΚ): Υπεύθυνος για την ευστάθεια του δικτύου και τη λειτουργία της ανταγωνιστικής αγοράς.",
    description_ru: "Независимый оператор системы передачи Кипра (TSOC): балансировка высоковольтной сети и оперативное управление энергорынка.",
    description_he: "מפעיל מערכת ההולכה של קפריסין (TSOC): ניהול איזון רשת החשמל במתח גבוה ותפעול שוק החשמל הסיטונאי.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["High Voltage System Operation", "Wholesale Settlement", "Renewable Curtailment Dispatch"],
    notableProjects: "Cyprus Electricity Market Management System (MMS), EMS SCADA Upgrade",
    certifications: "ENTSO-E Partner Operator",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },

  // MECI Certified Solar PV Installers & Distributors
  {
    id: "member-bigsolar",
    name: "Big Solar Cyprus Ltd",
    type: "Company",
    roleOrCategory: "MECI Registered PV Installer & Distributor",
    email: "info@bigsolar.com.cy",
    phone: "+357 22 870000",
    location: "Nicosia, Cyprus",
    category: "Renewables",
    expertiseTags: ["Solar PV", "EPC", "Energy Efficiency", "O&M"],
    imageUrl: "/logos/bigsolar.svg",
    logoUrl: "/logos/bigsolar.svg",
    website: "https://www.bigsolar.com.cy",
    keyContactName: "Commercial Sales Dept",
    description: "Ministry-certified PV system installer and equipment distributor providing commercial net billing, energy efficiency upgrades, and solar power plants.",
    description_el: "Πιστοποιημένος εγκαταστάτης φωτοβολταϊκών ΥΕΕΒΚ και διανομέας εξοπλισμού, παρέχοντας συστήματα net billing, ενεργειακές αναβαθμίσεις και φωτοβολταϊκά πάρκα.",
    description_ru: "Авторизованный MECI инсталлятор фотоэлектрических систем и дистрибьютор оборудования: коммерческий Net Billing, энергоаудит и солнечные станции.",
    description_he: "מתקין מערכות סולאריות מורשה משרד האנרגיה ומפיץ ציוד, המספק מערכות נτ-בילינג מסחריות, שדרוגי התייעלות אנרגטית ותחנות כוח סולאריות.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Commercial Net Billing PV", "Tier-1 Module Distribution", "Industrial Rooftop Systems", "O&M Servicing"],
    notableProjects: "10MW Commercial PV Rooftops in Nicosia & Larnaca",
    certifications: "MECI Certified PV Installer, ISO 9001",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-cgpsolar",
    name: "CGP Solar Systems Ltd",
    type: "Company",
    roleOrCategory: "MECI Certified PV & Battery Systems Contractor",
    email: "info@cgpsolar.com",
    phone: "+357 25 343434",
    location: "Limassol, Cyprus",
    category: "Renewables",
    expertiseTags: ["Solar PV", "Energy Storage", "EPC", "Energy Efficiency"],
    imageUrl: "/logos/cgpsolar.svg",
    logoUrl: "/logos/cgpsolar.svg",
    website: "https://www.cgpsolar.com",
    keyContactName: "Engineering Team",
    description: "MECI-registered renewable installer specializing in residential net-metering, commercial net-billing PV, and hybrid battery storage integration.",
    description_el: "Εγγεγραμμένος εγκαταστάτης ΑΠΕ στο ΥΕΕΒΚ, με εξειδίκευση σε net-metering κατοικιών, εμπορικά φωτοβολταϊκά net-billing και ενσωμάτωση μπαταριών.",
    description_ru: "Сертифицированный MECI подрядчик по солнечной энергетике: домашние системы Net Metering, коммерческий Net Billing и накопители энергии.",
    description_he: "קבלן מערכות סולאריות מוסמך MECI המתמחה בנט-מטרינג למגורים, נט-בילינג מסחרי ושילוב אגירת אנרגיה בסוללות.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Residential Net Metering", "Hybrid PV & BESS Storage", "Commercial Net Billing", "EV Charger Setup"],
    notableProjects: "500+ Residential & Commercial Rooftop Systems across Limassol District",
    certifications: "MECI Registered Renewable Contractor, TUV Certified",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-firstelectric",
    name: "First Electric Solar Ltd",
    type: "Company",
    roleOrCategory: "MECI Licensed Electrical & PV Engineering Contractor",
    email: "contact@firstelectric.com.cy",
    phone: "+357 24 636363",
    location: "Larnaca, Cyprus",
    category: "Engineering & EPC",
    expertiseTags: ["Solar PV", "EPC", "Smart Grids", "Energy Efficiency"],
    imageUrl: "/logos/firstelectric.svg",
    logoUrl: "/logos/firstelectric.svg",
    website: "https://www.firstelectric.com.cy",
    keyContactName: "Technical Director",
    description: "Licensed electrical engineering and solar installation contractor providing turnkey rooftop PV installations and industrial power upgrades.",
    description_el: "Αδειούχος εργολήπτης ηλεκτρολογικών και φωτοβολταϊκών έργων, παρέχοντας ολοκληρωμένες εγκαταστάσεις στέγης και βιομηχανικές αναβαθμίσεις.",
    description_ru: "Лицензированный MECI электротехнический и солярный подрядчик: монтаж крышных СЭС под ключ и модернизация промышленных вводов.",
    description_he: "קבלן הנדסת חשמל וסולאר מורשה, המספק התקנות סולאריות על גגות במתכונת עד המפתח ושדרוגי רשת תעשייתיים.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Turnkey PV Engineering", "Industrial Switchgear & Transformers", "Grid Connection Permitting"],
    notableProjects: "Aradippou Industrial Park Solar Rooftops & Substation Upgrade",
    certifications: "MECI Licensed Electrical Contractor Class A",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-zotiades",
    name: "Zotiades Energy Solutions Ltd",
    type: "Company",
    roleOrCategory: "MECI Registered Solar Installer & Energy Management",
    email: "info@zotiades.com",
    phone: "+357 22 454545",
    location: "Nicosia, Cyprus",
    category: "Renewables",
    expertiseTags: ["Solar PV", "Energy Efficiency", "O&M", "EV Infrastructure"],
    imageUrl: "/logos/zotiades.svg",
    logoUrl: "/logos/zotiades.svg",
    website: "https://www.zotiades.com",
    keyContactName: "Solar Department",
    description: "Certified solar installer delivering high-efficiency photovoltaic panels, heat pump integration, and smart energy monitoring across Cyprus.",
    description_el: "Πιστοποιημένος εγκαταστάτης φωτοβολταϊκών υψηλής απόδοσης, αντλιών θερμότητας και συστημάτων έξυπνης ενεργειακής παρακολούθησης.",
    description_ru: "Сертифицированный инсталлятор СЭС: высокоэффективные солнечные панели, тепловые насосы и системы умного энергомониторинга.",
    description_he: "מתקין סולארי מוסמך המספק פאנלים סולאריים בעלי נצילות גבוהה, שילוב משאבות חום וניטור אנרגיה חכם ברחבי קפריסין.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Solar PV Installation", "Heat Pump Systems", "Energy Audit & Monitoring", "Maintenance Contracts"],
    notableProjects: "Nicosia Commercial Complex PV & Smart HVAC Integration",
    certifications: "MECI Certified PV Installer",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },

  // Biomass Waste-to-Energy Plants
  {
    id: "member-cypra",
    name: "Cypra Bioenergy Ltd",
    type: "Company",
    roleOrCategory: "Biomass Waste-to-Energy & Biogas Generation Facility",
    email: "info@cypra.com.cy",
    phone: "+357 22 822800",
    location: "Kato Moni, Nicosia, Cyprus",
    category: "Renewables",
    expertiseTags: ["ESG & Environmental", "Energy Storage", "Project Management", "O&M"],
    imageUrl: "/logos/cypra.svg",
    logoUrl: "/logos/cypra.svg",
    website: "https://www.cypra.com.cy",
    keyContactName: "Plant Operations Manager",
    description: "Cyprus’s premier waste-to-energy biomass biogas plant converting livestock and agricultural waste into green grid electricity and organic fertilizer.",
    description_el: "Η μεγαλύτερη μονάδα βιοαερίου και βιομάζας στην Κύπρο, που μετατρέπει γεωργοκτηνοτροφικά απόβλητα σε πράσινη ηλεκτρική ενέργεια.",
    description_ru: "Крупнейшая на Кипре биогазовая станция на биоμαссе: переработка сельскохозяйственных отходов в зеленую электроэнергию и органические удобрения.",
    description_he: "מפעל הביומסה והביוגז המוביל בקפריסין להפקת אנרגיה מפסולת, הממיר פסולת חקלאית לחשמל ירוק ודשν אורגני.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Anaerobic Biogas Power Generation", "Organic Waste Treatment", "Bio-Fertilizer Production", "Grid Energy Feed-in"],
    notableProjects: "3.5MW Waste-to-Energy Biogas Generation Facility at Kato Moni",
    certifications: "CERA Licensed Independent Power Producer, ISO 14001",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-akerasi",
    name: "Akerasi Bioenergy Plant",
    type: "Company",
    roleOrCategory: "Agricultural Biogas & Biomass Cogeneration Plant",
    email: "contact@akerasi.com.cy",
    phone: "+357 24 727200",
    location: "Larnaca District, Cyprus",
    category: "Renewables",
    expertiseTags: ["ESG & Environmental", "EPC", "Energy Efficiency"],
    imageUrl: "/logos/akerasi.svg",
    logoUrl: "/logos/akerasi.svg",
    website: "https://www.akerasi.com.cy",
    keyContactName: "Biomass Operations",
    description: "Anaerobic digestion biomass plant generating renewable electricity and thermal energy for agro-industrial processing facilities.",
    description_el: "Μονάδα βιομάζας αναερόβιας χώνευσης για παραγωγή ανανεώσιμης ηλεκτρικής και θερμικής ενέργειας για αγροβιομηχανικές εγκαταστάσεις.",
    description_ru: "Биогазовая станция анаэробного сбраживания биомассы: выработка возобновляемой электроэнергии и тепла для агропромышленных объектов.",
    description_he: "תחנת קוגנרציה לביומסה וביוגז חקלאי המפיקה חשמל ואנרגיה תרמית מתחדשת עבור מתקני עיבוד אגרו-תעשייתיים.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Biomass Combined Heat & Power (CHP)", "Agro-Waste Valorization", "Thermal Energy Supply"],
    notableProjects: "1.8MW Biogas CHP Facility connected to EAC Distribution Grid",
    certifications: "CERA Generation License, Environmental Permit A",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-abio",
    name: "ABIO Biomass Energy Ltd",
    type: "Company",
    roleOrCategory: "Biomass Logistics & Solid Biofuel Processing",
    email: "info@abio.com.cy",
    phone: "+357 25 717100",
    location: "Limassol, Cyprus",
    category: "Renewables",
    expertiseTags: ["ESG & Environmental", "O&M", "Project Management"],
    imageUrl: "/logos/abio.svg",
    logoUrl: "/logos/abio.svg",
    website: "https://www.abio.com.cy",
    keyContactName: "Supply Chain Manager",
    description: "Biomass processing plant and solid biofuel producer supplying eco-friendly wood pellets and olive-pomace biomass for industrial boilers.",
    description_el: "Μονάδα επεξεργασίας βιομάζας και παραγωγής στερεών βιοκαυσίμων (πέλετ, πυρηνόξυλο) για βιομηχανικούς λέβητες.",
    description_ru: "Завод по переработке биомассы и производству твердого биотоплива (пеллеты, оливковый жмых) для промышленных котельных.",
    description_he: "מפעל עיבוד ביומסה וייצור דלק ביולוגי מוצק המספק שבבי עץ וגפת זיתים עבור דודים תעשייתיים.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Solid Biofuel Manufacturing", "Olive Pomace Drying & Pelletizing", "Industrial Biomass Logistics"],
    notableProjects: "Supply Contract for Cyprus Industrial Steam & Heating Systems",
    certifications: "ENplus A1 Pellet Quality Certification",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },

  // Grid Engineering & HV EPC Contractors
  {
    id: "member-caramondani",
    name: "Caramondani Energy Solutions (Caramondani Bros PLC)",
    type: "Company",
    roleOrCategory: "HV Substation & Power Grid EPC Engineering",
    email: "info@caramondani.com.cy",
    phone: "+357 22 816000",
    location: "Nicosia, Cyprus",
    category: "Engineering & EPC",
    expertiseTags: ["Smart Grids", "EPC", "Energy Storage", "Project Management"],
    imageUrl: "/logos/caramondani.svg",
    logoUrl: "/logos/caramondani.svg",
    website: "https://www.caramondani.com.cy",
    linkedin: "https://www.linkedin.com/company/caramondani-group",
    keyContactName: "Infrastructure Dept",
    description: "Pioneer engineering firm constructed high-voltage electrical substations, grid interconnections, and utility-scale power systems in Cyprus.",
    description_el: "Πρωτοπόρος εταιρεία ηλεκτρολογικής μηχανικής, με κατασκευές υποσταθμών υψηλής τάσης, διασυνδέσεων δικτύου και ενεργειακών υποδομών.",
    description_ru: "Ведущая инжиниринговая компания: строительство высоковольтных подстанций, сетевых присоединений и объектов электроэнергетики.",
    description_he: "חברת הנדסה מובילה העוסקת בהקמת תחנות משנה במתח גבוה, חיבורי רשת חשמל ומערכות כוח בקנה מידה ארצי.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["132kV Substation Construction", "Power Grid Interconnections", "BESS Storage Enclosures", "MEP Engineering"],
    notableProjects: "EAC 132kV/11kV Substation EPC Contracts & Solar Park Substation Interconnections",
    certifications: "Class A Electrical Contractor, ISO 9001 / ISO 45001",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-ergo",
    name: "Ergo Energy Contractors (Ergoleptiki Ltd)",
    type: "Company",
    roleOrCategory: "High-Voltage Grid & Transmission Line Engineers",
    email: "info@ergo.com.cy",
    phone: "+357 25 383838",
    location: "Limassol, Cyprus",
    category: "Engineering & EPC",
    expertiseTags: ["Smart Grids", "EPC", "O&M", "Project Management"],
    imageUrl: "/logos/ergo.svg",
    logoUrl: "/logos/ergo.svg",
    website: "https://www.ergo.com.cy",
    keyContactName: "Power Projects Div",
    description: "Specialized grid infrastructure contractor building medium and high voltage transmission lines, distribution networks, and transformer stations.",
    description_el: "Εξειδικευμένος εργολήπτης υποδομών δικτύου, κατασκευάζοντας γραμμές μεταφοράς μέσης/υψηλής τάσης και μετασχηματιστές.",
    description_ru: "Подрядчик сетевой инфраструктуры: строительство ЛЭП среднего и высокого напряжения, распределительных сетей и трансформаторных станций.",
    description_he: "קבלן תשתיות רשת מתמחה הבונה קווי הולכה במתח בינוני וגבוה, רשתות חלוקה ותחנות שנאים.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["MV/HV Overhead Lines & Underground Cabling", "Substation Automation", "Transformer Maintenance"],
    notableProjects: "Overhead Grid Connection Lines for Utility Solar Parks in Paphos & Larnaca",
    certifications: "Registered Civil & Electrical Contractor",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-tpad",
    name: "TPA Development & Grid Engineering (TPAD)",
    type: "Company",
    roleOrCategory: "Power Systems Engineering & Grid Stability Analysis",
    email: "info@tpad.com.cy",
    phone: "+357 22 313131",
    location: "Nicosia, Cyprus",
    category: "Engineering & EPC",
    expertiseTags: ["Smart Grids", "PPA Structuring", "Project Management", "Financial Advisory"],
    imageUrl: "/logos/tpad.svg",
    logoUrl: "/logos/tpad.svg",
    website: "https://www.tpad.com.cy",
    keyContactName: "Chief Grid Consultant",
    description: "Power grid engineering and consultancy firm executing dynamic grid stability studies, TSOC compliance modeling, and renewable integration.",
    description_el: "Εταιρεία σύμβουλων μηχανικών ηλεκτρικών συστημάτων, μελέτες ευσταθείας δικτύου, μοντελοποίηση TSOC και σύνδεση ΑΠΕ.",
    description_ru: "Инжиниринговая компания: моделирование устойчивости энергосистем, расчеты режимов для TSOC и интеграция возобновляемых источников.",
    description_he: "חברת הנדסת מערכות כוח ומחקר המבצעת ניתוחי יציבות רשת דינמיים, מידול תאימות ל-TSOC ושילוב אנרגיה מתחדשת.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Power Flow & Transient Stability Analysis", "TSOC Grid Code Compliance Modeling", "BESS Sizing"],
    notableProjects: "Dynamic Grid Impact Studies for 50MW+ Hybrid Battery Storage Facilities",
    certifications: "IEEE Member Consultants, ETEK Registered Engineers",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },

  // Major Developers, Distributors & Oil/Gas Majors
  {
    id: "member-bioland",
    name: "Bioland Energy Group",
    type: "Company",
    roleOrCategory: "Utility Solar Park Developer & PPA Supplier",
    email: "info@biolandenergy.com",
    phone: "+357 24 532200",
    location: "Larnaca, Cyprus",
    category: "Renewables",
    expertiseTags: ["Solar PV", "Energy Storage", "EPC", "Energy Trading", "PPA Structuring"],
    imageUrl: "/logos/bioland.svg",
    logoUrl: "/logos/bioland.svg",
    website: "https://www.biolandenergy.com",
    linkedin: "https://www.linkedin.com/company/bioland-energy",
    keyContactName: "Project Development Team",
    description: "Leading independent power producer developing utility-scale solar PV parks, commercial net billing, and battery storage across Cyprus.",
    description_el: "Ηγετικός ανεξάρτητος παραγωγός ενέργειας με φωτοβολταϊκά πάρκα μεγάλης κλίμακας, net billing και αποθήκευση μπαταριών.",
    description_ru: "Ведущий независимый производитель электроэнергии: промышленные солнечные парки, Net Billing и накопители энергии.",
    description_he: "יצרן חשמל עצמאי מוביל המפתח פארקים סולאריים בקנה מידה מסחרי, נט-בילינג ואגירת אנרגיה בסוללות.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Utility PV Park EPC", "BESS Battery Storage", "Corporate PPA Supply", "Commercial Net Billing"],
    notableProjects: "over 100MW operational utility solar parks connected across Cyprus grid",
    certifications: "CERA Licensed IPP, ISO 9001",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-geg",
    name: "Green Energy Group (GEG)",
    type: "Company",
    roleOrCategory: "Integrated Renewables & Storage Systems",
    email: "info@geg.com.cy",
    phone: "+357 25 734800",
    location: "Limassol, Cyprus",
    category: "Energy Storage",
    expertiseTags: ["Solar PV", "Energy Storage", "Microgrids", "EPC", "Energy Trading"],
    imageUrl: "/logos/geg.svg",
    logoUrl: "/logos/geg.svg",
    website: "https://geg.com.cy",
    keyContactName: "Corporate Services",
    description: "Turnkey engineering and installation firm delivering commercial PV parks, hybrid battery storage systems, and industrial electrical projects.",
    description_el: "Ολοκληρωμένες λύσεις μηχανικής για φωτοβολταϊκά πάρκα, συστήματα αποθήκευσης ενέργειας με μπαταρίες και βιομηχανικά έργα.",
    description_ru: "Инженерная компания полного цикла: коммерческие солнечные парки, гибридные системы хранения энергии (BESS) и промышленный монтаж.",
    description_he: "חברת הנדסה והתקנה המספקת פארקים סולאריים מסחריים, מערכות אגירת אנרגיה היברידיות ופרויקטי חשמל תעשייתיים.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Hybrid Storage & Solar EPC", "Industrial Electrical Contracting", "BESS Optimization"],
    notableProjects: "Commercial BESS Hybrid Pilot Systems & Utility Solar Parks",
    certifications: "MECI Certified & CERA Licensed Operator",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-lanitis",
    name: "Lanitis Energy",
    type: "Company",
    roleOrCategory: "PV Equipment Distribution & Commercial EPC",
    email: "info@lanitisenergy.com",
    phone: "+357 25 820000",
    location: "Limassol, Cyprus",
    category: "Renewables",
    expertiseTags: ["Solar PV", "EPC", "Project Management", "O&M"],
    imageUrl: "/logos/lanitis.svg",
    logoUrl: "/logos/lanitis.svg",
    website: "https://lanitisenergy.com",
    keyContactName: "Energy Division",
    description: "Part of Lanitis Group, offering Tier-1 solar panel supply, premium inverters, and turnkey photovoltaic installations for corporate facilities.",
    description_el: "Μέλος του Ομίλου Λανίτη, προσφέρει κορυφαίο εξοπλισμό φωτοβολταϊκών, μετατροπείς και ολοκληρωμένες εγκαταστάσεις για επιχειρήσεις.",
    description_ru: "Подразделение Lanitis Group: официальные поставки Tier-1 фотомодулей, сетевых инверторов и EPC-проекты для корпоративного сектора.",
    description_he: "חלק מקבוצת לניטיס, המספקת ציוד סולארי באיכות Tier-1, ממירים מתקדמים והתקנות פוטו-וולטאיות עד המפתח עבור חברות.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Tier-1 Solar Wholesale Distribution", "Corporate Net Billing PV", "Operations & Maintenance"],
    notableProjects: "Lanitis Carob Mill Rooftop PV & Logistics Hub Solarization",
    certifications: "ISO 9001, Tier-1 Official Distributor",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-conercon",
    name: "Conercon Energy Solutions",
    type: "Company",
    roleOrCategory: "Commercial PV EPC & Energy Efficiency Contracting",
    email: "info@conercon.com",
    phone: "+357 24 848000",
    location: "Larnaca, Cyprus",
    category: "Renewables",
    expertiseTags: ["Solar PV", "EPC", "O&M", "Energy Efficiency"],
    imageUrl: "/logos/conercon.svg",
    logoUrl: "/logos/conercon.svg",
    website: "https://conercon.com",
    keyContactName: "Petrolina Group Energy Dept",
    description: "Subsidiary of Petrolina Group delivering large-scale commercial solar parks, energy saving solutions, and EPC contracting.",
    description_el: "Θυγατρική του Ομίλου Petrolina με εξειδίκευση σε μεγάλα εμπορικά φωτοβολταϊκά πάρκα και ενεργειακές λύσεις εξοικονόμησης.",
    description_ru: "Дочерняя компания Petrolina Group: строительство масштабных коммерческих солнечных парков и энергосберегающие решения под ключ.",
    description_he: "חברת בת של קבוצת פטרולינה המספקת פארקים סולאריים מסחריים בקנה מידה רחב, פתרונות חיסכון באנרגיה וקבלנות EPC.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Petrolina Fuel Station Solarization", "Commercial Net Billing Systems", "Energy Management"],
    notableProjects: "Petrolina Terminal Solarization & Commercial PV Parks across Larnaca",
    certifications: "MECI Certified Energy Contractor",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-greenh2",
    name: "GreenH2CY Ltd",
    type: "Company",
    roleOrCategory: "Green Hydrogen Production & Refueling Station",
    email: "contact@greenh2.cy",
    phone: "+357 22 876696",
    location: "Nicosia / Limassol, Cyprus",
    category: "Hydrogen",
    expertiseTags: ["Hydrogen", "ESG & Environmental", "Project Management", "Policy & Regulatory"],
    imageUrl: "/logos/greenh2.svg",
    logoUrl: "/logos/greenh2.svg",
    website: "https://wincono.com",
    linkedin: "https://www.linkedin.com/company/greenh2cy",
    keyContactName: "Green Hydrogen Project Office",
    description: "Developing Cyprus’s first green hydrogen production plant and HRS refueling station for heavy transport and industrial decarbonization.",
    description_el: "Ανάπτυξη του πρώτου σταθμού παραγωγής πράσινου υδρογόνου και σταθμού ανεφοδιασμού για βαρέα οχήματα στην Κύπρο.",
    description_ru: "Разработчик первого на Кипре завода по производству зеленого водорода и сети заправочных станций для тяжелого грузового транспорта.",
    description_he: "פיתוח מפעל הייצור הראשון בקפריסין למימן ירוק ותחנת תדלוק לתחבורה כבדה ודקרבוניזציה תעשייתית.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Water Electrolysis Green H2", "Heavy Transport Refueling (HRS)", "Industrial Decarbonization Studies"],
    notableProjects: "EU Innovation Fund GreenH2CY Project at Nicosia/Limassol Corridor",
    certifications: "EU Hydrogen Strategy Flagship Project",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-solarenergy",
    name: "Solar Energy Concepts Cyprus",
    type: "Company",
    roleOrCategory: "Residential & Commercial Rooftop PV EPC",
    email: "info@solarenergy.com.cy",
    phone: "+357 25 388880",
    location: "Limassol, Cyprus",
    category: "Renewables",
    expertiseTags: ["Solar PV", "Energy Storage", "EPC", "Energy Efficiency"],
    imageUrl: "/logos/solarenergy.svg",
    logoUrl: "/logos/solarenergy.svg",
    website: "https://solarenergy.com.cy",
    keyContactName: "Engineering Sales",
    description: "Engineering and installation of high-efficiency rooftop PV systems, battery integration, and electrical upgrades across Limassol and Paphos.",
    description_el: "Σχεδιασμός και εγκατάσταση φωτοβολταϊκών συστημάτων υψηλής απόδοσης, ενσωμάτωση μπαταριών και ηλεκτρολογικές αναβαθμίσεις.",
    description_ru: "Проектирование и монтаж высокоэффективных кровельных СЭС, интеграция накопителей энергии и модернизация вводов питания.",
    description_he: "הנדסה והתקנה של מערכות פוטו-וולטאיות בעלות נצילות גבוהה על גגות, שילוב סוללות ושדרוגי חשמל.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Rooftop PV Design", "Battery Storage Integration", "Subsidized Grant Application Assistance"],
    notableProjects: "Commercial Rooftops in Limassol & Luxury Villa PV Installations in Paphos",
    certifications: "MECI Certified PV Installer",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-lighthief",
    name: "Lighthief Cyprus Ltd",
    type: "Company",
    roleOrCategory: "PV Diagnostics, Mobile Laboratory & Module Recycling",
    email: "info@lighthief.com.cy",
    phone: "+357 22 250000",
    location: "Nicosia, Cyprus",
    category: "Renewables",
    expertiseTags: ["Solar PV", "O&M", "ESG & Environmental", "Project Management"],
    imageUrl: "/logos/lighthief.svg",
    logoUrl: "/logos/lighthief.svg",
    website: "https://lighthief.com.cy",
    keyContactName: "Diagnostics & Recycling Operations",
    description: "Specialized operation, mobile laboratory EL testing, thermographic diagnostics, and PV panel recycling solutions.",
    description_el: "Εξειδικευμένες υπηρεσίες συντήρησης, θερμογραφικών ελέγχων και ανακύκλωσης φωτοβολταϊκών συστημάτων στην Κύπρο.",
    description_ru: "Сервисное обслуживание, мобильное электролюминесцентное тестирование, тепловизионная диагностика и переработка солнечных панелей.",
    description_he: "שירותי תחזוקה מתמחים, בדיקות אלקטרולומינסנציה במעבדה ניידת, דיאגנוסטיקה תרמוגרפית ופתרונות מחזור פאנלים סולאריים.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Mobile EL Testing Lab", "Thermographic Drone Audits", "PV Panel Recycling & Decommissioning"],
    notableProjects: "Quality Audits on 20MW+ Utility Solar Parks in Cyprus",
    certifications: "ISO 17025 Compliant Mobile Lab",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-suntechnics",
    name: "Suntechnics Ltd",
    type: "Company",
    roleOrCategory: "Utility PV EPC & Commercial Storage Integration",
    email: "info@suntechnics.biz",
    phone: "+357 22 865500",
    location: "Nicosia, Cyprus",
    category: "Renewables",
    expertiseTags: ["Solar PV", "Energy Storage", "Microgrids", "EPC", "EV Infrastructure"],
    imageUrl: "/logos/suntechnics.svg",
    logoUrl: "/logos/suntechnics.svg",
    website: "https://suntechnics.biz",
    keyContactName: "Green Energy Group Division",
    description: "Member of Green Energy Group, providing EPC services for utility-scale solar parks, residential net billing, and electric vehicle charging.",
    description_el: "Μέλος του Ομίλου Green Energy, παρέχει υπηρεσίες EPC για φωτοβολταϊκά πάρκα, οικιακά συστήματα και φόρτιση ηλεκτρικών οχημάτων.",
    description_ru: "Подразделение Green Energy Group: проектирование и монтаж промышленных солнечных станций, бытовых систем и зарядных станций для EV.",
    description_he: "חלק מקבוצת גרין אנרג'י, המספקת שירותי EPC לפארקים סולאריים מסחריים, נט-בילינג למגורים ועמדות טעינה לרכב חשמלי.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Utility Solar Park EPC", "EV Fast Charging Networks", "Commercial Energy Storage"],
    notableProjects: "Utility Solar Parks across Nicosia & Commercial Net Billing Systems",
    certifications: "MECI Certified & ISO 9001",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-muskita",
    name: "Muskita Solar Systems",
    type: "Company",
    roleOrCategory: "Aluminum PV Mounting Systems Manufacturer",
    email: "info@muskitasolar.com",
    phone: "+357 25 844444",
    location: "Limassol, Cyprus",
    category: "Engineering & EPC",
    expertiseTags: ["Solar PV", "EPC", "Project Management"],
    imageUrl: "/logos/muskita.svg",
    logoUrl: "/logos/muskita.svg",
    website: "https://muskitasolar.com",
    keyContactName: "Technical Aluminum Dept",
    description: "Engineering and manufacturing of specialized high-grade aluminum mounting structures for rooftop and ground-mounted PV systems.",
    description_el: "Σχεδιασμός και κατασκευή εξειδικευμένων συστημάτων στήριξης αλουμινίου για φωτοβολταϊκές εγκαταστάσεις στέγης και εδάφους.",
    description_ru: "Проектирование и производство высокопрочных алюминиевых опорных конструкций для наземных и кровельных солнечных электростанций.",
    description_he: "הנדסה וייצור של קונסטרוקציות אלומיניום מתקדמות להתקנת מערכות סולאריות על גגות וקרקע.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Custom Aluminum Solar Racking", "Ground Mount Ballasted Structures", "Wind Load Engineering"],
    notableProjects: "Custom mounting structures for over 80MW solar parks in Cyprus and Greece",
    certifications: "CE Marking, Eurocode 1 & 9 Structural Certification",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-wincono",
    name: "Wincono Cyprus Ltd",
    type: "Company",
    roleOrCategory: "Wind Energy Park Operator & Developer",
    email: "info@wincono.com",
    phone: "+357 22 876696",
    location: "Nicosia, Cyprus",
    category: "Renewables",
    expertiseTags: ["Wind Power", "O&M", "ESG & Environmental", "PPA Structuring"],
    imageUrl: "/logos/wincono.svg",
    logoUrl: "/logos/wincono.svg",
    website: "https://wincono.com",
    keyContactName: "Operations Management",
    description: "Developer and operator of wind energy parks in Cyprus, including Orites and Alexigros wind power plants.",
    description_el: "Ανάπτυξη και διαχείριση αιολικών πάρκων στην Κύπρο, συμπεριλαμβανομένων των αιολικών πάρκων Ορείτες και Αλεξίγρος.",
    description_ru: "Девелопер и оператор ветропарков на Кипре, включая ветроэлектростанции Orites и Alexigros.",
    description_he: "מפתח ומפעיל של חוות רוח בקפריסין, כולל תחנות הרוח באורייטס ואלכסיגרוס.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Wind Farm Operations", "Turbine Maintenance", "Grid Power PPA Management"],
    notableProjects: "82MW Orites Wind Park & Alexigros Wind Farm",
    certifications: "CERA Generation License Operator",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-kenergy",
    name: "K-Energy by Karantokis",
    type: "Company",
    roleOrCategory: "Commercial & Residential Photovoltaic Systems",
    email: "info@k-energy.com.cy",
    phone: "+357 22 311234",
    location: "Nicosia, Cyprus",
    category: "Renewables",
    expertiseTags: ["Solar PV", "Energy Efficiency", "EPC"],
    imageUrl: "/logos/kenergy.svg",
    logoUrl: "/logos/kenergy.svg",
    website: "https://www.k-energy.com.cy",
    keyContactName: "Engineering Team",
    description: "Leading solar engineering and installer firm delivering net billing solutions, insulation upgrades, and commercial solar plants.",
    description_el: "Κορυφαία εταιρεία φωτοβολταϊκών συστημάτων, προσφέροντας net billing, θερμομονώσεις και εμπορικά φωτοβολταϊκά.",
    description_ru: "Инженерная компания по монтажу СЭС: решения Net Billing, теплоизоляция и коммерческие солнечные установки.",
    description_he: "חברת הנדסה סולארית מובילה המספקת פתרונות נט-בילינג, שדרוגי בידוד ותחנות כוח סולאריות מסחריות.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Photovoltaic Installation", "Energy Efficiency Audits", "Net Billing Permitting"],
    notableProjects: "Commercial & Educational Facility Rooftop PV Installations",
    certifications: "MECI Certified Installer",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-petrolina",
    name: "Petrolina Holdings Public Ltd",
    type: "Company",
    roleOrCategory: "Conventional Power & Renewable Energy Development",
    email: "info@petrolina.com.cy",
    phone: "+357 24 848000",
    location: "Larnaca, Cyprus",
    category: "Oil & Gas",
    expertiseTags: ["Petroleum", "Solar PV", "LNG Bunkering", "EV Charging"],
    imageUrl: "/logos/petrolina.svg",
    logoUrl: "/logos/petrolina.svg",
    website: "https://www.petrolina.com.cy",
    keyContactName: "Executive Management",
    description: "Leading Cyprus energy conglomerate active in downstream petroleum distribution, renewable energy project development, LNG terminal investments, and nationwide EV charging infrastructure.",
    description_el: "Ηγετικός ενεργειακός όμιλος της Κύπρου με δραστηριότητα στη διανομή πετρελαιοειδών, ανάπτυξη έργων ΑΠΕ, επενδύσεις σε τερματικά ΥΦΑ και υποδομές φόρτισης ηλεκτρικών οχημάτων.",
    description_ru: "Ведущий энергетический конгломерат Кипра, работающий в сбыте нефтепродуктов, девелопменте ВИЭ, инвестициях в терминалы СПГ и электрозарядную инфраструктуру.",
    description_he: "קונגלומרט אנרגיה מוביל בקפריסין הפעיל בהפצת נפט, פיתוח פרויקטי אנרגיה מתחדשת, השקעות במסופי גז טבעי נוזלי ותשתיות טעינת רכב חשמלי.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Fuel Supply & Logistics", "Solar Parks Development", "EV Charging Network (e-Fill)"],
    notableProjects: "Vasiliko Energy Infrastructure Terminal and utility-scale solar developments",
    certifications: "ISO 9001, ISO 14001, OHSAS 18001",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-vttv",
    name: "VTTV - VTT Vasiliko Ltd",
    type: "Company",
    roleOrCategory: "Oil Terminal & Marine Fuel Infrastructure",
    email: "info@vttv.com.cy",
    phone: "+357 24 257000",
    location: "Vasiliko, Larnaca, Cyprus",
    category: "Maritime & Offshore",
    expertiseTags: ["Fuel Storage", "Bunkering", "LNG Terminal", "Maritime Logistics"],
    imageUrl: "/logos/vttv.svg",
    logoUrl: "/logos/vttv.svg",
    website: "http://www.vttv.com.cy",
    keyContactName: "Terminal Operations",
    description: "Deepwater oil and energy storage terminal operator in Vasiliko, serving regional energy transit, marine fuel bunkering, and strategic fuel reserve management for Cyprus.",
    description_el: "Διαχειριστής τερματικού αποθήκευσης πετρελαιοειδών και ενέργειας στο Βασιλικό για διαμετακομιστικό εμπόριο, ανεφοδιασμό πλοίων και στρατηγικά αποθέματα καυσίμων.",
    description_ru: "Оператор глубоководного терминала хранения нефти и топлива в Василико, обеспечивающий транзит, бункеровку и хранение стратегических резервов.",
    description_he: "מפעיל מסוף דלק ואנרגיה במים עמוקים בואסיליקו, המשרת מעבר אנרגיה אזורי, תדלוק אוניות וניהול עתודות דלק אסטרטגיות.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Bulk Fuel Storage", "Deepwater Jetty Operations", "Strategic Reserve Custody"],
    notableProjects: "543,000 m³ capacity Vasiliko Energy Terminal and marine jetty",
    certifications: "ISO 9001, ISO 14001, ISO 45001",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-totalenergies",
    name: "TotalEnergies EP Cyprus BV",
    type: "Company",
    roleOrCategory: "Offshore Exploration & Gas Production",
    email: "contact.cyprus@totalenergies.com",
    phone: "+357 22 028000",
    location: "Nicosia, Cyprus",
    category: "Oil & Gas",
    expertiseTags: ["Offshore Drilling", "Natural Gas", "Exploration", "Offshore Energy"],
    imageUrl: "/logos/total.svg",
    logoUrl: "/logos/total.svg",
    website: "https://totalenergies.com",
    keyContactName: "Country Chair",
    description: "Global energy major conducting offshore natural gas exploration and appraisal in Cyprus Exclusive Economic Zone (EEZ) Blocks 6, 8, and 10.",
    description_el: "Παγκόσμιος ενεργειακός κολοσσός που διεξάγει υπεράκτιες έρευνες και αξιολόγηση φυσικού αερίου στην ΑΟΖ της Κυπριακής Δημοκρατίας.",
    description_ru: "Мировой энергетический гигант, ведущий офшорную разведку и оценку запасов природного газа в ИЭЗ Республики Кипр.",
    description_he: "חברת אנרגיה בינלאומית המובילה חיפושי גז טבעי באזור הכלכלי הבלעדי של קפריסין.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Offshore Hydrocarbon Exploration", "Deepwater Well Appraisal", "Transition Energy Solutions"],
    notableProjects: "Cronos and Zeus gas discoveries in offshore Block 6",
    certifications: "Global HSE Operations Standard",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-eni",
    name: "Eni Cyprus Limited",
    type: "Company",
    roleOrCategory: "Offshore Energy & Natural Gas Exploration",
    email: "info.cyprus@eni.com",
    phone: "+357 22 458000",
    location: "Nicosia, Cyprus",
    category: "Oil & Gas",
    expertiseTags: ["Natural Gas", "Offshore Exploration", "Energy Security", "Deepwater"],
    imageUrl: "/logos/eni.svg",
    logoUrl: "/logos/eni.svg",
    website: "https://www.eni.com",
    keyContactName: "Managing Director",
    description: "Major Italian energy company operating offshore exploration blocks in the Cyprus EEZ, pioneering East Med natural gas development.",
    description_el: "Ιταλική πολυεθνική εταιρεία ενέργειας, διαχειριστής υπεράκτιων τεμαχίων στην Κυπριακή ΑΟΖ για την ανάπτυξη κοιτασμάτων φυσικού αερίου.",
    description_ru: "Крупная итальянская энергетическая компания, оператор офшорных блоков в ИЭЗ Кипра в Восточном Средиземноморье.",
    description_he: "חברת אנרגיה איטלקית המובילה חיפושי גז טבעי ימיים באזור הכלכלי הבלעדי של קפריסין.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Offshore Exploration & Production", "East Med Hydrocarbon Infrastructure", "Decarbonization Technologies"],
    notableProjects: "Calypso and Cronos offshore discoveries in Block 6",
    certifications: "ISO 14001, ISO 45001",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-aos-solar",
    name: "AOS Solar Systems Ltd",
    type: "Company",
    roleOrCategory: "Solar PV & Battery Energy Storage EPC",
    email: "info@aossolar.com.cy",
    phone: "+357 25 340000",
    location: "Limassol, Cyprus",
    category: "Engineering & EPC",
    expertiseTags: ["Commercial PV", "BESS Storage", "EPC Contracting", "Smart Microgrids"],
    imageUrl: "/logos/aos_solar.svg",
    logoUrl: "/logos/aos_solar.svg",
    website: "https://aossolar.com.cy",
    keyContactName: "Engineering Dept",
    description: "Premier EPC contractor specializing in utility-scale solar photovoltaic parks, commercial rooftop installations, and grid-connected battery storage.",
    description_el: "Leading EPC εργολάβος ειδικευμένος σε φωτοβολταϊκά πάρκα μεγάλης κλίμακας, βιομηχανικές στέγες και συστήματα αποθήκευσης μπαταριών.",
    description_ru: "Ведущий EPC-подрядчик, специализирующийся на промышленных СЭС, коммерческих крышных системах и накопителях энергии (BESS).",
    description_he: "קבלן EPC מוביל המתמחה בפארקים סולאריים מסחריים, התקנות גגות תעשייתיות ואגירת אנרגיה בסוללות.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Turnkey PV EPC", "Battery Energy Storage Integration", "O&M Asset Management"],
    notableProjects: "over 45 MW of commercial solar PV & BESS projects across Cyprus",
    certifications: "TÜV Rheinland Certified Installer",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-vassiliko-cement",
    name: "Vassiliko Cement Works Public Company Ltd",
    type: "Company",
    roleOrCategory: "Industrial Energy & Waste-to-Energy Processing",
    email: "info@vassiliko.com",
    phone: "+357 24 845000",
    location: "Vasiliko, Cyprus",
    category: "Engineering & EPC",
    expertiseTags: ["Alternative Fuels", "Waste-to-Energy", "Industrial Decarbonization", "Captive PV"],
    imageUrl: "/logos/vassiliko.svg",
    logoUrl: "/logos/vassiliko.svg",
    website: "https://www.vassiliko.com",
    keyContactName: "Energy & Environment Manager",
    description: "Cyprus industrial heavy weight operating captive solar PV plants and pioneering alternative fuels / waste-to-energy thermal substitution.",
    description_el: "Βιομηχανικός κολοσσός της Κύπρου με ιδιόκτητα φωτοβολταϊκά πάρκα και πρωτοποριακή χρήση εναλλακτικών καυσίμων από απόβλητα.",
    description_ru: "Крупнейшее промышленное предприятие Кипра с собственными СЭС и передовой технологией использования альтернативного топлива из отходов.",
    description_he: "תעשייה כבדה מובילה בקפריסין המפעילה תחנות כוח סולאריות פנימיות ושימוש בדלקים חלופיים לפסולת.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Industrial Energy Efficiency", "Refuse-Derived Fuel Utilization", "Captive Solar Power"],
    notableProjects: "8 MW captive PV installation and 50%+ thermal energy substitution via RDF",
    certifications: "ISO 50001 Energy Management, EMAS",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-ccc",
    name: "Consolidated Contractors Company (CCC) Cyprus",
    type: "Company",
    roleOrCategory: "Energy Infrastructure & Major Pipeline EPC",
    email: "cyprusinfo@ccc.net",
    phone: "+357 22 550000",
    location: "Nicosia, Cyprus",
    category: "Engineering & EPC",
    expertiseTags: ["Pipeline Construction", "LNG Plants", "Power Plants", "Civil EPC"],
    imageUrl: "/logos/ccc.svg",
    logoUrl: "/logos/ccc.svg",
    website: "https://www.ccc.net",
    keyContactName: "Regional Commercial Operations",
    description: "International engineering and construction giant with deep Cyprus presence, executing oil & gas pipelines, power stations, and LNG infrastructure.",
    description_el: "Διεθνής κατασκευαστικός όμιλος με ισχυρή παρουσία στην Κύπρο, εκτελώντας αγωγούς πετρελαίου/αερίου, σταθμούς ηλεκτροπαραγωγής και υποδομές ΥΦΑ.",
    description_ru: "Международный строительно-инжиниринговый гигант, реализующий на Кипре проекты газопроводов, электростанций и инфраструктуры СПГ.",
    description_he: "תאגיד הנדסה ובנייה בינלאומי המבצע בקפריסין צנרת גז ונפט, תחנות כוח ותשתיות גז טבעי נוζלי.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Oil & Gas Pipelines EPC", "Power Generation Engineering", "Heavy Industrial Civil Works"],
    notableProjects: "Vasiliko Energy Masterplan heavy civil and marine pipeline works",
    certifications: "ISO 9001, ISO 14001, ISO 45001",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  },
  {
    id: "member-trikkis",
    name: "Trikkis Energy Ltd",
    type: "Company",
    roleOrCategory: "Solar Energy & Autonomous PV Systems",
    email: "info@trikkisenergy.com",
    phone: "+357 25 726200",
    location: "Limassol, Cyprus",
    category: "Renewables",
    expertiseTags: ["Solar PV", "Energy Storage", "Microgrids"],
    imageUrl: "/logos/trikkis.svg",
    logoUrl: "/logos/trikkis.svg",
    website: "https://trikkisenergy.com",
    keyContactName: "Technical Sales",
    description: "Specialized installer of grid-connected and off-grid autonomous photovoltaic systems and solar thermal integration.",
    description_el: "Εξειδικευμένος εγκαταστάτης διασυνδεδεμένων και αυτόνομων φωτοβολταϊκών συστημάτων και ηλιοθερμικών εφαρμογών.",
    description_ru: "Специализированный монтажник сетевых и автономных фотоэлектрических систем и солнечного теплоснабжения.",
    description_he: "מתקין מומחה של מערכות פוטו-וולטאיות מחוברות לרשת ואוטונומיות ושילוב מערכות סולאריות תרמיות.",
    isVerified: true,
    showDescription: true,
    showLocation: true,
    showWebsite: true,
    showLinkedin: true,
    showEmail: true,
    showPhone: true,
    showKeyContact: true,
    keyServices: ["Off-Grid Autonomous PV", "Solar Thermal Systems", "Residential Net Metering"],
    notableProjects: "Off-grid microgrids and rural agricultural PV installations",
    certifications: "MECI Certified Renewable Installer",
    showKeyServices: true,
    showNotableProjects: true,
    showCertifications: true
  }
];

const DELETED_MEMBERS_KEY = "energeia_deleted_directory_members";
const IN_MEMORY_DELETED_MEMBERS = new Set<string>();

function getDeletedMemberIds(): Set<string> {
  const combined = new Set<string>(IN_MEMORY_DELETED_MEMBERS);
  if (typeof window === "undefined") return combined;
  try {
    const raw = localStorage.getItem(DELETED_MEMBERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const id of parsed) {
          combined.add(String(id));
          IN_MEMORY_DELETED_MEMBERS.add(String(id));
        }
      }
    }
  } catch {
    // ignore storage errors
  }
  return combined;
}

function recordDeletedMember(id: string, name?: string): void {
  IN_MEMORY_DELETED_MEMBERS.add(id);
  if (name) {
    IN_MEMORY_DELETED_MEMBERS.add(`name:${name.toLowerCase()}`);
  }
  const idx = INITIAL_DIRECTORY_MEMBERS.findIndex(m => m.id === id || (name && m.name.toLowerCase() === name.toLowerCase()));
  if (idx !== -1) {
    INITIAL_DIRECTORY_MEMBERS.splice(idx, 1);
  }
  if (typeof window === "undefined") return;
  try {
    const set = getDeletedMemberIds();
    set.add(id);
    if (name) {
      set.add(`name:${name.toLowerCase()}`);
    }
    localStorage.setItem(DELETED_MEMBERS_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.error("Failed to persist deleted member ID:", err);
  }
}

export class DirectoryRepository {
  private static mapSupabaseToMember(item: any): DirectoryMember {
    return {
      id: item.id,
      name: item.company_name || item.name || '',
      type: item.type || 'Individual',
      roleOrCategory: item.role_or_category || '',
      email: item.email || '',
      phone: item.phone || '',
      location: item.location || '',
      category: item.category || '',
      expertiseTags: item.expertise_tags || [],
      imageUrl: item.image_url || '',
      description: item.description || '',
      description_el: item.description_el || '',
      description_ru: item.description_ru || '',
      description_he: item.description_he || '',
      isVerified: item.is_verified || false,
      logoUrl: item.logo_url || item.image_url || '',
      website: item.website || '',
      linkedin: item.linkedin || '',
      keyContactName: item.key_contact_name || '',
      showDescription: item.show_description ?? true,
      showLocation: item.display_location ?? item.show_location ?? true,
      showWebsite: item.display_website ?? item.show_website ?? true,
      showLinkedin: item.display_linkedin ?? item.show_linkedin ?? true,
      showEmail: item.display_email ?? item.show_email ?? true,
      showPhone: item.display_phone ?? item.show_phone ?? true,
      showKeyContact: item.display_contact_name ?? item.show_key_contact ?? true,
      keyServices: item.key_services || [],
      notableProjects: item.notable_projects || '',
      certifications: item.certifications || '',
      showKeyServices: item.display_services ?? item.show_key_services ?? true,
      showNotableProjects: item.display_projects ?? item.show_notable_projects ?? true,
      showCertifications: item.display_certifications ?? item.show_certifications ?? true
    };
  }

  private static mapMemberToSupabase(member: Partial<DirectoryMember>): any {
    const mapped: any = {};
    if (member.name !== undefined) {
      mapped.company_name = member.name || '';
      mapped.name = member.name || ''; // Fallback for name field
    }
    if (member.type !== undefined) mapped.type = member.type || 'Individual';
    if (member.roleOrCategory !== undefined) mapped.role_or_category = member.roleOrCategory || '';
    if (member.email !== undefined) mapped.email = member.email || '';
    if (member.phone !== undefined) mapped.phone = member.phone || null;
    if (member.location !== undefined) mapped.location = member.location || null;
    if (member.category !== undefined) mapped.category = member.category || '';
    if (member.expertiseTags !== undefined) mapped.expertise_tags = member.expertiseTags || [];
    if (member.imageUrl !== undefined) mapped.image_url = member.imageUrl || null;
    if (member.description !== undefined) mapped.description = member.description || '';
    if (member.description_el !== undefined) mapped.description_el = member.description_el || null;
    if (member.description_ru !== undefined) mapped.description_ru = member.description_ru || null;
    if (member.description_he !== undefined) mapped.description_he = member.description_he || null;
    if (member.isVerified !== undefined) mapped.is_verified = member.isVerified ?? false;

    // Supabase specific fields
    if (member.website !== undefined) mapped.website = member.website || null;
    if (member.linkedin !== undefined) mapped.linkedin = member.linkedin || null;
    if (member.keyContactName !== undefined) mapped.key_contact_name = member.keyContactName || null;

    if (member.keyServices !== undefined) {
      mapped.key_services = Array.isArray(member.keyServices)
        ? member.keyServices
        : typeof member.keyServices === 'string'
          ? (member.keyServices as string).split(',').map(s => s.trim()).filter(Boolean)
          : [];
    }
    if (member.notableProjects !== undefined) mapped.notable_projects = member.notableProjects || '';
    if (member.certifications !== undefined) mapped.certifications = member.certifications || '';

    // Visibility Flags
    if (member.showKeyServices !== undefined) mapped.display_services = member.showKeyServices;
    if (member.showNotableProjects !== undefined) mapped.display_projects = member.showNotableProjects;
    if (member.showCertifications !== undefined) mapped.display_certifications = member.showCertifications;
    if (member.showEmail !== undefined) mapped.display_email = member.showEmail;
    if (member.showPhone !== undefined) mapped.display_phone = member.showPhone;
    if (member.showLocation !== undefined) mapped.display_location = member.showLocation;
    if (member.showWebsite !== undefined) mapped.display_website = member.showWebsite;
    if (member.showLinkedin !== undefined) mapped.display_linkedin = member.showLinkedin;
    if (member.showKeyContact !== undefined) mapped.display_contact_name = member.showKeyContact;

    return mapped;
  }

  /**
   * Fetch all participants (unfiltered, for admin dashboard)
   */
  static async getAllParticipants(): Promise<DirectoryMember[]> {
    let remoteMembers: DirectoryMember[] = [];
    let fetchSucceeded = false;
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('id', { ascending: false });

      if (!error && Array.isArray(data)) {
        remoteMembers = data.map(item => this.mapSupabaseToMember(item));
        fetchSucceeded = true;
      }
    } catch (err) {
      console.warn("Failed to fetch participants from Supabase:", err);
    }

    const deletedSet = getDeletedMemberIds();

    if (fetchSucceeded) {
      // Remote Supabase records are the single source of truth
      return remoteMembers.filter(
        m => !deletedSet.has(m.id) && (!m.name || !deletedSet.has(`name:${m.name.toLowerCase()}`))
      );
    }

    // Only fallback to INITIAL_DIRECTORY_MEMBERS if Supabase is completely unreachable
    return INITIAL_DIRECTORY_MEMBERS.filter(
      m => !deletedSet.has(m.id) && (!m.name || !deletedSet.has(`name:${m.name.toLowerCase()}`))
    );
  }

  /**
   * Fetch members from 'participants' collection with search query and multi-tag filtering support
   */
  static async getMembers(
    searchQuery: string = '', 
    activeTags: string[] = [],
    tagMatchMode: 'ALL' | 'ANY' = 'ANY'
  ): Promise<DirectoryMember[]> {
    let results: DirectoryMember[] = [];
    try {
      results = await this.getAllParticipants();
    } catch (err) {
      console.error("Supabase directory fetch failed, returning initial member list:", err);
      const deletedSet = getDeletedMemberIds();
      results = INITIAL_DIRECTORY_MEMBERS.filter(
        m => !deletedSet.has(m.id) && (!m.name || !deletedSet.has(`name:${m.name.toLowerCase()}`))
      );
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();

    return results.filter(member => {
      // Name & text search (exact + partial match)
      const matchesSearch = trimmedQuery === '' || 
        member.name.toLowerCase().includes(trimmedQuery) ||
        member.roleOrCategory.toLowerCase().includes(trimmedQuery) ||
        (member.location && member.location.toLowerCase().includes(trimmedQuery)) ||
        (member.description && member.description.toLowerCase().includes(trimmedQuery)) ||
        (member.description_el && member.description_el.toLowerCase().includes(trimmedQuery)) ||
        (member.description_ru && member.description_ru.toLowerCase().includes(trimmedQuery)) ||
        (member.description_he && member.description_he.toLowerCase().includes(trimmedQuery)) ||
        (member.notableProjects && member.notableProjects.toLowerCase().includes(trimmedQuery)) ||
        (member.certifications && member.certifications.toLowerCase().includes(trimmedQuery)) ||
        member.email.toLowerCase().includes(trimmedQuery) ||
        member.expertiseTags.some(tag => tag.toLowerCase().includes(trimmedQuery));

      // Multi-tag filtering
      let matchesTags = true;
      if (activeTags.length > 0) {
        const memberTagsLower = member.expertiseTags.map(t => t.toLowerCase());
        const memberTypeLower = member.type.toLowerCase();

        if (tagMatchMode === 'ALL') {
          // Member must match ALL selected tags
          matchesTags = activeTags.every(selectedTag => {
            const tagLower = selectedTag.toLowerCase();
            return memberTagsLower.includes(tagLower) || memberTypeLower === tagLower;
          });
        } else {
          // Member must match ANY selected tag
          matchesTags = activeTags.some(selectedTag => {
            const tagLower = selectedTag.toLowerCase();
            return memberTagsLower.includes(tagLower) || memberTypeLower === tagLower;
          });
        }
      }

      return matchesSearch && matchesTags;
    });
  }

  /**
   * Create a member (Admin Panel CRUD)
   */
  static async createMember(member: Omit<DirectoryMember, 'id'>): Promise<DirectoryMember> {
    const mapped = this.mapMemberToSupabase(member);
    const { data, error } = await supabase
      .from('participants')
      .insert([mapped])
      .select();
    if (error) {
      console.error("Failed to create participant in Supabase:", error.message);
      throw error;
    }
    if (!data || data.length === 0) throw new Error('Failed to create member');
    return this.mapSupabaseToMember(data[0]);
  }

  /**
   * Update a member (Admin Panel CRUD)
   */
  static async updateMember(id: string, member: Partial<DirectoryMember>): Promise<DirectoryMember> {
    const mapped = this.mapMemberToSupabase(member);
    const { data, error } = await supabase
      .from('participants')
      .update(mapped)
      .eq('id', id)
      .select();
    if (error) {
      console.error("Failed to update participant in Supabase:", error.message);
      throw error;
    }
    if (!data || data.length === 0) throw new Error('Failed to update member');
    return this.mapSupabaseToMember(data[0]);
  }

  /**
   * Delete a member (Admin Panel CRUD)
   */
  static async deleteMember(id: string): Promise<DirectoryMember> {
    const staticMatch = INITIAL_DIRECTORY_MEMBERS.find(m => m.id === id);
    recordDeletedMember(id, staticMatch?.name);

    let deletedMember: DirectoryMember | null = null;
    try {
      const { data, error } = await supabase
        .from('participants')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error("Failed to delete participant from Supabase:", error.message);
      } else if (data && data.length > 0) {
        deletedMember = this.mapSupabaseToMember(data[0]);
        if (deletedMember.name) {
          recordDeletedMember(id, deletedMember.name);
        }
      }
    } catch (err) {
      console.warn("Supabase participant deletion warning:", err);
    }

    return deletedMember || staticMatch || {
      id,
      name: 'Deleted Member',
      type: 'Individual',
      roleOrCategory: '',
      email: '',
      category: '',
      expertiseTags: []
    };
  }
}
