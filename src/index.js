const BASE_URL = "http://localhost:3000"
const PENDING_POLLS_URL = `${BASE_URL}/polls`
const CLOSED_POLLS_URL = `${BASE_URL}/polls/closed`
const LOGIN_URL = `${BASE_URL}/sessions`

document.addEventListener("DOMContentLoaded", () => {
    loggedIn()
})

// renders dashboard with current user's data
function renderDashboard() {
    console.log("Iam here")
    loggedIn()
    if (!(document.getElementById("loginForm") == null)) {
        document.getElementById("loginForm").remove();
  }
    document.querySelector(".main").style.display = "block";
    createOrRemoveForm();
    listPendingForms();
    logout();
}
// handles login process if user is not logged in and displays application content to logged in user 
function loggedIn() {
  fetch(`${LOGIN_URL}/logged_in`)
    .then(resp => resp.json())
    .then(function (json) {
      if (json.logged_in === false) {
        loggingIn()
      } else if (json.logged_in === true) {
        renderDashboard()
      }
    })
}

// creates login form
function createLoginForm() {
  document.querySelector(".main").style.display = "none";

  let div = document.createElement("div");
  div.id = "loginForm";
  div.style.textAlign ="center";
  div.style.marginTop = "100px"

  let title = document.createElement("h2");
  title.innerText = "Quick polls";
  title.style.display = "inline-block";
  title.style.marginLeft = "5px";
  let img = document.createElement("img");
  img.src = "assets/pollicon.svg";
  img.width = "40";
  img.style.paddingBottom = "10px";

  div.appendChild(img);
  div.appendChild(title);

  let form = document.createElement("form");
  form.action = "/sessions";
  form.method = "POST";
  let inputUsername = document.createElement("input");
  inputUsername.type = "text";
  inputUsername.name = "username";
  inputUsername.id = "username";
  inputUsername.placeholder = "Username.."
  let inputPassword = document.createElement("input");
  inputPassword.type = "password";
  inputPassword.name = "password";
  inputPassword.id = "password";
  inputPassword.placeholder = "Password.."

  let inputSubmit = document.createElement("input");
  inputSubmit.type = "submit";
  inputSubmit.value = "Submit";

  form.appendChild(inputUsername);
  form.appendChild(inputPassword);
  form.appendChild(inputSubmit);
  div.appendChild(form);

  document.querySelector(".bar").after(div);

  if (document.querySelectorAll("#loginForm").length > 1) {
    document.querySelector("#loginForm").remove();
  }

  return inputSubmit;
}

// handles fetch request for login action 
function loggingIn() {
  let submit = createLoginForm();
  submit.addEventListener("click", (e) => {
  
  e.preventDefault();
  let username = e.target.parentNode.querySelector("#username").value;
  let password = e.target.parentNode.querySelector("#password").value;

  let configObj = {
    method: "POST",
    headers: {
        "Content-Type": 'application/json',
        "Accept": "application/json",
    },
    body: JSON.stringify({
        username: username,
        password: password
    })
  }
  fetch(LOGIN_URL, configObj)
  .then(resp => resp.json())
  .then(
      function(json) {
          console.log(json)
        if (json.logged_in === false) {
          let p = document.createElement("p");
          p.innerHTML = json["message"];
          p.style.color = "red";
          document.querySelector("h2").after(p);
        } else if (json.logged_in === true) {
            renderDashboard();
        }
        
      }
  )
  })
  
}
// displays or hides creat poll form and dashboard based on user interaction
function createOrRemoveForm() {
  // hiding form for create poll by default
  const form = document.querySelector(".createForm");
  form.style.display = "none";

  // hiding dashboard and newsfeed when clicking on create poll
  const create = document.getElementById("createPoll");
  create.addEventListener("click", () => {
      const panel = document.querySelector(".panel");
      if (panel.style.display === "none") {
          panel.style.display = "block";
          document.querySelector("#createPoll h4").innerText = "Create Poll";
          form.style.display = "none";
        } else {
          panel.style.display = "none";
          document.querySelector("#createPoll h4").innerText = "Back to dashboard";
          form.style.display = "block";
        }
    })
}

class Poll {
  constructor(question, options, votes, end_date, vote_requirement) {
    this.question = question;
    this.options = options;
    this.votes = votes;
    this.end_date = end_date;
    this.vote_requirement = vote_requirement;
  }

  calculatePercentage() {
    const total = this.votes.length;
    const result = [];
    for (let i = 0; i < this.options.length; i++) {
      let optionData = [];
      let voteCount = 0;
      this.votes.forEach(v => {
        if (v.option_id === this.options[i].id) {
          voteCount += 1;
        }
      })
      optionData.push(this.options[i].description)
      optionData.push(Math.floor(voteCount / total * 100))
      result.push(optionData)
    }
    return result;
  }

}

