# nod

[![NPM version](https://img.shields.io/npm/v/generator-nod.svg?style=flat-square)](https://npmjs.org/package/ggenerator-nod)
[![Build Status](https://img.shields.io/travis/diegohaz/nod/master.svg?style=flat-square)](https://travis-ci.org/diegohaz/nod) [![Coverage Status](https://img.shields.io/codecov/c/github/diegohaz/nod/master.svg?style=flat-square)](https://codecov.io/gh/diegohaz/nod/branch/master)

NodeJS module generator/boilerplate.

<p align="center"><img src="https://cloud.githubusercontent.com/assets/3068563/21958520/77e4f45e-da97-11e6-9685-fe380a9cce3d.gif"></p>

## Features

-   [**Babel**](https://babeljs.io/) - Write next generation JavaScript today;
-   [**Jest**](https://facebook.github.io/jest) - JavaScript testing framework used by Facebook;
-   [**ESLint**](http://eslint.org/) - Make sure you are writing a quality code;
-   [**Flow**](https://flowtype.org/) - A static type checker for JavaScript used heavily within Facebook;
-   [**Travis CI**](https://travis-ci.org) - Automate tests and linting for every push or pull request;
-   [**Documentation**](http://documentation.js.org/) - A documentation system so good, you'll actually write documentation.

## Install

The easiest way to use **nod** is through the Yeoman Generator.

```sh
$ npm install -g yo generator-nod
$ yo nod
```

If you don't want to use the generator, you can also download or `git clone` this repo

```sh
$ git clone https://github.com/diegohaz/nod my-module
$ cd my-module
$ rm -rf .git
$ npm install # or yarn
```

Just make sure to edit `package.json`, `README.md` and `LICENSE` files accordingly with your module's info.

## Commands

```sh
$ npm test # run tests with Jest
$ npm run coverage # run tests with coverage and open it on browser
$ npm run lint # lint code
$ npm run docs # generate docs
$ npm run build # generate docs and transpile code
$ npm run watch # watch code changes and run scripts automatically
$ npm run patch # bump patch version and publish to npm e.g. 0.0.1
$ npm run minor # bump minor version and publish to npm e.g. 0.1.0
$ npm run major # bump major version and publish to npm e.g. 1.0.0
```

## Built with Nod

_You can use those modules as a reference when creating yours. If you have built something with Nod, send a PR (try to write a helpful description for Nod users)._

-   [**styled-tools**](https://github.com/diegohaz/styled-tools) - Module using `flow-typed`, targeted to browser.
-   [**styled-theme**](https://github.com/diegohaz/styled-theme) - Module with `gh-pages`, targeted to browser.
-   [**webpack-blocks-happypack**](https://github.com/diegohaz/webpack-blocks-happypack) - Uses Jest snapshots.
-   [**webpack-blocks-split-vendor**](https://github.com/diegohaz/webpack-blocks-split-vendor) - Has peer dependencies.

[More examples](https://github.com/search?l=Markdown&q=generator-nod-2196F3&type=Code)

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### withSetState

Recompose's setState callback
Note that we have to use withState for this to work
Because withStateHanders does not support callbacks

**Parameters**

-   `initialState`  

### withForm

Build a form

**Parameters**

-   `fields` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** 
-   `options` **{}**  (optional, default `{}`)

Returns **function (any?)** 

### setInitialForm

Set fields with `initialValue` prop

**Parameters**

-   `record` **{}** 
-   `props` **{}** 

Returns **{}** 

### withFormFields

Define field props in an array of objects for form to render later

### getResolvedProps

Pass props to field properties if they are a function

**Parameters**

-   `field` **{}** 
-   `props` **{}** 

Returns **{}** resolvedProps

### withFormHandlers

Define form state and handlers

**Parameters**

-   `fields` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** 

Returns **function (any?)** 

### getPrefilledRecord

Return object with prefilled data

**Parameters**

-   `prefilledData` **{}** 

Returns **{}** 

### Field

Return Semantic UI Field

**Parameters**

-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.onChange`  
    -   `$0.name`  
    -   `$0.path`  
    -   `$0.value`  
    -   `$0.isInRecord`  
    -   `$0.required`  
    -   `$0.hidden`  
    -   `$0.rest` **...any** 

### makeSelectOptionsFromConstants

Make field select options

**Parameters**

-   `data` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** 

### makeSelectOptionsFromNode

Make select field options from a graphql node collection

**Parameters**

-   `data` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** 
-   `textKey` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `valueKey` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**  (optional, default `'id'`)

## License

MIT © [Diego Haz](https://github.com/diegohaz)
