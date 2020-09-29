const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

async function promptManager() {
    return await inquirer.prompt([
        {
            type: "input",
            name: "Name",
            message: "What's your name?"
        },  
        {
            type: "input",
            name: "Id",
            message: "What's your Manager ID?"
        },
        {
            type: "input",
            name: "Email",
            message: "What's your email?"
        },
        {
            type: "input",
            name: "OfficeNumber",
            message: "What's your office number?"
        }
    ]);
}

async function promptForTypeOfEmployee() {
    return await inquirer.prompt([
        {
            type: 'list',
            name: 'typeOfEmployee',
            message: 'Who would you like to add to your team?',
            choices: [
                `Engineer`,
                `Intern`,
                'Done'
            ]
        }
    ]);
}

async function promptForEngineer() {
 
    return await inquirer.prompt([
        {
            type: "input",
            name: "Name",
            message: "What's the engineer's name?"
        },
        {
            type: "input",
            name: "Id",
            message: "What's the engineer's Id?"
        },
        {
            type: "input",
            name: "Email",
            message: "What's the engineer's email?"
        },
        {
            type: "input",
            name: "GitHub",
            message: "What's the engineer's GitHub username?"
        }
    ]); 
};

async function promptForIntern() {

    return await inquirer.prompt([
        {
            type: "input",
            name: "Name",
            message: "What's the intern's name?"
        },
        {
            type: "input",
            name: "Id",
            message: "What's the intern's Id?"
        },
        {
            type: "input",
            name: "Email",
            message: "What's the intern's email?"
        },
        {
            type: "input",
            name: "School",
            message: "What's the intern's School?"
        }
    ]); 
}

function divForEngineer(eng){

    let text = ` 
    <br>
    <div class="card employee-card" style="background-color: #6CBF84">
    <div class="card-header">
        <h2 class="card-title">${eng.getName()}</h2>
        <h3 class="card-title"><i class="fas fa-user-graduate mr-2"></i>${eng.getRole()}</h3>
    </div>
    <div class="card-body">
        <ul class="list-group">
            <li class="list-group-item" style="background-color: #F4E8C1">ID: ${eng.getId()}</li>
            <li class="list-group-item" style="background-color: #F4E8C1">Email:  <a href="mailto:${eng.getEmail()}">${eng.getEmail()}</a></li>
            <li class="list-group-item" style="background-color: #F4E8C1">GitHub: <a href="https://github.com/${eng.getGithub()}" target="_blank">
            ${eng.getGithub()}</a></li>
   
        </ul>
    </div>
  </div>            
    `;

    return text;
}
function divForIntern(intern){
    let text = `
    <br>
    <div class="card employee-card" style="background-color: #1f7fbb">
    <div class="card-header">
        <h2 class="card-title">${intern.getName()}</h2>
        <h3 class="card-title"><i class="fas fa-user-graduate mr-2"></i>${intern.getRole()}</h3>
    </div>
    <div class="card-body">
        <ul class="list-group">
            <li class="list-group-item" style="background-color: #F4E8C1">ID: ${intern.getId()}</li>
            <li class="list-group-item" style="background-color: #F4E8C1">Email: <a href="mailto:${intern.getEmail()}">${intern.getEmail()}</a></li>
            <li class="list-group-item" style="background-color: #F4E8C1">School: ${intern.getSchool()}</li>
        </ul>
    </div>
  </div>
    `;

    return text;
}
function generateAllHtml(manager, employees){
        //create a single html page using the data passes in for the team
        // that has a div for each eompleee and the manager 

        let teamDivs = Array.from([]);

        employees.forEach(emp => {

            if(emp.getRole() === 'Intern'){
                let div = divForIntern(emp);
                teamDivs.push(div);
            }
            else if(emp.getRole() === 'Engineer'){
                let div = divForEngineer(emp);
                teamDivs.push(div);
            }else{
                console.log("Something went wrong!");
            }

        });
        const managerDiv = divForManager(manager);

        let finalHtml =  htmlTemplate(managerDiv,teamDivs);
        
        return finalHtml;
        
};

async function buildTeam() {

    //prompt for manager
    //keep on prompiting
    // if they want more team members
    //    if they do, then promt agin for that specific type of team member
    //    if they dont then we're done, so get out of the prompting
    //  generate the team HTML page using all the info gathered in the 'loop'

    let m = await promptManager();
    let manager = new Manager(m.Name,m.Id,m.Email,m.OfficeNumber);
    let employees = Array.from([]);

    while (true) {
        let e = await promptForTypeOfEmployee();
               
        if (e.typeOfEmployee === 'Engineer') {
            let r = await promptForEngineer();
            let engineer = new Engineer(r.Name,r.Id,r.Email,r.GitHub);
            employees.push(engineer);
        } else if (e.typeOfEmployee === 'Intern') {
            let r = await promptForIntern();
            let intern = new Intern(r.Name,r.Id,r.Email,r.School);
            employees.push(intern);
        } else {
            break;
        }
    }

    let finalHtml = generateAllHtml(manager, employees);
    

    writeFileAsync(outputPath, finalHtml).then(() => {
        console.log("Your team page has been created.");
      });

    console.log("Done generating the team");
}

function divForManager(manager){
    const text = `
    <div class="card employee-card" style="background-color: #F26968">
    <div class="card-header">
        <h2 class="card-title"> ${manager.getName()} </h2>
        <h3 class="card-title"><i class="fas fa-mug-hot mr-2"></i>${manager.getRole()} </h3>
    </div>
    <div class="card-body">
        <ul class="list-group">
            <li class="list-group-item" style="background-color: #F4E8C1">ID: ${manager.getId()}</li>
            <li class="list-group-item" style="background-color: #F4E8C1">Email: <a href="mailto:${manager.getEmail()}">${manager.getEmail()}</a></li>
            <li class="list-group-item" style="background-color: #F4E8C1">Office number: ${manager.getOfficeNumber()}</li>
        </ul>
    </div>
    </div>
    <br><br>
    `;
    return text;
}

function htmlTemplate(managerDiv,teamDivs){
    const text = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>My Team</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <script src="https://kit.fontawesome.com/c502137733.js"></script>
</head>

<body style="background-color: #F2AD9F" >
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 jumbotron mb-3 team-heading" style="background-color: #6CBF84">
                <h1 class="text-center" style=" background-color: #F7DFD4, font-size: 28px, font-weight: bold ">My Team</h1>
            </div>
        </div>
    </div>
    <div class="container">
    <div class="row">
            <div class="team-area col-12 d-flex justify-content-center" >
             ${managerDiv}
            </div>
        </div>
        <hr>    
        <br>
        <div class="row">
            <div class="team-area col-12 d-flex justify-content-center">
             ${teamDivs}
            </div>
        </div>
        <br>
        <div class="text-center">
            <img class="team-picture"
                src="https://images.unsplash.com/photo-1582005450386-52b25f82d9bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
                alt="Grapefruit slice atop a pile of other slices" width="650" height="450">
        </div>
        <br><br>
    </div>
</body>

</html>

    `;
    return text;
}
buildTeam();