function createNewDiagramFromPoll(poll) {
  let div = document.createElement("div");
  div.classList = "third extra";

  let title = document.createElement("h5");
  title.innerText = "Current results";
  title.style.fontWeight = "bold";

  for (let opt of poll.options) {

    let description = document.createElement("p");
    description.innerHTML = opt.description;

    let pollDiv = document.createElement("div");
    pollDiv.classList = "grey";

    let percentageDiv = document.createElement("div");
    let randomColor = ["red", "green", "orange", "blue", "yellow", "purple"][Math.floor((Math.random() * ["red", "green", "orange", "blue", "yellow", "purple"].length))]
    percentageDiv.classList = "container center padding " + randomColor;
    let percentageValue = poll.calculatePercentage().find(option => option[0] === opt.description)[1];
    percentageDiv.style.width = `${percentageValue}%`;
    percentageDiv.innerHTML = `${percentageValue}%`;
    
    pollDiv.appendChild(percentageDiv);
    div.appendChild(description);
    div.appendChild(pollDiv)
    
  }
  div.insertBefore(title, div.querySelector("p"));
  return div;
}

function createClickableOption(opt) {
  opt.addEventListener("click", (e) => {
    if (e.target.style.color === "green" || e.target.style.color === "grey") {
    e.target.style.color = "black";
    e.target.parentNode.parentNode.querySelectorAll("td").forEach(td => {
      td.style.color = "black"
    })
    
  } else {
    e.target.style.color = "green";
    e.target.parentNode.parentNode.querySelectorAll("td").forEach(td => {
      if (td.style.color != "green") {
      td.style.color = "grey"
      }
    })
  }
  })
}

function createNewVotingFormFromPoll(poll) {
  let div = document.createElement("div");
  div.classList ="twothird extra";
  let table = document.createElement("table");
  table.classList = "table striped white";
  let tbody = document.createElement("tbody");
  table.appendChild(tbody);
  div.appendChild(table);

  let question = document.createElement("h5");
  question.innerHTML = poll.question;
  question.style.fontWeight = 'bold';
  div.insertBefore(question, div.querySelector("table"));
  question.after(document.createElement("br"))

  for (let i = 0; i < poll.options.length; i++) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.innerHTML = poll.options[i].description;
    createClickableOption(td)
    tr.appendChild(td)
    tbody.appendChild(tr)
  }
  if (poll.vote_requirement != null) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.innerHTML = "Voting requirement:" + poll.vote_requirement;
    tr.appendChild(td)
    tbody.appendChild(tr)
  }

  if (poll.end_date != null) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.innerHTML = "End date: " + poll.end_date;
    tr.appendChild(td)
    tbody.appendChild(tr)
  }
  return div;
}

function listPendingForms() {
  document.getElementById("pendingPolls").addEventListener("click", () => {
    
    fetch(PENDING_POLLS_URL)
    .then(resp => resp.json())
    .then(function (json) {
      let rowPaddingDiv = document.querySelector(".row-padding")

      if (rowPaddingDiv.style.display === "none") {

        rowPaddingDiv.style.display = "block";
        document.querySelector("#pendingPolls h4").innerText = "Pending Polls";
        document.querySelectorAll(".extra").forEach(e => {
          e.remove();
        })

      } else {
        
        rowPaddingDiv.style.display = "none";
        document.querySelector("#pendingPolls h4").innerText = "Back to dashboard";

        for (let i = 0; i < json.length; i++) {
          let poll = new Poll(json[i].question, json[i].options, json[i].votes, json[i].end_date, json[i].vote_requirement);
          let parent = document.createElement("div")
          parent.classList = "row-padding extra";
          parent.style.margin = "0 -16px";
          let diagramDiv = createNewDiagramFromPoll(poll);
          parent.appendChild(diagramDiv);
          let votingFormDiv = createNewVotingFormFromPoll(poll);
          parent.appendChild(votingFormDiv);
          parent.style.marginBottom = "50px";
          document.querySelector(".panel").appendChild(parent);
        }
      }
      
    })
  })
}

function logout() {
    
    document.querySelector(".bar-item").addEventListener("click", ()=> {
        let configObj = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }
        fetch(`${LOGIN_URL}/logout`, configObj)
        .then(resp => resp.json())
        .then(
            function(json) {
            if (json.logged_out === true) {
                loggedIn()
            } else {
                console.log("Logout has failed")
            }
            })
    })
}