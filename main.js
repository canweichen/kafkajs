
const ExcelJS = require('exceljs');
const CompareInvoiceBalanceController = require('./src/Controller/CompareInvoiceBalanceController');
const controller = new CompareInvoiceBalanceController();

main();
async function getTmsInvoice() {
    let data = await controller.compareInvoiceBalance();
    let invoiceNums = [];
    let invoices = [];
    for (let i = 0; i < data.length; i++) {
        let key = data[i]['InvoiceNum'];
        invoices[key] = data[i];
        invoiceNums.push(key);
        if(i === data.length - 1){
            console.log(data[i]['ARID'])
        }
    }
    return [invoiceNums, invoices];
}

async function getBnpInvoice(invoiceNumbers){
    const invoices = await controller.getBeiJingInvoiceBalance(invoiceNumbers);
    let bnpInvoice = [];
    for(const key in invoices){
        const invoice = invoices[key];
        const number = invoice['invoiceNumber'];
        if(bnpInvoice[number]){
            bnpInvoice[number].TotalAmount = invoice['totalAmount'];
            bnpInvoice[number].BNPBalance = invoice['balance'];
            bnpInvoice[number].BNPApply += invoice['receiptAmount'];
            bnpInvoice[number].ApplyDate += invoice['applyPostDate:'];
        }else{
            bnpInvoice[number] = {
                InvoiceNumber: number,
                TotalAmount: invoice['totalAmount'],
                BNPBalance: invoice['balance'],
                BNPApply: invoice['receiptAmount'],
                ApplyDate: invoice['applyPostDate:']
            };
        }
    }
    return bnpInvoice;
}

async function main(){
    const [invoiceNums, invoices] = await getTmsInvoice();
    const bnpInvoices = await getBnpInvoice(invoiceNums);
    for(const key in bnpInvoices){
        bnpInvoices[key]['TMSBalance'] = invoices[key]['InvoiceBalance'];
        bnpInvoices[key]['TMSAmount'] = invoices[key]['TotalAmount'];
        bnpInvoices[key]['InvoiceDate'] = invoices[key]['InvoiceDate'];
        bnpInvoices[key]['OrderID'] = invoices[key]['OrderID'];
        bnpInvoices[key]['ARID'] = invoices[key]['ARID'];
        bnpInvoices[key]['ComposerBalance'] = parseFloat(invoices[key]['InvoiceBalance']) == parseFloat(bnpInvoices[key]['BNPBalance']);
        bnpInvoices[key]['ComposerAmount'] = parseFloat(invoices[key]['TotalAmount']) == parseFloat(bnpInvoices[key]['TotalAmount']);

    }
    exports(bnpInvoices);
}

function exports(exportData){
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Summary');
    // 定义标题
    worksheet.addRow(['ARID', 'OrderID', 'InvoiceNum', 'InvoiceDate', 'TMSTotalAmount', 'TMSBalance',
        'BNPTotalAmount', 'BNPBalance', 'BNPApply', 'ComposerBalance', 'ComposerAmount']);
    for (const key in exportData) {
       let line = exportData[key];
       worksheet.addRow([
           line.ARID,
           line.OrderID,
           line.InvoiceNumber,
           line.InvoiceDate,
           line.TMSAmount,
           line.TMSBalance,
           line.TotalAmount,
           line.BNPBalance,
           line.BNPApply,
           line.ComposerBalance,
           line.ComposerAmount
       ]);
    }

    let filename = 'Summary'+Date.now()+'.xlsx';
    workbook.xlsx.writeFile(filename).then(() => {
        console.log('Excel file has been generated.');
    }).catch(error => {
        console.error(error);
    });

}

function callback(err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
}