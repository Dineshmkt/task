import  { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Shield, ShieldOff } from 'lucide-react';
import { DateTime as LuxonDateTime } from 'luxon';
import SelectedSlotsManager from './SelectedSlotsManager';

const DateTime = ({ formData, onInputChange, onBack, engagementId, onNext }:any) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date(2025, 7));
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [showValue, setShowValue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bufferEnabled, setBufferEnabled] = useState(false); 

  const MOCKAPI_URL = 'https://688f0331f21ab1769f87f43a.mockapi.io/engagements';

  const timezones = [
    { value: 'ET', label: 'ET' },
    { value: 'CT', label: 'CT' },
    { value: 'MT', label: 'MT' },
    { value: 'AT', label: 'AT' },
    { value: 'HT', label: 'HT' }, 
  ];

  const getLuxonZone = (tz:any) => {
    switch (tz) {
      case 'ET': return 'America/New_York';
      case 'CT': return 'America/Chicago';
      case 'MT': return 'America/Denver';
      case 'AT': return 'America/Halifax';
      case 'HT': return 'Pacific/Honolulu'; 
      default: return 'UTC';
    }
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bookedSlots') || '[]');
    setBookedSlots(stored);
  }, []);

  const isSlotInBuffer = (slot:any) => {
    if (!bufferEnabled || bookedSlots.length === 0) return false;

    const slotTime = slot.toUTC();
    
    return bookedSlots.some(bookedSlot => {
      const bookedTime = LuxonDateTime.fromISO(bookedSlot.dateTimeUTC);
      const timeDiff = Math.abs(slotTime.diff(bookedTime, 'minutes').minutes);
      // Disable if within 30 minutes before or after (but not the exact slot)
      return timeDiff > 0 && timeDiff <= 30;
    });
  };

