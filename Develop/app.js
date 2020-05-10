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
    <div class="card employee-card">
    <div class="card-header">
        <h2 class="card-title">${eng.getName()}</h2>
        <h3 class="card-title"><i class="fas fa-user-graduate mr-2"></i>${eng.getRole()}</h3>
    </div>
    <div class="card-body">
        <ul class="list-group">
            <li class="list-group-item">ID: ${eng.getId()}</li>
            <li class="list-group-item">Email:  <a href="mailto:${eng.getEmail()}">${eng.getEmail()}</a></li>
            <li class="list-group-item">GitHub: <a href="https://github.com/${eng.getGithub()}" target="_blank">
            ${eng.getGithub()}</a></li>
   
        </ul>
    </div>
  </div>                     
    `;

    return text;
}
function divForIntern(intern){
    let text = `
    <div class="card employee-card">
    <div class="card-header">
        <h2 class="card-title">${intern.getName()}</h2>
        <h3 class="card-title"><i class="fas fa-user-graduate mr-2"></i>${intern.getRole()}</h3>
    </div>
    <div class="card-body">
        <ul class="list-group">
            <li class="list-group-item">ID: ${intern.getId()}</li>
            <li class="list-group-item">Email: <a href="mailto:${intern.getEmail()}">${intern.getEmail()}</a></li>
            <li class="list-group-item">School: ${intern.getSchool()}</li>
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
    <div class="card employee-card">
    <div class="card-header">
        <h2 class="card-title"> ${manager.getName()} </h2>
        <h3 class="card-title"><i class="fas fa-mug-hot mr-2"></i>${manager.getRole()} </h3>
    </div>
    <div class="card-body">
        <ul class="list-group">
            <li class="list-group-item">ID: ${manager.getId()}</li>
            <li class="list-group-item">Email: <a href="mailto:${manager.getEmail()}">${manager.getEmail()}</a></li>
            <li class="list-group-item">Office number: ${manager.getOfficeNumber()}</li>
        </ul>
    </div>
    </div>
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

<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 jumbotron mb-3 team-heading">
                <h1 class="text-center">My Team</h1>
            </div>
        </div>
    </div>
    <div class="container">
    <div class="row">
            <div class="team-area col-12 d-flex justify-content-center">
             ${managerDiv}
            </div>
        </div>    
        <div class="row">
            <div class="team-area col-12 d-flex justify-content-center">
             ${teamDivs}
            </div>
        </div>
    </div>
</body>

</html>

    `;
    return text;
}
buildTeam();

