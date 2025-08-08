

// import React, { useEffect, useState } from 'react';
// import { ChevronLeft, ChevronRight, Trash2, Clock, Calendar, AlertCircle } from 'lucide-react';
// import { DateTime as LuxonDateTime } from 'luxon';


// const SelectedSlotsManager = ({ onBack, onNext }) => {
//   const [selectedSlots, setSelectedSlots] = useState([]);

//   useEffect(() => {
//     const storedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '[]');
//     console.log(storedSlots)
//     setSelectedSlots(storedSlots);
//   }, []);

// const deleteSlot = (indexToDelete) => {
//   const updatedSlots = selectedSlots.filter((_, index) => index !== indexToDelete);

//   if (updatedSlots.length === 0) {
//     // Remove the key completely if no slots left
//     localStorage.removeItem('bookedSlots');
//     setSelectedSlots([]);
//     return;
//   }

//   const reorderedSlots = updatedSlots.map((slot, index) => ({
//     ...slot,
//     id: index + 1,
//     priority: index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Third'
//   }));

//   setSelectedSlots(reorderedSlots);
//   localStorage.setItem('bookedSlots', JSON.stringify(reorderedSlots));
// };
// //userSelectedSlots

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'Primary': return 'bg-red-50 border-red-200 text-red-800';
//       case 'Secondary': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
//       case 'Third': return 'bg-green-50 border-green-200 text-green-800';
//       default: return 'bg-gray-50 border-gray-200 text-gray-800';
//     }
//   };

//   const getPriorityIcon = (priority) => {
//     switch (priority) {
//       case 'Primary': return '🥇';
//       case 'Secondary': return '🥈';
//       case 'Third': return '🥉';
//       default: return '⭐';
//     }
//   };

//   const formatDateTime = (isoString) => {
//     const dt = LuxonDateTime.fromISO(isoString);
//     return {
//       date: dt.toFormat('MMM dd, yyyy'),
//       time: dt.toFormat('h:mm a'),
//       dayOfWeek: dt.toFormat('EEEE')
//     };
//   };

//   const hasPrimary = selectedSlots.some(slot => slot.priority === 'Primary');

//   return (
//     <div className="bg-white p-6 rounded-lg border border-gray-200">
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">Selected Time Slots</h3>
//           <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
//             {selectedSlots.length}/3 Selected
//           </span>
//         </div>
//       </div>

//       {!hasPrimary && selectedSlots.length > 0 && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
//           <AlertCircle className="text-red-500 mt-0.5" size={16} />
//           <div>
//             <h4 className="text-red-800 font-medium text-sm">Primary slot required</h4>
//             <p className="text-red-700 text-xs">You must have at least one Primary slot.</p>
//           </div>
//         </div>
//       )}

//       {selectedSlots.length === 0 ? (
//         <div className="text-center py-8">
//           <Clock className="mx-auto mb-3 text-gray-400" size={32} />
//           <h4 className="text-md font-medium text-gray-900 mb-2">No time slots selected</h4>
//           <p className="text-gray-500 text-sm">Go back to select your preferred time slots</p>
//         </div>
//       ) : (
//         <div className="space-y-3 max-h-80 overflow-y-auto">
//    {selectedSlots.map((slot, index) => {
//     const dateTime = formatDateTime(slot.dateTimeUTC);
//     const priorityColor = getPriorityColor(slot.priority);
//     const priorityIcon = getPriorityIcon(slot.priority);
//     const isPrimary = slot.priority === 'Primary';

//     return (
//       <div key={slot.id || index} className={`p-4 rounded-lg border ${priorityColor}`}>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <span className="text-lg">{priorityIcon}</span>
//             <div>
//               <h4 className="font-medium text-sm">{slot.priority || 'Selected'} Slot</h4>
//               <div className="text-xs opacity-75">
//                 {dateTime.date} • {dateTime.time}
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={() => deleteSlot(index)}
//             className="p-1 text-red-500 hover:bg-red-100 rounded-full"
//             title={`Delete ${slot.priority} slot`}
//           >
//             <Trash2 size={14} />
//           </button>
//         </div>
//       </div>
//     );
//   })}
// </div>

//       )}
//     </div>
//   );
// };

// export default SelectedSlotsManager



//   const deleteSlot = (indexToDelete) => {
//     const updatedSlots = selectedSlots.filter((_, index) => index !== indexToDelete);
    
//     const reorderedSlots = updatedSlots.map((slot, index) => ({
//       ...slot,
//       id: index + 1,
//       priority: index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Third'
//     }));
    
//     setSelectedSlots(reorderedSlots);
//     localStorage.setItem('userSelectedSlots', JSON.stringify(reorderedSlots));
//   };





import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2, Clock, Calendar, AlertCircle } from 'lucide-react';
import { DateTime as LuxonDateTime } from 'luxon';

