
import React, { useState, useEffect } from 'react';
import { Button, Input, Select, SectionWrapper, Card, Alert } from '../components/CommonUI';
import { IndianStates, UsageType, InstallationType, ApplicantType } from '../types';
import { 
    INDIAN_STATES_ARRAY, USAGE_TYPES_ARRAY, INSTALLATION_TYPES_ARRAY, APPLICANT_TYPES_ARRAY,
    AVERAGE_COST_PER_UNIT_RESIDENTIAL, AVERAGE_COST_PER_UNIT_COMMERCIAL, AVERAGE_PANEL_WATTAGE,
    AVERAGE_SUNLIGHT_HOURS_PER_DAY, DAYS_IN_MONTH, SYSTEM_COST_PER_KW, ANNUAL_MAINTENANCE_PERCENTAGE,
    CARBON_SAVINGS_PER_KWH
} from '../constants';

type CalculatorTab = 'savings' | 'subsidy' | 'roi';

const SavingsCalculator: React.FC = () => {
  const [bill, setBill] = useState('');
  const [location, setLocation] = useState(IndianStates.DELHI); // Default or use geolocation
  const [roofSize, setRoofSize] = useState('');
  const [usageType, setUsageType] = useState(UsageType.RESIDENTIAL);
  const [costPerUnit, setCostPerUnit] = useState(String(AVERAGE_COST_PER_UNIT_RESIDENTIAL));
  
  const [results, setResults] = useState<{ capacity?: number; numPanels?: number; estCost?: number; estSavings?: number; payback?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCostPerUnit(String(usageType === UsageType.RESIDENTIAL ? AVERAGE_COST_PER_UNIT_RESIDENTIAL : AVERAGE_COST_PER_UNIT_COMMERCIAL));
  }, [usageType]);

  const calculateSavings = () => {
    setError(null);
    setResults(null);
    const monthlyBill = parseFloat(bill);
    const roof = parseFloat(roofSize); // in sq ft. Assume 100 sq ft per kW for simplicity
    const unitCost = parseFloat(costPerUnit);

    if (isNaN(monthlyBill) || monthlyBill <= 0 || isNaN(unitCost) || unitCost <=0 ) {
      setError('Please enter valid monthly bill and cost per unit.');
      return;
    }
    if (isNaN(roof) || roof <=0) {
        setError('Please enter a valid roof size.');
        return;
    }


    const monthlyUnitsConsumed = monthlyBill / unitCost;
    const dailyUnitsConsumed = monthlyUnitsConsumed / DAYS_IN_MONTH;
    // Required system capacity in kW. kW = kWh / (sunlight hours * efficiency factor (e.g. 0.8))
    // Simplification: Assume 1kW system produces (1 * AVERAGE_SUNLIGHT_HOURS_PER_DAY) kWh per day.
    const requiredCapacityKW = dailyUnitsConsumed / AVERAGE_SUNLIGHT_HOURS_PER_DAY;
    
    // Check against roof size. Approx 100 sq ft per kW.
    const maxCapacityFromRoofKW = roof / 100;
    const finalCapacityKW = Math.min(requiredCapacityKW, maxCapacityFromRoofKW);

    if (finalCapacityKW <=0) {
        setError('Calculated system capacity is too low or roof size is too small.');
        return;
    }

    const numPanels = Math.ceil((finalCapacityKW * 1000) / AVERAGE_PANEL_WATTAGE);
    const estSystemCost = finalCapacityKW * SYSTEM_COST_PER_KW;
    
    // Estimated monthly savings: units generated * cost per unit
    // Units generated per month = finalCapacityKW * AVERAGE_SUNLIGHT_HOURS_PER_DAY * DAYS_IN_MONTH
    const monthlyUnitsGenerated = finalCapacityKW * AVERAGE_SUNLIGHT_HOURS_PER_DAY * DAYS_IN_MONTH;
    const estMonthlySavings = monthlyUnitsGenerated * unitCost;

    const paybackPeriodYears = estSystemCost / (estMonthlySavings * 12);

    setResults({
      capacity: parseFloat(finalCapacityKW.toFixed(2)),
      numPanels,
      estCost: parseFloat(estSystemCost.toFixed(0)),
      estSavings: parseFloat(estMonthlySavings.toFixed(0)),
      payback: parseFloat(paybackPeriodYears.toFixed(1)),
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Solar Savings & Panel Size Calculator</h3>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input label="Average Monthly Electricity Bill (₹)" type="number" value={bill} onChange={e => setBill(e.target.value)} placeholder="e.g., 3000" />
        <Select label="Location (State)" options={INDIAN_STATES_ARRAY.map(s => ({ value: s, label: s }))} value={location} onChange={e => setLocation(e.target.value as IndianStates)} />
        <Input label="Roof Size (sq. ft.)" type="number" value={roofSize} onChange={e => setRoofSize(e.target.value)} placeholder="e.g., 500" />
        <Select label="Usage Type" options={USAGE_TYPES_ARRAY.map(u => ({ value: u, label: u }))} value={usageType} onChange={e => setUsageType(e.target.value as UsageType)} />
        <Input label="Cost per Unit (₹/kWh)" type="number" value={costPerUnit} onChange={e => setCostPerUnit(e.target.value)} placeholder="e.g., 7" />
      </div>
      <Button onClick={calculateSavings} variant="primary" className="w-full md:w-auto">Calculate Savings</Button>

      {results && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-lg font-semibold text-secondary mb-2">Estimated Results:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {results.capacity && <li>Required System Capacity: <strong>{results.capacity} kW</strong></li>}
            {results.numPanels && <li>Estimated Number of Panels: <strong>{results.numPanels}</strong> (approx. {AVERAGE_PANEL_WATTAGE}W panels)</li>}
            {results.estCost && <li>Estimated System Cost: <strong>₹{results.estCost.toLocaleString()}</strong></li>}
            {results.estSavings && <li>Estimated Monthly Savings: <strong>₹{results.estSavings.toLocaleString()}</strong></li>}
            {results.payback && <li>Estimated Payback Period: <strong>{results.payback} years</strong></li>}
          </ul>
        </div>
      )}
    </Card>
  );
};

