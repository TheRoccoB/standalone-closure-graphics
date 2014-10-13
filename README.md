standalone-closure-graphics
===========================

A collection of some of the graphics functionality from the Google Closure library that does not require the full inclusion of Closure.

The Google Closure library has some excellent graphics routines!  Unfortunately, you need to include the entire closure library to get access to these routines.  This may pose problems because:
<ul>
    <li>Your project may not be minified with closure.  You probably don't want to do a giant refactor for this</li>
    <li>You want to do some simple graphics prototypes and do not need the kitchen sink</li>
    <li>You're already using jQuery, and don't need duplicate routines for selectors, event handling, etc.</li>
</ul>

Included files:
<ul>
    <li>AffineTransform: http://docs.closure-library.googlecode.com/git/class_goog_graphics_AffineTransform.html
    <li>Vec2: http://docs.closure-library.googlecode.com/git/namespace_goog_vec_Vec2.html
    <li>Coordinate: http://docs.closure-library.googlecode.com/git/class_goog_math_Coordinate.html
    <li>TransformCSS: Contains a single utility function for converting a transform into CSS with appropriate vendor prefixes.
</ul>

The classes are now global.  For instance, if using closure you'd call goog.graphics.AffineTransform, but with this library, you'd just use AffineTransform.

The only dependency is that if you include Vec2.js, you must also include Coordinate.js as Vec2 extends from Coordinate.

If you'd like to convert additional classes, I'll gladly review any pull requests!


