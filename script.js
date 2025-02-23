function formatNumber(num) {
    return num.length === 1 ? `0${num}` : num;
}

function fetchEvents() {
    let day = document.getElementById('dayInput').value.trim();
    let month = document.getElementById('monthInput').value.trim();
    let year = document.getElementById('yearInput').value.trim();
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";
    
    if (!day && !month && !year) {
        alert("Будь ласка, введіть хоча б одне значення!");
        return;
    }
    
    if (day) day = formatNumber(day);
    if (month) month = formatNumber(month);
    
    let url = "https://uk.wikipedia.org/api/rest_v1/feed/onthisday/events";
    if (month && day) {
        url += `/${month}/${day}`;
    } else if (month) {
        url += `/${month}`;
    } else if (day) {
        resultsDiv.innerHTML = "Будь ласка, введіть ще місяць, щоб знайти точну дату.";
        return;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.events || data.events.length === 0) {
                resultsDiv.innerHTML = "Немає подій на цю дату.";
                return;
            }
            
            data.events.forEach(event => {
                if (year && event.year != year) {
                    return;
                }
                let fullDate = `${day ? day + '.' : ''}${month ? month + '.' : ''}${event.year}`;
                let eventDiv = document.createElement('div');
                let eventTitle = document.createElement('h3');
                eventTitle.textContent = fullDate;
                let eventLink = document.createElement('a');
                eventLink.href = event.pages[0]?.content_urls.desktop.page || "#";
                eventLink.target = "_blank";
                eventLink.textContent = event.text;
                eventDiv.appendChild(eventTitle);
                eventDiv.appendChild(eventLink);
                resultsDiv.appendChild(eventDiv);
            });
        })
        .catch(error => {
            console.error("Помилка отримання даних:", error);
            resultsDiv.innerHTML = "Сталася помилка при отриманні даних.";
        });
}