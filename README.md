<p style="text-align: center;"><img src="./__images/logo-wide.jpg" ></p>

( BETA VERSION )

**Firedev** 🔥🔥🔥 is a solution for

\+
[typescript](https://www.typescriptlang.org/)  

\+
[angular](https://angular.io/) 

\+
[rxjs](https://rxjs.dev/)  / [ngrx](https://ngrx.io/) (optional) 

\+
[nodejs](https://nodejs.org/en/)

\+ [typeorm](https://typeorm.io/)
- [sqlite](https://github.com/WiseLibs/better-sqlite3) - SUPPORTED
- [sql.js](https://sql.js.org) - SUPPORTED IN WEBSQL MODE
- [mysql](https://www.mysql.com/) - support in progress
- [postgress](https://www.postgresql.org) - support in progress
- [mongo](https://www.postgresql.org) - support in progress


backend/frontend [*isomorphic](https://en.wikipedia.org/wiki/Isomorphic_JavaScript)  apps .


# Required version of NodeJS** 
- Windows 10/11 (gitbash): >= v16 
- MacOS: >= v16
- Linux: >= v16

*lower versions of NodeJS are unofficialy 
support for MacOS/Linux
# How to install firedev
```
npm i -g firedev
```

# How to install firedev Visual Studio Code extension
Go to: https://marketplace.visualstudio.com/items?itemName=firedev.firedev-vscode-ext

(WARNING before using *firedev-vscode-ext*, please at lease once 
execute **any** command of **firedev** in your temrinal)

<p style="text-align: center;border: 1px solid black;"><img src="./__images/vscode-ext.png" ></p>

#  How to uninstall firedev from local machine
Firedev stores a big global container (in ~/.firedev) for npm packages that are being shared 
accros all firedev apps
```
npm uninstall -g firedev
rm -rf ~/.firedev  # firedev local packages repository
```

# Philosophy of Firedev
=> One language for browser/backend/database - **TypeScript**

=> Builded on top of rock solid frameworks

=> **Never** ever **repeat** single line of **code**

=> Everything automatically generated, strongly typed

=> Crazy fast / developer-friendly coding in <b>Visual Studio Code</b>

=> Shared <b>node_modules</b> for similar projects (from one big npm pacakges container)

=>**No need for local node_modules** => many projects takes megabytes instead gigabytes

=> Automation for releasing projects (standalone and organization) to github pages / npm repositories (github actions, dockers support comming soon)

=> Develop libraries and apps at the same time! (mixed NodeJs packages with proper Angular ivy packages)

=> Assets from project can be shared with npm package! (only those from **/src/assets/shared**)

=> Two development modes
  1. NORMAL - sqlite/mysql for database and normal NodeJS server
  ```
  firedev start # in any project
  ```
  2. WEBSQL - sql.js for database/server in browser development mode
  ```
  firedev start --websql  # in any project
  ```


=> WEBSQL mode is a perfect solution for:

*\+ github pages serverless demo apps with "almost" full functionality!* 

*\+ e2e/integration tests*

*\+ local NodeJS/database development without starting NodeJS server!*

# Advantages of Firedev
## 1. No separation between backend and frontend code 
- use BE entity as FE dto!
- this is a dream situation for any developer!
- perfect solution for any kind of projects ( hobbyst / freelancers / enterprise )
- CRAZY FAST business changes across database tables and frontend 
Angular templates - CHECK!
- frontend/backend/database code refactor at the same time!

<b>example.ts</b>

```ts
import { Firedev } from 'firedev';

@Firedev.Entity()
class User {
  //#region @backend
  @Firedev.Orm.Column.Generated()
  //#endregion
  id: string;
}

```

your browser will get code below:
```ts
import { Firedev } from 'firedev/browser';

@Firedev.Entity()
class User {
  /* */
  /* */
  /* */
  id: string;
}

```

## ..same thing applies in reverse to browser code

<b>common.service.ts</b>

```ts
import { Firedev } from 'firedev';
//@region @browser
import { Injectable } from '@angular/core';
//#endregion

//@region @browser
@Injectable()
//#endregion
class CommonService {
  helloWorld() { 
    console.log('Hello on backend and frontend')
  }
}

```

your backend will get code below:
```ts
import { Firedev } from 'firedev';
/* */
/* */
/* */

/* */
/* */
/* */
class CommonService {
  helloWorld() { 
    console.log('Hello on backend and frontend')
  }
}

```

## 2. Additional "Websql Mode" for writing backend in browser!
- Instead running local server - run everything (db,backend) in browser thanks to sql.js/typeorm !
- This is possible ONLY in firedev with highest possible abstraction concepts

<b>example.ts</b>

```ts
import { Firedev } from 'firedev';

@Firedev.Entity()
class User {
  //#region @websql
  @Firedev.Orm.Column.Generated()
  //#endregion
  id: string;
}

```

your browser will get code below:
```ts
import { Firedev } from 'firedev/websql';


@Firedev.Entity()
class User {
 //#region @websql
  @Firedev.Orm.Column.Generated()
  //#endregion
  id: string;
}

```
Database columns can be created in browser/frontend with sql.js !

<p style="text-align: center;"><img src="./__images/admin-mode.png" ></p>

\+ also you can set in *Firedev Admin Mode* if you prefere to 
 clear database after each page refresh.


## 3. Smooth REST api
- define host only once for backend and frontend!
- no more of ugly acces to server... firedev takes it to next level !
- in Angular/RxJS environemtn => it more than pefect solution !

user.controller.ts
```ts
@Firedev.Controller({
  entity: User
})
class UserController {
                      
                      // name 'helloAmazingWorld' 
                      // from this class function 
                      // is being use for creating
  @Firedev.Http.GET() // expressjs server routes 
  helloAmazingWorld():Firedev.Response<string> {  
    //region @backendFunc
    return async () => {
      return `hello world`;
    };
    //#endregion
  }

}
```

user.ts
```ts
@Firedev.Entity()
class User {
  static ctrl: UserController; // automatically injected
  static helloAmazingWorld() {
    return this.ctrl.helloAmazingWorld().received.observable;
  } 
}
```

user.component.ts
```ts
@Component({
  selector: 'app-user',
  template: `
  Message from user:  {{ userHello$ | async }}  
  `
  ...
})
export class UserComponent implements OnInit {
   userHello$ = User.helloAmazingWorld();
   ...
}
```


app.module.ts
```ts
const host = 'http://localhost:4444'; // host defined once!

const context = await Firedev.init({
    host,
    controllers: [UserController],
    entities: [User],
    //#region @backend
    config // for database configuration
    //#endregion
    ...
  });

context.host // -> available on backend and frontend !


```
## 4. CRUD api in 60 seconds or less...
- use observable or promises .. .whatever you like
```ts
@Firedev.Entity()
class Task {
  ctrl: TaskController; // injected automatically
  //#region @backend
  @Firedev.Orm.Column.Generated()
  //#endregion
  id: number;

  //#region @backend
  @Firedev.Orm.Column.Column({ type: 'varchar', length: 100 })
  //#endregion
  content: string;
}

@Firedev.Controlle({ entity: Task })
export class TaskController extends Firedev.Base.Controller<Task>{ } 

@Component({
  // ...
})
export class TasksComponent implements OnInit {

  // .getAll(), getBy(), deleteById(), create() etc.
  tasks$ = Task.ctrl.getAll().received.observable.pipe(
    map( response => response.body.json )
  );

  async ngOnInit() {
    const data = await Task.ctrl.create( //
      Task.from({  content: 'Hello' })
    );

    console.log(data); // http response with updated Task
  }
}

```

## 5. Super easy realtime / sockets communication
- realtime communication as simple as possible!
task.ts
```ts
@Firedev.Entity()
class Task {
  static ctrl: TaskController; // automatically injected
  //#region @backend
  @Firedev.Orm.Column.Generated()
  //#endregion
  id: number;
}
```
task.controller.ts
 ```ts
@Firedev.Controlle({ entity: Task })
export class TaskController extends Firedev.Base.Controller<Task>{ } 
```
task.component.ts
```ts
@Component({
  ...
})
export class TasksComponent implements OnInit, OnDestroy { 
  $destroyed = new Subject();

  @Input(); task: Task;
  ngOnInit() {
    Firedev.Realtime.Browser.listenChangesEntityObj(this.task).pipe(
      takeUntil(this.$destroyed)
      exhaustMap(()=> {
        return Tasks.ctrl.getBy(this.task.id).received.observable.pipe(
          map( response => {
            this.task = response.body.json;
          })
        )
      })
    );
  }
                  // it will automatically 
  ngOnDestroy() { //unsubscribe from socket communication
    this.$destroyed.next();
    this.$destroyed.unsubscribe();
  }

}
 ```

# Firedev commands
\+ Create new standalone app (simple project, cli tools or entry projects for big applications)
that can be relaased in npm as normal packages
(example **my-standalone-app**)
```
firedev new my-standalone-app
```
---
\+ Create new organization app (for complex projects)
that can be released in npm as organization packages 
(example **@organization/my-app-or-lib **)
```
firedev new organization/my-app-or-lib 

# and then you can add another one:

firedev new organization/my-next-app-lib
```
---
\+ Release app to github pages or/and npm
```
firedev release

firedev ar # quick patch release of lib to npm 
firedev adr # quick release of app to github with last configuration
```
---
\+ Update firedev from npm and local container from npm packages
```
firedev au  #  auto:update
```
---
\+ Check firedev version
```
firedev version
```
# Standalone/Organization project structure
- **Organization project (smart container)** has many "small" **standalone projects** inside itself.
- Standalone projects can be also use as global cli terminal tools
- In ANY firedev project property "name" in package.json MUST be equal project's folder basename
- organization subprojects can be easily transformed to standalone projects just by taking them out of smart container

<p style="text-align: center;"><img src="./__images/code-structure.png" ></p>


# QA
## 1. How to create/start single project 
- best for opensource/smaller projects
- can be deployed to github pages
- can be deployed to npm as organization package

1.1. Init code with cli
```
firedev new my-app
code my-app
```

1.2. Start lib/app build in integrated terminal
```
firedev start

# OR to start separated build of app and lib project parts
firedev bw     # it will start lib build from ./src/lib  
firedev baw    # it will start app build from ./src/app*

# bw => build:watch
# baw => build:app:watch
```

1.3. Select proper debug task in  Visual Studio Code

1.4. Press f5 in your Visual Studio Code

## 2 How to create/start organization project
- best private/complex application
- can be deployed to github pages
- can be deployed to npm as organization package

2.1 Init code with cli
```
firedev new my-organization-with-apps/main-app
code new my-organization-with-apps
```

2.2. Start lib/app build in integrated terminal
```
firedev start  # it will start lib/app build for default project

// OR if you want to deveop many projects at the same time
firedev bw                       # to start global build
firedev baw  child-name          # to start app build of child
firedev baw  second-child-name   # to start app build of child

# bw => build:watch
# baw => build:app:watch
```
2.3. Select proper debug task in  Visual Studio Code

2.4. Select target app and press f5 in your Visual Studio Code

<p style="text-align: center;"><img src="./__images/organization-debug.png" ></p>

## 3 How to start project in WEBSQL MODE ?
```
firedev new my-organization-or-standalone-app
cd new my-organization-or-standalone-app
firedev start --websql
```


# What is in progress ?
- support for auto-generated typeorm query selector (almost done)
- support for typeorm auto migrations
- support for integrated cms / file manager 
- support for github actions
- support for mysql/postgress/docker
- support for personal cloud

