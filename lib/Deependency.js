'use strict';

const Container                    = require('./Container');
const ContainerRegistrationService = require('./ContainerRegistrationService');
const ContainerResolutionService   = require('./ContainerResolutionService');
const ServiceDefinitionCatalog     = require('./ServiceDefinitionCatalog');
const DefinitionProviderCatalog    = require('./DefinitionProviderCatalog');
const InstanceDefinitionProvider   = require('./definitionProviders/InstanceDefinitionProvider');
const ModuleDefinitionProvider     = require('./definitionProviders/ModuleDefinitionProvider');

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

      var definitionProviderCatalog = new DefinitionProviderCatalog();
      definitionProviderCatalog.add(new InstanceDefinitionProvider());
      definitionProviderCatalog.add(new ModuleDefinitionProvider());

      var serviceDefinitionCatalog = new ServiceDefinitionCatalog();

      var containerRegistrationService = new ContainerRegistrationService(
        definitionProviderCatalog,
        serviceDefinitionCatalog
      );

      var containerResolutionService = new ContainerResolutionService(
        serviceDefinitionCatalog
      );

      container = new Container(containerRegistrationService, containerResolutionService);

      _containers[containerName] = container;

    }

    return container;

  };

};
