'use strict';

var KeyValueList = require('./KeyValueList');

module.exports = function ContainerResolutionService(serviceDefinitionCatalog) {

  var singletonInstances = new KeyValueList();

  this.resolve = function (serviceName, inlineDependencies) {

    try {

      inlineDependencies = normalizeInlineDependencies(inlineDependencies);
      var serviceInstance = resolve(serviceName, inlineDependencies, []);

      return serviceInstance;

    } catch (error) {

      throw new Error(error);

    }

  };

  this.resolveAll = function (serviceName, inlineDependencies) {

    try {

      inlineDependencies = normalizeInlineDependencies(inlineDependencies);
      var serviceInstances = resolveAll(serviceName, inlineDependencies);

      return serviceInstances;

    } catch (error) {

      throw new Error(error);

    }

  };

  var resolve = function (serviceName, inlineDependencies, parents) {

    var inlineDependency = inlineDependencies[serviceName.toLowerCase()];

    if (inlineDependency) return inlineDependency;

    var serviceDefinitions = serviceDefinitionCatalog.getServiceDefinitionsByName(serviceName);

    if (!serviceDefinitions.length) {
      var hierarchy = parents.reverse().join(' <- ');
      throw hierarchy ?
        `Missing dependency "${serviceName}" required by: ${hierarchy}` :
        `Missing service "${serviceName}"`;
    }

    var serviceDefinition = serviceDefinitions[serviceDefinitions.length - 1];

    var instance = resolveService(
      serviceName, serviceDefinition, inlineDependencies, [serviceName].concat(parents)
    );

    return instance;

  };

  var resolveAll = function (serviceName, inlineDependencies) {

    var serviceDefinitions = serviceDefinitionCatalog.getServiceDefinitionsByName(serviceName);

    var instances = serviceDefinitions.map(serviceDefinition =>
      resolveService(serviceName, serviceDefinition, inlineDependencies)
    );

    return instances;

  };

  var resolveService = function (serviceName, serviceDefinition, inlineDependencies, parents) {

    var dependencies = serviceDefinition.dependencies.map(dependency =>
      resolve(dependency, inlineDependencies, parents || [])
    );

    if (!serviceDefinition.isSingleton) {

      return serviceDefinition.factoryMethod(dependencies);

    }

    var instance = singletonInstances.getOrSet(
      serviceDefinition, () => serviceDefinition.factoryMethod(dependencies)
    );

    return instance;

  };

  var normalizeInlineDependencies = function (inlineDependencies) {

    var result = { };

    if (!inlineDependencies) return result;

    for (var dependencyName in inlineDependencies) {

      result[dependencyName.toLowerCase()] = inlineDependencies[dependencyName];

    }

    return result;

  };

};
