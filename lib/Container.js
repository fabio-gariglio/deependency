module.exports = function Container() {

  var serviceDefinitions = { };

  /**
   * Request the container to register a service.
   * Registration request will be passed to any Resolver until one of those is able to handle it.
   * @param {object} registrationRequest - Request of service registration
   */
  this.register = function (registrationRequest) {

    var serviceDefinition = null;

    if (registrationRequest.module) {

      var serviceModule = (typeof registrationRequest.module === 'string') ?
        require(registrationRequest.module) :
        registrationRequest.module;

      var serviceName = registrationRequest.name;

      serviceDefinition = getServiceDefinitionByServiceModule(serviceModule, serviceName);

    }

    if (registrationRequest.instance && registrationRequest.name) {

      var serviceInstance = registrationRequest.instance;
      var serviceName = registrationRequest.name;

      serviceDefinition = getServiceDefinitionByInstance(serviceInstance, serviceName);

    }

    if (serviceDefinition) {

      serviceDefinitions[serviceDefinition.name.toLowerCase()] = serviceDefinition;

    }

    return serviceDefinition;

  };

  /**
   * Request the container to resolve a service.
   * @param {string} serviceName - Name of the service to resolve
   */
  this.resolve = function (serviceName) {

    return resolve(serviceName);

  };

  var resolve = function (serviceName) {

    var serviceDefinition = serviceDefinitions[serviceName.toLowerCase()];

    var dependencies = serviceDefinition.dependencies.map(resolve);

    serviceDefinition.instance = serviceDefinition.instance ||
                                 serviceDefinition.factory(dependencies);

    return serviceDefinition.instance;

  };

  var getServiceDefinitionByServiceModule = function (serviceModule, serviceName) {

    var serviceDefinition = {
      name: serviceName || serviceModule.name,
      factory: (dependencies) =>
        new (Function.prototype.bind.apply(serviceModule, [null].concat(dependencies))),
      instance: null,
      dependencies: getServiceDependenciesByServiceModule(serviceModule),
    };

    return serviceDefinition;

  };

  var getServiceDefinitionByInstance = function (serviceInstance, serviceName) {

    var serviceDefinition = {
      name: serviceName,
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
