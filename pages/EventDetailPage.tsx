
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventById, createBooking, deleteEvent, publishEvent } from '../services/api';
import { Calendar, MapPin, Building2, Users, AlertCircle, CheckCircle, Info, Repeat2 } from 'lucide-react';
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
  const isAdmin = user?.role === 'ADMIN';

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
  const [isPublishing, setIsPublishing] = useState(false);

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

  const handlePublish = async () => {
    if (!id) return;
    setIsPublishing(true);
    try {
      await publishEvent(id);
      await fetchEvent();
    } catch (err) {
      setError('Failed to publish event.');
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
          
        </div>
        <p className="text-lg font-medium text-red-800">{error}</p>
      </div>
    );
  if (!event)
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 mb-4">
          
        </div>
        <p className="text-lg font-medium text-neutral-600">Event not found</p>
      </div>
    );

  const totalPrice = ticketType === 'FREE' ? 0 : pricePerTicket * tickets;

  return (
    <div className="animate-fade-in">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
        <img
          src={`https://picsum.photos/seed/${event.id}/1200/400`}
          alt={event.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        {/* Header Section */}
        <div className="relative -mt-16 sm:-mt-20 md:-mt-24 mb-6 sm:mb-8 z-10">
          <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-elevation-3 border border-neutral-200 dark:border-neutral-700 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-50 mb-3 sm:mb-4">
                  {event.name}
                </h1>
                <div className="flex flex-wrap gap-3 items-center">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      event.status === 'PUBLISHED'
                        ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800'
                        : event.status === 'DRAFT'
                          ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-800'
                          : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    {event.status || 'UNKNOWN'}
                  </span>
                  {isAdmin && event.status !== 'PUBLISHED' && (
                    <button
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-elevation-1 hover:shadow-elevation-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPublishing ? 'Publishing...' : 'Publish Event'}
                    </button>
                  )}
                  {!isAdmin && event.status !== 'PUBLISHED' && (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                      Not yet published
                    </span>
                  )}
                </div>
              </div>
              {event.availableSeats > 0 && (
                <div className="bg-gradient-to-br from-green-50 dark:from-green-950 to-emerald-50 dark:to-green-900 rounded-xl p-4 border border-green-200 dark:border-green-800 text-center">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Seats Available</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{event.availableSeats}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">of {event.capacity} total</p>
                </div>
              )}
              {event.availableSeats === 0 && (
                <div className="bg-gradient-to-br from-red-50 dark:from-red-950 to-rose-50 dark:to-red-900 rounded-xl p-4 border border-red-200 dark:border-red-800 text-center">
                  <p className="text-sm font-bold text-red-700 dark:text-red-400">Sold Out</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Event Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Key Information */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-elevation-1 border border-neutral-200 dark:border-neutral-700 p-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 flex items-center gap-2">
                  
                Event Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary dark:text-primary-light">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-1">Start Date & Time</p>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{formatDate(event.eventDate)}</p>
                  </div>
                </div>

                {event.endDate && (
                  <div className="flex items-start gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary dark:text-primary-light">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-1">End Date & Time</p>
                      <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{formatDate(event.endDate)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary dark:text-primary-light">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-1">Location</p>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{event.location}</p>
                  </div>
                </div>

                {event.venue && (
                  <div className="flex items-start gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary dark:text-primary-light">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-1">Venue</p>
                      <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{event.venue}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary dark:text-primary-light">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-1">Capacity</p>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                      {event.availableSeats} / {event.capacity} available
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Indicators */}
              {(event.isRecurring || event.isMultiSession) && (
                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-3">
                  {event.isRecurring && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                      <span className="font-medium text-purple-700 dark:text-purple-300">Recurring - {event.recurrencePattern}</span>
                    </div>
                  )}
                  {event.isMultiSession && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                      <span className="font-medium text-orange-700 dark:text-orange-300">Multi-Session</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-elevation-1 border border-neutral-200 dark:border-neutral-700 p-8">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">Description</h3>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}

            {/* Categories */}
            {event.categories && (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-elevation-1 border border-neutral-200 dark:border-neutral-700 p-8">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {event.categories.split(',').map((category, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-semibold border border-primary/20 dark:border-primary/30 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                    >
                      {category.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Agenda */}
            {event.agenda && (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-elevation-1 border border-neutral-200 dark:border-neutral-700 p-8">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">Agenda</h3>
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                  <pre className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap font-mono">
                    {event.agenda}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              {user ? (
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-elevation-2 border border-neutral-200 dark:border-neutral-700 p-8">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">Book Tickets</h2>
                  {event.availableSeats > 0 ? (
                    <form onSubmit={handleBooking} className="space-y-5">
                      <div>
                        <label htmlFor="ticket-type" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                          Ticket Type
                        </label>
                        <select
                          id="ticket-type"
                          value={ticketType}
                          onChange={(e) => setTicketType(e.target.value as TicketType)}
                          className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-neutral-900 transition-all duration-200"
                        >
                          <option value="FREE">Free</option>
                          <option value="PAID">Paid</option>
                          <option value="VIP">VIP</option>
                          <option value="GROUP">Group</option>
                        </select>
                      </div>

                      {ticketType !== 'FREE' && (
                        <div>
                          <label htmlFor="price" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                            Price per Ticket (Rs.)
                          </label>
                          <input
                            type="number"
                            id="price"
                            step="0.01"
                            min="0"
                            value={pricePerTicket}
                            onChange={(e) => setPricePerTicket(parseFloat(e.target.value))}
                            className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-neutral-900 transition-all duration-200"
                            required
                          />
                        </div>
                      )}

                      <div>
                        <label htmlFor="tickets" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                          Number of Tickets
                        </label>
                        <input
                          type="number"
                          id="tickets"
                          name="tickets"
                          min="1"
                          max={event.availableSeats}
                          value={tickets}
                          onChange={(e) => setTickets(parseInt(e.target.value, 10))}
                          className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-neutral-900 transition-all duration-200"
                          required
                        />
                      </div>

                      {totalPrice > 0 && (
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
                          <p className="text-sm text-neutral-600 mb-1">Total Amount</p>
                          <p className="text-3xl font-bold text-primary">Rs. {totalPrice.toFixed(2)}</p>
                        </div>
                      )}

                      {bookingError && (
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 flex gap-3">
                          <span className="text-sm text-red-800 dark:text-red-200 font-medium">{bookingError}</span>
                        </div>
                      )}


                      {bookingSuccess && (
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 flex gap-3">
                          <span className="text-sm text-green-800 dark:text-green-200 font-medium">{bookingSuccess}</span>
                        </div>
                      )}


                      <button
                        type="submit"
                        disabled={isBooking}
                        className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-elevation-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isBooking ? 'Processing...' : 'Book Now'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 mb-3 text-red-600 dark:text-red-400">
                        <AlertCircle size={24} />
                      </div>
                      <p className="text-lg font-bold text-red-700 dark:text-red-400">Sold Out</p>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1">All tickets have been booked</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-elevation-2 border border-neutral-200 dark:border-neutral-700 p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 mb-4 text-blue-600 dark:text-blue-400">
                    <Info size={24} />
                  </div>
                  <p className="text-neutral-900 dark:text-neutral-50 font-semibold mb-4">Sign in to book tickets</p>
                  <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-elevation-1 hover:shadow-elevation-2">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Admin Delete Button */}
        {isAdmin && (
          <div className="bg-red-50 dark:bg-red-950 rounded-2xl border border-red-200 dark:border-red-800 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-1">Danger Zone</h3>
                <p className="text-sm text-red-700 dark:text-red-300">Delete this event permanently. This action cannot be undone.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-elevation-1 hover:shadow-elevation-2"
              >
                Delete Event
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Delete Event">
        <p className="text-neutral-700 dark:text-neutral-300 mb-6">
          Are you sure you want to delete <strong>{event?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 font-semibold rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Delete Permanently
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetailPage;
