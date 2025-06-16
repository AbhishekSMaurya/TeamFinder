document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("submitModal");
    var span = document.getElementsByClassName("close")[0];
    var form = document.getElementById("profile-form");
    var submitBtn = document.getElementById("submitBtn"); // Get the button

    // Function to handle form submission
    function submitbutton(event) {
        event.preventDefault();
        if (form) form.reset();
        if (modal) modal.style.display = "block";
    }

    // Attach event listener to the submit button
    if (submitBtn) {
        submitBtn.addEventListener("click", submitbutton);
    }

    // Ensure elements exist before adding event listeners
    if (span) {
        span.onclick = function () {
            modal.style.display = "none";
        };
    }

    if (modal) {
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    }

    // Form submission event listener
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const skills = document.getElementById("skills").value;
            const availability = document.getElementById("availability").value;
            const preferences = document.getElementById("preferences").value;

            const newTeammate = {
                name,
                skills,
                availability,
                preferences,
            };

            fetch("/add_teammate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTeammate),
            })
                .then((response) => response.json())
                .then((data) => {
                    alert(data.message); // Success message
                })
                .catch((error) => {
                    alert("Error adding teammate");
                });
        });
    }

    // Function to search teams
    function searchTeams() {
        const query = document.getElementById("searchInput")?.value.toLowerCase();
        const teamList = document.getElementById("team-list");

        fetch("/get_teammates")
            .then((response) => response.json())
            .then((data) => {
                const filteredTeams = data.filter((teammate) =>
                    teammate.name.toLowerCase().includes(query)
                );
                teamList.innerHTML = filteredTeams
                    .map((teammate) => `<li>${teammate.name}</li>`)
                    .join("");
            });
    }

    // Attach search function to input field (if present)
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", searchTeams);
    }
});
