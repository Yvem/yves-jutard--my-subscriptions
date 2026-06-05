/* For readability.
 * Unfortunately, this doesn't add real type safety
 */

/////////////////////////////////////////////////

export type PathSeparator = "/" | "\\"

export type EndOfLine = "\n"

/////////////////////////////////////////////////

// no sep
export type PathSegment = string
export type Basename = PathSegment
export type Extension = string // '.' included, ex. '.ts'

/////////////////////////////////////////////////

export type PathⳇRelative = string // implied relative to some "working dir"
export type PathⳇAbsolute = string
export type PathⳇAny = PathⳇRelative | PathⳇAbsolute

/////////////////////////////////////////////////

export type DirPathⳇRelative = `${PathⳇRelative}${PathSeparator}`
export type DirPathⳇAbsolute = `${PathⳇAbsolute}${PathSeparator}`
export type DirPathⳇAny = DirPathⳇRelative | DirPathⳇAbsolute

/////////////////////////////////////////////////

export type FilePathⳇRelative = PathⳇRelative
export type FilePathⳇAbsolute = PathⳇAbsolute
export type FilePathⳇAny = FilePathⳇRelative | FilePathⳇAbsolute

/////////////////////////////////////////////////
