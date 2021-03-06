// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/preact/dist/preact.umd.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.preact = {})));
}(this, (function (exports) { 'use strict';

	var VNode = function VNode() {};

	var options = {};

	var stack = [];

	var EMPTY_CHILDREN = [];

	function h(nodeName, attributes) {
		var children = EMPTY_CHILDREN,
		    lastSimple = void 0,
		    child = void 0,
		    simple = void 0,
		    i = void 0;
		for (i = arguments.length; i-- > 2;) {
			stack.push(arguments[i]);
		}
		if (attributes && attributes.children != null) {
			if (!stack.length) stack.push(attributes.children);
			delete attributes.children;
		}
		while (stack.length) {
			if ((child = stack.pop()) && child.pop !== undefined) {
				for (i = child.length; i--;) {
					stack.push(child[i]);
				}
			} else {
				if (typeof child === 'boolean') child = null;

				if (simple = typeof nodeName !== 'function') {
					if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
				}

				if (simple && lastSimple) {
					children[children.length - 1] += child;
				} else if (children === EMPTY_CHILDREN) {
					children = [child];
				} else {
					children.push(child);
				}

				lastSimple = simple;
			}
		}

		var p = new VNode();
		p.nodeName = nodeName;
		p.children = children;
		p.attributes = attributes == null ? undefined : attributes;
		p.key = attributes == null ? undefined : attributes.key;

		if (options.vnode !== undefined) options.vnode(p);

		return p;
	}

	function extend(obj, props) {
	  for (var i in props) {
	    obj[i] = props[i];
	  }return obj;
	}

	function applyRef(ref, value) {
	  if (ref) {
	    if (typeof ref == 'function') ref(value);else ref.current = value;
	  }
	}

	var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

	function cloneElement(vnode, props) {
	  return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
	}

	var NO_RENDER = 0;

	var SYNC_RENDER = 1;

	var FORCE_RENDER = 2;

	var ASYNC_RENDER = 3;

	var ATTR_KEY = '__preactattr_';

	var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

	var items = [];

	function enqueueRender(component) {
		if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
			(options.debounceRendering || defer)(rerender);
		}
	}

	function rerender() {
		var p = void 0;
		while (p = items.pop()) {
			if (p._dirty) renderComponent(p);
		}
	}

	function isSameNodeType(node, vnode, hydrating) {
		if (typeof vnode === 'string' || typeof vnode === 'number') {
			return node.splitText !== undefined;
		}
		if (typeof vnode.nodeName === 'string') {
			return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
		}
		return hydrating || node._componentConstructor === vnode.nodeName;
	}

	function isNamedNode(node, nodeName) {
		return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
	}

	function getNodeProps(vnode) {
		var props = extend({}, vnode.attributes);
		props.children = vnode.children;

		var defaultProps = vnode.nodeName.defaultProps;
		if (defaultProps !== undefined) {
			for (var i in defaultProps) {
				if (props[i] === undefined) {
					props[i] = defaultProps[i];
				}
			}
		}

		return props;
	}

	function createNode(nodeName, isSvg) {
		var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
		node.normalizedNodeName = nodeName;
		return node;
	}

	function removeNode(node) {
		var parentNode = node.parentNode;
		if (parentNode) parentNode.removeChild(node);
	}

	function setAccessor(node, name, old, value, isSvg) {
		if (name === 'className') name = 'class';

		if (name === 'key') {} else if (name === 'ref') {
			applyRef(old, null);
			applyRef(value, node);
		} else if (name === 'class' && !isSvg) {
			node.className = value || '';
		} else if (name === 'style') {
			if (!value || typeof value === 'string' || typeof old === 'string') {
				node.style.cssText = value || '';
			}
			if (value && typeof value === 'object') {
				if (typeof old !== 'string') {
					for (var i in old) {
						if (!(i in value)) node.style[i] = '';
					}
				}
				for (var _i in value) {
					node.style[_i] = typeof value[_i] === 'number' && IS_NON_DIMENSIONAL.test(_i) === false ? value[_i] + 'px' : value[_i];
				}
			}
		} else if (name === 'dangerouslySetInnerHTML') {
			if (value) node.innerHTML = value.__html || '';
		} else if (name[0] == 'o' && name[1] == 'n') {
			var useCapture = name !== (name = name.replace(/Capture$/, ''));
			name = name.toLowerCase().substring(2);
			if (value) {
				if (!old) node.addEventListener(name, eventProxy, useCapture);
			} else {
				node.removeEventListener(name, eventProxy, useCapture);
			}
			(node._listeners || (node._listeners = {}))[name] = value;
		} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
			try {
				node[name] = value == null ? '' : value;
			} catch (e) {}
			if ((value == null || value === false) && name != 'spellcheck') node.removeAttribute(name);
		} else {
			var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

			if (value == null || value === false) {
				if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
			} else if (typeof value !== 'function') {
				if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
			}
		}
	}

	function eventProxy(e) {
		return this._listeners[e.type](options.event && options.event(e) || e);
	}

	var mounts = [];

	var diffLevel = 0;

	var isSvgMode = false;

	var hydrating = false;

	function flushMounts() {
		var c = void 0;
		while (c = mounts.shift()) {
			if (options.afterMount) options.afterMount(c);
			if (c.componentDidMount) c.componentDidMount();
		}
	}

	function diff(dom, vnode, context, mountAll, parent, componentRoot) {
		if (!diffLevel++) {
			isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

			hydrating = dom != null && !(ATTR_KEY in dom);
		}

		var ret = idiff(dom, vnode, context, mountAll, componentRoot);

		if (parent && ret.parentNode !== parent) parent.appendChild(ret);

		if (! --diffLevel) {
			hydrating = false;

			if (!componentRoot) flushMounts();
		}

		return ret;
	}

	function idiff(dom, vnode, context, mountAll, componentRoot) {
		var out = dom,
		    prevSvgMode = isSvgMode;

		if (vnode == null || typeof vnode === 'boolean') vnode = '';

		if (typeof vnode === 'string' || typeof vnode === 'number') {
			if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
				if (dom.nodeValue != vnode) {
					dom.nodeValue = vnode;
				}
			} else {
				out = document.createTextNode(vnode);
				if (dom) {
					if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
					recollectNodeTree(dom, true);
				}
			}

			out[ATTR_KEY] = true;

			return out;
		}

		var vnodeName = vnode.nodeName;
		if (typeof vnodeName === 'function') {
			return buildComponentFromVNode(dom, vnode, context, mountAll);
		}

		isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

		vnodeName = String(vnodeName);
		if (!dom || !isNamedNode(dom, vnodeName)) {
			out = createNode(vnodeName, isSvgMode);

			if (dom) {
				while (dom.firstChild) {
					out.appendChild(dom.firstChild);
				}
				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

				recollectNodeTree(dom, true);
			}
		}

		var fc = out.firstChild,
		    props = out[ATTR_KEY],
		    vchildren = vnode.children;

		if (props == null) {
			props = out[ATTR_KEY] = {};
			for (var a = out.attributes, i = a.length; i--;) {
				props[a[i].name] = a[i].value;
			}
		}

		if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
			if (fc.nodeValue != vchildren[0]) {
				fc.nodeValue = vchildren[0];
			}
		} else if (vchildren && vchildren.length || fc != null) {
				innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
			}

		diffAttributes(out, vnode.attributes, props);

		isSvgMode = prevSvgMode;

		return out;
	}

	function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
		var originalChildren = dom.childNodes,
		    children = [],
		    keyed = {},
		    keyedLen = 0,
		    min = 0,
		    len = originalChildren.length,
		    childrenLen = 0,
		    vlen = vchildren ? vchildren.length : 0,
		    j = void 0,
		    c = void 0,
		    f = void 0,
		    vchild = void 0,
		    child = void 0;

		if (len !== 0) {
			for (var i = 0; i < len; i++) {
				var _child = originalChildren[i],
				    props = _child[ATTR_KEY],
				    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
				if (key != null) {
					keyedLen++;
					keyed[key] = _child;
				} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
					children[childrenLen++] = _child;
				}
			}
		}

		if (vlen !== 0) {
			for (var _i = 0; _i < vlen; _i++) {
				vchild = vchildren[_i];
				child = null;

				var _key = vchild.key;
				if (_key != null) {
					if (keyedLen && keyed[_key] !== undefined) {
						child = keyed[_key];
						keyed[_key] = undefined;
						keyedLen--;
					}
				} else if (min < childrenLen) {
						for (j = min; j < childrenLen; j++) {
							if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
								child = c;
								children[j] = undefined;
								if (j === childrenLen - 1) childrenLen--;
								if (j === min) min++;
								break;
							}
						}
					}

				child = idiff(child, vchild, context, mountAll);

				f = originalChildren[_i];
				if (child && child !== dom && child !== f) {
					if (f == null) {
						dom.appendChild(child);
					} else if (child === f.nextSibling) {
						removeNode(f);
					} else {
						dom.insertBefore(child, f);
					}
				}
			}
		}

		if (keyedLen) {
			for (var _i2 in keyed) {
				if (keyed[_i2] !== undefined) recollectNodeTree(keyed[_i2], false);
			}
		}

		while (min <= childrenLen) {
			if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
		}
	}

	function recollectNodeTree(node, unmountOnly) {
		var component = node._component;
		if (component) {
			unmountComponent(component);
		} else {
			if (node[ATTR_KEY] != null) applyRef(node[ATTR_KEY].ref, null);

			if (unmountOnly === false || node[ATTR_KEY] == null) {
				removeNode(node);
			}

			removeChildren(node);
		}
	}

	function removeChildren(node) {
		node = node.lastChild;
		while (node) {
			var next = node.previousSibling;
			recollectNodeTree(node, true);
			node = next;
		}
	}

	function diffAttributes(dom, attrs, old) {
		var name = void 0;

		for (name in old) {
			if (!(attrs && attrs[name] != null) && old[name] != null) {
				setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
			}
		}

		for (name in attrs) {
			if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
				setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
			}
		}
	}

	var recyclerComponents = [];

	function createComponent(Ctor, props, context) {
		var inst = void 0,
		    i = recyclerComponents.length;

		if (Ctor.prototype && Ctor.prototype.render) {
			inst = new Ctor(props, context);
			Component.call(inst, props, context);
		} else {
			inst = new Component(props, context);
			inst.constructor = Ctor;
			inst.render = doRender;
		}

		while (i--) {
			if (recyclerComponents[i].constructor === Ctor) {
				inst.nextBase = recyclerComponents[i].nextBase;
				recyclerComponents.splice(i, 1);
				return inst;
			}
		}

		return inst;
	}

	function doRender(props, state, context) {
		return this.constructor(props, context);
	}

	function setComponentProps(component, props, renderMode, context, mountAll) {
		if (component._disable) return;
		component._disable = true;

		component.__ref = props.ref;
		component.__key = props.key;
		delete props.ref;
		delete props.key;

		if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
			if (!component.base || mountAll) {
				if (component.componentWillMount) component.componentWillMount();
			} else if (component.componentWillReceiveProps) {
				component.componentWillReceiveProps(props, context);
			}
		}

		if (context && context !== component.context) {
			if (!component.prevContext) component.prevContext = component.context;
			component.context = context;
		}

		if (!component.prevProps) component.prevProps = component.props;
		component.props = props;

		component._disable = false;

		if (renderMode !== NO_RENDER) {
			if (renderMode === SYNC_RENDER || options.syncComponentUpdates !== false || !component.base) {
				renderComponent(component, SYNC_RENDER, mountAll);
			} else {
				enqueueRender(component);
			}
		}

		applyRef(component.__ref, component);
	}

	function renderComponent(component, renderMode, mountAll, isChild) {
		if (component._disable) return;

		var props = component.props,
		    state = component.state,
		    context = component.context,
		    previousProps = component.prevProps || props,
		    previousState = component.prevState || state,
		    previousContext = component.prevContext || context,
		    isUpdate = component.base,
		    nextBase = component.nextBase,
		    initialBase = isUpdate || nextBase,
		    initialChildComponent = component._component,
		    skip = false,
		    snapshot = previousContext,
		    rendered = void 0,
		    inst = void 0,
		    cbase = void 0;

		if (component.constructor.getDerivedStateFromProps) {
			state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
			component.state = state;
		}

		if (isUpdate) {
			component.props = previousProps;
			component.state = previousState;
			component.context = previousContext;
			if (renderMode !== FORCE_RENDER && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
				skip = true;
			} else if (component.componentWillUpdate) {
				component.componentWillUpdate(props, state, context);
			}
			component.props = props;
			component.state = state;
			component.context = context;
		}

		component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
		component._dirty = false;

		if (!skip) {
			rendered = component.render(props, state, context);

			if (component.getChildContext) {
				context = extend(extend({}, context), component.getChildContext());
			}

			if (isUpdate && component.getSnapshotBeforeUpdate) {
				snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
			}

			var childComponent = rendered && rendered.nodeName,
			    toUnmount = void 0,
			    base = void 0;

			if (typeof childComponent === 'function') {

				var childProps = getNodeProps(rendered);
				inst = initialChildComponent;

				if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
					setComponentProps(inst, childProps, SYNC_RENDER, context, false);
				} else {
					toUnmount = inst;

					component._component = inst = createComponent(childComponent, childProps, context);
					inst.nextBase = inst.nextBase || nextBase;
					inst._parentComponent = component;
					setComponentProps(inst, childProps, NO_RENDER, context, false);
					renderComponent(inst, SYNC_RENDER, mountAll, true);
				}

				base = inst.base;
			} else {
				cbase = initialBase;

				toUnmount = initialChildComponent;
				if (toUnmount) {
					cbase = component._component = null;
				}

				if (initialBase || renderMode === SYNC_RENDER) {
					if (cbase) cbase._component = null;
					base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
				}
			}

			if (initialBase && base !== initialBase && inst !== initialChildComponent) {
				var baseParent = initialBase.parentNode;
				if (baseParent && base !== baseParent) {
					baseParent.replaceChild(base, initialBase);

					if (!toUnmount) {
						initialBase._component = null;
						recollectNodeTree(initialBase, false);
					}
				}
			}

			if (toUnmount) {
				unmountComponent(toUnmount);
			}

			component.base = base;
			if (base && !isChild) {
				var componentRef = component,
				    t = component;
				while (t = t._parentComponent) {
					(componentRef = t).base = base;
				}
				base._component = componentRef;
				base._componentConstructor = componentRef.constructor;
			}
		}

		if (!isUpdate || mountAll) {
			mounts.push(component);
		} else if (!skip) {

			if (component.componentDidUpdate) {
				component.componentDidUpdate(previousProps, previousState, snapshot);
			}
			if (options.afterUpdate) options.afterUpdate(component);
		}

		while (component._renderCallbacks.length) {
			component._renderCallbacks.pop().call(component);
		}if (!diffLevel && !isChild) flushMounts();
	}

	function buildComponentFromVNode(dom, vnode, context, mountAll) {
		var c = dom && dom._component,
		    originalComponent = c,
		    oldDom = dom,
		    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
		    isOwner = isDirectOwner,
		    props = getNodeProps(vnode);
		while (c && !isOwner && (c = c._parentComponent)) {
			isOwner = c.constructor === vnode.nodeName;
		}

		if (c && isOwner && (!mountAll || c._component)) {
			setComponentProps(c, props, ASYNC_RENDER, context, mountAll);
			dom = c.base;
		} else {
			if (originalComponent && !isDirectOwner) {
				unmountComponent(originalComponent);
				dom = oldDom = null;
			}

			c = createComponent(vnode.nodeName, props, context);
			if (dom && !c.nextBase) {
				c.nextBase = dom;

				oldDom = null;
			}
			setComponentProps(c, props, SYNC_RENDER, context, mountAll);
			dom = c.base;

			if (oldDom && dom !== oldDom) {
				oldDom._component = null;
				recollectNodeTree(oldDom, false);
			}
		}

		return dom;
	}

	function unmountComponent(component) {
		if (options.beforeUnmount) options.beforeUnmount(component);

		var base = component.base;

		component._disable = true;

		if (component.componentWillUnmount) component.componentWillUnmount();

		component.base = null;

		var inner = component._component;
		if (inner) {
			unmountComponent(inner);
		} else if (base) {
			if (base[ATTR_KEY] != null) applyRef(base[ATTR_KEY].ref, null);

			component.nextBase = base;

			removeNode(base);
			recyclerComponents.push(component);

			removeChildren(base);
		}

		applyRef(component.__ref, null);
	}

	function Component(props, context) {
		this._dirty = true;

		this.context = context;

		this.props = props;

		this.state = this.state || {};

		this._renderCallbacks = [];
	}

	extend(Component.prototype, {
		setState: function setState(state, callback) {
			if (!this.prevState) this.prevState = this.state;
			this.state = extend(extend({}, this.state), typeof state === 'function' ? state(this.state, this.props) : state);
			if (callback) this._renderCallbacks.push(callback);
			enqueueRender(this);
		},
		forceUpdate: function forceUpdate(callback) {
			if (callback) this._renderCallbacks.push(callback);
			renderComponent(this, FORCE_RENDER);
		},
		render: function render() {}
	});

	function render(vnode, parent, merge) {
	  return diff(merge, vnode, {}, false, parent, false);
	}

	function createRef() {
		return {};
	}

	var preact = {
		h: h,
		createElement: h,
		cloneElement: cloneElement,
		createRef: createRef,
		Component: Component,
		render: render,
		rerender: rerender,
		options: options
	};

	exports.default = preact;
	exports.h = h;
	exports.createElement = h;
	exports.cloneElement = cloneElement;
	exports.createRef = createRef;
	exports.Component = Component;
	exports.render = render;
	exports.rerender = rerender;
	exports.options = options;

	Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],"src/components/Theme.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var Theme = function Theme(_ref) {
  var theme = _ref.theme;

  var has_multiple_themes = function has_multiple_themes(name) {
    var mpkgs = ["default", "PSphinxTheme", "pylons-sphinx-themes", "sphinx-themes"];
    return mpkgs.includes(name);
  };

  var src = "html/".concat(theme.pkg_name, "/").concat(theme.theme, "/screenshot.png");
  var pypi = theme.url;
  var sample = "html/".concat(theme.pkg_name, "/").concat(theme.theme, "/index.html");
  var conf = "src/".concat(theme.pkg_name, "/").concat(theme.theme, "/conf.py");
  var name = theme.pkg_name;

  if (has_multiple_themes(name)) {
    name = "".concat(theme.pkg_name, " (").concat(theme.theme, ")");
  }

  return (0, _preact.h)("div", {
    className: "col-md-4 p-3"
  }, (0, _preact.h)("div", {
    className: "card"
  }, (0, _preact.h)("h5", {
    className: "card-header"
  }, name), (0, _preact.h)("div", {
    className: "card-body"
  }, (0, _preact.h)("a", {
    href: sample
  }, (0, _preact.h)("img", {
    className: "card-img-top",
    src: src,
    alt: "theme screen shot"
  }))), (0, _preact.h)("div", {
    className: "card-footer text-center"
  }, (0, _preact.h)("a", {
    className: "card-link",
    href: sample
  }, "sample"), (0, _preact.h)("a", {
    className: "card-link",
    href: pypi
  }, "pypi"), (0, _preact.h)("a", {
    className: "card-link",
    href: conf
  }, "conf.py"))));
};

