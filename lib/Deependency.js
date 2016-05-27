'use strict';

const Container                    = require('./Container');
const ContainerRegistrationService = require('./ContainerRegistrationService');
const ContainerResolutionService   = require('./ContainerResolutionService');
const ServiceDefinitionCatalog     = require('./ServiceDefinitionCatalog');
const DefinitionProviderCatalog    = require('./DefinitionProviderCatalog');
const InstanceDefinitionProvider   = require('./definitionProviders/InstanceDefinitionProvider');
const ModuleDefinitionProvider     = require('./definitionProviders/ModuleDefinitionProvider');
const ModuleEnumerator             = require('./facilities/ModuleEnumerator');

module.exports = function Deependency() {

  const DEFAULT_CONTAINER = 'Default';
  const instanceDefinitionProvider = new InstanceDefinitionProvider();
  const moduleDefinitionProvider   = new ModuleDefinitionProvider();

  var _containers = { };

  var _definitionProviderCatalog = new DefinitionProviderCatalog([
    moduleDefinitionProvider,
    instanceDefinitionProvider,
  ]);

  this.container = function (containerName) {

    var container = getOrCreateContainerByName(containerName || DEFAULT_CONTAINER);

    return container;

  };

  this.enumerateModules = function (rootPath, options) {

    var moduleEnumerator = new ModuleEnumerator(rootPath, options);

    return moduleEnumerator.enumerate();

  };

  var getOrCreateContainerByName = function (containerName) {

    var container = _containers[containerName];

    if (!container) {

      var definitionProviderCatalog = new DefinitionProviderCatalog(
        _definitionProviderCatalog.all()
      );

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
