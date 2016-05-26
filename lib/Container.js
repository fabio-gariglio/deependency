'use strict';

var KeyValueList = require('./KeyValueList');

module.exports = function Container(containerRegistrationService, containerResolutionService) {

  /**
   * Request the container to register a service.
   * Registration request will be passed to any Resolver until one of those is able to handle it.
   * @param {object} registrationRequest - Request of service registration
   */
  this.register = function (registrationRequest, options) {

    containerRegistrationService.register(registrationRequest, options);

  };

  /**
   * Request the container to resolve a service with a specific name.
   * @param {string} serviceName - Name of the service to resolve
   */
  this.resolve = function (serviceName, inlineDependencies) {

    return containerResolutionService.resolve(serviceName, inlineDependencies);

  };

  /**
   * Request the container to resolve all services with a specific name.
   * @param {string} serviceName - Name of the service to resolve
   */
  this.resolveAll = function (serviceName, inlineDependencies) {

    return containerResolutionService.resolveAll(serviceName, inlineDependencies);

  };

};
