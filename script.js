function formatNumber(num) { 
    return num.length === 1 ? `0${num}` : num; 
} 
 
function fetchEvents() { 
    let day = document.getElementById('dayInput').value.trim(); 
    let month = document.getElementById('monthInput').value.trim(); 
    let year = document.getElementById('yearInput').value.trim(); 
    let resultsDiv = document.getElementById('results'); 
    let loader = document.getElementById('loader'); 
    let searchButton = document.getElementById('searchButton'); 
     
    resultsDiv.innerHTML = ""; 
    loader.style.display = "none"; 
    searchButton.disabled = false; 
     
    if (!day || !month) { 
        alert("Будь ласка, введіть день і місяць!"); 
        loader.style.display = "none"; 
        searchButton.disabled = true; 
        return; 
    } 
     
    day = formatNumber(day); 
    month = formatNumber(month); 
     
    let eventUrl = `https://uk.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
     
    fetch(eventUrl) 
        .then(response => { 
            loader.style.display = "block"; 
            if (!response.ok) { 
                throw new Error("Невдалий запит до API"); 
            } 
            return response.json(); 
        }) 
        .then(eventData => { 
            let eventsFound = false; 
            resultsDiv.innerHTML = ""; 
             
            if (eventData.events && eventData.events.length > 0) { 
                eventData.events.forEach(event => { 
                    if (year && event.year != year) { 
                        return; 
                    } 
                    eventsFound = true; 
                    let eventDiv = document.createElement('div'); 
                    let eventTitle = document.createElement('h3'); 
                    eventTitle.textContent = `${day}.${month}.${event.year}`; 
                    let eventLink = document.createElement('a'); 
                    eventLink.href = event.pages[0]?.content_urls?.desktop?.page || "#"; 
                    eventLink.target = "_blank"; 
                    eventLink.textContent = event.text; 
                    eventDiv.appendChild(eventTitle); 
                    eventDiv.appendChild(eventLink); 
                    resultsDiv.appendChild(eventDiv); 
                }); 
            } 
             
            if (!eventsFound) { 
                resultsDiv.innerHTML = "Немає подій на цю дату."; 
            } 
            loader.style.display = "none"; 
            searchButton.disabled = false; 
        }) 
        .catch(error => { 
            console.error("Помилка отримання даних:", error); 
            resultsDiv.innerHTML = "Сталася помилка при отриманні даних."; 
        }) 
        .finally(() => { 
            loader.style.display = "none"; 
            searchButton.disabled = false; 
 
            // setTimeout(() => { 
            //     loader.style.display = "none"; 
            //     searchButton.disabled = false; 
            // }, 500); 
        }); 
}