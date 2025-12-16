
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
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-neutral-50 via-neutral-50 to-primary/5 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-elevation-2 mb-4">
            <span className="text-lg font-bold text-white">+</span>
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Create New Event</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">Set up a new event and start accepting bookings</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-elevation-2 border border-neutral-200 dark:border-neutral-700 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center text-sm font-bold">1</span>
                Basic Information
              </h2>
              <div className="space-y-5">
                <div>
                  <label htmlFor="event-name" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-2">
                    Event Name *
                  </label>
                  <input
                    id="event-name"
                    type="text"
                    required
                    placeholder="Enter event name"
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:bg-white dark:focus:bg-neutral-600 transition-all duration-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Enter event description"
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:bg-white dark:focus:bg-neutral-600 transition-all duration-200"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="categories" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-2">
                    Categories
                  </label>
                  <input
                    id="categories"
                    type="text"
                    placeholder="Separate multiple categories with commas"
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:bg-white dark:focus:bg-neutral-600 transition-all duration-200"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Separate multiple categories with commas</p>
                </div>
              </div>
            </div>

            {/* Location & Venue */}
            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center text-sm font-bold">2</span>
                Location & Venue
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-2">
                    Location *
                  </label>
                  <input
                    id="location"
                    type="text"
                    required
                    placeholder="Enter location"
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:bg-white dark:focus:bg-neutral-600 transition-all duration-200"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="venue" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-2">
                    Venue
                  </label>
                  <input
                    id="venue"
                    type="text"
                    placeholder="Enter venue name"
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:bg-white dark:focus:bg-neutral-600 transition-all duration-200"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Date & Capacity */}
            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center text-sm font-bold">3</span>
                Date & Capacity
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="event-date" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    id="event-date"
                    type="datetime-local"
                    required
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:bg-white dark:focus:bg-neutral-600 transition-all duration-200"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="end-date" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-2">
                    End Date & Time
                  </label>
                  <input
                    id="end-date"
                    type="datetime-local"
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:bg-white dark:focus:bg-neutral-600 transition-all duration-200"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="capacity" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-2">
                    Capacity *
                  </label>
                  <input
                    id="capacity"
                    type="number"
                    min="1"
                    required
                    placeholder="Enter number of tickets"
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:bg-white dark:focus:bg-neutral-600 transition-all duration-200"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                  />
                </div>
              </div>
            </div>

            {/* Agenda */}
            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center text-sm font-bold">4</span>
                Agenda
              </h2>
              <label htmlFor="agenda" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-2">
                Event Agenda
              </label>
              <textarea
                id="agenda"
                rows={5}
                placeholder="Enter event schedule/agenda"
                className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:bg-white dark:focus:bg-neutral-600 transition-all duration-200 font-mono text-sm"
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
              />
            </div>

            {/* Event Type */}
            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center text-sm font-bold">5</span>
                Event Type
              </h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-600 hover:border-primary/50 dark:hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer transition-all duration-200">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                    checked={isMultiSession}
                    onChange={(e) => setIsMultiSession(e.target.checked)}
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">Multi-Session Event</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">This event has multiple sessions or days</p>
                  </div>
                </label>

                <label className="flex items-center p-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-600 hover:border-primary/50 dark:hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer transition-all duration-200">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">Recurring Event</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">This event repeats on a schedule</p>
                  </div>
                </label>

                {isRecurring && (
                  <div className="ml-8 pt-4 border-l-2 border-primary pl-6">
                    <label htmlFor="recurrence-pattern" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-2">
                      Recurrence Pattern *
                    </label>
                    <select
                      id="recurrence-pattern"
                      required={isRecurring}
                      className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:bg-white dark:focus:bg-neutral-600 transition-all duration-200"
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex gap-3">
                <span className="text-sm text-red-800 dark:text-red-300 font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-700 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-elevation-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Event...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
