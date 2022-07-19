<p style="text-align: center;"><img src="./logo-wide.jpg" ></p>

( EVERYTHING IN PROGRESS HERE )

**Firedev** is a solution for [typescript](https://www.typescriptlang.org/) / [angular](https://angular.io/) / [rxjs](https://rxjs.dev/) / [nodejs](https://nodejs.org/en/) / [typeorm](https://typeorm.io/)  
backend/frontend apps.

# Required version of NodeJS
- Windows & MacOS: >=14
- Linux:  >= 12

# How to install firedev
```
npm i -g firedev
```

#  How to uninstall firedev
```
npm uninstall -g firedev
rimraf ~/.firedev # firedev templates projects and db
```

# Philosophy of Firedev
=> One language for browser/backend/database - TypeScript

=> Builded on top of rock solid frameworks

=> Never ever repeat single line of code

=> Crazy fast / developer-friendly coding in <b>Visual Studio Code</b>

=> Shared <b>node_modules</b> for similar projects

# Advantages of Firedev
## 1. No separation between backend and frontend code.

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
import { Firedev } from 'firedev';

@Firedev.Entity()
class User {
  /* */
  /* */
  /* */
  id: string;
}

```

## 2. Smooth REST api - define host only  once and nothing else!

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
  static ctrl: UserController; // automaticly injected
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
## 3. CRUD api in 60 seconds 
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

  // .getAll(), getBy(), deleteById(), updateById() etc.
  tasks$ = this.tasksController.getAll().received.observable.pipe(
    map( response => response.body.json )
  );
}

```

## 4. Super easy realtime / sockets communication
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

## ( more docs are comming soon..  )

# how to create/start single project 
( best for opensource/smaller projects )
```
firedev new my-app
cd my-app
firedev build:app:watch         # wait for next commands in console
```

# how to start smart workspace project 
( best private/complex application )
```
firedev new my-bigger-app/app
cd new my-bigger-app
firedev build:app:watch app     # wait for next commands in console
```