var _default = Theme;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.umd.js"}],"../data/data.json":[function(require,module,exports) {
module.exports = [{
  "pkg_name": "pietroalbini-sphinx-themes",
  "theme": "pietroalbini",
  "url": "https://pypi.python.org/pypi/pietroalbini-sphinx-themes",
  "tag": ["pietroalbini-sphinx-themes"],
  "created": "2018-02-07T12:02:50Z",
  "updated": "2018-02-07T12:02:50Z"
}, {
  "pkg_name": "kotti_docs_theme",
  "theme": "kotti_docs_theme",
  "url": "https://pypi.python.org/pypi/kotti_docs_theme",
  "tag": ["kotti_docs_theme"],
  "created": "2018-01-31T11:50:04Z",
  "updated": "2018-01-31T11:50:04Z"
}, {
  "pkg_name": "karma_sphinx_theme",
  "theme": "karma_sphinx_theme",
  "url": "https://pypi.python.org/pypi/karma_sphinx_theme",
  "tag": ["karma_sphinx_theme"],
  "created": "2018-08-07T13:52:49Z",
  "updated": "2018-08-07T13:52:49Z"
}, {
  "pkg_name": "wild_sphinx_theme",
  "theme": "wild",
  "url": "https://pypi.python.org/pypi/wild_sphinx_theme",
  "tag": ["wild_sphinx_theme"],
  "created": "2018-02-20T15:19:45Z",
  "updated": "2018-02-20T15:19:45Z"
}, {
  "pkg_name": "sphinx-bootstrap-theme",
  "theme": "bootstrap",
  "url": "https://pypi.python.org/pypi/sphinx-bootstrap-theme",
  "tag": ["sphinx-bootstrap-theme"],
  "created": "2018-01-28T13:51:38Z",
  "updated": "2018-01-28T13:51:38Z"
}, {
  "pkg_name": "romnnn_sphinx_press_theme",
  "theme": "press",
  "url": "https://pypi.python.org/pypi/romnnn_sphinx_press_theme",
  "tag": ["romnnn_sphinx_press_theme"],
  "created": "2020-01-02T10:43:32Z",
  "updated": "2020-01-02T10:43:32Z"
}, {
  "pkg_name": "sphinx_ops_theme",
  "theme": "sphinx_ops_theme",
  "url": "https://pypi.python.org/pypi/sphinx_ops_theme",
  "tag": ["sphinx_ops_theme"],
  "created": "2018-02-20T14:54:28Z",
  "updated": "2018-02-20T14:54:28Z"
}, {
  "pkg_name": "sphinx-nameko-theme",
  "theme": "nameko",
  "url": "https://pypi.python.org/pypi/sphinx-nameko-theme",
  "tag": ["sphinx-nameko-theme"],
  "created": "2018-01-31T11:58:59Z",
  "updated": "2018-01-31T11:58:59Z"
}, {
  "pkg_name": "sphinxjp.themes.sphinxjp",
  "theme": "sphinxjp",
  "url": "https://pypi.python.org/pypi/sphinxjp.themes.sphinxjp",
  "tag": ["sphinxjp.themes.sphinxjp"],
  "created": "2018-02-20T15:07:55Z",
  "updated": "2018-02-20T15:07:55Z"
}, {
  "pkg_name": "sphinx-modern-theme",
  "theme": "sphinx_modern_theme",
  "url": "https://pypi.python.org/pypi/sphinx-modern-theme",
  "tag": ["sphinx-modern-theme"],
  "created": "2018-01-28T14:30:37Z",
  "updated": "2018-01-28T14:30:37Z"
}, {
  "pkg_name": "crate-docs-theme",
  "theme": "crate",
  "url": "https://pypi.python.org/pypi/crate-docs-theme",
  "tag": ["crate-docs-theme"],
  "created": "2018-01-29T12:19:17Z",
  "updated": "2018-01-29T12:19:17Z"
}, {
  "pkg_name": "hbp-sphinx-theme",
  "theme": "hbp_sphinx_theme",
  "url": "https://pypi.python.org/pypi/hbp-sphinx-theme",
  "tag": ["hbp-sphinx-theme"],
  "created": "2018-01-31T11:42:23Z",
  "updated": "2018-01-31T11:42:23Z"
}, {
  "pkg_name": "sphinx-glpi-theme",
  "theme": "glpi",
  "url": "https://pypi.python.org/pypi/sphinx-glpi-theme",
  "tag": ["sphinx-glpi-theme"],
  "created": "2018-01-29T12:49:54Z",
  "updated": "2018-01-29T12:49:54Z"
}, {
  "pkg_name": "sphinx_drove_theme",
  "theme": "sphinx_drove_theme",
  "url": "https://pypi.python.org/pypi/sphinx_drove_theme",
  "tag": ["sphinx_drove_theme"],
  "created": "2018-02-14T12:24:39Z",
  "updated": "2018-02-14T12:24:39Z"
}, {
  "pkg_name": "jupyter-sphinx-theme",
  "theme": "jupyter-sphinx-thembe",
  "url": "https://pypi.python.org/pypi/jupyter-sphinx-theme",
  "tag": ["jupyter-sphinx-theme"],
  "created": "2018-01-31T11:47:41Z",
  "updated": "2018-01-31T11:47:41Z"
}, {
  "pkg_name": "stsci-rtd-theme",
  "theme": "stsci_rtd_theme",
  "url": "https://pypi.python.org/pypi/stsci-rtd-theme",
  "tag": ["stsci-rtd-theme"],
  "created": "2018-02-07T13:45:50Z",
  "updated": "2018-02-07T13:45:50Z"
}, {
  "pkg_name": "sphinx_celery",
  "theme": "sphinx_celery",
  "url": "https://pypi.python.org/pypi/sphinx_celery",
  "tag": ["sphinx_celery"],
  "created": "2019-09-27T01:34:16Z",
  "updated": "2019-09-27T01:34:16Z"
}, {
  "pkg_name": "sphinx-boost",
  "theme": "boost",
  "url": "https://pypi.python.org/pypi/sphinx-boost",
  "tag": ["sphinx-boost"],
  "created": "2018-01-28T07:11:29Z",
  "updated": "2018-01-28T07:11:29Z"
}, {
  "pkg_name": "sphinx_materialdesign_theme",
  "theme": "sphinx_materialdesign_theme",
  "url": "https://pypi.python.org/pypi/sphinx_materialdesign_theme",
  "tag": ["sphinx_materialdesign_theme"],
  "created": "2018-02-20T14:51:56Z",
  "updated": "2018-02-20T14:51:56Z"
}, {
  "pkg_name": "sphinx-fossasia-theme",
  "theme": "sphinx_fossasia_theme",
  "url": "https://pypi.python.org/pypi/sphinx-fossasia-theme",
  "tag": ["sphinx-fossasia-theme"],
  "created": "2018-01-29T12:43:26Z",
  "updated": "2018-01-29T12:43:26Z"
}, {
  "pkg_name": "sphinx-bulma-theme",
  "theme": "bulma",
  "url": "https://pypi.python.org/pypi/sphinx-bulma-theme",
  "tag": ["sphinx-bulma-theme"],
  "created": "2018-08-07T13:43:21Z",
  "updated": "2018-08-07T13:43:21Z"
}, {
  "pkg_name": "insegel",
  "theme": "insegel",
  "url": "https://pypi.python.org/pypi/insegel",
  "tag": ["insegel"],
  "created": "2018-01-31T11:43:26Z",
  "updated": "2018-01-31T11:43:26Z"
}, {
  "pkg_name": "logilab-sphinx-themes",
  "theme": "logilab",
  "url": "https://pypi.python.org/pypi/logilab-sphinx-themes",
  "tag": ["logilab-sphinx-themes"],
  "created": "2018-08-07T13:49:43Z",
  "updated": "2018-08-07T13:49:43Z"
}, {
  "pkg_name": "epfl-sphinx-theme",
  "theme": "epfl",
  "url": "https://pypi.python.org/pypi/epfl-sphinx-theme",
  "tag": ["epfl-sphinx-theme"],
  "created": "2018-01-29T12:37:22Z",
  "updated": "2018-01-29T12:37:22Z"
}, {
  "pkg_name": "topos-theme",
  "theme": "topos-theme",
  "url": "https://pypi.python.org/pypi/topos-theme",
  "tag": ["topos-theme"],
  "created": "2018-08-07T13:44:04Z",
  "updated": "2018-08-07T13:44:04Z"
}, {
  "pkg_name": "sponge-docs-theme",
  "theme": "sphinx_rtd_theme",
  "url": "https://pypi.python.org/pypi/sponge-docs-theme",
  "tag": ["sponge-docs-theme"],
  "created": "2018-08-07T13:47:52Z",
  "updated": "2018-08-07T13:47:52Z"
}, {
  "pkg_name": "astropy-sphinx-theme",
  "theme": "bootstrap-astropy",
  "url": "https://pypi.python.org/pypi/astropy-sphinx-theme",
  "tag": ["astropy-sphinx-theme"],
  "created": "2018-01-28T06:38:55Z",
  "updated": "2018-01-28T06:38:55Z"
}, {
  "pkg_name": "renga-sphinx-theme",
  "theme": "renga",
  "url": "https://pypi.python.org/pypi/renga-sphinx-theme",
  "tag": ["renga-sphinx-theme"],
  "created": "2018-02-07T12:37:38Z",
  "updated": "2018-02-07T12:37:38Z"
}, {
  "pkg_name": "mkdocs-nature",
  "theme": "nature",
  "url": "https://pypi.python.org/pypi/mkdocs-nature",
  "tag": ["mkdocs-nature"],
  "created": "2018-01-31T11:57:37Z",
  "updated": "2018-01-31T11:57:37Z"
}, {
  "pkg_name": "sphinx-corlab-theme",
  "theme": "corlab_theme",
  "url": "https://pypi.python.org/pypi/sphinx-corlab-theme",
  "tag": ["sphinx-corlab-theme"],
  "created": "2018-01-28T14:13:48Z",
  "updated": "2018-01-28T14:13:48Z"
}, {
  "pkg_name": "stanford-theme",
  "theme": "stanford_theme",
  "url": "https://pypi.python.org/pypi/stanford-theme",
  "tag": ["stanford-theme"],
  "created": "2018-01-28T03:04:01Z",
  "updated": "2018-01-28T03:04:01Z"
}, {
  "pkg_name": "sphinx-catalystcloud-theme",
  "theme": "sphinx_catalystcloud_theme",
  "url": "https://pypi.python.org/pypi/sphinx-catalystcloud-theme",
  "tag": ["sphinx-catalystcloud-theme"],
  "created": "2018-01-28T14:07:25Z",
  "updated": "2018-01-28T14:07:25Z"
}, {
  "pkg_name": "sphinx_adc_theme",
  "theme": "sphinx_adc_theme",
  "url": "https://pypi.python.org/pypi/sphinx_adc_theme",
  "tag": ["sphinx_adc_theme"],
  "created": "2018-02-14T12:22:44Z",
  "updated": "2018-02-14T12:22:44Z"
}, {
  "pkg_name": "sphinxjp.themes.gopher",
  "theme": "gopher",
  "url": "https://pypi.python.org/pypi/sphinxjp.themes.gopher",
  "tag": ["sphinxjp.themes.gopher"],
  "created": "2018-02-20T15:00:17Z",
  "updated": "2018-02-20T15:00:17Z"
}, {
  "pkg_name": "ovs-sphinx-theme",
  "theme": "ovs",
  "url": "https://pypi.python.org/pypi/ovs-sphinx-theme",
  "tag": ["ovs-sphinx-theme"],
  "created": "2018-02-07T11:59:50Z",
  "updated": "2018-02-07T11:59:50Z"
}, {
  "pkg_name": "sphinx_py3doc_enhanced_theme",
  "theme": "sphinx_py3doc_enhanced_theme",
  "url": "https://pypi.python.org/pypi/sphinx_py3doc_enhanced_theme",
  "tag": ["sphinx_py3doc_enhanced_theme"],
  "created": "2018-02-20T14:55:02Z",
  "updated": "2018-02-20T14:55:02Z"
}, {
  "pkg_name": "Flask-Sphinx-Themes",
  "theme": "flask",
  "url": "https://pypi.python.org/pypi/Flask-Sphinx-Themes",
  "tag": ["Flask-Sphinx-Themes"],
  "created": "2018-01-29T02:05:35Z",
  "updated": "2018-01-29T02:05:35Z"
}, {
  "pkg_name": "sphinxjp.themes.basicstrap",
  "theme": "basicstrap",
  "url": "https://pypi.python.org/pypi/sphinxjp.themes.basicstrap",
  "tag": ["sphinxjp.themes.basicstrap"],
  "created": "2018-02-20T14:59:10Z",
  "updated": "2018-02-20T14:59:10Z"
}, {
  "pkg_name": "sphinxjp.themes.s6",
  "theme": "s6",
  "url": "https://pypi.python.org/pypi/sphinxjp.themes.s6",
  "tag": ["sphinxjp.themes.s6"],
  "created": "2018-02-20T15:06:10Z",
  "updated": "2018-02-20T15:06:10Z"
}, {
  "pkg_name": "python-docs-theme",
  "theme": "python_docs_theme",
  "url": "https://pypi.python.org/pypi/python-docs-theme",
  "tag": ["python-docs-theme"],
  "created": "2018-08-07T13:45:21Z",
  "updated": "2018-08-07T13:45:21Z"
}, {
  "pkg_name": "sphinx_theme_pd",
  "theme": "sphinx_theme_pd",
  "url": "https://pypi.python.org/pypi/sphinx_theme_pd",
  "tag": ["sphinx_theme_pd"],
  "created": "2018-02-20T14:57:32Z",
  "updated": "2018-02-20T14:57:32Z"
}, {
  "pkg_name": "sunpy-sphinx-theme",
  "theme": "sunpy",
  "url": "https://pypi.python.org/pypi/sunpy-sphinx-theme",
  "tag": ["sunpy-sphinx-theme"],
  "created": "2018-02-07T14:02:06Z",
  "updated": "2018-02-07T14:02:06Z"
}, {
  "pkg_name": "quark-sphinx-theme",
  "theme": "quark",
  "url": "https://pypi.python.org/pypi/quark-sphinx-theme",
  "tag": ["quark-sphinx-theme"],
  "created": "2018-02-07T12:33:36Z",
  "updated": "2018-02-07T12:33:36Z"
}, {
  "pkg_name": "sphinx-press-theme",
  "theme": "press",
  "url": "https://pypi.python.org/pypi/sphinx-press-theme",
  "tag": ["sphinx-press-theme"],
  "created": "2018-08-07T13:40:28Z",
  "updated": "2018-08-07T13:40:28Z"
}, {
  "pkg_name": "oe-sphinx-theme",
  "theme": "oe_sphinx",
  "url": "https://pypi.python.org/pypi/oe-sphinx-theme",
  "tag": ["oe-sphinx-theme"],
  "created": "2018-01-31T12:00:27Z",
  "updated": "2018-01-31T12:00:27Z"
}, {
  "pkg_name": "sphinx-opnfv-theme",
  "theme": "opnfv",
  "url": "https://pypi.python.org/pypi/sphinx-opnfv-theme",
  "tag": ["sphinx-opnfv-theme"],
  "created": "2018-08-07T13:34:47Z",
  "updated": "2018-08-07T13:34:47Z"
}, {
  "pkg_name": "allanc-sphinx",
  "theme": "yeen",
  "url": "https://pypi.python.org/pypi/allanc-sphinx",
  "tag": ["allanc-sphinx"],
  "created": "2018-01-28T06:36:57Z",
  "updated": "2018-01-28T06:36:57Z"
}, {
  "pkg_name": "sphinx_bernard_theme",
  "theme": "sphinx_bernard_theme",
  "url": "https://pypi.python.org/pypi/sphinx_bernard_theme",
  "tag": ["sphinx_bernard_theme"],
  "created": "2018-02-14T12:23:44Z",
  "updated": "2018-02-14T12:23:44Z"
}, {
  "pkg_name": "f5-sphinx-theme",
  "theme": "f5_sphinx_theme",
  "url": "https://pypi.python.org/pypi/f5-sphinx-theme",
  "tag": ["f5-sphinx-theme"],
  "created": "2018-08-07T13:51:05Z",
  "updated": "2018-08-07T13:51:05Z"
}, {
  "pkg_name": "sphinx-nameko-mw-theme",
  "theme": "nameko-mw",
  "url": "https://pypi.python.org/pypi/sphinx-nameko-mw-theme",
  "tag": ["sphinx-nameko-mw-theme"],
  "created": "2018-01-31T11:58:21Z",
  "updated": "2018-01-31T11:58:21Z"
}, {
  "pkg_name": "default",
  "theme": "agogo",
  "url": "default",
  "tag": ["default"],
  "created": "2018-01-28T00:58:52Z",
  "updated": "2018-01-28T00:58:52Z"
}, {
  "pkg_name": "default",
  "theme": "classic",
  "url": "default",
  "tag": ["default"],
  "created": "2018-01-28T00:58:52Z",
  "updated": "2018-01-28T00:58:52Z"
}, {
  "pkg_name": "default",
  "theme": "nature",
  "url": "default",
  "tag": ["default"],
  "created": "2018-01-28T00:58:52Z",
  "updated": "2018-01-28T00:58:52Z"
}, {
  "pkg_name": "default",
  "theme": "sphinxdoc",
  "url": "default",
  "tag": ["default"],
  "created": "2018-01-28T00:58:52Z",
  "updated": "2018-01-28T00:58:52Z"
}, {
  "pkg_name": "default",
  "theme": "bizstyle",
  "url": "default",
  "tag": ["default"],
  "created": "2018-01-28T00:58:52Z",
  "updated": "2018-01-28T00:58:52Z"
}, {
  "pkg_name": "default",
  "theme": "traditional",
  "url": "default",
  "tag": ["default"],
  "created": "2018-01-28T00:58:52Z",
  "updated": "2018-01-28T00:58:52Z"
}, {
  "pkg_name": "default",
  "theme": "pyramid",
  "url": "default",
  "tag": ["default"],
  "created": "2018-01-28T00:58:52Z",
  "updated": "2018-01-28T00:58:52Z"
}, {
  "pkg_name": "default",
  "theme": "scrolls",
  "url": "default",
  "tag": ["default"],
  "created": "2018-01-28T00:58:52Z",
  "updated": "2018-01-28T00:58:52Z"
}, {
  "pkg_name": "default",
  "theme": "haiku",
  "url": "default",
  "tag": ["default"],
  "created": "2018-01-28T00:58:52Z",
  "updated": "2018-01-28T00:58:52Z"
}, {
  "pkg_name": "default",
  "theme": "alabaster",
  "url": "default",
  "tag": ["default"],
  "created": "2018-01-28T00:58:52Z",
  "updated": "2018-01-28T00:58:52Z"
}, {
  "pkg_name": "foundation-sphinx-theme",
  "theme": "foundation_sphinx_theme",
  "url": "https://pypi.python.org/pypi/foundation-sphinx-theme",
  "tag": ["foundation-sphinx-theme"],
  "created": "2018-01-29T12:45:45Z",
  "updated": "2018-01-29T12:45:45Z"
}, {
  "pkg_name": "pylons-sphinx-themes",
  "theme": "pylons",
  "url": "https://pypi.python.org/pypi/pylons-sphinx-themes",
  "tag": ["pylons-sphinx-themes"],
  "created": "2018-02-07T12:28:05Z",
  "updated": "2018-02-07T12:28:05Z"
}, {
  "pkg_name": "pylons-sphinx-themes",
  "theme": "pylonsfw",
  "url": "https://pypi.python.org/pypi/pylons-sphinx-themes",
  "tag": ["pylons-sphinx-themes"],
  "created": "2018-02-07T12:29:14Z",
  "updated": "2018-02-07T12:29:14Z"
}, {
  "pkg_name": "pylons-sphinx-themes",
  "theme": "pyramid",
  "url": "https://pypi.python.org/pypi/pylons-sphinx-themes",
  "tag": ["pylons-sphinx-themes"],
  "created": "2018-02-07T12:29:46Z",
  "updated": "2018-02-07T12:29:46Z"
}, {
  "pkg_name": "sphinx_hand_theme",
  "theme": "sphinx_hand_theme",
  "url": "https://pypi.python.org/pypi/sphinx_hand_theme",
  "tag": ["sphinx_hand_theme"],
  "created": "2018-02-14T13:00:08Z",
  "updated": "2018-02-14T13:00:08Z"
}, {
  "pkg_name": "sphinx-rigado-theme",
  "theme": "sphinx_rigado_theme",
  "url": "https://pypi.python.org/pypi/sphinx-rigado-theme",
  "tag": ["sphinx-rigado-theme"],
  "created": "2018-08-07T13:36:42Z",
  "updated": "2018-08-07T13:36:42Z"
}, {
  "pkg_name": "sphinxjp.themes.dotted",
  "theme": "dotted",
  "url": "https://pypi.python.org/pypi/sphinxjp.themes.dotted",
  "tag": ["sphinxjp.themes.dotted"],
  "created": "2018-02-20T14:59:47Z",
  "updated": "2018-02-20T14:59:47Z"
}, {
  "pkg_name": "guzzle_sphinx_theme",
  "theme": "guzzle_sphinx_theme",
  "url": "https://pypi.python.org/pypi/guzzle_sphinx_theme",
  "tag": ["guzzle_sphinx_theme"],
  "created": "2018-01-31T11:38:48Z",
  "updated": "2018-01-31T11:38:48Z"
}, {
  "pkg_name": "groundwork-sphinx-theme",
  "theme": "groundwork",
  "url": "https://pypi.python.org/pypi/groundwork-sphinx-theme",
  "tag": ["groundwork-sphinx-theme"],
  "created": "2018-01-29T12:50:50Z",
  "updated": "2018-01-29T12:50:50Z"
}, {
  "pkg_name": "solar-theme",
  "theme": "solar_theme",
  "url": "https://pypi.python.org/pypi/solar-theme",
  "tag": ["solar-theme"],
  "created": "2018-02-07T13:48:28Z",
  "updated": "2018-02-07T13:48:28Z"
}, {
  "pkg_name": "cakephp_theme",
  "theme": "cakephp_theme",
  "url": "https://pypi.python.org/pypi/cakephp_theme",
  "tag": ["cakephp_theme"],
  "created": "2018-01-28T14:03:51Z",
  "updated": "2018-01-28T14:03:51Z"
}, {
  "pkg_name": "sphinx_minoo_theme",
  "theme": "sphinx_minoo_theme",
  "url": "https://pypi.python.org/pypi/sphinx_minoo_theme",
  "tag": ["sphinx_minoo_theme"],
  "created": "2018-02-20T14:52:35Z",
  "updated": "2018-02-20T14:52:35Z"
}, {
  "pkg_name": "tibas.tt",
  "theme": "tt",
  "url": "https://pypi.python.org/pypi/tibas.tt",
  "tag": ["tibas.tt"],
  "created": "2018-02-20T15:16:18Z",
  "updated": "2018-02-20T15:16:18Z"
}, {
  "pkg_name": "sphinx-ioam-theme",
  "theme": "sphinx_ioam_theme",
  "url": "https://pypi.python.org/pypi/sphinx-ioam-theme",
  "tag": ["sphinx-ioam-theme"],
  "created": "2018-01-31T11:44:49Z",
  "updated": "2018-01-31T11:44:49Z"
}, {
  "pkg_name": "sphinx-kr-theme",
  "theme": "kr",
  "url": "https://pypi.python.org/pypi/sphinx-kr-theme",
  "tag": ["sphinx-kr-theme"],
  "created": "2018-01-31T11:52:01Z",
  "updated": "2018-01-31T11:52:01Z"
}, {
  "pkg_name": "sphinxbootstrap4theme",
  "theme": "sphinxbootstrap4theme",
  "url": "https://pypi.python.org/pypi/sphinxbootstrap4theme",
  "tag": ["sphinxbootstrap4theme"],
  "created": "2018-02-20T14:58:25Z",
  "updated": "2018-02-20T14:58:25Z"
}, {
  "pkg_name": "PSphinxTheme",
  "theme": "p-green",
  "url": "https://pypi.python.org/pypi/PSphinxTheme",
  "tag": ["PSphinxTheme"],
  "created": "2018-02-07T12:12:16Z",
  "updated": "2018-02-07T12:12:16Z"
}, {
  "pkg_name": "PSphinxTheme",
  "theme": "p-greycreme",
  "url": "https://pypi.python.org/pypi/PSphinxTheme",
  "tag": ["PSphinxTheme"],
  "created": "2018-02-07T12:14:38Z",
  "updated": "2018-02-07T12:14:38Z"
}, {
  "pkg_name": "PSphinxTheme",
  "theme": "p-greenblue",
  "url": "https://pypi.python.org/pypi/PSphinxTheme",
  "tag": ["PSphinxTheme"],
  "created": "2018-02-07T12:13:42Z",
  "updated": "2018-02-07T12:13:42Z"
}, {
  "pkg_name": "PSphinxTheme",
  "theme": "p-main_theme",
  "url": "https://pypi.python.org/pypi/PSphinxTheme",
  "tag": ["PSphinxTheme"],
  "created": "2018-02-07T12:15:20Z",
  "updated": "2018-02-07T12:15:20Z"
}, {
  "pkg_name": "PSphinxTheme",
  "theme": "p-red",
  "url": "https://pypi.python.org/pypi/PSphinxTheme",
  "tag": ["PSphinxTheme"],
  "created": "2018-02-07T12:15:59Z",
  "updated": "2018-02-07T12:15:59Z"
}, {
  "pkg_name": "sphinx-better-theme",
  "theme": "better",
  "url": "https://pypi.python.org/pypi/sphinx-better-theme",
  "tag": ["sphinx-better-theme"],
  "created": "2018-01-28T07:04:42Z",
  "updated": "2018-01-28T07:04:42Z"
}, {
  "pkg_name": "hachibee-sphinx-theme",
  "theme": "hachibee",
  "url": "https://pypi.python.org/pypi/hachibee-sphinx-theme",
  "tag": ["hachibee-sphinx-theme"],
  "created": "2018-01-31T11:41:36Z",
  "updated": "2018-01-31T11:41:36Z"
}, {
  "pkg_name": "sphinx-theme",
  "theme": "stanford_theme",
  "url": "https://pypi.python.org/pypi/sphinx-theme",
  "tag": ["sphinx-theme"],
  "created": "2018-08-07T13:31:32Z",
  "updated": "2018-08-07T13:31:32Z"
}, {
  "pkg_name": "sphinx-theme",
  "theme": "neo_rtd_theme",
  "url": "https://pypi.python.org/pypi/sphinx-theme",
  "tag": ["sphinx-theme"],
  "created": "2018-02-07T13:50:55Z",
  "updated": "2018-02-07T13:50:55Z"
}, {
  "pkg_name": "murray",
  "theme": "murray",
  "url": "https://pypi.python.org/pypi/murray",
  "tag": ["murray"],
  "created": "2018-01-28T14:26:39Z",
  "updated": "2018-01-28T14:26:39Z"
}, {
  "pkg_name": "sphinx-foundation-theme",
  "theme": "foundation",
  "url": "https://pypi.python.org/pypi/sphinx-foundation-theme",
  "tag": ["sphinx-foundation-theme"],
  "created": "2018-01-29T12:47:18Z",
  "updated": "2018-01-29T12:47:18Z"
}, {
  "pkg_name": "cloud_sptheme",
  "theme": "cloud",
  "url": "https://pypi.python.org/pypi/cloud_sptheme",
  "tag": ["cloud_sptheme"],
  "created": "2018-01-28T14:11:38Z",
  "updated": "2018-01-28T14:11:38Z"
}, {
  "pkg_name": "sphinx-typlog-theme",
  "theme": "sphinx_typlog_theme",
  "url": "https://pypi.python.org/pypi/sphinx-typlog-theme",
  "tag": ["sphinx-typlog-theme"],
  "created": "2018-02-07T13:57:21Z",
  "updated": "2018-02-07T13:57:21Z"
}, {
  "pkg_name": "sphinxjp.themes.trstyle",
  "theme": "trstyle",
  "url": "https://pypi.python.org/pypi/sphinxjp.themes.trstyle",
  "tag": ["sphinxjp.themes.trstyle"],
  "created": "2018-02-20T15:09:30Z",
  "updated": "2018-02-20T15:09:30Z"
}, {
  "pkg_name": "sphinxjp.themes.revealjs",
  "theme": "revealjs",
  "url": "https://pypi.python.org/pypi/sphinxjp.themes.revealjs",
  "tag": ["sphinxjp.themes.revealjs"],
  "created": "2018-02-20T15:05:08Z",
  "updated": "2018-02-20T15:05:08Z"
}, {
  "pkg_name": "sphinx-ustack-theme",
  "theme": "sphinx_ustack_theme",
  "url": "https://pypi.python.org/pypi/sphinx-ustack-theme",
  "tag": ["sphinx-ustack-theme"],
  "created": "2018-08-07T13:39:00Z",
  "updated": "2018-08-07T13:39:00Z"
}, {
  "pkg_name": "lsst-sphinx-bootstrap-theme",
  "theme": "lsst_sphinx_bootstrap_theme",
  "url": "https://pypi.python.org/pypi/lsst-sphinx-bootstrap-theme",
  "tag": ["lsst-sphinx-bootstrap-theme"],
  "created": "2018-01-28T13:47:18Z",
  "updated": "2018-01-28T13:47:18Z"
}, {
  "pkg_name": "sphinx-redactor-theme",
  "theme": "sphinx_redactor_theme",
  "url": "https://pypi.python.org/pypi/sphinx-redactor-theme",
  "tag": ["sphinx-redactor-theme"],
  "created": "2018-02-07T12:36:02Z",
  "updated": "2018-02-07T12:36:02Z"
}, {
  "pkg_name": "caktus-sphinx-theme",
  "theme": "caktus",
  "url": "https://pypi.python.org/pypi/caktus-sphinx-theme",
  "tag": ["caktus-sphinx-theme"],
  "created": "2018-01-28T14:06:21Z",
  "updated": "2018-01-28T14:06:21Z"
}, {
  "pkg_name": "sphinxjp.themes.htmlslide",
  "theme": "htmlslide",
  "url": "https://pypi.python.org/pypi/sphinxjp.themes.htmlslide",
  "tag": ["sphinxjp.themes.htmlslide"],
  "created": "2018-02-20T15:00:45Z",
  "updated": "2018-02-20T15:00:45Z"
}, {
  "pkg_name": "sphinx-susiai-theme",
  "theme": "sphinx_susiai_theme",
  "url": "https://pypi.python.org/pypi/sphinx-susiai-theme",
  "tag": ["sphinx-susiai-theme"],
  "created": "2018-02-07T13:49:08Z",
  "updated": "2018-02-07T13:49:08Z"
}, {
  "pkg_name": "zerovm-sphinx-theme",
  "theme": "zerovm",
  "url": "https://pypi.python.org/pypi/zerovm-sphinx-theme",
  "tag": ["zerovm-sphinx-theme"],
  "created": "2018-02-07T13:53:20Z",
  "updated": "2018-02-07T13:53:20Z"
}, {
  "pkg_name": "sphinx_rtd_theme",
  "theme": "sphinx_rtd_theme",
  "url": "https://pypi.python.org/pypi/sphinx_rtd_theme",
  "tag": ["sphinx_rtd_theme"],
  "created": "2018-01-28T02:21:19Z",
  "updated": "2018-01-28T02:21:19Z"
}, {
  "pkg_name": "sphinx-pdj-theme",
  "theme": "sphinx_pdj_theme",
  "url": "https://pypi.python.org/pypi/sphinx-pdj-theme",
  "tag": ["sphinx-pdj-theme"],
  "created": "2018-02-07T12:01:19Z",
  "updated": "2018-02-07T12:01:19Z"
}, {
  "pkg_name": "t3SphinxThemeRtd",
  "theme": "t3SphinxThemeRtd",
  "url": "https://pypi.python.org/pypi/t3SphinxThemeRtd",
  "tag": ["t3SphinxThemeRtd"],
  "created": "2018-02-20T15:14:22Z",
  "updated": "2018-02-20T15:14:22Z"
}, {
  "pkg_name": "sphinxcontrib-rextheme",
  "theme": "rex",
  "url": "https://pypi.python.org/pypi/sphinxcontrib-rextheme",
  "tag": ["sphinxcontrib-rextheme"],
  "created": "2018-02-07T13:43:01Z",
  "updated": "2018-02-07T13:43:01Z"
}, {
  "pkg_name": "edx-sphinx-theme",
  "theme": "edx_theme",
  "url": "https://pypi.python.org/pypi/edx-sphinx-theme",
  "tag": ["edx-sphinx-theme"],
  "created": "2018-01-29T12:32:43Z",
  "updated": "2018-01-29T12:32:43Z"
}, {
  "pkg_name": "msmb_theme",
  "theme": "msmb_theme",
  "url": "https://pypi.python.org/pypi/msmb_theme",
  "tag": ["msmb_theme"],
  "created": "2018-01-28T14:32:36Z",
  "updated": "2018-01-28T14:32:36Z"
}, {
  "pkg_name": "mozilla-sphinx-theme",
  "theme": "mozilla",
  "url": "https://pypi.python.org/pypi/mozilla-sphinx-theme",
  "tag": ["mozilla-sphinx-theme"],
  "created": "2018-01-28T14:27:49Z",
  "updated": "2018-01-28T14:27:49Z"
}, {
  "pkg_name": "lsst-dd-rtd-theme",
  "theme": "lsst_dd_rtd_theme",
  "url": "https://pypi.python.org/pypi/lsst-dd-rtd-theme",
  "tag": ["lsst-dd-rtd-theme"],
  "created": "2018-01-29T12:22:39Z",
  "updated": "2018-01-29T12:22:39Z"
}, {
  "pkg_name": "yummy-sphinx-theme",
  "theme": "yummy_sphinx_theme",
  "url": "https://pypi.python.org/pypi/yummy-sphinx-theme",
  "tag": ["yummy-sphinx-theme"],
  "created": "2018-02-07T13:58:48Z",
  "updated": "2018-02-07T13:58:48Z"
}, {
  "pkg_name": "sphinx-guillotina-theme",
  "theme": "guillotina",
  "url": "https://pypi.python.org/pypi/sphinx-guillotina-theme",
  "tag": ["sphinx-guillotina-theme"],
  "created": "2018-01-29T12:54:10Z",
  "updated": "2018-01-29T12:54:10Z"
}, {
  "pkg_name": "rtcat-sphinx-theme",
  "theme": "rtcat_sphinx_theme",
  "url": "https://pypi.python.org/pypi/rtcat-sphinx-theme",
  "tag": ["rtcat-sphinx-theme"],
  "created": "2018-02-07T13:43:57Z",
  "updated": "2018-02-07T13:43:57Z"
}, {
  "pkg_name": "agoraplex.themes.sphinx",
  "theme": "agoraplex",
  "url": "https://pypi.python.org/pypi/agoraplex.themes.sphinx",
  "tag": ["agoraplex.themes.sphinx"],
  "created": "2018-01-28T06:32:00Z",
  "updated": "2018-01-28T06:32:00Z"
}, {
  "pkg_name": "renku-sphinx-theme",
  "theme": "renku",
  "url": "https://pypi.python.org/pypi/renku-sphinx-theme",
  "tag": ["renku-sphinx-theme"],
  "created": "2018-08-07T13:37:57Z",
  "updated": "2018-08-07T13:37:57Z"
}];
},{}],"src/components/Themes.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _Theme = _interopRequireDefault(require("./Theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Themes = function Themes() {
  var sort = function sort(data) {
    return data.sort(function (n1, n2) {
      if (n1.pkg_name > n2.pkg_name) {
        return 1;
      }

      if (n1.pkg_name < n2.pkg_name) {
        return -1;
      }

      return 0;
    });
  };

  var data = require('../../../data/data.json');

  var sorted = sort(data);
  var themes = sorted.map(function (theme) {
    return (0, _preact.h)(_Theme.default, {
      theme: theme
    });
  });
  return (0, _preact.h)("main", {
    role: "main",
    className: "container-fluid"
  }, (0, _preact.h)("div", {
    className: "row"
  }, themes));
};

