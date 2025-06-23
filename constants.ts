
import { SolarPanel, PanelType, UsageType, IndianStates, InstallationType, ApplicantType, Service, ProductCategory, Product, LoanPartner, Distributor, Review, User } from './types';

export const PANEL_BRANDS: string[] = [
  'Tata Power Solar', 
  'Waaree Energies', 
  'Adani Solar', 
  'Vikram Solar', 
  'Loom Solar',
  'RenewSys',
  'Goldi Solar',
  'Jakson Solar',
  'Emmvee',
  'Navitas Solar',
  'Saatvik Solar',
  'Spark Solar'
];

const COMMON_REVIEW: Review = { id: 'r1', userName: 'Rajesh K.', rating: 4, comment: 'Good quality panel, performing as expected.', date: '2023-10-15' };
const COMMON_REVIEW_2: Review = { id: 'r2', userName: 'Priya S.', rating: 5, comment: 'Excellent efficiency and great service from the installer.', date: '2023-11-01' };

export const MOCK_SOLAR_PANELS: SolarPanel[] = [
  {
    id: '1',
    brand: 'Tata Power Solar',
    model: 'TP450 Mono PERC',
    pricePerWatt: 30,
    type: PanelType.MONOCRYSTALLINE,
    efficiency: 21.5,
    warranty: '12 years product, 25 years performance',
    certifications: ['IEC 61215', 'IEC 61730', 'BIS'],
    size: '2.1m x 1.05m',
    lifespan: '25+ years',
    subsidyEligible: true,
    imageUrl: 'https://picsum.photos/seed/tata/300/200',
    userRating: 4.5,
    reviews: [COMMON_REVIEW, COMMON_REVIEW_2],
  },
  {
    id: '2',
    brand: 'Waaree Energies',
    model: 'WS-440 Poly',
    pricePerWatt: 28,
    type: PanelType.POLYCRYSTALLINE,
    efficiency: 19.8,
    warranty: '10 years product, 25 years performance',
    certifications: ['IEC 61215', 'IEC 61730', 'ALMM'],
    size: '2.0m x 1.0m',
    lifespan: '25 years',
    subsidyEligible: true,
    imageUrl: 'https://picsum.photos/seed/waaree/300/200',
    userRating: 4.2,
    reviews: [COMMON_REVIEW],
  },
  {
    id: '3',
    brand: 'Adani Solar',
    model: 'AS-500 Bifacial',
    pricePerWatt: 32,
    type: PanelType.MONOCRYSTALLINE,
    efficiency: 22.0,
    warranty: '15 years product, 30 years performance',
    certifications: ['IEC', 'UL', 'BIS'],
    size: '2.2m x 1.1m',
    lifespan: '30 years',
    subsidyEligible: true,
    imageUrl: 'https://picsum.photos/seed/adani/300/200',
    userRating: 4.7,
    reviews: [COMMON_REVIEW_2],
  },
  {
    id: '4',
    brand: 'Vikram Solar',
    model: 'Eldora 455W Mono',
    pricePerWatt: 29,
    type: PanelType.MONOCRYSTALLINE,
    efficiency: 20.8,
    warranty: '12 years product, 27 years performance',
    certifications: ['IEC', 'BIS'],
    size: '2.05m x 1.03m',
    lifespan: '25+ years',
    subsidyEligible: true,
    imageUrl: 'https://picsum.photos/seed/vikram/300/200',
    userRating: 4.3,
    reviews: [COMMON_REVIEW],
  },
   {
    id: '5',
    brand: 'Loom Solar',
    model: 'Shark 440W Mono PERC',
    pricePerWatt: 31,
    type: PanelType.MONOCRYSTALLINE,
    efficiency: 20.6,
    warranty: '10 years product, 25 years performance',
    certifications: ['IEC 61215', 'BIS'],
    size: '2.0m x 1.0m',
    lifespan: '25 years',
    subsidyEligible: true,
    imageUrl: 'https://picsum.photos/seed/loom/300/200',
    userRating: 4.0,
    reviews: [COMMON_REVIEW_2],
  },
  {
    id: '6',
    brand: 'RenewSys',
    model: 'DESERV Galactic Ultra 450W',
    pricePerWatt: 29,
    type: PanelType.MONOCRYSTALLINE,
    efficiency: 20.7,
    warranty: '12 years product, 25 years linear performance',
    certifications: ['IEC', 'BIS', 'UL'],
    size: '2.09m x 1.04m',
    lifespan: '25+ years',
    subsidyEligible: true,
    imageUrl: 'https://picsum.photos/seed/renewsus/300/200',
    userRating: 4.1,
    reviews: [COMMON_REVIEW],
  },
  {
    id: '7',
    brand: 'Goldi Solar',
    model: 'Helios Plus GS-H390',
    pricePerWatt: 27,
    type: PanelType.POLYCRYSTALLINE,
    efficiency: 19.5,
    warranty: '10 years product, 25 years performance',
    certifications: ['IEC', 'BIS', 'TUV'],
    size: '1.98m x 0.99m',
    lifespan: '25 years',
    subsidyEligible: true,
    imageUrl: 'https://picsum.photos/seed/goldi/300/200',
    userRating: 3.9,
    reviews: [],
  },
  {
    id: '8',
    brand: 'Jakson Solar',
    model: 'Helia 445W Mono PERC',
    pricePerWatt: 30,
    type: PanelType.MONOCRYSTALLINE,
    efficiency: 20.4,
    warranty: '12 years product, 25 years performance',
    certifications: ['IEC', 'BIS', 'MNRE'],
    size: '2.01m x 1.0m',
    lifespan: '25 years',
    subsidyEligible: true,
    imageUrl: 'https://picsum.photos/seed/jakson/300/200',
    userRating: 4.0,
    reviews: [COMMON_REVIEW_2],
  },
  {
    id: '9',
    brand: 'Emmvee',
    model: 'Photovoltaic ES-450M',
    pricePerWatt: 28,
    type: PanelType.MONOCRYSTALLINE,
    efficiency: 20.3,
    warranty: '10 years product, 25 years power output',
    certifications: ['IEC', 'BIS'],
    size: '2.1m x 1.05m',
    lifespan: '25+ years',
    subsidyEligible: true,
    imageUrl: 'https://picsum.photos/seed/emmvee/300/200',
    userRating: 4.2,
    reviews: [COMMON_REVIEW],
  },
  {
    id: '10',
    brand: 'Navitas Solar',
    model: 'Bonito Pro 400W Mono',
    pricePerWatt: 29,
    type: PanelType.MONOCRYSTALLINE,
    efficiency: 20.0,
    warranty: '12 years product, 25 years linear output',
    certifications: ['IEC', 'BIS', 'ALMM'],
    size: '1.99m x 1.0m',
    lifespan: '25 years',
    subsidyEligible: true,
    imageUrl: 'https://picsum.photos/seed/navitas/300/200',
    userRating: 3.8,
    reviews: [],
  },
  {
    id: '11',
    brand: 'Saatvik Solar',
    model: 'SST-P450 Mono Half-Cut',
    pricePerWatt: 30,
    type: PanelType.MONOCRYSTALLINE,
    efficiency: 20.5,
    warranty: '12 years product, 25 years performance',
    certifications: ['IEC', 'BIS', 'UL', 'TUV'],
    size: '2.08m x 1.03m',
    lifespan: '25 years',
    subsidyEligible: true,
    imageUrl: 'https://picsum.photos/seed/saatvik/300/200',
    userRating: 4.1,
    reviews: [COMMON_REVIEW_2],
  },
  {
    id: '12',
    brand: 'Spark Solar',
    model: 'Sparkler 380W Poly',
    pricePerWatt: 26,
    type: PanelType.POLYCRYSTALLINE,
    efficiency: 19.2,
    warranty: '10 years product, 25 years output',
    certifications: ['IEC', 'BIS'],
    size: '1.96m x 0.99m',
    lifespan: '25 years',
    subsidyEligible: true,
    imageUrl: 'https://picsum.photos/seed/spark/300/200',
    userRating: 3.7,
    reviews: [COMMON_REVIEW],
  },
];

