//let isꓽprod = true // by default
//let isꓽprod = process.env.NODE_ENV === 'production';
let isꓽprod = false

/////////////////////////////////////////////////
// Custom errors
// setPrototypeOf: Fix prototype chain — required when targeting ES5 or older
// name: Optional: ensure the name reflects the class name

class ExtendedError extends Error {
	public readonly message__prefix: string
	public readonly framesToPop: number
	public readonly statusCode: number

	constructor(message__prefix: string, statusCode: number = 500, framesToPop: number = 1) {
		super(`${message__prefix}!`)
		Object.setPrototypeOf(this, new.target.prototype)
		this.message__prefix = message__prefix
		this.name = new.target.name
		this.framesToPop = framesToPop
		this.statusCode = statusCode
	}
}

class AssertionFailed extends ExtendedError {
	constructor(statusCode?: number) {
		super("Assertion failed", statusCode)
		Object.setPrototypeOf(this, new.target.prototype)
		this.name = new.target.name
	}
}
class PreconditionError extends ExtendedError {
	constructor(statusCode?: number) {
		super("Pre-condition failed", statusCode)
		Object.setPrototypeOf(this, new.target.prototype)
		this.name = new.target.name
	}
}
class PostconditionError extends ExtendedError {
	constructor(statusCode?: number) {
		super("Post-condition failed", statusCode)
		Object.setPrototypeOf(this, new.target.prototype)
		this.name = new.target.name
	}
}
class ArgumentError extends ExtendedError {
	constructor(statusCode?: number) {
		super("Invalid argument", statusCode)
		Object.setPrototypeOf(this, new.target.prototype)
		this.name = new.target.name
	}
}

/////////////////////////////////////////////////

type Context = {
	caller?: Function
	caller__name?: string

	object_under_check?: any
	object_under_check__name?: string

	assertion?: any
	assertion_description?: string | (() => string)

	error?: ExtendedError
}
interface AssertFn {
	(
		assertion: any,
		assertion_description?: string | (() => string),
		details?: { statusCode?: number },
		_internal?: Context,
	): asserts assertion
}
type AssertFnParams = Parameters<AssertFn>

interface AssertSugar extends AssertFn {
	pre: AssertFn
	post: AssertFn
}

/////////////////////////////////////////////////

// https://ethereum.org/developers/docs/smart-contracts/security/#use-require-assert-revert
// detect internal errors and check for violations of “invariants” in your code.
// An invariant is a logical assertion about a contract’s state that should hold true for all function executions.
// An example invariant is the maximum total supply or balance of a token contract.
// Using assert() ensures that your state never reaches a wrong state
const _assert: AssertFn = (assertion, assertion_description, details = {}, _internal = {}) => {
	if (assertion) return

	const context = {
		..._internal,
		assertion,
		...(assertion_description && { assertion_description }),
		error: new AssertionFailed(details.statusCode),
	}
	_on_failure(context)
}

// https://en.wikipedia.org/wiki/Precondition
// must always be true just prior to the execution of some section of code
// If a precondition is violated, the effect of the section of code becomes undefined and thus may or may not carry out its intended work
const assertⵧpre: AssertFn = (assertion, assertion_description, details = {}, _internal = {}) => {
	if (assertion) return

	const context = {
		..._internal,
		assertion,
		...(assertion_description && { assertion_description }),
		error: new PreconditionError(details.statusCode),
	}
	_on_failure(context)
}

// very common flavor of precondition
const assertⵧparam: AssertFn = (assertion, assertion_description, details = {}, _internal = {}) => {
	if (assertion) return

	const context = {
		..._internal,
		assertion,
		...(assertion_description && { assertion_description }),
		error: new ArgumentError(details.statusCode),
	}
	_on_failure(context)
}

// https://en.wikipedia.org/wiki/Postcondition
// must always be true just after the execution of some section of code
const assertⵧpost: AssertFn = (assertion, assertion_description, details = {}, _internal = {}) => {
	if (assertion) return

	const context = {
		..._internal,
		assertion,
		...(assertion_description && { assertion_description }),
		error: new PostconditionError(details.statusCode),
	}
	_on_failure(context)
}

/////////////////////////////////////////////////
// extra semantic

// https://ethereum.org/developers/docs/smart-contracts/security/#use-require-assert-revert
// called at the start (...) )and ensures predefined conditions are met
// (...)) can be used to validate user inputs, check state variables, or authenticate
// before progressing with a function.
const require = assertⵧpre

// alias
// https://en.wikipedia.org/wiki/Postcondition
// https://en.wikipedia.org/wiki/Java_Modeling_Language#Syntax
const ensure = assertⵧpost

/////////////////////////////////////////////////
// sugar

const assert: AssertSugar = Object.assign(_assert, {
	pre: assertⵧpre,
	post: assertⵧpost,
})