var _default = Themes;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.umd.js","./Theme":"src/components/Theme.tsx","../../../data/data.json":"../data/data.json"}],"src/components/TopBar.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var TopBar = function TopBar() {
  return (0, _preact.h)("nav", {
    className: "navbar navbar-expand-md navbar-dark bg-dark mb-4"
  }, (0, _preact.h)("a", {
    className: "navbar-brand",
    href: "https://sphinx-themes.org"
  }, "Sphinx Themes"), (0, _preact.h)("div", {
    className: "collapse navbar-collapse",
    id: "navbarCollapse"
  }, (0, _preact.h)("ul", {
    className: "navbar-nav mr-auto"
  }, (0, _preact.h)("li", {
    className: "nav-item dropdown"
  }, (0, _preact.h)("a", {
    className: "nav-link dropdown-toggle",
    href: "#",
    id: "navbarDropdown",
    role: "button",
    "data-toggle": "dropdown",
    "aria-haspopup": "true",
    "aria-expanded": "false"
  }, "Theme"), (0, _preact.h)("div", {
    className: "dropdown-menu",
    "aria-labelledby": "navbarDropdown"
  }, (0, _preact.h)("a", {
    className: "dropdown-item",
    href: "http://www.sphinx-doc.org/en/master/theming.html"
  }, "How to use "), (0, _preact.h)("a", {
    className: "dropdown-item",
    href: "http://www.sphinx-doc.org/en/master/theming.html#creating-themes"
  }, "How to create"), (0, _preact.h)("a", {
    className: "dropdown-item",
    href: "http://www.sphinx-doc.org/en/master/theming.html#distribute-your-theme-as-a-python-package"
  }, "How to upload"))), (0, _preact.h)("li", {
    className: "nav-item"
  }, (0, _preact.h)("a", {
    className: "nav-link",
    href: "https://github.com/sphinx-themes/sphinx-themes.org"
  }, "GitHub")))));
};

var _default = TopBar;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.umd.js"}],"src/components/app.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _Themes = _interopRequireDefault(require("./Themes"));

var _TopBar = _interopRequireDefault(require("./TopBar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App() {
  return (0, _preact.h)("div", null, (0, _preact.h)(_TopBar.default, null), (0, _preact.h)(_Themes.default, null));
};

var _default = App;
exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.umd.js","./Themes":"src/components/Themes.tsx","./TopBar":"src/components/TopBar.tsx"}],"src/index.tsx":[function(require,module,exports) {
"use strict";

var _preact = require("preact");

var _app = _interopRequireDefault(require("./components/app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _preact.render)((0, _preact.h)(_app.default, null), document.querySelector("#root"));
},{"preact":"node_modules/preact/dist/preact.umd.js","./components/app":"src/components/app.tsx"}],"../../../../.nodebrew/node/v10.16.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44247" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../.nodebrew/node/v10.16.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.tsx"], null)
//# sourceMappingURL=/src.fc45d0fd.js.map