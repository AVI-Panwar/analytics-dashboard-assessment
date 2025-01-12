import { useEffect, useState } from 'react'
import Papa from "papaparse"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  
  const [data, setData] = useState([]);
  useEffect(() => {
    const loadCSVData = async () => {
      try {
          const response = await fetch('/Electric_Vehicle_Population_Data.csv');
          const csvText = await response.text();
  
          Papa.parse(csvText, {
              header: true,
              dynamicTyping: true,
              skipEmptyLines: true,
              complete: (results) => {
                  if (results.errors.length) {
                      console.error('Parsing errors:', results.errors);
                      return;
                  }
                  console.log('Converted JSON data:', results.data);
                  setData(results.data);
              },
              error: (error) => {
                  console.error('Error parsing CSV:', error);
              }
          });
      } catch (error) {
          console.error('Error loading CSV:', error);
      }
  };
    loadCSVData();
  }, []);
  
  const reducerFunction = (acc, item) => {
    const evType = item['Electric Vehicle Type'];

    //dynamic key intialization
    acc[evType] = (acc[evType] || 0) + 1;

    // {"Battery Electric Vehicle (BEV)":1, }
    return acc;
  }
  const evTypeDistribution = data.reduce(reducerFunction, {});

  const evTypeData = Object.entries(evTypeDistribution)
    .map(([make, count]) => ({
      name: make,
      value: count,
    }))
    console.log("evTypeData",evTypeData);

  const reducerFunctionManfactures = (acc,item) => {
      const manufacturerType = item['Make'];
      
      acc[manufacturerType] = (acc[manufacturerType] || 0) + 1 ;
      
      return acc;
  }
  const topManufacturers = data.reduce(reducerFunctionManfactures,{});



  const reducerYearlyData = (acc, item) => {
      const year = item["Model Year"];
      acc[year] = (acc[year] || 0) + 1;
      return acc;
  }
  
  const yearlyData = data.reduce(reducerYearlyData,{});

  const modelYearData = Object.entries(yearlyData)
  .map(([year, count]) => ({
   year: year,
   count: count
  }))
  console.log("modelYearData",modelYearData);


  const vehicleMakeDistribution = Object.entries(topManufacturers)
    .map(([make, count]) => ({
      name: make,
      value: count,
      percentage: ((count / data?.length) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);


  return (
    <>
      <h1>hello</h1>
    </>
  )
}

export default App
