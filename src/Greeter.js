// Greeter.js
var config = require('./config.json');
var styles = require('./Greeter.css');

module.exports = function() {
  var greet = document.createElement('div');
  greet.className=styles.root;
  greet.textContent = config.greetText;
  return greet;
};
