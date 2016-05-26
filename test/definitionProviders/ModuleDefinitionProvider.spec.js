'use strict';

var should = require('should');
var ModuleDefinitionProvider = require('../../lib/definitionProviders/ModuleDefinitionProvider');

describe('Describing [ModuleDefinitionProvider]', () => {

  context('calling getServiceDefinition(serviceRegistration)', () => {

    context('by providing a serviceRegistration which exposes an object definition', () => {

      context('defined locally', () => {

        function ObjectDefinition() {
          this.toString = () => 'ObjectDefinition';
        }

        var serviceRegistration = {
          module: ObjectDefinition,
        };

        describe('the serviceDefinition', () => {

          var serviceDefinition = null;

          before(() => {

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            serviceDefinition = serviceDefinitionService.getServiceDefinition(serviceRegistration);

          });

          it('should not be null or undefined', () => {

            should(serviceDefinition).be.not.undefined();
            should(serviceDefinition).be.not.null();

          });

          it('should be named as the object constructor name', () => {

            should(serviceDefinition.names).be.Array();
            serviceDefinition.names.should.have.length(1);
            serviceDefinition.names.should.match(['ObjectDefinition']);

          });

          it('should have a factory method', () => {

            should(serviceDefinition.factoryMethod).be.Function();

          });

          it('should allow to get an instance of the registered object', () => {

            var instance = serviceDefinition.factoryMethod();
            should(instance).be.instanceOf(ObjectDefinition);
            instance.toString().should.be.equal('ObjectDefinition');

          });

          it('should always return a new instance', () => {

            var firstTime = serviceDefinition.factoryMethod();
            var secondTime = serviceDefinition.factoryMethod();
            should(secondTime).not.be.equal(firstTime);

          });

        });

      });

      context('defined into an external file', () => {

        var serviceRegistration = {
          module: require('./samples/ExternalObjectDefinition'),
        };

        describe('the serviceDefinition', () => {

          var serviceDefinition = null;

          before(() => {

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            serviceDefinition = serviceDefinitionService.getServiceDefinition(serviceRegistration);

          });

          it('should not be null or undefined', () => {

            should(serviceDefinition).be.not.undefined();
            should(serviceDefinition).be.not.null();

          });

          it('should be named as the object constructor name', () => {

            should(serviceDefinition.names).be.Array();
            serviceDefinition.names.should.have.length(1);
            serviceDefinition.names.should.match(['ExternalObjectDefinition']);

          });

          it('should allow to get a new instance of the registered object', () => {

            var firstTime = serviceDefinition.factoryMethod();
            var secondTime = serviceDefinition.factoryMethod();
            firstTime.toString().should.be.equal('ExternalObjectDefinition');
            should(secondTime).not.be.equal(firstTime);

          });

        });

      });

      context('defined without any dependency', () => {

        describe('the serviceDefinition', () => {

          it('should have an empty dependency list', () => {

            // Arrange
            function ObjectDefinition() { }

            var serviceRegistration = {
              module: ObjectDefinition,
            };

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            var serviceDefinition = serviceDefinitionService.getServiceDefinition(
              serviceRegistration
            );

            // Assert
            serviceDefinition.dependencies.should.have.length(0);

          });

        });

      });

      context('defined with multiple dependencies', () => {

        describe('the serviceDefinition', () => {

          it('should list all its dependencies respecting the signature order', () => {

            // Arrange
            function ObjectDefinition(dependencyOne, dependencyTwo) {
            }

            var serviceRegistration = {
              module: ObjectDefinition,
            };

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            var serviceDefinition = serviceDefinitionService.getServiceDefinition(
              serviceRegistration
            );

            // Assert
            serviceDefinition.dependencies.should.have.length(2);
            serviceDefinition.dependencies[0].should.be.equal('dependencyOne');
            serviceDefinition.dependencies[1].should.be.equal('dependencyTwo');

          });

        });

      });

      context('defined with multiple dependencies in a multiline constructor', () => {

        describe('the serviceDefinition', () => {

          it('should list all its dependencies respecting the signature order', () => {

            // Arrange
            function ObjectDefinition(
              dependencyOne,
              dependencyTwo) { }

            var serviceRegistration = {
              module: ObjectDefinition,
            };

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            var serviceDefinition = serviceDefinitionService.getServiceDefinition(
              serviceRegistration
            );

            // Assert
            serviceDefinition.dependencies.should.have.length(2);
            serviceDefinition.dependencies[0].should.be.equal('dependencyOne');
            serviceDefinition.dependencies[1].should.be.equal('dependencyTwo');

          });

        });

      });

      context('defined anonymous', () => {

        describe('the serviceDefinition', () => {

          it('should not provide any name', () => {

            // Arrange
            var serviceRegistration = {
              module: function () { },
            };

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            var serviceDefinition = serviceDefinitionService.getServiceDefinition(
              serviceRegistration
            );

            // Assert
            should(serviceDefinition).not.be.null();
            serviceDefinition.names.should.have.length(0);

          });

        });

      });

    });

    context('by providing a serviceRegistration which exposes a class definition', () => {

      context('defined locally', () => {

        class ClassDefinition {
          toString () {
            return 'ClassDefinition';
          }
        }

        var serviceRegistration = {
          module: ClassDefinition,
        };

        describe('the serviceDefinition', () => {

          var serviceDefinition = null;

          before(() => {

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            serviceDefinition = serviceDefinitionService.getServiceDefinition(serviceRegistration);

          });

          it('should not be null or undefined', () => {

            should(serviceDefinition).be.not.undefined();
            should(serviceDefinition).be.not.null();

          });

          it('should be named as the class name', () => {

            should(serviceDefinition.names).be.Array();
            serviceDefinition.names.should.have.length(1);
            serviceDefinition.names.should.match(['ClassDefinition']);

          });

          it('should have a factory method', () => {

            should(serviceDefinition.factoryMethod).be.Function();

          });

          it('should allow to get an instance of the registered class', () => {

            var instance = serviceDefinition.factoryMethod();
            should(instance).be.instanceOf(ClassDefinition);
            instance.toString().should.be.equal('ClassDefinition');

          });

          it('should always return a new class instance', () => {

            var firstTime = serviceDefinition.factoryMethod();
            var secondTime = serviceDefinition.factoryMethod();
            should(secondTime).not.be.equal(firstTime);

          });

        });

      });

      context('defined into an external file', () => {

        var serviceRegistration = {
          module: require('./samples/ExternalClassDefinition'),
        };

        describe('the serviceDefinition', () => {

          var serviceDefinition = null;

          before(() => {

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            serviceDefinition = serviceDefinitionService.getServiceDefinition(serviceRegistration);

          });

          it('should not be null or undefined', () => {

            should(serviceDefinition).be.not.undefined();
            should(serviceDefinition).be.not.null();

          });

          it('should be named as the object constructor name', () => {

            should(serviceDefinition.names).be.Array();
            serviceDefinition.names.should.have.length(1);
            serviceDefinition.names.should.match(['ExternalClassDefinition']);

          });

          it('should allow to get a new instance of the registered object', () => {

            var firstTime = serviceDefinition.factoryMethod();
            var secondTime = serviceDefinition.factoryMethod();
            firstTime.toString().should.be.equal('ExternalClassDefinition');
            should(secondTime).not.be.equal(firstTime);

          });

        });

      });

      context('defined without any dependency', () => {

        describe('the serviceDefinition', () => {

          it('should have an empty dependency list', () => {

            // Arrange
            class ClassDefinition {
              constructor() { }
            }

            var serviceRegistration = {
              module: ClassDefinition,
            };

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            var serviceDefinition = serviceDefinitionService.getServiceDefinition(
              serviceRegistration
            );

            // Assert
            serviceDefinition.dependencies.should.have.length(0);

          });

        });

      });

      context('defined with multiple dependencies', () => {

        describe('the serviceDefinition', () => {

          it('should list all its dependencies respecting the signature order', () => {

            // Arrange
            class ClassDefinition {
              constructor(dependencyOne, dependencyTwo) { }
            }

            var serviceRegistration = {
              module: ClassDefinition,
            };

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            var serviceDefinition = serviceDefinitionService.getServiceDefinition(
              serviceRegistration
            );

            // Assert
            serviceDefinition.dependencies.should.have.length(2);
            serviceDefinition.dependencies[0].should.be.equal('dependencyOne');
            serviceDefinition.dependencies[1].should.be.equal('dependencyTwo');

          });

        });

      });

      context('defined with multiple dependencies in a multiline constructor', () => {

        describe('the serviceDefinition', () => {

          it('should list all its dependencies respecting the signature order', () => {

            // Arrange
            class ClassDefinition {
              constructor(
                dependencyOne,
                dependencyTwo) { }
            }

            var serviceRegistration = {
              module: ClassDefinition,
            };

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            var serviceDefinition = serviceDefinitionService.getServiceDefinition(
              serviceRegistration
            );

            // Assert
            serviceDefinition.dependencies.should.have.length(2);
            serviceDefinition.dependencies[0].should.be.equal('dependencyOne');
            serviceDefinition.dependencies[1].should.be.equal('dependencyTwo');

          });

        });

      });

      context('defined anonymous', () => {

        describe('the serviceDefinition', () => {

          it('should not provide any name', () => {

            // Arrange
            var serviceRegistration = {
              module: class { },
            };

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            var serviceDefinition = serviceDefinitionService.getServiceDefinition(
              serviceRegistration
            );

            // Assert
            should(serviceDefinition).not.be.null();
            serviceDefinition.names.should.have.length(0);

          });

        });

      });

    });

    context('by providing a serviceRegistration which exposes a module definition', () => {

      context('defined locally', () => {

        function ModuleDefinition() {

          return {
            toString: function () {
              return 'ModuleDefinition';
            },
          };

        }

        var serviceRegistration = {
          module: ModuleDefinition,
        };

        describe('the serviceDefinition', () => {

          var serviceDefinition = null;

          before(() => {

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            serviceDefinition = serviceDefinitionService.getServiceDefinition(serviceRegistration);

          });

          it('should not be null or undefined', () => {

            should(serviceDefinition).be.not.undefined();
            should(serviceDefinition).be.not.null();

          });

          it('should be named as the module constructor name', () => {

            should(serviceDefinition.names).be.Array();
            serviceDefinition.names.should.have.length(1);
            serviceDefinition.names.should.match(['ModuleDefinition']);

          });

          it('should have a factory method', () => {

            should(serviceDefinition.factoryMethod).be.Function();

          });

          it('should allow to get an instance of the registered module', () => {

            var instance = serviceDefinition.factoryMethod();
            instance.toString().should.be.equal('ModuleDefinition');

          });

          it('should always return a new module instance', () => {

            var firstTime = serviceDefinition.factoryMethod();
            var secondTime = serviceDefinition.factoryMethod();
            should(secondTime).not.be.equal(firstTime);

          });

        });

      });

      context('defined into an external file', () => {

        var serviceRegistration = {
          module: require('./samples/ExternalModuleDefinition'),
        };

        describe('the serviceDefinition', () => {

          var serviceDefinition = null;

          before(() => {

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            serviceDefinition = serviceDefinitionService.getServiceDefinition(serviceRegistration);

          });

          it('should not be null or undefined', () => {

            should(serviceDefinition).be.not.undefined();
            should(serviceDefinition).be.not.null();

          });

          it('should be named as the object constructor name', () => {

            should(serviceDefinition.names).be.Array();
            serviceDefinition.names.should.have.length(1);
            serviceDefinition.names.should.match(['ExternalModuleDefinition']);

          });

          it('should allow to get a new instance of the registered object', () => {

            var firstTime = serviceDefinition.factoryMethod();
            var secondTime = serviceDefinition.factoryMethod();
            firstTime.toString().should.be.equal('ExternalModuleDefinition');
            should(secondTime).not.be.equal(firstTime);

          });

        });

      });

      context('defined without any dependency', () => {

        describe('the serviceDefinition', () => {

          it('should have an empty dependency list', () => {

            // Arrange
            function ModuleDefinition() {
              return { };
            }

            var serviceRegistration = {
              module: ModuleDefinition,
            };

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            var serviceDefinition = serviceDefinitionService.getServiceDefinition(
              serviceRegistration
            );

            // Assert
            serviceDefinition.dependencies.should.have.length(0);

          });

        });

      });

      context('defined with multiple dependencies', () => {

        describe('the serviceDefinition', () => {

          it('should list all its dependencies respecting the signature order', () => {

            // Arrange
            function ModuleDefinition(dependencyOne, dependencyTwo) {
              return { };
            }

            var serviceRegistration = {
              module: ModuleDefinition,
            };

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            var serviceDefinition = serviceDefinitionService.getServiceDefinition(
              serviceRegistration
            );

            // Assert
            serviceDefinition.dependencies.should.have.length(2);
            serviceDefinition.dependencies[0].should.be.equal('dependencyOne');
            serviceDefinition.dependencies[1].should.be.equal('dependencyTwo');

          });

        });

      });

      context('defined with multiple dependencies in a multiline constructor', () => {

        describe('the serviceDefinition', () => {

          it('should list all its dependencies respecting the signature order', () => {

            // Arrange
            function ModuleDefinition(
              dependencyOne,
              dependencyTwo) {
              return { };
            }

            var serviceRegistration = {
              module: ModuleDefinition,
            };

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            var serviceDefinition = serviceDefinitionService.getServiceDefinition(
              serviceRegistration
            );

            // Assert
            serviceDefinition.dependencies.should.have.length(2);
            serviceDefinition.dependencies[0].should.be.equal('dependencyOne');
            serviceDefinition.dependencies[1].should.be.equal('dependencyTwo');

          });

        });

      });

      context('defined anonymous', () => {

        describe('the serviceDefinition', () => {

          it('should not provide any name', () => {

            // Arrange
            var serviceRegistration = {
              module: function () { return { }; },
            };

            // Act
            var serviceDefinitionService = new ModuleDefinitionProvider();
            var serviceDefinition = serviceDefinitionService.getServiceDefinition(
              serviceRegistration
            );

            // Assert
            should(serviceDefinition).not.be.null();
            serviceDefinition.names.should.have.length(0);

          });

        });

      });

    });

  });

});
