
import { SolarPanel, Product, Service, Distributor, Lead, Review } from '../types';
import { MOCK_SOLAR_PANELS, MOCK_PRODUCTS, SOLAR_SERVICES, MOCK_DISTRIBUTORS } from '../constants';

const simulateDelay = <T,>(data: T, delay: number = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const fetchSolarPanels = (): Promise<SolarPanel[]> => {
  return simulateDelay(MOCK_SOLAR_PANELS);
};

export const fetchSolarPanelById = (id: string): Promise<SolarPanel | undefined> => {
  return simulateDelay(MOCK_SOLAR_PANELS.find(p => p.id === id));
};

export const fetchProducts = (category?: string): Promise<Product[]> => {
  const products = category ? MOCK_PRODUCTS.filter(p => p.category === category) : MOCK_PRODUCTS;
  return simulateDelay(products);
};

export const fetchProductById = (id: string): Promise<Product | undefined> => {
  return simulateDelay(MOCK_PRODUCTS.find(p => p.id === id));
};

export const fetchServices = (): Promise<Service[]> => {
  return simulateDelay(SOLAR_SERVICES);
};

export const fetchDistributors = (location?: string, service?: string): Promise<Distributor[]> => {
  let distributors = MOCK_DISTRIBUTORS;
  if (location) {
    distributors = distributors.filter(d => d.location.toLowerCase().includes(location.toLowerCase()));
  }
  if (service) {
    distributors = distributors.filter(d => d.services.includes(service));
  }
  return simulateDelay(distributors);
};

export const submitLead = (leadData: Lead): Promise<{ success: boolean; message: string }> => {
  console.log('Lead Submitted:', leadData);
  // In a real app, this would be an API call.
  // We can simulate finding a distributor here.
  const matchedDistributor = MOCK_DISTRIBUTORS.find(d => 
    d.location.toLowerCase().includes(leadData.location.toLowerCase()) &&
    (leadData.productInterest || leadData.serviceInterest) // basic matching
  );
  if (matchedDistributor) {
    console.log(`Lead matched and auto-distributed to: ${matchedDistributor.name}`);
    return simulateDelay({ success: true, message: `Enquiry submitted successfully! We've connected you with ${matchedDistributor.name}.` });
  }
  return simulateDelay({ success: true, message: 'Enquiry submitted successfully! A representative will contact you soon.' });
};

export const submitDistributorReview = (distributorId: string, review: Omit<Review, 'id' | 'date'>): Promise<{ success: boolean; message: string }> => {
    console.log(`Review for ${distributorId}:`, review);
    const distributor = MOCK_DISTRIBUTORS.find(d => d.id === distributorId);
    if (distributor) {
        const newReview: Review = { ...review, id: `r${Date.now()}`, date: new Date().toISOString().split('T')[0] };
        distributor.reviews.push(newReview);
        // Recalculate rating (simple average)
        const totalRating = distributor.reviews.reduce((sum, r) => sum + r.rating, 0);
        distributor.rating = parseFloat((totalRating / distributor.reviews.length).toFixed(1));
    }
    return simulateDelay({ success: true, message: 'Review submitted successfully!' });
};

export const submitProductReview = (productId: string, review: Omit<Review, 'id' | 'date'>): Promise<{ success: boolean; message: string }> => {
    console.log(`Review for product ${productId}:`, review);
     const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (product) {
        const newReview: Review = { ...review, id: `pr${Date.now()}`, date: new Date().toISOString().split('T')[0] };
        product.reviews.push(newReview);
        const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
        product.userRating = parseFloat((totalRating / product.reviews.length).toFixed(1));
    }
    return simulateDelay({ success: true, message: 'Product review submitted!' });
};

export const submitLoanEnquiry = (enquiryData: any): Promise<{ success: boolean; message: string }> => {
  console.log('Loan Enquiry Submitted:', enquiryData);
  // Simulate sharing with partner banks
  return simulateDelay({ success: true, message: 'Loan enquiry submitted! Our partner banks will contact you.' });
};
    