const SubsidyCalculator: React.FC = () => {
  const [state, setState] = useState(IndianStates.DELHI);
  const [usageType, setUsageType] = useState(UsageType.RESIDENTIAL);
  const [systemSize, setSystemSize] = useState(''); // kW
  const [installationType, setInstallationType] = useState(InstallationType.ROOFTOP);
  const [applicantType, setApplicantType] = useState(ApplicantType.INDIVIDUAL);
  
  const [results, setResults] = useState<{ scheme?: string; subsidyPercent?: number; subsidyAmount?: number; finalPrice?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);


  // Simplified subsidy logic (example, varies greatly by state and time)
  const calculateSubsidy = () => {
    setError(null);
    setResults(null);
    const sizeKW = parseFloat(systemSize);
    if (isNaN(sizeKW) || sizeKW <= 0) {
      setError('Please enter a valid system size.');
      return;
    }

    let subsidyPercent = 0;
    let schemeName = "Central Financial Assistance (CFA) under Rooftop Solar Programme Phase-II"; // Generic scheme name

    if (usageType === UsageType.RESIDENTIAL && installationType === InstallationType.ROOFTOP) {
      if (applicantType === ApplicantType.INDIVIDUAL || applicantType === ApplicantType.HOUSING_SOCIETY) {
         // Example: 40% for first 3kW, 20% for next 7kW (up to 10kW)
        if (sizeKW <= 3) {
            subsidyPercent = 40;
        } else if (sizeKW <= 10) {
            // (3kW * 40% + (sizeKW-3kW) * 20%) / sizeKW
            subsidyPercent = ((3 * 0.4) + ((sizeKW - 3) * 0.2)) / sizeKW * 100;
        } else { // Above 10kW, typically lower or fixed subsidy for housing societies
            subsidyPercent = (applicantType === ApplicantType.HOUSING_SOCIETY) ? 15 : 0; // Example
        }
      }
    } else {
        schemeName = "State specific schemes or no direct subsidy might apply.";
    }
    
    // Some states might have additional subsidies
    if (state === IndianStates.GUJARAT && usageType === UsageType.RESIDENTIAL) {
        subsidyPercent = Math.min(subsidyPercent + 5, 50); // Example additional state subsidy
        schemeName += " (with Gujarat State Policy benefits)";
    }


    const estimatedSystemCost = sizeKW * SYSTEM_COST_PER_KW;
    const subsidyAmount = (estimatedSystemCost * subsidyPercent) / 100;
    const finalPrice = estimatedSystemCost - subsidyAmount;

    setResults({
      scheme: schemeName,
      subsidyPercent: parseFloat(subsidyPercent.toFixed(2)),
      subsidyAmount: parseFloat(subsidyAmount.toFixed(0)),
      finalPrice: parseFloat(finalPrice.toFixed(0)),
    });
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Government Subsidy Calculator</h3>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Select label="State" options={INDIAN_STATES_ARRAY.map(s => ({ value: s, label: s }))} value={state} onChange={e => setState(e.target.value as IndianStates)} />
        <Select label="Usage Type" options={USAGE_TYPES_ARRAY.map(u => ({ value: u, label: u }))} value={usageType} onChange={e => setUsageType(e.target.value as UsageType)} />
        <Input label="System Size (kW)" type="number" value={systemSize} onChange={e => setSystemSize(e.target.value)} placeholder="e.g., 5" />
        <Select label="Installation Type" options={INSTALLATION_TYPES_ARRAY.map(i => ({ value: i, label: i }))} value={installationType} onChange={e => setInstallationType(e.target.value as InstallationType)} />
        <Select label="Applicant Type" options={APPLICANT_TYPES_ARRAY.map(a => ({ value: a, label: a }))} value={applicantType} onChange={e => setApplicantType(e.target.value as ApplicantType)} />
      </div>
      <Button onClick={calculateSubsidy} variant="primary" className="w-full md:w-auto">Calculate Subsidy</Button>

      {results && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-accent mb-2">Subsidy Estimation:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {results.scheme && <li>Applicable Scheme (Indicative): <strong>{results.scheme}</strong></li>}
            {results.subsidyPercent !== undefined && <li>Estimated Subsidy Percentage: <strong>{results.subsidyPercent}%</strong></li>}
            {results.subsidyAmount && <li>Estimated Subsidy Amount: <strong>₹{results.subsidyAmount.toLocaleString()}</strong></li>}
            {results.finalPrice && <li>Estimated Final Price After Subsidy: <strong>₹{results.finalPrice.toLocaleString()}</strong></li>}
          </ul>
           <p className="text-xs text-gray-500 mt-2">Note: Subsidy amounts are indicative and subject to government policies and eligibility criteria. Contact authorities for exact figures.</p>
        </div>
      )}
    </Card>
  );
};

