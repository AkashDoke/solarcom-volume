
import React, { useState, useEffect, useCallback } from 'react';
import { SolarPanel, Review } from '../types';
import { fetchSolarPanels, submitLead } from '../services/mockDataService';
import { Button, Card, LoadingSpinner, Modal, EnquiryForm, Select, StarRating, Alert } from '../components/CommonUI';
import { PANEL_BRANDS } from '../constants';

const PanelCard: React.FC<{ panel: SolarPanel; onCompare: (panel: SolarPanel) => void; isCompared: boolean; onEnquire: (panel: SolarPanel) => void; onRequestQuote: (panel: SolarPanel) => void; }> = 
  ({ panel, onCompare, isCompared, onEnquire, onRequestQuote }) => (
  <Card className="flex flex-col">
    <img src={panel.imageUrl} alt={panel.model} className="w-full h-40 object-cover" />
    <div className="p-4 flex-grow flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800">{panel.brand} - {panel.model}</h3>
      <StarRating rating={panel.userRating} />
      <p className="text-xs text-gray-500 mb-2">{panel.reviews.length} reviews</p>
      
      <div className="text-sm space-y-1 my-2 text-gray-700 flex-grow">
        <p><strong>Price/Watt:</strong> ₹{panel.pricePerWatt}</p>
        <p><strong>Type:</strong> {panel.type}</p>
        <p><strong>Efficiency:</strong> {panel.efficiency}%</p>
        <p><strong>Warranty:</strong> {panel.warranty}</p>
      </div>
      <div className="mt-auto space-y-2">
        <Button variant="secondary" size="sm" onClick={() => onCompare(panel)} disabled={isCompared} className="w-full">
          {isCompared ? 'Added to Compare' : 'Compare'}
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEnquire(panel)} className="w-full">Enquire Now</Button>
        <Button variant="primary" size="sm" onClick={() => onRequestQuote(panel)} className="w-full">Request Quote</Button>
      </div>
    </div>
  </Card>
);

