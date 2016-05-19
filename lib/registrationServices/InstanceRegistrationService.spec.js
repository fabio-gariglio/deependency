'use strict';

var should = require('should');
var InstanceRegistrationService = require('./InstanceRegistrationService');

describe('Describing [InstanceRegistrationService]', () => {

  context('calling getRegistration(serviceRegistration)', () => {

    context('by providing a serviceRegistration which exposes an instance and a name', () => {

      var dateInstance = new Date();

      var serviceRegistration = {
        instance: dateInstance,
        name: 'dateInstance',
      };

      describe('the registration', () => {

        var registration = null;

        before(() => {

          // Act
          var registrationService = new InstanceRegistrationService();
          registration = registrationService.getRegistration(serviceRegistration);

        });

        it('should not be null or undefined', () => {

          should(registration).be.not.undefined();
          should(registration).be.not.null();

        });

        it('should have the expected name', () => {

          should(registration.names).be.Array();
          registration.names.should.have.length(1);
          registration.names.should.match(['dateInstance']);

        });

        it('should be singleton', () => {

          should(registration.isSingleton).be.true();

        });

        it('should have a factory method', () => {

          should(registration.factoryMethod).be.Function();

        });

        it('should allow to get the instance registered', () => {

          var instance = registration.factoryMethod();
          should(instance).be.equal(dateInstance);

        });

        it('should always return the same instance', () => {

          var firstTime = registration.factoryMethod();
          var secondTime = registration.factoryMethod();
          should(secondTime).be.equal(firstTime);

        });

      });

    });

    context('by providing a serviceRegistration which exposes multiple names', () => {

      var dateInstance = new Date();

      var serviceRegistration = {
        instance: dateInstance,
        names: ['dateInstance', 'instance'],
      };

      describe('the registration', () => {

        var registration = null;

        before(() => {

          // Act
          var registrationService = new InstanceRegistrationService();
          registration = registrationService.getRegistration(serviceRegistration);

        });

        it('should have the expected names', () => {

          should(registration.names).be.Array();
          registration.names.should.have.length(2);
          registration.names.should.matchAny('dateInstance');
          registration.names.should.matchAny('instance');

        });

      });

    });

    context('by providing an invalid serviceRegistration', () => {

      it('should not be possible to get a registration without "instance" property', () => {

        // Act
        var registrationService = new InstanceRegistrationService();
        var registration = registrationService.getRegistration({ });

        // Assert
        should(registration).be.null();

      });

      it('should not be possible to get a registration without "name" or "names" property', () => {

        // Act
        var registrationService = new InstanceRegistrationService();
        var registration = registrationService.getRegistration({ instance: 'value' });

        // Assert
        should(registration).be.null();

      });

      it('should not be possible to get a registration with "name" property null', () => {

        // Act
        var registrationService = new InstanceRegistrationService();
        var registration = registrationService.getRegistration({ instance: 'value', name: null });

        // Assert
        should(registration).be.null();

      });

      it('should not be possible to get a registration with "name" property empty', () => {

        // Act
        var registrationService = new InstanceRegistrationService();
        var registration = registrationService.getRegistration({ instance: 'value', name: '' });

        // Assert
        should(registration).be.null();

      });

      it('should not be possible to get a registration with "names" property empty', () => {

        // Act
        var registrationService = new InstanceRegistrationService();
        var registration = registrationService.getRegistration({ instance: 'value', names: [] });

        // Assert
        should(registration).be.null();

      });

    });

  });

});
