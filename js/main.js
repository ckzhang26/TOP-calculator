
const calculator = {
    currNum : '0',
    prevNum : '',
    operation : '',
    computed : false,
}

calculator.append = function(val) {
    if (val === '.' && this.currNum.includes('.') && !this.computed) {
        return;
    }

    if (this.currNum === '0') {
        if (val === '0') return;

        // if append value is a decimal keep 0 and append,
        // otherwise remove 0 then append
        if (val !== '.') this.currNum = '';
    }

    // if current number is a result,
    // clear it before appending
    if (this.computed) {
        this.currNum = val === '.' ? '0' : '';
        this.computed = false;
    }

    this.currNum += val;
    this.update();
}

calculator.chooseOperation = function(op) {
    // if both prevNum and currNum are set and operation is clicked, do previous operation
    // then set new operation
    if (this.currNum && this.prevNum) this.operate();
    
    this.operation = op;

    // if prevNum is not set but currNum is, set prevNum to currNum + operation
    // otherwise if prevNum is set, just change operation
    this.prevNum = (this.prevNum || this.currNum) + ' ' + this.operation;
    this.currNum = '0';
    this.update();
}

calculator.negate = function() {
    if (this.currNum === '0') return;

    if (this.currNum.startsWith('-')) {
        this.currNum = this.currNum.slice(1);
    }  else {
        this.currNum = this.currNum.padStart(this.currNum.length + 1, '-');
    }

    this.update();
}

calculator.clear = function() {
    this.currNum = '0';
    this.prevNum = '';
    this.operation = '';
    this.update();
}

calculator.delete = function() {
    this.currNum = this.currNum.slice(0, this.currNum.length - 1) || '0';
    this.update();
}

calculator.operate = function() {
    if (!this.currNum || !this.prevNum) return;

    let result;
    const firstNum = parseFloat(this.prevNum);
    const secondNum = parseFloat(this.currNum);
    switch(this.operation) {
        case '+':
            result = firstNum + secondNum;
            break;
        case '-':
            result = firstNum - secondNum;
            break;
        case '*':
            result = firstNum * secondNum;
            break;
        case '÷':
            if (secondNum === 0) return alert('STOP: CANNOT DIVIDE BY ZERO');
            result = firstNum / secondNum;
            break;
        default: 
            break;
    }

    this.currNum = result.toString();
    this.prevNum = '';
    this.computed = true;
    this.update();
}

calculator.update = function() {
    // toLocaleString limits output to 3 decimal places
    // so only toLocaleString the whole number part
    // if number is empty parseFloat will return NaN

    if (this.prevNum && this.prevNum.includes('.')) {
        const prevNumArr = this.prevNum.split('.');
        prevNumDisplay.innerText = parseFloat(prevNumArr[0]).toLocaleString() 
                                    + '.' + prevNumArr[1];
    }   else if (this.prevNum) {
        prevNumDisplay.innerText = parseFloat(this.prevNum).toLocaleString() 
                                    + ' ' + this.operation;
    }   else {
        prevNumDisplay.innerText = '';
    }

    if (this.currNum.includes('.')) {
        const currNumArr = this.currNum.split('.');
        currNumDisplay.innerText = parseFloat(currNumArr[0]).toLocaleString() + '.' + currNumArr[1];
    }  else if (!isNaN(parseFloat(this.currNum))) {
        currNumDisplay.innerText = parseFloat(this.currNum).toLocaleString();
    }   else {
        currNumDisplay.innerText = this.currNum;
    }
}


const buttons = document.querySelectorAll('button');
const prevNumDisplay = document.querySelector('#prev-num');
const currNumDisplay = document.querySelector('#curr-num');
const numberBtns = document.querySelectorAll('.number');
const operatorBtns = document.querySelectorAll('.operator');
const negateBtn = document.querySelector('.negate');
const equalsBtn = document.querySelector('.equals');
const clearBtn = document.querySelector('.clear');
const deleteBtn = document.querySelector('.delete');


buttons.forEach(button => {
    button.addEventListener('click', highlightButton);
});

function highlightButton(e) {
    buttons.forEach(button => button.style.border = '')
    e.target.style.border = '5px solid green';
}

// remove highlight when you click off the calculator
document.addEventListener('click', (e) => {
    if (e.path[0] === document.querySelector('.wrapper')) {
        buttons.forEach(button => button.style.border = '');
    }
});


numberBtns.forEach(numberBtn => {
    numberBtn.addEventListener('click', (e) => {
        calculator.append(e.target.innerText);
    })
});

operatorBtns.forEach(operatorBtn => {
    operatorBtn.addEventListener('click', (e) => {
        calculator.chooseOperation(e.target.innerText) 
    });
});

negateBtn.addEventListener('click', () => calculator.negate());
equalsBtn.addEventListener('click', () => calculator.operate());
clearBtn.addEventListener('click', () => calculator.clear());
deleteBtn.addEventListener('click', () => calculator.delete());


document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === 'Space') e.preventDefault();

    const button = e.key === 'Backspace' ? 
                    document.querySelector('button[data-key="Delete"]')
                    : document.querySelector(`button[data-key="${e.key}"]`);

    button?.click();
})



// initialize calculator with currNum as 0 on load
calculator.update();