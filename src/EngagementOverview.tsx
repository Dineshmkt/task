
import  { useState, useEffect } from 'react';

const EngagementOverview = ({ formData, onInputChange, onNext }:any) => {
  const [engagementId, setEngagementId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const MOCKAPI_URL = 'https://688f0331f21ab1769f87f43a.mockapi.io/engagements';

  const testMockAPI = async () => {  
    try {
      console.log('Testing MockAPI connection...');
      const response = await fetch(MOCKAPI_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('GET Test - Status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('GET Test - Success:', data);
        return true;
      } else {
        console.error('GET Test - Failed:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('GET Test - Error:', error);
      return false;
    }
  };
  console.log("test purpose",testMockAPI)

  useEffect(() => {
    const generateId = () => {
      return 'ENG-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    };
    setEngagementId(generateId());
  }, []);

  const saveToMockAPI = async (data:any) => {
    try {
       const payload = {        
        engagementOwner: data.engagementOwner || '',
        speaker: data.speaker || '',
        caterer: data.caterer || '',
        cohost: data.cohost || ''
      };

      console.log('Sending payload to MockAPI:', JSON.stringify(payload, null, 2));
      const response = await fetch(MOCKAPI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      // console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('MockAPI Error Response:', errorText);   
        try { // Try to parse error as JSON
          const errorJson = JSON.parse(errorText);
          console.error('Parsed error:', errorJson);
        } catch (e) {
          console.error('Error is not JSON:', errorText);
        }
        
        throw new Error(`MockAPI Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Success response:', result);

      return {    // Return with our custom engagementId added
        ...result,
        engagementId: engagementId
      };
    } catch (error) {
      console.error('Full error details:', error);
      if ((error as Error).name === 'TypeError' && (error as Error).message.includes('fetch')) {
        throw new Error('Network error - check your internet connection and MockAPI URL');
      }
      throw error;
    }
  };

  const handleNext = async () => {   // Validate required fields
    if (!formData.engagementOwner || !formData.speaker) {
      setError('Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting to save to MockAPI...'); 
      const savedEngagement = await saveToMockAPI(formData);
      const engagementData = {
        mockApiId: savedEngagement.id,  // MockAPI generated ID
        engagementId: savedEngagement.engagementId || engagementId,  // Our custom engagement ID
        ...formData
      };
      console.log('Final engagement data:', engagementData);
      onNext(engagementData);        // Call onNext with the saved data including MockAPI ID
      
    } catch (error) {
      console.error('handleNext error:', error);
      if ((error as Error).message.includes('404')) {
        setError('MockAPI resource "engagements" not found. Please create it in your MockAPI dashboard first.');
      } else if ((error as Error).message.includes('400')) {
        setError('Invalid data format. Check console for details.');
      } else {
        setError((error as Error).message || 'Failed to save engagement. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Engagement Overview</h2>
        <p className="text-sm text-gray-500">Create and configure your engagement details</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Engagement ID
          </label>
          <input
            type="text"
            value={engagementId}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          />
          <p className="text-xs text-gray-500 mt-1">Auto-generated unique identifier</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Engagement Owner *
          </label>
          <input
            type="text"
            value={formData.engagementOwner || ''}
            onChange={(e) => onInputChange('engagementOwner', e.target.value)}
            placeholder="Enter engagement owner name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Speaker *
          </label>
          <input
            type="text"
            value={formData.speaker || ''}
            onChange={(e) => onInputChange('speaker', e.target.value)}
            placeholder="Enter speaker name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caterer
          </label>
          <input
            type="text"
            value={formData.caterer || ''}
            onChange={(e) => onInputChange('caterer', e.target.value)}
            placeholder="Enter caterer name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cohost
          </label>
          <input
            type="text"
            value={formData.cohost || ''}
            onChange={(e) => onInputChange('cohost', e.target.value)}
            placeholder="Enter cohost name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={isLoading}
              className={`px-6 py-2 rounded-md transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isLoading ? 'Saving...' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementOverview;