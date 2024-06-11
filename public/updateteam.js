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

  const teamData = new FormData(p);
  console.log(teamData)

  const reqBody = Object.fromEntries(teamData)

  console.log(reqBody)


  fetch('/teams/'+window.location.pathname.split("/").pop(), {
    method: 'PATCH',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(reqBody)
  })
  .then(() =>{
    console.log('Success!');
  });

})
