var lb = require('loopback');

module.exports = function(Company) {

  Company.observe('before save', function (ctx, next) {
    var cc = lb.getCurrentContext();
    //console.log(cc);
    var accessToken = cc.get('accessToken');
    //console.log(accessToken);
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
