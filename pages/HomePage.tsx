
import React, { useState, useEffect } from 'react';
import { getPublishedEvents } from '../services/api';
import type { Event } from '../types';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getPublishedEvents();
        setEvents(data);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 mb-4">
        </div>
        <p className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error Loading Events</p>
        <p className="text-red-600 dark:text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-r from-primary via-primary-light to-secondary/50 dark:from-primary/90 dark:via-primary-light/80 dark:to-secondary/40 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-white shadow-elevation-3 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
          Discover Amazing Events
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-neutral-100 max-w-2xl mb-4 sm:mb-6">
          Explore a curated collection of events happening around you. Book your tickets and create unforgettable memories.
        </p>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
            <span className="text-xs sm:text-sm font-medium">{events.length} Events Available</span>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Upcoming Events</h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Browse and book your favorite events</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 sm:py-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-neutral-100 mb-4">
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">No Events Available</h3>
          <p className="text-sm sm:text-base text-neutral-600 mb-6">Check back soon for upcoming events</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
