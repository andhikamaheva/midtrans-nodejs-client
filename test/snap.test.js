'use strict';

const expect = require('chai').expect;
const midtransClient = require('./../index.js');
const Snap = midtransClient.Snap;
const cons = require('./sharedConstants');

describe('Snap.js',()=> {

  it('able to start test',()=>{
    expect(true).to.be.true
  })

  it('class should be working',()=>{
    let snap = new Snap();
    expect(snap instanceof Snap).to.be.true;
    expect(typeof(snap.createTransaction)).to.be.equal('function');
    expect(typeof(snap.createTransactionToken)).to.be.equal('function');
    expect(typeof(snap.createTransactionRedirectUrl)).to.be.equal('function');
    expect(snap.apiConfig.get().serverKey).to.be.a('string');
    expect(snap.apiConfig.get().clientKey).to.be.a('string');
  })

  it('able to create transaction simple param',()=>{
    let snap = new Snap(generateConfig());
    return snap.createTransaction(generateParamMin())
      .then((res)=>{
        expect(res).to.have.property('token');
        expect(res.token).to.be.a('string');
        expect(res).to.have.property('redirect_url');
        expect(res.token).to.be.a('string');
      })
  })

  it('able to create transaction max param',()=>{
    let snap = new Snap(generateConfig());
    return snap.createTransaction(generateParamMax())
      .then((res)=>{
        expect(res).to.have.property('token');
        expect(res.token).to.be.a('string');
        expect(res).to.have.property('redirect_url');
        expect(res.token).to.be.a('string');
      })
  })

  it('able to create transaction token',()=>{
    let snap = new Snap(generateConfig());
    return snap.createTransactionToken(generateParamMin())
      .then((token)=>{
        expect(token).to.be.a('string');
      })
  })

  it('able to create transaction redirect_url',()=>{
    let snap = new Snap(generateConfig());
    return snap.createTransactionRedirectUrl(generateParamMin())
      .then((redirect_url)=>{
        expect(redirect_url).to.be.a('string');
      })
  })

  it('fail to status transaction 404 with non exists order_id',()=>{
    let snap = new Snap(generateConfig());
    return snap.transaction.status('non exists order_id')
      .then((res)=>{
      })
      .catch((e)=>{
        expect(e.message).to.includes('404');
      })
  })

  // it('able to status transaction',()=>{
  //   let snap = new Snap(generateConfig());
  //   return snap.transaction.status('node-midtransclient-test-1540974864')
  //     .then((res)=>{
  //       expect(res.status_code).to.be.a('string');
  //       expect(res.status_code).to.be.equals('201');
  //       expect(res.transaction_status).to.be.a('string');
  //       expect(res.transaction_status).to.be.equals('pending');
  //     })
  // })

  it('able to re-set serverKey via setter',()=>{
    let snap = new Snap({clientKey:'abc'});
    expect(snap.apiConfig.get().serverKey).to.be.equals('');
    expect(snap.apiConfig.get().clientKey).to.be.equals('abc');
    expect(snap.apiConfig.get().isProduction).to.be.false;
    snap.apiConfig.set({serverKey:cons.serverKey});
    expect(snap.apiConfig.get().serverKey).to.be.equals(cons.serverKey);
    expect(snap.apiConfig.get().clientKey).to.be.equals('abc');
    expect(snap.apiConfig.get().isProduction).to.be.false;
  })

  it('able to re-set serverKey via property',()=>{
    let snap = new Snap({clientKey:'abc'});
    expect(snap.apiConfig.get().serverKey).to.be.equals('');
    expect(snap.apiConfig.get().clientKey).to.be.equals('abc');
    expect(snap.apiConfig.get().isProduction).to.be.false;
    snap.apiConfig.serverKey = cons.serverKey;
    expect(snap.apiConfig.get().serverKey).to.be.equals(cons.serverKey);
    expect(snap.apiConfig.get().clientKey).to.be.equals('abc');
    expect(snap.apiConfig.get().isProduction).to.be.false;
  })

  it('fail to status transaction 401 with no serverKey',()=>{
    let config = generateConfig();
    config.serverKey = '';
    let snap = new Snap(config);
    return snap.transaction.status('non exists order_id')
      .then((res)=>{
      })
      .catch((e)=>{
        expect(e.message).to.includes('401');
      })
  })

  it('fail to create transaction 401 with no serverKey',()=>{
    let config = generateConfig();
    config.serverKey = '';
    let snap = new Snap(config);
    return snap.createTransaction(generateParamMin())
      .then((res)=>{
      })
      .catch((e)=>{
        expect(e.message).to.includes('401');
      })
  })

  it('fail to create transaction 400 with no param',()=>{
    let config = generateConfig();
    let snap = new Snap(config);
    return snap.createTransaction()
      .then((res)=>{
      })
      .catch((e)=>{
        expect(e.message).to.includes('400');
      })
  })

  it('fail to create transaction with zero gross_amount',()=>{
    let config = generateConfig();
    let snap = new Snap(config);
    let param = generateParamMin();
    param.transaction_details.gross_amount = 0;
    return snap.createTransaction()
      .then((res)=>{
      })
      .catch((e)=>{
        expect(e.message).to.includes('400');
      })
  })

})

