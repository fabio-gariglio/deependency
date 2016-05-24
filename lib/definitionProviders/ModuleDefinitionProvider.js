'use strict';

module.exports = function ModuleDefinitionProvider() {

  this.getServiceDefinition = function (registrationRequest) {

    var serviceModule = registrationRequest.module;

    if (!serviceModule) return null;
    if (!isFunction(serviceModule)) return null;

    var names = getNamesFromRegistrationRequest(registrationRequest);
    if (!names.length) return null;

    var dependencies = getDependenciesByServiceModule(
      serviceModule, normalizeExplicitDependencies(registrationRequest.dependencies)
    );

    var isSingleton = registrationRequest.singleton === false ? false : true;
    var factoryMethod = createFactoryMethodByServiceModule(serviceModule);

    var serviceDefinition = {
      names: names,
      dependencies: dependencies,
      factoryMethod: factoryMethod,
      isSingleton: isSingleton,
    };

    return serviceDefinition;

  };

  var isFunction = function (target) {

    return (typeof target === 'function');

  };

  var getNamesFromRegistrationRequest = function (registrationRequest) {

    if (registrationRequest.name) {
      return [registrationRequest.name];
    }

    if (registrationRequest.names) {
      return registrationRequest.names;
    }

    if (registrationRequest.module && registrationRequest.module.name) {
      return [registrationRequest.module.name];
    }

    if (registrationRequest.class && registrationRequest.class.name) {
      return [registrationRequest.class.name];
    }

    return [];

  };

  var getDependenciesByServiceModule = function (serviceModule, explicitDependencies) {

    if (!serviceModule.prototype) return [];

    var serviceCode = serviceModule.prototype.constructor.toString();

    var constructorArguments = serviceCode.substring(
      serviceCode.indexOf('(') + 1,
      serviceCode.indexOf(')'));

    var dependencies = constructorArguments
      .split(',')
      .map(dependency => dependency.trim())
      .filter(dependency => !!dependency);

    var result = [];

    dependencies.forEach(dependencyName => {

      var explicitDependency = explicitDependencies[dependencyName.toLowerCase()];
      result.push(explicitDependency || dependencyName);

    });

    return result;

  };

  var createFactoryMethodByServiceModule = function (serviceModule) {

    return (dependencies) =>
      new (Function.prototype.bind.apply(serviceModule, [null].concat(dependencies)));

  };

  var normalizeExplicitDependencies = function (explicitDependencies) {

    var result = { };

    if (!explicitDependencies) return result;

    for (var explicitDependencyName in explicitDependencies) {

      result[explicitDependencyName.toLowerCase()] = explicitDependencies[explicitDependencyName];

    }

    return result;

  };

};
