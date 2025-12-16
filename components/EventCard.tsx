import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Repeat2, Grid3X3, CheckCircle, AlertCircle } from 'lucide-react';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
}

const formatDate = (dateArray: number[] | string): string => {
  if (typeof dateArray === 'string') {
    return new Date(dateArray).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  if (!dateArray || dateArray.length < 5) return "Date not available";
  const [year, month, day, hour, minute] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Link to={`/event/${event.id}`} className="block group h-full animate-fade-in">
      <div className="h-full bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col border border-neutral-200 dark:border-neutral-700 hover:border-primary/30 dark:hover:border-primary/40">
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-300">
          <img
            src={`https://picsum.photos/seed/${event.id}/400/200`}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {/* Overlay Badge */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-1 sm:gap-2">
            {event.isRecurring && (
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-elevation-2">
                <Repeat2 size={12} className="sm:hidden" />
                <span className="hidden sm:inline flex items-center gap-1"><Repeat2 size={14} /> Recurring</span>
              </span>
            )}
            {event.isMultiSession && (
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-elevation-2">
                <Grid3X3 size={12} className="sm:hidden" />
                <span className="hidden sm:inline flex items-center gap-1"><Grid3X3 size={14} /> Multi-Session</span>
              </span>
            )}
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {event.name}
          </h3>

          {/* Description */}
          {event.description && (
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-3 sm:mb-4 line-clamp-2 flex-shrink-0">
              {event.description}
            </p>
          )}

          {/* Categories */}
          {event.categories && (
            <div className="mb-3 sm:mb-4 flex flex-wrap gap-1.5 sm:gap-2">
              {event.categories
                .split(',')
                .slice(0, 2)
                .map((category, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light text-[10px] sm:text-xs font-medium rounded-lg border border-primary/20 dark:border-primary/30 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                  >
                    {category.trim()}
                  </span>
                ))}
              {event.categories.split(',').length > 2 && (
                <span className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-500 py-1">
                  +{event.categories.split(',').length - 2}
                </span>
              )}
            </div>
          )}

          {/* Date and Location */}
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 flex-grow">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <MapPin size={14} className="flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <Calendar size={14} className="flex-shrink-0" />
              <span className="line-clamp-1">{formatDate(event.eventDate)}</span>
            </div>
          </div>

          {/* Availability Footer */}
          <div className="pt-3 sm:pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div
              className={`flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors ${
                event.availableSeats > 0
                  ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              <span className="flex items-center gap-1">
                {event.availableSeats > 0 ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {event.availableSeats > 0
                  ? `${event.availableSeats} seat${event.availableSeats !== 1 ? 's' : ''}`
                  : 'Sold Out'}
              </span>
              
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
