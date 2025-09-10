import { useEffect } from "react";

import "../Departures/Departures.css";

import { useLocationStore } from "../../store/useLocationStore";
import { useDepartureStore } from "../../store/useDepartureStore";

import TrainImg from "../../assets/white-train.png";

type CardProps = {
  title: string;
};

const Departures = ({ title }: CardProps) => {
  const { departureUpdates, arrivalsUpdates, fetchDepartures } =
    useDepartureStore();
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
    <div className="space-y-6">
      {departureUpdates.length > 0 && (
        <div className="departure-container space-y-2">
          <h2 className="departure-title font-bold mb-2">{title}</h2>

          {departureUpdates.map((update, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-base-100 rounded-lg"
            >
              <input type="radio" name="my-accordion-1" />
              <div className="collapse-title font-semibold text-sm flex justify-between">
                <div className="flex items-center gap-2">
                  {update.stop} <i className="bi bi-arrow-right"></i>
                  {update.direction}
                </div>
                <div>({update.time.slice(0, 5)})</div>
              </div>

              <div className="collapse-content space-y-2 text-xs">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-items-start gap-4 items-center">
                    <p className="flex items-center gap-2">
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

      {departureUpdates.length === 0 && arrivalsUpdates.length === 0 && (
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
  );
};

//   return (
//     <div className="space-y-6">
//       {/* Departures */}
//       {departureUpdates.length > 0 && (
//         <div className="departure-container space-y-2">
//           <h2 className="departure-title text-lg font-bold mb-4">{title}</h2>
//           {departureUpdates.map((update, index) => (
//             <div
//               key={index}
//               className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg"
//             >
//               <input type="radio" name="my-accordion-1" />
//               <div className="collapse-title font-semibold text-sm flex justify-between">
//                 <div>
//                   {update.stop} <i className="bi bi-arrow-right-short"></i>
//                   {update.direction}
//                 </div>
//                 <div>({update.time.slice(0, 5)})</div>
//               </div>
//               {arrivalsUpdates.length > 0 && (
//                 <div className="collapse-content space-y-2">
//                   {arrivalsUpdates.map((arrival, index) => (
//                     <div
//                       key={index}
//                       className="collapse collapse-arrow bg-base-100 rounded-lg"
//                     >
//                       <div className="flex-col gap-1 text-xs">
//                         <div className="flex justify-items-start gap-4">
//                           <p className="flex items-center gap-2">
//                             <span>{iconMap[update.icon] || ""}</span>
//                             {update.name}
//                           </p>
//                           <p>{update.date}</p>
//                           <p>
//                             <strong>{update.operator}</strong>
//                           </p>
//                         </div>
//                         {arrival.Stops && arrival.Stops.length > 0 && (
//                           <div className="stops-list mt-2">
//                             <strong>Stops:</strong>
//                             <ul className="pl-4 list-disc text-xs">
//                               {arrival.Stops.map((s, idx) => (
//                                 <li key={idx}>
//                                   {s.name} ({s.arrTime || s.depTime})
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {departureUpdates.length === 0 && arrivalsUpdates.length === 0 && (
//         <div className="fallback-container">
//           <div className="fallback-card">
//             <div className="fallback-content">
//               <div className="fallback-image-wrapper">
//                 <img
//                   className="fallback-image"
//                   src={TrainImg}
//                   alt="train-image"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

export default Departures;
