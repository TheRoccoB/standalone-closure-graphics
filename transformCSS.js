transformCSS = function (transform, o) {

    var options = $.extend({originX:0, originY:0, roundTranslate:false, matrixOnly:false}, o), transformCss,
        transform_origin;

    //notice: safari 5.1 does not like mixing top and left with matrix transforms.
    //you may want to call this with forceMatrixOnly.
    if (this.forceMatrixOnly) {
        options.matrixOnly = true;
    }

    if (options.matrixOnly) {

        transformCss = transform.toCss({isMoz:false, roundTranslate:options.roundTranslate});
        transform_origin = options.originX + ' ' + options.originY;
        return {"-moz-transform":transform.toCss({isMoz:true, roundTranslate:options.roundTranslate}),
            "-webkit-transform":transformCss,
            "-o-transform":transformCss,
            msTransform:transformCss,
            "transform":transformCss,
            "transform-origin":transform_origin,
            msTransformOrigin:transform_origin,
            "-webkit-transform-origin":transform_origin,
            "-moz-transform-origin":transform_origin,
            "-o-transform-origin":transform_origin};

    } else {
        transformCss = transform.toCssNoTranslate({isMoz:false, roundTranslate:options.roundTranslate});
        transform_origin = options.originX + ' ' + options.originY;
        return {"-moz-transform":transform.toCssNoTranslate({isMoz:true, roundTranslate:options.roundTranslate}),
            "-webkit-transform":transformCss,
            "-o-transform":transformCss,
            msTransform:transformCss,
            "transform":transformCss,
            "transform-origin":transform_origin,
            msTransformOrigin:transform_origin,
            "-webkit-transform-origin":transform_origin,
            "-moz-transform-origin":transform_origin,
            "-o-transform-origin":transform_origin,
            "top":transform.getTranslateY(),
            "left":transform.getTranslateX()};
    }
}