const ROICalculator: React.FC = () => {
  const [systemCost, setSystemCost] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [maintenanceCost, setMaintenanceCost] = useState(''); // Annual
  const [subsidyAmount, setSubsidyAmount] = useState('0'); // Optional
  // Location could influence generation factor, but simplified here

  const [results, setResults] = useState<{ payback?: number; savings10yr?: number; savings25yr?: number; roi?: number; carbonSavings?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateROI = () => {
    setError(null);
    setResults(null);
    const cost = parseFloat(systemCost);
    const savingsMon = parseFloat(monthlySavings);
    const maintAnnual = parseFloat(maintenanceCost);
    const subsidy = parseFloat(subsidyAmount);

    if (isNaN(cost) || cost <= 0 || isNaN(savingsMon) || savingsMon <= 0) {
      setError('Please enter valid system cost and monthly savings.');
      return;
    }
     if (isNaN(maintAnnual) || maintAnnual < 0) {
      setError('Please enter a valid annual maintenance cost (can be 0).');
      return;
    }
    if (isNaN(subsidy) || subsidy < 0) {
      setError('Please enter a valid subsidy amount (can be 0).');
      return;
    }

    const netInvestment = cost - subsidy;
    const annualSavings = savingsMon * 12;
    const netAnnualBenefit = annualSavings - maintAnnual;

    if (netAnnualBenefit <= 0) {
        setError('Annual benefits (savings - maintenance) must be positive for ROI calculation.');
        return;
    }

    const paybackPeriodYears = netInvestment / netAnnualBenefit;
    
    const totalSavings10yr = (netAnnualBenefit * 10) - netInvestment;
    const totalSavings25yr = (netAnnualBenefit * 25) - netInvestment;
    
    // Simple ROI over 25 years (Total Net Benefit / Net Investment) * 100
    const roiPercent = ( (netAnnualBenefit * 25) / netInvestment ) * 100;

    // Carbon Savings: Assume system generates 'monthlySavings / averageCostPerUnit' kWh per month.
    // This is a rough estimate; a better way would be to input system size.
    // For now, let's assume system size implies these savings. Say, a 5kW system for ~Rs. 2500 monthly savings.
    // Annual kWh generated approx = (savingsMon / AVERAGE_COST_PER_UNIT_RESIDENTIAL) * 12
    const annualKWhGenerated = (savingsMon / ((AVERAGE_COST_PER_UNIT_RESIDENTIAL + AVERAGE_COST_PER_UNIT_COMMERCIAL)/2) ) * 12; // average cost per unit
    const carbonSavings25yr = annualKWhGenerated * 25 * CARBON_SAVINGS_PER_KWH;


    setResults({
      payback: parseFloat(paybackPeriodYears.toFixed(1)),
      savings10yr: parseFloat(totalSavings10yr.toFixed(0)),
      savings25yr: parseFloat(totalSavings25yr.toFixed(0)),
      roi: parseFloat(roiPercent.toFixed(1)),
      carbonSavings: parseFloat(carbonSavings25yr.toFixed(0)),
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Return on Investment (ROI) Calculator</h3>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input label="Total System Cost (₹)" type="number" value={systemCost} onChange={e => setSystemCost(e.target.value)} placeholder="e.g., 300000" />
        <Input label="Estimated Monthly Electricity Bill Savings (₹)" type="number" value={monthlySavings} onChange={e => setMonthlySavings(e.target.value)} placeholder="e.g., 2500" />
        <Input label="Annual Maintenance Cost (₹)" type="number" value={maintenanceCost} onChange={e => setMaintenanceCost(e.target.value)} placeholder="e.g., 3000" />
        <Input label="Subsidy Amount Received (₹, optional)" type="number" value={subsidyAmount} onChange={e => setSubsidyAmount(e.target.value)} placeholder="e.g., 60000" />
      </div>
      <Button onClick={calculateROI} variant="primary" className="w-full md:w-auto">Calculate ROI</Button>

      {results && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="text-lg font-semibold text-primary mb-2">ROI Projections:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {results.payback && <li>Payback Period: <strong>{results.payback} years</strong></li>}
            {results.roi && <li>Estimated 25-Year ROI: <strong>{results.roi}%</strong></li>}
            {results.savings10yr && <li>Net Savings in 10 Years: <strong>₹{results.savings10yr.toLocaleString()}</strong> (after investment)</li>}
            {results.savings25yr && <li>Net Savings in 25 Years: <strong>₹{results.savings25yr.toLocaleString()}</strong> (after investment)</li>}
            {results.carbonSavings && <li>Estimated Carbon Savings (25 Years): <strong>{results.carbonSavings.toLocaleString()} kg CO₂</strong></li>}
          </ul>
        </div>
      )}
    </Card>
  );
};


const CalculatorsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('savings');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'savings': return <SavingsCalculator />;
      case 'subsidy': return <SubsidyCalculator />;
      case 'roi': return <ROICalculator />;
      default: return null;
    }
  };

  return (
    <SectionWrapper title="Solar Calculators">
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
          {(['savings', 'subsidy', 'roi'] as CalculatorTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {tab === 'savings' ? 'Savings & Size' : tab === 'subsidy' ? 'Subsidy' : 'ROI'}
            </button>
          ))}
        </nav>
      </div>
      <div>
        {renderActiveTab()}
      </div>
    </SectionWrapper>
  );
};

export default CalculatorsPage;
    