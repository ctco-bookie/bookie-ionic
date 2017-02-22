export interface Room {
        name: string;
        number: number;
        capacity: number;
        availability: Availability;
    }

export interface Availability {
        busy: boolean;
        availableFor: string;
        availableFrom: string;
    }