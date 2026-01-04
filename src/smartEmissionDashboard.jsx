import React, { useState, useEffect } from 'react';
import ChennaiMap from './chennaiMap';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Activity, Wind, Filter, TrendingDown, Droplet, MapPin, Clock } from 'lucide-react';

const SmartEmissionDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState('manali');
  const [realTimeData, setRealTimeData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const locations = [
    { id: 'manali', name: 'Manali Industrial Estate', lat: 13.1653, lng: 80.2619, area: 'North Chennai', status: 'operational' },
    { id: 'ennore', name: 'Ennore Thermal Plant', lat: 13.2167, lng: 80.3167, area: 'Ennore', status: 'warning' },
    { id: 'ambattur', name: 'Ambattur Industrial Estate', lat: 13.0986, lng: 80.1614, area: 'West Chennai', status: 'operational' },
    { id: 'guindy', name: 'Guindy Industrial Area', lat: 13.0067, lng: 80.2206, area: 'South Chennai', status: 'critical' },
    { id: 'madhavaram', name: 'Madhavaram Cement Factory', lat: 13.1482, lng: 80.2314, area: 'North Chennai', status: 'operational' },
    { id: 'perungudi', name: 'Perungudi IT Corridor', lat: 12.9611, lng: 80.2426, area: 'OMR', status: 'operational' },
    { id: 'tiruvottiyur', name: 'Tiruvottiyur Refinery', lat: 13.1581, lng: 80.3008, area: 'North Chennai', status: 'warning' },
    { id: 'sriperumbudur', name: 'Sriperumbudur SEZ', lat: 12.9688, lng: 79.9447, area: 'West Chennai', status: 'operational' }
  ];

  // Simulation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const newDataPoint = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        input_so2: Math.floor(Math.random() * 50 + 100),
        input_nox: Math.floor(Math.random() * 40 + 80),
        input_voc: Math.floor(Math.random() * 30 + 60),
        input_co: Math.floor(Math.random() * 50 + 150),
        output_so2: Math.floor(Math.random() * 10 + 5),
        output_nox: Math.floor(Math.random() * 5 + 5),
        output_voc: Math.floor(Math.random() * 3 + 3),
        output_co: Math.floor(Math.random() * 10 + 10),
        clean_o2: Math.random() * 2 + 20,
        clean_n2: Math.random() * 1 + 77
      };
      
      setRealTimeData(prev => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-15); // Keep last 15 points for cleaner charts
      });
      setCurrentTime(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const calculateZeoliteLife = (locationId) => {
    const plantData = {
      manali: { remaining: 73, days: 18, absorption: 2847 },
      ennore: { remaining: 45, days: 11, absorption: 3125 },
      ambattur: { remaining: 88, days: 22, absorption: 2156 },
      guindy: { remaining: 21, days: 5, absorption: 3890 },
      madhavaram: { remaining: 67, days: 16, absorption: 2634 },
      perungudi: { remaining: 91, days: 24, absorption: 1890 },
      tiruvottiyur: { remaining: 54, days: 13, absorption: 3250 },
      sriperumbudur: { remaining: 78, days: 19, absorption: 2475 }
    };
    return plantData[locationId] || plantData.manali;
  };

  const zeoliteData = calculateZeoliteLife(selectedLocation);
  const selectedPlant = locations.find(l => l.id === selectedLocation);

  // Modern Color Palette
  const colors = {
    red: '#f43f5e',    // Rose-500
    orange: '#f97316', // Orange-500
    yellow: '#eab308', // Yellow-500
    green: '#10b981',  // Emerald-500
    blue: '#3b82f6',   // Blue-500
    indigo: '#6366f1', // Indigo-500
    slate: '#64748b'   // Slate-500
  };

  const inputGasData = [
    { name: 'SO₂', value: realTimeData.at(-1)?.input_so2 || 125, color: colors.red },
    { name: 'NOx', value: realTimeData.at(-1)?.input_nox || 95, color: colors.orange },
    { name: 'VOC', value: realTimeData.at(-1)?.input_voc || 78, color: colors.yellow },
    { name: 'CO', value: realTimeData.at(-1)?.input_co || 185, color: colors.red }
  ];

  const outputGasData = [
    { name: 'SO₂', value: realTimeData.at(-1)?.output_so2 || 12, color: colors.green },
    { name: 'NOx', value: realTimeData.at(-1)?.output_nox || 9, color: colors.green },
    { name: 'VOC', value: realTimeData.at(-1)?.output_voc || 6, color: colors.green },
    { name: 'CO', value: realTimeData.at(-1)?.output_co || 18, color: colors.green }
  ];

  const cleanAirData = [
    { name: 'Oxygen (O₂)', value: realTimeData.at(-1)?.clean_o2 || 21, color: colors.green },
    { name: 'Nitrogen (N₂)', value: realTimeData.at(-1)?.clean_n2 || 78, color: colors.blue }
  ];

  // Helper for "Pill" badges
  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold capitalize flex items-center gap-1.5 w-fit";
    switch(status) {
      case 'operational': return <span className={`${baseClasses} bg-emerald-50 text-emerald-700 border border-emerald-100`}> <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Operational</span>;
      case 'warning': return <span className={`${baseClasses} bg-amber-50 text-amber-700 border border-amber-100`}> <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Warning</span>;
      case 'critical': return <span className={`${baseClasses} bg-rose-50 text-rose-700 border border-rose-100`}> <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> Critical</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      {/* Navigation / Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <Wind size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">EcoGuard Chennai</h1>
                <p className="text-xs text-gray-500 font-medium">Smart Industrial Emission Control</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">System Time</span>
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                  <Clock size={14} className="text-indigo-500" />
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                BP
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* Top Controls: Location Selector */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-gray-400" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Select Facility</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {locations.map(loc => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className={`flex-shrink-0 px-5 py-3 rounded-xl transition-all duration-200 border text-left min-w-[180px] group ${
                  selectedLocation === loc.id
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <div className="text-sm font-bold truncate group-hover:text-indigo-600 transition-colors" style={{ color: selectedLocation === loc.id ? 'white' : '' }}>
                  {loc.name}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs ${selectedLocation === loc.id ? 'text-indigo-200' : 'text-gray-400'}`}>{loc.area}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    loc.status === 'operational' ? 'bg-emerald-400' : loc.status === 'warning' ? 'bg-amber-400' : 'bg-rose-400'
                  }`}></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          
          {/* Left Column: KPI Cards */}
          <div className="xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Filter size={20} />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase">Zeolite Health</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-gray-900">{zeoliteData.remaining}%</h3>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                <div 
                  className={`h-1.5 rounded-full ${zeoliteData.remaining > 50 ? 'bg-blue-500' : 'bg-rose-500'}`} 
                  style={{ width: `${zeoliteData.remaining}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Est. {zeoliteData.days} days until replacement</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <Wind size={20} />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase">Absorption</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{zeoliteData.absorption.toLocaleString()}</h3>
              <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <TrendingDown size={14} /> mg/hr captured
              </p>
              <p className="text-xs text-gray-500 mt-1">Efficient filtration active</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Activity size={20} />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase">Efficiency</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">87.4%</h3>
              <p className="text-sm text-indigo-600 font-medium mt-1">Total Reduction</p>
              <p className="text-xs text-gray-500 mt-1">Compared to raw intake</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                    <AlertTriangle size={20} />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase">Status</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPlant.name}</h3>
                {getStatusBadge(selectedPlant.status)}
              </div>
              {selectedPlant.status === 'critical' && (
                 <div className="mt-3 text-xs bg-rose-50 text-rose-700 p-2 rounded border border-rose-100">
                   Requires immediate maintenance check.
                 </div>
              )}
            </div>

          </div>

          {/* Row 2: Charts & Map */}
          
          {/* Main Line Chart */}
          <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-gray-800">Real-time Emission Trends</h3>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Raw SO₂
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Clean SO₂
                  </div>
               </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="input_so2" stroke={colors.red} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="output_so2" stroke={colors.green} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Map */}
          <div className="xl:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
               <h3 className="text-sm font-bold text-gray-700">Live Geo-Tracking</h3>
             </div>
             <div className="flex-grow min-h-[300px]">
               <ChennaiMap locations={locations} selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />
             </div>
          </div>
        </div>

        {/* Row 3: Detail Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Droplet size={16} className="text-gray-400" /> Intake Composition
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={inputGasData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={40} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" barSize={12} radius={[0, 4, 4, 0]}>
                  {inputGasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Filter size={16} className="text-gray-400" /> Filtered Output
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={outputGasData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={40} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" barSize={12} radius={[0, 4, 4, 0]}>
                   {outputGasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Wind size={16} className="text-gray-400" /> Air Quality Mix
            </h3>
            <div className="flex items-center justify-center h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cleanAirData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {cleanAirData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
             <h3 className="font-bold text-gray-800">Regional Overview</h3>
             <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Download Report</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-400 font-medium uppercase text-xs">
                <tr>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Zone</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Zeolite Capacity</th>
                  <th className="py-4 px-6 text-right">Absorption</th>
                  <th className="py-4 px-6 text-right">AQI Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {locations.map(loc => {
                  const data = calculateZeoliteLife(loc.id);
                  const isSelected = selectedLocation === loc.id;
                  return (
                    <tr 
                      key={loc.id} 
                      onClick={() => setSelectedLocation(loc.id)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/30' : ''}`}
                    >
                      <td className="py-4 px-6 font-semibold text-gray-800">{loc.name}</td>
                      <td className="py-4 px-6 text-gray-500">{loc.area}</td>
                      <td className="py-4 px-6">
                        {getStatusBadge(loc.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${
                              data.remaining > 50 ? 'bg-emerald-500' : data.remaining > 25 ? 'bg-amber-500' : 'bg-rose-500'
                            }`} style={{ width: `${data.remaining}%` }}></div>
                          </div>
                          <span className="text-gray-600 text-xs font-medium">{data.remaining}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-gray-700">{data.absorption} mg/hr</td>
                      <td className="py-4 px-6 text-right text-emerald-600 font-bold">-87%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SmartEmissionDashboard;