(function (exports) {
  const hasSelf = typeof self !== 'undefined';

  const hasDocument = typeof document !== 'undefined';

  const envGlobal = hasSelf ? self : global;

  let baseUrl;

  if (hasDocument) {
    const baseEl = document.querySelector('base[href]');
    if (baseEl)
      baseUrl = baseEl.href;
  }

  if (!baseUrl && typeof location !== 'undefined') {
    baseUrl = location.href.split('#')[0].split('?')[0];
    const lastSepIndex = baseUrl.lastIndexOf('/');
    if (lastSepIndex !== -1)
      baseUrl = baseUrl.slice(0, lastSepIndex + 1);
  }

  const backslashRegEx = /\\/g;
  function resolveIfNotPlainOrUrl (relUrl, parentUrl) {
    if (relUrl.indexOf('\\') !== -1)
      relUrl = relUrl.replace(backslashRegEx, '/');
    // protocol-relative
    if (relUrl[0] === '/' && relUrl[1] === '/') {
      return parentUrl.slice(0, parentUrl.indexOf(':') + 1) + relUrl;
    }
    // relative-url
    else if (relUrl[0] === '.' && (relUrl[1] === '/' || relUrl[1] === '.' && (relUrl[2] === '/' || relUrl.length === 2 && (relUrl += '/')) ||
        relUrl.length === 1  && (relUrl += '/')) ||
        relUrl[0] === '/') {
      const parentProtocol = parentUrl.slice(0, parentUrl.indexOf(':') + 1);
      // Disabled, but these cases will give inconsistent results for deep backtracking
      //if (parentUrl[parentProtocol.length] !== '/')
      //  throw Error('Cannot resolve');
      // read pathname from parent URL
      // pathname taken to be part after leading "/"
      let pathname;
      if (parentUrl[parentProtocol.length + 1] === '/') {
        // resolving to a :// so we need to read out the auth and host
        if (parentProtocol !== 'file:') {
          pathname = parentUrl.slice(parentProtocol.length + 2);
          pathname = pathname.slice(pathname.indexOf('/') + 1);
        }
        else {
          pathname = parentUrl.slice(8);
        }
      }
      else {
        // resolving to :/ so pathname is the /... part
        pathname = parentUrl.slice(parentProtocol.length + (parentUrl[parentProtocol.length] === '/'));
      }

      if (relUrl[0] === '/')
        return parentUrl.slice(0, parentUrl.length - pathname.length - 1) + relUrl;

      // join together and split for removal of .. and . segments
      // looping the string instead of anything fancy for perf reasons
      // '../../../../../z' resolved to 'x/y' is just 'z'
      const segmented = pathname.slice(0, pathname.lastIndexOf('/') + 1) + relUrl;

      const output = [];
      let segmentIndex = -1;
      for (let i = 0; i < segmented.length; i++) {
        // busy reading a segment - only terminate on '/'
        if (segmentIndex !== -1) {
          if (segmented[i] === '/') {
            output.push(segmented.slice(segmentIndex, i + 1));
            segmentIndex = -1;
          }
        }

        // new segment - check if it is relative
        else if (segmented[i] === '.') {
          // ../ segment
          if (segmented[i + 1] === '.' && (segmented[i + 2] === '/' || i + 2 === segmented.length)) {
            output.pop();
            i += 2;
          }
          // ./ segment
          else if (segmented[i + 1] === '/' || i + 1 === segmented.length) {
            i += 1;
          }
          else {
            // the start of a new segment as below
            segmentIndex = i;
          }
        }
        // it is the start of a new segment
        else {
          segmentIndex = i;
        }
      }
      // finish reading out the last segment
      if (segmentIndex !== -1)
        output.push(segmented.slice(segmentIndex));
      return parentUrl.slice(0, parentUrl.length - pathname.length) + output.join('');
    }
  }

  /*
   * Import maps implementation
   *
   * To make lookups fast we pre-resolve the entire import map
   * and then match based on backtracked hash lookups
   *
   */

  function resolveUrl (relUrl, parentUrl) {
    return resolveIfNotPlainOrUrl(relUrl, parentUrl) || (relUrl.indexOf(':') !== -1 ? relUrl : resolveIfNotPlainOrUrl('./' + relUrl, parentUrl));
  }

  function objectAssign (to, from) {
    for (let p in from)
      to[p] = from[p];
    return to;
  }

  function resolveAndComposePackages (packages, outPackages, baseUrl, parentMap, parentUrl) {
    for (let p in packages) {
      const resolvedLhs = resolveIfNotPlainOrUrl(p, baseUrl) || p;
      const rhs = packages[p];
      // package fallbacks not currently supported
      if (typeof rhs !== 'string')
        continue;
      const mapped = resolveImportMap(parentMap, resolveIfNotPlainOrUrl(rhs, baseUrl) || rhs, parentUrl);
      if (!mapped)
        targetWarning(p, rhs, 'bare specifier did not resolve');
      else
        outPackages[resolvedLhs] = mapped;
    }
  }

  function resolveAndComposeImportMap (json, baseUrl, parentMap) {
    const outMap = { imports: objectAssign({}, parentMap.imports), scopes: objectAssign({}, parentMap.scopes) };

    if (json.imports)
      resolveAndComposePackages(json.imports, outMap.imports, baseUrl, parentMap, null);

    if (json.scopes)
      for (let s in json.scopes) {
        const resolvedScope = resolveUrl(s, baseUrl);
        resolveAndComposePackages(json.scopes[s], outMap.scopes[resolvedScope] || (outMap.scopes[resolvedScope] = {}), baseUrl, parentMap, resolvedScope);
      }

    return outMap;
  }

  function getMatch (path, matchObj) {
    if (matchObj[path])
      return path;
    let sepIndex = path.length;
    do {
      const segment = path.slice(0, sepIndex + 1);
      if (segment in matchObj)
        return segment;
    } while ((sepIndex = path.lastIndexOf('/', sepIndex - 1)) !== -1)
  }

  function applyPackages (id, packages) {
    const pkgName = getMatch(id, packages);
    if (pkgName) {
      const pkg = packages[pkgName];
      if (pkg === null) return;
      if (id.length > pkgName.length && pkg[pkg.length - 1] !== '/')
        targetWarning(pkgName, pkg, "should have a trailing '/'");
      else
        return pkg + id.slice(pkgName.length);
    }
  }

  function targetWarning (match, target, msg) {
    console.warn("Package target " + msg + ", resolving target '" + target + "' for " + match);
  }

  function resolveImportMap (importMap, resolvedOrPlain, parentUrl) {
    let scopeUrl = parentUrl && getMatch(parentUrl, importMap.scopes);
    while (scopeUrl) {
      const packageResolution = applyPackages(resolvedOrPlain, importMap.scopes[scopeUrl]);
      if (packageResolution)
        return packageResolution;
      scopeUrl = getMatch(scopeUrl.slice(0, scopeUrl.lastIndexOf('/')), importMap.scopes);
    }
    return applyPackages(resolvedOrPlain, importMap.imports) || resolvedOrPlain.indexOf(':') !== -1 && resolvedOrPlain;
  }

  /*
   * SystemJS Core
   * 
   * Provides
   * - System.import
   * - System.register support for
   *     live bindings, function hoisting through circular references,
   *     reexports, dynamic import, import.meta.url, top-level await
   * - System.getRegister to get the registration
   * - Symbol.toStringTag support in Module objects
   * - Hookable System.createContext to customize import.meta
   * - System.onload(err, id, deps) handler for tracing / hot-reloading
   * 
   * Core comes with no System.prototype.resolve or
   * System.prototype.instantiate implementations
   */

  const hasSymbol = typeof Symbol !== 'undefined';
  const toStringTag = hasSymbol && Symbol.toStringTag;
  const REGISTRY = hasSymbol ? Symbol() : '@';

  function SystemJS () {
    this[REGISTRY] = {};
  }

  const systemJSPrototype = SystemJS.prototype;

  systemJSPrototype.prepareImport = function () {};

  systemJSPrototype.import = function (id, parentUrl) {
    const loader = this;
    return Promise.resolve(loader.prepareImport())
    .then(function() {
      return loader.resolve(id, parentUrl);
    })
    .then(function (id) {
      const load = getOrCreateLoad(loader, id);
      return load.C || topLevelLoad(loader, load);
    });
  };

  // Hookable createContext function -> allowing eg custom import meta
  systemJSPrototype.createContext = function (parentId) {
    return {
      url: parentId
    };
  };
  function loadToId (load) {
    return load.id;
  }
  function triggerOnload (loader, load, err) {
    loader.onload(err, load.id, load.d && load.d.map(loadToId));
    if (err)
      throw err;
  }

  let lastRegister;
  systemJSPrototype.register = function (deps, declare) {
    lastRegister = [deps, declare];
  };

  /*
   * getRegister provides the last anonymous System.register call
   */
  systemJSPrototype.getRegister = function () {
    const _lastRegister = lastRegister;
    lastRegister = undefined;
    return _lastRegister;
  };

  function getOrCreateLoad (loader, id, firstParentUrl) {
    let load = loader[REGISTRY][id];
    if (load)
      return load;

    const importerSetters = [];
    const ns = Object.create(null);
    if (toStringTag)
      Object.defineProperty(ns, toStringTag, { value: 'Module' });
    
    let instantiatePromise = Promise.resolve()
    .then(function () {
      return loader.instantiate(id, firstParentUrl);
    })
    .then(function (registration) {
      if (!registration)
        throw Error('Module ' + id + ' did not instantiate');
      function _export (name, value) {
        // note if we have hoisted exports (including reexports)
        load.h = true;
        let changed = false;
        if (typeof name !== 'object') {
          if (!(name in ns) || ns[name] !== value) {
            ns[name] = value;
            changed = true;
          }
        }
        else {
          for (let p in name) {
            let value = name[p];
            if (!(p in ns) || ns[p] !== value) {
              ns[p] = value;
              changed = true;
            }
          }

          if (name.__esModule) {
            ns.__esModule = name.__esModule;
          }
        }
        if (changed)
          for (let i = 0; i < importerSetters.length; i++)
            importerSetters[i](ns);
        return value;
      }
      const declared = registration[1](_export, registration[1].length === 2 ? {
        import: function (importId) {
          return loader.import(importId, id);
        },
        meta: loader.createContext(id)
      } : undefined);
      load.e = declared.execute || function () {};
      return [registration[0], declared.setters || []];
    });

    const linkPromise = instantiatePromise
    .then(function (instantiation) {
      return Promise.all(instantiation[0].map(function (dep, i) {
        const setter = instantiation[1][i];
        return Promise.resolve(loader.resolve(dep, id))
        .then(function (depId) {
          const depLoad = getOrCreateLoad(loader, depId, id);
          // depLoad.I may be undefined for already-evaluated
          return Promise.resolve(depLoad.I)
          .then(function () {
            if (setter) {
              depLoad.i.push(setter);
              // only run early setters when there are hoisted exports of that module
              // the timing works here as pending hoisted export calls will trigger through importerSetters
              if (depLoad.h || !depLoad.I)
                setter(depLoad.n);
            }
            return depLoad;
          });
        })
      }))
      .then(function (depLoads) {
        load.d = depLoads;
      });
    });

    linkPromise.catch(function (err) {
      load.e = null;
      load.er = err;
    });

    // Capital letter = a promise function
    return load = loader[REGISTRY][id] = {
      id: id,
      // importerSetters, the setters functions registered to this dependency
      // we retain this to add more later
      i: importerSetters,
      // module namespace object
      n: ns,

      // instantiate
      I: instantiatePromise,
      // link
      L: linkPromise,
      // whether it has hoisted exports
      h: false,

      // On instantiate completion we have populated:
      // dependency load records
      d: undefined,
      // execution function
      // set to NULL immediately after execution (or on any failure) to indicate execution has happened
      // in such a case, C should be used, and E, I, L will be emptied
      e: undefined,

      // On execution we have populated:
      // the execution error if any
      er: undefined,
      // in the case of TLA, the execution promise
      E: undefined,

      // On execution, L, I, E cleared

      // Promise for top-level completion
      C: undefined
    };
  }

  function instantiateAll (loader, load, loaded) {
    if (!loaded[load.id]) {
      loaded[load.id] = true;
      // load.L may be undefined for already-instantiated
      return Promise.resolve(load.L)
      .then(function () {
        return Promise.all(load.d.map(function (dep) {
          return instantiateAll(loader, dep, loaded);
        }));
      })
    }
  }

  function topLevelLoad (loader, load) {
    return load.C = instantiateAll(loader, load, {})
    .then(function () {
      return postOrderExec(loader, load, {});
    })
    .then(function () {
      return load.n;
    });
  }

  // the closest we can get to call(undefined)
  const nullContext = Object.freeze(Object.create(null));

  // returns a promise if and only if a top-level await subgraph
  // throws on sync errors
  function postOrderExec (loader, load, seen) {
    if (seen[load.id])
      return;
    seen[load.id] = true;

    if (!load.e) {
      if (load.er)
        throw load.er;
      if (load.E)
        return load.E;
      return;
    }

    // deps execute first, unless circular
    let depLoadPromises;
    load.d.forEach(function (depLoad) {
      {
        const depLoadPromise = postOrderExec(loader, depLoad, seen);
        if (depLoadPromise)
          (depLoadPromises = depLoadPromises || []).push(depLoadPromise);
      }
    });
    if (depLoadPromises)
      return Promise.all(depLoadPromises).then(doExec);

    return doExec();

    function doExec () {
      try {
        let execPromise = load.e.call(nullContext);
        if (execPromise) {
          if (false)
            execPromise = execPromise.then(function () {
              load.C = load.n;
              load.E = null; // indicates completion
              triggerOnload(loader, load, null);
            }, function (err) {
              triggerOnload(loader, load, err);
            });
          else
            execPromise = execPromise.then(function () {
              load.C = load.n;
              load.E = null;
            });
          return load.E = load.E || execPromise;
        }
        // (should be a promise, but a minify optimization to leave out Promise.resolve)
        load.C = load.n;
        if (false) triggerOnload(loader, load, null);
      }
      catch (err) {
        load.er = err;
        throw err;
      }
      finally {
        load.L = load.I = undefined;
        load.e = null;
      }
    }
  }

  envGlobal.System = new SystemJS();

  systemJSPrototype.instantiate = function (url, firstParentUrl) {
      throw new Error("You are now allowed to instantiate module " + url + " from " + firstParentUrl);
  };

  let patchedBaseUrl = baseUrl;

  function setBaseUrl (url) {
      patchedBaseUrl = url;
  }

  const emptyImportMap = { imports: {}, scopes: {} };

  let importMap = { imports: {}, scopes: {} };

  function setImportMap (json, location) {
      importMap = resolveAndComposeImportMap(json, location || patchedBaseUrl, emptyImportMap);
  }
  systemJSPrototype.resolve = function (id, parentUrl) {
      parentUrl = parentUrl || patchedBaseUrl;
      return resolveImportMap(importMap, resolveIfNotPlainOrUrl(id, parentUrl) || id, parentUrl) || throwUnresolved(id, parentUrl);
  };

  function throwUnresolved (id, parentUrl) {
      throw Error("Unable to resolve specifier '" + id + (parentUrl ? "' from " + parentUrl : "'"));
  }

  function hookInstantiationOverSchema(schema, hook) {
      const venderInstantiate = systemJSPrototype.instantiate;
      systemJSPrototype.instantiate = function (url, firstParentUrl) {
          const schemaErased = url.substr(0, schema.length) === schema ?
              url.substr(schema.length) : null;
          return schemaErased === null ?
              venderInstantiate.call(this, url, firstParentUrl) :
              hook.call(this, schemaErased, firstParentUrl);
      };
  }

  const patches = {
      setBaseUrl,
      setImportMap,
      hookInstantiationOverSchema,
  };

  systemJSPrototype.patches = patches;

  /*
   * SystemJS named register extension
   * Supports System.register('name', [..deps..], function (_export, _context) { ... })
   * 
   * Names are written to the registry as-is
   * System.register('x', ...) can be imported as System.import('x')
   */
  (function (global) {
    const System = global.System;
    setRegisterRegistry(System);
    const systemJSPrototype = System.constructor.prototype;
    const constructor = System.constructor;
    const SystemJS = function () {
      constructor.call(this);
      setRegisterRegistry(this);
    };
    SystemJS.prototype = systemJSPrototype;
    System.constructor = SystemJS;

    let firstNamedDefine;

    function setRegisterRegistry(systemInstance) {
      systemInstance.registerRegistry = Object.create(null);
    }

    const register = systemJSPrototype.register;
    systemJSPrototype.register = function (name, deps, declare) {
      if (typeof name !== 'string')
        return register.apply(this, arguments);
      const define = [deps, declare];
      this.registerRegistry[name] = define;
      if (!firstNamedDefine) {
        firstNamedDefine = define;
        Promise.resolve().then(function () {
          firstNamedDefine = null;
        });
      }
      return register.apply(this, arguments);
    };

    const resolve = systemJSPrototype.resolve;
    systemJSPrototype.resolve = function (id, parentURL) {
      try {
        // Prefer import map (or other existing) resolution over the registerRegistry
        return resolve.call(this, id, parentURL);
      } catch (err) {
        if (id in this.registerRegistry) {
          return id;
        }
        throw err;
      }
    };

    const instantiate = systemJSPrototype.instantiate;
    systemJSPrototype.instantiate = function (url, firstParentUrl) {
      const result = this.registerRegistry[url];
      if (result) {
        this.registerRegistry[url] = null;
        return result;
      } else {
        return instantiate.call(this, url, firstParentUrl);
      }
    };

    const getRegister = systemJSPrototype.getRegister;
    systemJSPrototype.getRegister = function () {
      // Calling getRegister() because other extras need to know it was called so they can perform side effects
      const register = getRegister.call(this);

      const result = firstNamedDefine || register;
      firstNamedDefine = null;
      return result;
    };
  })(typeof self !== 'undefined' ? self : global);

  exports.REGISTRY = REGISTRY;
  exports.patches = patches;
  exports.systemJSPrototype = systemJSPrototype;

  return exports;

}({}));
