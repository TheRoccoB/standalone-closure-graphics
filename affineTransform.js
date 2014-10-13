// Derived from:
// http://closure-library.googlecode.com/svn/docs/class_goog_graphics_AffineTransform.html
// By: Rocco Balsamo

// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
 * Creates a 2D affine transform. An affine transform performs a linear
 * mapping from 2D coordinates to other 2D coordinates that preserves the
 * "straightness" and "parallelness" of lines.
 *
 * Such a coordinate transformation can be represented by a 3 row by 3 column
 * matrix with an implied last row of [ 0 0 1 ]. This matrix transforms source
 * coordinates (x,y) into destination coordinates (x',y') by considering them
 * to be a column vector and multiplying the coordinate vector by the matrix
 * according to the following process:
 * <pre>
 *      [ x']   [  m00  m01  m02  ] [ x ]   [ m00x + m01y + m02 ]
 *      [ y'] = [  m10  m11  m12  ] [ y ] = [ m10x + m11y + m12 ]
 *      [ 1 ]   [   0    0    1   ] [ 1 ]   [         1         ]
 * </pre>
 *
 * This class is optimized for speed and minimizes calculations based on its
 * knowledge of the underlying matrix (as opposed to say simply performing
 * matrix multiplication).
 *
 * @param {number=} opt_m00 The m00 coordinate of the transform.
 * @param {number=} opt_m10 The m10 coordinate of the transform.
 * @param {number=} opt_m01 The m01 coordinate of the transform.
 * @param {number=} opt_m11 The m11 coordinate of the transform.
 * @param {number=} opt_m02 The m02 coordinate of the transform.
 * @param {number=} opt_m12 The m12 coordinate of the transform.
 * @constructor
 */
;(function() {



/**
 * Returns whether the supplied number is finite and not NaN.
 * @param {number} num The number to test.
 * @return {boolean} Whether {@code num} is a finite number.
 */
var isFiniteNumber = function(num) {
    return isFinite(num) && !isNaN(num);
};

/**
 * Returns true if the specified value is a number
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
var isNumber = function(val) {
    return typeof val == 'number';
};


var checkFiniteNumbers = function(args){
    //profiling revealed that this used significant amount of CPU
    if (window.finiteNumberChecks){
        var len = args.length;
        for(var i=0; i<len; i++){
            if (!isFiniteNumber(args[i])){
                throw Error('Invalid transform parameters');
            }
        }
    }
}

var AffineTransform = function(opt_m00, opt_m10, opt_m01,
                               opt_m11, opt_m02, opt_m12) {
    checkFiniteNumbers(arguments);
    if (arguments.length == 6) {
        this.setTransform(/** @type {number} */ (opt_m00),
            /** @type {number} */ (opt_m10),
            /** @type {number} */ (opt_m01),
            /** @type {number} */ (opt_m11),
            /** @type {number} */ (opt_m02),
            /** @type {number} */ (opt_m12));
    } else if (arguments.length != 0) {
        throw Error('Insufficient matrix parameters');
    } else {
        this.m00_ = this.m11_ = 1;
        this.m10_ = this.m01_ = this.m02_ = this.m12_ = 0;
    }
};

/**
 * @return {boolean} Whether this transform is the identity transform.
 */
AffineTransform.prototype.isIdentity = function() {
    return this.m00_ == 1 && this.m10_ == 0 && this.m01_ == 0 &&
        this.m11_ == 1 && this.m02_ == 0 && this.m12_ == 0;
};


/**
 * @return {!AffineTransform} A copy of this transform.
 */
AffineTransform.prototype.clone = function() {
    return new AffineTransform(this.m00_, this.m10_, this.m01_,
        this.m11_, this.m02_, this.m12_);
};


/**
 * Sets this transform to the matrix specified by the 6 values.
 *
 * @param {number} m00 The m00 coordinate of the transform.
 * @param {number} m10 The m10 coordinate of the transform.
 * @param {number} m01 The m01 coordinate of the transform.
 * @param {number} m11 The m11 coordinate of the transform.
 * @param {number} m02 The m02 coordinate of the transform.
 * @param {number} m12 The m12 coordinate of the transform.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.setTransform = function(m00, m10, m01,
                                                                m11, m02, m12) {
    checkFiniteNumbers(arguments);
    this.m00_ = m00;
    this.m10_ = m10;
    this.m01_ = m01;
    this.m11_ = m11;
    this.m02_ = m02;
    this.m12_ = m12;
    return this;
};


/**
 * Sets this transform to be identical to the given transform.
 *
 * @param {!AffineTransform} tx The transform to copy.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.copyFrom = function(tx) {
    checkFiniteNumbers([tx.m00_, tx.m01_, tx.m02_, tx.m10_, tx.m11_, tx.m12_]);
    this.m00_ = tx.m00_;
    this.m10_ = tx.m10_;
    this.m01_ = tx.m01_;
    this.m11_ = tx.m11_;
    this.m02_ = tx.m02_;
    this.m12_ = tx.m12_;
    return this;
};


/**
 * Concatenates this transform with a scaling transformation.
 *
 * @param {number} sx The x-axis scaling factor.
 * @param {number} sy The y-axis scaling factor.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.scale = function(sx, sy) {
    checkFiniteNumbers(arguments);
    this.m00_ *= sx;
    this.m10_ *= sx;
    this.m01_ *= sy;
    this.m11_ *= sy;
    return this;
};


/**
 * Pre-concatenates this transform with a scaling transformation,
 * i.e. calculates the following matrix product:
 *
 * <pre>
 * [sx  0 0] [m00 m01 m02]
 * [ 0 sy 0] [m10 m11 m12]
 * [ 0  0 1] [  0   0   1]
 * </pre>
 *
 * @param {number} sx The x-axis scaling factor.
 * @param {number} sy The y-axis scaling factor.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.preScale = function(sx, sy) {
    checkFiniteNumbers(arguments);
    this.m00_ *= sx;
    this.m01_ *= sx;
    this.m02_ *= sx;
    this.m10_ *= sy;
    this.m11_ *= sy;
    this.m12_ *= sy;
    return this;
};


/**
 * Concatenates this transform with a translate transformation.
 *
 * @param {number} dx The distance to translate in the x direction.
 * @param {number} dy The distance to translate in the y direction.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.translate = function(dx, dy) {
    checkFiniteNumbers(arguments);
    this.m02_ += dx * this.m00_ + dy * this.m01_;
    this.m12_ += dx * this.m10_ + dy * this.m11_;
    return this;
};


/**
 * Pre-concatenates this transform with a translate transformation,
 * i.e. calculates the following matrix product:
 *
 * <pre>
 * [1 0 dx] [m00 m01 m02]
 * [0 1 dy] [m10 m11 m12]
 * [0 0  1] [  0   0   1]
 * </pre>
 *
 * @param {number} dx The distance to translate in the x direction.
 * @param {number} dy The distance to translate in the y direction.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.preTranslate = function(dx, dy) {
    checkFiniteNumbers(arguments);
    this.m02_ += dx;
    this.m12_ += dy;
    return this;
};


/**
 * Concatenates this transform with a rotation transformation around an anchor
 * point.
 *
 * @param {number} theta The angle of rotation measured in radians.
 * @param {number} x The x coordinate of the anchor point.
 * @param {number} y The y coordinate of the anchor point.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.rotate = function(theta, x, y) {
    checkFiniteNumbers(arguments);
    return this.concatenate(
        AffineTransform.getRotateInstance(theta, x, y));
};


/**
 * Pre-concatenates this transform with a rotation transformation around an
 * anchor point.
 *
 * @param {number} theta The angle of rotation measured in radians.
 * @param {number} x The x coordinate of the anchor point.
 * @param {number} y The y coordinate of the anchor point.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.preRotate = function(theta, x, y) {
    checkFiniteNumbers(arguments);
    return this.preConcatenate(
        AffineTransform.getRotateInstance(theta, x, y));
};


/**
 * Concatenates this transform with a shear transformation.
 *
 * @param {number} shx The x shear factor.
 * @param {number} shy The y shear factor.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.shear = function(shx, shy) {
    checkFiniteNumbers(arguments);
    var m00 = this.m00_;
    var m10 = this.m10_;
    this.m00_ += shy * this.m01_;
    this.m10_ += shy * this.m11_;
    this.m01_ += shx * m00;
    this.m11_ += shx * m10;
    return this;
};


/**
 * Pre-concatenates this transform with a shear transformation.
 * i.e. calculates the following matrix product:
 *
 * <pre>
 * [  1 shx 0] [m00 m01 m02]
 * [shy   1 0] [m10 m11 m12]
 * [  0   0 1] [  0   0   1]
 * </pre>
 *
 * @param {number} shx The x shear factor.
 * @param {number} shy The y shear factor.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.preShear = function(shx, shy) {
    checkFiniteNumbers(arguments);
    var m00 = this.m00_;
    var m01 = this.m01_;
    var m02 = this.m02_;
    this.m00_ += shx * this.m10_;
    this.m01_ += shx * this.m11_;
    this.m02_ += shx * this.m12_;
    this.m10_ += shy * m00;
    this.m11_ += shy * m01;
    this.m12_ += shy * m02;
    return this;
};


/**
 * @return {string} A string representation of this transform. The format of
 *     of the string is compatible with SVG matrix notation, i.e.
 *     "matrix(a,b,c,d,e,f)".
 */
AffineTransform.prototype.toString = function() {
    return 'matrix(' +
        [this.m00_, this.m10_, this.m01_, this.m11_, this.m02_, this.m12_].join(
            ',') +
        ')';
};

AffineTransform.prototype.getValue = function (i)
{
    var arr = [this.m00_, this.m10_, this.m01_, this.m11_, this.m02_, this.m12_];
    return arr[i];
}

AffineTransform.prototype.getValues = function ()
{
    return [this.m00_, this.m10_, this.m01_, this.m11_, this.m02_, this.m12_];
}


/**
 * @return {number} The scaling factor in the x-direction (m00).
 */
AffineTransform.prototype.getScaleX = function() {
    return this.m00_;
};


/**
 * @return {number} The scaling factor in the y-direction (m11).
 */
AffineTransform.prototype.getScaleY = function() {
    return this.m11_;
};


/**
 * @return {number} The translation in the x-direction (m02).
 */
AffineTransform.prototype.getTranslateX = function() {
    return this.m02_;
};


/**
 * @return {number} The translation in the y-direction (m12).
 */
AffineTransform.prototype.getTranslateY = function() {
    return this.m12_;
};


/**
 * @return {number} The shear factor in the x-direction (m01).
 */
AffineTransform.prototype.getShearX = function() {
    return this.m01_;
};


/**
 * @return {number} The shear factor in the y-direction (m10).
 */
AffineTransform.prototype.getShearY = function() {
    return this.m10_;
};


/**
 * Concatenates an affine transform to this transform.
 *
 * @param {!AffineTransform} tx The transform to concatenate.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.concatenate = function(tx) {
    checkFiniteNumbers([tx.m00_, tx.m01_, tx.m02_, tx.m10_, tx.m11_, tx.m12_]);
    var m0 = this.m00_;
    var m1 = this.m01_;
    this.m00_ = tx.m00_ * m0 + tx.m10_ * m1;
    this.m01_ = tx.m01_ * m0 + tx.m11_ * m1;
    this.m02_ += tx.m02_ * m0 + tx.m12_ * m1;

    m0 = this.m10_;
    m1 = this.m11_;
    this.m10_ = tx.m00_ * m0 + tx.m10_ * m1;
    this.m11_ = tx.m01_ * m0 + tx.m11_ * m1;
    this.m12_ += tx.m02_ * m0 + tx.m12_ * m1;
    return this;
};


/**
 * Pre-concatenates an affine transform to this transform.
 *
 * @param {!AffineTransform} tx The transform to preconcatenate.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.preConcatenate = function(tx) {
    checkFiniteNumbers([tx.m00_, tx.m01_, tx.m02_, tx.m10_, tx.m11_, tx.m12_]);
    var m0 = this.m00_;
    var m1 = this.m10_;
    this.m00_ = tx.m00_ * m0 + tx.m01_ * m1;
    this.m10_ = tx.m10_ * m0 + tx.m11_ * m1;

    m0 = this.m01_;
    m1 = this.m11_;
    this.m01_ = tx.m00_ * m0 + tx.m01_ * m1;
    this.m11_ = tx.m10_ * m0 + tx.m11_ * m1;

    m0 = this.m02_;
    m1 = this.m12_;
    this.m02_ = tx.m00_ * m0 + tx.m01_ * m1 + tx.m02_;
    this.m12_ = tx.m10_ * m0 + tx.m11_ * m1 + tx.m12_;
    return this;
};


/**
 * Transforms an array of coordinates by this transform and stores the result
 * into a destination array.
 *
 * @param {!Array.<number>} src The array containing the source points
 *     as x, y value pairs.
 * @param {number} srcOff The offset to the first point to be transformed.
 * @param {!Array.<number>} dst The array into which to store the transformed
 *     point pairs.
 * @param {number} dstOff The offset of the location of the first transformed
 *     point in the destination array.
 * @param {number} numPts The number of points to tranform.
 */
AffineTransform.prototype.transform = function(src, srcOff, dst,
                                                             dstOff, numPts) {
    var i = srcOff;
    var j = dstOff;
    var srcEnd = srcOff + 2 * numPts;
    while (i < srcEnd) {
        var x = src[i++];
        var y = src[i++];
        dst[j++] = x * this.m00_ + y * this.m01_ + this.m02_;
        dst[j++] = x * this.m10_ + y * this.m11_ + this.m12_;
    }
};

AffineTransform.prototype.transformPoint = function(x, y) {
    checkFiniteNumbers(arguments);
    return {
        x :  x * this.m00_ + y * this.m01_ + this.m02_,
        y :  x * this.m10_ + y * this.m11_ + this.m12_
    };
};


/**
 * @return {number} The determinant of this transform.
 */
AffineTransform.prototype.getDeterminant = function() {
    return this.m00_ * this.m11_ - this.m01_ * this.m10_;
};


/**
 * Returns whether the transform is invertible. A transform is not invertible
 * if the determinant is 0 or any value is non-finite or NaN.
 *
 * @return {boolean} Whether the transform is invertible.
 */
AffineTransform.prototype.isInvertible = function() {
    var det = this.getDeterminant();
    return isFiniteNumber(det) &&
        isFiniteNumber(this.m02_) &&
        isFiniteNumber(this.m12_) &&
        det != 0;
};


/**
 * @return {!AffineTransform} An AffineTransform object
 *     representing the inverse transformation.
 */
AffineTransform.prototype.createInverse = function() {
    var det = this.getDeterminant();
    return new AffineTransform(
        this.m11_ / det,
        -this.m10_ / det,
        -this.m01_ / det,
        this.m00_ / det,
        (this.m01_ * this.m12_ - this.m11_ * this.m02_) / det,
        (this.m10_ * this.m02_ - this.m00_ * this.m12_) / det);
};


/**
 * Creates a transform representing a scaling transformation.
 *
 * @param {number} sx The x-axis scaling factor.
 * @param {number} sy The y-axis scaling factor.
 * @return {!AffineTransform} A transform representing a scaling
 *     transformation.
 */
AffineTransform.getScaleInstance = function(sx, sy) {
    checkFiniteNumbers(arguments);
    return new AffineTransform().setToScale(sx, sy);
};


/**
 * Creates a transform representing a translation transformation.
 *
 * @param {number} dx The distance to translate in the x direction.
 * @param {number} dy The distance to translate in the y direction.
 * @return {!AffineTransform} A transform representing a
 *     translation transformation.
 */
AffineTransform.getTranslateInstance = function(dx, dy) {
    checkFiniteNumbers(arguments);
    return new AffineTransform().setToTranslation(dx, dy);
};


/**
 * Creates a transform representing a shearing transformation.
 *
 * @param {number} shx The x-axis shear factor.
 * @param {number} shy The y-axis shear factor.
 * @return {!AffineTransform} A transform representing a shearing
 *     transformation.
 */
AffineTransform.getShearInstance = function(shx, shy) {
    checkFiniteNumbers(arguments);
    return new AffineTransform().setToShear(shx, shy);
};


/**
 * Creates a transform representing a rotation transformation.
 *
 * @param {number} theta The angle of rotation measured in radians.
 * @param {number} x The x coordinate of the anchor point.
 * @param {number} y The y coordinate of the anchor point.
 * @return {!AffineTransform} A transform representing a rotation
 *     transformation.
 */
AffineTransform.getRotateInstance = function(theta, x, y) {
    checkFiniteNumbers(arguments);
    return new AffineTransform().setToRotation(theta, x, y);
};


/**
 * Sets this transform to a scaling transformation.
 *
 * @param {number} sx The x-axis scaling factor.
 * @param {number} sy The y-axis scaling factor.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.setToScale = function(sx, sy) {
    checkFiniteNumbers(arguments);
    return this.setTransform(sx, 0, 0, sy, 0, 0);
};


/**
 * Sets this transform to a translation transformation.
 *
 * @param {number} dx The distance to translate in the x direction.
 * @param {number} dy The distance to translate in the y direction.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.setToTranslation = function(dx, dy) {
    checkFiniteNumbers(arguments);
    return this.setTransform(1, 0, 0, 1, dx, dy);
};


/**
 * Sets this transform to a shearing transformation.
 *
 * @param {number} shx The x-axis shear factor.
 * @param {number} shy The y-axis shear factor.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.setToShear = function(shx, shy) {
    checkFiniteNumbers(arguments);
    return this.setTransform(1, shy, shx, 1, 0, 0);
};


/**
 * Sets this transform to a rotation transformation.
 *
 * @param {number} theta The angle of rotation measured in radians.
 * @param {number} x The x coordinate of the anchor point.
 * @param {number} y The y coordinate of the anchor point.
 * @return {!AffineTransform} This affine transform.
 */
AffineTransform.prototype.setToRotation = function(theta, x, y) {
    checkFiniteNumbers(arguments);
    var cos = Math.cos(theta);
    var sin = Math.sin(theta);
    return this.setTransform(cos, sin, -sin, cos,
        x - x * cos + y * sin, y - x * sin - y * cos);
};


/**
 * Compares two affine transforms for equality.
 *
 * @param {AffineTransform} tx The other affine transform.
 * @return {boolean} whether the two transforms are equal.
 */
AffineTransform.prototype.equals = function(tx) {
    checkFiniteNumbers(arguments);
    if (this == tx) {
        return true;
    }
    if (!tx) {
        return false;
    }
    return this.m00_ == tx.m00_ &&
        this.m01_ == tx.m01_ &&
        this.m02_ == tx.m02_ &&
        this.m10_ == tx.m10_ &&
        this.m11_ == tx.m11_ &&
        this.m12_ == tx.m12_;
};

AffineTransform.prototype.toCssNoTranslate = function(o)
{
    var options = $.extend({isMoz:false, roundTranslate:false},  o);
    if(options.isMoz) {
        return "matrix("+this.m00_.toFixed(8)+","+this.m10_.toFixed(8)+","+this.m01_.toFixed(8)+","+this.m11_.toFixed(8)+",0,0)";
    } else {
        return "matrix("+this.m00_.toFixed(8)+","+this.m10_.toFixed(8)+","+this.m01_.toFixed(8)+","+this.m11_.toFixed(8)+",0,0)";
    }
};

AffineTransform.prototype.toCss = function(o)
{
    var options = $.extend({isMoz:false, roundTranslate:false},  o);
    var translateX = options.roundTranslate ? Math.round(this.m02_) : this.m02_;
    var translateY =  options.roundTranslate ? Math.round(this.m12_) : this.m12_;
    if(options.isMoz) {
        return "matrix("+this.m00_.toFixed(8)+","+this.m10_.toFixed(8)+","+this.m01_.toFixed(8)+","+this.m11_.toFixed(8)+","
            +translateX+"px,"+translateY+"px)";
    } else {
        return "matrix("+this.m00_.toFixed(8)+","+this.m10_.toFixed(8)+","+this.m01_.toFixed(8)+","+this.m11_.toFixed(8)+","
            +translateX+","+translateY+")";
    }
};


window.AffineTransform = AffineTransform;

})();