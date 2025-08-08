import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, Target } from 'lucide-react';
import { useParams } from 'react-router-dom';

const EngagementDetails = () => {
  
 const {id}=useParams()
  const [engagement, setEngagement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const MOCKAPI_URL = 'https://688f0331f21ab1769f87f43a.mockapi.io/engagements';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${MOCKAPI_URL}/${id}`);
        const data = await res.json();
        console.log("fetchdata", data.primary?.dateTimeUTC);
        setEngagement(data);
      } catch (err) {
        console.error('Fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
     
      const response = await fetch(`${MOCKAPI_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...engagement,
          status: 'Approved'
        }),
      });
      
      if (response.ok) {
        const updatedData = await response.json();
        setEngagement(updatedData);
        alert('Engagement approved successfully!');
      } else {
        throw new Error('Failed to approve engagement');
      }
    } catch (error) {
      console.error('Error approving engagement:', error);
      alert('Failed to approve engagement. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    if (window.confirm('Are you sure you want to decline and delete this engagement?')) {
      setActionLoading(true);
      try {
        const response = await fetch(`${MOCKAPI_URL}/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('Engagement declined and deleted successfully!');
          console.log("data submitted succesfully")
          window.history.back();
        } else {
          throw new Error('Failed to delete engagement');
        }
      } catch (error) {
        console.error('Error declining engagement:', error);
        alert('Failed to decline engagement. Please try again.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading engagement details...</p>
      </div>
    </div>
  );

  if (!engagement) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 text-lg">Engagement not found</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
   
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="text-sm text-gray-500">All Engagements / Engagement ID - {id}</div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              Approve
            </button>
            <button
              onClick={handleDecline}
              disabled={actionLoading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              
             Decline
            </button>
          </div>
        </div>
      </div>

  
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
       
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Engagements - Live In Office
                </h1>
                <p className="text-sm text-blue-600 mt-1">Awaiting Speaker Reply</p>
              </div>
            </div>
          </div>

          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
             
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Engagement ID:</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    NEX-CYC-{id}
                  </div>
                </div>
              </div>

        
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Engagement Date & Time</div>
                  <div className="text-sm text-gray-700 mt-1">
                    {engagement.primary?.displayDate && engagement.primary?.displayTime ? 
                      `${engagement.primary.displayDate}, ${engagement.primary.displayTime} ${engagement.primary.displayTimeZone}` 
                      : 'Select the Time and Date'}
                  </div>
                </div>
              </div>

         
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  {/* <User className="w-5 h-5 text-orange-600" /> */}
                  <img className='w-5 h-5' src="data:image/png;base64,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" alt="" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Speaker</div>
                  <div className="text-sm text-blue-600 underline mt-1 cursor-pointer">
                    {engagement.speaker || 'Mutyala Sankar'}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      Unresponsive
                    </span>
                    <Phone className="w-4 h-4 text-gray-400 cursor-pointer" />
                    <Mail className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>
                </div>
              </div>

    
              <div >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {engagement.engagementOwner || 'Dan Willium'}
                  </div>
                  <div className="text-xs text-gray-500">Engagement Owner</div>
                </div>
                <div className="flex items-center space-x-2 ml-auto">
                  <Phone className="w-4 h-4 text-gray-400 cursor-pointer" />
                  <Mail className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
              </div>
            </div>

            </div> 

        
          </div>
        </div>
      </div>
      
      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementDetails;