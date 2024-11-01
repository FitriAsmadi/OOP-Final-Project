const { app, BrowserWindow } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'homepage.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Fetch and display country data from the Countries API
// Fetch and display country data from the Countries API
async function fetchCountry() {
  const countryName = document.getElementById('country-search').value;
  if (!countryName) {
    alert("Please enter a country name.");
    return;
  }

  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if (!response.ok) {
      throw new Error("Country not found");
    }
    const data = await response.json();
    displayCountry(data[0]);
  } catch (error) {
    console.error("Error fetching country data:", error);
    alert("Country not found. Please try again.");
  }
}

// Display country information
function displayCountry(country) {
  const detailsDiv = document.getElementById('country-details');
  detailsDiv.innerHTML = `
    <h2>${country.name.common}</h2>
    <img src="${country.flags.png}" alt="${country.name.common} flag" width="100">
    <p><strong>Continent:</strong> ${country.continents ? country.continents[0] : "N/A"}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Subregion:</strong> ${country.subregion}</p>
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(", ")}</p>
    <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
    <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
    <p><strong>Maps:</strong> <a href="${country.maps.googleMaps}" target="_blank">Google Maps</a></p>
    <img src="${country.coatOfArms ? country.coatOfArms.png : ''}" alt="Coat of arms" width="100">
  `;
}
