# Angular Contrib

Angular extensions powered by community.

## Packages

Package Name              | Features
------------------------- | ----------------------
`@angular-contrib/common` | `<ng-host>`, `ngForIn`

## Usage

Example of using `<ng-host>` directive.

Installing package:

```bash
npm install @angular-contrib/common
```

Importing NgModule:

```typescript
import { HostModule } from '@angular-contrib/common';

@NgModule({
  imports: [ HostModule ]
})
class AppModule { }
```

Using features:

```typescript
@Component({
  template: `
    <ng-host [ngClass]="{foo: true, bar: false}"></ng-host>
    <p>Hello World!</p>
  `
})
class AppComponent { }
```

## Goals

+ Fundamental functionalities only;
+ Lib only (no private API usage);
+ Angular feature requests only;

## Note

+ Please do not raise feature request here, instead making that to Angular itself. All features are picked there;
+ All features must be imported individuals due to possible future conflicts;
+ Any feature once implemented by Angular will be deprecated here;
