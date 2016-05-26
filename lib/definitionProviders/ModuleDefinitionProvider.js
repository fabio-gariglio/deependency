'use strict';

module.exports = function ModuleDefinitionProvider() {

  this.getServiceDefinition = function (registrationRequest) {

    var serviceModule = registrationRequest.module;

    if (!serviceModule) return null;
    if (!isFunction(serviceModule)) return null;

    var names         = getNamesFromRegistrationRequest(registrationRequest);
    var dependencies  = getDependenciesByServiceModule(serviceModule);
    var factoryMethod = createFactoryMethodByServiceModule(serviceModule);

    var serviceDefinition = {
      names: names,
      dependencies: dependencies,
      factoryMethod: factoryMethod,
    };

    return serviceDefinition;

  };

  var isFunction = function (target) {

    return (typeof target === 'function');

  };

  var getNamesFromRegistrationRequest = function (registrationRequest) {

    if (registrationRequest.module && registrationRequest.module.name) {

      return [registrationRequest.module.name];

    }

    return [];

  };

  var getDependenciesByServiceModule = function (serviceModule) {

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

  var createFactoryMethodByServiceModule = function (serviceModule) {

    return (dependencies) =>
      new (Function.prototype.bind.apply(serviceModule, [null].concat(dependencies)));

  };

};
