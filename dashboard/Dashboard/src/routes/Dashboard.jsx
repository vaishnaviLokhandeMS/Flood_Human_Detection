// src/routes/Dashboard.jsx
import React, { useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import data from "../assets/data.json";
import "../styles/Dashboard.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ userRole, handleLogout }) => {
  const roleData = data.OfficerLevelData[userRole] || [];
  const navigate = useNavigate();

  const [selectedRegion, setSelectedRegion] = useState("All");

  // Get unique regions
  const regions = [...new Set(roleData.map((entry) => entry.region))];

  // Handle region change
  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  // Filter data based on selected region
  const filteredData =
    selectedRegion === "All"
      ? roleData
      : roleData.filter((entry) => entry.region === selectedRegion);

  // Prepare data keys and labels based on filtered data
  const labels = filteredData.map((item) => item.date);

  // Human data
  const humanDetected = filteredData.map((item) => item.human.detected);
  const humanRescued = filteredData.map((item) => item.human.rescued);
  const humanRemaining = filteredData.map((item) => item.human.remaining);

  // Animal data
  const animalDetected = filteredData.map((item) => item.animal.detected);
  const animalRescued = filteredData.map((item) => item.animal.rescued);
  const animalRemaining = filteredData.map((item) => item.animal.remaining);

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  // Chart Data
  const lineChartHumanData = {
    labels,
    datasets: [
      {
        label: "Humans Detected",
        data: humanDetected,
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Humans Rescued",
        data: humanRescued,
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Humans Remaining",
        data: humanRemaining,
        borderColor: "#ffcc00",
        backgroundColor: "rgba(255, 204, 0, 0.2)",
        fill: true,
      },
    ],
  };

  const barChartHumanData = {
    labels,
    datasets: [
      {
        label: "Humans Rescued",
        data: humanRescued,
        backgroundColor: "#ff6384",
      },
      {
        label: "Humans Detected",
        data: humanDetected,
        backgroundColor: "#36a2eb",
      },
    ],
  };

  const lineChartAnimalData = {
    labels,
    datasets: [
      {
        label: "Animals Detected",
        data: animalDetected,
        borderColor: "#b27ef2",
        backgroundColor: "rgba(178, 126, 242, 0.2)",
        fill: true,
      },
      {
        label: "Animals Rescued",
        data: animalRescued,
        borderColor: "#ffcc00",
        backgroundColor: "rgba(255, 204, 0, 0.2)",
        fill: true,
      },
      {
        label: "Animals Remaining",
        data: animalRemaining,
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

  const barChartAnimalData = {
    labels,
    datasets: [
      {
        label: "Animals Rescued",
        data: animalRescued,
        backgroundColor: "#b27ef2",
      },
      {
        label: "Animals Detected",
        data: animalDetected,
        backgroundColor: "#ffcc00",
      },
    ],
  };

  const pieChartData = {
    labels: ["Humans Rescued", "Animals Rescued"],
    datasets: [
      {
        label: "Rescues",
        data: [
          humanRescued.reduce((sum, value) => sum + value, 0),
          animalRescued.reduce((sum, value) => sum + value, 0),
        ],
        backgroundColor: ["#ff6384", "#36a2eb"],
      },
    ],
  };

  const logout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h2>{userRole} Dashboard</h2>
      <button className="logout-button" onClick={logout}>
        Logout
      </button>

      {/* Region Selector */}
      <label htmlFor="regionSelector">Select Region: </label>
      <select
        id="regionSelector"
        value={selectedRegion}
        onChange={handleRegionChange}
      >
        <option value="All">All Regions</option>
        {regions.map((region, index) => (
          <option key={index} value={region}>
            {region}
          </option>
        ))}
      </select>

      {/* Summary Cards for Humans */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Humans Detected</h3>
          <p>{humanDetected.reduce((sum, value) => sum + value, 0)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Humans Rescued</h3>
          <p>{humanRescued.reduce((sum, value) => sum + value, 0)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Humans Remaining</h3>
          <p>{humanRemaining.reduce((sum, value) => sum + value, 0)}</p>
        </div>
      </div>

      {/* Human Charts */}
      <div className="chart-container">
        <h3>Humans Detected, Rescued, and Remaining Over Time</h3>
        <Line data={lineChartHumanData} options={commonChartOptions} />
      </div>

      <div className="chart-container">
        <h3>Human Rescue Distribution</h3>
        <Bar data={barChartHumanData} options={commonChartOptions} />
      </div>

      {/* Summary Cards for Animals */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Animals Detected</h3>
          <p>{animalDetected.reduce((sum, value) => sum + value, 0)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Animals Rescued</h3>
          <p>{animalRescued.reduce((sum, value) => sum + value, 0)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Animals Remaining</h3>
          <p>{animalRemaining.reduce((sum, value) => sum + value, 0)}</p>
        </div>
      </div>

      {/* Animal Charts */}
      <div className="chart-container">
        <h3>Animals Detected, Rescued, and Remaining Over Time</h3>
        <Line data={lineChartAnimalData} options={commonChartOptions} />
      </div>

      <div className="chart-container">
        <h3>Animal Rescue Distribution</h3>
        <Bar data={barChartAnimalData} options={commonChartOptions} />
      </div>

      {/* Overall Rescue Breakdown */}
      <div className="chart-container">
        <h3>Overall Rescue Breakdown</h3>
        <Pie data={pieChartData} options={commonChartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
