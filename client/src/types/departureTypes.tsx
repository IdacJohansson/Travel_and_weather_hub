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

export interface ArrivalsInterface extends DepartureInterface {
  rtTime: string;
  rtDate: string;
  Stops: {
    name: string;
    arrTime: string;
    arrDate: string;
    depTime: string;
    depDate: string;
    track: string;
  }[];
}

export interface DepartureState {
  departureUpdates: DepartureInterface[];
  arrivalsUpdates: ArrivalsInterface[];
  fetchDepartures: () => Promise<void>;
}