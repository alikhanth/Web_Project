export interface Station {
    id: number;
    name: string;
    city: string;
    country: string;
  }
  
  export interface Journey {
    id: number;
    departure_station: Station;
    arrival_station: Station;
    departure_time: string;
    arrival_time: string;
    price: number;
    bus_number: string;
    available_seats: number;
  }