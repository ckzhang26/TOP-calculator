
const calculator = {
    currNum: '0',
    currNumEntered: false,
    prevNum: '',
    operation: '',
    computed: false,
}

calculator.append = function(val) {
    if (this.currNum.length >= 15 && !this.computed) return;

    // don't add decimal if currNum already has a decimal
    // unless currNum is the result from a previous calculation
    if ((val === '.' && this.currNum.includes('.') && !this.computed)) {
        return;
    }

    // if current number is a result,
    // clear it before appending
    if (this.computed) {
        this.currNum = val === '.' ? '0' : '';
        this.computed = false;
    }

    // currNum initializes/resets with 0
    // if user has selected 0 as currNum, don't add more 0s
    // otherwise remove the initial 0 then append
    // unless value is a decimal then keep 0 and append
    if (this.currNum.startsWith('0')) {
        if (val === '0' && this.currNumEntered && !this.currNum.includes('.')) {
            return;
        }   else if (val !== '.' && !this.currNum.includes('.')) {
            this.currNum = this.currNum.slice(1);
        }
    }

    this.currNum += val;
    this.currNumEntered = true;
    this.update();
}

calculator.chooseOperation = function(op) {
    // if both prevNum and currNum are set and operation is clicked, do previous operation
    // then set new operation
    if (this.currNumEntered && this.prevNum) this.operate();
    
    this.operation = op;

    // if prevNum is not set but currNum is, set prevNum to currNum + operation
    // otherwise if prevNum is set, just change operation
    this.prevNum = (this.prevNum || this.currNum) + ' ' + this.operation;
    this.currNum = '0';
    this.currNumEntered = false;
    this.update();
}

calculator.percent = function() {
    this.currNum = (this.currNum / 100).toString();
    this.update();
}

calculator.negate = function() {
    if (this.currNum === '0') return;

    if (this.currNum.startsWith('-')) {
        this.currNum = this.currNum.slice(1);
    }   else {
        this.currNum = this.currNum.padStart(this.currNum.length + 1, '-');
    }

    this.update();
}

calculator.clear = function() {
    this.currNum = '0';
    this.currNumEntered = false;
    this.prevNum = '';
    this.operation = '';
    this.update();
}

calculator.delete = function() {
    this.currNum = this.currNum.slice(0, this.currNum.length - 1) || '0';
    this.update();
}

calculator.operate = function() {
    if (!this.currNumEntered || !this.prevNum) return;

    const firstNum = parseFloat(this.prevNum);
    const secondNum = parseFloat(this.currNum);

    let result;
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
            result = secondNum === 0 ? 'SNARKY ERROR MESSAGE' : firstNum / secondNum
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
    const prevNumDisplay = document.querySelector('#prev-num');
    const currNumDisplay = document.querySelector('#curr-num');

    // toLocaleString limits output to 3 decimal places
    // so only toLocaleString the whole number part
    // limit length of number so it fits in display

    if (this.prevNum && this.prevNum.includes('.')) {
        const prevNumArr = this.prevNum.split('.');
        const wholeNum = parseFloat(prevNumArr[0]).toLocaleString();
        const decimals = prevNumArr[1];

        prevNumDisplay.innerText = wholeNum + '.' + decimals;

    }   else if (this.prevNum) {
        prevNumDisplay.innerText = parseFloat(this.prevNum).toLocaleString() 
                                    + ' ' 
                                    + this.operation;
    }   else {
        prevNumDisplay.innerText = '';
    }

    if (this.currNum.includes('.')) {
        if (/e[+-]/.test(this.currNum)) {
            currNumDisplay.innerText = parseFloat(this.currNum).toExponential(8);
        }   else {
            const currNumArr = this.currNum.split('.');
            const wholeNum = parseFloat(currNumArr[0]).toLocaleString();
            const decimals = currNumArr[1];
    
            currNumDisplay.innerText = wholeNum + '.' + decimals;
        }
    }   else if (this.currNum === 'SNARKY ERROR MESSAGE') {
        currNumDisplay.innerText = this.currNum;
        this.currNum = '0';
    }   else if (this.currNum.length > 16) {
        currNumDisplay.innerText = parseFloat(this.currNum).toExponential(8);
    }   else {
        currNumDisplay.innerText = parseFloat(this.currNum).toLocaleString();
    }
}


export default calculator;