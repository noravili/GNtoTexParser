This repository is a lightweight starting point for AngularJS based projects at Amplify.

Tools:

* [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/README.md) as a build tool.
* [Fastclick](https://github.com/ftlabs/fastclick) to get rid of click delay on mobile browsers.
* [normalize.css](http://necolas.github.io/normalize.css/) to reset CSS styles, for cross-browser consistency.
* [Lodash](http://lodash.com/docents), [jQuery](http://api.jquery.com/), and [AngularJS](https://docs.angularjs.org/guide) as starting dependencies.
* [Karma](http://karma-runner.github.io/0.12/index.html), [jshint](http://www.jshint.com/), and [jasmine](http://jasmine.github.io/) for testing.

# Forking this template

```
1. Create an empty repo.
2. Open Terminal.
3.  $ git clone git@gitorious.poc.currdc.net:sims/MyNewRepo.git
	$ git remote add upstream git@gitorious.poc.currdc.net:sims/web-template.git
	$ git fetch upstream master
	$ git merge upstream/master master
	$ git push
4. Follow the rest of this README to set up the project.
```

# Quick start

### Install required system dependencies (done once per developer machine)

Install `npm`:

```
brew install npm
```

Add `./node_modules/.bin` to the **front** of your `PATH` environment variable:

```
$ cat ~/.bashrc
PATH=./node_modules/.bin:$PATH
```

### After cloning, locally or on the build server

Build platform dependent binaries for the included Node.js modules.

```
$ npm rebuild
```

### Starting a new project

Fork and clone this repository, and:

```
$ gulp init
``` 
The init script will ask you for the app name and page title to use.

```
You should also bump the version to an initial version so that the project starts off with a version.
Please see gulp bump below.
```

### Working on an existing project

Clone the repository, and: 

```
$ gulp dev
```

This puts you into a development loop: live compiling sass, linting js files, and reloading all open browsers when you change files.


### Managing dependencies

The bundled node package `pro-dep` is used to manage `npm` packages and `bower` components.  
Run `dep -h` to display the up to date usage instructions, and read the relevant [README](https://gitorious.poc.currdc.net/prototyping/pro-dep/source/master).


### Creating a build

``` 
$ gulp prod
```
This step creates a `build` directory that is ready for deployment to your web server and launches a server to share it.


### Bumping the version

Move to your release branch, and: 

```
$ gulp bump
```

This will prompt you for the type of version that you want to bump (patch, minor, or major) and update your `bower.json` accordingly.

### Template Notes
```
1. common-web version is not locked to a specific version, however, it is recommended that new project should lock to a specific version.
	bower.json
		"common-web": "git@gitorious.poc.currdc.net:sims/common-web.git#x.x.x",
2. mainController is the controller for all UI elements, the top bar and level select is already set up.
```

### Testing on Devices locally
```
In order to test on devices locally, you will need to first log in through another app, then return to the current app so that you don't need to log in.
```

### Karma Testing
```
When you add modules to the app in app.js, you will also need to add that in karma.conf.js file list otherwise, the test will fail.
```

### Report any issues by contacting [Nick Zalutskiy](nzalutskiy@amplify.com) or [Dan Fast](dfast@amplify.com) or [Chuck Deng](cdeng@amplify.com).




