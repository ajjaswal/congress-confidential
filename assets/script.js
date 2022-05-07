// Global Variables
let apiKeyOS = "&apikey=52bd980a85a89989e6260d23bd83f50d";
let apiKeyPP = "Nbok2EA6kaa2AFQAwjVFch7ybtjcV9tpQpQT52ST"
let urlOS = "https://www.opensecrets.org/api/?output=json";
let urlPP = "https://api.propublica.org/congress/v1/members/";
let stateSelect = document.getElementById("state");
let displayEl = document.getElementById("display");
let selectBar = document.getElementById("select-bar");
let bioBox = document.createElement("div");
bioBox.classList = "board";


// Displays reps biography and produces buttons for other functional displays
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
    let fullName = firstName + " " + lastName + " (" + party + ")"
    
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


    displayEl.appendChild(bioBox);
    bioBox.appendChild(repName);
    bioBox.appendChild(title);
    bioBox.appendChild(birthdate);
    bioBox.appendChild(urlLink);

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
                returnBtn.classList = "button is-danger is-rounded is-normal is-focused";
                returnBtn.textContent = "Return to Representitive Bio";
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



