'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.writing = function writing() {
  var appName = utils.getAppName(this.config.path);
  var ctrlName = utils.ctrlName(this.name);
  var testScript = this.config.get('testScript');

  var context = {
    appName: appName,
    ctrlName: ctrlName
  };

  this.template('_controller.js', 'src/js/controllers/' + ctrlName + '.js', context);
  this.template('_spec.' + testScript, 'tests/unit/controllers/' + ctrlName + '.spec.' + testScript, context);
};