function generateConfig(){
  return {
    isProduction: false,
    serverKey: cons.serverKey,
    clientKey: cons.clientKey
  }
}

function generateParamMin(){
  return {
    "transaction_details": {
      "order_id": "node-midtransclient-test-"+Math.round((new Date()).getTime() / 1000),
      "gross_amount": 200000
    }, "credit_card":{
      "secure" : true
    }
  }
}

function generateParamMax(){
  return {
    "transaction_details": {
      "order_id": "node-midtransclient-test-"+Math.round((new Date()).getTime() / 1000),
      "gross_amount": 10000
    },
    "item_details": [{
      "id": "ITEM1",
      "price": 10000,
      "quantity": 1,
      "name": "Midtrans Bear",
      "brand": "Midtrans",
      "category": "Toys",
      "merchant_name": "Midtrans"
    }],
    "customer_details": {
      "first_name": "John",
      "last_name": "Watson",
      "email": "test@example.com",
      "phone": "+628123456",
      "billing_address": {
        "first_name": "John",
        "last_name": "Watson",
        "email": "test@example.com",
        "phone": "081 2233 44-55",
        "address": "Sudirman",
        "city": "Jakarta",
        "postal_code": "12190",
        "country_code": "IDN"
      },
      "shipping_address": {
        "first_name": "John",
        "last_name": "Watson",
        "email": "test@example.com",
        "phone": "0 8128-75 7-9338",
        "address": "Sudirman",
        "city": "Jakarta",
        "postal_code": "12190",
        "country_code": "IDN"
      }
    },
    "enabled_payments": ["credit_card", "mandiri_clickpay", "cimb_clicks","bca_klikbca", "bca_klikpay", "bri_epay", "echannel", "indosat_dompetku","mandiri_ecash", "permata_va", "bca_va", "bni_va", "other_va", "gopay","kioson", "indomaret", "gci", "danamon_online"],
    "credit_card": {
      "secure": true,
      "channel": "migs",
      "bank": "bca",
      "installment": {
        "required": false,
        "terms": {
          "bni": [3, 6, 12],
          "mandiri": [3, 6, 12],
          "cimb": [3],
          "bca": [3, 6, 12],
          "offline": [6, 12]
        }
      },
      "whitelist_bins": [
        "48111111",
        "41111111"
      ]
    },
    "bca_va": {
      "va_number": "12345678911",
      "free_text": {
        "inquiry": [
          {
            "en": "text in English",
            "id": "text in Bahasa Indonesia"
          }
        ],
        "payment": [
          {
            "en": "text in English",
            "id": "text in Bahasa Indonesia"
          }
        ]
      }
    },
    "bni_va": {
      "va_number": "12345678"
    },
    "permata_va": {
      "va_number": "1234567890",
      "recipient_name": "SUDARSONO"
    },
    "callbacks": {
      "finish": "https://demo.midtrans.com"
    },
    "expiry": {
      "start_time": ((new Date).getFullYear()+1)+"-12-20 18:11:08 +0700",
      "unit": "minutes",
      "duration": 1
    },
    "custom_field1": "custom field 1 content",
    "custom_field2": "custom field 2 content",
    "custom_field3": "custom field 3 content"
  }
}