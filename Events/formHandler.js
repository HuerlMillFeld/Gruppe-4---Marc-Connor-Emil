document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const spinner = document.getElementById("spinner");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the form from submitting immediately

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;

        spinner.classList.remove("hidden");
        errorMessage.classList.add("hidden");

        if (!validateEmail(email)) {
            errorMessage.textContent = "Ungültige Email-Adresse.";
            errorMessage.classList.remove("hidden");
            spinner.classList.add("hidden");
            return;
        }

        try {
            await databaseClient.insertInto("wavesystem_anmelden", {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
            });
            alert("Anmeldung erfolgreich!");
        } catch (error) {
            errorMessage.textContent = "Fehler bei der Anmeldung.";
            errorMessage.classList.remove("hidden");
        } finally {
            spinner.classList.add("hidden");
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});
