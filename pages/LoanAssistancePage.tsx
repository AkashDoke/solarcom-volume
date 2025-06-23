
import React, { useState } from 'react';
import { SectionWrapper, Card, Input, Button, Select, Textarea, Alert, LoadingSpinner } from '../components/CommonUI';
import { LOAN_PARTNERS } from '../constants';
import { submitLoanEnquiry } from '../services/mockDataService';
import { useAuth } from '../contexts/AuthContext';

const LoanAssistancePage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    loanAmount: '',
    employmentType: '', // e.g., salaried, self-employed
    monthlyIncome: '',
    message: '',
  });
  const [emiDetails, setEmiDetails] = useState({
    loanAmountEmi: '',
    interestRateEmi: '',
    loanTenureEmi: '', // in years
  });
  const [calculatedEmi, setCalculatedEmi] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmiInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmiDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);
    try {
      const response = await submitLoanEnquiry(formData);
      setNotification({ type: 'success', message: response.message });
      // Reset form if needed
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        loanAmount: '',
        employmentType: '',
        monthlyIncome: '',
        message: '',
      });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to submit loan enquiry. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEmi = () => {
    const P = parseFloat(emiDetails.loanAmountEmi);
    const R_annual = parseFloat(emiDetails.interestRateEmi);
    const N_years = parseFloat(emiDetails.loanTenureEmi);

    if (isNaN(P) || P <= 0 || isNaN(R_annual) || R_annual <= 0 || isNaN(N_years) || N_years <= 0) {
      setNotification({type: 'error', message: 'Please enter valid loan amount, interest rate, and tenure for EMI calculation.'});
      setCalculatedEmi(null);
      return;
    }
    setNotification(null);

    const R_monthly = (R_annual / 12) / 100; // Monthly interest rate
    const N_months = N_years * 12; // Total number of installments

    // EMI = P * R * (1+R)^N / ((1+R)^N - 1)
    const emi = (P * R_monthly * Math.pow(1 + R_monthly, N_months)) / (Math.pow(1 + R_monthly, N_months) - 1);
    setCalculatedEmi(parseFloat(emi.toFixed(2)));
  };

  return (
    <SectionWrapper title="Solar Loan Assistance">
      {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Loan Enquiry Form</h3>
          <p className="text-sm text-gray-600 mb-6">Interested in financing your solar project? Fill out the form below, and our partner financial institutions will get in touch with you.</p>
          <form onSubmit={handleEnquirySubmit} className="space-y-4">
            <Input label="Full Name" name="name" type="text" value={formData.name} onChange={handleInputChange} required />
            <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
            <Input label="Desired Loan Amount (₹)" name="loanAmount" type="number" value={formData.loanAmount} onChange={handleInputChange} placeholder="e.g., 200000" required />
            <Select 
              label="Employment Type" 
              name="employmentType" 
              value={formData.employmentType} 
              onChange={handleInputChange}
              options={[
                {value: 'salaried', label: 'Salaried'},
                {value: 'self-employed', label: 'Self-Employed/Business Owner'},
                {value: 'other', label: 'Other'},
              ]}
              required
            />
            <Input label="Approx. Monthly Income (₹)" name="monthlyIncome" type="number" value={formData.monthlyIncome} onChange={handleInputChange} placeholder="e.g., 50000" />
            <Textarea label="Additional Message (Optional)" name="message" value={formData.message} onChange={handleInputChange} rows={3} />
            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : 'Submit Enquiry'}
            </Button>
          </form>
        </Card>

        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">EMI Calculator (Optional)</h3>
            <div className="space-y-4">
              <Input label="Loan Amount (₹)" name="loanAmountEmi" type="number" value={emiDetails.loanAmountEmi} onChange={handleEmiInputChange} placeholder="e.g., 200000" />
              <Input label="Annual Interest Rate (%)" name="interestRateEmi" type="number" value={emiDetails.interestRateEmi} onChange={handleEmiInputChange} placeholder="e.g., 9.5" />
              <Input label="Loan Tenure (Years)" name="loanTenureEmi" type="number" value={emiDetails.loanTenureEmi} onChange={handleEmiInputChange} placeholder="e.g., 5" />
              <Button onClick={calculateEmi} variant="secondary" className="w-full">Calculate EMI</Button>
              {calculatedEmi !== null && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                  <p className="text-lg font-semibold text-secondary">Estimated Monthly EMI: ₹{calculatedEmi.toLocaleString()}</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Loan Partners</h3>
            <p className="text-sm text-gray-600 mb-4">We collaborate with leading banks and NBFCs to provide you with competitive solar financing options.</p>
            <div className="grid grid-cols-2 gap-4 items-center">
              {LOAN_PARTNERS.map(partner => (
                <div key={partner.id} className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                  <img src={partner.logoUrl} alt={partner.name} className="h-12 object-contain mb-2" />
                  <p className="text-xs text-center text-gray-700">{partner.name}</p>
                </div>
              ))}
            </div>
             <p className="text-xs text-gray-500 mt-4">Note: Loan approval is at the sole discretion of the financial institution.</p>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default LoanAssistancePage;
