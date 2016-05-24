'use strict';

var should = require('should');
var InstanceDefinitionProvider = require('../../lib/definitionProviders/InstanceDefinitionProvider');

describe('Describing [InstanceDefinitionProvider]', () => {

  context('calling getServiceDefinition(serviceRegistration)', () => {

    context('by providing a serviceRegistration which exposes an instance and a name', () => {

      var dateInstance = new Date();

      var serviceRegistration = {
        instance: dateInstance,
        name: 'dateInstance',
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

        it('should have the expected name', () => {

          should(serviceDefinition.names).be.Array();
          serviceDefinition.names.should.have.length(1);
          serviceDefinition.names.should.match(['dateInstance']);

        });

        it('should be singleton', () => {

          should(serviceDefinition.isSingleton).be.true();

        });

        it('should have a factory method', () => {

          should(serviceDefinition.factoryMethod).be.Function();

        });

        it('should allow to get the instance registered', () => {

          var instance = serviceDefinition.factoryMethod();
          should(instance).be.equal(dateInstance);

        });

        it('should always return the same instance', () => {

          var firstTime = serviceDefinition.factoryMethod();
          var secondTime = serviceDefinition.factoryMethod();
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

      describe('the serviceDefinition', () => {

        var serviceDefinition = null;

        before(() => {

          // Act
          var serviceDefinitionService = new InstanceDefinitionProvider();
          serviceDefinition = serviceDefinitionService.getServiceDefinition(serviceRegistration);

        });

        it('should have the expected names', () => {

          should(serviceDefinition.names).be.Array();
          serviceDefinition.names.should.have.length(2);
          serviceDefinition.names.should.matchAny('dateInstance');
          serviceDefinition.names.should.matchAny('instance');

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

      it('should not be possible to get a serviceDefinition without "name" or "names" property', () => {

        // Act
        var serviceDefinitionService = new InstanceDefinitionProvider();
        var serviceDefinition = serviceDefinitionService.getServiceDefinition({ instance: 'value' });

        // Assert
        should(serviceDefinition).be.null();

      });

      it('should not be possible to get a serviceDefinition with "name" property null', () => {

        // Act
        var serviceDefinitionService = new InstanceDefinitionProvider();
        var serviceDefinition = serviceDefinitionService.getServiceDefinition({ instance: 'value', name: null });

        // Assert
        should(serviceDefinition).be.null();

      });

      it('should not be possible to get a serviceDefinition with "name" property empty', () => {

        // Act
        var serviceDefinitionService = new InstanceDefinitionProvider();
        var serviceDefinition = serviceDefinitionService.getServiceDefinition({ instance: 'value', name: '' });

        // Assert
        should(serviceDefinition).be.null();

      });

      it('should not be possible to get a serviceDefinition with "names" property empty', () => {

        // Act
        var serviceDefinitionService = new InstanceDefinitionProvider();
        var serviceDefinition = serviceDefinitionService.getServiceDefinition({ instance: 'value', names: [] });

        // Assert
        should(serviceDefinition).be.null();

      });

    });

  });

});
