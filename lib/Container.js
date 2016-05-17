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
      let serviceNames = registrationRequest.name ?
                          [registrationRequest.name] :
                          registrationRequest.names;

      serviceDefinition = getServiceDefinitionByServiceModule(serviceModule, serviceNames);

    }

    if (registrationRequest.instance && registrationRequest.name) {

      let serviceInstance = registrationRequest.instance;
      let serviceNames = registrationRequest.name ?
                          [registrationRequest.name] :
                          registrationRequest.names;

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

    var serviceInstance = resolve(serviceName);

    return serviceInstance;

  };

  this.resolveAll = function (serviceName) {

    var serviceInstances = resolveAll(serviceName);

    return serviceInstances;

  };

  var getOrAddServiceDefinition = function (serviceName) {

    if (!_serviceDefinitions[serviceName]) {

      _serviceDefinitions[serviceName] = [];

    }

    return _serviceDefinitions[serviceName];

  };

  var resolve = function (serviceName) {

    serviceName = serviceName.toLowerCase();

    var serviceDefinitions = _serviceDefinitions[serviceName];
    var serviceDefinition = serviceDefinitions[serviceDefinitions.length - 1];

    resolveServiceDefinition(serviceDefinition);

    return serviceDefinition.instance;

  };

  var resolveAll = function (serviceName) {

    serviceName = serviceName.toLowerCase();

    var serviceDefinitions = _serviceDefinitions[serviceName];

    serviceDefinitions.forEach(resolveServiceDefinition);

    var instances = serviceDefinitions.map(serviceDefinition => serviceDefinition.instance);

    return instances;

  };

  var resolveServiceDefinition = function (serviceDefinition) {

    // TODO Needed a clear error message when a dependency is missing

    var dependencies = serviceDefinition.dependencies.map(resolve);

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