// New function to handle timezone changes and adjust selected date/time
  const handleTimezoneChange = (newTimezone:any) => {
    const oldTimezone = formData.timezone;
     onInputChange('timezone', newTimezone);     // Update the timezone first

    
    if (formData.selectedDate && formData.selectedTime && oldTimezone) {
      const oldZone = getLuxonZone(oldTimezone);
      const newZone = getLuxonZone(newTimezone);
      console.log("oldzone",oldZone)
      // Convert the selected time to the new timezone
      const selectedDateTime = LuxonDateTime.fromISO(formData.selectedTime);
      const convertedDateTime = selectedDateTime.setZone(newZone);
      
      // Update both date and time
      const newJSDate = convertedDateTime.toJSDate();
      onInputChange('selectedDate', newJSDate);
      onInputChange('selectedTime', convertedDateTime.toISO());
      
      
      setSelectedMonth(new Date(newJSDate.getFullYear(), newJSDate.getMonth()));
      
      console.log(`Timezone changed from ${oldTimezone} to ${newTimezone}`);
      console.log(`Original time: ${selectedDateTime.toFormat('MMM d, h:mm a')} (${oldTimezone})`);
      console.log(`Converted time: ${convertedDateTime.toFormat('MMM d, h:mm a')} (${newTimezone})`);
      console.log(`Calendar navigated to: ${newJSDate.getFullYear()}-${newJSDate.getMonth() + 1}`);
    } else if (!formData.selectedDate && !formData.selectedTime) {
      // If no date/time is selected yet, just update timezone
      console.log(`Timezone changed to ${newTimezone} (no existing selection)`);
    }
    
    setShowTimezoneDropdown(false);
  };

  const changeMonth = (direction:any) => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const selectDate = (day:any) => {
    const newDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    onInputChange('selectedDate', newDate);
    onInputChange('selectedTime', null); 
  };

  // Enhanced handleSlotClick with complete data structure
  const handleSlotClick = (slot:any) => {
    const slotUTC = slot.toUTC().toISO();
    onInputChange('selectedTime', slot.toISO());

    const completeSlotData = {
      dateTimeUTC: slotUTC,
      selectedDate: formData.selectedDate ? formData.selectedDate.toISOString() : new Date().toISOString(),
      selectedTime: slot.toISO(),
      timezone: formData.timezone || 'ET',
      createdAt: new Date().toISOString(),
      // Add index-based priority for ordering
      slotIndex: bookedSlots.length,
      // Optional: Add formatted display values
      displayDate: slot.toFormat('yyyy-MM-dd'),
      displayTime: slot.toFormat('h:mm a'),
      displayTimeZone: formData.timezone || 'ET'
    };

    console.log('Creating slot with complete data:', completeSlotData);

    const updated = [...bookedSlots, completeSlotData];
    localStorage.setItem('bookedSlots', JSON.stringify(updated));
    setBookedSlots(updated);
  };

  const isSlotBooked = (slot:any) => {
    const slotUTC = slot.toUTC().toISO();
    return bookedSlots.some(booked => booked.dateTimeUTC === slotUTC);
  };

  const generateSlotsForDate = (date:any) => {
    if (!date || !formData.timezone) return [];

    const zone = getLuxonZone(formData.timezone);
    const baseDate = LuxonDateTime.fromJSDate(date).setZone(zone).startOf('day');
    return Array.from({ length: 48 }, (_, i) => baseDate.plus({ minutes: i * 30 }));
  };

  
  // Enhanced handleNext with complete data structure for all slots
  const handleNext = async () => {
    if (!engagementId) {
      setError('No engagement ID provided');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get first 3 slots from localStorage in order
      const storedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '[]');
      const firstThreeSlots = storedSlots.slice(0, 3);

      console.log('First 3 slots from localStorage:', firstThreeSlots);

     
      const createCompleteSlot = (slotData:any, priority:any, id:any) => {
        if (!slotData) return undefined;
        
        return {
          id: id,
          priority: priority,
          dateTimeUTC: slotData.dateTimeUTC,
          selectedDate: slotData.selectedDate,
          selectedTime: slotData.selectedTime,
          timezone: slotData.timezone,
          createdAt: slotData.createdAt,
          displayDate: slotData.displayDate,
          displayTime: slotData.displayTime,
          displayTimeZone: slotData.displayTimeZone
        };
      };

     
      const getResponse = await fetch(`${MOCKAPI_URL}/${engagementId}`);
      if (!getResponse.ok) {
        throw new Error('Failed to fetch current engagement data');
      }
      const currentData = await getResponse.json();

      
      const updatePayload = {
        ...currentData,    // Keep existing engagement data
        primary: createCompleteSlot(firstThreeSlots[0], 'Primary', 1),
        secondary: createCompleteSlot(firstThreeSlots[1], 'Secondary', 2),
        tertiary: createCompleteSlot(firstThreeSlots[2], 'Tertiary', 3),
        updatedAt: new Date().toISOString(),
        totalSlotsSelected: firstThreeSlots.length
      };

      console.log('Update payload with complete structure:', JSON.stringify(updatePayload, null, 2));

      const putResponse = await fetch(`${MOCKAPI_URL}/${engagementId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!putResponse.ok) {
        const errorText = await putResponse.text();
        console.error('PUT Error Response:', errorText);
      
        throw new Error(`Failed to update engagement: ${putResponse.status} ${putResponse.statusText}`);
      }

      const updatedEngagement = await putResponse.json();
      console.log('Successfully updated engagement with complete slots:', updatedEngagement);

      console.log('Primary slot structure:', updatedEngagement.primary);
      console.log('Secondary slot structure:', updatedEngagement.secondary);
      console.log('Tertiary slot structure:', updatedEngagement.tertiary);

      if (onNext) {
        onNext(updatedEngagement);
      }

    } catch (error) {
      console.error('handleNext error:', error);
      setError((error as Error).message || 'Failed to save slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
    const firstDayOfWeek = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay();
    const blanks = (firstDayOfWeek + 6) % 7;

    const days = [];
    const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    for (let i = 0; i < blanks; i++) {
        days.push(<div key={`blank-${i}`} className="w-10 h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        formData.selectedDate &&
        formData.selectedDate.getDate() === day &&
        formData.selectedDate.getMonth() === selectedMonth.getMonth() &&
        formData.selectedDate.getFullYear() === selectedMonth.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => selectDate(day)}
          disabled={loading}
          className={`w-10 h-10 rounded hover:bg-blue-50 ${
            isSelected ? 'bg-blue-600 text-white' : 'text-gray-900 hover:text-blue-600'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
          {dayNames.map(day => (
            <div key={day} className="p-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  const slotsForDate = generateSlotsForDate(formData.selectedDate);

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Date & Time</h2>
            {engagementId && (
              <p className="text-xs text-gray-500">Engagement ID: {engagementId}</p>
            )}
          </div>
          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
            Lead Time
          </span>
        </div>
        <p className="text-sm text-gray-500">Select date & time</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => setError('')}
            className="mt-2 text-sm text-red-600 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-blue-800">Saving complete slot structures to engagement...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => changeMonth(-1)} 
              className="p-1 hover:bg-gray-100 rounded"
              disabled={loading}
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-semibold">
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button 
              onClick={() => changeMonth(1)} 
              className="p-1 hover:bg-gray-100 rounded"
              disabled={loading}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          {renderCalendar()}
        </div>

        {/* Right Panel - Conditional Rendering */}
        {!showValue ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            {/* Timezone Selector with Buffer Toggle */}
            <div className="mb-6 relative">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                  className="flex-1 px-4 py-3 text-left border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-between"
                  disabled={loading}
                >
                  <span className="text-gray-500">
                    {formData.timezone || 'Select Timezone'}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`transform transition-transform ${showTimezoneDropdown ? 'rotate-90' : ''}`}
                  />
                </button>
                
                {/* Buffer Toggle Button */}
                <button
                  onClick={() => setBufferEnabled(!bufferEnabled)}
                  className={`px-3 py-3 border rounded-md transition-colors flex items-center gap-2 ${
                    bufferEnabled 
                       ?'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                      // ? 'bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100' 
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                  title={bufferEnabled ? 'Disable 30-minute buffer' : 'Enable 30-minute buffer'}
                  disabled={loading}
                >
                  {bufferEnabled ? <Shield size={16} /> : <ShieldOff size={16} />}
                  <span className="text-xs font-medium">
                    {bufferEnabled ? '30m' : 'OFF'}
                  </span>
                </button>
              </div>

              {/* Buffer status indicator */}

              {bufferEnabled && bookedSlots.length > 0 && (
                <div className="mb-3 p-2 bg-white-50 border border-black-200 rounded-md">
                  <p className="text-xs ">
                    <Shield size={12} className="inline mr-1" />
                    30-minute buffer active - slots within 30 minutes of selected times are disabled
                  </p>
                </div>
              )}

              {showTimezoneDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {timezones.map((tz) => (
                    <button
                      key={tz.value}
                      onClick={() => handleTimezoneChange(tz.value)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      disabled={loading}
                    >
                      {tz.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {slotsForDate.map((slot, index) => {
                const isBooked = isSlotBooked(slot);
                const isInBuffer = isSlotInBuffer(slot);
                const isDisabled = isBooked || isInBuffer;
                const isSelected =
                  formData.selectedTime &&
                  LuxonDateTime.fromISO(formData.selectedTime).toISO() === slot.toISO();

                return (
                  <button
                    key={index}
                    onClick={() => !isDisabled && !loading && handleSlotClick(slot)}
                    disabled={isDisabled || loading}
                    className={`p-3 text-sm border rounded transition-all ${
                      isBooked
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed blur-[1px]'
                        : isInBuffer
                        // ? 'bg-orange-100 border-orange-300 text-orange-400 cursor-not-allowed opacity-60'  ..
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed '
                        : isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'border-gray-200 text-gray-700 hover:bg-blue-50'
                    }`}
                    title={isInBuffer ? '30-minute buffer zone' : ''}
                  >
                    {slot.toFormat('h:mm a')}
                    {isInBuffer && (
                      <span className="block text-xs mt-1 opacity-75">
                        Buffer
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Show current localStorage slots count */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Selected slots: {bookedSlots.length} 
                {bookedSlots.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {' '}(First 3 will be saved as Primary, Secondary, Tertiary)
                  </span>
                )}
              </p>
              
             
              
              {/* Clear slots button for testing */}
              <button
                onClick={() => {
                  localStorage.removeItem('bookedSlots');
                  setBookedSlots([]);
                }}
                className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Clear All Slots
              </button>
            </div>
          </div>
        ) : (
          <div>
            <SelectedSlotsManager
              onBack={() => setShowValue(false)}
              onNext={handleNext}  
              engagementId={engagementId}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          disabled={loading}
        >
          Back
        </button>
        <div className="space-x-4">
          <button 
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50" 
            onClick={() => setShowValue(true)}
            disabled={loading}
          >
            Save Draft
          </button>
          <button 
            className={`px-6 py-2 rounded-md ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
            onClick={handleNext}
            disabled={loading || bookedSlots.length === 0}
          >
            {loading ? 'Saving...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DateTime;