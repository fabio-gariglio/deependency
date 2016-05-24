'use strict';

module.exports = function DefinitionProviderCatalog() {

  var definitionProviders = [ ];

  this.add = function (definitionProvider) {

    definitionProviders.push(definitionProvider);

  };

  this.first = function (definitionProviderAction) {

    for (let index = 0; index < definitionProviders.length; index++) {

      let definitionProvider = definitionProviders[index];
      let definitionProviderResult = definitionProviderAction(definitionProvider);

      if (definitionProviderResult) return definitionProviderResult;

    }

    return null;

  };

};
