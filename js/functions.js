//Init
let allFormVal = new Map();
let allFormIsOK = false;

const initDateInputs = () => {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => input.value = new Date(0).toISOString().substring(0, 10));
}

//Utils
const Alert = (message, status) => {

    if (status == 'error') allFormIsOK = false;

    toastr[`${status}`](message, `${status}`, {
        closeButton: true,
        tapToDismiss: false,
        positionClass: 'toast-top-right',
        rtl: false,
    });

};



//RegEX & Replace
const removeLeadingZeroes = value => parseFloat(value)

const removeLettersAndSC = () => {
    const textInputs = document.querySelectorAll('input[type="number"]');
    textInputs.forEach(input => input.addEventListener('input', () =>
        input.value = removeLeadingZeroes(input.value.replace(/[^0-9]+/g, ''))));
}

const removeSpecialCharacters = () => {
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => input.addEventListener('input', () =>
        input.value = input.value.replace(/[^a-zA-Z0-9]+/g, '')));
}

//Validations
const checkFormVals = action => {

    let trueVals = 0;

    for (let key in allFormVal) {
        if (allFormVal.hasOwnProperty(key)) {
            if (allFormVal[key] == true) {
                trueVals++;
            }
        }
    }

    (Object.entries(allFormVal).length) == trueVals ? allFormIsOK = true : allFormIsOK = false;

    console.log(Object.entries(allFormVal).length)
    console.log(trueVals)

    action;

    console.log(JSON.stringify(allFormVal))
    console.log(`allFormIsOK: ${allFormIsOK}`)

}

const setValidFormData = (inputStatus, action = () => { }) => {

    allFormVal[inputStatus[0]] = inputStatus[1];
    checkFormVals(action);

}

const invalidFormData = () => Alert('Por favor completar los datos correctamente.', 'error');
const isEmpty = value => (value == '' ? true : false);
const isNan = value => value == '' ? 0 : parseFloat(value);

const validate = (input, message) => {

    if (input.getAttribute('subtype')) {

        validateAge(input, message)

    } else {

        switch (input.type) {

            case 'date':
                validateDate(input, message)
                break;
    
            case 'file':
                validateFile(input, message)
                break;
    
            case 'number':
                validateNumber(input, message)
                break;
    
            case 'select':
                validateSelect(input, message)
                break;
    
            case 'text':
                validateText(input, message)
                break;
        
            default:
                break;
        }

    }

};

const validateNumber = (input, message) =>
    input.addEventListener('change', () =>
        setTimeout(() => isNan(input.value) < 1 ? setValidFormData([input.id, false], Alert(`${message} debe ser de al menos 1.`, 'error')) : setValidFormData([input.id, true], removeLeadingZeroes(input.value))), 100);

const validateAge = (input, message) =>
    input.addEventListener('change', () =>
        setTimeout(() => (isNan(input.value) < 1 || isNan(input.value) > 99) ?
            setValidFormData([input.id, false], Alert(`${message} debe encontrarse en un rango entre 1 y 99 años.`, 'error')) : setValidFormData([input.id, true], removeLeadingZeroes(input.value))), 100);

const validateText = (input, message) =>
    input.addEventListener('change', () =>
        setTimeout(() => (isEmpty(input.value) ? setValidFormData([input.id, false], Alert(`${message} no puede estar vacío.`, 'error')) : setValidFormData([input.id, true])), 100));

const validateDate = (input, message) =>
    input.addEventListener('input', () =>
        setTimeout(() => (input.value.length == 0 || input.value == '1970-01-01' ? setValidFormData([input.id, false], Alert(`${message} no tiene una fecha válida.`, 'error')) : setValidFormData([input.id, true])), 100));

const validateSelect = (input, message) =>
    input.addEventListener('change', () =>
        setTimeout(() => (input.value == '0' ? setValidFormData([input.id, false], Alert(`${message} debe tener una opción seleccionada.`, 'error')) : setValidFormData([input.id, true])), 100));

const validateFile = (input, message) =>
    input.addEventListener('change', () =>
        setTimeout(() => (input.files.length == 0 ? setValidFormData([input.id, false], Alert(`${message} debe de contener un archivo.`, 'error')) : setValidFormData([input.id, true])), 100));