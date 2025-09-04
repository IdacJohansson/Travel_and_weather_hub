export interface TrafficUpdateInterface {
  MessageCode: string;
  Message: string;
  RoadNumber: string;
  SeverityText: string;
  CreationTime: string;
  LocationDescriptor: string;
}

export interface TrafficState {
  trafficUpdates: TrafficUpdateInterface[];
  fetchTrafficIncidents: () => Promise<void>;
  getSeverityCount: (messageCode: string) => number;
  getSeverityColor: (severity: string) => string;
}
