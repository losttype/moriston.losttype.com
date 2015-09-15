/*!
 * Big Ideas Text v0.1.2, 2015-08-27
 * https://github.com/kennethormandy/big-ideas-text
 * Copyright © 2011–2014 Zach Leatherman
 * Copyright © 2015 Kenneth Ormandy (@kennethormandy)
 * MIT License
 */

(function(window, document, undefined) {
  'use strict';

  var counter = 0,
    headCache = document.getElementsByTagName('head')[0],
    BigIdeasText = {
      DEBUG_MODE: false,
      DEFAULT_MIN_FONT_SIZE_PX: null,
      DEFAULT_MAX_FONT_SIZE_PX: 528,
      GLOBAL_STYLE_ID: 'bigIdeasText-style',
      STYLE_ID: 'bigIdeasText-id',
      LINE_CLASS_PREFIX: 'bigIdeasText-line',
      EXEMPT_CLASS: 'bigIdeasText-exempt',
      test: {
        wholeNumberFontSizeOnly: function() {
          if( !( 'getComputedStyle' in window ) || document.body == null ) {
            return true;
          }
          // Test if whole number font-sizes are supported or not
          var test = document.createElement('div');
          test.style.postion = 'absolute';
          test.style.fontSize = '14.1px';
          document.body.appendChild(test);
          var computedStyle = window.getComputedStyle( test, null );
          document.body.removeChild(test);
          if( computedStyle ) {
            return computedStyle.getPropertyValue( 'font-size' ) === '14px';
          }
          return true;
        }
      },
      supports: {
        wholeNumberFontSizeOnly: undefined
      },
      init: function() {
        if( BigIdeasText.supports.wholeNumberFontSizeOnly === undefined ) {
          BigIdeasText.supports.wholeNumberFontSizeOnly = BigIdeasText.test.wholeNumberFontSizeOnly();
        }

        if(!document.getElementById(BigIdeasText.GLOBAL_STYLE_ID)) {
          headCache.appendChild(BigIdeasText.generateStyleTag(BigIdeasText.GLOBAL_STYLE_ID, [
            '.bigIdeasText * { white-space: nowrap; }',
            '.bigIdeasText > * { display: block; }',
            '.bigIdeasText .' + BigIdeasText.EXEMPT_CLASS + ', .bigIdeasText .' + BigIdeasText.EXEMPT_CLASS + ' * { white-space: normal; }'
          ]));
        }
      },
      bindResize: function(eventName, resizeFunction) {
        window.removeEventListener('rezie', resizeFunction);
        // if(typeof window.Cowboy !== 'undefined' && typeof window.Cowboy.throttle !== 'undefined') {
        //     window.addEventListener('resize', window.Cowboy.throttle(100, resizeFunction), false);
        // } else {
          window.addEventListener('resize', debounce(resizeFunction, 500), false);
        // }
      },
      getStyleId: function(id)
      {
        return BigIdeasText.STYLE_ID + '-' + id;
      },
      generateStyleTag: function(id, css)
      {
        var styleEl = document.createElement('style');
        styleEl.innerHTML = css.join('\n');
        styleEl.setAttribute('id', id);
        return styleEl;
      },
      clearCss: function(id)
      {
        var styleSheets = document.styleSheets;
        forEach(styleSheets, function(sheetCSS) {
          var sheet = sheetCSS.ownerNode;
          if(sheet.id === BigIdeasText.getStyleId(id)) {
            return document.head.removeChild(sheet);
          }
        });
      },
      generateCss: function(id, linesFontSizes, lineWordSpacings, minFontSizes)
      {
        var css = [];

        BigIdeasText.clearCss(id);

        for(var j=0, k=linesFontSizes.length; j<k; j++) {
          css.push('#' + id + ' .' + BigIdeasText.LINE_CLASS_PREFIX + j + ' {' +
            (minFontSizes[j] ? ' white-space: normal;' : '') +
            (linesFontSizes[j] ? ' font-size: ' + linesFontSizes[j] + 'px;' : '') +
            (lineWordSpacings[j] ? ' word-spacing: ' + lineWordSpacings[j] + 'px;' : '') +
            '}');
        }


        return BigIdeasText.generateStyleTag(BigIdeasText.getStyleId(id), css);
      },
      mainMethod: function(options)
      {
        BigIdeasText.init();
        options = extend({
          minfontsize: BigIdeasText.DEFAULT_MIN_FONT_SIZE_PX,
          maxfontsize: BigIdeasText.DEFAULT_MAX_FONT_SIZE_PX,
          childSelector: '',
          resize: true
        }, options || {});

        // FIXME Only works if an array is passed in right now

        forEach(this, function(self)
        {
          var selfStyle = getComputedStyle(self);
          var maxWidth = parseInt(selfStyle.getPropertyValue('width'), 10);
          var id = self.getAttribute('id');
          var children = options.childSelector ? self.querySelectorAll( options.childSelector ) : self.children;
          var minFontSizeAttr = self.getAttribute('bigIdeasText-minfontsize') || false;
          var maxFontSizeAttr = self.getAttribute('bigIdeasText-maxfontsize') || false;
          var minFontSize = options.minfontsize;
          var maxFontSize = options.maxfontsize;

          if(maxFontSizeAttr !== false) {
            maxFontSize = parseInt(maxFontSizeAttr, 10)
          }

          if(minFontSizeAttr !== false) {
            minFontSize = parseInt(minFontSizeAttr, 10)
          }

          addClass(self, 'bigIdeasText');

          if(!id) {
            // KO changed approach here
            id = BigIdeasText.getStyleId(counter++);
            self.setAttribute('id', id);
          }

          if(options.resize) {
            BigIdeasText.bindResize('resize.bigIdeasText-event-' + id, function()
            {
              // TODO only call this if the width has changed.
              BigIdeasText.mainMethod.call(document.getElementById(id), options);
            });
          }

          BigIdeasText.clearCss(id);

          forEach(children, function(child, lineNumber){
            child.className = child.className.replace(new RegExp('\\b' + BigIdeasText.LINE_CLASS_PREFIX + '\\d+\\b'), '');
            addClass(child, BigIdeasText.LINE_CLASS_PREFIX + lineNumber);
          });

          var sizes = calculateSizes(self, children, maxWidth, maxFontSize, minFontSize);
          headCache.appendChild(BigIdeasText.generateCss(id, sizes.fontSizes, sizes.wordSpacings, sizes.minFontSizes));
        });

        // return trigger(this, 'bigIdeasText:complete');
        return this;
      }
    };

  // function trigger(el, name) {
  //   var evt;
  //   if (typeof CustomEvent !== 'function') {
  //     evt = document.createEvent('HTMLEvents');
  //     evt.initEvent(name, true, false);
  //   } else {
  //     evt = new CustomEvent(name);
  //   }
  //   return el.dispatchEvent(evt);
  // }

  function forEach(el, fn) {
    if(typeof el.length === 'undefined') {
      el = [el];
    }
    if(el.length >= 1) {
      Array.prototype.forEach.call(el, fn);
    }
  }

  function getComputedStyle(el, pseudo) {
    pseudo = pseudo || null;
    if (!BigIdeasText.supports.wholeNumberFontSizeOnly) {
      return window.getComputedStyle(el, pseudo);
    }
  }

  function addClass(el, className) {
    if (el.classList) {
      return el.classList.add(className);
    } else {
      return el.className += ' ' + className;
    }
  }

  function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
  }

  function debounce(fn, delay)
  {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  function extend(out)
  {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) {
        continue;
      }
      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          out[key] = arguments[i][key];
        }
      }
    }
    return out;
  }


  function testLineDimensions(line, maxWidth, property, size, interval, units, previousWidth)
  {
    var width;
    var currentStyle = getComputedStyle(line);
    previousWidth = typeof previousWidth === 'number' ? previousWidth : 0;
    line.style[property] = size + units;

    width = parseInt(currentStyle.getPropertyValue('width'), 10);


    if(width >= maxWidth) {
      line.style[property] = '';

      if(width === maxWidth) {
        return {
          match: 'exact',
          size: parseFloat((parseFloat(size) - 0.1).toFixed(3))
        };
      }

      // Since this is an estimate, we calculate how far over the width we went with the new value.
      // If this is word-spacing (our last resort guess) and the over is less than the under, we keep the higher value.
      // Otherwise, we revert to the underestimate.
      var under = maxWidth - previousWidth,
        over = width - maxWidth;

      return {
        match: 'estimate',
        size: parseFloat((parseFloat(size) - (property === 'word-spacing' && previousWidth && ( over < under ) ? 0 : interval)).toFixed(3))
      };
    }

    return width;
  }

  function calculateSizes(t, children, maxWidth, maxFontSize, minFontSize)
  {
    var c = t.cloneNode(true);
    var tStyles = getComputedStyle(t);

    addClass(c, 'bigIdeasText-cloned');

    c.style.fontFamily = tStyles.getPropertyValue('font-family');
    c.style.textTransform = tStyles.getPropertyValue('text-transform');
    c.style.wordSpacing = tStyles.getPropertyValue('word-spacing');
    c.style.letterSpacing = tStyles.getPropertyValue('letter-spacing');
    c.style.position = 'absolute';
    c.style.left = BigIdeasText.DEBUG_MODE ? 0 : -9999;
    c.style.top = BigIdeasText.DEBUG_MODE ? 0 : -9999;

    document.body.appendChild(c);

    // font-size isn't the only thing we can modify, we can also mess with:
    // word-spacing and letter-spacing. WebKit does not respect subpixel
    // letter-spacing, word-spacing, or font-size.
    // TODO try -webkit-transform: scale() as a workaround.
    var fontSizes = [],
      wordSpacings = [],
      minFontSizes = [],
      ratios = [];

    forEach(children, function(line) {
      // TODO replace 8, 4 with a proportional size to the calculated font-size.
      var intervals = BigIdeasText.supports.wholeNumberFontSizeOnly ? [8, 4, 1] : [8, 4, 1, 0.1];
      var lineMax;
      var newFontSize;

      line.style.float = 'left';

      if(hasClass(line, BigIdeasText.EXEMPT_CLASS)) {
        fontSizes.push(null);
        ratios.push(null);
        minFontSizes.push(false);
        return;
      }

      // TODO we can cache this ratio?
      var autoGuessSubtraction = 32; // font size in px
      var currentStyle = getComputedStyle(line);
      var currentFontSize = parseFloat(currentStyle.getPropertyValue('font-size'));
      var ratio = ( parseInt(currentStyle.getPropertyValue('width'), 10) / currentFontSize ).toFixed(6);

      newFontSize = parseInt( maxWidth / ratio, 10 ) - autoGuessSubtraction;

      outer: for(var m=0, n=intervals.length; m<n; m++) {
        inner: for(var j=1, k=10; j<=k; j++) {
          if(newFontSize + j*intervals[m] > maxFontSize) {
            newFontSize = maxFontSize;
            break outer;
          }

          lineMax = testLineDimensions(line, maxWidth, 'fontSize', newFontSize + j*intervals[m], intervals[m], 'px', lineMax);
          if(typeof lineMax !== 'number') {
            newFontSize = lineMax.size;

            if(lineMax.match === 'exact') {
              break outer;
            }
            break inner;
          }
        }
      }

      ratios.push(maxWidth / newFontSize);

      if(newFontSize > maxFontSize) {
        fontSizes.push(maxFontSize);
        minFontSizes.push(false);
      } else if(!!minFontSize && newFontSize < minFontSize) {
        fontSizes.push(minFontSize);
        minFontSizes.push(true);
      } else {
        fontSizes.push(newFontSize);
        minFontSizes.push(false);
      }
    });

    forEach(children, function(line, lineNumber) {
      var wordSpacing = 0;
      var interval = 1;
      var maxWordSpacing;

      if(hasClass(line, BigIdeasText.EXEMPT_CLASS)) {
        wordSpacings.push(null);
        return;
      }

      // must re-use font-size, even though it was removed above.
      line.style.fontSize = fontSizes[lineNumber] + 'px';

      for(var m=1, n=3; m<n; m+=interval) {
        maxWordSpacing = testLineDimensions(line, maxWidth, 'wordSpacing', m, interval, 'px', maxWordSpacing);
        if(typeof maxWordSpacing !== 'number') {
          wordSpacing = maxWordSpacing.size;
          break;
        }
      }

      line.style.fontSize = '';
      wordSpacings.push(wordSpacing);

    });

    // No sure if this needs to be its own
    // forEach or can exist in one previous
    forEach(children, function(child) {
      child.removeAttribute('style');
    });

    if( !BigIdeasText.DEBUG_MODE ) {
      c.parentNode.removeChild(c);
    } else {
      c.style.backgroundColor = 'rgba(255,255,255,.4)';
    }

    return {
      fontSizes: fontSizes,
      wordSpacings: wordSpacings,
      ratios: ratios,
      minFontSizes: minFontSizes
    };
  }

  window.bigIdeasText = function(selector, options) {
    BigIdeasText.mainMethod.call(selector, options);
    return BigIdeasText;
  };

}(window, document));
