// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A utility class for representing two-dimensional positions.
 */

//Modified for gliffy by Rocco Balsamo
;(function() {

    var isDef = function(val) {
        return val !== undefined;
    };

    /**
     * Class for representing coordinates and positions.
     * @param {number=} opt_x Left, defaults to 0.
     * @param {number=} opt_y Top, defaults to 0.
     * @constructor
     */
    var Coordinate = function(opt_x, opt_y) {
        /**
         * X-value
         * @type {number}
         */
        this.x = isDef(opt_x) ? opt_x : 0;

        /**
         * Y-value
         * @type {number}
         */
        this.y = isDef(opt_y) ? opt_y : 0;
    };


    /**
     * Returns a new copy of the coordinate.
     * @return {!Coordinate} A clone of this coordinate.
     */
    Coordinate.prototype.clone = function() {
        return new Coordinate(this.x, this.y);
    };


    /**
     * Returns a nice string representing the coordinate.
     * @return {string} In the form (50, 73).
     */
    Coordinate.prototype.toString = function() {
        return '(' + this.x + ', ' + this.y + ')';
    };


    /**
     * Compares coordinates for equality.
     * @param {Coordinate} a A Coordinate.
     * @param {Coordinate} b A Coordinate.
     * @return {boolean} True iff the coordinates are equal, or if both are null.
     */
    Coordinate.equals = function(a, b) {
        if (a == b) {
            return true;
        }
        if (!a || !b) {
            return false;
        }
        return a.x == b.x && a.y == b.y;
    };


    /**
     * Returns the distance between two coordinates.
     * @param {!Coordinate} a A Coordinate.
     * @param {!Coordinate} b A Coordinate.
     * @return {number} The distance between {@code a} and {@code b}.
     */
    Coordinate.distance = function(a, b) {
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    };


    /**
     * Returns the squared distance between two coordinates. Squared distances can
     * be used for comparisons when the actual value is not required.
     *
     * Performance note: eliminating the square root is an optimization often used
     * in lower-level languages, but the speed difference is not nearly as
     * pronounced in JavaScript (only a few percent.)
     *
     * @param {!Coordinate} a A Coordinate.
     * @param {!Coordinate} b A Coordinate.
     * @return {number} The squared distance between {@code a} and {@code b}.
     */
    Coordinate.squaredDistance = function(a, b) {
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        return dx * dx + dy * dy;
    };


    /**
     * Returns the difference between two coordinates as a new
     * Coordinate.
     * @param {!Coordinate} a A Coordinate.
     * @param {!Coordinate} b A Coordinate.
     * @return {!Coordinate} A Coordinate representing the difference
     *     between {@code a} and {@code b}.
     */
    Coordinate.difference = function(a, b) {
        return new Coordinate(a.x - b.x, a.y - b.y);
    };


    /**
     * Returns the sum of two coordinates as a new Coordinate.
     * @param {!Coordinate} a A Coordinate.
     * @param {!Coordinate} b A Coordinate.
     * @return {!Coordinate} A Coordinate representing the sum of the two
     *     coordinates.
     */
    Coordinate.sum = function(a, b) {
        return new Coordinate(a.x + b.x, a.y + b.y);
    };

    window["Coordinate"] = Coordinate;

})();