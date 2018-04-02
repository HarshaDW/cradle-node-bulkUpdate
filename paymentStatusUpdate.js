/**
 * Created by harshaw on 23/01/17.
 * NodeScript to Bulk Update Couchdb document
 */
let cradle = require("cradle");
let path = require('path');
let config = require("./config.json");
let excelConfig = require("./data.json");
let merchantId = config.merchantId;
let fs = require('fs');
let db = new(cradle.Connection)(config.host, config.port, {
    auth: { username: config.userName, password: config.password}
}).database(merchantId);



let dataArray = excelConfig;
let docs = {};
let documentIdSet = [];

for (let i = 0 ; i < dataArray.length; i++) {
    documentIdSet.push(dataArray[i].documentId);
    //console.log(documentIdSet);

}

db.get(documentIdSet, function (err, doc) {
    if (err) {
        console.log(err);
    } else {
        for(let i = 0 ; i < doc.length; i++) {
            docs[doc[i].id] = doc[i].doc;
        }
        updateDocuments(docs);
    }
});
console.log('\n');
let updateDocuments = function (obj) {
    for (let i = 0; i < dataArray.length; i++) {
        let docToUpdate = docs[dataArray[i].documentId];
        let payments = docToUpdate.documentObject.payments;
        for (let payment = 0; payment < payments.length; payment++) {
            if (payments[payment].id == dataArray[i].paymentId) {
                payments[payment].paymentStatus = dataArray[i].paymentStatus;
                //payments[payment].transactionId = dataArray[i].transactionId;

                console.log('Saving backup for document : ' + docToUpdate.documentObject.id + '\n');
                let backUpMerchantId = docToUpdate.documentObject.merchantId;
                let file = path.join(__dirname,'./BackupDocuments/'+backUpMerchantId+'_backup', docToUpdate.documentObject.id);
                if (!fs.existsSync('./BackupDocuments/'+backUpMerchantId+'_backup')){
                    fs.mkdirSync('./BackupDocuments/'+backUpMerchantId+'_backup');
                }
                fs.writeFileSync(file, JSON.stringify(docToUpdate));
                console.log('Updating Payment Object = ' + payments[payment].id + '\n');
            }
        }
    }
    documentsToSave(obj);
}

let documentsToSave = function (object){
    let bulkObjects = [];
    for(let obj in object){
        if(object.hasOwnProperty(obj)){
            bulkObjects.push(object[obj]);
        }
    }
    db.save(bulkObjects, function(err, res){
        if (err) {
            console.log("Document Was Not Saved. Error : " + err);
        } else {
            console.log(res);
            console.log("Documents were Saved");
        }
    });
}
