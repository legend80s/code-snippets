/**
 * Transform HTML `table` element to JS Object.
 * @param {HTMLTableElement} table
 * @returns {{ caption: string; rows: Array<{ [key: string]: string }>; }}
 */
function table2JSObject(table) {
  const caption = table.caption ? table.caption.textContent.trim() : '';
  const titles = [...table.querySelectorAll('th')].map(th => {
    const innerHTML = th.innerHTML;
    
    // 'Mass (10<sup>24</sup>kg)' => 'Mass (10^24kg)'
    if (innerHTML.includes('<sup>')) {
      return innerHTML.replace(/<sup>(.+)<\/sup>/, '^$1')
    } else {
      return th.textContent.trim()
    }
  });

  const rows = [...table.querySelectorAll('tbody > tr')].reduce((acc, tr) => {
    const tds = [...tr.querySelectorAll('td,th')].filter(element => element.getAttribute('rowspan') === null && element.getAttribute('colspan') === null);
    const row = tds.reduce((acc, td, i) => {
      return { ...acc, [titles[i]]: tds[i].textContent.trim() }
    }, {});
  
    return [...acc, row];
  }, []);

  return { caption, rows }
}

// https://mdn.github.io/learning-area/html/tables/assessment-finished/planets-data.html
table2JSObject($('table'))
// =>
{
  "caption": "Data about the planets of our solar system (Planetary facts taken from Nasa's Planetary Fact Sheet - Metric).",
  "rows": [
    {
      "Name": "Mercury",
      "Mass (10^24kg)": "0.330",
      "Diameter (km)": "4,879",
      "Density (kg/m^3)": "5427",
      "Gravity (m/s^2)": "3.7",
      "Length of day (hours)": "4222.6",
      "Distance from Sun (10^6km)": "57.9",
      "Mean temperature (°C)": "167",
      "Number of moons": "0",
      "Notes": "Closest to the Sun"
    },
    {
      "Name": "Venus",
      "Mass (10^24kg)": "4.87",
      "Diameter (km)": "12,104",
      "Density (kg/m^3)": "5243",
      "Gravity (m/s^2)": "8.9",
      "Length of day (hours)": "2802.0",
      "Distance from Sun (10^6km)": "108.2",
      "Mean temperature (°C)": "464",
      "Number of moons": "0",
      "Notes": ""
    },
    {
      "Name": "Earth",
      "Mass (10^24kg)": "5.97",
      "Diameter (km)": "12,756",
      "Density (kg/m^3)": "5514",
      "Gravity (m/s^2)": "9.8",
      "Length of day (hours)": "24.0",
      "Distance from Sun (10^6km)": "149.6",
      "Mean temperature (°C)": "15",
      "Number of moons": "1",
      "Notes": "Our world"
    },
    {
      "Name": "Mars",
      "Mass (10^24kg)": "0.642",
      "Diameter (km)": "6,792",
      "Density (kg/m^3)": "3933",
      "Gravity (m/s^2)": "3.7",
      "Length of day (hours)": "24.7",
      "Distance from Sun (10^6km)": "227.9",
      "Mean temperature (°C)": "-65",
      "Number of moons": "2",
      "Notes": "The red planet"
    },
    {
      "Name": "Jupiter",
      "Mass (10^24kg)": "1898",
      "Diameter (km)": "142,984",
      "Density (kg/m^3)": "1326",
      "Gravity (m/s^2)": "23.1",
      "Length of day (hours)": "9.9",
      "Distance from Sun (10^6km)": "778.6",
      "Mean temperature (°C)": "-110",
      "Number of moons": "67",
      "Notes": "The largest planet"
    },
    {
      "Name": "Saturn",
      "Mass (10^24kg)": "568",
      "Diameter (km)": "120,536",
      "Density (kg/m^3)": "687",
      "Gravity (m/s^2)": "9.0",
      "Length of day (hours)": "10.7",
      "Distance from Sun (10^6km)": "1433.5",
      "Mean temperature (°C)": "-140",
      "Number of moons": "62",
      "Notes": ""
    },
    {
      "Name": "Uranus",
      "Mass (10^24kg)": "86.8",
      "Diameter (km)": "51,118",
      "Density (kg/m^3)": "1271",
      "Gravity (m/s^2)": "8.7",
      "Length of day (hours)": "17.2",
      "Distance from Sun (10^6km)": "2872.5",
      "Mean temperature (°C)": "-195",
      "Number of moons": "27",
      "Notes": ""
    },
    {
      "Name": "Neptune",
      "Mass (10^24kg)": "102",
      "Diameter (km)": "49,528",
      "Density (kg/m^3)": "1638",
      "Gravity (m/s^2)": "11.0",
      "Length of day (hours)": "16.1",
      "Distance from Sun (10^6km)": "4495.1",
      "Mean temperature (°C)": "-200",
      "Number of moons": "14",
      "Notes": ""
    },
    {
      "Name": "Pluto",
      "Mass (10^24kg)": "0.0146",
      "Diameter (km)": "2,370",
      "Density (kg/m^3)": "2095",
      "Gravity (m/s^2)": "0.7",
      "Length of day (hours)": "153.3",
      "Distance from Sun (10^6km)": "5906.4",
      "Mean temperature (°C)": "-225",
      "Number of moons": "5",
      "Notes": "Declassified as a planet in 2006, but this remains controversial."
    }
  ]
}
