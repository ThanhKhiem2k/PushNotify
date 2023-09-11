// GlobalVariable.js
class GlobalVariable {
    constructor() {
      this.myVariable = '';
    }
  
    get() {
      return this.myVariable;
    }
  
    set(value) {
      this.myVariable = value;
    }
  }
  
  export default new GlobalVariable();
  