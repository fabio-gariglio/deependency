'use strict';

var should = require('should');
var Target = require('../lib/Deependency');

describe('Deependency:', () => {

  it('should be possible to get a container by name', () => {

    // Act
    var target = new Target();
    var container = target.container('Test');

    // Assert
    should(container).not.be.undefined();

  });

  it('should be possible to get the same container by name', () => {

    // Act
    var target = new Target();
    var containerOne = target.container('Test');
    var containerTwo = target.container('Test');

    // Assert
    should(containerOne).not.be.undefined();
    should(containerTwo).not.be.undefined();
    should(containerOne).be.equal(containerTwo);

  });

  it('should be possible to get a default container when no name is specified', () => {

    // Act
    var target = new Target();
    var container = target.container();

    // Assert
    should(container).not.be.undefined();

  });

  it('should be possible to register some services and resolve them', () => {

    /*
    *
    * IsoDateProvider <-----+
    *                       +--- DateInstance
    * StringDateProvider <--+
    */

    var container = new Target().container();

    container.register({
      name: 'DateInstance',
      instance: new Date(),
    });

    container.register({
      names: ['DateProvider', 'StringDateProvider'],
      module: class StringDateProvider {
        constructor(dateInstance) {
          this.dateInstance = dateInstance;
        }

        toString () {
          return this.dateInstance.toString();
        }
      },
    });

    container.register({
      names: ['DateProvider', 'IsoDateProvider'],
      module: function IsoDateProvider(dateInstance) {
        this.toString = () => dateInstance.toISOString();
      },
    });

    var dateProviders = container.resolveAll('DateProvider');

  });

});