export const INDIAN_STATES_ARRAY: IndianStates[] = Object.values(IndianStates);
export const USAGE_TYPES_ARRAY: UsageType[] = Object.values(UsageType);
export const INSTALLATION_TYPES_ARRAY: InstallationType[] = Object.values(InstallationType);
export const APPLICANT_TYPES_ARRAY: ApplicantType[] = Object.values(ApplicantType);

export const SOLAR_SERVICES: Service[] = [
  { id: '1', name: 'Solar Panel Installation', description: 'Complete rooftop and ground-mounted solar panel installations.' },
  { id: '2', name: 'System Maintenance & Cleaning', description: 'Regular maintenance checks and panel cleaning services.' },
  { id: '3', name: 'EV Charging Station Setup', description: 'Installation of home and commercial EV charging stations.' },
  { id: '4', name: 'Inverter & Battery Repair', description: 'Repair and replacement services for inverters and batteries.' },
  { id: '5', name: 'Solar Consultation', description: 'Expert advice on system sizing, subsidies, and ROI.' },
  { id: '6', name: 'SolarCare Tracker', description: 'Log system details, get maintenance reminders (cleaning, battery/inverter checks, warranty), upload documents, and connect with local service partners for proactive solar care.' },
];

export const MOCK_DISTRIBUTORS: Distributor[] = [
    { id: 'd1', name: 'GreenEnergy Solutions Pvt. Ltd.', location: 'Bangalore', services: ['Solar Panel Installation', 'System Maintenance & Cleaning', 'SolarCare Tracker'], rating: 4.8, isVerified: true, reviews: [COMMON_REVIEW_2] },
    { id: 'd2', name: 'Surya Power Systems', location: 'Mumbai', services: ['Solar Panel Installation', 'EV Charging Station Setup', 'Solar Consultation'], rating: 4.5, isVerified: true, reviews: [COMMON_REVIEW] },
    { id: 'd3', name: 'EcoInstallers Co.', location: 'Delhi', services: ['Solar Panel Installation', 'Inverter & Battery Repair', 'SolarCare Tracker'], rating: 4.2, isVerified: false, reviews: [] },
];

