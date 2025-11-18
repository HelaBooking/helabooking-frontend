
import React from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
}

const formatDate = (dateArray: number[] | string): string => {
  if (typeof dateArray === 'string') {
    return new Date(dateArray).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Link to={`/event/${event.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transform group-hover:scale-105 transition-transform duration-300 ease-in-out">
        <img
          src={`https://picsum.photos/seed/${event.id}/400/200`}
          alt={event.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl font-bold text-neutral-800 mb-2 truncate">{event.name}</h3>
          {event.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
          )}
          <p className="text-gray-600 mb-2">{formatDate(event.eventDate)}</p>
          
          {event.categories && (
            <div className="mb-3 flex flex-wrap gap-1">
              {event.categories.split(',').slice(0, 3).map((category, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {category.trim()}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {event.location}
            </span>
            <span className={`font-semibold ${event.availableSeats > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {event.availableSeats > 0 ? `${event.availableSeats} seats left` : 'Sold Out'}
            </span>
          </div>
          
          {(event.isRecurring || event.isMultiSession) && (
            <div className="mt-2 flex gap-2">
              {event.isRecurring && (
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                  Recurring
                </span>
              )}
              {event.isMultiSession && (
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded">
                  Multi-Session
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
