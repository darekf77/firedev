<p style="text-align: center;"><img src="./logo-wide.jpg" ></p>

( EVERYTHING IN PROGRESS HERE )

**Firedev** is a solution for [typescript](https://www.typescriptlang.org/) / [angular](https://angular.io/) / [rxjs](https://rxjs.dev/) / [nodejs](https://nodejs.org/en/) / [typeorm](https://typeorm.io/)  
backend/frontend apps.

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
    //@backendFunc
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




# how to start (single project)
```
npm i -g firedev
firedev new my-first-isomorphic-app
cd new my-first-isomorphic-app
```
1st terminal
```
firedev build:watch
```
and in the second (angular build)
```
firedev build:app:watch
// firedev build:app:watch --port 4444 -> start angular build on diffrent port
```

# how to start (monorepo)
```
npm i -g firedev
firedev new my-first-isomorphic-monorepo/app
cd new my-first-isomorphic-monorepo
firedev build:watch app
```
