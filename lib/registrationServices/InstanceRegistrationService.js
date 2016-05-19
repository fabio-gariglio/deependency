'use strict';

module.exports = function InstanceRegistrationService() {

  this.getRegistration = function (registrationRequest) {

    // It must expose an "instance" property
    var serviceInstance = registrationRequest.instance;
    if (!serviceInstance) return null;

    // It must expose a "name" or "names" property
    var names = getNamesFromRegistrationRequest(registrationRequest);
    if (!names.length) return null;

    var factoryMethod = createFactoryMethodByServiceInstance(serviceInstance);

    var registration = {
      names: names,
      dependencies: [],
      factoryMethod: factoryMethod,
      isSingleton: true,
    };

    return registration;

  };

  var getNamesFromRegistrationRequest = function (registrationRequest) {

    if (registrationRequest.name) {
      return [registrationRequest.name];
    }

    return registrationRequest.names || [];

  };

  var createFactoryMethodByServiceInstance = function (serviceInstance) {

    return () => serviceInstance;

  };

};
