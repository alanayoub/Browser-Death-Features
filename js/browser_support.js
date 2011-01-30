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
        handleForm,
        processData,
        VENDOR_PROPERTIES,
        IE_FILTERS,
        browserArr = "IE5.5|IE6|IE7|IE8|FF2.0|FF3.0|FF3.5|FF3.6|SA3.0|SA3.1|SA4.0|SA5.0|CH1|CH2|CH3|CH4|CH5|OP10|OP10.6".split('|'),
        $,
        form = document.getElementsByTagName('form')[0];

    $ = function (id) {
        return document.getElementById(id);
    },

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
                supportMatrix = compatData[i].split('&')[1].split('');
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
            
                                                                              //  -IE- -FF- -SA- -CH-- OP
                                                                              //                       11
            var data = {                                                      //  5678 2333 3345 12345 00
                css3: {                                                       //  .... .... .... ..... ..
                    declarations: [                                           //  5xxx 0056 0100 00000 06
                            'text-stroke                                         &0000 0000 11bb 00000 00',
                            'text-shadow                                         &0000 0011 1111 01111 11',
                            'text-overflow                                       &0111 0000 1111 11111 11',
                            'resize                                              &0000 0000 1111 00111 00',
                            'opacity                                             &ffff 1111 1111 11111 11',
                            'gradient                                            &000f 000b 00bb 0bbbb 00',
                            'columns                                             &0000 bbbb bbbb bbbbb 00',
                            'box-sizing                                          &0001 bbbb 1bbb bbbbb 11',
                            'box-sizing: content-box                             &0001 bbbb 1bbb bbbbb 11',
                            'box-sizing: border-box                              &0001 bbbb 1bbb bbbbb 11',
                            'box-sizing: padding-box                             &0000 bbbb 0000 00000 00',
                            'box-shadow                                          &0000 00bb bbbb bbbbb 01',
                            'border-radius                                       &0000 bbbb bbb1 bbb11 01',
                            'content: none                                       &0001 0111 0000 00000 00',
                            'content: counter                                    &0001 1111 1111 11111 11',
                            'content: attr()                                     &0001 1111 1111 11111 11',
                            'content: string                                     &0001 1111 1111 11111 11',
                            'content: URL                                        &0001 1111 1111 11111 11',
                            'multiple background images                          &0000 0001 1111 11111 01',
                            'background-attachment: fixed                        &0011 1111 1111 11111 11',
                            'background-attachment: local                        &0011 0001 0011 00011 01',
                            'background-repeat: '
                                    + 'repeat,'
                                    + 'repeat-x,'
                                    + 'repeat-y,'
                                    + 'no-repeat                                 &0111 1111 1111 11111 11',
                            'background-repeat: space                            &0000 0000 0000 00000 01',
                            'background-repeat: round                            &0000 0000 0000 00000 01',
                            'background-clip: padding-box                        &0000 0000 00b1 0bb11 01',
                            'background-clip: border-box                         &0000 0000 1111 11111 01',
                            'background-clip: content-box                        &0000 0000 00bb 0bbbb 01',
                            'background-origin: padding-box                      &0000 0000 11b1 01111 01',
                            'background-origin: border-box                       &0000 0000 00b1 0bb10 1',
                            'background-origin: content-box                      &0000 0000 00b1 0bb11 01',
                            'background-size: [length]                           &0000 000b bbb1 bbb11 b1',
                            'background-size: [percentage]                       &0000 000b bbb1 bbb11 b1',
                            'background-size: contain                            &0000 000b 0001 00011 01',
                            'background-size: cover                              &0000 000b 0001 00011 01',
                            'border-image                                        &0000 00bb bbbb 0bbbb 01'],
                    selectors: [
                            'media queries                                       &0000 0011 0011 01111 11',
                            'media queries (min-width)                           &0000 0011 0011 01111 11',
                            'media queries (max-width)                           &0000 0011 0011 01111 11',
                            'media queries (device-aspect-ratio)                 &0000 0001 0101 00011 01',
                            '::selection                                         &0000 bbbb 1111 11111 11',
                            ':only-of-type                                       &0000 0011 0111 11111 11',
                            ':nth-of-type()                                      &0000 0011 0111 11111 11',
                            ':nth-last-of-type()                                 &0000 0011 0111 11111 11',
                            ':nth-last-child()                                   &0000 0011 0111 11111 11',
                            ':nth-child()                                        &0000 0011 0111 11111 11',
                            ':only-child                                         &0000 0111 0111 11111 11',
                            ':last-of-type                                       &0000 0011 0111 11111 11',
                            ':last-child                                         &0000 0111 0111 11111 11',
                            ':first-of-type                                      &0000 0011 0111 11111 11',
                            ':empty                                              &0000 0111 0111 11111 11',
                            ':enabled                                            &0000 1111 1111 11111 11',
                            ':disabled                                           &0000 1111 1111 11111 11',
                            ':checked                                            &0000 1111 1111 11111 11',
                            ':target                                             &0000 1111 1111 11111 11',
                            ':root                                               &0000 1111 1111 11111 11',
                            ':not                                                &0000 1111 1111 11111 11',
                            'advanced [attr] selectors                           &0011 0111 0111 11111 11',
                            '~ selector                                          &0011 1111 1111 11111 11'
                    ]
                },
                                                                              //  -IE- -FF- -SA- -CH-- OP 
                                                                              //                       11
                                                                              //  5678 2333 3345 12345 00
                css21: {                                                      //  .... .... .... ..... ..
                    declarations: [                                           //  5xxx 0056 0100 00000 06
                            'white-space                                         &0001 0011 1111 11111 11',
                            'white-space: nowrap                                 &1111 1111 1111 11111 11',
                            'white-space: pre                                    &0111 1111 1111 11111 11',
                            'white-space: pre-wrap                               &0001 0111 1111 11111 11',
                            'white-space: pre-line                               &0001 0011 1111 11111 11',
                            'table declarations                                  &0001 1111 1111 11111 11',
                            '(table declaration) empty-cells: show               &0001 1111 1111 11111 11',
                            '(table declaration) empty-cells: hide               &0001 1111 1111 11111 11',
                            '(table declaration) border-collapse: collapse       &1111 1111 1111 11111 11',
                            '(table declaration) border-spacing                  &0001 1111 1111 11111 11',
                            '(table declaration) border-spacing with 2 values    &1111 1111 1111 11111 11',
                            '(table declaration) table-layout: fixed             &1111 1111 1111 11111 11',
                            '(table declaration) caption-side                    &0001 1111 1111 11111 11',
                            'table columns                                       &0001 1111 1111 11111 11',
                            '(table columns) background-color                    &1111 1111 1111 11111 11',
                            '(table columns) border                              &0001 1111 1111 11111 11',
                            '(table columns) width                               &1111 1111 1111 11111 11',
                            '(table columns) visibility: hidden                  &0110 0000 0000 00000 00',
                            '(table columns) visibility: collapse                &0001 1111 0000 00000 01',
                            'position                                            &0001 1111 1111 11111 11',
                            'position: relative                                  &1111 1111 1111 11111 11',
                            'position: absolute                                  &1111 1111 1111 11111 11',
                            'position: fixed                                     &0011 1111 1111 11111 11',
                            'overflow                                            &1111 1111 1111 11111 11',
                            'overflow: hidden                                    &1111 1111 1111 11111 11',
                            'overflow: auto                                      &1111 1111 1111 11111 11',
                            'overflow: scroll                                    &1111 1111 1111 11111 11',
                            'outline                                             &0001 1111 1111 11111 11',
                            'min/max-width/height                                &0011 1111 1111 11111 11',
                            'min-height                                          &0011 1111 1111 11111 11',
                            'max-height                                          &0011 1111 1111 11111 11',
                            'min-width                                           &0011 1111 1111 11111 11',
                            'max-width                                           &0011 1111 1111 11111 11',
                            'list styles                                         &0001 1111 1111 11111 11',
                            'list-style-type: armenian                           &0001 1111 0111 11111 11',
                            'list-style-type: binary                             &0000 0000 0001 00001 00',
                            'list-style-type: box                                &0000 0000 0000 00000 11',
                            'list-style-type: circle                             &1111 1111 1111 11111 11',
                            'list-style-type: decimal                            &1111 1111 1111 11111 11',
                            'list-style-type: decimal-leading-zero               &0001 1111 1111 11111 11',
                            'list-style-type: disc                               &1111 1111 1111 11111 11',
                            'list-style-type: georgian                           &0001 1111 0111 11111 11',
                            'list-style-type: lower-alpha                        &1111 1111 1111 11111 11',
                            'list-style-type: lower-greek                        &0001 1111 1111 11111 11',
                            'list-style-type: lower-hexadecimal                  &0000 0000 0001 00001 00',
                            'list-style-type: lower-latin                        &0001 1111 1111 11111 11',
                            'list-style-type: lower-norwegian                    &0000 0000 0001 00001 00',
                            'list-style-type: lower-roman                        &1111 1111 1111 11111 11',
                            'list-style-type: none                               &1111 1111 1111 11111 11',
                            'list-style-type: octal                              &0000 0000 0001 00001 00',
                            'list-style-type: square                             &1111 1111 1111 11111 11',
                            'list-style-type: upper-alpha                        &1111 1111 1111 11111 11',
                            'list-style-type: upper-greek                        &0001 0000 0001 00001 00',
                            'list-style-type: upper-hexadecimal                  &0000 0000 0001 00001 00',
                            'list-style-type: upper-latin                        &0001 1111 1111 11111 11',
                            'list-style-type: upper-norwegian                    &0000 0000 0001 00001 00',
                            'list-style-type: upper-roman                        &1111 1111 1111 11111 11',
                            'display                                             &0001 0111 0011 11111 11',
                            'display: block                                      &1111 1111 1111 11111 11',
                            'display: inline                                     &1111 1111 1111 11111 11',
                            'display: none                                       &1111 1111 1111 11111 11',
                            'display: inline-block                               &0001 0111 1111 11111 11',
                            'display: list-item                                  &0111 1111 1111 11111 11',
                            'display: run-in                                     &0001 0000 0001 00011 11',
                            'display: table                                      &0001 1111 1111 11111 11',
                            'cursor                                              &1111 1111 1111 11111 11',
                            'cursor: all-scroll                                  &0111 1111 1111 11111 00',
                            'cursor: col-resize                                  &0111 1111 1111 11111 00',
                            'cursor: crosshair                                   &1111 1111 1111 11111 11',
                            'cursor: default                                     &1111 1111 1111 11111 11',
                            'cursor: hand                                        &1111 0000 0000 00000 11',
                            'cursor: help                                        &1111 1111 1111 11111 11',
                            'cursor: move                                        &1111 1111 1111 11111 11',
                            'cursor: no-drop                                     &0111 1111 1111 11111 00',
                            'cursor: not-allowed                                 &0111 1111 1111 11111 00',
                            'cursor: pointer                                     &0111 1111 1111 11111 11',
                            'cursor: progress                                    &0111 1111 1111 11111 11',
                            'cursor: row-resize                                  &0111 1111 1111 11111 00',
                            'cursor: text                                        &1111 1111 1111 11111 11',
                            'cursor: url                                         &ffff 1111 1111 11111 00',
                            'cursor: vertical-text                               &0111 1111 0111 11111 00',
                            'cursor: wait                                        &1111 1111 1111 11111 11',
                            'cursor: *-resize                                    &1111 1111 1111 11111 11',
                            'counters                                            &0001 1111 1111 11111 11',
                            'content                                             &0001 1111 1111 11111 11',
                            'content: none                                       &0001 0111 0000 00000 00',
                            'content: counter                                    &0001 1111 1111 11111 11',
                            'content: attr()                                     &0001 1111 1111 11111 11',
                            'content: string                                     &0001 1111 1111 11111 11',
                            'content: URL                                        &0001 1111 1111 11111 11'
                    ],
                    selectors: [
                            ':focus                                              &0000 1111 1111 11111 11',
                            ':first-line and :first-letter                       &1111 1111 1111 11111 11',
                            ':first-child                                        &0000 0111 0111 11111 11',
                            ':hover and :active                                  &0001 1111 1111 11111 11',
                            ':before and :after                                  &0000 1111 1111 11111 11',
                            'Multiple classes                                    &0011 1111 1111 11111 11',
                            '[attr] selector                                     &0011 1111 1111 11111 11',
                            '"+" selector                                        &0000 1111 1111 11111 11',
                            '> selector                                          &0011 1111 1111 11111 11',
                            '* selector                                          &1111 1111 1111 11111 11'
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
                prop = browserArr[i]; // IE5.5
                frm = prop.replace('.', ''); // IE55
                val = parseFloat($(frm).value, 10); // 16.3
                obj[prop] = val;
            }
            return obj;
        }
    };


    /**
     * @namespace
     * A bunch of methods to manage the form. Uses localstorage to save/load the form state
     */
    handleForm = {

        formId: "bp",

        data: {
             chrome: {
                 name: "Chrome",
                 cssClass: "ch",
                 versions: {
                     'CH1': "1.0",
                     'CH2': "2.0",
                     'CH3': "3.0",
                     'CH4': "4.0",
                     'CH5': "5.0"
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
                     'OP106': "10.6"
                 }
             }
        },

        getFields: function (obj) {
            var i,
                html = "";
            html = '<ul><span class=' + obj.cssClass + '>' + obj.name + '</span>';
            for (i in obj.versions) {
                if (obj.versions.hasOwnProperty(i)) {
                html += '<li>';
                html += '<label for=' + i + '>' + obj.versions[i] + '</label>';
                html += '<input type=text id=' + i + ' name='+ this.formId +' />%';
                html += '</li>';
                }
            }
            html += '</ul>';
            return html;
        },

        display: function () {
            var i,
                html = "",
                obj = this.data;
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    html += this.getFields(obj[i]);
                }
            }
            return html;
        },

        /**
         * Saves the form info to localStorage
         */
        saveStore: function () {
            var input = form.getElementsByTagName("input"),
                arr = [],
                i = input.length;
            while (i--) {
                arr[i] = input[i].checked || input[i].value;
            }
            window.location = '#' + encodeURIComponent(arr);
            localStorage.u = window.location;
            return this
        },

        /**
         * If localStorage is available, and it has been populated, this method will
         * populate the form with the stored information, update the onscreen message util.message.add()
         * and then call handleForm.submit()
         * @requires util.message.add()
         * @requires handleForm.submit()
         */
        loadStore: function () {
            var input = form.getElementsByTagName("input"),
                arr = [],
                i = input.length;
            if (window.location.hash) {
                arr = decodeURIComponent(window.location.hash).replace('#', '').split(',');
                while (i--) {
                    input[i].checked ?
                            input[i].checked = arr[i] :
                            input[i].value = arr[i];
                }
                handleForm.submit();
            } else {
                if (localStorage.u) {
                    window.location = localStorage.u;
                    window.location.reload();
                }
            }
            util.message.add(handleForm.countInputFields());
            return this
        },

        /**
         * Counts the browser input fields and adds them all together to give the total percentage
         * @return {Number} floating point Number
         */
        countInputFields: function () {
            var inputFields = form[this.formId],
                i = inputFields.length,
                totalPercent = 0,
                regex = /[0-9]/,
                browserPercentArr = [],
                value;

            while (i--) {
                value = inputFields[i].value;
                if (regex.test(value)) {
                    totalPercent = totalPercent + parseFloat(value);
                    browserPercentArr[i] = parseFloat(value);
                }
            }
            return Math.round(totalPercent*10)/10;
        },

        /**
         * Check the input fields for non numeric input. If it finds an error it highlights the field
         */
        checkError: function () {
            var inputFields = form[this.formId],
                i = inputFields.length,
                regex = /[^0-9.]/,
                value;
            while (i--) {
                value = inputFields[i].value;
                if (regex.test(value)) {
                    inputFields[i].style.backgroundColor = "#b10";
                } else {
                    inputFields[i].style.backgroundColor = "#fff";
                }
            }
            return this
        },

        /**
         * Checks the user input options, IE_FILTERS, VENDOR_PROPERTIES etc... and populates the table-placeholder ID
         * @requires processData.getRequiredInfoTables()
         * @requires processData.returnHTML()
         */
        submit: function () {
            IE_FILTERS = $('i').checked;
            VENDOR_PROPERTIES = $('v').checked;
            $("r").innerHTML = processData.returnHTML(processData.getRequiredInfoTables());
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
             * Empties out the HTML message element
             */
            clear: function () {
                $('t').innerHTML = '';
            },

            /**
             * Updates the HTML message element
             * @param message needs to be a Number
             */
            add: function (message) {
                var divPercent = $('t');

                if (message.constructor === Number) {
                    message > 100 ?
                            divPercent.style.color = "#b10" :
                            divPercent.style.color = "#999";
                    divPercent.innerHTML = message + '% of users accounted for';
                }
            }
        }
    };

    /** @Scope FS */
    return {
        init: function () {

            $('b').innerHTML = handleForm.display();
            handleForm.loadStore().checkError();
            util.message.add(handleForm.countInputFields());

            /**
             * Handle submit button
             */
            $("submit").onclick = function () {
                handleForm.submit();
                return false
            };

            /**
             * Handle reset button
             */
            $("reset").onclick = function () {
                delete localStorage.u;
                window.location = ''; return false
            };

            /**
             * Update percentage of users field
             */
            form.onkeyup = form.onchange =  function () {
                util.message.add(handleForm.countInputFields());
                handleForm.checkError().saveStore();
            };

        }
    };

}(this,document));

window.onload = function () {
    FS.init();
};