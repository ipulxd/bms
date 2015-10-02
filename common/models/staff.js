module.exports = function(Staff) {

  var lb = require('loopback');

  Staff.observe('before save', function updateTimestamp(ctx, next) {
    //var accessToken = lb.getCurrentContext().get('accessToken');
    //console.log(accessToken);
    if (ctx.instance) {
      ctx.instance.created = new Date();
    } else {
      ctx.data.lastUpdated = new Date();
    }
    next();
  });

  Staff.isAllowed = function (model, modelId, method, cb) {
    var ctx = lb.getCurrentContext();
    var accessToken = ctx.get('accessToken');
    var ACL = Staff.app.models.acl;

    ACL.checkAccessForToken(accessToken, model, modelId, method, function (err, allowed) {
      cb(null, allowed);
    });
  };

  Staff.remoteMethod('isAllowed', {
      description: 'Check if user allowed',
      accepts: [
        {arg: 'model', type: 'string', required: true, http: {source: 'query'}},
        {arg: 'modelId', type: 'string', required: true, http: {source: 'query'}},
        {arg: 'method', type: 'string', required: true, http: {source: 'query'}}
      ],
      returns: {arg: 'allowed', type: 'boolean'},
      http: {path: '/isAllowed', verb: 'get'}
    }
  );

  Staff.myRole = function (cb) {
    var ctx = lb.getCurrentContext();
    var accessToken = ctx.get('accessToken'); // userId = accessToken.userId
    var RoleMapping = Staff.app.models.roleMapping;

    RoleMapping.findOne({
      include: 'role',
      where: {
        and: [
          {principalType: RoleMapping.USER},
          {principalId: accessToken.userId}
        ]
      }
    }, function (err, rm) {
      var role = rm.toJSON().role.name;
      cb(null, role);
    });

  };

  Staff.remoteMethod('myRole', {
      description: 'Get role of logged in user',
      returns: {arg: 'role', type: 'string'},
      http: {path: '/myRole', verb: 'get'}
    }
  );

};
