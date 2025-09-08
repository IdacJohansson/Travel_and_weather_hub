import "../styles/global.css";
import Logo from "../assets/favicon.png";
import SearchField from "../components/SearchField/SearchField";
import TrafficIncidents from "../components/TrafficIncidents/TrafficIncidents";
import Weather from "../components/Weather/Weather";

const Dashboard = () => {
  return (
    <div className="main-container">
      <header className="header">
        <div className="header-wrapper">
          <img className="logo" src={Logo} alt="" />
          <h1 className="header-title">Local Travel & Weather Dashboard</h1>
        </div>
        <div className="search-container">
          <SearchField />
        </div>
      </header>

      <div className="section-one">
        <div className="section-one-wrapper">
          <div className="card">
            <div className="card-content">{/* <Transport /> */}</div>
          </div>
        </div>
        <Weather/>
      </div>

      <div className="section-two">
        {/* <OptionalComponent title="IMPACT" /> */}
        <TrafficIncidents title="TRAFIC INCIDENTS" />
      </div>
    </div>
  );
};

export default Dashboard;
