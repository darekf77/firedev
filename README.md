<p style="text-align: center;"><img src="./logo-wide.jpg" ></p>

( BETA VERSION )

**Firedev** is a solution for 
[typescript](https://www.typescriptlang.org/) /
[angular](https://angular.io/) / 
[rxjs](https://rxjs.dev/) / 
[ngrx](https://ngrx.io/) (optional) /
[nodejs](https://nodejs.org/en/) / 
[typeorm](https://typeorm.io/) 
([mysql](https://www.mysql.com/) | [sqlite](https://github.com/WiseLibs/better-sqlite3) | [sql.js](https://sql.js.org))

backend/frontend apps.


# Required version of NodeJS 
- Windows (gitbash): >= v16 
- MacOS: >= v16
- Linux: >= v16

# How to install firedev
```
npm i -g firedev
```

#  How to uninstall firedev from local machine
Firedev stores a big global container (in ~/.firedev) for npm packages that are being shared 
accros all firedev apps
```
npm uninstall -g firedev
rm -rf ~/.firedev
```



# Philosophy of Firedev
=> One language for browser/backend/database - **TypeScript**

=> Builded on top of rock solid frameworks

=> **Never** ever **repeat** single line of **code**

=> Everything automatically generated, strongly typed

=> Crazy fast / developer-friendly coding in <b>Visual Studio Code</b>

=> Shared <b>node_modules</b> for similar projects (from one big npm pacakges container)

=> No need for local node_modules => many projects takes magabytes instead gigabytes

=> Automation for releasing projects (standalone and organization) to github pages / npm repositories

=> Develop libraries and apps at the same time! (mixed NodeJs packages with proper Angular ivy packages)

=> Two development modes
  1. NORMAL - sqlite/mysql for database and normal NodeJS server
  2. WEBSQL - sql.js for database and server mock in browser (perfect for github pages, e2e and more!)

# Advantages of Firedev
## 1. No separation between backend and frontend code (use BE entity as FE dto!) .
- this is a dream situation for any developer!
- perfect solution for any kind of projects ( hobbyst / freelancers / enterprise )

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
Database column is created on frontend! (sql.js)


## 3. Smooth REST api - define host only  once and nothing else!
- no more of ugly acces to server... firedev takes it to next level !
- in Angular/RxJS environemtn => it more than pefect solution !

user.controller.ts
```ts
@Firedev.Controller({
  entity: User
})
class UserController {
                      
                      // name 'helloAmazingWorld' from this class function 
  @Firedev.Http.GET() // is being use for creating expressjs server routes
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
const host = 'http://localhost:4444'; // host defined once

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
## 4. CRUD api in 60 seconds
- use observable or promises .. .whater you like
```ts
@Firedev.Entity()
class Task {
  //#region @backend
  @Firedev.Orm.Column.Generated()
  //#endregion
  id: number;
}

@Firedev.Controlle({ entity: Task })
export class TaskController extends Firedev.Base.Controller<Task>{ } 

@Component({
  ...
})
export class TasksComponent implements OnInit {
   constructor( tasksController: TaskController ) {  }

  // .getAll(), getBy(), deleteById(), \ById() etc.
  tasks$ = this.tasksController.getAll().received.observable.pipe(
    map( response => response.body.json )
  );
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

  ngOnDestroy() { // it will automatically unsubscribe from socket communication
    this.$destroyed.next();
    this.$destroyed.unsubscribe();
  }

}
 ```

# Firedev commands
1. Create new standalone app
```
firedev new my-app
```
2. Create new workspace app
```
firedev new workspace/app
```
3. Release app to github pages and npm
```
firedev new my-workspace-with-apps/app
```

4. Release app to github pages or/and npm
```
firedev release
```

3. Update firedev from npm and local container from npm packages
```
firedev auto:update
```

3. Remove temporary files from repository / reset files content from main container
```
firedev clear
```

# QA
## 1. How to create/start single project 
- best for opensource/smaller projects
- can be deployed to github pages
- can be deployed to npm as organization package
```
firedev new my-app
cd my-app
firedev start
# select proper debug task in  Visual Studio Code
# press f5 in your Visual Studio Code
```

## 2 How to start smart workspace project
- best private/complex application
- can be deployed to github pages
- can be deployed to npm as organization package
```
firedev new my-workspace-with-apps/app
cd new my-workspace-with-apps
firedev star
# select proper debug task in  Visual Studio Code
# press f5 in your Visual Studio Code
```

# What is in progress
- support for custom npm servers
- support for delopying on to server than github pages

