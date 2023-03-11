# Official firedev commands

## Update of firedev

Update of global cli tool and core containers

```
firedev update
```

## Creating apps/libs as standalone or smart container (organization) projects

```
firedev new my-standalone-lib-app
firedev new my-workspace/my-workspace-child-lib-app
firedev container my-new-container
```

## Building libs/apps at the same time in one process

Quicket way to start development

```
firedev start
firedev start --port 4444
firedev start --websql
```

## Building apps

Don't waste your local resources and build/serve only things that you need

```
firedev build:dist
firedev bd
firedev build:dist:watch
firedev bdw
firedev build:bundle
firedev bb
firedev build:bundle:watch
firedev bbw
firedev build:watch
firedev bw
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

## Releasing to npm / github pages

Easy release of app or libs

```
firedev release
firedev patch:release
firedev r
firedev release --all
firedev minor:release
firedev major:release
firedev automatic:release
firedev ar
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
