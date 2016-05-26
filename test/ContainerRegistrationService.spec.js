'use strict';

const should = require('should');
const sinon  = require('sinon');

var ContainerRegistrationService = require('../lib/ContainerRegistrationService');

describe('Describing [ContainerRegistrationService]', () => {

  context('when definition provider provides a named service definition', () => {

    context('but a name is also explicitly provided during registration', () => {

      var definitionProviderCatalogMock = {
        first: sinon.stub().returns({ names: ['MyService'] }),
      };

      var serviceDefinitionCatalogMock = {
        addServiceDefinition: sinon.stub(),
      };

      before(() => {

        var registrationRequest = { };

        var target = new ContainerRegistrationService(
          definitionProviderCatalogMock, serviceDefinitionCatalogMock
        );

        target.register(registrationRequest, { name: 'CustomName' });

      });

      describe('the service definition', () => {

        it('should be added to the catalog with both detected and provided names', () => {

          serviceDefinitionCatalogMock.addServiceDefinition.getCall(0).args[0].should.match({
            names: ['MyService', 'CustomName'],
          });

        });

      });

    });

    context('but a list of names is also explicitly provided during registration', () => {

      var definitionProviderCatalogMock = {
        first: sinon.stub().returns({ names: ['MyService'] }),
      };

      var serviceDefinitionCatalogMock = {
        addServiceDefinition: sinon.stub(),
      };

      before(() => {

        var registrationRequest = { };

        var target = new ContainerRegistrationService(
          definitionProviderCatalogMock, serviceDefinitionCatalogMock
        );

        target.register(registrationRequest, { names: ['CustomName', 'CustomServiceName'] });

      });

      describe('the service definition', () => {

        it('should be added to the catalog with detected and all the provided names', () => {

          serviceDefinitionCatalogMock.addServiceDefinition.getCall(0).args[0].should.match({
            names: ['MyService', 'CustomName', 'CustomServiceName'],
          });

        });

      });

    });

  });

  context('when definition provider does not provide any name in service definition', () => {

    context('and a name is explicitly provided during registration', () => {

      var definitionProviderCatalogMock = {
        first: sinon.stub().returns({ names: [] }),
      };

      var serviceDefinitionCatalogMock = {
        addServiceDefinition: sinon.stub(),
      };

      before(() => {

        var registrationRequest = { };

        var target = new ContainerRegistrationService(
          definitionProviderCatalogMock, serviceDefinitionCatalogMock
        );

        target.register(registrationRequest, { name: 'CustomName' });

      });

      describe('the service definition', () => {

        it('should be added to the catalog with the explicitly provided name', () => {

          serviceDefinitionCatalogMock.addServiceDefinition.getCall(0).args[0].should.match({
            names: ['CustomName'],
          });

        });

      });

    });

    context('and a list of names is explicitly provided during registration', () => {

      var definitionProviderCatalogMock = {
        first: sinon.stub().returns({ names: [] }),
      };

      var serviceDefinitionCatalogMock = {
        addServiceDefinition: sinon.stub(),
      };

      before(() => {

        var registrationRequest = { };

        var target = new ContainerRegistrationService(
          definitionProviderCatalogMock, serviceDefinitionCatalogMock
        );

        target.register(registrationRequest, { names: ['CustomName', 'CustomServiceName'] });

      });

      describe('the service definition', () => {

        it('should be added to the catalog with all the explicitly provided names', () => {

          serviceDefinitionCatalogMock.addServiceDefinition.getCall(0).args[0].should.match({
            names: ['CustomName', 'CustomServiceName'],
          });

        });

      });

    });

  });

  context('when definition provider provides a service definition', () => {

    var definitionProviderCatalogMock = {
      first: sinon.stub().returns({
        names: ['MyService'],
        dependencies: ['DependencyOne', 'DependencyTwo'],
        factoryMethod: () => null,
      }),
    };

    var serviceDefinitionCatalogMock = {
      addServiceDefinition: sinon.stub(),
    };

    before(() => {

      var registrationRequest = { };

      var target = new ContainerRegistrationService(
        definitionProviderCatalogMock, serviceDefinitionCatalogMock
      );

      target.register(registrationRequest);

    });

    describe('the service definition', () => {

      it('should be added to the catalog', () => {

        serviceDefinitionCatalogMock.addServiceDefinition.called.should.be.true();

        var serviceDefinition = serviceDefinitionCatalogMock.addServiceDefinition.getCall(0).args[0];

        serviceDefinition.names.should.be.Array();
        serviceDefinition.names.should.have.length(1);
        serviceDefinition.names.should.match(['MyService']);

        serviceDefinition.dependencies.should.be.Array();
        serviceDefinition.dependencies.should.have.length(2);
        serviceDefinition.dependencies.should.match(['DependencyOne', 'DependencyTwo']);

        serviceDefinition.factoryMethod.should.be.Function();

      });

    });

    context('and no option is provided during registration', () => {

      var definitionProviderCatalogMock = {
        first: sinon.stub().returns({ names: [] }),
      };

      var serviceDefinitionCatalogMock = {
        addServiceDefinition: sinon.stub(),
      };

      before(() => {

        var registrationRequest = { };

        var target = new ContainerRegistrationService(
          definitionProviderCatalogMock, serviceDefinitionCatalogMock
        );

        target.register(registrationRequest);

      });

      describe('the service definition', () => {

        it('should be added to the catalog as singleton by default', () => {

          serviceDefinitionCatalogMock.addServiceDefinition.getCall(0).args[0].should.match({
            isSingleton: true,
          });

        });

      });

    });

    context('and "transient" is provided during registration', () => {

      var definitionProviderCatalogMock = {
        first: sinon.stub().returns({ names: [] }),
      };

      var serviceDefinitionCatalogMock = {
        addServiceDefinition: sinon.stub(),
      };

      before(() => {

        var registrationRequest = { };

        var target = new ContainerRegistrationService(
          definitionProviderCatalogMock, serviceDefinitionCatalogMock
        );

        target.register(registrationRequest, { transient: true });

      });

      describe('the service definition', () => {

        it('should be added to the catalog as not singleton', () => {

          serviceDefinitionCatalogMock.addServiceDefinition.getCall(0).args[0].should.match({
            isSingleton: false,
          });

        });

      });

    });

  });

  context('when definition provider provides a service definition with some dependencies', () => {

    context('and a some dependency replacements are provided during registration', () => {

      var definitionProviderCatalogMock = {
        first: sinon.stub().returns({
          names: ['MyService'],
          dependencies: ['DependencyOne', 'DependencyTwo'],
          factoryMethod: () => null,
        }),
      };

      var serviceDefinitionCatalogMock = {
        addServiceDefinition: sinon.stub(),
      };

      before(() => {

        var registrationRequest = { };

        var target = new ContainerRegistrationService(
          definitionProviderCatalogMock, serviceDefinitionCatalogMock
        );

        target.register(registrationRequest, {
          replace: {
            DependencyOne: { with: 'DependencyThree' },
          },
        });

      });

      describe('the service definition', () => {

        it('should be added to the catalog with the replaced dependencies', () => {

          serviceDefinitionCatalogMock.addServiceDefinition.getCall(0).args[0].should.match({
            dependencies: ['DependencyThree', 'DependencyTwo'],
          });

        });

      });

    });

  });

});
