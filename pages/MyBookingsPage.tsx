
import React, { useState, useEffect } from 'react';
import { getBookingsByUserId, getEventById, getTicketsByBooking } from '../services/api';
import type { EnrichedBooking, Booking, Event, Ticket } from '../types';
import { useAuth } from '../hooks/useAuth';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookingTickets, setSelectedBookingTickets] = useState<Ticket[]>([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);

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

  const handleViewTickets = async (bookingId: number) => {
    setLoadingTickets(true);
    try {
      const tickets = await getTicketsByBooking(bookingId);
      setSelectedBookingTickets(tickets);
      setIsTicketModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch tickets', err);
      alert('Failed to load tickets. Please try again.');
    } finally {
      setLoadingTickets(false);
    }
  };

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
            <div key={booking.id} className="bg-white rounded-lg shadow-lg p-6">
              <BookingCard booking={booking} />
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="text-sm text-gray-600">
                  {booking.ticketType && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full mr-2">
                      {booking.ticketType}
                    </span>
                  )}
                  {booking.totalPrice !== undefined && (
                    <span className="font-semibold text-gray-800">
                      Total: ${booking.totalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleViewTickets(booking.id)}
                  disabled={loadingTickets}
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                  {loadingTickets ? 'Loading...' : 'View Tickets'}
                </button>
              </div>
            </div>
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

      <Modal 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)} 
        title="Your Tickets"
      >
        {selectedBookingTickets.length > 0 ? (
          <div className="space-y-4">
            {selectedBookingTickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-lg">{ticket.ticketNumber}</p>
                    <p className="text-sm text-gray-600">Type: {ticket.ticketType}</p>
                    <p className="text-sm text-gray-600">Price: ${ticket.price.toFixed(2)}</p>
                  </div>
                  {ticket.isUsed && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Used
                    </span>
                  )}
                </div>
                {ticket.qrCode && (
                  <div className="mt-3">
                    <img 
                      src={`data:image/png;base64,${ticket.qrCode}`} 
                      alt="QR Code" 
                      className="w-32 h-32 mx-auto"
                    />
                  </div>
                )}
                {ticket.barcode && (
                  <div className="mt-3 text-center">
                    <img 
                      src={`data:image/png;base64,${ticket.barcode}`} 
                      alt="Barcode" 
                      className="w-48 h-16 mx-auto"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No tickets found for this booking.</p>
        )}
      </Modal>
    </div>
  );
};

export default MyBookingsPage;
