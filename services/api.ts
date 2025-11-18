import { USER_API_BASE_URL, EVENT_API_BASE_URL, BOOKING_API_BASE_URL, TICKETING_API_BASE_URL } from '../constants';
import type { User, Event, Booking, Ticket, UserRole } from '../types';

const getAuthToken = () => {
    try {
        const authUser = localStorage.getItem('authUser');
        if (authUser) {
            return JSON.parse(authUser).token;
        }
    } catch (error) {
        console.error("Failed to parse auth user from local storage", error);
    }
    return null;
};

const request = async <T,>(url: string, options: RequestInit = {}): Promise<T> => {
    const headers = new Headers(options.headers);

    // Set standard headers for JSON API communication.
    headers.set('Accept', 'application/json');

    // NOTE: The Authorization header has been removed.
    // The working curl examples provided do not use authentication, and sending this
    // header from a browser triggers a CORS preflight request (OPTIONS).
    // If the backend is not configured to handle this preflight request correctly,
    // the browser will block the API call, resulting in a "Failed to fetch" error.
    // Removing this header makes the requests "simple" and less likely to be blocked by CORS.
    
    // Only set Content-Type for requests with a body.
    if (options.body) {
        headers.set('Content-Type', 'application/json');
    }

    try {
        const response = await fetch(url, { 
            ...options, 
            headers,
            mode: 'cors',
            referrerPolicy: 'no-referrer'
        });

        if (!response.ok) {
            const errorData = await response.text().catch(() => 'Failed to read error response');
            try {
                // Try to parse a structured error message from the backend
                const errorJson = JSON.parse(errorData);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorJson.message || JSON.stringify(errorJson)}`);
            } catch (e) {
                 // Fallback to plain text error if not JSON
                 throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
            }
        }
        
        // For DELETE or other methods that might not return a body
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null as T;
        }
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        } else {
            const textResponse = await response.text();
            if (textResponse === 'true' || textResponse === 'false') {
                 return (textResponse === 'true') as unknown as T;
            }
            return textResponse as unknown as T;
        }
    } catch (error) {
        console.error('Fetch API call failed:', error);
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('Network error or CORS issue. Please check connection and server configuration.');
        }
        // Re-throw other errors to be handled by the calling component
        throw error;
    }
};

// User API
export const registerUser = (data: Omit<User, 'id'> & { password: string }) => request(`${USER_API_BASE_URL}/users/register`, { method: 'POST', body: JSON.stringify(data) });
export const loginUser = (data: { username: string, password: string }) => request(`${USER_API_BASE_URL}/users/login`, { method: 'POST', body: JSON.stringify(data) });
export const getUserProfile = (userId: number) => request<User>(`${USER_API_BASE_URL}/users/${userId}/profile`);
export const updateUserRole = (userId: number, role: UserRole) => request<User>(`${USER_API_BASE_URL}/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) });

// Event API
// Fix: Correctly type `eventDate` as `string` for creating events by omitting it from the base `Event` type first.
export const createEvent = (data: Omit<Event, 'id' | 'availableSeats' | 'eventDate' | 'endDate'> & { eventDate: string; endDate?: string }) => request<Event>(`${EVENT_API_BASE_URL}/events`, { method: 'POST', body: JSON.stringify(data) });
export const getEvents = () => request<Event[]>(`${EVENT_API_BASE_URL}/events`);
export const getPublishedEvents = () => request<Event[]>(`${EVENT_API_BASE_URL}/events/published`);
export const getEventById = (id: string) => request<Event>(`${EVENT_API_BASE_URL}/events/${id}`);
// Fix: Correctly type `eventDate` as `string` for updating events by omitting it from the base `Event` type first.
export const updateEvent = (id: string, data: Partial<Omit<Event, 'id' | 'availableSeats' | 'eventDate' | 'endDate'> & { eventDate: string; endDate?: string }>) => request<Event>(`${EVENT_API_BASE_URL}/events/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const publishEvent = (id: string) => request<Event>(`${EVENT_API_BASE_URL}/events/${id}/publish`, { method: 'POST' });
export const reserveSeats = (id: string, seats: number) => request<boolean>(`${EVENT_API_BASE_URL}/events/${id}/reserve?seats=${seats}`, { method: 'POST' });
export const deleteEvent = (id: string) => request<void>(`${EVENT_API_BASE_URL}/events/${id}`, { method: 'DELETE' });

// Booking API
export const createBooking = (data: Omit<Booking, 'id' | 'status' | 'createdAt' | 'totalPrice'>) => request<Booking>(`${BOOKING_API_BASE_URL}/bookings`, { method: 'POST', body: JSON.stringify(data) });
export const getBookings = () => request<Booking[]>(`${BOOKING_API_BASE_URL}/bookings`);
export const getBookingById = (id: string) => request<Booking>(`${BOOKING_API_BASE_URL}/bookings/${id}`);
export const getBookingsByUserId = (userId: number) => request<Booking[]>(`${BOOKING_API_BASE_URL}/bookings/user/${userId}`);

// Ticketing API
export const getTicketsByBooking = (bookingId: number) => request<Ticket[]>(`${TICKETING_API_BASE_URL}/tickets/booking/${bookingId}`);
export const getTicketsByUser = (userId: number) => request<Ticket[]>(`${TICKETING_API_BASE_URL}/tickets/user/${userId}`);
export const getTicketByNumber = (ticketNumber: string) => request<Ticket>(`${TICKETING_API_BASE_URL}/tickets/${ticketNumber}`);