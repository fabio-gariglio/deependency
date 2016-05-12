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
    serviceDefinition.name.should.be.equal('ServiceWithoutDependencies');
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
    serviceDefinition.name.should.be.equal('ServiceWithOneDependency');
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
    serviceDefinition.name.should.be.equal('ServiceWithMultipleDependencies');
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
    serviceDefinition.name.should.be.equal('ServiceWithMultipleMultilineDependencies');
    serviceDefinition.dependencies.should.have.length(3);
    serviceDefinition.dependencies.should.matchAny('dependencyOne');
    serviceDefinition.dependencies.should.matchAny('dependencyTwo');
    serviceDefinition.dependencies.should.matchAny('dependencyThree');

  });

  it('should be possible to resolve a service which has no dependencies', () => {

    // Arrange
    function MyService() {
      this.toString = () => 'I am MyService!';
    };

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
    function DependencyOne() { this.toString = () => 'I am DependencyOne!'; };

    function DependencyTwo() { this.toString = () => 'I am DependencyTwo!'; };

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

});
