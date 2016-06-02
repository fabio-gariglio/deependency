'use strict';

var KeyValueList = require('./KeyValueList');

module.exports = function ContainerResolutionService(serviceDefinitionCatalog) {

  var singletonInstances = new KeyValueList();

  this.resolve = function (serviceName, inlineDependencies) {

    inlineDependencies = normalizeInlineDependencies(inlineDependencies);
    var serviceInstance = resolve(serviceName, inlineDependencies, []);

    return serviceInstance;

  };

  this.resolveAll = function (serviceName, inlineDependencies) {

    inlineDependencies = normalizeInlineDependencies(inlineDependencies);
    var serviceInstances = resolveAll(serviceName, inlineDependencies);

    return serviceInstances;

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

    try {

      if (!serviceDefinition.isSingleton) {

        return serviceDefinition.factoryMethod(dependencies);

      }

      var instance = singletonInstances.getOrSet(
        serviceDefinition, () => serviceDefinition.factoryMethod(dependencies)
      );

      return instance;

    } catch (resolutionError) {

      var message = `An error has occurred resolving "${serviceName}" : ${resolutionError.message}`;
      var error = new Error(message);
      error.stack = resolutionError.stack;

      throw error;

    }

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
