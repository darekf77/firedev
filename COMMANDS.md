# Official firedev commands

## Firedev auto-update

Triger auto-update of firedev's global cli tool and core containers

```
firedev autoupdate
firedev au
```


## Verbose mode

Add -verbose flag to any command to see more of debugging data

```
firedev any-firedev-command -verbose
```

## Creating apps/libs as standalone or smart container (organization) projects

```
firedev new my-standalone-lib-app
firedev new my-workspace/my-workspace-child-lib-app
firedev container my-new-container
```

## Initing / clearing temporary files for project 
Everytime you are starting lib build or you wan't to clear all project
temporary data.. use these commands
```
firedev clear
firedev cl
firedev init # => is a part of lib build and you don't need to use it

```

## Building libs/apps at the same time in one process

Quicket way to start local development of app and lib build in the same process

```
# local lib build
firedev start
firedev start --port 4444
firedev start --websql
firedev s

# global lib build
firedev start:watch 
firedev sw 
```


## Building libs code

Don't waste your local resources and build/serve only things that you need

```
# local lib build
firedev build:dist
firedev bd
firedev build:dist:watch
firedev bdw
firedev build:bundle
firedev bb
firedev build:bundle:watch
firedev bbw

# global lib build
firedev build:watch  
firedev bw

# revert global lib build of package(s) to original state
firedev revert
firedev rev

# app build
firedev build:app
firedev ba
firedev build:app child-project-name
firedev ba child-project-name
firedev build:dist:app
firedev bda
firedev build:dist:app:watch
firedev bdaw
firedev build:bundle:app
firedev bba
firedev build:bundle:app:watch
firedev bbaw
```

## Releasing to npm repository or/and  github/gitlab pages

Easy release of app or libs for standalone/organization projects

```
# path release
firedev release
firedev patch:release
firedev r
firedev release --all   # for release and omit cache
firedev automatic:release
firedev ar

# minor release
firedev minor:release
firedev minor

# major relase
firedev major:release
firedev major

firedev set:major:ver 14 # can be done in container for all pacakges
```

## Github pushing/puling projects

Puling and pushing git repos. Organization projects (smart containers) can be monorepos
or childs can be split just like in containers.

```
firedev pull
firedev push
firedev pullall
firedev reset
firedev rebase
firedev push:feature 
firedev pf
firedev push:fix 
firedev pfix
```

## Testing

Unit/Integration testing

```
firedev test
firedev test:watch
firedev test:watch:debug
```


## Firedev project update

Update firedev project configuration (linked project, firedev framework versiopn etc.)

```
firedev update
firedev up
```

## Firedev extension for Visual Studio Code 

Install vscode plugin

```
firedev vscode:ext
firedev ext
```
