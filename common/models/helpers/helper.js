module.exports = function(Helper) {
  // Recurring period: Hourly, Daily -> using base word
  Helper.recurPeriod = function(cb) {
    cb(null, ['Hour', 'Day', 'Week', 'Month', '3Month', '6Month', 'Year']);
  };
  Helper.remoteMethod('recurPeriod', {http: {verb: 'get'}, returns: {type: 'array', root: true}});

  // Metering unit
  Helper.meterUnit = function(cb) {
    cb(null, ['m2', 'm3', 'KWH', 'unit', 'hour']);
  };
  Helper.remoteMethod('meterUnit', {http: {verb: 'get'}, returns: {type: 'array', root: true}});
};
