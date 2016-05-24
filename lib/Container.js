'use strict';

const RegistrationServiceCatalog = require(
  './RegistrationServiceCatalog'
);

const InstanceRegistrationService = require(
  './registrationServices/InstanceRegistrationService.js'
);

const ModuleRegistrationService = require(
  './registrationServices/ModuleRegistrationService'
);

module.exports = function Container() {

  var _serviceRegistrations = { };
  var _registrationServiceCatalog = new RegistrationServiceCatalog();

  _registrationServiceCatalog.add(new InstanceRegistrationService());
  _registrationServiceCatalog.add(new ModuleRegistrationService());

  /**
   * Request the container to register a service.
   * Registration request will be passed to any Resolver until one of those is able to handle it.
   * @param {object} registrationRequest - Request of service registration
   */
  this.register = function (registrationRequest) {

    var registration = _registrationServiceCatalog.first(registrationService =>
      registrationService.getRegistration(registrationRequest)
    );

    if (!registration) {
      throw new Error(
        'Your registration request has not been handled by any registration service. ' +
        'Please, ensure it is formally correct and there is a registration service able to handle it.'
      );
    }

    registration.names.forEach(name =>
      getOrAddServiceRegistration(name.toLowerCase()).push(registration)
    );

    return registration;

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

  var getOrAddServiceRegistration = function (serviceName) {

    if (!_serviceRegistrations[serviceName]) {

      _serviceRegistrations[serviceName] = [];

    }

    return _serviceRegistrations[serviceName];

  };

  var resolve = function (serviceName, parents) {

    var normalizedServiceName = serviceName.toLowerCase();

    var serviceDefinitions = getOrAddServiceRegistration(normalizedServiceName);

    if (!serviceDefinitions.length) {
      var hierarchy = parents.reverse().join(' <- ');
      throw hierarchy ?
        `Missing dependency "${serviceName}" required by: ${hierarchy}` :
        `Missing service "${serviceName}"`;
    }

    var serviceDefinition = serviceDefinitions[serviceDefinitions.length - 1];

    resolveServiceDefinition(serviceDefinition, [serviceName].concat(parents));

    return serviceDefinition.instance;

  };

  var resolveAll = function (serviceName) {

    var normalizedServiceName = serviceName.toLowerCase();

    var serviceDefinitions = getOrAddServiceRegistration(normalizedServiceName);

    serviceDefinitions.forEach(serviceDefinition =>
      resolveServiceDefinition(serviceDefinition)
    );

    var instances = serviceDefinitions.map(serviceDefinition => serviceDefinition.instance);

    return instances;

  };

  var resolveServiceDefinition = function (serviceDefinition, parents) {

    var dependencies = serviceDefinition.dependencies.map(dependency =>
      resolve(dependency, parents || [])
    );

    serviceDefinition.instance = serviceDefinition.instance ||
                                 serviceDefinition.factoryMethod(dependencies);

  };

};
