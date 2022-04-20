<p style="text-align: center;"><img src="./logo-wide.jpg" ></p>

( EVERYTHING IN PROGRES HERE )


Imagine you can have  backend/frontend code in 1 single file.

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

and your browser client gets this <b>example.ts</b> version:
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



# how to start
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
```
