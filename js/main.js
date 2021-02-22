
import calculator from './calculator-obj.js';
import soundController from './sound-controller.js'

calculator.update();

const buttons = document.querySelectorAll('button');
const numberBtns = document.querySelectorAll('.number');
const operatorBtns = document.querySelectorAll('.operator');
const percentBtn = document.querySelector('.percent');
const negateBtn = document.querySelector('.negate');
const equalsBtn = document.querySelector('.equals');
const clearBtn = document.querySelector('.clear');
const deleteBtn = document.querySelector('.delete');


buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        highlightButton(e);
        playSound();
    });
});

function highlightButton(e) {
    buttons.forEach(button => button.classList.remove('focus'));
    e.target.classList.add('focus');
}

function playSound() {
    const audio = document.querySelector('audio');
    audio.volume = soundController.volume;
    audio.currentTime = 0;
    audio.play();
}

//  remove highlight when you click off the calculator
document.addEventListener('click', (e) => {
    if (e.path[0] === document.querySelector('.wrapper')) {
            buttons.forEach(button => button.classList.remove('focus'));
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

percentBtn.addEventListener('click', () => calculator.percent());
negateBtn.addEventListener('click', () => calculator.negate());
equalsBtn.addEventListener('click', () => calculator.operate());
clearBtn.addEventListener('click', () => calculator.clear());
deleteBtn.addEventListener('click', () => calculator.delete());


//  Keyboard Support
document.addEventListener('keydown', (e) => {
    const button = getPressedButton(e);
    button?.click();
    button?.classList.add('active');
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'm') return;

    const button = getPressedButton(e);
    button?.classList.remove('active');
})

function getPressedButton(e) {
    e.preventDefault();

    switch(e.key) {
        case 'Escape':
            return clearBtn;
        case 'Backspace':
            return deleteBtn;
        case 'm':
            soundController.toggleSound();
            break;
        default:
            return document.querySelector(`button[data-key="${e.key}"]`);
    }
}

