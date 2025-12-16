
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
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const { event } = booking;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-elevation-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-elevation-2 transition-all duration-300 flex flex-col sm:flex-row animate-fade-in">
      {/* Image */}
      <div className="flex-shrink-0 w-full sm:w-40 md:w-48 h-40 sm:h-auto">
        <img
          src={`https://picsum.photos/seed/${booking.eventId}/400/400`}
          alt={event?.name || 'Event Image'}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3">
            <p className="text-[10px] sm:text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Booking ID: #{booking.id}
            </p>
            <span
              className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                booking.status === 'CONFIRMED'
                  ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800'
                  : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2 ${booking.status === 'CONFIRMED' ? 'bg-green-600 dark:bg-green-500' : 'bg-red-600 dark:bg-red-500'}`} />
              {booking.status}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 line-clamp-2">
            {event ? (
              <Link
                to={`/event/${event.id}`}
                className="hover:text-primary transition-colors duration-200"
              >
                {event.name}
              </Link>
            ) : (
              <span>Event details loading...</span>
            )}
          </h3>

          {event && (
            <div className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <p className="flex items-center gap-2">
                <span className="line-clamp-1">{formatDate(event.eventDate)}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="line-clamp-1">{event.location}</span>
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-200 dark:border-neutral-700 flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap items-start gap-4 lg:gap-6">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                Tickets
              </p>
              <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                {booking.numberOfTickets}
              </p>
            </div>
            {booking.ticketType && (
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                  Type
                </p>
                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light text-xs sm:text-sm font-semibold border border-primary/20 dark:border-primary/30">
                  {booking.ticketType}
                </span>
              </div>
            )}
            {booking.totalPrice !== undefined && (
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                  Total
                </p>
                <p className="text-xl sm:text-2xl font-bold text-primary">
                  Rs. {booking.totalPrice.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
