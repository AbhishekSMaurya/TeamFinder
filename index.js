var modal = document.getElementById("submitModal");
var btn = document.querySelector("button[type='submit']");
var span = document.getElementsByClassName("close")[0];
var form = document.getElementById("profile-form");

function submitbutton(event) {
   
    event.preventDefault();

   
    form.reset();

   
    modal.style.display = "block";
}


span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

cdocument.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const skills = document.getElementById('skills').value;
    const availability = document.getElementById('availability').value;
    const preferences = document.getElementById('preferences').value;

    const newTeammate = {
        name,
        skills,
        availability,
        preferences
    };

    fetch('/add_teammate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTeammate)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Success message
    })
    .catch(error => {
        alert("Error adding teammate");
    });
});

function searchTeams() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const teamList = document.getElementById('team-list');
    
    fetch('/get_teammates')
    .then(response => response.json())
    .then(data => {
        const filteredTeams = data.filter(teammate => teammate.name.toLowerCase().includes(query));
        teamList.innerHTML = filteredTeams.map(teammate => `<li>${teammate.name}</li>`).join('');
    });
}
