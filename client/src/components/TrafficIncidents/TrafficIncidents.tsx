import { useEffect } from "react";
import "../TrafficIncidents/TrafficIncidents.css";

import { useLocationStore } from "../../store/useLocationStore";
import { useTrafficIncidentStore } from "../../store/useTrafficIncidentStore";

import Map from "../Map/Map";

type CardProps = {
  title: string;
};

const TrafficIncidents = ({ title }: CardProps) => {
  const { trafficUpdates, fetchTrafficIncidents, getSeverityColor } =
    useTrafficIncidentStore();
  const { location } = useLocationStore();

  useEffect(() => {
    if (location) {
      fetchTrafficIncidents();
    }
  }, [location]);

  return (
    <div className="incident-container">
      {trafficUpdates.length > 0 && (
        <div className="incident-wrapper">
          <div className="content-container">
            <div className="incident-content">
              <h2 className="incident-title">{title}</h2>

              {trafficUpdates.map((update, index) => (
                <div key={index} className="content-position">
                  <div className="incident-header">
                    <p className="text-message-code">{update.MessageCode}</p>
                    <div className="severity-text">
                      <p className={getSeverityColor(update.SeverityText)}>
                        {update.SeverityText}
                      </p>
                      <p>{new Date(update.CreationTime).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-message">
                    <i>{update.Message}</i>
                    <div className="text-location">
                      <p>
                        <span>
                          <i className="bi bi-geo-alt-fill"></i>{" "}
                        </span>
                        {update.LocationDescriptor}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Map />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficIncidents;
