'use strict';

var path = require('path');
var app = require(path.resolve(__dirname, '../server'));
var dataSource = app.dataSources.dsmain;
var Staff = dataSource.models.Staff;
var Role = dataSource.models.role;
var RoleMapping = dataSource.models.roleMapping;

var defaultUsers = [
  {email: 'system@local.sys', password: 'system212', name: 'System', active: true, sysAccount: true},
  {email: 'saiful.anwar@gmail.com', password: 'saiful212', name: 'Saiful Anwar', active: true, sysAccount: true},
  {email: 'sangbima.net@gmail.com', password: 'khairil212', name: 'Khairil', active: true, sysAccount: true},
  {email: 'abinyafatwa@gmail.com', password: 'ponco212', name: 'Ponco Sentono', active: true, sysAccount: true},
  {email: 'sipras@gmail.com', password: 'sipras212', name: 'Prasetyo Wardoyo', active: true, sysAccount: true},
  {email: 'admin@local.sys', password: 'admin', name: 'Admin',  active: true, sysAccount: false},
  {email: 'operator@local.sys', password: 'operator', name: 'Operator',  active: true, sysAccount: false}
];

var defaultRoles = [
  {name: 'System', description: 'System Account'},
  {name: 'Administrator', description: 'Administrator'},
  {name: 'Operator', description: 'Operator'}
];

Staff.create(defaultUsers, function (err, users) {
  if (err) console.log(err);
  Role.create(defaultRoles, function (err, roles) {
    if (err) console.log(err);

    // map default role to user
    // user 0-4 to role 0
    roles[0].principals.create({
      principalType: RoleMapping.USER,
      principalId: users[0].id
    }, function(err, principal) {
      if (err) console.log(err);
    });
    roles[0].principals.create({
      principalType: RoleMapping.USER,
      principalId: users[1].id
    }, function(err, principal) {
      if (err) console.log(err);
    });
    roles[0].principals.create({
      principalType: RoleMapping.USER,
      principalId: users[2].id
    }, function(err, principal) {
      if (err) console.log(err);
    });
    roles[0].principals.create({
      principalType: RoleMapping.USER,
      principalId: users[3].id
    }, function(err, principal) {
      if (err) console.log(err);
    });
    roles[0].principals.create({
      principalType: RoleMapping.USER,
      principalId: users[4].id
    }, function(err, principal) {
      if (err) console.log(err);
    });
    // user 5 to role 1
    roles[1].principals.create({
      principalType: RoleMapping.USER,
      principalId: users[5].id
    }, function(err, principal) {
      if (err) console.log(err);
    });
    // user 6 to role 2
    roles[2].principals.create({
      principalType: RoleMapping.USER,
      principalId: users[6].id
    }, function(err, principal) {
      if (err) console.log(err);
    });

  });
});
