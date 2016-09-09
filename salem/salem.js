console.log("salem.js");

// All possible roles for a ranked game
var town = [
	["jailor", 1],
	["investigative1", 1],
	["investigative2", 1],
	["support1", 1],
	["support2", 1],
	["protective", 1],
	["killing", 1],
	["random", 1]
]
var mafia = [
	["godfather", 1],
	["mafioso", 1],
	["random", 1]
]
var neutral = [
	["killing", 1],
	["evil", 1],
	["benign", 1],
	["any", 1]
]


// Populate page with HTML elements

function populateColumn(team, string) {

	team.forEach(function(role) {

		// Create a "button"
		var button = document.createElement('div');
		button.id = role+"-button"
		button.className = "button "+string+"-alive";
		button.innerHTML = caps(role[0]);

		// Click event listener
		button.addEventListener('click', function(event) {
			role[1] = (role[1]+1)%2;

			// If the role is dead
			if (role[1] === 0) {
				button.className = "button ";
			} else {
				button.className = "button "+string+"-alive";	
			}		

		}, false);

		// Append button
		document.getElementById(string+"-column").appendChild(button);

		// Attach an event listener
		// document.getElementById("myBtn").addEventListener("click", displayDate);

		// Create text label element (optional)

	});

}

function caps(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

populateColumn(town, "town");
populateColumn(mafia, "mafia");
populateColumn(neutral, "neutral");