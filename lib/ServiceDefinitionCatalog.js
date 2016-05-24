'use strict';

module.exports = function ServiceDefinitionCatalog() {

  var definitionsByService = { };

  this.addServiceDefinition = function (serviceDefinition) {

    serviceDefinition.names.forEach(serviceName =>
      getOrCreateServiceDefinitionsByName(serviceName.toLowerCase()).push(serviceDefinition)
    );

  };

  this.getServiceDefinitionsByName = function (serviceName) {

    var definitions = getOrCreateServiceDefinitionsByName(serviceName.toLowerCase());

    return definitions;

  };

  var getOrCreateServiceDefinitionsByName = function (serviceName) {

    var definitions = definitionsByService[serviceName];

    if (!definitions) {

      definitions = [ ];
      definitionsByService[serviceName] = definitions;

    }

    return definitions;

  };

};
