import { useEffect } from "react";

import { useLocationStore } from "../../store/useLocationStore";
import { useTrafficIncidentStore } from "../../store/useTrafficIncidentStore";

import TrafficImage from "../TrafficImage";
import CarImg from "../../assets/white-car.png"

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
    <div>
      {trafficUpdates.length > 0 ? (
        <div className="flex w-full max-w-5xl h-[25rem] bg-raisinBlack text-white rounded-2xl">
          <div className="flex w-full">
            {/* Vänster del */}
            <div className="flex-1 p-4 text-xs">
              <h2 className="text-lg font-bold text-center text-white">
                {title}
              </h2>

              {trafficUpdates.map((update, index) => (
                <div key={index} className="mt-5 mb-2 pb-2">
                  {/* Header-rad */}
                  <div className="flex items-center justify-between h-8 px-4 bg-onyx">
                    <p className="font-bold">{update.MessageCode}</p>
                    <div className="flex gap-4">
                      <p className={getSeverityColor(update.SeverityText)}>
                        {update.SeverityText}
                      </p>
                      <p>{new Date(update.CreationTime).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Detaljer */}
                  <div className="px-4 mt-2 text-left">
                    <p>{update.Message}</p>
                    <div className="flex mt-1">
                      <p>
                        <span className="font-bold">Plats: </span>
                        {update.LocationDescriptor}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Höger del med bild */}
            <div className="flex items-center justify-center w-1/4 p-4 bg-onyx rounded-r-2xl">
              <TrafficImage />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-5xl h-[25rem] gap-4 p-4 text-white bg-raisinBlack rounded-2xl">
          <div className="flex items-center justify-center flex-1 p-2 bg-onyx rounded-2xl">
            <div className="mb-4 pb-2">
              <div className="flex items-center justify-center h-20">
                <img
                  className="w-1/2 animate-pulse"
                  src={CarImg}
                  alt="car-image"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficIncidents;
