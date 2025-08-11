import { useState, useEffect } from "react";
import MainEngagementCreator from "./MainEngagementCreator";
import {  useNavigate } from "react-router-dom";

interface EngagementSlot {
  id: string | number;
  engagementId?: string | number;
  engagementOwner?: string;
  owner?: string;
  speaker?: string;
  caterer?: string;
  cohost?: string;
  createdAt?: string;
  priority?: string;
  [key: string]: any;
}

interface GroupedEngagement {
  id: string | number;
  engagementOwner: string;
  speaker: string;
  caterer: string;
  cohost: string;
  createdAt?: string;
  slots: EngagementSlot[];
}


const EngagementManager = () => {
  const [currentView, setCurrentView] = useState('list'); 
  const [engagements, setEngagements] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
   const navigate=useNavigate()
  const MOCKAPI_URL = 'https://688f0331f21ab1769f87f43a.mockapi.io/engagements';

 
  const fetchEngagements = async () => {     // Fetch engagements from MockAPI
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(MOCKAPI_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch engagements');
      }
      
      const data = await response.json();
      console.log('Fetched raw data:', data);
      
      
      // const groupedData = {};
      const groupedData: Record<string | number, GroupedEngagement | EngagementSlot> = {};

      data.forEach((item:any) => {
        if (item.priority) {
          const engagementId = item.engagementId || item.id; 
          
          if (!groupedData[engagementId]) {
            groupedData[engagementId] = {
              id: engagementId,
              engagementOwner: item.engagementOwner || item.owner || '',
              speaker: item.speaker || '',
              caterer: item.caterer || '',
              cohost: item.cohost || '',
              createdAt: item.createdAt,
              slots: []
            };
          }
          
          groupedData[engagementId].slots.push(item);
        } else {
          if (!groupedData[item.id]) {       
            groupedData[item.id] = item;
          }
        }
      });
      
      const processedEngagements = Object.values(groupedData);
      console.log('Processed engagements:', processedEngagements);
      setEngagements(processedEngagements);
      
    } catch (err) {
      console.error('Error fetching engagements:', err);
      setError('Failed to load engagements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngagements();
  }, []);

 
  const findSlotByPriority = (engagementData:any, priority:any) => { 
    if (engagementData[priority.toLowerCase()]) {
      return engagementData[priority.toLowerCase()];
    }
    if (engagementData.slots && Array.isArray(engagementData.slots)) {
      return engagementData.slots.find((slot:any) => slot.priority === priority);
    }
    if (engagementData.priority === priority) {
      return engagementData;
    } 
    return null;
  };

  
  const formatDateTime = (slotObject:any) => {
    if (!slotObject || !slotObject.selectedDate || !slotObject.selectedTime ) {
      return (
        <span style={{ 
          color: '#999', 
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          --
        </span>
      );
    }
    
    try {
      const date = new Date(slotObject.selectedDate).toLocaleDateString();
      const time = new Date(slotObject.selectedTime).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const timezone = slotObject.timezone || '';
      
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#28a745', fontSize: '14px' }}></span>
          {`${date} ${time} ${timezone}`}
        </span>
      );
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return (
        <span style={{ 
          color: '#dc3545', 
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          failed to fetch data
        </span>
      );
    }
  };

  const handleCreateEngagement = () => {
    setCurrentView('create');
  };

  // const handleBackToList = () => {
  //   setCurrentView('list');
  //   fetchEngagements();
  // };

  // const handleSaveEngagement = (formData:any) => {
  //   console.log('Engagement saved:', formData);
  //   setCurrentView('list');
  //   fetchEngagements();
  // };

  const filteredEngagements = engagements.filter(eng =>
    Object.values(eng).some(val => {
      if (val && typeof val === 'object') {
        return Object.values(val).some(nestedVal => 
          nestedVal && nestedVal.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return val && val.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  if (currentView === 'create') {
    return <MainEngagementCreator  />;
  }
  //onBack={handleBackToList} onSave={handleSaveEngagement}

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px', 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <h1 style={{ fontSize: '24px', color: '#333', fontWeight: '600', margin: 0 }}>
          All Engagements
        </h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px', 
              width: '250px', 
              fontSize: '14px' 
            }}
          />
          <button
            onClick={handleCreateEngagement}
            style={{ 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              fontSize: '14px', 
              cursor: 'pointer' 
            }}
          >
            + Create Engagement
          </button>
          <button
            onClick={fetchEngagements}
            disabled={loading}
            style={{ 
              background: '#28a745', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              fontSize: '14px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600', 
                fontSize: '14px', 
                color: '#333', 
                borderBottom: '1px solid #dee2e6' 
              }}>
                Engagement ID
              </th>
              <th style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600', 
                fontSize: '14px', 
                color: '#333', 
                borderBottom: '1px solid #dee2e6' 
              }}>
                Engagement Owner
              </th>
              <th style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600', 
                fontSize: '14px', 
                color: '#333', 
                borderBottom: '1px solid #dee2e6' 
              }}>
                Speaker
              </th>
              <th style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600', 
                fontSize: '14px', 
                color: '#333', 
                borderBottom: '1px solid #dee2e6' 
              }}>
                Caterer
              </th>
              <th style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600', 
                fontSize: '14px', 
                color: '#333', 
                borderBottom: '1px solid #dee2e6' 
              }}>
                Cohost
              </th>
              <th style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                textAlign: 'center', 
                fontWeight: '600', 
                fontSize: '14px', 
                color: '#333', 
                borderBottom: '1px solid #dee2e6' 
              }}>
                Primary Date and Time
              </th>
              <th style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                textAlign: 'center', 
                fontWeight: '600', 
                fontSize: '14px', 
                color: '#333', 
                borderBottom: '1px solid #dee2e6' 
              }}>
                Secondary Date and Time
              </th>
              <th style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                textAlign: 'center', 
                fontWeight: '600', 
                fontSize: '14px', 
                color: '#333', 
                borderBottom: '1px solid #dee2e6' 
              }}>
                Tertiary Date and Time
              </th>
              <th style={{ 
                background: '#f8f9fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600', 
                fontSize: '14px', 
                color: '#333', 
                borderBottom: '1px solid #dee2e6' 
              }}>
                Created Date and Time
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td 
                  colSpan={9}
                  style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#666',
                    borderBottom: '1px solid #dee2e6'
                  }}
                >
                  Loading engagements...
                </td>
              </tr>
            ) : filteredEngagements.length === 0 ? (
              <tr>
                <td 
                  colSpan={9} 
                  style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#666',
                    borderBottom: '1px solid #dee2e6'
                  }}
                >
                  {searchTerm ? 'No engagements found matching your search' : 'No engagements found'}
                </td>
              </tr>
            ) : (
              filteredEngagements.map((engagement) => (
                <tr key={engagement.id} style={{ cursor: 'pointer' }}>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6', 
                    fontSize: '14px' 
                  }}
                     onClick={() => navigate(`/engagement/${engagement.id}`)}
                  >
                    {engagement.id}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6', 
                    fontSize: '14px' 
                  }}>
                    {engagement.engagementOwner || engagement.owner || ''}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6', 
                    fontSize: '14px' 
                  }}>
                    {engagement.speaker || ''}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6', 
                    fontSize: '14px' 
                  }}>
                    {engagement.caterer || ''}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6', 
                    fontSize: '14px' 
                  }}>
                    {engagement.cohost || ''}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6', 
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {formatDateTime(findSlotByPriority(engagement, 'Primary'))}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6', 
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {formatDateTime(findSlotByPriority(engagement, 'Secondary'))}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6', 
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {formatDateTime(findSlotByPriority(engagement, 'Tertiary'))}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6', 
                    fontSize: '14px' 
                  }}>
                    {engagement.createdAt ? new Date(engagement.createdAt).toLocaleString() : ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default EngagementManager;