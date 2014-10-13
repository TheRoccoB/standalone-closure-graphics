standalone-closure-graphics
===========================

A collection of some of the graphics functionality from the Google Closure library that does not require the full inclusion of Closure.

The Google Closure library is quite awesome with tons of functionality.  Unfortunately, for quick prototypes, including Closure can be quite heavyweight, as the closure library is intended to be used with the closure compiler / minifier.  This library is meant for making quick prototypes without including all the cruft of the closure library.

AffineTransform: http://docs.closure-library.googlecode.com/git/class_goog_graphics_AffineTransform.html
Vec2: http://docs.closure-library.googlecode.com/git/namespace_goog_vec_Vec2.html
Coordinate: http://docs.closure-library.googlecode.com/git/class_goog_math_Coordinate.html
TransformCSS: Contains a single utility function for changing a transform into CSS with appropriate vendor prefixes.

The classes are now global.  For instance, if using closure you'd call goog.graphics.AffineTransform, but with this library, you'd just use AffineTransform.

The only dependency is that if you include Vec2.js, you must also include Coordinate.js as Vec2 extends from Coordinate.


