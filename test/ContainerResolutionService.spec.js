'use strict';

const should = require('should');
const sinon  = require('sinon');

var ContainerResolutionService = require('../lib/ContainerResolutionService');

describe('Describing [ContainerResolutionService]', () => {

  context('resolving a service without dependencies', () => {

    var myServiceDefinition = {
      names: ['MyService'],
      dependencies: [],
      isSingleton: true,
      factoryMethod: sinon.stub().returns('my-service-instance'),
    };

    var result = null;

    before(() => {

      var serviceDefinitionCatalogMock = {
        getServiceDefinitionsByName: sinon.stub(),
      };

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('MyService')
        .returns([myServiceDefinition]);

      var containerResolutionService = new ContainerResolutionService(serviceDefinitionCatalogMock);
      result = containerResolutionService.resolve('MyService');

    });

    it('should be possible to obtain an instance of a previously registered service', () => {

      should(result).not.be.undefined();
      should(result).be.equal('my-service-instance');

    });

    it('should be possible to call the factoryMethod to obtain a new service instance', () => {

      myServiceDefinition.factoryMethod.called.should.be.true();

    });

  });

  context('resolving a service which has multiple dependencies', () => {

    var dependencyOneRegistration = {
      names: ['DependencyOne'],
      dependencies: [],
      isSingleton: true,
      factoryMethod: sinon.stub().returns('dependency-one-instance'),
    };

    var dependencyTwoRegistration = {
      names: ['DependencyTwo'],
      dependencies: [],
      isSingleton: true,
      factoryMethod: sinon.stub().returns('dependency-two-instance'),
    };

    var myServiceDefinition = {
      names: ['MyService'],
      dependencies: ['DependencyOne', 'DependencyTwo'],
      isSingleton: true,
      factoryMethod: sinon.stub().returns('my-service-instance'),
    };

    var result = null;

    before(() => {

      var serviceDefinitionCatalogMock = {
        getServiceDefinitionsByName: sinon.stub(),
      };

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('MyService')
        .returns([myServiceDefinition]);

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('DependencyOne')
        .returns([dependencyOneRegistration]);

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('DependencyTwo')
        .returns([dependencyTwoRegistration]);

      var containerResolutionService = new ContainerResolutionService(serviceDefinitionCatalogMock);
      result = containerResolutionService.resolve('MyService');

    });

    it('should be possible to obtain an instance of a previously registered service', () => {

      should(result).not.be.undefined();
      should(result).be.equal('my-service-instance');

    });

    it('should be possible to obtain an instance providing the expected dependencies', () => {

      myServiceDefinition.factoryMethod.called.should.be.true();
      myServiceDefinition.factoryMethod.getCall(0).args[0].should.match([
        'dependency-one-instance', 'dependency-two-instance',
      ]);

    });

    it('should be possible to obtain an instance off all dependencies', () => {

      dependencyOneRegistration.factoryMethod.called.should.be.true();
      dependencyTwoRegistration.factoryMethod.called.should.be.true();

    });

  });

  context('resolving a singleton service', () => {

    var myServiceDefinition = {
      names: ['MyService'],
      dependencies: [],
      isSingleton: true,
      factoryMethod: sinon.stub(),
    };

    myServiceDefinition.factoryMethod.onCall(0).returns(Math.random());
    myServiceDefinition.factoryMethod.onCall(1).returns(Math.random());

    it('should be possible to obtain always the same instance', () => {

      var serviceDefinitionCatalogMock = {
        getServiceDefinitionsByName: sinon.stub(),
      };

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('MyService')
        .returns([myServiceDefinition]);

      var containerResolutionService = new ContainerResolutionService(serviceDefinitionCatalogMock);
      var firstTime = containerResolutionService.resolve('MyService');
      var secondTime = containerResolutionService.resolve('MyService');

      should(firstTime).not.be.undefined();
      should(secondTime).not.be.undefined();
      should(firstTime).be.equal(secondTime);

      myServiceDefinition.factoryMethod.calledOnce.should.be.true();

    });

  });

  context('resolving a transient service', () => {

    var myServiceDefinition = {
      names: ['MyService'],
      dependencies: [],
      isSingleton: false,
      factoryMethod: sinon.stub(),
    };

    myServiceDefinition.factoryMethod.onCall(0).returns(Math.random());
    myServiceDefinition.factoryMethod.onCall(1).returns(Math.random());

    var result = null;

    it('should be possible to obtain always a new instance', () => {

      var serviceDefinitionCatalogMock = {
        getServiceDefinitionsByName: sinon.stub(),
      };

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('MyService')
        .returns([myServiceDefinition]);

      var containerResolutionService = new ContainerResolutionService(serviceDefinitionCatalogMock);
      var firstTime = containerResolutionService.resolve('MyService');
      var secondTime = containerResolutionService.resolve('MyService');

      should(firstTime).not.be.undefined();
      should(secondTime).not.be.undefined();

      myServiceDefinition.factoryMethod.calledTwice.should.be.true();
      should(firstTime).be.not.equal(secondTime);

    });

  });

  context('resolving a service registered twice', () => {

    var serviceOneDefinition = {
      names: ['Service', 'ServiceOne'],
      dependencies: [],
      isSingleton: true,
      factoryMethod: sinon.stub().returns('service-one-instance'),
    };

    var serviceTwoDefinition = {
      names: ['Service', 'ServiceTwo'],
      dependencies: [],
      isSingleton: true,
      factoryMethod: sinon.stub().returns('service-two-instance'),
    };

    var result = null;

    before(() => {

      var serviceDefinitionCatalogMock = {
        getServiceDefinitionsByName: sinon.stub(),
      };

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('Service')
        .returns([
          serviceOneDefinition,
          serviceTwoDefinition,
        ]);

      var containerResolutionService = new ContainerResolutionService(serviceDefinitionCatalogMock);
      result = containerResolutionService.resolve('Service');

    });

    it('should be possible to obtain the latest registered service', () => {

      should(result).not.be.undefined();
      should(result).be.equal('service-two-instance');

    });

    it('should be possible to create an intance of the latest registered service only', () => {

      serviceOneDefinition.factoryMethod.called.should.be.false();
      serviceTwoDefinition.factoryMethod.called.should.be.true();

    });

  });

  context('resolving all service with the same name', () => {

    var serviceOneDefinition = {
      names: ['Service', 'ServiceOne'],
      dependencies: [],
      isSingleton: true,
      factoryMethod: sinon.stub().returns('service-one-instance'),
    };

    var serviceTwoDefinition = {
      names: ['Service', 'ServiceTwo'],
      dependencies: [],
      isSingleton: true,
      factoryMethod: sinon.stub().returns('service-two-instance'),
    };

    var result = null;

    before(() => {

      var serviceDefinitionCatalogMock = {
        getServiceDefinitionsByName: sinon.stub(),
      };

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('Service')
        .returns([
          serviceOneDefinition,
          serviceTwoDefinition,
        ]);

      var containerResolutionService = new ContainerResolutionService(serviceDefinitionCatalogMock);
      result = containerResolutionService.resolveAll('Service');

    });

    it('should be possible to obtain the latest registered service', () => {

      should(result).not.be.undefined();
      should(result).have.length(2);

      result.should.match(['service-one-instance', 'service-two-instance']);

    });

    it('should be possible to create an intance of all registered services', () => {

      serviceOneDefinition.factoryMethod.called.should.be.true();
      serviceTwoDefinition.factoryMethod.called.should.be.true();

    });

  });

  context('resolving a service providing some inline dependencies', () => {

    var serviceDefinition = {
      names: ['Service'],
      dependencies: ['registeredDependency', 'inlineDependencyOne'],
      isSingleton: true,
      factoryMethod: sinon.stub().returns('service-instance'),
    };

    var registeredDependencyDefinition = {
      names: ['RegisteredDependency'],
      dependencies: ['inlineDependencyOne', 'inlineDependencyTwo'],
      isSingleton: true,
      factoryMethod: sinon.stub().returns('registered-dependency-instance'),
    };

    it('should be possible resolve the service with the provided inline dependencies', () => {

      var serviceDefinitionCatalogMock = {
        getServiceDefinitionsByName: sinon.stub().returns([]),
      };

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('service')
        .returns([serviceDefinition]);

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('registeredDependency')
        .returns([registeredDependencyDefinition]);

      var inlineDependencyOne = 'inline-dependency-one-instance';
      var inlineDependencyTwo = 'inline-dependency-two-instance';

      var containerResolutionService = new ContainerResolutionService(serviceDefinitionCatalogMock);
      var result = containerResolutionService.resolve('service', {
        inlineDependencyOne: inlineDependencyOne,
        inlineDependencyTwo: inlineDependencyTwo,
      });

      should(result).be.equal('service-instance');

      registeredDependencyDefinition.factoryMethod.called.should.be.true();
      registeredDependencyDefinition.factoryMethod.getCall(0).args[0].should.match([
        inlineDependencyOne, inlineDependencyTwo,
      ]);

      serviceDefinition.factoryMethod.called.should.be.true();
      serviceDefinition.factoryMethod.getCall(0).args[0].should.match([
        'registered-dependency-instance', inlineDependencyOne,
      ]);

    });

  });

  context('resolving a service which explodes during initialization', () => {

    var AnExplodingService = require('./samples/AnExplodingService');

    var dependencyDefinition = {
      names: ['AnExplodingService'],
      dependencies: [],
      isSingleton: true,
      factoryMethod: () => new AnExplodingService(),
    };

    var serviceDefinition = {
      names: ['MyService'],
      dependencies: ['AnExplodingService'],
      isSingleton: true,
      factoryMethod: sinon.stub(),
    };

    it('a human should be able to understand what has failed', () => {

      var serviceDefinitionCatalogMock = {
        getServiceDefinitionsByName: sinon.stub(),
      };

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('AnExplodingService')
        .returns([dependencyDefinition]);

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('MyService')
        .returns([serviceDefinition]);

      var containerResolutionService = new ContainerResolutionService(serviceDefinitionCatalogMock);

      (() => containerResolutionService.resolve('MyService')).should.throw({
        message: /"AnExplodingService" .* Cannot set property 'value' of undefined/,
        stack: /AnExplodingService\.js:9/,
      });

    });

  });

  context('resolving a list of services of which one explodes during initialization', () => {

    var AnExplodingService = require('./samples/AnExplodingService');
    var ASafeService = function () { };

    var aSafeServiceDefinition = {
      names: ['Service'],
      dependencies: [],
      isSingleton: true,
      factoryMethod: () => new ASafeService(),
    };

    var anExplodingServiceDefinition = {
      names: ['Service'],
      dependencies: [],
      isSingleton: true,
      factoryMethod: () => new AnExplodingService(),
    };

    it('a human should be able to understand what has failed', () => {

      var serviceDefinitionCatalogMock = {
        getServiceDefinitionsByName: sinon.stub().returns([
          aSafeServiceDefinition,
          anExplodingServiceDefinition,
        ]),
      };

      var containerResolutionService = new ContainerResolutionService(serviceDefinitionCatalogMock);

      (() => containerResolutionService.resolveAll('Service')).should.throw({
        message: /"Service" .* Cannot set property 'value' of undefined/,
        stack: /AnExplodingService\.js:9/,
      });

    });

  });

});
