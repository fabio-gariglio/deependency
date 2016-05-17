# deependency
Deependency is modular and extensible Inversion of Control container for NodeJS.

## Installing

`npm install deependency --save`

## Injecting

    // DateService.js

    module.exports = function DateService() {

      this.get = () => new Date();

    };

    // ISODateService.js

    module.exports = function ISODateService(dateService) {

      this.get = () => dateService.get().toISOString();

    };

    // index.js

    const container = require('Deependency').container();

    // NOTE: Order does not matter during registration ;-)
    container.register({ module: require('./DateService') });
    container.register({ module: require('./ISODateService') });

    var service = container.resolve('ISODateService');

    console.log(`Current ISO Date is: ${service.get()}`);

## Features

#### Dependencies detection

Container expects the service to be declared as function that can be initialized by using `new` keyword. This constructor function can accept one or more arguments that container treats as service dependencies and injects when service has to be resolved.

    function MyService(aDependency) { }

Previous line of code shows a simple constructor function called `MyService` that expects an argument called `aDependency`.
From the container point of view `MyService` is a service that can be initialized by calling `new MyService()` and passing it an instance of `aDependency` service as dependency.

#### Instance registration

Sometimes your services will depend on primitive values, variables or node modules which do not need to be initialized by the container. For all these scenarios just register them as instance:

    container.register({ instance: new Date(), name: 'CurrentDate' });

Please note that you have to specify the instance name as the container cannot detect it by its own.

#### Custom service names

By default the container detects the service name by its constructor name but you can provide one or more custom ones and use them as you wish.

    function FormattedDateService() { ... }

    function MyService(dateService) { ... }

    ...

    container.register({ module: FormattedDateService, names: ['FormattedDateService', 'DateService'] });
    container.register({ module: MyService });

Providing a custom name can be useful if you want to separate dependency name from its implementation. In our example, `MyService` needs a dateService without regards to its formatted or not formatted implementation.

#### Dependency override

You can register more than one service with the same name. When you resolve it the container gives you the lates registered one.

    function StandardDateService() { ... }
    function FormattedDateService() { ... }

    ...

    container.register({ module: StandardDateService, name: 'DateService' });
    container.register({ module: FormattedDateService, name: 'DateService' });

    ...

    container.resolve('DateService'); // <- FormattedDateService


#### Resolve all

As mentioned before, custom service names may be useful in order to abstract a contract from its implementations. Therefore, what about registering a set of validation services which share the same schema and resolve them all?

    function UserNameValidator() { this.isValid = (user) => { ... } }
    function UserEmailValidator() { this.isValid = (user) => { ... } }

    ...

    container.register({ module: UserNameValidator, name: 'UserValidator' });
    container.register({ module: UserEmailValidator, name: 'UserValidator' });

    ...

    var userValidators = container.resolveAll('UserValidator');

    var isUserValid = userValidators.each(validator => validator.isValid(user));

Now we can enrich our user validation by registering a new services named `UserValidator` which have a `isValid(user)` function.
