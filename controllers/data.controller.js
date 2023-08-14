const { raw } = require('body-parser');
const { isCPF, isCNPJ } = require('validation-br')

exports.getData = (req,res) => {

    const fs = require('fs')
    const csv = require('csv-parser')
    const csv_data = [];

    fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => csv_data.push(formatData(data)))
    .on('end', () => {
        res.status(200).json(csv_data)
    });
}

function formatData(raw_data){
    
    let primary_total = parseInt(raw_data.vlTotal)

    raw_data.vlTotal = convertCurrency(raw_data.vlTotal)
    raw_data.vlPresta = convertCurrency(raw_data.vlPresta)
    raw_data.vlMora = convertCurrency(raw_data.vlMora)
    raw_data.vlMulta = convertCurrency(raw_data.vlMulta)
    raw_data.vlIof = convertCurrency(raw_data.vlIof)
    raw_data.vlAtual = convertCurrency(raw_data.vlAtual)
    raw_data.vlDescon = convertCurrency(raw_data.vlDescon)
    raw_data.nrCpfCnpj= validatePublicNumber(raw_data.nrCpfCnpj)
    raw_data.vlPresta = validateAmount(primary_total, raw_data.qtPrestacoes)
    raw_data.vlPresta = validateAmount(primary_total, raw_data.qtPrestacoes)
    raw_data.dtContrato = Date(raw_data.dtContrato)
    raw_data.dtVctPre = Date(raw_data.dtVctPre)

    return {...raw_data}
}

function convertCurrency(number){
    number = parseFloat((number)).toFixed(2);
    converted_value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
    return converted_value;
}



function validatePublicNumber(public_number){

    if(validateCpf(public_number) || validateCnpj(public_number)){
        return public_number;
    }
    
    return 'Invalid Value'
}

function validateCpf(cpf) {  

    if (!/[0-9]{11}/.test(cpf)) return false;
    if (cpf === "00000000000") return false;

    var sum = 0;

    for (var i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    var left = sum % 11;

    if (left === 10 || left === 11 || left < 2) {
        left = 0;
    } else {
        left = 11 - left;
    }

    if (left !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    sum = 0;

    for (var i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    left = sum % 11;

    if (left === 10 || left === 11 || left < 2) {
        left = 0;
    } else {
        left = 11 - left;
    }

    if (left !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;

}

function validateCnpj(cnpj) {

    var b = [ 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ]
    var c = String(cnpj).replace(/[^\d]/g, '')
    
    if(c.length !== 14)
        return false

    if(/0{14}/.test(c))
        return false

    for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);

    if(c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
        return false

    for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);

    if(c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
        return false

    return true

}

function validateAmount(total_value, qt_quotas){
    total = parseInt(total_value)
    quotas = parseInt(qt_quotas)

    if(quotas === 0){
        return total
    }

    let quota = total / quotas
    
    return convertCurrency(quota)
}
