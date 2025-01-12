import { useEffect, useState } from 'react'
import Papa from 'papaparse';
import './App.css'
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

function App() {
  const [data, setData] = useState([]);

  const [mode, setMode] = useState('light');


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

  
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0px 2px 4px -1px rgba(0,0,0,0.05), 0px 4px 6px -1px rgba(0,0,0,0.05)'
              : '0px 2px 4px -1px rgba(0,0,0,0.15), 0px 4px 6px -1px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  });

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout toggleTheme={toggleTheme}>
     
        <Dashboard makeDistribution={vehicleMakeDistribution} modelYearData={modelYearData} evTypeData={evTypeData} data={data} evTypeDistribution={evTypeDistribution}/>
      </Layout>
    </ThemeProvider>
    </>
  )
}

export default App
