import { useEffect } from "react";

import "../Departures/Departures.css";

import { useLocationStore } from "../../store/useLocationStore";
import { useDepartureStore } from "../../store/useDepartureStore";

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

  const iconMap: { [key: string]: React.ReactNode } = {
    prod_gen: <i className="bi bi-bus-front"></i>,
    prod_bus: <i className="bi bi-bus-front-fill"></i>,
    prod_train: <i className="bi bi-train-freight-front"></i>,
    prod_tram: "🚊",
    prod_ferry: <i className="bi bi-water"></i>,
    prod_subway: <i className="bi bi-train-front-fill"></i>,
  };

  return (
    <div className="">
      {departureUpdates.length > 0 && (
        <div className="departure-container space-y-2">
          <h2 className="departure-title">{title}</h2>

          {departureUpdates.map((update, index) => (
            <div key={index} className="departure-collapse">
              <input type="radio" name="my-accordion-1" />
              <div className="departure-collapse-title">
                <div className="departure-arrow-icon-and-text-container">
                  {update.stop} <i className="bi bi-arrow-right"></i>
                  {update.direction}
                </div>
                <div>({update.time.slice(0, 5)})</div>
              </div>

              <div className="collapse-content">
                <div className="departure-inner-content">
                  <div className="departure-inner-position">
                    <p className="departure-text-and-icons-container">
                      <span>{iconMap[update.icon] || ""}</span>
                      {update.name}
                    </p>
                    <p>{update.date}</p>
                    <p>
                      <strong>{update.operator}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departures;
