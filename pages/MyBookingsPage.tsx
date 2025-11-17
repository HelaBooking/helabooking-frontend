
import React, { useState, useEffect } from 'react';
import { getBookingsByUserId, getEventById } from '../services/api';
import type { EnrichedBooking, Booking, Event } from '../types';
import { useAuth } from '../hooks/useAuth';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const bookingData = await getBookingsByUserId(user.id);
        
        // Fetch event details for each booking
        const enrichedBookings = await Promise.all(
          bookingData.map(async (booking: Booking) => {
            try {
              const event: Event = await getEventById(String(booking.eventId));
              return { ...booking, event };
            } catch (eventError) {
              console.error(`Failed to fetch event ${booking.eventId}`, eventError);
              return { ...booking, event: undefined }; // Handle case where event fetch fails
            }
          })
        );
        
        setBookings(enrichedBookings);
      } catch (err) {
        setError('Failed to fetch your bookings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-neutral-800 mb-8 text-center">My Bookings</h1>
      {bookings.length > 0 ? (
        <div className="space-y-8">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8 bg-white p-8 rounded-lg shadow">
          <p className="text-lg">You haven't booked any events yet.</p>
          <Link to="/" className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
            Explore Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
