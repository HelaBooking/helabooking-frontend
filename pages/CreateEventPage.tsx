
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createEvent } from '../services/api';
import type { RecurrencePattern } from '../types';

const CreateEventPage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [venue, setVenue] = useState('');
  const [agenda, setAgenda] = useState('');
  const [categories, setCategories] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [capacity, setCapacity] = useState(100);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>(null);
  const [isMultiSession, setIsMultiSession] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const eventData: any = { 
        name, 
        description,
        location, 
        venue,
        agenda,
        categories,
        eventDate: new Date(eventDate).toISOString(), 
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        capacity,
        isRecurring,
        recurrencePattern: isRecurring ? recurrencePattern : null,
        isMultiSession
      };
      
      const newEvent = await createEvent(eventData);
      navigate(`/event/${newEvent.id}`);
    } catch (err) {
      setError('Failed to create event. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a New Event</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="event-name" className="block text-sm font-medium text-gray-700">Event Name *</label>
              <input
                id="event-name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location *</label>
                <input
                  id="location"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
                <input
                  id="venue"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="agenda" className="block text-sm font-medium text-gray-700">Agenda</label>
              <textarea
                id="agenda"
                rows={4}
                placeholder="09:00 - Registration&#10;10:00 - Opening Ceremony&#10;12:00 - Lunch"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="categories" className="block text-sm font-medium text-gray-700">Categories</label>
              <input
                id="categories"
                type="text"
                placeholder="Technology,Conference,Networking"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">Separate multiple categories with commas</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-date" className="block text-sm font-medium text-gray-700">Start Date and Time *</label>
                <input
                  id="event-date"
                  type="datetime-local"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date and Time</label>
                <input
                  id="end-date"
                  type="datetime-local"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity *</label>
              <input
                id="capacity"
                type="number"
                min="1"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  id="multi-session"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={isMultiSession}
                  onChange={(e) => setIsMultiSession(e.target.checked)}
                />
                <label htmlFor="multi-session" className="ml-2 block text-sm text-gray-700">
                  Multi-Session Event
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="recurring"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                <label htmlFor="recurring" className="ml-2 block text-sm text-gray-700">
                  Recurring Event
                </label>
              </div>
            </div>

            {isRecurring && (
              <div>
                <label htmlFor="recurrence-pattern" className="block text-sm font-medium text-gray-700">Recurrence Pattern *</label>
                <select
                  id="recurrence-pattern"
                  required={isRecurring}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={recurrencePattern || ''}
                  onChange={(e) => setRecurrencePattern(e.target.value as RecurrencePattern)}
                >
                  <option value="">Select pattern...</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
            )}
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
