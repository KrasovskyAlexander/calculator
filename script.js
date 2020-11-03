class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
    this.readyToReset = false;
  }

  delete() {
    if(this.currentOperand.toString().length==2 &&this.currentOperand.toString()[0]=='-'){
      this.currentOperand = '';
    }
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '' ) return;
    if (this.previousOperand !== '' && this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
    
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    let a;
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break
      case '-':
        computation = prev - current;
        break
      case '*':
        computation = prev * current;
        break
      case '÷':
        computation = prev / current;
        break
      case '^':
        if(current<1&&prev<0){
          a = Math.abs(prev);
          computation = -1*Math.pow(a,current);
          break;
        }
        computation = Math.pow(prev,current);
        break
      case '√':
        computation = Math.sqrt(current);
        break
      default:
        return;
    }
    this.readyToReset = true;
    a = (''+computation).split('');
    if(((a[0]=='0'&&a[1]=='.')||(a[1]=='0'&&a[2]=='.'&&a[0]=='-'))&&(a.length>10)){
      a.pop();
      computation = +(a.join(''));
    }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  square(sel){
    const current = parseFloat(this.currentOperand);
    let a = current+'';
     if(a[0]=='-'){
          let err = document.querySelector(sel);
          err.textContent ="Error:you can't take the square root of a negative number";
          setTimeout(()=>{
            err.textContent ='';
          },3000);
          this.currentOperand = current;
          return;
    }
    let computation = Math.sqrt(current);
    this.currentOperand = computation;
  }

  minus(){
    if (this.currentOperand === '' ) return;
    this.currentOperand = -1*this.currentOperand;
  }
  

  getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}


const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const squareButton = document.querySelector('[data-sqrt]');
const dataMinus = document.querySelector('[data-minus]');
const reference = document.querySelector('.reference-btn');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener("click", () => {

      if(calculator.previousOperand === "" &&
      calculator.currentOperand !== "" &&
  calculator.readyToReset) {
          calculator.currentOperand = "";
          calculator.readyToReset = false;
      }
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay();
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute();
  calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay();
})

squareButton.addEventListener('click',button => {
  calculator.square('.error');
  calculator.compute();
  calculator.updateDisplay();
});

dataMinus.addEventListener('click', button=>{
  calculator.minus();
  calculator.updateDisplay();
});

