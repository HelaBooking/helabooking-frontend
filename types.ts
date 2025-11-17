
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface Event {
  id: number;
  name: string;
  location: string;
  eventDate: number[];
  capacity: number;
  availableSeats: number;
}

export interface Booking {
  id: number;
  userId: number;
  eventId: number;
  numberOfTickets: number;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: number[];
}

export interface EnrichedBooking extends Booking {
  event?: Event;
}
