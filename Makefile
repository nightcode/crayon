NODE_PATH ?= ./node_modules
JS_COMPILER = $(NODE_PATH)/uglify-js/bin/uglifyjs
JS_BEAUTIFIER = $(NODE_PATH)/uglify-js/bin/uglifyjs -b -i 2 -nm -ns
LOCALE ?= en_US

all: \
	crayon.v0.js \
	crayon.v0.min.js

.INTERMEDIATE crayon.v0.js: \
	src/start.js \
	crayon.core.js \
	crayon.chart.js \
	src/end.js

crayon.core.js: \
  src/core/core.js \
  src/core/colors.js \
  src/core/legend.js \
  src/core/axis.js \
  src/core/tooltip.js \
  src/core/bar.js

crayon.chart.js: \
	src/chart/common.js \
	src/chart/bars.js \
	src/chart/line.js \
	src/chart/sparkline.js

%.min.js: %.js Makefile
	@rm -f $@
	$(JS_COMPILER) < $< > $@

crayon%.js: Makefile
	@rm -f $@
	cat $(filter %.js,$^) | $(JS_BEAUTIFIER) > $@
	@chmod a-w $@

clean:
	rm -f crayon*.js