const ComparisonTable: React.FC<{ panels: SolarPanel[], onRemove: (panelId: string) => void }> = ({ panels, onRemove }) => {
    if (panels.length === 0) return null;
  
    const features: (keyof SolarPanel | string)[] = ['brand', 'model', 'pricePerWatt', 'type', 'efficiency', 'warranty', 'certifications', 'size', 'lifespan', 'subsidyEligible', 'userRating'];
    const displayNames: { [key: string]: string } = {
        brand: 'Brand', model: 'Model', pricePerWatt: 'Price/Watt (₹)', type: 'Type', efficiency: 'Efficiency (%)',
        warranty: 'Warranty', certifications: 'Certifications', size: 'Size (LxW)', lifespan: 'Lifespan',
        subsidyEligible: 'Subsidy Eligible', userRating: 'User Rating'
    };

    return (
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4 mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Comparison</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
              {panels.map(panel => (
                <th key={panel.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                  {panel.brand} - {panel.model}
                  <button onClick={() => onRemove(panel.id)} className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-xs">✕ Remove</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {features.map(feature => (
              <tr key={String(feature)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{displayNames[String(feature)] || String(feature)}</td>
                {panels.map(panel => (
                  <td key={panel.id} className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                    {feature === 'subsidyEligible' ? (panel[feature] ? 'Yes' : 'No') : 
                     feature === 'certifications' && Array.isArray(panel[feature]) ? (panel[feature] as string[]).join(', ') :
                     String(panel[feature as keyof SolarPanel])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

const PanelReviews: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return <p className="text-sm text-gray-500">No reviews yet for this panel.</p>;
    }
    return (
        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
            {reviews.map(review => (
                <div key={review.id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-sm text-gray-800">{review.userName}</p>
                        <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{new Date(review.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
            ))}
        </div>
    );
};


const PanelComparisonPage: React.FC = () => {
  const [allPanels, setAllPanels] = useState<SolarPanel[]>([]);
  const [filteredPanels, setFilteredPanels] = useState<SolarPanel[]>([]);
  const [comparedPanels, setComparedPanels] = useState<SolarPanel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'enquiry' | 'quote' | 'reviews'>('enquiry');
  const [selectedPanelForModal, setSelectedPanelForModal] = useState<SolarPanel | null>(null);
  const [filterBrand, setFilterBrand] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    fetchSolarPanels()
      .then(data => {
        setAllPanels(data);
        setFilteredPanels(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching panels:", error);
        setIsLoading(false);
        setNotification({type: 'error', message: 'Failed to load solar panels.'});
      });
  }, []);

  const handleFilterAndSort = useCallback(() => {
    let tempPanels = [...allPanels];
    if (filterBrand) {
      tempPanels = tempPanels.filter(p => p.brand === filterBrand);
    }
    if (sortOption) {
      tempPanels.sort((a, b) => {
        if (sortOption === 'priceLowHigh') return a.pricePerWatt - b.pricePerWatt;
        if (sortOption === 'priceHighLow') return b.pricePerWatt - a.pricePerWatt;
        if (sortOption === 'efficiencyHighLow') return b.efficiency - a.efficiency;
        if (sortOption === 'ratingHighLow') return b.userRating - a.userRating;
        return 0;
      });
    }
    setFilteredPanels(tempPanels);
  }, [allPanels, filterBrand, sortOption]);

  useEffect(() => {
    handleFilterAndSort();
  }, [filterBrand, sortOption, handleFilterAndSort]);


  const handleCompare = (panel: SolarPanel) => {
    if (comparedPanels.length < 3 && !comparedPanels.find(p => p.id === panel.id)) {
      setComparedPanels([...comparedPanels, panel]);
    } else if (comparedPanels.length >= 3) {
      setNotification({type: 'warning', message: 'You can compare a maximum of 3 panels.'});
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRemoveFromCompare = (panelId: string) => {
    setComparedPanels(comparedPanels.filter(p => p.id !== panelId));
  };

  const openModal = (panel: SolarPanel, type: 'enquiry' | 'quote' | 'reviews') => {
    setSelectedPanelForModal(panel);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleEnquirySubmit = async (details: { name: string, email: string, phone: string, message: string }) => {
    if (!selectedPanelForModal) return;
    setIsSubmitting(true);
    try {
      const response = await submitLead({
        ...details,
        location: 'User Input Location (Not collected here)', // Or add a location field
        productInterest: `${selectedPanelForModal.brand} ${selectedPanelForModal.model}`,
      });
      setNotification({type: 'success', message: response.message});
      setIsModalOpen(false);
    } catch (error) {
       setNotification({type: 'error', message: 'Failed to submit enquiry. Please try again.'});
    } finally {
        setIsSubmitting(false);
    }
  };


  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Compare Solar Panels</h1>
      
      {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}

      {/* Filters and Sort */}
      <div className="mb-6 p-4 bg-white shadow rounded-lg flex flex-col md:flex-row gap-4 items-center">
        <Select
          label="Filter by Brand"
          options={PANEL_BRANDS.map(b => ({ value: b, label: b }))}
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="w-full md:w-auto"
        />
        <Select
          label="Sort by"
          options={[
            { value: 'priceLowHigh', label: 'Price: Low to High' },
            { value: 'priceHighLow', label: 'Price: High to Low' },
            { value: 'efficiencyHighLow', label: 'Efficiency: High to Low' },
            { value: 'ratingHighLow', label: 'Rating: High to Low' },
          ]}
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full md:w-auto"
        />
         <Button onClick={() => {setFilterBrand(''); setSortOption('');}} className="w-full md:w-auto mt-2 md:mt-0">Clear Filters</Button>
      </div>
      
      {filteredPanels.length === 0 && !isLoading && (
        <p className="text-center text-gray-600">No panels match your criteria. Try adjusting filters.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filteredPanels.map(panel => (
          <PanelCard
            key={panel.id}
            panel={panel}
            onCompare={handleCompare}
            isCompared={!!comparedPanels.find(p => p.id === panel.id)}
            onEnquire={(p) => openModal(p, 'enquiry')}
            onRequestQuote={(p) => openModal(p, 'quote')}
          />
        ))}
      </div>

      {comparedPanels.length > 0 && (
        <ComparisonTable panels={comparedPanels} onRemove={handleRemoveFromCompare} />
      )}

      {selectedPanelForModal && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={
          modalType === 'enquiry' ? `Enquire about ${selectedPanelForModal.model}` :
          modalType === 'quote' ? `Request Quote for ${selectedPanelForModal.model}` :
          `Reviews for ${selectedPanelForModal.model}`
        }>
          {modalType === 'reviews' ? (
            <PanelReviews reviews={selectedPanelForModal.reviews} />
          ) : (
            <EnquiryForm 
              productName={`${selectedPanelForModal.brand} ${selectedPanelForModal.model}`}
              onSubmit={handleEnquirySubmit} 
              isLoading={isSubmitting}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default PanelComparisonPage;
