const GROUP_NAME = "cl4";
const PASSWORD = "o42rw7f4oult7403";

const SERVER_URL = "https://ict-290.herokuapp.com/sql";
const databaseClient = {
  executeSqlQuery: async (sql) => {
    const payload = {
      group: GROUP_NAME,
      pw: PASSWORD,
      sql: sql,
    };
    try {
      const response = await fetch(SERVER_URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.error) {
        console.error(result.error);
      }
      return result;
    } catch (error) {
      console.error("DB error", error);
    }
  },
  insertInto: async (sqlTable, formData) => {
    let result = null;
    const fields = Object.keys(formData);
    const values = Object.values(formData);

    const sql = `INSERT INTO ${sqlTable} (${fields.join(",")}) VALUES ('${values.join("','")}')`;
    try {
      result = await databaseClient.executeSqlQuery(sql);
    } catch (error) {
      console.error("Fehler bei der Datenbank: ", error);
    }
    return result;
  },
};

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
    `SELECT * FROM wavesystem_anmelden WHERE email = '${email}'`
  );

  if (existingUser && existingUser.length > 1) {
    errorMessage.textContent = "Diese Email wird schon verwendet.";
    errorMessage.classList.remove("hidden");
    spinner.classList.add("hidden");
    return;
  }

  await databaseClient.insertInto("wavesystem_anmelden", {
    vorname: firstName,
    nachname: lastName,
    tel: phone,
    email: email,
  });

  spinner.classList.add("hidden");
  alert("Anmeldung erfolgreich!");
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
