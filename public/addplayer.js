// Select the form
const p = document.querySelector("form")
// Add an event listener to the form for when it's submitted. In the event listener, 
// - Prevent the default behavior of refreshing the page
// - get the form data from the form
// - create an object from the form data
// - make a fetch request to your POST route to send the object to the server
// - once that is done, redirect the client to "/" (back to the home page)


p.addEventListener("submit",(event) =>{
  console.log("form submit")
  event.preventDefault();

  const playerData = new FormData(p);
  console.log(playerData)

  const reqBody = Object.fromEntries(playerData)

  console.log(reqBody)


  fetch('/players', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(reqBody)
  })
  .then(() =>{
   console.log("Success!")
  });

})
