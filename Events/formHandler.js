document.getElementById("raveForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const spinner = document.getElementById("spinner");
    const errorMessage = document.getElementById("error-message");

    spinner.classList.remove("hidden");
    errorMessage.classList.add("hidden");

    if (!validateEmail(email)) {
        errorMessage.textContent = "Ungültige Email-Adresse.";
        errorMessage.classList.remove("hidden");
        spinner.classList.add("hidden");
        return;
    }

    const existingUser = await databaseClient.executeSqlQuery(
        `SELECT * FROM user WHERE email = '${email}'`
    );

    if (existingUser && existingUser.length > 1) {
        errorMessage.textContent = "Diese Email wird schon verwendet.";
        errorMessage.classList.remove("hidden");
        spinner.classList.add("hidden");
        return;
    }

    await databaseClient.insertInto("user", {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
    });

    spinner.classList.add("hidden");
    alert("Anmeldung erfolgreich!");
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
