'use strict';

module.exports = function DefinitionProviderCatalog(definitionProviders) {

  var _definitionProviders = definitionProviders ? definitionProviders.slice(0) : [];

  this.add = function (definitionProvider) {

    _definitionProviders.push(definitionProvider);

  };

  this.all = function () {

    return _definitionProviders;

  };

  this.clear = function () {

    _definitionProviders = [];

  };

  this.first = function (definitionProviderAction) {

    for (let index = 0; index < _definitionProviders.length; index++) {

      let definitionProvider = _definitionProviders[index];
      let definitionProviderResult = definitionProviderAction(definitionProvider);

      if (definitionProviderResult) return definitionProviderResult;

    }

    return null;

  };

};
