const submitButton = document.getElementById("submit");


// (2) Interaktionen festlegen

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();
  onClickSubmit();
});


const onClickSubmit = async () => {
  // Speichert die Daten in der Datenbank
  await databaseClient.insertInto("user", {
    email: "test",
  });


};