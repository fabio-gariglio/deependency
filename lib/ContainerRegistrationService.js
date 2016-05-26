'use strict';

module.exports = function ContainerRegistrationService(
  definitionProviderCatalog,
  serviceDefinitionCatalog) {

  this.register = function (registrationRequest, options) {

    var serviceDefinition = definitionProviderCatalog.first(definitionProvider =>
      definitionProvider.getServiceDefinition(registrationRequest)
    );

    if (!serviceDefinition) {
      throw new Error(
        'Your registration request has not been handled by any registration service. ' +
        'Please, ensure it is formally correct and there is a registration service able to handle it.'
      );
    }

    applyOptionsToServiceDefinition(serviceDefinition, options);

    serviceDefinitionCatalog.addServiceDefinition(serviceDefinition);

  };

  var applyOptionsToServiceDefinition = function (serviceDefinition, options) {

    serviceDefinition.isSingleton = true;

    if (!options) return;

    if (options.name) {

      serviceDefinition.names.push(options.name);

    } else if (options.names) {

      options.names.forEach(name => serviceDefinition.names.push(name));

    }

    if (options.transient === true) {

      serviceDefinition.isSingleton = false;

    }

    if (options.replace) {

      var dependencyReplacements = getDependencyReplacementsLowerCased(options.replace);

      for (let index = 0; index < serviceDefinition.dependencies.length; index++) {

        let dependencyName = serviceDefinition.dependencies[index];
        let dependencyReplacementName = dependencyReplacements[dependencyName.toLowerCase()];

        if (dependencyReplacementName) {
          serviceDefinition.dependencies[index] = dependencyReplacementName;
        }

      }

    }

  };

  var getDependencyReplacementsLowerCased = function (dependencyReplacements) {

    var result = { };

    for (var dependencyName in dependencyReplacements) {

      result[dependencyName.toLowerCase()] = dependencyReplacements[dependencyName].with;

    }

    return result;

  };

};
