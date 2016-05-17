'use strict';

var should = require('should');
var Target = require('../lib/Container');

describe('Container:', () => {

  it('should be possible to register a service which has no dependencies', () => {

    // Arrange
    function ServiceWithoutDependencies() {
      this.toString = function () { return 'ServiceWithoutDependencies'; };
    }

    // Act
    var target = new Target();
    var serviceDefinition = target.register({ module: ServiceWithoutDependencies });

    // Assert
    should(serviceDefinition).not.be.undefined();
    serviceDefinition.names.should.match(['ServiceWithoutDependencies']);
    serviceDefinition.dependencies.should.have.length(0);

  });

  it('should be possible to register a service which has one dependency', () => {

    // Arrange
    function ServiceWithOneDependency(aDependency) {
      this.toString = function () { return 'ServiceWithOneDependency'; };
    }

    // Act
    var target = new Target();
    var serviceDefinition = target.register({ module: ServiceWithOneDependency });

    // Assert
    should(serviceDefinition).not.be.undefined();
    serviceDefinition.names.should.match(['ServiceWithOneDependency']);
    serviceDefinition.dependencies.should.have.length(1);
    serviceDefinition.dependencies.should.matchAny('aDependency');

  });

  it('should be possible to register a service which has multiple dependencies', () => {

    // Arrange
    function ServiceWithMultipleDependencies(dependencyOne, dependencyTwo, dependencyThree) {
      this.toString = function () { return 'ServiceWithMultipleDependencies'; };
    }

    // Act
    var target = new Target();
    var serviceDefinition = target.register({ module: ServiceWithMultipleDependencies });

    // Assert
    should(serviceDefinition).not.be.undefined();
    serviceDefinition.names.should.match(['ServiceWithMultipleDependencies']);
    serviceDefinition.dependencies.should.have.length(3);
    serviceDefinition.dependencies.should.matchAny('dependencyOne');
    serviceDefinition.dependencies.should.matchAny('dependencyTwo');
    serviceDefinition.dependencies.should.matchAny('dependencyThree');

  });

  it('should be possible to register a service which has multiple dependencies and multiline constructor', () => {

    // Arrange
    function ServiceWithMultipleMultilineDependencies(
      dependencyOne,                     dependencyTwo,
      dependencyThree
    ) {
      this.toString = function () { return 'ServiceWithMultipleMultilineDependencies'; };
    }

    // Act
    var target = new Target();
    var serviceDefinition = target.register({ module: ServiceWithMultipleMultilineDependencies });

    // Assert
    should(serviceDefinition).not.be.undefined();
    serviceDefinition.names.should.match(['ServiceWithMultipleMultilineDependencies']);
    serviceDefinition.dependencies.should.have.length(3);
    serviceDefinition.dependencies.should.matchAny('dependencyOne');
    serviceDefinition.dependencies.should.matchAny('dependencyTwo');
    serviceDefinition.dependencies.should.matchAny('dependencyThree');

  });

  it('should be possible to register a service from an external file and resolve it', () => {

    // Act
    var target = new Target();
    target.register({ module: require('./MyServiceTest') });

    var result = target.resolve('MyServiceTest');

    // Assert
    should(result).not.be.undefined();
    result.toString().should.be.equal('MyServiceTest');

  });

  it('should be possible to resolve a service which has no dependencies', () => {

    // Arrange
    function MyService() {
      this.toString = () => 'I am MyService!';
    }

    // Act
    var target = new Target();
    target.register({ module: MyService });

    var result = target.resolve('MyService');

    // Assert
    should(result).not.be.undefined();
    result.toString().should.be.equal('I am MyService!');

  });

  it('should be possible to resolve a service with its previously registered dependencies', () => {

    // Arrange
    function DependencyOne() { this.toString = () => 'I am DependencyOne!'; }

    function DependencyTwo() { this.toString = () => 'I am DependencyTwo!'; }

    function MyService(dependencyOne, dependencyTwo) {

      this.dependency_one = dependencyOne;
      this.dependency_two = dependencyTwo;

      this.toString = () => dependencyOne.toString() + ' and ' + dependencyTwo.toString();

    }

    // Act
    var target = new Target();
    target.register({ module: MyService });
    target.register({ module: DependencyOne });
    target.register({ module: DependencyTwo });

    var result = target.resolve('MyService');

    // Assert
    should(result).not.be.undefined();
    result.should.be.instanceof(MyService);
    result.dependency_one.should.be.instanceof(DependencyOne);
    result.dependency_two.should.be.instanceof(DependencyTwo);

    result.toString().should.be.equal('I am DependencyOne! and I am DependencyTwo!');

  });

  it('should be possible to resolve a service with nested dependencies', () => {

    // Arrange
    function SubDependency() {
      this.toString = () => 'SubDependency';
    }

    function Dependency(subDependency) {
      this.toString = () => 'Dependency -> ' + subDependency.toString();
    }

    function MyService(dependency) {
      this.toString = () => 'MyService -> ' + dependency.toString();
    }

    // Act
    var target = new Target();
    target.register({ module: MyService });
    target.register({ module: Dependency });
    target.register({ module: SubDependency });

    var result = target.resolve('MyService');

    // Assert
    should(result).not.be.undefined();
    result.should.be.instanceof(MyService);

    result.toString().should.be.equal('MyService -> Dependency -> SubDependency');

  });

  it('should be possible to resolve all dependencies as singleton instances', () => {

    // Arrange
    function SharedDependency() {

      var value = 0;

      this.toString = () => {

        value++;
        return `Value: ${value}`;

      };

    }

    function MyServiceA(sharedDependency) {
      this.toString = () => sharedDependency.toString();
    }

    function MyServiceB(sharedDependency) {
      this.toString = () => sharedDependency.toString();
    }

    // Act
    var target = new Target();
    target.register({ module: MyServiceA });
    target.register({ module: MyServiceB });
    target.register({ module: SharedDependency });

    var myServiceA = target.resolve('MyServiceA');
    var myServiceB = target.resolve('MyServiceB');

    // Assert
    myServiceA.toString().should.be.equal('Value: 1');
    myServiceB.toString().should.be.equal('Value: 2');
    myServiceA.toString().should.be.equal('Value: 3');

  });

  it('should be possible to register a service as instance', () => {

    // Arrange
    var dependencyInstance = {
      getValue: () => 5,
    };

    function MyService(dependency) {
      this.toString = () => dependency.getValue();
    }

    // Act
    var target = new Target();
    target.register({ module: MyService });
    target.register({ instance: dependencyInstance, name: 'Dependency' });

    var result = target.resolve('MyService');

    // Assert

    should(result).not.be.undefined();
    result.toString().should.be.equal(5);

  });

  it('should be possible to register a service with a different name', () => {

    // Arrange
    function MyService() {
      this.toString = function () { return 'MyService'; };
    }

    // Act
    var target = new Target();
    var serviceDefinition = target.register({ module: MyService, name: 'custom-name' });

    // Assert
    should(serviceDefinition).not.be.undefined();
    serviceDefinition.names.should.match(['custom-name']);

  });

  it('should be possible to register a service with different names', () => {

    // Arrange
    function WebClientFactoryService() {
      this.toString = function () { return 'WebClientFactoryService'; };
    }

    // Act
    var target = new Target();
    var serviceDefinition = target.register({
      module: WebClientFactoryService,
      names: [
        'WebClientFactoryService',
        'WebClientFactory',
        'Factory',
      ],
    });

    // Assert
    should(serviceDefinition).not.be.undefined();
    serviceDefinition.names.should.match([
      'WebClientFactoryService',
      'WebClientFactory',
      'Factory',
    ]);

  });

  it('should be possible to resolve the same service when this has different names', () => {

    // Arrange
    function WebClientFactoryService() {
      this.toString = function () { return 'WebClientFactoryService'; };
    }

    // Act
    var target = new Target();
    target.register({
      module: WebClientFactoryService,
      names: [
        'WebClientFactoryService',
        'WebClientFactory',
        'Factory',
      ],
    });

    var factory = target.resolve('Factory');
    var webClientFactory = target.resolve('WebClientFactory');
    var webClientFactoryService = target.resolve('WebClientFactoryService');

    // Assert
    should(factory).not.be.undefined();
    should(webClientFactory).not.be.undefined();
    should(webClientFactoryService).not.be.undefined();

    factory.should.be.equal(webClientFactory);
    webClientFactory.should.be.equal(webClientFactoryService);
    webClientFactoryService.should.be.equal(factory);

  });

  it('should be possible to resolve the last registered service when multiple services have the same name', () => {

    // Arrange
    function MyServiceOne() { this.toString = () => 'MyServiceOne'; }

    function MyServiceTwo() { this.toString = () => 'MyServiceTwo'; }

    // Act
    var target = new Target();
    target.register({ module: MyServiceOne, name: 'service' });
    target.register({ module: MyServiceTwo, name: 'service' });

    var result = target.resolve('service');

    // Assert
    should(result).not.be.undefined();
    result.toString().should.be.equal('MyServiceTwo');

  });

  it('should be possible to resolve all services with the same name', () => {

    // Arrange
    function MyServiceOne() { this.toString = () => 'MyServiceOne'; }

    function MyServiceTwo() { this.toString = () => 'MyServiceTwo'; }

    // Act
    var target = new Target();
    target.register({ module: MyServiceOne, name: 'service' });
    target.register({ module: MyServiceTwo, name: 'service' });

    var result = target.resolveAll('service');

    // Assert
    should(result).be.Array();
    should(result).have.length(2);

  });

  it('it should be possible to get a human understandable error when a dependency is missing', () => {

    // Arrange
    function SubServiceOne() { }

    function Service(subServiceOne, subServiceTwo) { }

    function FacadeService(service) { }

    // Act
    var target = new Target();
    target.register({ module: SubServiceOne });
    target.register({ module: Service });
    target.register({ module: FacadeService });

    var action = () => target.resolve('FacadeService');

    // Assert
    should(action).throw(/Missing dependency "subServiceTwo" required by: FacadeService <\- Service/i);

  });

  it('it should be possible to get an empty array when resolveAll() does not find anything', () => {

    // Act
    var target = new Target();
    var result = target.resolveAll('Service');

    // Assert
    should(result).not.be.undefined();
    should(result).have.length(0);

  });

  it('it should be possible to get a human understandable error when a dependency of a service collection is missing', () => {

    // Arrange
    function SubServiceOne(serviceOne) { }

    function SubServiceTwo(serviceTwo) { }

    function ServiceOne() { }

    // Act
    var target = new Target();
    target.register({ module: SubServiceOne, name: 'SubService' });
    target.register({ module: SubServiceTwo, name: 'SubService' });
    target.register({ module: ServiceOne });

    var action = () => target.resolve('SubService');

    // Assert
    should(action).throw(/Missing dependency "serviceTwo"/i);

  });

});
