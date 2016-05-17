'use strict';

module.exports = function Container() {

  var _serviceDefinitions = { };

  /**
   * Request the container to register a service.
   * Registration request will be passed to any Resolver until one of those is able to handle it.
   * @param {object} registrationRequest - Request of service registration
   */
  this.register = function (registrationRequest) {

    var serviceDefinition = null;

    if (registrationRequest.module) {

      let serviceModule = registrationRequest.module;
      let serviceNames = getNamesFromRegistrationRequest(registrationRequest);

      serviceDefinition = getServiceDefinitionByServiceModule(serviceModule, serviceNames);

    }

    if (registrationRequest.instance) {

      let serviceInstance = registrationRequest.instance;
      let serviceNames = getNamesFromRegistrationRequest(registrationRequest);

      serviceDefinition = getServiceDefinitionByInstance(serviceInstance, serviceNames);

    }

    if (serviceDefinition) {

      serviceDefinition.names.forEach(name =>
        getOrAddServiceDefinition(name.toLowerCase()).push(serviceDefinition)
      );

    }

    return serviceDefinition;

  };

  /**
   * Request the container to resolve a service.
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

  this.resolveAll = function (serviceName) {

    try {

      var serviceInstances = resolveAll(serviceName);

      return serviceInstances;

    } catch (error) {

      throw new Error(error);

    }

  };

  var getNamesFromRegistrationRequest = function (registrationRequest) {

    if (registrationRequest.name) {
      return [registrationRequest.name];
    }

    if (registrationRequest.names) {
      return registrationRequest.names;
    }

    return [];

  };

  var getOrAddServiceDefinition = function (serviceName) {

    if (!_serviceDefinitions[serviceName]) {

      _serviceDefinitions[serviceName] = [];

    }

    return _serviceDefinitions[serviceName];

  };

  var resolve = function (serviceName, parents) {

    var normalizedServiceName = serviceName.toLowerCase();

    var serviceDefinitions = getOrAddServiceDefinition(normalizedServiceName);

    if (!serviceDefinitions.length) {
      var hierarchy = parents.reverse().join(' <- ')
      throw hierarchy
        ? `Missing dependency "${serviceName}" required by: ${hierarchy}`
        : `Missing service "${serviceName}"`;
    }

    var serviceDefinition = serviceDefinitions[serviceDefinitions.length - 1];

    resolveServiceDefinition(serviceDefinition, [serviceName].concat(parents));

    return serviceDefinition.instance;

  };

  var resolveAll = function (serviceName) {

    var normalizedServiceName = serviceName.toLowerCase();

    var serviceDefinitions = getOrAddServiceDefinition(normalizedServiceName);

    serviceDefinitions.forEach(serviceDefinition =>
      resolveServiceDefinition(serviceDefinition)
    );

    var instances = serviceDefinitions.map(serviceDefinition => serviceDefinition.instance);

    return instances;

  }

  var resolveServiceDefinition = function (serviceDefinition, parents) {

    var dependencies = serviceDefinition.dependencies.map(dependency =>
      resolve(dependency, parents || [])
    );

    serviceDefinition.instance = serviceDefinition.instance ||
                                 serviceDefinition.factory(dependencies);

  };

  var getServiceDefinitionByServiceModule = function (serviceModule, serviceNames) {

    var names = (serviceNames && serviceNames.length) ?
      serviceNames.map(serviceName => serviceName) :
      [serviceModule.name];

    var serviceDefinition = {
      names: names,
      factory: (dependencies) =>
        new (Function.prototype.bind.apply(serviceModule, [null].concat(dependencies))),
      instance: null,
      dependencies: getServiceDependenciesByServiceModule(serviceModule),
    };

    return serviceDefinition;

  };

  var getServiceDefinitionByInstance = function (serviceInstance, serviceNames) {

    var serviceDefinition = {
      names: serviceNames,
      factory: () => serviceInstance,
      instance: null,
      dependencies: [],
    };

    return serviceDefinition;

  };

  var getServiceDependenciesByServiceModule = function (serviceModule) {

    if (!serviceModule.prototype) return [];

    var serviceCode = serviceModule.prototype.constructor.toString();

    var constructorArguments = serviceCode.substring(
      serviceCode.indexOf('(') + 1,
      serviceCode.indexOf(')'));

    var dependencies = constructorArguments
      .split(',')
      .map(dependency => dependency.trim())
      .filter(dependency => !!dependency);

    return dependencies;

  };

};
