# NgReorder

This module provides a way to sort elements within a list by using drag-n-drop interface without any restrictions by direction.

## Example

## Instalation

`npm install ng-reorder`

## API

#### DragUnitDirective
selector: `dragUnit`

#### Inputs
| Input          | Type    | Default value   | Description                                                                        |
| -------------- | ------- | --------------- | ---------------------------------------------------------------------------------- |
| disabled       | boolean | `false`         | An element will not response for dragging while this property it's `true`          |
| class_primary  | string  | `drag-unit`     | Primary class name                                                                 |
| class_dragging | string  | `active`        | Class name which will be attached to an element while it's dragging                |
| class_disabled | string  | `disabled`      | Class name which will be attached to an element while it's disabled                |

### Outputs
| Output                                    | Description                                                                   |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| unitTaken: EventEmitter\<UnitTaken>       | Emits when the dragging sequence successfully started and an element is taken |
| unitMoved: EventEmitter\<UnitMoved>       | Emits when an element is moved on a page while user is dragging it            |
| unitReleased: EventEmitter\<UnitReleased> | Emits when an element is being released                                       |

#### DragCollectionDirective
selector: `dragCollection`

#### Inputs
| Input          | Type    | Default value | Description                                                                           |
| -------------- | ------- | ------------- | ------------------------------------------------------------------------------------- |
| disabled       | boolean | `false`       | Dragging sequence will not starts at all when `true`                                  |
| class_primary  | string  | `collection`  | Primary class name                                                                    |
| class_dragging | string  | `in-action`   | Class name which will be attached to a collection while it's descendants are dragging |
| class_disabled | string  | `disabled`    | Class name which will be attached to a collection while it's disabled                 |

#### Outputs
| Output        | Type                            | Description                                        |
| ------------- | ------------------------------- | -------------------------------------------------- |
| dropCompleted | EventEmitter\<CollectionSorted> | Emits when drag-n-drop sequence is totaly comleted |

## Interfaces
#### `UnitTaken`
| Data     | Type                     | Description    |
| -------- |------------------------- | -------------- |
| element  | DragUnitDirective        | Source element |
| event    | MouseEvent \| TouchEvent | Native event   |

#### `UnitMoved`
| Data     | Type                     | Description                                                             |
| -------- |------------------------- | ----------------------------------------------------------------------- |
| element  | DragUnitDirective        | Source element                                                          |
| distance | Point                    | Distance in pixels from the position where the source element was taken |
| event    | MouseEvent \| TouchEvent | Native event                                                            |

#### `UnitReleased`
| Data     | Type                     | Description    |
| -------- |------------------------- | -------------- |
| element  | DragUnitDirective        | Source element |
| event    | MouseEvent \| TouchEvent | Native event   |

#### `CollectionSorted`
| Data          | Type                    | Description                                                          |
| ------------- | ----------------------- | -------------------------------------------------------------------- |
| collection    | DragCollectionDirective | Collection which contain the source element                          |
| element       | DragUnitDirective       | Source element                                                       |
| previousIndex | number                  | Origin index of the element in the collection                        |
| currentIndex  | number                  | New index of the element where it was moved to within the collection |

#### `Point`
| Data | Type   | Description                 |
| ---- | ------ | --------------------------- |
| x    | number | Pixel's amount along X-axis |
| y    | number | Pixel's amount along Y-axis |

## Usage
1. Register `NgReorderModule` in your app module or any module you'd like
```typescript
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgReorderModule } from 'projects/ng-reorder/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgReorderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
2. Use `dragCollection` directive for wrapper of collection of your elements (`ul`, `ol`, or just `div` for instance)
```html
<ul dragCollection>
  <li *ngFor="let item of items" dragUnit>
    <div dragHandle></div>
    <!-- your content -->
    <button dragRejector>Click!</button>
  </li>
</ul>
```
3. Style your elements
```css
ul {
    width: 40px;
}
```

## Credits
This project is based on [Angular's Drag-and-drop module](https://material.angular.io/cdk/drag-drop/) and I really want to thanks everyone Angular team member for creating this awesome framework.