/* trying to fix TS errors
type AssertFrom = {
	forⵧparam(value_in_obj: { [name: string]: any }): {
		assert: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) => asserts assertion
		require: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) => asserts assertion
	}

	forⵧvalue(value_in_obj: { [name: string]: any }): {
		assert: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) => asserts assertion
		post: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) => asserts assertion
		ensure: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) => asserts assertion
	}

	assert: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) => asserts assertion
	pre: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) => asserts assertion
	require: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) => asserts assertion
	post: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) => asserts assertion
	ensure: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) => asserts assertion
}
*/

function assert_from(fn_in_obj: { [name: string]: Function }) {
	_assert(typeof fn_in_obj === "object" && fn_in_obj)
	const [caller__name, caller] = Object.entries(fn_in_obj)[0] || []
	_assert(caller__name)
	_assert(typeof caller === "function")

	const context: Context = {
		caller,
		caller__name,
	}

	return {
		forⵧparam(value_in_obj: { [name: string]: any }) {
			_assert(typeof value_in_obj === "object" && value_in_obj)
			const [object_under_check__name, object_under_check] = Object.entries(value_in_obj)[0] || []
			_assert(object_under_check__name)

			const sub_context = {
				...context,
				object_under_check,
				object_under_check__name,
			}

			return {
				assert: (
					assertion: AssertFnParams[0],
					assertion_description?: AssertFnParams[1],
					details?: AssertFnParams[2],
				) => assertⵧparam(assertion, assertion_description, details, sub_context),
				require: (
					assertion: AssertFnParams[0],
					assertion_description?: AssertFnParams[1],
					details?: AssertFnParams[2],
				) => assertⵧparam(assertion, assertion_description, details, sub_context),
			}
		},
		forⵧvalue(value_in_obj: { [name: string]: any }) {
			_assert(typeof value_in_obj === "object" && value_in_obj)
			const [object_under_check__name, object_under_check] = Object.entries(value_in_obj)[0] || []
			_assert(object_under_check__name)

			const sub_context = {
				...context,
				object_under_check,
				object_under_check__name,
			}

			return {
				assert: (
					assertion: AssertFnParams[0],
					assertion_description?: AssertFnParams[1],
					details?: AssertFnParams[2],
				) => _assert(assertion, assertion_description, details, sub_context),
				post: (
					assertion: AssertFnParams[0],
					assertion_description?: AssertFnParams[1],
					details?: AssertFnParams[2],
				) => assertⵧpost(assertion, assertion_description, details, sub_context),
				ensure: (
					assertion: AssertFnParams[0],
					assertion_description?: AssertFnParams[1],
					details?: AssertFnParams[2],
				) => assertⵧpost(assertion, assertion_description, details, sub_context),
			}
		},
		assert: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) =>
			_assert(assertion, assertion_description, details, context),
		pre: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) =>
			assertⵧpre(assertion, assertion_description, details, context),
		require: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) =>
			assertⵧpre(assertion, assertion_description, details, context),
		post: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) =>
			assertⵧpost(assertion, assertion_description, details, context),
		ensure: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) =>
			assertⵧpost(assertion, assertion_description, details, context),
	}
}

/////////////////////////////////////////////////

export { assert, assertⵧparam, assertⵧpre, require, assertⵧpost, ensure, assert_from }

/////////////////////////////////////////////////

function _on_failure(context: Context): never {
	let { caller, caller__name, object_under_check__name, assertion, assertion_description, error } = context

	if (isꓽprod) {
		throw !error // no details
	}

	const message__body__assertion = (() => {
		if (typeof assertion_description === "function") assertion_description = assertion_description()

		if (!!assertion_description) return String(assertion_description)

		// auto detail...

		if (object_under_check__name) {
			object_under_check__name = `assertion about ${object_under_check__name}`
		}

		if (typeof assertion === "boolean") return "should be true"

		if (typeof assertion === "undefined") return "should be defined"

		if (assertion === null) return "should not be null"

		if (assertion === 0) return "should be a non-zero number"
		if (assertion === 0n) return "should be a non-zero BigInt"

		if (assertion === "") return "should be a non-empty string"

		if (isNaN(assertion)) return "should not be NaN"

		return "should be truthy"
	})()

	const message__body = [
		...(caller__name ? [`${caller__name}():`] : []),
		`${error!.message__prefix}:`,
		...(object_under_check__name ? [`${object_under_check__name}`] : []),
		message__body__assertion,
	]

	let messageⵧfinal = message__body.join(" ")
	if (!messageⵧfinal.endsWith("!")) messageⵧfinal += "!"

	error!.message = messageⵧfinal

	if (!isꓽprod) {
		console.warn("!!! assertion failed !!!")
		console.warn("!!", messageⵧfinal)
		console.warn("!!", error)
		console.warn("!! will now throw...") // put breakpoint here
	}

	throw error
}

////////////////////////////////////////////////
