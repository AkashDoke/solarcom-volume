
export enum PanelType {
  MONOCRYSTALLINE = 'Monocrystalline',
  POLYCRYSTALLINE = 'Polycrystalline',
  THIN_FILM = 'Thin-Film',
}

export interface SolarPanel {
  id: string;
  brand: string;
  model: string;
  pricePerWatt: number; // in ₹
  type: PanelType;
  efficiency: number; // percentage
  warranty: string; // e.g., "25 years linear power output"
  certifications: string[];
  size: string; // e.g., "1.7m x 1m"
  lifespan: string; // e.g., "25-30 years"
  subsidyEligible: boolean;
  imageUrl: string;
  userRating: number; // 1-5
  reviews: Review[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export enum UsageType {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
}

export enum IndianStates {
  DELHI = 'Delhi',
  MAHARASHTRA = 'Maharashtra',
  KARNATAKA = 'Karnataka',
  TAMIL_NADU = 'Tamil Nadu',
  GUJARAT = 'Gujarat',
  // Add more states as needed
}

export enum InstallationType {
  ROOFTOP = 'Rooftop',
  GROUND_MOUNTED = 'Ground Mounted',
}

export enum ApplicantType {
  INDIVIDUAL = 'Individual',
  HOUSING_SOCIETY = 'Housing Society',
  COMMERCIAL_ENTITY = 'Commercial Entity',
}

export interface Lead {
  name: string;
  phone: string;
  email: string;
  location: string;
  productInterest?: string; // For panel enquiries
  serviceInterest?: string; // For service enquiries
  message?: string;
}

export interface Distributor {
  id: string;
  name: string;
  location: string;
  services: string[];
  rating: number;
  isVerified: boolean;
  reviews: Review[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // in ₹
  description: string;
  imageUrl: string;
  stock: number;
  userRating: number;
  reviews: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface LoanPartner {
  id: string;
  name: string;
  logoUrl: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin'; // Basic role example
}
    