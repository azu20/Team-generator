// TODO: Write code to define and export the Engineer class.  HINT: This class should inherit from Employee.
const Employee = require("./Employee");
// const inquirer = require("inquirer"); 

class Engineer extends Employee {
    constructor(theName, theId, theEmail, theGitHub){
        super(theName, theId, theEmail);
        this.github = theGitHub;
    }
     
    getRole() {
         return "Engineer"; 
     }

    getGithub() {
        return this.github;
    }     

}

// askToAddEngineer() {
//     inquirer
//       .prompt([
//         {
//           name: "",
//           id: "",
//           email: "", 
//           gitHub: "",
//         }
//       ])
//       .then(val => {
       
     
//       });
//   };

module.exports = Engineer; 