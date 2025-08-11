
import  { useState } from 'react';
import { Check, ChevronLeft, X } from 'lucide-react';
import EngagementOverview from './EngagementOverview';
import DateTime from './DateTime';

const MainEngagementCreator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [engagementId, setEngagementId] = useState(null); 
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    selectedDate: null,
    selectedTime: '',
    timezone: 'ET'
  });

  const handleInputChange = (field:any, value:any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Modified to receive engagement data with ID
  const handleNext = (engagementData:any = null) => {
    if (currentStep === 1) {
      // If engagement data is provided (from EngagementOverview), store the ID
      if (engagementData) {
        setEngagementId(engagementData.mockApiId || engagementData.engagementId);
        // Update formData with any additional data from the engagement
        setFormData(prev => ({
          ...prev,
          ...engagementData
        }));
      }
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Create Engagement</h1>
          <button className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Step 1: Engagement Overview */}
          <div className="flex items-start space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {currentStep > 1 ? <Check size={14} /> : '1'}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Engagement Overview</h3>
              <p className="text-sm text-gray-500">Select Engagement Details</p>
              
              {currentStep === 1 && (
                <div className="mt-4">
                  {/* Show engagement ID if available */}
                  {engagementId && (
                    <div className="text-xs text-gray-500">
                      ID: {engagementId}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Date & Time */}
          <div className="flex items-start space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {currentStep >= 2 ? <Check size={14} /> : '2'}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Date & Time</h3>
              <p className="text-sm text-gray-500">Select date & time</p>
              {currentStep === 2 && engagementId && (
                <div className="text-xs text-gray-500 mt-1">
                  ID: {engagementId}
                </div>
              )}
            </div>
          </div>
        </div>

        {currentStep === 2 && (
          <div className="mt-6">
            <button
              onClick={handleBack}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back
            </button>
          </div>
        )}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-8">
        {currentStep === 1 && (
          <EngagementOverview 
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext} // This will receive the engagement data with ID
          />
        )}

        {currentStep === 2 && (
          <DateTime 
            formData={formData}
            onInputChange={handleInputChange}
            onBack={handleBack}
            engagementId={engagementId} // Pass the engagement ID to DateTime
          />
        )}
      </div>
    </div>
  );
};

export default MainEngagementCreator;