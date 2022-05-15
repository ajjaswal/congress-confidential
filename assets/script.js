// Global Variables
let apiKeyOS = "&apikey=52bd980a85a89989e6260d23bd83f50d";
let apiKeyPP = "Nbok2EA6kaa2AFQAwjVFch7ybtjcV9tpQpQT52ST"
let urlOS = "https://www.opensecrets.org/api/?output=json";
let urlPP = "https://api.propublica.org/congress/v1/members/";
let stateSelect = document.getElementById("state");
let displayEl = document.getElementById("display");
let selectBar = document.getElementById("select-bar");
let voteDisplay = document.getElementById("vote-display");
let voteBox = document.createElement("div");
let bioBox = document.createElement("div");
let searchSave = document.getElementById("search-save");
var searches = [];
bioBox.classList = "board";
voteBox.classList = "column is-fluid is-danger board";
voteBox.setAttribute("id", "vote-box");

// loads previous search from local storage
function loadSearch() {
    searches = JSON.parse(localStorage.getItem("searches")) || [];
    for(i=0;i<searches.length;i++) {
        let saveOption = document.createElement("Option");
        saveOption.setAttribute("value", searches[i].id);
        saveOption.textContent = searches[i].name;
        searchSave.appendChild(saveOption);
    }
}

// saves searched representive and populated select box
function saveSearch(id) {
    fetch(urlPP + id + ".json", {
        method: "GET",
        headers: {"X-API-Key": apiKeyPP}
    }).then(function (response) {
        return response.json();
    }).then(function (data) {

    let memberId = data.results[0].id;
    let firstName = data.results[0].first_name;
    let lastName = data.results[0].last_name;
    let fullName = firstName + " " + lastName;

    let saveOption = document.createElement("Option");
    saveOption.setAttribute("value", memberId);
    saveOption.textContent = fullName;
    searchSave.appendChild(saveOption);

    searches.push({
        id: memberId,
        name: fullName
    });
 
    localStorage.setItem("searches", JSON.stringify(searches));
    candSummary(memberId);
    })
}



// Displays Member biography
function memberBio(id) {
    fetch(urlPP + id + ".json", {
        method: "GET",
        headers: {"X-API-Key": apiKeyPP}
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
    displayEl.innerHTML = "";
    bioBox.innerHTML = "";
        
    let memberId = data.results[0].id;
    let firstName = data.results[0].first_name;
    let lastName = data.results[0].last_name;
    let party = data.results[0].current_party;
    let repUrl = data.results[0].url;
    let fullName = firstName + " " + lastName + " (" + party + ")";
    let memberPicture = "https://raw.githubusercontent.com/unitedstates/images/gh-pages/congress/225x275/" + memberId + ".jpg";

    var img = document.createElement('img');
    img.src = memberPicture;
    
    let repName = document.createElement("h1");
    repName.className = "rep-name";
    repName.textContent = fullName;

    let title = document.createElement("h1");
    title.className = "cycle";
    title.textContent = "Title: " + data.results[0].roles[0].title;
    
    let birthdate = document.createElement("h1");
    birthdate.textContent = "Date of Birth: " + data.results[0].date_of_birth;

    let urlLink = document.createElement("a");
    urlLink.setAttribute("href", repUrl);
    urlLink.textContent = repUrl;

    let financialBtn = document.createElement("button");
    financialBtn.classList = "button is-danger is-normal is-focused";
    financialBtn.textContent = "Summary of Finacial Information";
    financialBtn.addEventListener("click", (event) => {
        candSummary(memberId);
    });


    displayEl.appendChild(bioBox);
    bioBox.appendChild(repName);
    bioBox.appendChild(title);
    bioBox.appendChild(birthdate);
    bioBox.appendChild(urlLink);
    bioBox.appendChild(financialBtn);
    

    })
}

