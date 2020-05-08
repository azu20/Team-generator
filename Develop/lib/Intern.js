// TODO: Write code to define and export the Intern class.  HINT: This class should inherit from Employee.
const Employee = require("./Employee");

class Intern extends Employee {
    constructor(theName, theId, theEmail, theSchool) {
        super(theName, theId, theEmail); 
        this.school = theSchool;
     }
     getRole() {
        return "Intern"; 
    }
    getSchool(){
    return this.school;        
    }

}

module.exports = Intern;