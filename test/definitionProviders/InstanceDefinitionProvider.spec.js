'use strict';

var should = require('should');
var InstanceDefinitionProvider = require('../../lib/definitionProviders/InstanceDefinitionProvider');

describe('Describing [InstanceDefinitionProvider]', () => {

  context('calling getServiceDefinition(serviceRegistration)', () => {

    context('by providing a serviceRegistration which exposes an instance', () => {

      var dateInstance = new Date();

      var serviceRegistration = {
        instance: dateInstance
      };

      describe('the serviceDefinition', () => {

        var serviceDefinition = null;

        before(() => {

          // Act
          var serviceDefinitionService = new InstanceDefinitionProvider();
          serviceDefinition = serviceDefinitionService.getServiceDefinition(serviceRegistration);

        });

        it('should not be null or undefined', () => {

          should(serviceDefinition).be.not.undefined();
          should(serviceDefinition).be.not.null();

        });

        it('should not provide any name', () => {

          should(serviceDefinition.names).be.Array();
          serviceDefinition.names.should.have.length(0);

        });

        it('should have a factory method', () => {

          should(serviceDefinition.factoryMethod).be.Function();

        });

        it('should allow to get the instance registered', () => {

          var instance = serviceDefinition.factoryMethod();
          should(instance).be.equal(dateInstance);

        });

      });

    });

    context('by providing an invalid serviceRegistration', () => {

      it('should not be possible to get a serviceDefinition without "instance" property', () => {

        // Act
        var serviceDefinitionService = new InstanceDefinitionProvider();
        var serviceDefinition = serviceDefinitionService.getServiceDefinition({ });

        // Assert
        should(serviceDefinition).be.null();

      });

    });

  });

});