// Function to display candidates financial summary
function candSummary(id) {
    fetch(urlPP + id + ".json", {
        method: "GET",
        headers: {
            "X-API-Key": apiKeyPP
        }
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        let cid = data.results[0].crp_id;
        fetch(urlOS + "&method=candSummary&cid=" + cid + "&cycle=2022" + apiKeyOS)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                
                displayEl.innerHTML = "";
                let objBios = Object.values(data.response.summary);
                let box = document.createElement("div");
                let name = document.createElement("div");
                let cycle = document.createElement("div");
                let updated = document.createElement("div");
                let origin = document.createElement("div");
                let container = document.createElement("div");
                let column1 = document.createElement("div");
                let column2 = document.createElement("div");
                let title = document.createElement("h2");
                let totals = document.createElement("h2");
                let cashWords = document.createElement("p");
                let cashOnHand = document.createElement("p");
                let debtWords = document.createElement("p");
                let debt = document.createElement("p");
                let spentWords = document.createElement("p");
                let spent = document.createElement("p");
                let totalWords = document.createElement("p");
                let total = document.createElement("p");
                
                
                let returnBtn = document.createElement("button");
                returnBtn.classList = "button is-danger is-normal is-focused";
                returnBtn.textContent = "View Representitive Bio";
                returnBtn.addEventListener("click", (event) => {
                    memberBio(id);
                })

                
                box.className = "board";
                container.className = "columns is-mobile";
                column1.className = "column";
                column2.className = "column";
                cycle.className = "cycle";
                name.className = "rep-name";
                
                name.textContent = objBios[0].cand_name;
                cycle.textContent = "Cycle Year: " + objBios[0].cycle;
                updated.textContent = "Last Updated: " + objBios[0].last_updated;
                origin.textContent = "Origin: " + objBios[0].origin;
                title.textContent = "Summary:";
                totals.textContent = "Totals:";

                cashWords.textContent = "Cash On Hand";
                cashOnHand.textContent = "$" + objBios[0].cash_on_hand;
                debtWords.textContent = "Debt"
                debt.textContent = "$" + objBios[0].debt;
                spentWords.textContent = "Spent"
                spent.textContent = "$" + objBios[0].spent;
                totalWords.textContent = "Total"
                total.textContent = "$" + objBios[0].total;

                displayEl.appendChild(box);
                box.appendChild(name);
                box.appendChild(cycle);
                box.appendChild(updated);
                box.appendChild(origin);
                box.appendChild(container);
                box.appendChild(cashOnHand);
                box.appendChild(debt);
                box.appendChild(spent);
                box.appendChild(total);
                box.appendChild(returnBtn);
                container.appendChild(column1);
                container.appendChild(column2);
                column1.appendChild(title);
                column1.appendChild(cashWords);
                column1.appendChild(debtWords);
                column1.appendChild(spentWords);
                column1.appendChild(totalWords);
                column2.appendChild(totals);
                column2.appendChild(cashOnHand);
                column2.appendChild(debt);
                column2.appendChild(spent);
                column2.appendChild(total);
            })
    })
}



// Function to display reps in select box for a given state and chamber
function displayReps(state, chamber) {
    selectBar.removeChild(selectBar.lastChild);

    let stateBox = document.createElement("div");
    let selectBox = document.createElement("div");
    let repSelect = document.createElement("select");
    let nilOption = document.createElement("option");

    stateBox.classList = "column is-offset-6";
    selectBox.classList = "select is-danger is-normal is-focused";
    repSelect.setAttribute("id", "rep-select");
    nilOption.setAttribute("value", "Select Member");
    nilOption.textContent = "Select Member";

    selectBar.appendChild(selectBox);
    selectBox.appendChild(repSelect);
    repSelect.appendChild(nilOption);

    fetch(urlPP + chamber + "/" + state + "/current.json", {
        method: "GET",
        headers: {
            "X-API-Key": apiKeyPP
        }
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        for (i = 0; i < data.results.length; i++) {
            let repOption = document.createElement("option");
            repOption.setAttribute("value", data.results[i].id);
            repOption.textContent = data.results[i].name;
            repSelect.appendChild(repOption);
        }
        selectBox.addEventListener("change", (event) => {
            if (event.target.value === "Select Member") {
                location.reload();
            } else {
            saveSearch(event.target.value);
            }
        });
    })
}
// Function to display chambeer select box after selecting state
function displayChamber(state) {
    selectBar.removeChild(selectBar.lastChild);

    let chamberBox = document.createElement("div");
    let selectDiv = document.createElement("div");
    let chamberSelect = document.createElement("select");
    let noOption = document.createElement("option");
    let senateOption = document.createElement("option");
    let houseOption = document.createElement("option");
    
    chamberBox.classList = "column is-offset-6";
    selectDiv.classList = "select is-danger is-normal is-focused";

    chamberSelect.setAttribute("id", "chamber-select");
    noOption.setAttribute("value", "Select Chamber");
    senateOption.setAttribute("value", "senate");
    houseOption.setAttribute("value", "house");

    noOption.textContent = "Select Chamber";
    senateOption.textContent = "Senate";
    houseOption.textContent = "House of Representatives";

    selectBar.appendChild(selectDiv);
    selectDiv.appendChild(chamberSelect);
    chamberSelect.appendChild(noOption);
    chamberSelect.appendChild(senateOption);
    chamberSelect.appendChild(houseOption);

    selectDiv.addEventListener("change", (event) => {
        if (event.target.value === "Select Chamber") {
            location.reload();
        } else {
        displayReps(state, event.target.value);
        }
    })
}

loadSearch();

// Event listeners for saved search and state selector
searchSave.addEventListener('change', (event) => {
    if (event.target.value === "Previous Searches") {
        location.reload();
    } else {
        candSummary(event.target.value);
    }
});

stateSelect.addEventListener('change', (event) => {
    if (event.target.value === "Select State") {
        location.reload();
    } else {
    displayChamber(event.target.value);
    }
});