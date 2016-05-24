'use strict';

const should = require('should');
const sinon  = require('sinon');

var Container = require('../lib/Container');

describe('Describing [Container]', () => {

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

      var container = new Container(null, serviceDefinitionCatalogMock);
      result = container.resolve('MyService');

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

      var container = new Container(null, serviceDefinitionCatalogMock);
      result = container.resolve('MyService');

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

    var result = null;

    it('should be possible to obtain always the same instance', () => {

      var serviceDefinitionCatalogMock = {
        getServiceDefinitionsByName: sinon.stub(),
      };

      serviceDefinitionCatalogMock
        .getServiceDefinitionsByName
        .withArgs('MyService')
        .returns([myServiceDefinition]);

      var container = new Container(null, serviceDefinitionCatalogMock);
      var firstTime = container.resolve('MyService');
      var secondTime = container.resolve('MyService');

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

      var container = new Container(null, serviceDefinitionCatalogMock);
      var firstTime = container.resolve('MyService');
      var secondTime = container.resolve('MyService');

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

      var container = new Container(null, serviceDefinitionCatalogMock);
      result = container.resolve('Service');

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

      var container = new Container(null, serviceDefinitionCatalogMock);
      result = container.resolveAll('Service');

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

});