const SelectedSlotsManager = ({ onBack, onNext }) => {
  const [selectedSlots, setSelectedSlots] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('bookedSlots') || '[]');
    console.log('Loaded slots from localStorage:', data.slice(0,3));
    let storedSlots =  data.slice(0,3)
    // Assign priorities based on order (first = Primary, second = Secondary, third = Tertiary)
    const slotsWithPriorities = storedSlots.map((slot, index) => ({
      ...slot,
      id: index + 1,
      priority: index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Tertiary'
    }));
    
    setSelectedSlots(slotsWithPriorities);
  }, []);

  const deleteSlot = (indexToDelete) => {
    const updatedSlots = selectedSlots.filter((_, index) => index !== indexToDelete);

    if (updatedSlots.length === 0) {
      // Remove the key completely if no slots left
      localStorage.removeItem('bookedSlots');
      setSelectedSlots([]);
      return;
    }

    // Reassign priorities after deletion (maintain order-based priority)
    const reorderedSlots = updatedSlots.map((slot, index) => ({
      ...slot,
      id: index + 1,
      priority: index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Tertiary'
    }));

    setSelectedSlots(reorderedSlots);
    localStorage.setItem('bookedSlots', JSON.stringify(reorderedSlots));
  };



const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Primary':
      return 'border-[#BFDBFE] text-black'; 
    case 'Secondary':
      return 'border-gray-300 text-black'; 
    case 'Tertiary':
      return 'border-[#D1FAE5] text-black'; 
    default:
      return 'border-gray-200 text-black'; 
  }
};


  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Primary': return '';
      case 'Secondary': return '';
      case 'Tertiary': return '';
      default: return '⭐';
    }
  };
  //🥇

  const formatDateTime = (slot) => {
 
    let dateTimeString = slot.dateTimeUTC || slot.selectedTime || slot.displayTime;
    
    if (!dateTimeString) {
      return {
        date: 'Invalid Date',
        time: 'Invalid Time',
        dayOfWeek: 'Unknown'
      };
    }

    try {
      const dt = LuxonDateTime.fromISO(dateTimeString);
      return {
        date: dt.toFormat('MMM dd, yyyy'),
        time: dt.toFormat('h:mm a'),
        dayOfWeek: dt.toFormat('EEEE'),
        timezone: slot.timezone || slot.displayTimeZone || 'UTC'
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      return {
        date: 'Invalid Date',
        time: 'Invalid Time',
        dayOfWeek: 'Unknown',
        timezone: slot.timezone || 'UTC'
      };
    }
  };

  const hasPrimary = selectedSlots.some(slot => slot.priority === 'Primary');
  const canProceed = selectedSlots.length > 0 && hasPrimary;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900">Selected Time Slots</h3>
          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {selectedSlots.length}/3 Selected
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Manage your preferred meeting times. First slot becomes Primary, second becomes Secondary.
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {!hasPrimary && selectedSlots.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-red-800 font-semibold text-sm">Primary slot required</h4>
              <p className="text-red-700 text-sm mt-1">You must have at least one Primary slot to proceed.</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {selectedSlots.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="text-gray-400" size={32} />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No time slots selected</h4>
            <p className="text-gray-500 text-sm mb-6">Select your preferred meeting times to continue</p>
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar className="mr-2" size={16} />
              Select Time Slots
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Slots list */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedSlots.map((slot, index) => {
                const dateTime = formatDateTime(slot);
                const priorityColor = getPriorityColor(slot.priority);
                const priorityIcon = getPriorityIcon(slot.priority);

                return (
                  <div key={slot.id || index} className={`p-4 rounded-lg border-2 ${priorityColor} transition-all duration-200 hover:shadow-md`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{priorityIcon}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-base">{slot.priority} Slot</h4>
                            {slot.priority === 'Primary' && (
                              <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                                Required
                              </span>
                            )}
                          </div>
                          <div className="text-sm opacity-90 space-y-1">
                            <div className="flex items-center space-x-2">
                              <Calendar size={14} />
                              <span>{dateTime.dayOfWeek}, {dateTime.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock size={14} />
                              <span>{dateTime.time} {dateTime.timezone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteSlot(index)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                        title={`Delete ${slot.priority} slot`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add more slots button */}
            {selectedSlots.length < 3 && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={onBack}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Clock size={20} />
                    <span className="font-medium">Select Alternative Date & Time</span>
                  </div>
                  <p className="text-sm mt-1">Add {3 - selectedSlots.length} more slot{3 - selectedSlots.length !== 1 ? 's' : ''}</p>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedSlots.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="mr-2" size={16} />
              Back to Calendar
            </button>
            
            <div className="flex items-center space-x-3">
              {!canProceed && (
                <span className="text-sm text-red-600 font-medium">
                  Primary slot required to continue
                </span>
              )}
              <button
                onClick={onNext}
                disabled={!canProceed}
                className={`inline-flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
                  canProceed
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
                <ChevronRight className="ml-2" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedSlotsManager;




  // const getPriorityColor = (priority) => {
  //   switch (priority) {
  //     case 'Primary': return 'bg-red-50 border-red-200 text-red-800';
  //     case 'Secondary': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
  //     case 'Tertiary': return 'bg-green-50 border-green-200 text-green-800';
  //     default: return 'bg-gray-50 border-gray-200 text-gray-800';
  //   }
  // };

//   const getPriorityColor = (priority) => {
//   switch (priority) {
//     case 'Primary':
//       return 'border-[#FCA5A5] text-[#B91C1C]'; 
//     case 'Secondary':
//       return 'border-[#FCD34D] text-[#92400E]';
//     case 'Tertiary':
//       return 'border-[#6EE7B7] text-[#065F46]'; 
//     default:
//       return 'border-gray-300 text-gray-800';
//   }
// };
