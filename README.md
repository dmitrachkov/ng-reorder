# NgReorder

This module provides a way to sort elements within a list by using drag-n-drop interface without any restrictions by direction.

> see [live example](https://stackblitz.com/edit/ng-reorder?file=src/app/app.component.ts)

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
	selector: 'my-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	test: Array<number>;

	k: number;

	constructor() {
		this.test = this.getTest(30);
	}

	private getTest(x: number): Array<number> {
		const j = new Array<number>();
		for (let i = 0; i < x; ++i) {
			j.push(i);
		}
		this.k = x;
		return j;
	}

	public sort(e: CollectionSorted) {
		this.test = reorderItems(this.test, e.previousIndex, e.currentIndex);
	}

	public add() {
		this.test.push(this.k++);
	}
	public remove() {
		this.test.pop();
		--this.k;
	}

}
```
2. Use `dragCollection` directive for wrapper of collection of your elements (`ul`, `ol`, or just `div` for instance)
```html
<div id="buttons">
	<button id="add" (click)="add()">add</button>
	<button id="remove" (click)="remove()">remove</button>
</div>

<ul id="collection" dragCollection (dropCompleted)="sort($event)">
	<li *ngFor="let item of test" dragUnit [value]=item>
		<div class="handle" dragHandle></div>
		<span>{{item}}</span>
        <!-- THIS ELEMENT WILL NOT RESPOND FOR DRAG-N-DROP -->
		<div class="rejector" dragRejector></div> 
	</li>
</ul>
```
3. Style your elements
```css
div#buttons {
    display: flex;
    justify-content: space-around;
}

div#buttons button {
    color: white;
    border: none;
    background: none;
    padding: 0.5em;
    cursor: pointer;
    font-family: sans-serif;
    text-transform: uppercase;
    min-width: 150px;
}

div#buttons button:focus {
    outline: none;
}

div#buttons button#add {
    background: #58c292;
}

div#buttons button#remove {
    background: #cd3a3a;
}

ul#collection {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-evenly;
    margin: 1em 0;
    padding: 0;
}

ul#collection li.drag-unit {
    list-style: none;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 4em;
    height: 4em;
    box-shadow: 0px 0px 2px #333;
    background-color: white;
    color: #333;
    text-align: center;
    margin: 0.5em;
    user-select: none;
    transition: box-shadow 250ms ease;
}

ul#collection.in-action li.drag-unit:not(.active) {
    transition: 300ms transform cubic-bezier(0.2, 0, 0.2, 1);
}

ul#collection.in-action .drag-unit.active {
    z-index: 2000;
    box-shadow: 0px 0px 4px #333;
}

ul#collection.in-action .drag-unit.dropped {
    box-shadow: 0px 0px #333;
    transition: transform 250ms cubic-bezier(0.5, 0, 0.2, 1), box-shadow 250ms ease;
    z-index: 2000;
}

.handle,
.rejector {
    width: 100%;
    height: 1em;
}

.handle {
    background: #58c292;
    cursor: move;
}

.rejector {
    background: #cd3a3a;
    cursor: not-allowed;
}
```

## Credits
This project is based on [Angular's Drag-and-drop module](https://material.angular.io/cdk/drag-drop/) and I really want to thanks everyone Angular team member for creating this awesome framework.