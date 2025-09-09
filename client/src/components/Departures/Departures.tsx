import { useEffect } from "react";
import "../Departures/Departures.css";

import { useLocationStore } from "../../store/useLocationStore";
import { useDepartureStore } from "../../store/useDepartureStore";

import TrainImg from "../../assets/white-train.png";

type CardProps = {
  title: string;
};

const Departures = ({ title }: CardProps) => {
  const { departureUpdates, fetchDepartures } = useDepartureStore();
  const { location } = useLocationStore();

  useEffect(() => {
    if (location) {
      fetchDepartures();
    }
  }, [location]);

  return (
    <div>
      <div>
        {departureUpdates.length > 0 ? (
          <div className="departure-container">
            <div className="departure-wrapper">
              <div className="departure-content">
                <h2 className="departure-title">{title}</h2>

                {departureUpdates.map((update, index) => (
                  <div key={index} className="departure-update">
                    <div className="update-header">
                      <p className="update-name">{update.name}</p>
                      <div className="update-line">
                        <p>Linje: {update.line}</p>
                        <p className="update-time">{update.time}</p>
                        <p>{update.date}</p>
                      </div>
                    </div>
                    <div className="update-direction">
                      <p>{update.direction}</p>
                      <div className="flex mt-1">
                        <p>
                          <span className="update-stop">Stop: </span>
                          {update.stop}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="fallback-container">
            <div className="fallback-card">
              <div className="fallback-content">
                <div className="fallback-image-wrapper">
                  <img
                    className="fallback-image"
                    src={TrainImg}
                    alt="train-image"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departures;
