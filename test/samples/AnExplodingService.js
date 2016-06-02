'use strict';

module.exports = function AnExplodingService() {

  var data = { };

  function initialize() {

    data.unknownProperty.value = '^_^';

  }

  initialize();

};