export const ECOMMERCE_CATEGORIES: ProductCategory[] = [
  { id: 'cat1', name: 'Solar Batteries', imageUrl: 'https://picsum.photos/seed/battery_cat/200/150' },
  { id: 'cat2', name: 'Solar Inverters', imageUrl: 'https://picsum.photos/seed/inverter_cat/200/150' },
  { id: 'cat3', name: 'Mounting Structures', imageUrl: 'https://picsum.photos/seed/mount_cat/200/150' },
  { id: 'cat4', name: 'EV Chargers', imageUrl: 'https://picsum.photos/seed/ev_cat/200/150' },
  { id: 'cat5', name: 'Cables & Accessories', imageUrl: 'https://picsum.photos/seed/cable_cat/200/150' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Luminous Solar Battery 150Ah', category: 'Solar Batteries', price: 15000, description: 'Tall tubular battery for solar applications.', imageUrl: 'https://picsum.photos/seed/battery1/200/200', stock: 50, userRating: 4.6, reviews: [COMMON_REVIEW] },
  { id: 'p2', name: 'Microtek Solar Inverter 2kVA', category: 'Solar Inverters', price: 25000, description: 'Pure sine wave solar PCU with MPPT.', imageUrl: 'https://picsum.photos/seed/inverter1/200/200', stock: 30, userRating: 4.3, reviews: [COMMON_REVIEW_2] },
  { id: 'p3', name: 'Standard Mounting Structure Kit', category: 'Mounting Structures', price: 8000, description: 'For 3-5 panels, rooftop.', imageUrl: 'https://picsum.photos/seed/mount1/200/200', stock: 100, userRating: 4.0, reviews: [] },
  { id: 'p4', name: 'Tata Power EZ Home EV Charger 7.2kW', category: 'EV Chargers', price: 45000, description: 'Smart EV charger for home use.', imageUrl: 'https://picsum.photos/seed/ev1/200/200', stock: 20, userRating: 4.8, reviews: [COMMON_REVIEW_2] },
];

export const LOAN_PARTNERS: LoanPartner[] = [
    { id: 'bank1', name: 'State Bank of India', logoUrl: 'https://picsum.photos/seed/sbi_logo/100/50' },
    { id: 'bank2', name: 'HDFC Bank', logoUrl: 'https://picsum.photos/seed/hdfc_logo/100/50' },
    { id: 'bank3', name: 'ICICI Bank', logoUrl: 'https://picsum.photos/seed/icici_logo/100/50' },
    { id: 'bank4', name: 'Axis Bank', logoUrl: 'https://picsum.photos/seed/axis_logo/100/50' },
];

export const MOCK_USERS: User[] = [
  { id: '1', email: 'user@example.com', name: 'Test User', role: 'user' },
  { id: '2', email: 'admin@example.com', name: 'Admin User', role: 'admin' },
  { id: '3', email: 'jane.doe@example.com', name: 'Jane Doe', role: 'user' },
  { id: '4', email: 'john.smith@example.com', name: 'John Smith', role: 'user' },
];

export const AVERAGE_COST_PER_UNIT_RESIDENTIAL = 7; // Rs/kWh
export const AVERAGE_COST_PER_UNIT_COMMERCIAL = 10; // Rs/kWh
export const AVERAGE_PANEL_WATTAGE = 400; // Watts
export const AVERAGE_SUNLIGHT_HOURS_PER_DAY = 5; // Hours
export const DAYS_IN_MONTH = 30;
export const SYSTEM_COST_PER_KW = 60000; // Rs
export const ANNUAL_MAINTENANCE_PERCENTAGE = 0.01; // 1% of system cost
export const CARBON_SAVINGS_PER_KWH = 0.82; // kg CO2 per kWh
