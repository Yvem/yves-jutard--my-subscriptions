// unsure where to sort those types for now

import { type Immutable } from "../l1-immutable/index.ts"

/////////////////////////////////////////////////

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types
// TODO add Symbol?
// TODO usage?
export type JSPrimitiveType = boolean | null | undefined | number | string

/////////////////////////////////////////////////

// TODO usage?
export interface NumberMap {
	[k: string]: number
}

/////////////////////////////////////////////////

// https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
// TODO usage?
export type HashOf<T> = Record<string, T>

/////////////////////////////////////////////////

// generic progressive enhancements
// the key here is that HINTS SHOULD ALWAYS BE OPTIONAL:
// - the object extending "WithHints" should be usable without them
// - ideally stuff should be inferrable as much as possible (single source of truth)
export interface BaseHints {
	/*
			vibrate?:    { duration‿ms: 'auto' | number, alt: string },
			play_sound?: { url: Url‿str, alt: string },
			play_video?: { url: Url‿str, alt: string },
			// etc.
	*/

	key?: string // for ex. to recognize a specific content (do not abuse! Reminder to keep everything text-compatible)

	// anything allowed
	[k: string]: any
}
export interface WithHints<Hints = BaseHints> {
	hints?: Hints
}

/////////////////////////////////////////////////

// https://devdocs.io/javascript/global_objects/array/sort
export type CompareFn<T> = (a: Immutable<T>, b: Immutable<T>) => number
