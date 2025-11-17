
import React from 'react';
import { Link } from 'react-router-dom';
import type { EnrichedBooking } from '../types';

interface BookingCardProps {
  booking: EnrichedBooking;
}

const formatDate = (dateArray: number[]): string => {
  if (!dateArray || dateArray.length < 5) return "Date not available";
  const [year, month, day, hour, minute] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const { event } = booking;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row">
      <img
        src={`https://picsum.photos/seed/${booking.eventId}/400/400`}
        alt={event?.name || 'Event Image'}
        className="w-full sm:w-1/3 h-48 sm:h-auto object-cover"
      />
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <p className="text-sm text-gray-500">Booking ID: #{booking.id}</p>
          <h3 className="text-2xl font-bold text-neutral-800 mt-1 mb-2">
            {event ? (
              <Link to={`/event/${event.id}`} className="hover:text-primary transition-colors">
                {event.name}
              </Link>
            ) : (
              'Event details loading...'
            )}
          </h3>
          {event && (
            <>
              <p className="text-gray-600 mb-2">{formatDate(event.eventDate)}</p>
              <p className="text-gray-500 flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {event.location}
              </p>
            </>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-baseline">
          <div>
            <p className="text-sm text-gray-500">Tickets</p>
            <p className="text-xl font-semibold text-neutral-800">{booking.numberOfTickets}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {booking.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
