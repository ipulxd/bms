'use strict';

var path = require('path');
var app = require(path.resolve(__dirname, '../server'));
var dataSource = app.dataSources.dsmain;
var models = dataSource.models;

//var orderMethods = [
//  {name: 'Kanvas'},
//  {name: 'Grosir'}
//];
//
//var paymentMethods = [
//  {name: 'Tunai - Cash'},
//  {name: 'Tunai - BG'},
//  {name: 'Tunai - Cek'},
//  {name: 'Kredit'}
//];
//
//var currencies = [
//  {code: 'Rp', name: 'Rupiah'}
//];
//
//var c1 = orderMethods.length;
//orderMethods.forEach(function (method) {
//  models.OrderMethod.findOrCreate(
//    {where: {name: method.name}},
//    method,
//    function (err, instance) {
//      if (err) return console.log(err);
//      console.log('Order method created: ', instance);
//      c1--;
//      if (c1 === 0) console.log('Done [Order Method]');
//    }
//  );
//});
//
//var c2 = paymentMethods.length;
//paymentMethods.forEach(function (method) {
//  models.PaymentMethod.findOrCreate(
//    {where: {name: method.name}},
//    method,
//    function (err, instance) {
//      if (err) return console.log(err);
//      console.log('Payment method created: ', instance);
//      c2--;
//      if (c2 === 0) console.log('Done [Payment Method]');
//    }
//  );
//});
//
//var c3 = currencies.length;
//currencies.forEach(function (currency) {
//  models.Currency.findOrCreate(
//    {where: {code: currency.code}},
//    currency,
//    function (err, instance) {
//      if (err) return console.log(err);
//      console.log('Currency created: ', instance);
//      c3--;
//      if (c3 === 0) console.log('Done [Currency]');
//    }
//  );
//});
