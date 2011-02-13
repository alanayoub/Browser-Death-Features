/**
 * @fileoverview This is a browser CSS support testing tool
 * {@link http://www.alanayoub.com alanayoub.com}
 * @author Alan Ayoub alanayoub@gmail.com
 * @version 0.1
 */

/**
 * The whole app is contained under this namespace (FS = Feature Support)
 * @namespace
 */
var FS = (function (window,document,undefined) {

    /** @private */
    var data,
        util,
        timer,
        handleForm,
        processData,
        VENDOR_PROPERTIES,
        IE_FILTERS,
        browserArr = "IE5.5|IE6|IE7|IE8|FF2.0|FF3.0|FF3.5|FF3.6|SA3.0|SA3.1|SA4.0|SA5.0|CH1|CH2|CH3|CH4|CH5|CH6|CH7|CH8|CH9|OP10|OP10.6|OP11.0".split('|'),
        form = document.getElementsByTagName('form')[0];

    /**
     * @namespace
     */
    processData = {

        /**
         * @param {Array} features is an array of Strings describing what data to display
         * for example: ["css3.declarations", "css2.declarations"]
         * @return returns a String of HTML, this is the html we want to display
         * @type String
         */
        returnHTML: function (features) {
            var result = '',
                i = features.length;
            while (i--) {
                result += this.getSingleResultTable(features[i]);
            }
            return result;
        },

        /**
         * Takes a string defining the type of data required,
         * retrieves the data from another function,
         * builds a HTML table and returns the result
         * @requires #getCustomCompatibilityData
         * @param {String} dataType is a String defining the data required (css3 declarations? css2.1 selectors...)
         * @return returns a HTML table as a string
         * @type String
         */
        getSingleResultTable: function (dataType) {
            var custData,
                result,
                i,
                dataName;
            dataName = dataType.replace('.', ' ');
            custData = this.getCustomCompatibilityData(data.browserData(), data.compatibilityData(dataType));
            result =                '<table><caption>' + dataName + '</caption>';
            i = custData.length;
            while (i--) {
                result +=               '<tr><td>' + custData[i]["perc"] + '%</td><td></td><td> ' + custData[i]["cssp"] + '</td></tr>';
            }
            result +=               '</table>';
            return result;
        },

        /**
         * @param {Object} browserData is a Json object with the browser name / percentage values
         * @param {Object} compatData is Json with browser compatibility information
         * @return returns an Array of object literals with CSS properties and percentage value of supported browsers
         * @type Array
         */
        getCustomCompatibilityData: function (browserData, compatData) {

            var cssProperty,          // the current CSS property name
                supportMatrix = [],   // browser support matrix for individual CSS property
                percent,              // the total percent each feature is supported by
                browserName,          // the current browser name
                browserSupport,       // the current browser support for the current CSS property (o|1|b|f)
                result = [],          // array of object literals
                i = compatData.length, k;

            while (i--) {
                cssProperty = compatData[i].split('&')[0];
                supportMatrix = compatData[i].split('&')[1].replace(/\s/g, '').split('');
                percent = 0;
                k = supportMatrix.length;

                while (k--) {

                    browserName = browserArr[k];
                    browserSupport = supportMatrix[k];

                    if (browserData[browserName]) {
                        switch (browserSupport) {
                        case "1":
                            percent += browserData[browserName];
                            break;
                        case "b":
                            if (VENDOR_PROPERTIES) {
                                percent += browserData[browserName];
                            }
                            break;
                        case "f":
                            if (IE_FILTERS) {
                                percent += browserData[browserName];
                            }
                            break;
                        }
                    }

                    result[i] = {
                        "cssp": cssProperty,
                        "perc": percent.toFixed(1)
                    };
                }
            }

            result.sort( // Sort by percentage
                    function (a, b) {
                        return a["perc"] - b["perc"];
                    });

            return result;
        },

        /**
         * Checks the HTML form for what tables the user requested to display
         * @return an array of strings
         * @type Array
         */
        getRequiredInfoTables: function () {
            var requiredInfoTables = [],
                formLabelName,
                formDataTypeField = form.dataType,
                i = formDataTypeField.length;
                while (i--) {
                    if (formDataTypeField[i].checked) {
                        formLabelName = formDataTypeField[i].nextSibling.innerHTML;
                        requiredInfoTables.push(formLabelName.replace(' ', '.'));
                    }
                }
            requiredInfoTables = requiredInfoTables.sort();
            return requiredInfoTables;
        }

    };

    /**
     * @namespace
     */
    data = {
        /**
         * @param {String} type is a string with the data that are being requested i.e. "css3.selectors" or "css21.declarations"...)
         * @return returns a Json Object with the browser data information
         * @type Object
         */
        compatibilityData: function (type) {

                                                                              //  -IE- -FF- -SA- --CHROME-- OP-
                                                                              //                          1 111
            var data = {                                                      //  5678 2333 3345 1234567890 001
                css3: {                                                       //  .... .... .... .......... ...
                    declarations: [                                           //  5xxx 0056 0100 0000000000 060
                            'text-stroke                                         &0000 0000 11bb 000000000x 000',
                            'text-shadow                                         &0000 0011 1111 011111111x 111',
                            'text-overflow                                       &0111 0000 1111 111111111x 111',
                            'resize                                              &0000 0000 1111 001111111x 000',
                            'opacity                                             &ffff 1111 1111 111111111x 111',
                            'gradient                                            &000f 000b 00bb 0bbbbbbbbx 000',
                            'columns                                             &0000 bbbb bbbb bbbbbbbbbx 000',
                            'box-sizing                                          &0001 bbbb 1bbb bbbbbbbb1x 111',
                            'box-sizing: content-box                             &0001 bbbb 1bbb bbbbbbbb1x 111',
                            'box-sizing: border-box                              &0001 bbbb 1bbb bbbbbbbb1x 111',
                            'box-sizing: padding-box                             &0000 bbbb 0000 000000000x 000',
                            'box-shadow                                          &0000 00bb bbbb bbbbbbbbbx 011',
                            'border-radius                                       &0000 bbbb bbb1 bbb111111x 011',
                            'content: none                                       &0001 0111 0000 000000001x 001',
                            'content: counter                                    &0001 1111 1111 111111111x 111',
                            'content: attr()                                     &0001 1111 1111 111111111x 111',
                            'content: string                                     &0001 1111 1111 111111111x 111',
                            'content: URL                                        &0001 1111 1111 111111111x 111',
                            'multiple background images                          &0000 0001 1111 11111 111x 011',
                            'background-attachment: fixed                        &0011 1111 1111 11111 111x 111',
                            'background-attachment: local                        &0011 0001 0011 00011 111x 011',
                            'background-repeat: '
                                    + 'repeat,'
                                    + 'repeat-x,'
                                    + 'repeat-y,'
                                    + 'no-repeat                                 &0111 1111 1111 11111 111x 111',
                            'background-repeat: space                            &0000 0000 0000 00000 000x 011',
                            'background-repeat: round                            &0000 0000 0000 00000 000x 011',
                            'background-clip: padding-box                        &0000 0000 00b1 0bb11 111x 011',
                            'background-clip: border-box                         &0000 0000 1111 11111 111x 011',
                            'background-clip: content-box                        &0000 0000 00bb 0bbbb bbbx 011',
                            'background-origin: padding-box                      &0000 0000 11b1 01111 111x 011',
                            'background-origin: border-box                       &0000 0000 00b1 0bb10 111x 111',
                            'background-origin: content-box                      &0000 0000 00b1 0bb11 111x 011',
                            'background-size: [length]                           &0000 000b bbb1 bbb11 111x b11',
                            'background-size: [percentage]                       &0000 000b bbb1 bbb11 111x b11',
                            'background-size: contain                            &0000 000b 0001 00011 111x 011',
                            'background-size: cover                              &0000 000b 0001 00011 111x 011',
                            'border-image                                        &0000 00bb bbbb 0bbbb bbbx 000'
                    ],
                    selectors: [
                            'media queries                                       &0000 0011 0011 011111111x 111',
                            'media queries (min-width)                           &0000 0011 0011 011111111x 111',
                            'media queries (max-width)                           &0000 0011 0011 011111111x 111',
                            'media queries (device-aspect-ratio)                 &0000 0001 0101 000111111x 011',
                            '::selection                                         &0000 bbbb 1111 111111111x 111',
                            ':only-of-type                                       &0000 0011 0111 111111111x 111',
                            ':nth-of-type()                                      &0000 0011 0111 111111111x 111',
                            ':nth-last-of-type()                                 &0000 0011 0111 111111111x 111',
                            ':nth-last-child()                                   &0000 0011 0111 111111111x 111',
                            ':nth-child()                                        &0000 0011 0111 111111111x 111',
                            ':only-child                                         &0000 0111 0111 111111111x 111',
                            ':last-of-type                                       &0000 0011 0111 111111111x 111',
                            ':last-child                                         &0000 0111 0111 111111111x 111',
                            ':first-of-type                                      &0000 0011 0111 111111111x 111',
                            ':empty                                              &0000 0111 0111 111111111x 111',
                            ':enabled                                            &0000 1111 1111 111111111x 111',
                            ':disabled                                           &0000 1111 1111 111111111x 111',
                            ':checked                                            &0000 1111 1111 111111111x 111',
                            ':target                                             &0000 1111 1111 111111111x 111',
                            ':root                                               &0000 1111 1111 111111111x 111',
                            ':not                                                &0000 1111 1111 111111111x 111',
                            'advanced [attr] selectors                           &0011 0111 0111 111111111x 111',
                            '~ selector                                          &0011 1111 1111 111111111x 111'
                    ]
                },
                                                                              //  -IE- -FF- -SA- --CHROME-- OP-
                                                                              //                          1 111
                                                                              //  5678 2333 3345 1234567890 001
                css21: {                                                      //  .... .... .... .......... ...
                    declarations: [                                           //  5xxx 0056 0100 0000000000 060
                            'white-space                                         &0001 0011 1111 111111111x 111',
                            'white-space: nowrap                                 &1111 1111 1111 111111111x 111',
                            'white-space: pre                                    &0111 1111 1111 111111111x 111',
                            'white-space: pre-wrap                               &0001 0111 1111 111111111x 111',
                            'white-space: pre-line                               &0001 0011 1111 111111111x 111',
                            'table declarations                                  &0001 1111 1111 111111111x 111',
                            '(table declaration) empty-cells: show               &0001 1111 1111 111111111x 111',
                            '(table declaration) empty-cells: hide               &0001 1111 1111 111111111x 111',
                            '(table declaration) border-collapse: collapse       &1111 1111 1111 111111111x 111',
                            '(table declaration) border-spacing                  &0001 1111 1111 111111111x 111',
                            '(table declaration) border-spacing with 2 values    &1111 1111 1111 111111111x 111',
                            '(table declaration) table-layout: fixed             &1111 1111 1111 111111111x 111',
                            '(table declaration) caption-side                    &0001 1111 1111 111111111x 111',
                            'table columns                                       &0001 1111 1111 111111111x 111',
                            '(table columns) background-color                    &1111 1111 1111 111111111x 111',
                            '(table columns) border                              &0001 1111 1111 111111111x 111',
                            '(table columns) width                               &1111 1111 1111 111111111x 111',
                            '(table columns) visibility: hidden                  &0110 0000 0000 000000000x 000',
                            '(table columns) visibility: collapse                &0001 1111 0000 000000000x 011',
                            'position                                            &0001 1111 1111 111111111x 111',
                            'position: relative                                  &1111 1111 1111 111111111x 111',
                            'position: absolute                                  &1111 1111 1111 111111111x 111',
                            'position: fixed                                     &0011 1111 1111 111111111x 111',
                            'overflow                                            &1111 1111 1111 111111111x 111',
                            'overflow: hidden                                    &1111 1111 1111 111111111x 111',
                            'overflow: auto                                      &1111 1111 1111 111111111x 111',
                            'overflow: scroll                                    &1111 1111 1111 111111111x 111',
                            'outline                                             &0001 1111 1111 111111111x 111',
                            'min/max-width/height                                &0011 1111 1111 111111111x 111',
                            'min-height                                          &0011 1111 1111 111111111x 111',
                            'max-height                                          &0011 1111 1111 111111111x 111',
                            'min-width                                           &0011 1111 1111 111111111x 111',
                            'max-width                                           &0011 1111 1111 111111111x 111',
                            'list styles                                         &0001 1111 1111 111111111x 111',
                            'list-style-type: armenian                           &0001 1111 0111 111111111x 111',
                            'list-style-type: binary                             &0000 0000 0001 000011111x 000',
                            'list-style-type: box                                &0000 0000 0000 000000000x 110',
                            'list-style-type: circle                             &1111 1111 1111 111111111x 111',
                            'list-style-type: decimal                            &1111 1111 1111 111111111x 111',
                            'list-style-type: decimal-leading-zero               &0001 1111 1111 111111111x 111',
                            'list-style-type: disc                               &1111 1111 1111 111111111x 111',
                            'list-style-type: georgian                           &0001 1111 0111 111111111x 111',
                            'list-style-type: lower-alpha                        &1111 1111 1111 111111111x 111',
                            'list-style-type: lower-greek                        &0001 1111 1111 111111111x 111',
                            'list-style-type: lower-hexadecimal                  &0000 0000 0001 000011111x 000',
                            'list-style-type: lower-latin                        &0001 1111 1111 111111111x 111',
                            'list-style-type: lower-norwegian                    &0000 0000 0001 000011111x 000',
                            'list-style-type: lower-roman                        &1111 1111 1111 111111111x 111',
                            'list-style-type: none                               &1111 1111 1111 111111111x 111',
                            'list-style-type: octal                              &0000 0000 0001 000011111x 000',
                            'list-style-type: square                             &1111 1111 1111 111111111x 111',
                            'list-style-type: upper-alpha                        &1111 1111 1111 111111111x 111',
                            'list-style-type: upper-greek                        &0001 0000 0001 000011111x 000',
                            'list-style-type: upper-hexadecimal                  &0000 0000 0001 000011111x 000',
                            'list-style-type: upper-latin                        &0001 1111 1111 111111111x 111',
                            'list-style-type: upper-norwegian                    &0000 0000 0001 000011111x 000',
                            'list-style-type: upper-roman                        &1111 1111 1111 111111111x 111',
                            'display                                             &0001 0111 0011 111111111x 111',
                            'display: block                                      &1111 1111 1111 111111111x 111',
                            'display: inline                                     &1111 1111 1111 111111111x 111',
                            'display: none                                       &1111 1111 1111 111111111x 111',
                            'display: inline-block                               &0001 0111 1111 111111111x 111',
                            'display: list-item                                  &0111 1111 1111 111111111x 111',
                            'display: run-in                                     &0001 0000 0001 000111111x 111',
                            'display: table                                      &0001 1111 1111 111111111x 111',
                            'cursor                                              &1111 1111 1111 111111111x 111',
                            'cursor: all-scroll                                  &0111 1111 1111 111111111x 000',
                            'cursor: col-resize                                  &0111 1111 1111 111111111x 000',
                            'cursor: crosshair                                   &1111 1111 1111 111111111x 111',
                            'cursor: default                                     &1111 1111 1111 111111111x 111',
                            'cursor: hand                                        &1111 0000 0000 000000000x 111',
                            'cursor: help                                        &1111 1111 1111 111111111x 111',
                            'cursor: move                                        &1111 1111 1111 111111111x 111',
                            'cursor: no-drop                                     &0111 1111 1111 111111111x 000',
                            'cursor: not-allowed                                 &0111 1111 1111 111111111x 000',
                            'cursor: pointer                                     &0111 1111 1111 111111111x 111',
                            'cursor: progress                                    &0111 1111 1111 111111111x 111',
                            'cursor: row-resize                                  &0111 1111 1111 111111111x 000',
                            'cursor: text                                        &1111 1111 1111 111111111x 111',
                            'cursor: url                                         &ffff 1111 1111 111111111x 000',
                            'cursor: vertical-text                               &0111 1111 0111 111111111x 000',
                            'cursor: wait                                        &1111 1111 1111 111111111x 111',
                            'cursor: *-resize                                    &1111 1111 1111 111111111x 111',
                            'counters                                            &0001 1111 1111 111111111x 111',
                            'content                                             &0001 1111 1111 111111111x 111',
                            'content: none                                       &0001 0111 0000 000000001x 001',
                            'content: counter                                    &0001 1111 1111 111111111x 111',
                            'content: attr()                                     &0001 1111 1111 111111111x 111',
                            'content: string                                     &0001 1111 1111 111111111x 111',
                            'content: URL                                        &0001 1111 1111 111111111x 111'
                    ],
                    selectors: [
                            ':focus                                              &0000 1111 1111 111111111x 111',
                            ':first-line and :first-letter                       &1111 1111 1111 111111111x 111',
                            ':first-child                                        &0000 0111 0111 111111111x 111',
                            ':hover and :active                                  &0001 1111 1111 111111111x 111',
                            ':before and :after                                  &0000 1111 1111 111111111x 111',
                            'Multiple classes                                    &0011 1111 1111 111111111x 111',
                            '[attr] selector                                     &0011 1111 1111 111111111x 111',
                            '"+" selector                                        &0000 1111 1111 111111111x 111',
                            '> selector                                          &0011 1111 1111 111111111x 111',
                            '* selector                                          &1111 1111 1111 111111111x 111'
                    ]
                }
            };
            switch (type) {
            case "CSS3.Declarations":
                return data.css3.declarations;
            case "CSS3.Selectors":
                return data.css3.selectors;
            case "CSS2.Declarations":
                return data.css21.declarations;
            case "CSS2.Selectors":
                return data.css21.selectors;
            }
        },

        /**
         * @return json with browser name / percentage values
         */
        browserData: function () {
            var i = browserArr.length, prop, frm, val, obj = {};
            while (i--) {
                prop = browserArr[i];                         // IE5.5
                frm = prop.replace('.', '');                  // IE55
                val = parseFloat($('#' + frm).val(), 10);     // 16.3
                obj[prop] = val;
            }
            return obj;
        }
    };

    /**
     * @namespace
     * A bunch of methods to manage the form. Uses localstorage and url params to save/load the form state
     */
    handleForm = {

        /**
         * Build the HTML form
         */
        build: function () {

            var browsersObj = {
                    chrome: {
                        name: "Chrome",
                        cssClass: "ch",
                        versions: {
                            'CH1': "1.0",
                            'CH2': "2.0",
                            'CH3': "3.0",
                            'CH4': "4.0",
                            'CH5': "5.0",
                            'CH6': "6.0",
                            'CH7': "7.0",
                            'CH8': "8.0",
                            'CH9': "9.0"
                        }
                    },
                    firefox: {
                        name: "Firefox",
                        cssClass: "ff",
                        versions: {
                            'FF20': "2.0",
                            'FF30': "3.0",
                            'FF35': "3.5",
                            'FF36': "3.6"
                        }
                    },
                    safari: {
                        name: "Safari",
                        cssClass: "sa",
                        versions: {
                            'SA30': "3.0",
                            'SA31': "3.1",
                            'SA40': "4.0",
                            'SA50': "5.0"
                        }
                    },
                    explorer: {
                        name: "Internet Explorer",
                        cssClass: "ie",
                        versions: {
                            'IE55': "5.5",
                            'IE6': "6.0",
                            'IE7': "7.0",
                            'IE8': "8.0"
                        }
                    },
                    opera: {
                        name: "Opera",
                        cssClass: "op",
                        versions: {
                            'OP10': "10.0",
                            'OP106': "10.6",
                            'OP110': "11.0"
                        }
                    }
            },
            i, html = '';

            for (i in browsersObj) {
                if (browsersObj.hasOwnProperty(i)) {
                    html += getFields(browsersObj[i]);
                }
            }
            
            function getFields(browser) {
                var i, html = '';
                html = '<ul><span class=' + browser.cssClass + '>' + browser.name + '</span>';
                for (i in browser.versions) {
                    if (browser.versions.hasOwnProperty(i)) {
                    html += '<li>';
                    html += '  <label for=' + i + '>' + browser.versions[i] + '</label>';
                    html += '  <input type=text id=' + i + ' name=bp />%';
                    html += '</li>';
                    }
                }
                html += '</ul>';
                return html;
            }

            return html;
        },

        /**
         * JSONP statcounter stats
         */
        getStatCounterStats: function () {
            var mapBrowserNames = {
                     'Chrome 1.0':  'CH1',
                     'Chrome 2.0':  'CH2',
                     'Chrome 3.0':  'CH3',
                     'Chrome 4.0':  'CH4',
                     'Chrome 5.0':  'CH5',
                     'Chrome 6.0':  'CH6',
                     'Chrome 7.0':  'CH7',
                     'Chrome 8.0':  'CH8',
                     'Chrome 9.0':  'CH9',
                     'Chrome 10.0': 'CH10',
                     'Firefox 2.0': 'FF20',
                     'Firefox 3.0': 'FF30',
                     'Firefox 3.5': 'FF35',
                     'Firefox 3.6': 'FF36',
                     'Firefox 4.0': 'FF4',
                     'Safari 3.0':  'SA30',
                     'Safari 3.1':  'SA31',
                     'Safari 4.0':  'SA40',
                     'Safari 4.1':  'SA41',
                     'Safari 5.0':  'SA50',
                     'IE 5.5':      'IE55',
                     'IE 6.0':      'IE6',
                     'IE 7.0':      'IE7',
                     'IE 8.0':      'IE8',
                     'IE 9.0':      'IE9',
                     'Opera 10.0':  'OP10',
                     'Opera 10.6':  'OP106',
                     'Opera 11.0':  'OP110'
            };
            if (localStorage.statcounter) {
                window.location = localStorage.statcounter;
                handleForm.populateForm().highlightErrors().submit();
                return this;
            }
            /**
             * Yahoo Pipe that gets global browser statistics for all browsers over 0.01% of traffic.
             * @see http://pipes.yahoo.com/pipes/pipe.info?_id=b2e73797535852444e51e87634dd1c64
             */
            $.getJSON('http://pipes.yahoo.com/pipes/pipe.run?_id=b2e73797535852444e51e87634dd1c64&_render=json&_callback=?',
                    function(data) {
                        var d = data.value.items, i = d.length, statCounterArr = [];
                        while (i--) statCounterArr[i] = mapBrowserNames[d[i]["browser "]] + '|' + d[i].percentage;
                        localStorage.statcounter = '#statcounter/' + handleForm.getFormOptions() + encodeURIComponent(statCounterArr);
                        window.location = localStorage.statcounter;
                        handleForm.populateForm().highlightErrors().submit().startTimer();
                    });
            return this
        },

        startTimer: function () {
            var currentTime = new Date(),
                message = '',
                timeStamp;

            localStorage.statcounterTimeStamp
                    ? timeStamp = localStorage.statcounterTimeStamp
                    : timeStamp = localStorage.statcounterTimeStamp = currentTime.getTime();

            window.clearInterval(timer);
            timer = window.setInterval (function () {
                var secondsElapsed = Math.ceil((new Date().getTime() - timeStamp) / 1000);
                switch (true) {
                    case secondsElapsed > 60 * 60 * 24: // days
                         message = Math.floor(secondsElapsed/86400) + ' day(s) ago';
                    break;
                    case secondsElapsed < 60: // seconds
                         message = 'updated seconds ago';
                    break;
                    case secondsElapsed < 60 * 60: // minutes
                         message = 'about ' + Math.floor(secondsElapsed/60) + ' minute(s) ago';
                    break;
                    case secondsElapsed < 60 * 60 * 24: // hours
                         message = Math.floor(secondsElapsed/3600) + ' hour(s) ago';
                    break;
                }
                $('[for=statcounter] span').html(message);
            }, 1000);
            return this;
        },

        /**
         * Gets the custom stats from either the url or localstorage. If there aren't any it adds a default one
         */
        getCustomStats: function () {
            var hash = decodeURIComponent(window.location.hash);
            if (hash) {
                if (hash !== decodeURIComponent(localStorage.statcounter)) localStorage.custom = hash;
            } else if (localStorage.custom) {
                window.location = localStorage.custom;
            } else {
                // store zero values
                var arr = [];
                $.each(browserArr, function (index, value) {
                    arr[index] = value.replace('.', '') + '|0';
                });
                localStorage.custom = '#custom/' + handleForm.getFormOptions() + encodeURIComponent(arr);
                window.location = localStorage.custom;
            }
            return this
        },

        updateUrl: function (target) {
            var arr = [];
            $('#b input').each(function () {
                arr.push($(this).attr('id') + '|' + $(this).val());
            });
            localStorage[target] = '#' + target + '/' + handleForm.getFormOptions() + encodeURIComponent(arr);
            window.location = localStorage[target];
            return this
        },

        populateForm: function (target) { // statcounter or custom
            var data, arr, i,
                input = form.getElementsByTagName("input");

            this.zeroForm();

            data = ({
                statcounter: localStorage.statcounter,
                custom: localStorage.custom
            })[target] || localStorage.statcounter;

            arr = decodeURIComponent(data).replace(/\#[a-z0-9/]+\//i, '').split(',');
            i = arr.length;

            // Populate the form
            while (i--) $('#' + arr[i].split('|')[0]).val(arr[i].split('|')[1]);

            // Fill the rest of the form with zeros
            $('#b input').each(function () {
                if (!$(this).val()) $(this).val('0');
            });

            return this
        },

        submit: function () {
            IE_FILTERS = $('#i').attr('checked');
            VENDOR_PROPERTIES = $('#v').attr('checked');
            $('#r').html(processData.returnHTML(processData.getRequiredInfoTables()));
            util.message.add(handleForm.countInputFields());
            return this
        },

        /**
         * Counts the browser input fields and adds them all together to give the total percentage
         * @return {Number} floating point Number
         */
        countInputFields: function () {
            var totalPercent = 0,
                regex = /[0-9]/,
                value;
            $('#b input').each(function () {
                value = $(this).val();
                if (regex.test(value)) {
                    totalPercent = totalPercent + parseFloat(value, 10);
                }
            });
            return Math.round(totalPercent*10)/10;
        },

        /**
         * Check the input fields for non numeric input. If it finds an error it highlights the field
         */
        highlightErrors: function () {
            $('#b input').each(function () {
                /[^0-9.]/.test($(this).val())
                        ? $(this).css({'backgroundColor': '#b10'})
                        : $(this).css({'backgroundColor': '#fff'});
            });
            return this
        },

        zeroForm: function () {
            $('#b input').each(function () {
                $(this).val('0');
            });
            return this
        },

        getFormOptions: function () {
            var optionsStr = '', $options = $(':checkbox');
            $options.each(function () {
                if ($(this).attr('checked')) optionsStr += $(this).attr('id') + '/'; 
            });
            return optionsStr;
        }

    };

    /**
     * @namespace
     */
    util = {

        /**
         * Takes a Number or String and updates #totalPercentage element
         */
        message: {

            /**
             * Updates the HTML message element
             * @param message needs to be a Number
             */
            add: function (message) {
                var $divPercent = $('#t');
                if (message.constructor === Number) {
                    message > 100
                            ? $divPercent.css('color', '#b10')
                            : $divPercent.css('color', '#080');
                    $divPercent.html(message + '% of users accounted for');
                }
            }
        }
    };

    /** @Scope FS */
    return {
        init: function () {

            var dataSource, chkBoxes;

            // Get the data source from the URL
            dataSource = window.location.hash.split('/')[0].replace('#', '');

            // Build the html for the form
            $('#b').html(handleForm.build());

            // Set the correct radio for the source
            $('.options input[id=' + dataSource + ']').attr('checked', 'checked');

            // Insert loading message
            $('[for=statcounter]').html('Statcounter Stats (<span>loading...</span> - <a id="updateStatCounterStats">update</a>)');

            // Setup checkboxes
            if (window.location.hash) {
                chkBoxes = window.location.hash.split('#')[1];                    // custom/c3/d3/i/v/CH1%7C0%...
                chkBoxes = chkBoxes.replace(/[a-z]+\/([a-z0-9/]+)\/.*/i, '$1');   // c3/d3/i/v/
                $(':checkbox').each(function () {
                    $(this).attr('checked', '');
                });
                $.each(chkBoxes.split('/'), function () {
                    $('#' + this).attr('checked', 'checked');
                });
            }

            switch (dataSource) {
                case 'statcounter': handleForm.getStatCounterStats().startTimer(); break;
                case 'custom': handleForm.getCustomStats()
                                         .populateForm(dataSource)
                                         .highlightErrors() 
                                         .updateUrl(dataSource)
                                         .startTimer()
                                         .submit(); break;
                default: handleForm.getStatCounterStats().startTimer(); break;
            }

            /**
             * Switch data sources
             */
            $('.options').mousedown(function (e) {
                var dataSource, target = e.target;

                dataSource = ({
                    SPAN: $(target).parent().attr('for'),
                    LABEL: $(target).attr('for'),
                    INPUT: $(target).attr('id')
                })[e.target.nodeName];

                switch (dataSource) {
                    case 'statcounter': handleForm.getStatCounterStats(); break;
                    case 'custom': handleForm.getCustomStats()
                                             .populateForm(dataSource)
                                             .updateUrl(dataSource)
                                             .highlightErrors(); break;
                }
            });

            $('#updateStatCounterStats').click(function () {
                delete localStorage.statcounter;
                delete localStorage.statcounterTimeStamp;
                handleForm.getStatCounterStats();
                return false;
            });
            
            /**
             * Update on form field change
             */
            $('#b').keyup(function () {
                if ($('.options #custom').attr('checked')) {
                    handleForm.updateUrl('custom').highlightErrors();
                }
                util.message.add(handleForm.countInputFields());
            });

            /**
             * Update on checkbox change
             */
            $(':checkbox').click(function () {
                handleForm.updateUrl(window.location.hash.replace(/#([a-z]+)\/.*/, '$1'));
            });

            $('#submit').click(function () {
                handleForm.submit(); return false
            });

            $('#reset').click(function () {
                delete localStorage.custom;
                $('.options input[id=custom]').attr('checked', 'checked');
                handleForm.zeroForm().updateUrl('custom'); return false
            });

            window.onhashchange = handleForm.submit;

        }
    };

}(this,document));

window.onload = function () {
    FS.init();
};