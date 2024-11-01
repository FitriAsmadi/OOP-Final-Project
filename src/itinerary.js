async function fetchCountryData(countryName) {
    if (!countryName) return null;

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error("Country not found");

        const data = await response.json();
        return data[0];  // Return the first matching country
    } catch (error) {
        console.error("Error fetching country data:", error);
        alert("Country not found. Please try again.");
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const itineraryForm = document.getElementById('itineraryForm');
    const itineraryList = document.getElementById('itineraryList');
    const addButton = document.getElementById('addButton');
    const updateButton = document.getElementById('updateButton');
    let itineraries = JSON.parse(localStorage.getItem('itineraries')) || [];
    let editIndex = null;

    function renderItineraries() {
        itineraryList.innerHTML = '';
        itineraries.forEach((itinerary, index) => {
            const item = document.createElement('li');
            item.classList.add('itinerary-item');
            const countryInfo = itinerary.countryInfo || {};

            item.innerHTML = `
                <div>
                    <h3>${itinerary.destination}</h3>
                    <p><strong>Country:</strong> ${countryInfo.name || 'N/A'}</p>
                    <p><strong>Continent:</strong> ${countryInfo.continent || 'N/A'}</p>
                    <p><strong>Population:</strong> ${countryInfo.population ? countryInfo.population.toLocaleString() : 'N/A'}</p>
                    <p><strong>Capital:</strong> ${countryInfo.capital || 'N/A'}</p>
                    <p><strong>Date:</strong> ${itinerary.date}</p>
                    <p><strong>Notes:</strong> ${itinerary.notes}</p>
                </div>
                <div class="actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            item.querySelector('.edit-btn').onclick = () => editItinerary(index);
            item.querySelector('.delete-btn').onclick = () => deleteItinerary(index);
            itineraryList.appendChild(item);
        });
    }

    function deleteItinerary(index) {
        itineraries.splice(index, 1);
        localStorage.setItem('itineraries', JSON.stringify(itineraries));
        renderItineraries();
    }

    function editItinerary(index) {
        const itinerary = itineraries[index];
        document.getElementById('country-name').value = itinerary.countryInfo.name || '';
        document.getElementById('destination').value = itinerary.destination;
        document.getElementById('date').value = itinerary.date;
        document.getElementById('notes').value = itinerary.notes;
        
        editIndex = index;
        addButton.style.display = 'none';
        updateButton.style.display = 'inline';
    }

    renderItineraries();

    itineraryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const countryName = document.getElementById('country-name').value;
        const destination = document.getElementById('destination').value;
        const date = document.getElementById('date').value;
        const notes = document.getElementById('notes').value;

        const countryInfo = await fetchCountryData(countryName);

        if (!countryInfo) {
            alert("Could not retrieve country information. Please try again.");
            return;
        }

        const countryDetails = {
            name: countryInfo.name.common,
            continent: countryInfo.continents ? countryInfo.continents[0] : 'N/A',
            population: countryInfo.population,
            capital: countryInfo.capital ? countryInfo.capital[0] : 'N/A'
        };

        if (editIndex !== null) {
            itineraries[editIndex] = { destination, date, notes, countryInfo: countryDetails };
            editIndex = null;
            addButton.style.display = 'inline';
            updateButton.style.display = 'none';
        } else {
            itineraries.push({ destination, date, notes, countryInfo: countryDetails });
        }

        localStorage.setItem('itineraries', JSON.stringify(itineraries));
        renderItineraries();
        itineraryForm.reset();
    });
});
