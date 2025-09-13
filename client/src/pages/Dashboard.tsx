import "../styles/global.css";
import TrafficIncidents from "../components/TrafficIncidents/TrafficIncidents";
import Weather from "../components/Weather/Weather";
import Departures from "../components/Departures/Departures";
import Header from "../components/Header/Header";

const Dashboard = () => {
  return (
    <div className="main-container">
      <Header />
      <div className="section-one">
        <div className="card-content">
          <Weather />
          <Departures title="DEPARTURES" />
        </div>
      </div>
      <div className="section-two">
        <TrafficIncidents title="TRAFIC INCIDENTS" />
      </div>
    </div>
  );
};

export default Dashboard;
