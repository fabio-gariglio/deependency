'use strict';

const Container                  = require('./Container');
const ServiceDefinitionCatalog   = require('./ServiceDefinitionCatalog');
const DefinitionProviderCatalog  = require('./DefinitionProviderCatalog');
const InstanceDefinitionProvider = require('./definitionProviders/InstanceDefinitionProvider');
const ModuleDefinitionProvider   = require('./definitionProviders/ModuleDefinitionProvider');

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

      var serviceDefinitionCatalog = new ServiceDefinitionCatalog();
      var definitionProviderCatalog  = new DefinitionProviderCatalog();

      definitionProviderCatalog.add(new InstanceDefinitionProvider());
      definitionProviderCatalog.add(new ModuleDefinitionProvider());

      container = new Container(definitionProviderCatalog, serviceDefinitionCatalog);

      _containers[containerName] = container;

    }

    return container;

  };

};
