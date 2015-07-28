# SalesPreso application
> Application structure that allows interconnection with other applications
(combining routes and expressing parent/child relationships)

##### Example
```javascript
import {
  Application, Register, extendClass, getChildrenWithContext
} from "sp-application";
```

## API Reference
  - [`Application`](#application)
    - [`Application.store()`](#applicationstore-object|promise)
    - [`Application.routes()`](#applicationroutes-object|promise)
  - [application.decorators](#applicationdecorators)
    - [`Decorators`](#decorators-applicationdecorators)
        - [`Decorators.parent(String value)`](#decoratorsparentstring-value-function)
        - [`Decorators.application([String value])`](#decoratorsapplicationstring-value-function)
  - [application.register](#applicationregister)
    - [`Register`](#register-applicationregister)
        - [`Register.unregister(String name)`](#registerunregisterstring-name)
        - [`Register.import((string|string[]) paths)`](#registerimportstring|string-paths-promise)
        - [`Register.get(String name)`](#registergetstring-name)
        - [`Register.register(String name, Function module)`](#registerregisterstring-name-function-module)
  - [application.runner](#applicationrunner)
    - [`ApplicationRunner`](#applicationrunner-applicationrunner)
        - [`ApplicationRunner.registered`](#applicationrunnerregistered)
        - [`ApplicationRunner.add(String name, Application module)`](#applicationrunneraddstring-name-application-module)
        - [`ApplicationRunner.createRoutes()`](#applicationrunnercreateroutes-reactelement)
        - [`ApplicationRunner.createStore()`](#applicationrunnercreatestore-object)
  - [application.util](#applicationutil)
    - [`Util`](#util-applicationutil)
        - [`Util.extendClass(Function classA, Function classB)`](#utilextendclassfunction-classa-function-classb)
        - [`Util.getChildrenWithContext(Object scope)`](#utilgetchildrenwithcontextobject-scope)

### `Application`
> Defines the interface needed to connect new components/stores/routes etc.
the to application as a whole. Note in the example that decorators are
called with &quot;@&quot; not &quot;//@&quot;, but the documentation tool will accidently parse
it.

```javascript
//@application()
class Foo {
  static get routes() {
    <Route path="foos" component={MyComponent}>
      <Route path=":id" component={MyComponentDetail} />
    </Route>
  }

  static get store() {
    return {
      hai: true
    };
  }
}
```

##### **Methods**
#### `Application.store() -> Object[]|Promise`
Variables to be added to the store

###### **Returns** `Object[]|Promise`
<br/>

###### Example
```javascript
{
 cursorName: "foo"
}
```
<br/>
#### `Application.routes() -> Object|Promise`
Route definition to be converted to the application routes.

###### **Returns** `Object|Promise`
<br/>

###### Example
```javascript
<Route name="foo" handler={Foo} path="/">
 <Route name="foo-detail" handler={FooDetail} path=":id" />
</Route>
```

***
#### **application.decorators**
### `Decorators` *[application.decorators]*

##### **Methods**
#### `Decorators.parent(String value) -> Function`
Adds the parent value to a class. Used to set a child application
to a parent application. For example, if I have the &#x60;appointments&#x60; app,
after using this decorator @parent(&quot;ui&quot;), it changes it to become
&quot;ui.appointments&quot;. Note in the example that decorators are
called with &quot;@&quot; not &quot;//@&quot;, but the documentation tool will accidently parse
it.

<br/>

###### **Params**

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Parameter</th>
      <th width="70%">Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>String</td>
    <td><code>value</code></td>
    <td></td>
  </tr>
  </tbody>
</table>


###### **Returns** `Function`
<br/>

###### Example
```javascript
//@parent("parentApp")
//@application()
class MyApp {

}
```
<br/>
#### `Decorators.application([String value]) -> Function`
Register an application, adding it to the application
runner. Note in the example that decorators are
called with &quot;@&quot; not &quot;//@&quot;, but the documentation tool will accidently parse
it.

<br/>

###### **Params**

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Parameter</th>
      <th width="70%">Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>String</td>
    <td><code>value</code></td>
    <td>Name of the application (must be unique). If not
supplied, then uses the lowercase name of the class</td>
  </tr>
  </tbody>
</table>


###### **Returns** `Function`
<br/>

###### Example
```javascript
//@application()
class MyApp {

}
```

***
#### **application.register**
### `Register` *[application.register]*
> Global registration class. Used for dynamically importing
applications and middleware on startup.


##### **Methods**
#### `Register.unregister(String name)`
Unregister a module

<br/>

###### **Params**

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Parameter</th>
      <th width="70%">Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>String</td>
    <td><code>name</code></td>
    <td></td>
  </tr>
  </tbody>
</table>

<br/>
#### `Register.import((string|string[]) paths) -> Promise`
Dynamically loads a module

<br/>

###### **Params**

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Parameter</th>
      <th width="70%">Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>(string|string[])</td>
    <td><code>paths</code></td>
    <td>Module(s) to import</td>
  </tr>
  </tbody>
</table>


###### **Returns** `Promise`


<br/>
#### `Register.get(String name)`
Return a registered plugin

<br/>

###### **Params**

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Parameter</th>
      <th width="70%">Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>String</td>
    <td><code>name</code></td>
    <td></td>
  </tr>
  </tbody>
</table>

<br/>
#### `Register.register(String name, Function module)`
Register a plugin

<br/>

###### **Params**

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Parameter</th>
      <th width="70%">Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>String</td>
    <td><code>name</code></td>
    <td></td>
  </tr>
  <tr>
    <td>Function</td>
    <td><code>module</code></td>
    <td></td>
  </tr>
  </tbody>
</table>


***
#### **application.runner**
### `ApplicationRunner` *[application.runner]*
##### **Properties**
#### `ApplicationRunner.registered`


<br/>
##### **Methods**
#### `ApplicationRunner.add(String name, Application module)`


<br/>

###### **Params**

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Parameter</th>
      <th width="70%">Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>String</td>
    <td><code>name</code></td>
    <td></td>
  </tr>
  <tr>
    <td>Application</td>
    <td><code>module</code></td>
    <td></td>
  </tr>
  </tbody>
</table>

<br/>
#### `ApplicationRunner.createRoutes() -> ReactElement[]`


###### **Returns** `ReactElement[]`


<br/>
#### `ApplicationRunner.createStore() -> Object`


###### **Returns** `Object`



***
#### **application.util**
### `Util` *[application.util]*

##### **Methods**
#### `Util.extendClass(Function classA, Function classB)`
Copies all static and prototype methods/fields from classB
to classA IF they don&#x27;t already exist. Consider this like
_.defaults in lodash for classes.

<br/>

###### **Params**

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Parameter</th>
      <th width="70%">Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>Function</td>
    <td><code>classA</code></td>
    <td>The class to extend</td>
  </tr>
  <tr>
    <td>Function</td>
    <td><code>classB</code></td>
    <td>The class we&#x27;re copying</td>
  </tr>
  </tbody>
</table>

<br/>
#### `Util.getChildrenWithContext(Object scope)`
Displays children of a react component, passing along all of the parent&#x27;s contexts.
This is not done in 0.13.x, but 0.14 will make this method unecessary.

<br/>

###### **Params**

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Parameter</th>
      <th width="70%">Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>Object</td>
    <td><code>scope</code></td>
    <td></td>
  </tr>
  </tbody>
</table>


