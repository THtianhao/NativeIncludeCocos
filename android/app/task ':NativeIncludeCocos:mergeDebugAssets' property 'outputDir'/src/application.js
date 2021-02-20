System.register([], function (_export, _context) {
  "use strict";

  function createApplication({
    loadJsListFile,
    moduleLoader,
    ammoJsFallback,
    loadAmmoJsWasmBinary
  }) {
    /**
     * There are restrictions on some platform that we can not use `System` as System JS global.
     * The well-known platform is Baidu.
     * Baidu uses webpack as their pack tool. Webpack by default recognize and transform
     * `System.import`, `System.register` calls.
     * However Baidu does not provide a mechanism to config webpack.
     * So this HACK comes.
     */
    const System = globalThis.System;

    if (moduleLoader) {
      initializeModuleLoader(System, moduleLoader);
    } // NOTE: before here we shall not import any module!


    let promise = Promise.resolve();
    return promise.then(() => {
      return {
        start,
        ['import']: topLevelImport
      };
    });

    function start({
      findCanvas
    }) {
      let settings;
      let cc;
      return Promise.resolve().then(() => topLevelImport('cc')).then(engine => {
        cc = engine;
        return loadSettingsJson(cc);
      }).then(() => {
        settings = window._CCSettings;
        return initializeGame(cc, settings, findCanvas).then(() => {
          if (settings.scriptPackages) {
            return loadModulePacks(settings.scriptPackages);
          }
        }).then(() => loadJsList(settings.jsList)).then(() => topLevelImport('virtual:///prerequisite-imports:main')).then(() => cc.game.run(() => onGameStarted(cc, settings)));
      });
    }

    function topLevelImport(url) {
      return System.import(url);
    }

    function loadModulePacks(packs) {
      return Promise.all(packs.map(pack => topLevelImport(pack)));
    }

    function loadJsList(jsList) {
      let promise = Promise.resolve();
      jsList.forEach(jsListFile => {
        promise = promise.then(() => loadJsListFile(`src/${jsListFile}`));
      });
      return promise;
    }

    function loadSettingsJson(cc) {
      return new Promise((resolve, reject) => {
        cc.loader.load('./res/settings.2ed9a.json', (err, json) => {
          if (err) {
            return reject(err);
          }

          window._CCSettings = json;
          resolve(json);
        });
      });
    }
  }

  function initializeGame(cc, settings, findCanvas) {
    if (settings.macros) {
      for (let key in settings.macros) {
        cc.macro[key] = settings.macros[key];
      }
    }

    const gameOptions = getGameOptions(settings, findCanvas);
    const success = cc.game.init(gameOptions);
    return success ? Promise.resolve() : Promise.reject();
  }

  function onGameStarted(cc, settings) {
    window._CCSettings = undefined;
    cc.loader.downloader._subpackages = settings.subpackages;
    cc.view.enableRetina(true);
    cc.view.resizeWithBrowserSize(true);
    const launchScene = settings.launchScene; // load scene

    cc.director.loadScene(launchScene, null, function () {
      cc.view.setDesignResolutionSize(1080, 1920, 4);
      cc.loader.onProgress = null;
      console.log(`Success to load scene: ${launchScene}`);
    });
  }

  function getGameOptions(settings, findCanvas) {
    // asset library options
    const assetOptions = {
      libraryPath: 'res/import',
      rawAssetsBase: 'res/raw-',
      rawAssets: settings.rawAssets,
      packedAssets: settings.packedAssets,
      md5AssetsMap: settings.md5AssetsMap,
      subPackages: settings.subpackages
    };
    const options = {
      scenes: settings.scenes,
      debugMode: settings.debug ? 1 : 3,
      // cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
      showFPS: !false && settings.debug,
      frameRate: 60,
      groupList: settings.groupList,
      collisionMatrix: settings.collisionMatrix,
      renderPipeline: settings.renderPipeline,
      adapter: findCanvas('GameCanvas'),
      assetOptions,
      customJointTextureLayouts: settings.customJointTextureLayouts || []
    };
    return options;
  }

  function initializeModuleLoader(System, {
    importMap,
    importMapBaseUrl,
    execMap,
    execNoSchema
  }) {
    const noSchemaPlaceholder = 'no-schema:';
    const systemJsPrototype = System.constructor.prototype;
    const baseUrlSchema = importMapBaseUrl || noSchemaPlaceholder;
    System.patches.setBaseUrl(`${baseUrlSchema}/`);
    System.patches.setImportMap(importMap);

    if (execNoSchema) {
      System.patches.hookInstantiationOverSchema(noSchemaPlaceholder, function (urlNoSchema, firstParentUrl) {
        execNoSchema.call(this, urlNoSchema, firstParentUrl);
        return this.getRegister();
      });
    }

    if (execMap) {
      for (const schema in execMap) {
        const exec = execMap[schema];
        System.patches.hookInstantiationOverSchema(schema, function (urlNoSchema, firstParentUrl) {
          exec.call(this, urlNoSchema, firstParentUrl);
          return this.getRegister();
        });
      }
    }
  }

  _export("createApplication", createApplication);

  return {
    setters: [],
    execute: function () {}
  };
});