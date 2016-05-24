'use strict';

module.export = class ClassDefinition {

  constructor(aDependency) {
    this.aDependency = aDependency;
  }

  toString() {
    return this.aDependency.toString();
  }

};
