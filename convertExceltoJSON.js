/**
 * Created by harshaw on 23/01/17.
 * NodeScript to Bulk Update Couchdb document paymentStatus/transactionId
 * covertExceltoJSON script is used to covert data from excel to a JSON Object
 *
 */

var csv2json = require('csv2json');
var fs = require('fs');

fs.createReadStream('excelData.csv')
    .pipe(csv2json({
        // Defaults to comma.
        separator: ','
    }))
    .pipe(fs.createWriteStream('data.json'));

//console.log('\n'+'Excel Document Coverted To JSON file. Please execute paymentStatusUpdate.js now'+'\n');