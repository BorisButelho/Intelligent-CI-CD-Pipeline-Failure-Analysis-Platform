import { useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function App() {

  const [file, setFile] = useState(null);

  const [results, setResults] = useState([]);

  const [history, setHistory] = useState([]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#22c55e",
    "#eab308",
    "#a855f7",
    "#14b8a6"
  ];

  const uploadFile = async () => {

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    const response = await axios.post(
      "http://127.0.0.1:8000/analyze",
      formData
    );

    const analyzedResults = response.data.results;

    setResults(analyzedResults);

    const newEntry = {
      filename: file.name,
      results: analyzedResults,
      time: new Date().toLocaleTimeString()
    };

    setHistory((prev) => [newEntry, ...prev]);
  };

  // METRICS

  const totalLogs = history.length;

  const criticalErrors = history.filter((h) =>
    h.results.some((r) => r.severity === "Critical")
  ).length;

  const allCategories = history.flatMap((h) =>
    h.results.map((r) => r.category)
  );

  const categoryCounts = {};

  allCategories.forEach((cat) => {
    categoryCounts[cat] =
      (categoryCounts[cat] || 0) + 1;
  });

  const mostCommon =
    Object.keys(categoryCounts).length > 0
      ? Object.keys(categoryCounts).reduce((a, b) =>
        categoryCounts[a] > categoryCounts[b] ? a : b
      )
      : "None";

  const successRate =
    totalLogs > 0
      ? (
        ((totalLogs - criticalErrors) / totalLogs) *
        100
      ).toFixed(0)
      : 100;

  const pieData = Object.keys(categoryCounts).map(
    (key) => ({
      name: key,
      value: categoryCounts[key]
    })
  );

  const trendData = history.map((item, index) => ({
    name: `Log ${history.length - index}`,
    errors: item.results.length
  }));

  const navButton =
    "w-full text-left px-5 py-4 rounded-xl transition-all duration-200 text-[16px] font-medium";

  return (
    <div className="h-screen w-screen bg-black text-white flex overflow-hidden">

      {/* SIDEBAR */}

      <div className="w-[280px] bg-[#050505] border-r border-[#1f1f1f] flex flex-col justify-between">

        <div>

          <div className="p-8 border-b border-[#1a1a1a]">

            <h1 className="text-3xl font-bold">
              CI/CD Analyzer
            </h1>

            <p className="text-gray-500 mt-2">
              Failure Analysis Platform
            </p>

          </div>

          <div className="p-5 space-y-3">

            <button
              onClick={() =>
                setActiveTab("dashboard")
              }
              className={`${navButton}
              ${activeTab === "dashboard"
                  ? "bg-blue-600"
                  : "bg-[#111111] hover:bg-[#1a1a1a]"
                }`}
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                setActiveTab("analyze")
              }
              className={`${navButton}
              ${activeTab === "analyze"
                  ? "bg-purple-600"
                  : "bg-[#111111] hover:bg-[#1a1a1a]"
                }`}
            >
              Analyze Logs
            </button>

            <button
              onClick={() =>
                setActiveTab("analytics")
              }
              className={`${navButton}
              ${activeTab === "analytics"
                  ? "bg-green-600"
                  : "bg-[#111111] hover:bg-[#1a1a1a]"
                }`}
            >
              Analytics
            </button>

            <button
              onClick={() =>
                setActiveTab("history")
              }
              className={`${navButton}
              ${activeTab === "history"
                  ? "bg-red-600"
                  : "bg-[#111111] hover:bg-[#1a1a1a]"
                }`}
            >
              History
            </button>

          </div>
        </div>

        <div className="p-5">

          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl p-5">

            <h2 className="text-xl font-bold mb-4">
              System Status
            </h2>

            <div className="flex justify-between mb-3">
              <span className="text-gray-400">
                Backend
              </span>

              <span className="text-green-400">
                Online
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                Analyzer
              </span>

              <span className="text-green-400">
                Running
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="flex-1 overflow-y-auto bg-[#020202]">

        <div className="p-10">

          {/* TOP METRICS */}

          <div className="grid grid-cols-4 gap-8 mb-10">

            <div className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-3xl p-8">

              <p className="text-gray-500 text-lg">
                Logs Processed
              </p>

              <h2 className="text-5xl font-bold mt-4">
                {totalLogs}
              </h2>

            </div>

            <div className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-3xl p-8">

              <p className="text-gray-500 text-lg">
                Critical Errors
              </p>

              <h2 className="text-5xl font-bold text-red-500 mt-4">
                {criticalErrors}
              </h2>

            </div>

            <div className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-3xl p-8">

              <p className="text-gray-500 text-lg">
                Success Rate
              </p>

              <h2 className="text-5xl font-bold text-green-400 mt-4">
                {successRate}%
              </h2>

            </div>

            <div className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-3xl p-8">

              <p className="text-gray-500 text-lg">
                Most Common
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-4">
                {mostCommon}
              </h2>

            </div>

          </div>

          {/* ANALYZE */}

          {activeTab === "analyze" && (

            <div className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-3xl p-10">

              <h2 className="text-3xl font-bold mb-6">
                Upload CI/CD Log
              </h2>

              <div className="border-2 border-dashed border-[#2a2a2a] rounded-3xl p-16 text-center bg-[#050505]">

                <input
                  type="file"
                  onChange={(e) =>
                    setFile(e.target.files[0])
                  }
                  className="mb-8 text-lg"
                />

                <br />

                <button
                  onClick={uploadFile}
                  className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl text-xl"
                >
                  Analyze Log
                </button>

              </div>

            </div>
          )}

          {/* DASHBOARD */}

          {activeTab === "dashboard" && (

            <div>

              <div className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-3xl p-8 mb-10">

                <h2 className="text-3xl font-bold mb-8">
                  Latest Analysis
                </h2>

                {results.length === 0 ? (

                  <div className="text-gray-500 text-xl">
                    No analysis yet
                  </div>

                ) : (

                  results.map((item, index) => (

                    <div
                      key={index}
                      className="bg-[#050505] border border-[#1f1f1f] rounded-2xl p-8 mb-6"
                    >

                      <div className="flex justify-between items-center mb-4">

                        <h3 className="text-3xl font-bold">
                          {item.category}
                        </h3>

                        <span className="bg-red-500/20 text-red-400 px-5 py-2 rounded-xl">
                          {item.severity}
                        </span>

                      </div>

                      <p className="text-gray-400 mb-2">
                        Suggested Fix
                      </p>

                      <p className="text-xl">
                        {item.suggestion}
                      </p>

                    </div>
                  ))
                )}

              </div>

              {/* CHARTS */}

              <div className="grid grid-cols-2 gap-8">

                {/* PIE */}

                <div className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-3xl p-8 h-[450px]">

                  <h2 className="text-2xl font-bold mb-6">
                    Failure Categories
                  </h2>

                  <ResponsiveContainer width="100%" height="85%">

                    <PieChart>

                      <Pie
                        data={pieData}
                        dataKey="value"
                        outerRadius={130}
                        label
                      >

                        {pieData.map((entry, index) => (

                          <Cell
                            key={index}
                            fill={
                              COLORS[
                              index % COLORS.length
                              ]
                            }
                          />
                        ))}

                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

                {/* BAR */}

                <div className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-3xl p-8 h-[450px]">

                  <h2 className="text-2xl font-bold mb-6">
                    Failure Trends
                  </h2>

                  <ResponsiveContainer width="100%" height="85%">

                    <BarChart data={trendData}>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="name" />

                      <YAxis />

                      <Tooltip />

                      <Bar
                        dataKey="errors"
                        fill="#3b82f6"
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>
          )}

          {/* HISTORY */}

          {activeTab === "history" && (

            <div className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-3xl p-8">

              <h2 className="text-3xl font-bold mb-8">
                Analysis History
              </h2>

              {history.length === 0 ? (

                <div className="text-gray-500 text-xl">
                  No history yet
                </div>

              ) : (

                history.map((item, index) => (

                  <div
                    key={index}
                    className="bg-[#050505] border border-[#1f1f1f] rounded-2xl p-6 mb-5"
                  >

                    <div className="flex justify-between">

                      <div>

                        <h3 className="text-2xl font-bold">
                          {item.filename}
                        </h3>

                        <p className="text-gray-500 mt-2">
                          {item.time}
                        </p>

                      </div>

                      <div className="text-right">

                        {item.results.map((r, i) => (

                          <p
                            key={i}
                            className="text-blue-400"
                          >
                            {r.category}
                          </p>

                        ))}

                      </div>

                    </div>

                  </div>
                ))
              )}

            </div>
          )}

          {/* ANALYTICS */}

          {activeTab === "analytics" && (

            <div className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-3xl p-10">

              <h2 className="text-4xl font-bold mb-8">
                Analytics Overview
              </h2>

              <div className="grid grid-cols-3 gap-8">

                {Object.keys(categoryCounts).map(
                  (key, index) => (

                    <div
                      key={index}
                      className="bg-[#050505] border border-[#1f1f1f] rounded-2xl p-8"
                    >

                      <h3 className="text-2xl font-bold mb-4">
                        {key}
                      </h3>

                      <p className="text-5xl text-blue-400 font-bold">
                        {categoryCounts[key]}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default App;