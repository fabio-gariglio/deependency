'use strict';

module.exports = function RegistrationServiceCatalog() {

  this._registrationServices = [ ];

  this.add = function (registrationService) {

    this._registrationServices.push(registrationService);

  };

  this.first = function (registrationServiceAction) {

    for (let index = 0; index < this._registrationServices.length; index++) {

      let registrationService = this._registrationServices[index];
      let registrationServiceResult = registrationServiceAction(registrationService);

      if (registrationServiceResult) return registrationServiceResult;

    }

    return null;

  };

};
