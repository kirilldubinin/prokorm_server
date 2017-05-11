/*
 * angular-material-icons v0.7.1
 * (c) 2014 Klar Systems
 * License: MIT
 */

/* jshint -W097, -W101 */
'use strict';

angular.module('ngMdIcons', [])
    .directive('ngMdIcon', ['ngMdIconService', function (ngMdIconService) {
        var shapes = ngMdIconService.getShapes();

        return {
            restrict: 'AE',
            link: function(scope, element, attr) {

                var icon, size, viewBox;

                var render = function() {
                    // icon
                    if (attr.icon !== undefined) {
                        icon = attr.icon;
                        // Check for material-design-icons style name, and extract icon / size
                        var ss = icon.match(/ic_(.*)_([0-9]+)px.svg/m);
                        if (ss !== null) {
                            icon = ss[1];
                            size = ss[2];
                        }
                    } else {
                        icon = 'help';
                    }
                    // validate
                    if (shapes[icon] === undefined) {
                        icon = 'help';
                    }

                    // size
                    if (attr.size !== undefined) {
                        size = attr.size;
                    }
                    else if (size !== null) {
                        size = 24;
                    }

                    // viewBox
                    if (attr.viewBox !== undefined) {
                        viewBox = attr.viewBox;
                    }
                    else {
                        viewBox = ngMdIconService.getViewBox(icon) ? ngMdIconService.getViewBox(icon) : '0 0 24 24';
                    }

                    // render
                    element.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" width="' + size + '" height="' + size + '">' + shapes[icon] + '</svg>');
                };

                var replace = function(newicon) {
                    // validate
                    if (shapes[newicon] === undefined) {
                        newicon = 'help';
                    }
                    if (newicon === icon) { return; }
                    // render new and old icons (old icon will be shown by default)
                    element.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + size + '" height="' + size + '"><g id="' + newicon + '" style="display:none">' + shapes[newicon] + '</g><g id="' + icon + '" style="display:none">' + shapes[icon] + '</g></svg>');
                    // morph
                    var options = JSON.parse(attr.options || null);
                    try {
                        // this block will succeed if SVGMorpheus is available
                        new SVGMorpheus(element.children()[0]).to(newicon, options);
                    } catch (error) {
                        // fallback
                        element.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + size + '" height="' + size + '">' + shapes[newicon] + '</svg>');
                    }
                    icon = newicon;
                };

                var resize = function(newsize) {
                    if (newsize === size) { return; }
                    element.children()[0].setAttribute('width', newsize);
                    element.children()[0].setAttribute('height', newsize);
                    size = newsize;
                };

                // render the first time
                render();

                // watch for any changes
                if (attr.icon !== undefined) { attr.$observe('icon', replace); }
                if (attr.size !== undefined) { attr.$observe('size', resize);  }
            }
        };
    }])
    .provider('ngMdIconService', function () {
        var provider, service, shapes, viewBoxes;

        shapes = includedShapes();
        viewBoxes = {};

        service = {
            getShape : getShape,
            getShapes: getShapes,
            getViewBox : getViewBox,
            getViewBoxes: getViewBoxes,
            setShape : addShape,
            setShapes: addShapes,
            setViewBox : addViewBox,
            setViewBoxes: addViewBoxes,
            addShape : addShape,
            addShapes: addShapes,
            addViewBox : addViewBox,
            addViewBoxes: addViewBoxes
        };

        provider = {
            $get     : ngMdIconServiceFactory,
            getShape : getShape,
            getShapes: getShapes,
            getViewBox : getViewBox,
            getViewBoxes: getViewBoxes,
            setShape : addShape,
            setShapes: addShapes,
            setViewBox : addViewBox,
            setViewBoxes: addViewBoxes,
            addShape : addShape,
            addShapes: addShapes,
            addViewBox : addViewBox,
            addViewBoxes: addViewBoxes
        };

        return provider;

        function addShape(name, shape) {
            shapes[name] = shape;

            return provider; // chainable function
        }

        function addShapes(newShapes) {
            shapes = angular.extend(shapes, newShapes);

            return provider; // chainable function
        }

        function addViewBox(name, viewBox) {
            viewBoxes[name] = viewBox;

            return provider; // chainable function
        }

        function addViewBoxes(newViewBoxes) {
            viewBoxes = angular.extend(viewBoxes, newViewBoxes);

            return provider; // chainable function
        }

        function getShape(name) {
            return shapes[name];
        }

        function getShapes() {
            return shapes;
        }

        function getViewBox(name) {
            return viewBoxes[name];
        }

        function getViewBoxes() {
            return viewBoxes;
        }

        function includedShapes() {
            return {
                'login': '<path d="M10 17.25V14H3v-4h7V6.75L15.25 12 10 17.25"/><path d="M8 2h9a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4h2v4h9V4H8v4H6V4a2 2 0 0 1 2-2z"/>',
                'logout': '<path d="M17 17.25V14h-7v-4h7V6.75L22.25 12 17 17.25"/><path d="M13 2a2 2 0 0 1 2 2v4h-2V4H4v16h9v-4h2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z"/>',
                // action
                'add_box':'<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>',
                'local_print_shop': '<path d="M19 12c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-3 7H8v-5h8v5zm3-11H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3z"/><path d="M18 3H6v4h12V3z"/>',
                'note_add': '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"/>',
                'delete': '<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>',
                'delete_forever': '<path d="M8.46 11.88l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/><path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>',
                'plus_one': '<path d="M10 8H8v4H4v2h4v4h2v-4h4v-2h-4z"/><path d="M14.5 6.08V7.9l2.5-.5V18h2V5z"/>',
                'arrow_back': '<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>',
                'menu': '<path d="M3 18h18v-2H3v2z"/><path d="M3 13h18v-2H3v2z"/><path d="M3 6v2h18V6H3z"/>',
                'print': '<path d="M19 12c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-3 7H8v-5h8v5zm3-11H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3z"/><path d="M18 3H6v4h12V3z"/>',
                'account_circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>',
                'help_outline': '<path d="M11 18h2v-2h-2v2z"/><path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>',
                'info_outline': '<path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M11 9h2V7h-2v2zm0 8h2v-6h-2v6z"/>',
                'local_drink': '<path d="M3 2l2.01 18.23C5.13 21.23 5.97 22 7 22h10c1.03 0 1.87-.77 1.99-1.77L21 2H3zm9 17c-1.66 0-3-1.34-3-3 0-2 3-5.4 3-5.4s3 3.4 3 5.4c0 1.66-1.34 3-3 3zm6.33-11H5.67l-.44-4h13.53l-.43 4z"/>',
                'exit_to_app': '<path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59z"/><path d="M19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>'
            };
        }

        function ngMdIconServiceFactory() {
            return service;
        }
    })
;
