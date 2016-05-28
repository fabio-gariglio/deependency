# deependency
Deependency is modular and extensible Inversion of Control container for NodeJS.

This container does not require any other library it is just few kilobytes of pure javascript code.

Tell the container what are your NodeJS modules and simply use them where you need.
It only needs to know how to create your module and which other modules it depends on.
Look at following NodeJS modules:

```js
// iAmAService.js
module.exports = function IAmAService(logger) {

  this.doStuff = function() {

    logger.info('I finally have stuff to do!')

  };

};
```

The first line of code tells the container everything it needs:
Your service name is `IAmAService` and it depends on another service called `logger`.
Also notice previous code does not create any instance of your service because the container will do for you.
Let it deal with the complexity of create the instance as singleton or transient,
providing dependencies it needs and dependencies its dependencies need and so on.

## Installation

```bash
$ npm install deependency
```

## Creating a container

Surprisingly the first thing we need is a container so let's ask **Deependency**
to create a brand new one for us.

```js
const container = require('Deependency').container();
```

This container is our personal registry office. We will tell the container what
are our project services along with other useful information and, when needed,
we will be able to ask to provide us the service we need by its name.

## Registering services

Our container is useless without knowledge of what services it has to take care of.
Therefore, first of all we should tell it what are our project services.
This phase is called **Registration** for which the container exposes `register(registrationRequest, registrationOptions)` function.

Let's assume we have following module in our project:

```js
// iAmAService.js
module.exports = function IAmAService() {

  // ...

};
```

Then, in our main file we can register our external service into our container previously created:

```js
container.register({ module: require('./iAmAService.js') });
```

First argument is our registration request and is used by the container to detect the service name,
its dependencies and a way to initialize it. It creates a definition of the service and stores it for future uses.

## Resolving a service

With previous step the container is now aware of a service called `IAmAService` so now we can ask to
resolve it. This phase is called **resolution** and container let us obtain an instance of our service
through `resolve(serviceName)` function.

```js
var service = container.resolve('IAmAService');
```

## Features

#### Service definition by convention

As mentioned before the container is able to detect information about service you are registering as long as the service code follows a specific convention.
It expects an object contructor, a class or module pattern which has any number of dependencies as arguments.
Following are three different service definition the container is able to recognize:

```js
module.exports = class ClassDefinition {

  constructor(myDependency) { }

  toString() {
    return 'ExternalClassDefinition';
  }

};

module.exports = function ModuleDefinition(myDependency) {

  return {
    toString: function () {
      return 'ExternalModuleDefinition';
    },
  };

};

module.exports = function ObjectDefinition(myDependency) {

  this.toString = function () {
    return 'ExternalObjectDefinition';
  };

};
```

**NOTE** This is just a default convention. Deependency is designed to allow any service definition. It currently supports `ModuleDefinition` and `InstanceDefinition` but in next release you will be able to define your own convention `;-)`.


#### Instance registration

Sometimes your services will depend on primitive values, variables or node modules which do not need to be initialized by the container. For all these scenarios just register them as instance:

```js
container.register({ instance: new Date() }, { name: 'CurrentDate' });
```

Please note that you have to specify the instance name as the container cannot detect it by its own.

#### Custom service names

By default the container detects the service name by its constructor name but you can provide one or more custom ones and use them as you wish.

```js
function FormattedDateService() { ... }

function MyService(dateService) { ... }

// ...

container.register({ module: FormattedDateService }, { names: ['FormattedDateService', 'DateService'] });
container.register({ module: MyService });
```

Providing a custom name can be useful if you want to separate dependency name from its implementation. In our example, `MyService` needs a dateService without regards to its formatted or not formatted implementation.

#### Service override

You can register more than one service with the same name. When you resolve it the container gives you the latest registered one.

```js
function StandardDateService() { ... }
function FormattedDateService() { ... }

// ...

container.register({ module: StandardDateService }, { name: 'DateService' });
container.register({ module: FormattedDateService }, { name: 'DateService' });

// ...

container.resolve('DateService'); // <- FormattedDateService
```

#### Resolve all

As mentioned before, custom service names may be useful in order to abstract a contract from its implementations. Therefore, what about registering a set of validation services which share the same interface and resolve them all?

```js
function UserNameValidator() { this.isValid = (user) => { ... } }
function UserEmailValidator() { this.isValid = (user) => { ... } }

// ...

container.register({ module: UserNameValidator }, { name: 'UserValidator' });
container.register({ module: UserEmailValidator }, { name: 'UserValidator' });

// ...

var userValidators = container.resolveAll('UserValidator');

var isUserValid = userValidators.each(validator => validator.isValid(user));
```

Now we can enrich our user validation by registering a new services named `UserValidator` which has an `isValid(user)` function.

#### Transient services

A service can be registered as transient. This means that every time you ask the container to resolve that service then
it will provide a fresh new instance.

```js
function MyTransientService() { }

container.register({ module: MyTransientService }, { transient: true });

var firstTime = container.resolve('MyTransientService');
var secondTime = container.resolve('MyTransientService');

// firstTime != secondTime
```

#### Inline dependencies

You can explicitly provide dependencies at resolution time. This allows you to define a service scope.
Dependencies you explicitly declare will be propagated to all dependencies created as effect of your service resolution.

```js
function IndexController(user) {

  this.get = function () {

    var message = getWelcomeMessage();

    return Promise.resolve(message)

  };

  var getWelcomeMessage = function () {

    return `Welcome ${user.username} !`;

  };

}

container.register({ module: IndexController }, { transient: true });

express.get('/index', (request, response) => {

  var index = container.resolve('IndexController', { user: request.user });

  index.get().then(
    result => {
      response.send(result);
    },
    error => {
      response.status(500);
      response.send(error.message);      
    }
  );

});
```
