# NgReorder

This module provides a way to sort elements within a list by using drag-n-drop interface without any restrictions by direction.

## Instalation

`npm install ng-reorder`

## API

#### DragUnitDirective
Dragable element  
selector: `dragUnit`

#### Inputs
| Input          | Type    | Default value   | Description                                                                        |
| -------------- | ------- | --------------- | ---------------------------------------------------------------------------------- |
| disabled       | boolean | `false`         | An element will not response for dragging while this property it's `true`          |
| class_primary  | string  | `drag-unit`     | Primary class name                                                                 |
| class_dragging | string  | `active`        | Class name which will be attached to an element while it's dragging                |
| class_disabled | string  | `disabled`      | Class name which will be attached to an element while it's disabled                |

### Outputs
| Output       | Type                        | Description                                                                   |
| ------------ | --------------------------- | ----------------------------------------------------------------------------- |
| unitTaken:   | EventEmitter\<UnitTaken>    | Emits when the dragging sequence successfully started and an element is taken |
| unitMoved:   | EventEmitter\<UnitMoved>    | Emits when an element is moved on a page while user is dragging it            |
| unitReleased:| EventEmitter\<UnitReleased> | Emits when an element is being released                                       |

#### DragCollectionDirective
Collection for dragable elements  
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

#### DragHandleDirective
An element which will start drag sequence in case whether you don't want to use the entire field of `DragUnitDirective` parent  
selector: `dragHandle`

#### DragRegectorDirective
An element which will not start drag sequence in case whether you need to exclude some element from that(buttons, inputs, ect.)  
selector: `dragRejector`

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
import { NgReorderModule } from 'ng-reorder';

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
```typescript
import { Component } from '@angular/core';
import { CollectionSorted, reorderItems } from 'ng-reorder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  test: number[];

  k: number;

  getTest = (x: number) => {
    const j = new Array<number>();
    for (let i = 0; i < x; ++i) {
      j.push(i);
    }
    this.k = x;
    return j;
  }
  constructor() {
    this.test = this.getTest(30);
  }

  sort(e: CollectionSorted) {
    this.test = reorderItems(this.test, e.previousIndex, e.currentIndex);
  }

  add() {
    this.test.push(this.k++);
  }
  remove() {
    this.test.pop();
    --this.k;
  }
}
```
2. Use `dragCollection` directive for wrapper of collection of your elements (`ul`, `ol`, or just `div` for instance)
```html
<button class="add-remove" (click)="add()">add</button>
<button class="add-remove" (click)="remove()">remove</button>

<ul dragCollection (dropCompleted)="sort($event)">
  <li *ngFor="let item of test" dragUnit [value]=item>
    <div>
      <span>{{item}}</span>
      <div class="handle" dragHandle></div>
      <div class="rejector" dragRejector></div> <!-- THIS ELEMENT WILL NOT RESPOND FOR DRAG-N-DROP -->
    </div>
  </li>
</ul>
```
3. Style your elements
```css
ul {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	align-content: space-around;
	margin: 0;
	padding: 0;
}

ul > li {
	list-style: none;
	display: block;
	position: relative;
	width: 70px;
	height: 45px;
	border: 5px dodgerblue;
	border-style: outset;
	border-radius: 8px;
	background-color: black;
	color: white;
	text-align: center;
	vertical-align: middle;
	line-height: 40px;
	margin: 5px;
	user-select: none;
}

button.add-remove {
	display: block;
	width: 200px;
	height: 50px;
	color: white;
	font-size: large;
	border: none;
	border-radius: 25px;
	background: black;
	margin: 5px auto;
	cursor: pointer;
}

.in-action .drag-unit:not(.active) {
	transition: 300ms transform cubic-bezier(0.2, 0, 0.2, 1);
}

.drag-unit.active {
	z-index: 2000;
	box-shadow: 0px 0px 5px 2px #1e1e1e;
}

.in-action .drag-unit.dropped {
	box-shadow: 0px 0px black;
	transition: transform 250ms cubic-bezier(0.5, 0, 0.2, 1), box-shadow 250ms ease;
}

.handle, .rejector {
	width: 0;
	height: calc(100% - 30px);
	border-style: solid;
	position: absolute;
}

.handle {
	border-width: 0 20px 20px 0;
	border-color: transparent dodgerblue transparent transparent;
	top: -1px;
	right: -0px;
	cursor: move;
}

.rejector {
	border-width: 20px 0 0 20px;
	border-color: transparent transparent transparent #1460ab;
	bottom: -1px;
	left: -0px;
	cursor: not-allowed;
}
```

## Credits
This project is based on [Angular's Drag-and-drop module](https://material.angular.io/cdk/drag-drop/) and I really want to thanks everyone Angular team member for creating this awesome framework.