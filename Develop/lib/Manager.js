// TODO: Write code to define and export the Manager class. HINT: This class should inherit from Employee.
const Employee = require("./Employee");

class Manager extends Employee{
    constructor(theName, theId, theEmail, theOfficeNumber) {
       super(theName, theId, theEmail); 
       this.officeNumber = theOfficeNumber;
    }

    getRole() {
        return "Manager"; 
    }

    getOfficeNumber() {
        return this.officeNumber; 
    }

};

module.exports = Manager;