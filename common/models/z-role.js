module.exports = function(role) {

  role.observe('before save', function (ctx, next) {
    if (ctx.instance)
      ctx.instance.created = new Date();
    else
      ctx.instance.modified = new Date();
    next();
  });

};
