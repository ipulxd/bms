module.exports = function(Unit) {

  var lb = require('loopback');

  Unit.observe('before save', function updateTimestamp(ctx, next) {
    var cc = lb.getCurrentContext();
    var accessToken = cc.get('accessToken');
    if (ctx.instance) {
      ctx.instance.created = new Date();
      ctx.instance.createdBy = accessToken.userId;
    } else {
      ctx.data.updated = new Date();
      ctx.data.updatedBy = accessToken.userId;
    }
    next();
  });

};
