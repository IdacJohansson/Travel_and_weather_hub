export interface DepartureInterface {
   time: string;
   date: string;
   stop: string;
   stopExtId: string;
   type: string;
   direction: string;
   name: string;
   line: string;
   operator: string;
   icon: string;
}

export interface DepartureState {
  departureUpdates: DepartureInterface[];
  fetchDepartures: () => Promise<void>;
}