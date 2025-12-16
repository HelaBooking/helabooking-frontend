import React, { useEffect, useMemo, useState } from 'react';
import { Settings, CheckCircle2, AlertCircle, Upload, Eye, Calendar, Users } from 'lucide-react';
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

const statusConfig: Record<string, { bg: string; badge: string; icon: string }> = {
  PUBLISHED: { bg: 'bg-green-50 dark:bg-green-950', badge: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400', icon: '✓' },
  DRAFT: { bg: 'bg-amber-50 dark:bg-amber-950', badge: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-400', icon: '◉' },
  CANCELLED: { bg: 'bg-red-50 dark:bg-red-950', badge: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-400', icon: '✕' },
  COMPLETED: { bg: 'bg-blue-50 dark:bg-blue-950', badge: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-400', icon: '✓' },
  DEFAULT: { bg: 'bg-neutral-50 dark:bg-neutral-900', badge: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300', icon: '?' },
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
    const config = statusConfig[status || 'DEFAULT'] || statusConfig.DEFAULT;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
        <span>{config.icon}</span>
        {status || 'UNKNOWN'}
      </span>
    );
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-50 to-primary/5 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 mb-4">
            <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Access Denied</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Only administrators can manage events.</p>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-50 to-primary/5 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-elevation-2 p-8 max-w-sm text-center border border-neutral-200 dark:border-neutral-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 mb-4">
            <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Failed to Load Events</h2>
          <p className="text-neutral-600 dark:text-neutral-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-neutral-50 via-neutral-50 to-primary/5 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-elevation-2 mb-4">
            <Settings className="text-white" size={24} />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Manage Events</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">Create, edit, and publish your events</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-elevation-1 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-light">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Events</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{events.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-elevation-1 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Published</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{events.filter(e => e.status === 'PUBLISHED').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-elevation-1 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Drafts</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{events.filter(e => e.status !== 'PUBLISHED').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {(['ALL', 'DRAFT', 'PUBLISHED'] as Filter[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                filter === key 
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-elevation-2' 
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-primary/50 dark:hover:border-primary/50'
              }`}
            >
              {key === 'ALL' ? 'All Events' : key === 'DRAFT' ? 'Drafts' : 'Published'}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-elevation-2 border border-neutral-200 dark:border-neutral-700 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-700 mb-4">
              <Calendar className="text-neutral-600 dark:text-neutral-400" size={32} />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">There are no events matching your filter. Create a new event to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <div key={evt.id} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-elevation-1 overflow-hidden hover:shadow-elevation-3 dark:hover:shadow-elevation-3 transition-all duration-300 group">
                {/* Card Header with Status */}
                <div className="h-1 bg-gradient-to-r from-primary to-primary-dark"></div>
                
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-primary transition-colors">{evt.name}</h3>
                    </div>
                    {renderStatus(evt.status)}
                  </div>

                  {/* Event Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar size={14} className="flex-shrink-0" />
                      <span>{formatDate(evt.eventDate)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Users size={14} className="flex-shrink-0" />
                      <span>{evt.availableSeats} / {evt.capacity} seats</span>
                    </div>
                  </div>

                  {/* Description */}
                  {evt.description && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-6">{evt.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`#/event/${evt.id}`}
                      className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100 font-medium rounded-lg transition-all duration-200 text-center text-sm flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </a>
                    {evt.status !== 'PUBLISHED' && (
                      <button
                        onClick={() => handlePublish(evt.id)}
                        disabled={publishingId === evt.id}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-elevation-2 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                      >
                        {publishingId === evt.id ? (
                          <>
                            <Upload size={16} className="animate-spin" />
                            <span>Publishing</span>
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            <span>Publish</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEventsPage;
