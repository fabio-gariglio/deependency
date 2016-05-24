'use strict';

var should = require('should');
var ModuleRegistrationService = require('../../lib/registrationServices/ModuleRegistrationService');

describe('Describing [ModuleRegistrationService]', () => {

  context('calling getRegistration(serviceRegistration)', () => {

    context('by providing a serviceRegistration which exposes an object definition', () => {

      context('defined locally', () => {

        function ObjectDefinition() {
          this.toString = () => 'ObjectDefinition';
        }

        var serviceRegistration = {
          module: ObjectDefinition,
        };

        describe('the registration', () => {

          var registration = null;

          before(() => {

            // Act
            var registrationService = new ModuleRegistrationService();
            registration = registrationService.getRegistration(serviceRegistration);

          });

          it('should not be null or undefined', () => {

            should(registration).be.not.undefined();
            should(registration).be.not.null();

          });

          it('should be named as the object constructor name', () => {

            should(registration.names).be.Array();
            registration.names.should.have.length(1);
            registration.names.should.match(['ObjectDefinition']);

          });

          it('should be singleton by default', () => {

            should(registration.isSingleton).be.true();

          });

          it('should have a factory method', () => {

            should(registration.factoryMethod).be.Function();

          });

          it('should allow to get an instance of the registered object', () => {

            var instance = registration.factoryMethod();
            should(instance).be.instanceOf(ObjectDefinition);
            instance.toString().should.be.equal('ObjectDefinition');

          });

          it('should always return a new instance', () => {

            var firstTime = registration.factoryMethod();
            var secondTime = registration.factoryMethod();
            should(secondTime).not.be.equal(firstTime);

          });

        });

      });

      context('defined into an external file', () => {

        var serviceRegistration = {
          module: require('./samples/ExternalObjectDefinition'),
        };

        describe('the registration', () => {

          var registration = null;

          before(() => {

            // Act
            var registrationService = new ModuleRegistrationService();
            registration = registrationService.getRegistration(serviceRegistration);

          });

          it('should not be null or undefined', () => {

            should(registration).be.not.undefined();
            should(registration).be.not.null();

          });

          it('should be named as the object constructor name', () => {

            should(registration.names).be.Array();
            registration.names.should.have.length(1);
            registration.names.should.match(['ExternalObjectDefinition']);

          });

          it('should allow to get a new instance of the registered object', () => {

            var firstTime = registration.factoryMethod();
            var secondTime = registration.factoryMethod();
            firstTime.toString().should.be.equal('ExternalObjectDefinition');
            should(secondTime).not.be.equal(firstTime);

          });

        });

      });

      context('defined without any dependency', () => {

        describe('the registration', () => {

          it('should have an empty dependency list', () => {

            // Arrange
            function ObjectDefinition() { }

            var serviceRegistration = {
              module: ObjectDefinition,
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.dependencies.should.have.length(0);

          });

        });

      });

      context('defined with multiple dependencies', () => {

        describe('the registration', () => {

          it('should list all its dependencies respecting the signature order', () => {

            // Arrange
            function ObjectDefinition(dependencyOne, dependencyTwo) {
            }

            var serviceRegistration = {
              module: ObjectDefinition,
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.dependencies.should.have.length(2);
            registration.dependencies[0].should.be.equal('dependencyOne');
            registration.dependencies[1].should.be.equal('dependencyTwo');

          });

        });

      });

      context('defined with multiple dependencies in a multiline constructor', () => {

        describe('the registration', () => {

          it('should list all its dependencies respecting the signature order', () => {

            // Arrange
            function ObjectDefinition(
              dependencyOne,
              dependencyTwo) { }

            var serviceRegistration = {
              module: ObjectDefinition,
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.dependencies.should.have.length(2);
            registration.dependencies[0].should.be.equal('dependencyOne');
            registration.dependencies[1].should.be.equal('dependencyTwo');

          });

        });

      });

      context('defined anonymous without specifying any name', () => {

        describe('the registration', () => {

          it('should be null', () => {

            // Arrange
            var serviceRegistration = {
              module: function () { },
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            should(registration).be.null();

          });

        });

      });

      context('defined anonymous but specifying a custom name', () => {

        describe('the registration', () => {

          it('should contain provided name', () => {

            // Arrange
            var serviceRegistration = {
              module: function () { },
              name: 'MyObjectDefinition',
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.names.should.have.length(1);
            registration.names.should.matchAny('MyObjectDefinition');

          });

        });

      });

      context('and specifying a custom name as well', () => {

        describe('the registration', () => {

          it('should contain provided name', () => {

            // Arrange
            function ObjectDefinition() { }

            var serviceRegistration = {
              module: ObjectDefinition,
              name: 'MyObjectDefinition',
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.names.should.have.length(1);
            registration.names.should.matchAny('MyObjectDefinition');

          });

        });

      });

      context('and specifying multiple custom names as well', () => {

        describe('the registration', () => {

          it('should contain all provided names', () => {

            // Arrange
            function ObjectDefinition() { }

            var serviceRegistration = {
              module: ObjectDefinition,
              names: ['MyDefinition', 'MyObjectDefinition'],
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.names.should.have.length(2);
            registration.names.should.matchAny('MyDefinition');
            registration.names.should.matchAny('MyObjectDefinition');

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

        describe('the registration', () => {

          var registration = null;

          before(() => {

            // Act
            var registrationService = new ModuleRegistrationService();
            registration = registrationService.getRegistration(serviceRegistration);

          });

          it('should not be null or undefined', () => {

            should(registration).be.not.undefined();
            should(registration).be.not.null();

          });

          it('should be named as the class name', () => {

            should(registration.names).be.Array();
            registration.names.should.have.length(1);
            registration.names.should.match(['ClassDefinition']);

          });

          it('should be singleton by default', () => {

            should(registration.isSingleton).be.true();

          });

          it('should have a factory method', () => {

            should(registration.factoryMethod).be.Function();

          });

          it('should allow to get an instance of the registered class', () => {

            var instance = registration.factoryMethod();
            should(instance).be.instanceOf(ClassDefinition);
            instance.toString().should.be.equal('ClassDefinition');

          });

          it('should always return a new class instance', () => {

            var firstTime = registration.factoryMethod();
            var secondTime = registration.factoryMethod();
            should(secondTime).not.be.equal(firstTime);

          });

        });

      });

      context('defined into an external file', () => {

        var serviceRegistration = {
          module: require('./samples/ExternalClassDefinition'),
        };

        describe('the registration', () => {

          var registration = null;

          before(() => {

            // Act
            var registrationService = new ModuleRegistrationService();
            registration = registrationService.getRegistration(serviceRegistration);

          });

          it('should not be null or undefined', () => {

            should(registration).be.not.undefined();
            should(registration).be.not.null();

          });

          it('should be named as the object constructor name', () => {

            should(registration.names).be.Array();
            registration.names.should.have.length(1);
            registration.names.should.match(['ExternalClassDefinition']);

          });

          it('should allow to get a new instance of the registered object', () => {

            var firstTime = registration.factoryMethod();
            var secondTime = registration.factoryMethod();
            firstTime.toString().should.be.equal('ExternalClassDefinition');
            should(secondTime).not.be.equal(firstTime);

          });

        });

      });

      context('defined without any dependency', () => {

        describe('the registration', () => {

          it('should have an empty dependency list', () => {

            // Arrange
            class ClassDefinition {
              constructor() { }
            }

            var serviceRegistration = {
              module: ClassDefinition,
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.dependencies.should.have.length(0);

          });

        });

      });

      context('defined with multiple dependencies', () => {

        describe('the registration', () => {

          it('should list all its dependencies respecting the signature order', () => {

            // Arrange
            class ClassDefinition {
              constructor(dependencyOne, dependencyTwo) { }
            }

            var serviceRegistration = {
              module: ClassDefinition,
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.dependencies.should.have.length(2);
            registration.dependencies[0].should.be.equal('dependencyOne');
            registration.dependencies[1].should.be.equal('dependencyTwo');

          });

        });

      });

      context('defined with multiple dependencies in a multiline constructor', () => {

        describe('the registration', () => {

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
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.dependencies.should.have.length(2);
            registration.dependencies[0].should.be.equal('dependencyOne');
            registration.dependencies[1].should.be.equal('dependencyTwo');

          });

        });

      });

      context('defined anonymous without specifying any name', () => {

        describe('the registration', () => {

          it('should be null', () => {

            // Arrange
            var serviceRegistration = {
              module: class { },
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            should(registration).be.null();

          });

        });

      });

      context('defined anonymous but specifying a custom name', () => {

        describe('the registration', () => {

          it('should contain provided name', () => {

            // Arrange
            var serviceRegistration = {
              module: class { },
              name: 'MyClassDefinition',
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.names.should.have.length(1);
            registration.names.should.matchAny('MyClassDefinition');

          });

        });

      });

      context('and specifying a custom name as well', () => {

        describe('the registration', () => {

          it('should contain provided name', () => {

            // Arrange
            class ClassDefinition { }

            var serviceRegistration = {
              module: ClassDefinition,
              name: 'MyClassDefinition',
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.names.should.have.length(1);
            registration.names.should.matchAny('MyClassDefinition');

          });

        });

      });

      context('and specifying multiple custom names as well', () => {

        describe('the registration', () => {

          it('should contain all provided names', () => {

            // Arrange
            class ClassDefinition { }

            var serviceRegistration = {
              module: ClassDefinition,
              names: ['MyDefinition', 'MyClassDefinition'],
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.names.should.have.length(2);
            registration.names.should.matchAny('MyDefinition');
            registration.names.should.matchAny('MyClassDefinition');

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

        describe('the registration', () => {

          var registration = null;

          before(() => {

            // Act
            var registrationService = new ModuleRegistrationService();
            registration = registrationService.getRegistration(serviceRegistration);

          });

          it('should not be null or undefined', () => {

            should(registration).be.not.undefined();
            should(registration).be.not.null();

          });

          it('should be named as the module constructor name', () => {

            should(registration.names).be.Array();
            registration.names.should.have.length(1);
            registration.names.should.match(['ModuleDefinition']);

          });

          it('should be singleton by default', () => {

            should(registration.isSingleton).be.true();

          });

          it('should have a factory method', () => {

            should(registration.factoryMethod).be.Function();

          });

          it('should allow to get an instance of the registered module', () => {

            var instance = registration.factoryMethod();
            instance.toString().should.be.equal('ModuleDefinition');

          });

          it('should always return a new module instance', () => {

            var firstTime = registration.factoryMethod();
            var secondTime = registration.factoryMethod();
            should(secondTime).not.be.equal(firstTime);

          });

        });

      });

      context('defined into an external file', () => {

        var serviceRegistration = {
          module: require('./samples/ExternalModuleDefinition'),
        };

        describe('the registration', () => {

          var registration = null;

          before(() => {

            // Act
            var registrationService = new ModuleRegistrationService();
            registration = registrationService.getRegistration(serviceRegistration);

          });

          it('should not be null or undefined', () => {

            should(registration).be.not.undefined();
            should(registration).be.not.null();

          });

          it('should be named as the object constructor name', () => {

            should(registration.names).be.Array();
            registration.names.should.have.length(1);
            registration.names.should.match(['ExternalModuleDefinition']);

          });

          it('should allow to get a new instance of the registered object', () => {

            var firstTime = registration.factoryMethod();
            var secondTime = registration.factoryMethod();
            firstTime.toString().should.be.equal('ExternalModuleDefinition');
            should(secondTime).not.be.equal(firstTime);

          });

        });

      });

      context('defined without any dependency', () => {

        describe('the registration', () => {

          it('should have an empty dependency list', () => {

            // Arrange
            function ModuleDefinition() {
              return { };
            }

            var serviceRegistration = {
              module: ModuleDefinition,
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.dependencies.should.have.length(0);

          });

        });

      });

      context('defined with multiple dependencies', () => {

        describe('the registration', () => {

          it('should list all its dependencies respecting the signature order', () => {

            // Arrange
            function ModuleDefinition(dependencyOne, dependencyTwo) {
              return { };
            }

            var serviceRegistration = {
              module: ModuleDefinition,
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.dependencies.should.have.length(2);
            registration.dependencies[0].should.be.equal('dependencyOne');
            registration.dependencies[1].should.be.equal('dependencyTwo');

          });

        });

      });

      context('defined with multiple dependencies in a multiline constructor', () => {

        describe('the registration', () => {

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
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.dependencies.should.have.length(2);
            registration.dependencies[0].should.be.equal('dependencyOne');
            registration.dependencies[1].should.be.equal('dependencyTwo');

          });

        });

      });

      context('defined anonymous without specifying any name', () => {

        describe('the registration', () => {

          it('should be null', () => {

            // Arrange
            var serviceRegistration = {
              module: function () { return { }; },
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            should(registration).be.null();

          });

        });

      });

      context('defined anonymous but specifying a custom name', () => {

        describe('the registration', () => {

          it('should contain provided name', () => {

            // Arrange
            var serviceRegistration = {
              module: function () { return { }; },
              name: 'MyModuleDefinition',
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.names.should.have.length(1);
            registration.names.should.matchAny('MyModuleDefinition');

          });

        });

      });

      context('and specifying a custom name as well', () => {

        describe('the registration', () => {

          it('should contain provided name', () => {

            // Arrange
            function ModuleDefinition() {
              return { };
            }

            var serviceRegistration = {
              module: ModuleDefinition,
              name: 'MyModuleDefinition',
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.names.should.have.length(1);
            registration.names.should.matchAny('MyModuleDefinition');

          });

        });

      });

      context('and specifying multiple custom names as well', () => {

        describe('the registration', () => {

          it('should contain all provided names', () => {

            // Arrange
            function ModuleDefinition() {
              return { };
            }

            var serviceRegistration = {
              module: ModuleDefinition,
              names: ['MyDefinition', 'MyModuleDefinition'],
            };

            // Act
            var registrationService = new ModuleRegistrationService();
            var registration = registrationService.getRegistration(serviceRegistration);

            // Assert
            registration.names.should.have.length(2);
            registration.names.should.matchAny('MyDefinition');
            registration.names.should.matchAny('MyModuleDefinition');

          });

        });

      });

    });

  });

});
