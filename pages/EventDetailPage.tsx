
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, createBooking, deleteEvent } from '../services/api';
import type { Event, TicketType } from '../types';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const formatDate = (dateArray: number[] | string): string => {
  if (typeof dateArray === 'string') {
    return new Date(dateArray).toLocaleString('en-US', {
      weekday: 'long',
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
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [tickets, setTickets] = useState(1);
  const [ticketType, setTicketType] = useState<TicketType>('PAID');
  const [pricePerTicket, setPricePerTicket] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getEventById(id);
      setEvent(data);
    } catch (err) {
      setError('Failed to fetch event details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !event) {
      setBookingError('You must be logged in to book tickets.');
      return;
    }
    if (tickets > event.availableSeats) {
        setBookingError('Not enough available seats.');
        return;
    }

    setIsBooking(true);
    setBookingError('');
    setBookingSuccess('');

    try {
      await createBooking({ 
        userId: user.id, 
        eventId: event.id, 
        numberOfTickets: tickets,
        ticketType,
        pricePerTicket: ticketType === 'FREE' ? 0 : pricePerTicket
      });
      setBookingSuccess(`Successfully booked ${tickets} ticket(s)! Redirecting to your bookings...`);
      setTimeout(() => navigate('/my-bookings'), 2000);
      fetchEvent(); // Re-fetch event to update available seats
    } catch (err) {
      setBookingError('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };
  
  const handleDelete = async () => {
      if (!id) return;
      try {
          await deleteEvent(id);
          navigate('/');
      } catch (err) {
          setError('Failed to delete event.');
          console.error(err);
      }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (!event) return <p className="text-center text-gray-500 mt-8">Event not found.</p>;

  const totalPrice = ticketType === 'FREE' ? 0 : pricePerTicket * tickets;

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
      <img
        src={`https://picsum.photos/seed/${event.id}/1200/400`}
        alt={event.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-8">
        <h1 className="text-4xl font-extrabold text-neutral-800 mb-2">{event.name}</h1>
        <p className="text-lg text-gray-600 mb-2">{formatDate(event.eventDate)}</p>
        {event.endDate && (
          <p className="text-sm text-gray-500 mb-4">Ends: {formatDate(event.endDate)}</p>
        )}
        {event.description && (
          <p className="text-gray-700 mb-6">{event.description}</p>
        )}
        
        {event.categories && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {event.categories.split(',').map((category, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {category.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-4 border-b-2 border-primary pb-2">Details</h2>
            <div className="space-y-4 text-gray-700">
               <p className="flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                 <span><strong>Location:</strong> {event.location}</span>
               </p>
               {event.venue && (
                 <p className="flex items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>
                   <span><strong>Venue:</strong> {event.venue}</span>
                 </p>
               )}
                <p className="flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0115 15v3h1zM4.75 12.094A5.973 5.973 0 004 15v3H3v-3a3.005 3.005 0 011.25-2.316z"/></svg>
                 <span><strong>Seats:</strong> {event.availableSeats} / {event.capacity} available</span>
               </p>
               {event.isRecurring && (
                 <p className="flex items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                   <span><strong>Recurring:</strong> {event.recurrencePattern}</span>
                 </p>
               )}
               {event.isMultiSession && (
                 <p className="flex items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                   <span>Multi-Session Event</span>
                 </p>
               )}
            </div>
            
            {event.agenda && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-neutral-800 mb-2">Agenda</h3>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded">{event.agenda}</pre>
              </div>
            )}
          </div>
          {user && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4 border-b-2 border-primary pb-2">Book Tickets</h2>
              {event.availableSeats > 0 ? (
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label htmlFor="ticket-type" className="block text-sm font-medium text-gray-700 mb-1">Ticket Type</label>
                    <select
                      id="ticket-type"
                      value={ticketType}
                      onChange={(e) => setTicketType(e.target.value as TicketType)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      <option value="FREE">Free</option>
                      <option value="PAID">Paid</option>
                      <option value="VIP">VIP</option>
                      <option value="GROUP">Group</option>
                    </select>
                  </div>
                  
                  {ticketType !== 'FREE' && (
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price per Ticket ($)</label>
                      <input
                        type="number"
                        id="price"
                        step="0.01"
                        min="0"
                        value={pricePerTicket}
                        onChange={(e) => setPricePerTicket(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="tickets" className="block text-sm font-medium text-gray-700 mb-1">Number of Tickets</label>
                    <input
                      type="number"
                      id="tickets"
                      name="tickets"
                      min="1"
                      max={event.availableSeats}
                      value={tickets}
                      onChange={(e) => setTickets(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  
                  {totalPrice > 0 && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-lg font-bold text-gray-800">Total: ${totalPrice.toFixed(2)}</p>
                    </div>
                  )}
                  
                  <button type="submit" disabled={isBooking} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50">
                    {isBooking ? 'Processing...' : 'Book Now'}
                  </button>
                  {bookingError && <p className="text-red-500 text-sm">{bookingError}</p>}
                  {bookingSuccess && <p className="text-green-500 text-sm">{bookingSuccess}</p>}
                </form>
              ) : (
                <p className="text-red-600 font-bold text-lg bg-red-100 p-4 rounded-md">This event is sold out!</p>
              )}
            </div>
          )}
        </div>
        {user && (
          <div className="mt-8 pt-4 border-t">
              <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                  Delete Event
              </button>
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Deletion">
          <p>Are you sure you want to delete this event? This action cannot be undone.</p>
          <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Delete</button>
          </div>
      </Modal>
    </div>
  );
};

export default EventDetailPage;
