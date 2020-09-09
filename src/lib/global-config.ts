import { InjectionToken } from '@angular/core';
export interface Configuration {
	collection_disabled: boolean;
	collection_class_primary: string;
	collection_class_dragging: string;
	collection_class_disabled: string;
	unit_dragging_delay: number;
	unit_disabled: boolean;
	unit_class_primary: string;
	unit_class_dragging: string;
	unit_class_disabled: string;
}

export const GLOBAL_CONFIG = new InjectionToken<Configuration>('GLOBAL_CONFIG');
