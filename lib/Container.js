'use strict';

var KeyValueList = require('./KeyValueList');

module.exports = function Container(definitionProviderCatalog, serviceDefinitionCatalog) {

  var singletonInstances = new KeyValueList();

  /**
   * Request the container to register a service.
   * Registration request will be passed to any Resolver until one of those is able to handle it.
   * @param {object} registrationRequest - Request of service registration
   */
  this.register = function (registrationRequest) {

    var serviceDefinition = definitionProviderCatalog.first(definitionProvider =>
      definitionProvider.getServiceDefinition(registrationRequest)
    );

    if (!serviceDefinition) {
      throw new Error(
        'Your registration request has not been handled by any registration service. ' +
        'Please, ensure it is formally correct and there is a registration service able to handle it.'
      );
    }

    serviceDefinitionCatalog.addServiceDefinition(serviceDefinition);

    return serviceDefinition;

  };

  /**
   * Request the container to resolve a service with a specific name.
   * @param {string} serviceName - Name of the service to resolve
   */
  this.resolve = function (serviceName) {

    try {

      var serviceInstance = resolve(serviceName, []);

      return serviceInstance;

    } catch (error) {

      throw new Error(error);

    }

  };

  /**
   * Request the container to resolve all services with a specific name.
   * @param {string} serviceName - Name of the service to resolve
   */
  this.resolveAll = function (serviceName) {

    try {

      var serviceInstances = resolveAll(serviceName);

      return serviceInstances;

    } catch (error) {

      throw new Error(error);

    }

  };

  var scopes = { };

  var resolve = function (serviceName, parents) {

    var serviceDefinitions = serviceDefinitionCatalog.getServiceDefinitionsByName(serviceName);

    if (!serviceDefinitions.length) {
      var hierarchy = parents.reverse().join(' <- ');
      throw hierarchy ?
        `Missing dependency "${serviceName}" required by: ${hierarchy}` :
        `Missing service "${serviceName}"`;
    }

    var serviceDefinition = serviceDefinitions[serviceDefinitions.length - 1];

    var instance = resolveService(
      serviceDefinition, serviceName, [serviceName].concat(parents)
    );

    return instance;

  };

  var resolveAll = function (serviceName) {

    var serviceDefinitions = serviceDefinitionCatalog.getServiceDefinitionsByName(serviceName);

    var instances = serviceDefinitions.map(serviceDefinition =>
      resolveService(serviceDefinition, serviceName)
    );

    return instances;

  };

  var resolveService = function (serviceDefinition, serviceName, parents) {

    var dependencies = serviceDefinition.dependencies.map(dependency =>
      resolve(dependency, parents || [])
    );

    if (!serviceDefinition.isSingleton) {

      return serviceDefinition.factoryMethod(dependencies);

    }

    var instance = singletonInstances.getOrSet(
      serviceDefinition, () => serviceDefinition.factoryMethod(dependencies)
    );

    return instance;

  };

};
