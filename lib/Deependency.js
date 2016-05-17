'use strict';

const Container = require('./Container');

module.exports = function Deependency() {

  const DEFAULT_CONTAINER = 'Default';
  var _containers = { };

  this.container = function (containerName) {

    var container = getOrCreateContainerByName(containerName || DEFAULT_CONTAINER);

    return container;

  };

  var getOrCreateContainerByName = function (containerName) {

    var container = _containers[containerName];

    if (!container) {

      container = new Container();

      _containers[containerName] = container;

    }

    return container;

  };

};
