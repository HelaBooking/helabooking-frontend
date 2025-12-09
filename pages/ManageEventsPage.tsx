import React, { useEffect, useMemo, useState } from 'react';
import { getEvents, publishEvent } from '../services/api';
import type { Event, EventStatus } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

const formatDate = (dateValue: number[] | string) => {
  if (typeof dateValue === 'string') {
    return new Date(dateValue).toLocaleString();
  }
  if (!dateValue || dateValue.length < 3) return 'Date not available';
  const [year, month, day, hour = 0, minute = 0] = dateValue;
  return new Date(year, month - 1, day, hour, minute).toLocaleString();
};

type Filter = 'ALL' | 'PUBLISHED' | 'DRAFT';

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-800',
  DRAFT: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  DEFAULT: 'bg-gray-100 text-gray-800',
};

const ManageEventsPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [publishingId, setPublishingId] = useState<number | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (filter === 'ALL') return events;
    return events.filter((evt) => (filter === 'PUBLISHED' ? evt.status === 'PUBLISHED' : evt.status !== 'PUBLISHED'));
  }, [events, filter]);

  const handlePublish = async (id: number) => {
    setPublishingId(id);
    try {
      await publishEvent(String(id));
      const updated = await getEvents();
      setEvents(updated);
    } catch (err) {
      console.error(err);
      setError('Failed to publish event.');
    } finally {
      setPublishingId(null);
    }
  };

  const renderStatus = (status?: EventStatus) => {
    const key = status || 'DEFAULT';
    const color = statusColors[key] || statusColors.DEFAULT;
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{status || 'UNKNOWN'}</span>;
  };

  if (!user || user.role !== 'ADMIN') {
    return <p className="text-center text-red-500 mt-8">Access denied. Admins only.</p>;
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-800">Manage Events</h1>
          <p className="text-gray-600">View drafts and publish events.</p>
        </div>
        <div className="flex gap-2">
          {(['ALL', 'DRAFT', 'PUBLISHED'] as Filter[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-2 rounded-md text-sm font-semibold border ${
                filter === key ? 'bg-primary text-white border-primary' : 'bg-white text-neutral-700 border-gray-200'
              }`}
            >
              {key === 'ALL' ? 'All' : key === 'DRAFT' ? 'Drafts' : 'Published'}
            </button>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-500">No events found for this filter.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEvents.map((evt) => (
            <div key={evt.id} className="bg-white shadow rounded-lg p-4 border border-gray-100">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{evt.name}</h2>
                  <p className="text-sm text-gray-500">{formatDate(evt.eventDate)}</p>
                  <p className="text-sm text-gray-500">Seats: {evt.availableSeats} / {evt.capacity}</p>
                </div>
                {renderStatus(evt.status)}
              </div>
              {evt.description && <p className="text-gray-700 text-sm mt-2 line-clamp-3">{evt.description}</p>}
              <div className="mt-4 flex items-center justify-between">
                <a
                  href={`#/event/${evt.id}`}
                  className="text-primary font-semibold hover:text-primary-dark text-sm"
                >
                  View details
                </a>
                {evt.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => handlePublish(evt.id)}
                    disabled={publishingId === evt.id}
                    className="bg-primary hover:bg-primary-dark text-white text-sm font-bold px-3 py-2 rounded-md disabled:opacity-60"
                  >
                    {publishingId === evt.id ? 'Publishing...' : 'Publish'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEventsPage;
