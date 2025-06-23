
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, SectionWrapper, Card } from '../components/CommonUI'; 
// LOGO_URL_WHITE is removed as we use text-based logo

const HomePage: React.FC = () => {
  const features = [
    { name: 'Panel Comparison', description: 'Compare top solar panels side-by-side.', link: '/compare-panels', icon: '🔍' },
    { name: 'Savings Calculator', description: 'Estimate your solar savings and system size.', link: '/calculators', icon: '💡' },
    { name: 'Solar Services', description: 'Find installers, maintenance, and more.', link: '/services', icon: '🛠️' },
    { name: 'Solar Store', description: 'Shop for batteries, inverters, and EV chargers.', link: '/store', icon: '🛒' },
    { name: 'Loan Assistance', description: 'Get help with financing your solar project.', link: '/loans', icon: '💰' },
    { name: 'AI Solar Assistant', description: 'Get instant answers and guidance on your solar journey using our AI-powered chat.', link: '/ai-assistant', icon: '🤖' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-green-600 text-white py-20 px-4 text-center">
        <div className="container mx-auto">
          <div className="text-4xl md:text-5xl font-extrabold mx-auto mb-6">
            <span className="text-white">Solar</span>
            <span className="text-gray-200">Com</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Go Solar, Save Big with SolarCom</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Your trusted partner for solar solutions. Compare, calculate, and connect with experts.</p>
          <div className="space-x-0 space-y-4 md:space-y-0 md:space-x-4">
            <Link to="/compare-panels">
              <Button size="lg" variant="primary" className="w-full md:w-auto">Compare Panels</Button>
            </Link>
            <Link to="/calculators">
              <Button size="lg" variant="outline" className="w-full md:w-auto text-white border-white hover:bg-white hover:text-primary">Calculate Savings</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <SectionWrapper title="Explore Our Platform">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.name} className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="p-6 flex flex-col items-center justify-between h-full">
                <div>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.name}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                </div>
                <Link to={feature.link} className="mt-auto">
                  <Button variant="primary" size="sm">Learn More</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Why Choose Us Section */}
      <SectionWrapper title="Why SolarCom?" className="bg-white">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <h4 className="text-lg font-semibold text-primary mb-2">Comprehensive Marketplace</h4>
            <p className="text-gray-600">All your solar needs in one place - from panels to financing.</p>
          </div>
          <div className="p-4">
            <h4 className="text-lg font-semibold text-primary mb-2">Expert Guidance</h4>
            <p className="text-gray-600">Access to calculators, verified installers, and transparent information.</p>
          </div>
          <div className="p-4">
            <h4 className="text-lg font-semibold text-primary mb-2">Savings Focused</h4>
            <p className="text-gray-600">Tools and resources to maximize your return on solar investment.</p>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper className="bg-primary text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make the Switch?</h2>
            <p className="text-lg mb-8">Join thousands of Indians benefiting from clean, affordable solar energy.</p>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">Get Started Today</Button>
            </Link>
          </div>
      </SectionWrapper>
    </div>
  );
};

export default HomePage;
