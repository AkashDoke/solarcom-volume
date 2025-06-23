
import React, { useState, useEffect }
from 'react';
import { SOLAR_SERVICES, MOCK_DISTRIBUTORS } from '../constants';
import { Service, Distributor, Lead, Review } from '../types';
import { fetchServices, fetchDistributors, submitLead, submitDistributorReview } from '../services/mockDataService';
import { Button, Card, SectionWrapper, Modal, EnquiryForm, Select, Input, Textarea, StarRating, Badge, Alert, LoadingSpinner } from '../components/CommonUI';

interface DistributorCardProps {
  distributor: Distributor;
  onViewDetails: (distributor: Distributor) => void;
}

const DistributorCard: React.FC<DistributorCardProps> = ({ distributor, onViewDetails }) => (
  <Card className="p-4 flex flex-col items-start">
    <div className="flex justify-between w-full items-start">
        <h3 className="text-lg font-semibold text-gray-800">{distributor.name}</h3>
        {distributor.isVerified && <Badge text="Verified Partner" color="green" />}
    </div>
    <p className="text-sm text-gray-600">{distributor.location}</p>
    <div className="my-2">
        <StarRating rating={distributor.rating} />
        <p className="text-xs text-gray-500">{distributor.reviews.length} reviews</p>
    </div>
    <p className="text-sm text-gray-700 mb-1"><strong>Services:</strong></p>
    <ul className="list-disc list-inside text-sm text-gray-600 pl-4 mb-3">
        {distributor.services.slice(0,3).map(s => <li key={s}>{s}</li>)}
        {distributor.services.length > 3 && <li>...and more</li>}
    </ul>
    <Button variant="outline" size="sm" onClick={() => onViewDetails(distributor)} className="w-full mt-auto">
      View Details & Reviews
    </Button>
  </Card>
);

interface ReviewFormProps {
    onSubmit: (rating: number, comment: string) => void;
    isLoading: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isLoading }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [name, setName] = useState(''); // Reviewer's name

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }
        onSubmit(rating, comment);
        // Reset form if needed: setRating(0); setComment('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating:</label>
                <StarRating rating={rating} setRating={setRating} />
            </div>
            <Input label="Your Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
            <Textarea label="Your Review" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." rows={4} />
            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : 'Submit Review'}
            </Button>
        </form>
    );
};


const ServicesAndLeadsPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingDistributors, setIsLoadingDistributors] = useState(true);
  
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isDistributorModalOpen, setIsDistributorModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);
  
  const [filterLocation, setFilterLocation] = useState('');
  const [filterService, setFilterService] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServices().then(data => {
      setServices(data);
      setIsLoadingServices(false);
    }).catch(() => {
        setIsLoadingServices(false);
        setNotification({type: 'error', message: 'Failed to load services.'});
    });
    
    fetchDistributors().then(data => {
        setDistributors(data);
        setIsLoadingDistributors(false);
    }).catch(() => {
        setIsLoadingDistributors(false);
        setNotification({type: 'error', message: 'Failed to load distributors.'});
    });
  }, []);

  useEffect(() => {
    setIsLoadingDistributors(true);
    fetchDistributors(filterLocation, filterService).then(data => {
        setDistributors(data);
        setIsLoadingDistributors(false);
    }).catch(() => {
        setIsLoadingDistributors(false);
        setNotification({type: 'error', message: 'Failed to filter distributors.'});
    });
  }, [filterLocation, filterService]);

  const handleServiceEnquiry = (service: Service) => {
    setSelectedService(service);
    setIsEnquiryModalOpen(true);
  };

  const handleDistributorDetails = (distributor: Distributor) => {
    setSelectedDistributor(distributor);
    setIsDistributorModalOpen(true);
  };

  const handleEnquirySubmit = async (details: { name: string, email: string, phone: string, message: string }) => {
    if (!selectedService) return;
    setIsSubmitting(true);
    try {
        const response = await submitLead({
            ...details,
            location: filterLocation || 'Any Location', // Use filter or a default
            serviceInterest: selectedService.name,
        });
        setNotification({type: 'success', message: response.message});
        setIsEnquiryModalOpen(false);
    } catch (error) {
        setNotification({type: 'error', message: 'Failed to submit enquiry. Please try again.'});
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!selectedDistributor) return;
    setIsSubmitting(true);
    try {
        const response = await submitDistributorReview(selectedDistributor.id, { userName: "A User", rating, comment }); // Username from auth context if available
        setNotification({type: 'success', message: response.message});
        // Refresh distributor data or update locally
        const updatedDistributor = { ...selectedDistributor, reviews: [...selectedDistributor.reviews, {id: Date.now().toString(), userName: "A User", rating, comment, date: new Date().toISOString()}]};
        const totalRating = updatedDistributor.reviews.reduce((sum, r) => sum + r.rating, 0);
        updatedDistributor.rating = parseFloat((totalRating / updatedDistributor.reviews.length).toFixed(1));
        
        setSelectedDistributor(updatedDistributor); // Update modal view
        setDistributors(distributors.map(d => d.id === updatedDistributor.id ? updatedDistributor : d)); // Update list view

    } catch (error) {
        setNotification({type: 'error', message: 'Failed to submit review.'});
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}
      
      <SectionWrapper title="Solar Services">
        {isLoadingServices ? <LoadingSpinner /> : (
          services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <Card key={service.id} className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-secondary mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                  <Button variant="primary" onClick={() => handleServiceEnquiry(service)}>
                    Enquire Now
                  </Button>
                </Card>
              ))}
            </div>
          ) : <p className="text-center text-gray-500">No services available at the moment.</p>
        )}
      </SectionWrapper>

      <SectionWrapper title="Find Installers & Distributors" className="bg-white">
        <div className="mb-6 p-4 bg-gray-50 shadow rounded-lg flex flex-col md:flex-row gap-4 items-center">
          <Input 
            label="Filter by Location" 
            placeholder="e.g., Bangalore, Mumbai" 
            value={filterLocation} 
            onChange={e => setFilterLocation(e.target.value)}
            className="w-full md:w-auto"
          />
          <Select
            label="Filter by Service"
            options={services.map(s => ({ value: s.name, label: s.name }))}
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="w-full md:w-auto"
          />
           <Button onClick={() => {setFilterLocation(''); setFilterService('');}} className="w-full md:w-auto mt-2 md:mt-0">Clear Filters</Button>
        </div>
        
        {isLoadingDistributors ? <LoadingSpinner /> : (
            distributors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {distributors.map(distributor => (
                    <DistributorCard key={distributor.id} distributor={distributor} onViewDetails={handleDistributorDetails} />
                ))}
                </div>
            ) : <p className="text-center text-gray-500">No distributors found matching your criteria. Try broadening your search.</p>
        )}
      </SectionWrapper>

      {selectedService && (
        <Modal isOpen={isEnquiryModalOpen} onClose={() => setIsEnquiryModalOpen(false)} title={`Enquire about ${selectedService.name}`}>
          <EnquiryForm 
            serviceName={selectedService.name} 
            onSubmit={handleEnquirySubmit}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {selectedDistributor && (
        <Modal isOpen={isDistributorModalOpen} onClose={() => setIsDistributorModalOpen(false)} title={`${selectedDistributor.name} - Details & Reviews`}>
            <div className="space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-600"><strong>Location:</strong> {selectedDistributor.location}</p>
                        <div className="flex items-center space-x-2">
                           <p className="text-sm text-gray-600"><strong>Rating:</strong></p> <StarRating rating={selectedDistributor.rating} size="sm" /> 
                           <span className="text-xs">({selectedDistributor.reviews.length} reviews)</span>
                        </div>
                    </div>
                     {selectedDistributor.isVerified && <Badge text="Verified Partner" color="green" />}
                </div>
                
                <p className="text-sm text-gray-700"><strong>Services Offered:</strong></p>
                <ul className="list-disc list-inside text-sm text-gray-600 pl-4">
                    {selectedDistributor.services.map(s => <li key={s}>{s}</li>)}
                </ul>

                <hr className="my-4"/>
                <h4 className="text-md font-semibold text-gray-700">Reviews</h4>
                {selectedDistributor.reviews.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {selectedDistributor.reviews.map(review => (
                        <div key={review.id} className="p-2 bg-gray-100 rounded">
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-xs">{review.userName}</p>
                                <StarRating rating={review.rating} size="sm"/>
                            </div>
                            <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                            <p className="text-sm">{review.comment}</p>
                        </div>
                    ))}
                    </div>
                ) : <p className="text-sm text-gray-500">No reviews yet.</p>}
                
                <hr className="my-4"/>
                <h4 className="text-md font-semibold text-gray-700">Rate this Distributor</h4>
                <ReviewForm onSubmit={handleReviewSubmit} isLoading={isSubmitting} />
            </div>
        </Modal>
      )}
    </div>
  );
};

export default ServicesAndLeadsPage;
    