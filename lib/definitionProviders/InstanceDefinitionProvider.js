'use strict';

module.exports = function InstanceDefinitionProvider() {

  this.getServiceDefinition = function (registrationRequest) {

    // It must expose an "instance" property
    var serviceInstance = registrationRequest.instance;
    if (!serviceInstance) return null;

    var factoryMethod = createFactoryMethodByServiceInstance(serviceInstance);

    var serviceDefinition = {
      names: [],
      dependencies: [],
      factoryMethod: factoryMethod,
    };

    return serviceDefinition;

  };

  var createFactoryMethodByServiceInstance = function (serviceInstance) {

    return () => serviceInstance;

  };

};
