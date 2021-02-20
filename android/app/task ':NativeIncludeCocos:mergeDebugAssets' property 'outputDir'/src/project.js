System.register([], function(_export, _context) { return { execute: function () {
System.register("chunks:///ball/common/scripts/AxisHelper.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Component, loader, Prefab, instantiate, _dec, _dec2, _class, _class2, _temp, ccclass, property, menu, AxisHelper;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      loader = _cc.loader;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
    }],
    execute: function () {
      cclegacy._RF.push({}, "5bb94205NtNprcLIythUQv4", "AxisHelper", undefined);

      ({
        ccclass,
        property,
        menu
      } = _decorator);

      _export("AxisHelper", AxisHelper = (_dec = ccclass('COMMON.AxisHelper'), _dec2 = menu('common/AxisHelper'), _dec(_class = _dec2(_class = (_temp = _class2 = class AxisHelper extends Component {
        constructor(...args) {
          super(...args);
          this._ins = null;
        }

        __preload() {
          if (AxisHelper._axis == null) {
            loader.loadRes('common/prefabs/Axis', Prefab, (...args) => {
              if (args) {
                if (args[0]) {
                  console.error(args[0]);
                } else {
                  AxisHelper._axis = args[1];

                  AxisHelper._insArr.forEach(v => {
                    if (!v._ins && v.enabled && v.enabledInHierarchy && v.node.active && v.node.activeInHierarchy) v.onEnable();
                  });
                }
              }
            });
          }
        }

        onLoad() {
          AxisHelper._insArr.push(this);
        }

        onEnable() {
          if (AxisHelper._axis) {
            if (this._ins == null) this._ins = instantiate(AxisHelper._axis);
            this.node.addChild(this._ins);
          }
        }

        onDisable() {
          if (AxisHelper._axis) {
            this.node.removeChild(this._ins);
          }
        }

        onDestroy() {
          const index = AxisHelper._insArr.indexOf(this);

          if (index >= 0) {
            AxisHelper._insArr.splice(index, 1);
          }

          if (this._ins) {
            this._ins.destroy();
          }
        }

      }, _class2._axis = null, _class2._insArr = [], _temp)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/common/scripts/ContactPointHelper.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Component, loader, Prefab, Node, game, ColliderComponent, Vec3, instantiate, _dec, _dec2, _class, _class2, _temp, ccclass, property, menu, ContactPointHelper;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      loader = _cc.loader;
      Prefab = _cc.Prefab;
      Node = _cc.Node;
      game = _cc.game;
      ColliderComponent = _cc.ColliderComponent;
      Vec3 = _cc.Vec3;
      instantiate = _cc.instantiate;
    }],
    execute: function () {
      cclegacy._RF.push({}, "276fcld+b5O8qjGJZTPQFke", "ContactPointHelper", undefined);

      ({
        ccclass,
        property,
        menu
      } = _decorator);

      _export("ContactPointHelper", ContactPointHelper = (_dec = ccclass('COMMON.ContactPointHelper'), _dec2 = menu('common/ContactPointHelper'), _dec(_class = _dec2(_class = (_temp = _class2 = class ContactPointHelper extends Component {
        constructor(...args) {
          super(...args);
          this._entityMap = new Map();
        }

        __preload() {
          if (ContactPointHelper._point == null && !(ContactPointHelper._flag & 1)) {
            ContactPointHelper._flag |= 1 << 0;
            loader.loadRes('common/prefabs/Point', Prefab, (...args) => {
              if (args) {
                if (args[0]) {
                  console.error(args[0]);
                } else {
                  ContactPointHelper._point = args[1];
                }
              }
            });
          }

          if (ContactPointHelper._arrow == null && !(ContactPointHelper._flag & 1 << 1)) {
            ContactPointHelper._flag |= 1 << 1;
            loader.loadRes('common/prefabs/Arrow', Prefab, (...args) => {
              if (args) {
                if (args[0]) {
                  console.error(args[0]);
                } else {
                  ContactPointHelper._arrow = args[1];
                }
              }
            });
          }

          if (ContactPointHelper._container == null) {
            ContactPointHelper._container = new Node('__CONTACT_POINT__');
            game.addPersistRootNode(ContactPointHelper._container);
          }
        }

        onLoad() {
          ContactPointHelper._insArr.push(this);
        }

        onEnable() {
          const colliders = this.getComponents(ColliderComponent);
          const that = this;
          colliders.forEach(e => {
            e.on('onCollisionEnter', that.onCollision, that);
            e.on('onCollisionStay', that.onCollision, that);
            e.on('onCollisionExit', that.onCollision, that);
          });
        }

        onDisable() {
          const colliders = this.getComponents(ColliderComponent);
          const that = this;
          colliders.forEach(e => {
            e.off('onCollisionEnter', that.onCollision, that);
            e.off('onCollisionStay', that.onCollision, that);
            e.off('onCollisionExit', that.onCollision, that);
          });
        }

        onCollision(event) {
          if (ContactPointHelper._point && ContactPointHelper._arrow) {
            if (!this._entityMap.has(event.otherCollider.uuid)) this._entityMap.set(event.otherCollider.uuid, {
              pt: [],
              aw: []
            });

            const map = this._entityMap.get(event.otherCollider.uuid);

            map.pt.forEach(e => {
              e.active = false;
            });
            map.aw.forEach(e => {
              e.active = false;
            });
            event.contacts.forEach((e, i) => {
              const wpb = new Vec3();
              e.getWorldPointOnB(wpb);
              const wnb = new Vec3();
              e.getWorldNormalOnB(wnb);
              let pt, aw;

              if (map.pt.length > i) {
                pt = map.pt[i];
                aw = map.aw[i];
                pt.active = true;
                aw.active = true;
              } else {
                pt = instantiate(ContactPointHelper._point);
                pt.setWorldScale(0.25, 0.25, 0.25);
                pt.setParent(ContactPointHelper._container);
                aw = instantiate(ContactPointHelper._arrow);
                aw.setParent(ContactPointHelper._container);
                map.pt.push(pt);
                map.aw.push(aw);
              }

              pt.setWorldPosition(wpb);
              aw.setWorldPosition(wpb);
              aw.forward = wnb;
            });
          }
        }

        onDestroy() {
          const index = ContactPointHelper._insArr.indexOf(this);

          if (index >= 0) {
            ContactPointHelper._insArr.splice(index, 1);
          }

          this._entityMap.forEach(e => {
            e.pt.forEach(t => {
              t.removeFromParent();
              t.destroy();
            });
            e.aw.forEach(b => {
              b.removeFromParent();
              b.destroy();
            });
          });
        }

      }, _class2._point = null, _class2._arrow = null, _class2._flag = 0, _class2._insArr = [], _class2._container = null, _temp)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/common/scripts/EmitBullet.js", ["cc", "../../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, CameraComponent, Primitive, _decorator, Component, Node, Material, GFXBlendFactor, Color, ModelComponent, RigidBodyComponent, BoxColliderComponent, SphereColliderComponent, CylinderColliderComponent, Vec3, CapsuleColliderComponent, ConeColliderComponent, systemEvent, SystemEventType, instantiate, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp, ccclass, property, menu, requireComponent, EmitBullet;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _dec4: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      CameraComponent = _cc.CameraComponent;
      Primitive = _cc.Primitive;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Material = _cc.Material;
      GFXBlendFactor = _cc.GFXBlendFactor;
      Color = _cc.Color;
      ModelComponent = _cc.ModelComponent;
      RigidBodyComponent = _cc.RigidBodyComponent;
      BoxColliderComponent = _cc.BoxColliderComponent;
      SphereColliderComponent = _cc.SphereColliderComponent;
      CylinderColliderComponent = _cc.CylinderColliderComponent;
      Vec3 = _cc.Vec3;
      CapsuleColliderComponent = _cc.CapsuleColliderComponent;
      ConeColliderComponent = _cc.ConeColliderComponent;
      systemEvent = _cc.systemEvent;
      SystemEventType = _cc.SystemEventType;
      instantiate = _cc.instantiate;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e2af1jhYTtNYY8Oy2cpaOfi", "EmitBullet", undefined);

      ({
        ccclass,
        property,
        menu,
        requireComponent
      } = _decorator);

      _export("EmitBullet", EmitBullet = (_dec = ccclass('COMMON.EmitBullet'), _dec2 = menu('common/EmitBullet'), _dec3 = requireComponent(CameraComponent), _dec4 = property({
        type: Primitive.PrimitiveType
      }), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = (_temp = class EmitBullet extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "primitiveMesh", _descriptor, this);

          _initializerDefineProperty(this, "strength", _descriptor2, this);

          this._mesh = null;
          this._material = null;
          this._container = null;
          this._bullet = null;
        }

        onLoad() {
          this._container = new Node('__EMIT_BULLET__');

          this._container.setParent(this.node.scene);

          this._material = new Material();

          this._material.initialize({
            'effectName': 'builtin-standard',
            // 'technique': 1, // Only pre-generated resources can be used
            'states': {
              'blendState': {
                'targets': [{
                  'blend': true,
                  // 'blendSrc': GFXBlendFactor.SRC_COLOR,
                  // 'blendDst': GFXBlendFactor.DST_COLOR,
                  // // 'blendEq': GFXBlendOp.ADD,
                  'blendSrc': GFXBlendFactor.SRC_ALPHA,
                  'blendDst': GFXBlendFactor.ONE_MINUS_SRC_ALPHA,
                  'blendSrcAlpha': GFXBlendFactor.SRC_ALPHA,
                  'blendDstAlpha': GFXBlendFactor.ONE_MINUS_SRC_ALPHA // 'blendAlphaEq': GFXBlendOp.ADD,

                }]
              }
            }
          });

          this._material.setProperty('mainColor', new Color(255, 255, 255, 128));

          this._mesh = new Primitive(this.primitiveMesh);

          this._mesh.onLoaded();

          this._bullet = new Node('bullet');

          const modelCom = this._bullet.addComponent(ModelComponent);

          modelCom.mesh = this._mesh;
          modelCom.material = this._material;

          this._bullet.setWorldScale(0.25, 0.25, 0.25);

          this._bullet.addComponent(RigidBodyComponent);

          switch (this.primitiveMesh) {
            case Primitive.PrimitiveType.BOX:
              this._bullet.addComponent(BoxColliderComponent);

              break;

            case Primitive.PrimitiveType.SPHERE:
              this._bullet.addComponent(SphereColliderComponent);

              break;

            case Primitive.PrimitiveType.CAPSULE:
              if (window.CC_PHYSICS_CANNON) {
                this._bullet.addComponent(CylinderColliderComponent);

                const s1 = this._bullet.addComponent(SphereColliderComponent);

                s1.center = new Vec3(0, 0.5, 0);

                const s2 = this._bullet.addComponent(SphereColliderComponent);

                s2.center = new Vec3(0, -0.5, 0);
              } else {
                this._bullet.addComponent(CapsuleColliderComponent);
              }

              break;

            case Primitive.PrimitiveType.CYLINDER:
              this._bullet.addComponent(CylinderColliderComponent);

              break;

            case Primitive.PrimitiveType.CONE:
              this._bullet.addComponent(ConeColliderComponent);

              break;

            default:
              console.error("Unsupported collider type:", Primitive.PrimitiveType[this.primitiveMesh]);
              break;
          }
        }

        onEnable() {
          systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        }

        onDisable() {
          systemEvent.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
        }

        onTouchStart(touch, event) {
          const cameraCom = this.getComponent(CameraComponent);
          const sp = touch.getLocation();
          const pos = new Vec3(sp.x, sp.y, 1);
          const target = cameraCom.screenToWorld(pos);
          const dir = Vec3.subtract(new Vec3(), target, this.node.worldPosition).normalize();
          dir.multiplyScalar(this.strength);
          const bullet = instantiate(this._bullet);
          bullet.setParent(this._container);
          bullet.setWorldPosition(this.node.worldPosition);
          bullet.getComponent(RigidBodyComponent).applyForce(dir);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "primitiveMesh", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return Primitive.PrimitiveType.BOX;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "strength", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10000;
        }
      })), _class2)) || _class) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/common/scripts/PrefabPoolUtil.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, instantiate, isValid, PrefabPoolUtil;
  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      instantiate = _cc.instantiate;
      isValid = _cc.isValid;
    }],
    execute: function () {
      cclegacy._RF.push({}, "6078fs+sHhJSKOISPFj4Cbe", "PrefabPoolUtil", undefined);

      _export("PrefabPoolUtil", PrefabPoolUtil = class PrefabPoolUtil {
        /**
         * get a entity with pool name
         * @param poolName the pool name
         * @param time  optional, the time when recover, in seconds
         */
        static getItemByPoolName(poolName, prefab, time) {
          if (this._pool[poolName] == null) {
            this._pool[poolName] = [];
          }

          const pool = this._pool[poolName];
          let node = null;

          if (pool.length > 0) {
            node = pool.pop();
          } else {
            node = instantiate(prefab);
          }

          if (time != null) {
            // delay recover node with pool name
            setTimeout(() => {
              if (isValid(node)) {
                node.parent = null;
                this.recoverItemByPoolName(poolName, node);
              }
            }, time * 1000);
          }

          return node;
        }
        /**
         * recover a entity with pool name
         * @param poolName the pool name
         * @param entity  the node need to recover
         */


        static recoverItemByPoolName(poolName, entity, removeFromParent) {
          if (this._pool == null) return;
          const pool = this._pool[poolName];
          let index = pool.indexOf(entity);

          if (index == -1) {
            if (removeFromParent) entity.removeFromParent();
            pool.push(entity);
          }
        }

        static clear(poolName) {
          delete this._pool[poolName];
        }

      });

      PrefabPoolUtil._pool = {};

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/common/scripts/ProfilerManager.js", ["cc", "../../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Component, profiler, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _class, _class2, _descriptor, _temp, ccclass, property, menu, state, ProfilerManager;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      profiler = _cc.profiler;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8a04b7+e2FBEauumObLwYe5", "ProfilerManager", undefined);

      ({
        ccclass,
        property,
        menu
      } = _decorator);
      state = false;

      _export("ProfilerManager", ProfilerManager = (_dec = ccclass('COMMON.ProfilerManager'), _dec2 = menu('common/ProfilerManager'), _dec(_class = _dec2(_class = (_class2 = (_temp = class ProfilerManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "show", _descriptor, this);
        }

        onLoad() {
          if (profiler) {
            state = profiler.isShowingStats();
            if (!state && this.show) profiler.showStats();
          }
        }

        onDestroy() {
          if (profiler) {
            state ? profiler.showStats() : profiler.hideStats();
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "show", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/common/scripts/RaycastHelper.js", ["cc", "../../../_virtual/_rollupPluginBabelHelpers.js", "./PrefabPoolUtil.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Enum, macro, CameraComponent, Node, _decorator, Component, loader, Prefab, game, systemEvent, SystemEventType, geometry, PhysicsSystem, _applyDecoratedDescriptor, _initializerDefineProperty, PrefabPoolUtil, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3, _temp, ccclass, property, menu, ERaycastType, EKey, RaycastHelper;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _dec4: void 0,
    _dec5: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _descriptor4: void 0,
    _class3: void 0,
    _temp: void 0,
    ERaycastType: void 0,
    EKey: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Enum = _cc.Enum;
      macro = _cc.macro;
      CameraComponent = _cc.CameraComponent;
      Node = _cc.Node;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      loader = _cc.loader;
      Prefab = _cc.Prefab;
      game = _cc.game;
      systemEvent = _cc.systemEvent;
      SystemEventType = _cc.SystemEventType;
      geometry = _cc.geometry;
      PhysicsSystem = _cc.PhysicsSystem;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }, function (_PrefabPoolUtilJs) {
      PrefabPoolUtil = _PrefabPoolUtilJs.PrefabPoolUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a163eLNbxxF7bPN51H30RV1", "RaycastHelper", undefined);

      ({
        ccclass,
        property,
        menu
      } = _decorator);

      (function (ERaycastType) {
        ERaycastType[ERaycastType["ALL"] = 0] = "ALL";
        ERaycastType[ERaycastType["CLOSEST"] = 1] = "CLOSEST";
      })(ERaycastType || (ERaycastType = {}));

      Enum(ERaycastType);

      (function (EKey) {
        EKey[EKey["r"] = macro.KEY.r] = "r";
        EKey[EKey["g"] = macro.KEY.g] = "g";
        EKey[EKey["b"] = macro.KEY.b] = "b";
      })(EKey || (EKey = {}));

      Enum(EKey);

      _export("RaycastHelper", RaycastHelper = (_dec = ccclass('COMMON.RaycastHelper'), _dec2 = menu('common/RaycastHelper'), _dec3 = property({
        type: CameraComponent
      }), _dec4 = property({
        type: ERaycastType
      }), _dec5 = property({
        type: EKey,
        tooltip: "开关，控制全局"
      }), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = class RaycastHelper extends Component {
        constructor(...args) {
          super(...args);
          this._cache = [];

          _initializerDefineProperty(this, "cameraCom", _descriptor, this);

          _initializerDefineProperty(this, "raycastType", _descriptor2, this);

          _initializerDefineProperty(this, "switch", _descriptor3, this);

          _initializerDefineProperty(this, "scale", _descriptor4, this);
        }

        __preload() {
          if (RaycastHelper._point == null) {
            loader.loadRes('common/prefabs/Point', Prefab, (...args) => {
              if (args) {
                if (args[0]) {
                  console.error(args[0]);
                } else {
                  RaycastHelper._point = args[1];
                  RaycastHelper._enable = true;
                }
              }
            });
          }

          game.addPersistRootNode(RaycastHelper._container);
        }

        onEnable() {
          systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
          systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        }

        onDisable() {
          systemEvent.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
          systemEvent.off(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        }

        onDestroy() {
          this.recover();
        }

        onKeyDown(event) {
          if (event.keyCode == this.switch) {
            RaycastHelper._enable = !RaycastHelper._enable;
          }
        }

        onTouchStart(touch) {
          if (!RaycastHelper._enable) return;
          this.recover();
          const r = new geometry.ray();
          const p = touch.getLocation();
          this.cameraCom.screenPointToRay(p.x, p.y, r);

          if (this.raycastType == ERaycastType.CLOSEST) {
            if (PhysicsSystem.instance.raycastClosest(r)) {
              const result = PhysicsSystem.instance.raycastClosestResult;
              const clone = PrefabPoolUtil.getItemByPoolName('COMMON.Point', RaycastHelper._point);

              this._cache.push(clone);

              clone.setWorldPosition(result.hitPoint);
              clone.setScale(this.scale, this.scale, this.scale);

              RaycastHelper._container.addChild(clone);
            }
          } else if (this.raycastType == ERaycastType.ALL) {
            if (PhysicsSystem.instance.raycast(r)) {
              const results = PhysicsSystem.instance.raycastResults;

              for (let i = 0; i < results.length; i++) {
                const result = results[i];
                const clone = PrefabPoolUtil.getItemByPoolName('COMMON.Point', RaycastHelper._point);

                this._cache.push(clone);

                clone.setWorldPosition(result.hitPoint);
                clone.setScale(this.scale, this.scale, this.scale);

                RaycastHelper._container.addChild(clone);
              }
            }
          }
        }

        recover() {
          let len = this._cache.length;

          while (len--) {
            PrefabPoolUtil.recoverItemByPoolName('COMMON.Point', this._cache.pop(), true);
          }
        }

      }, _class3._point = null, _class3._enable = false, _class3._container = new Node("_RAYCAST_CONTAINER_"), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cameraCom", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "raycastType", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return ERaycastType.CLOSEST;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "switch", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return macro.KEY.r;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "scale", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/common/scripts/first-person-camera.js", ["cc", "../../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, math, macro, _decorator, Component, systemEvent, SystemEvent, game, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp, ccclass, property, menu, v2_1, v2_2, v3_1, qt_1, id_forward, KEYCODE, FirstPersonCamera;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _descriptor4: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      math = _cc.math;
      macro = _cc.macro;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      systemEvent = _cc.systemEvent;
      SystemEvent = _cc.SystemEvent;
      game = _cc.game;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "83969PIqqtCzpmwWOBT+ujw", "first-person-camera", undefined);

      ({
        ccclass,
        property,
        menu
      } = _decorator);
      v2_1 = new math.Vec2();
      v2_2 = new math.Vec2();
      v3_1 = new math.Vec3();
      qt_1 = new math.Quat();
      id_forward = new math.Vec3(0, 0, 1);
      KEYCODE = {
        W: 'W'.charCodeAt(0),
        S: 'S'.charCodeAt(0),
        A: 'A'.charCodeAt(0),
        D: 'D'.charCodeAt(0),
        Q: 'Q'.charCodeAt(0),
        E: 'E'.charCodeAt(0),
        SHIFT: macro.KEY.shift
      };

      _export("FirstPersonCamera", FirstPersonCamera = (_dec = ccclass("COMMON.FirstPersonCamera"), _dec2 = menu("common/FirstPersonCamera"), _dec3 = property({
        slide: true,
        range: [0.05, 0.5, 0.01]
      }), _dec(_class = _dec2(_class = (_class2 = (_temp = class FirstPersonCamera extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "moveSpeed", _descriptor, this);

          _initializerDefineProperty(this, "moveSpeedShiftScale", _descriptor2, this);

          _initializerDefineProperty(this, "damp", _descriptor3, this);

          _initializerDefineProperty(this, "rotateSpeed", _descriptor4, this);

          this._euler = new math.Vec3();
          this._velocity = new math.Vec3();
          this._position = new math.Vec3();
          this._speedScale = 1;
        }

        onLoad() {
          math.Vec3.copy(this._euler, this.node.eulerAngles);
          math.Vec3.copy(this._position, this.node.position);
        }

        onDestroy() {
          this._removeEvents();
        }

        onEnable() {
          this._addEvents();
        }

        onDisable() {
          this._removeEvents();
        }

        update(dt) {
          // position
          math.Vec3.transformQuat(v3_1, this._velocity, this.node.rotation);
          math.Vec3.scaleAndAdd(this._position, this._position, v3_1, this.moveSpeed * this._speedScale);
          math.Vec3.lerp(v3_1, this.node.position, this._position, dt / this.damp);
          this.node.setPosition(v3_1); // rotation

          math.Quat.fromEuler(qt_1, this._euler.x, this._euler.y, this._euler.z);
          math.Quat.slerp(qt_1, this.node.rotation, qt_1, dt / this.damp);
          this.node.setRotation(qt_1);
        }

        _addEvents() {
          systemEvent.on(SystemEvent.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
          systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
          systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
          systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
          systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
          systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        }

        _removeEvents() {
          systemEvent.off(SystemEvent.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
          systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
          systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
          systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
          systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
          systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        }

        onMouseWheel(e) {
          const delta = -e.getScrollY() * this.moveSpeed / 24; // delta is positive when scroll down

          math.Vec3.transformQuat(v3_1, id_forward, this.node.rotation);
          math.Vec3.scaleAndAdd(v3_1, this.node.position, v3_1, delta);
          this.node.setPosition(v3_1);
        }

        onKeyDown(e) {
          const v = this._velocity;

          if (e.keyCode === KEYCODE.SHIFT) {
            this._speedScale = this.moveSpeedShiftScale;
          } else if (e.keyCode === KEYCODE.W) {
            if (v.z === 0) {
              v.z = -1;
            }
          } else if (e.keyCode === KEYCODE.S) {
            if (v.z === 0) {
              v.z = 1;
            }
          } else if (e.keyCode === KEYCODE.A) {
            if (v.x === 0) {
              v.x = -1;
            }
          } else if (e.keyCode === KEYCODE.D) {
            if (v.x === 0) {
              v.x = 1;
            }
          } else if (e.keyCode === KEYCODE.Q) {
            if (v.y === 0) {
              v.y = -1;
            }
          } else if (e.keyCode === KEYCODE.E) {
            if (v.y === 0) {
              v.y = 1;
            }
          }
        }

        onKeyUp(e) {
          const v = this._velocity;

          if (e.keyCode === KEYCODE.SHIFT) {
            this._speedScale = 1;
          } else if (e.keyCode === KEYCODE.W) {
            if (v.z < 0) {
              v.z = 0;
            }
          } else if (e.keyCode === KEYCODE.S) {
            if (v.z > 0) {
              v.z = 0;
            }
          } else if (e.keyCode === KEYCODE.A) {
            if (v.x < 0) {
              v.x = 0;
            }
          } else if (e.keyCode === KEYCODE.D) {
            if (v.x > 0) {
              v.x = 0;
            }
          } else if (e.keyCode === KEYCODE.Q) {
            if (v.y < 0) {
              v.y = 0;
            }
          } else if (e.keyCode === KEYCODE.E) {
            if (v.y > 0) {
              v.y = 0;
            }
          }
        }

        onTouchStart(e) {
          if (game.canvas.requestPointerLock) game.canvas.requestPointerLock();
        }

        onTouchMove(e) {
          e.getStartLocation(v2_1);

          if (v2_1.x > cc.winSize.width * 0.4) {
            // rotation
            e.getDelta(v2_2);
            this._euler.y -= v2_2.x * 0.5;
            this._euler.x += v2_2.y * 0.5;
          } else {
            // position
            e.getLocation(v2_2);
            math.Vec2.subtract(v2_2, v2_2, v2_1);
            this._velocity.x = v2_2.x * 0.01;
            this._velocity.z = -v2_2.y * 0.01;
          }
        }

        onTouchEnd(e) {
          if (document.exitPointerLock) document.exitPointerLock();
          e.getStartLocation(v2_1);

          if (v2_1.x < cc.winSize.width * 0.4) {
            // position
            this._velocity.x = 0;
            this._velocity.z = 0;
          }
        }

        changeEnable() {
          this.enabled = !this.enabled;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeedShiftScale", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "damp", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "rotateSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/scripts/TempConst.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, Vec2, Vec3, Quat, v2_t, v3_t, quat_t;

  function parseTime2String(seconds) {
    const s = seconds % 60;
    const m = Math.floor(seconds / 60);
    const ss = s > 9 ? s.toString() : '0' + s;
    const ms = m > 9 ? m.toString() : '0' + m;
    return ms + ':' + ss;
  }

  _export("parseTime2String", parseTime2String);

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
      Quat = _cc.Quat;
    }],
    execute: function () {
      cclegacy._RF.push({}, "97a53aZRpRDrZPZ8oIkEsd4", "TempConst", undefined);

      _export("v2_t", v2_t = new Vec2());

      _export("v3_t", v3_t = new Vec3());

      _export("quat_t", quat_t = new Quat());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/scripts/ColumnCtr.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js", "./TempConst.js"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Component, systemEvent, SystemEventType, macro, Quat, Vec3, _applyDecoratedDescriptor, _initializerDefineProperty, quat_t, v2_t, v3_t, _dec, _dec2, _class, _class2, _descriptor, _temp, ccclass, property, menu, ColumnCtr;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      systemEvent = _cc.systemEvent;
      SystemEventType = _cc.SystemEventType;
      macro = _cc.macro;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }, function (_TempConstJs) {
      quat_t = _TempConstJs.quat_t;
      v2_t = _TempConstJs.v2_t;
      v3_t = _TempConstJs.v3_t;
    }],
    execute: function () {
      cclegacy._RF.push({}, "aa2e0MmOhpOcZu+TJB4WqZb", "ColumnCtr", undefined);

      ({
        ccclass,
        property,
        menu
      } = _decorator);

      _export("ColumnCtr", ColumnCtr = (_dec = ccclass("FALLING-BALL.ColumnCtr"), _dec2 = menu("demo/falling-ball/ColumnCtr"), _dec(_class = _dec2(_class = (_class2 = (_temp = class ColumnCtr extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "rotFactor", _descriptor, this);
        }

        onEnable() {
          systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
          systemEvent.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        }

        onDisable() {
          systemEvent.off(SystemEventType.KEY_DOWN, this.onKeyDown, this);
          systemEvent.off(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        }

        onKeyDown(event) {
          if (event.keyCode == macro.KEY.a) {
            Quat.fromEuler(quat_t, 0, 3, 0);
          } else if (event.keyCode == macro.KEY.d) {
            Quat.fromEuler(quat_t, 0, -3, 0);
          }

          this.node.rotate(quat_t);
        }

        onTouchMove(touch, event) {
          touch.getDelta(v2_t);

          if (v2_t.x != 0) {
            Quat.fromEuler(quat_t, 0, v2_t.x * this.rotFactor, 0);
            this.node.rotate(quat_t);
          }
        }

        reset() {
          const cnode = this.node.children[0];
          cnode.worldPosition = Vec3.ZERO;
          cnode.worldRotation = Quat.IDENTITY;

          for (let i = 1; i < this.node.children.length; i++) {
            const cnode = this.node.children[i];
            v3_t.set(0, i * -8, 0);
            cnode.worldPosition = v3_t;
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "rotFactor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.75;
        }
      }), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/scripts/FloorFlagCtr.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js", "../common/scripts/PrefabPoolUtil.js", "./TempConst.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Node, LabelComponent, Prefab, _decorator, Component, ColliderComponent, RigidBodyComponent, Vec3, Quat, randomRange, _applyDecoratedDescriptor, _initializerDefineProperty, PrefabPoolUtil, v3_t, quat_t, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp, ccclass, property, menu, FloorFlagCtr;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _dec4: void 0,
    _dec5: void 0,
    _dec6: void 0,
    _dec7: void 0,
    _dec8: void 0,
    _dec9: void 0,
    _dec10: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _descriptor4: void 0,
    _descriptor5: void 0,
    _descriptor6: void 0,
    _descriptor7: void 0,
    _descriptor8: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Node = _cc.Node;
      LabelComponent = _cc.LabelComponent;
      Prefab = _cc.Prefab;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      ColliderComponent = _cc.ColliderComponent;
      RigidBodyComponent = _cc.RigidBodyComponent;
      Vec3 = _cc.Vec3;
      Quat = _cc.Quat;
      randomRange = _cc.randomRange;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }, function (_commonScriptsPrefabPoolUtilJs) {
      PrefabPoolUtil = _commonScriptsPrefabPoolUtilJs.PrefabPoolUtil;
    }, function (_TempConstJs) {
      v3_t = _TempConstJs.v3_t;
      quat_t = _TempConstJs.quat_t;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b26d0XJVu5HY7eZmypdRZ1n", "FloorFlagCtr", undefined);

      ({
        ccclass,
        property,
        menu
      } = _decorator);

      _export("FloorFlagCtr", FloorFlagCtr = (_dec = ccclass("FALLING-BALL.FloorFlagCtr"), _dec2 = menu("demo/falling-ball/FloorFlagCtr"), _dec3 = property({
        type: Node
      }), _dec4 = property({
        type: Node
      }), _dec5 = property({
        type: Node
      }), _dec6 = property({
        type: Node
      }), _dec7 = property({
        type: LabelComponent
      }), _dec8 = property({
        type: Prefab
      }), _dec9 = property({
        type: Prefab
      }), _dec10 = property({
        type: Node
      }), _dec(_class = _dec2(_class = (_class2 = (_temp = class FloorFlagCtr extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "targetNode", _descriptor, this);

          _initializerDefineProperty(this, "floorRoot", _descriptor2, this);

          _initializerDefineProperty(this, "floorFlag0", _descriptor3, this);

          _initializerDefineProperty(this, "floorFlag1", _descriptor4, this);

          _initializerDefineProperty(this, "scoreLabel", _descriptor5, this);

          _initializerDefineProperty(this, "cubePrefab", _descriptor6, this);

          _initializerDefineProperty(this, "cubeRedPrefab", _descriptor7, this);

          _initializerDefineProperty(this, "cubeRoot", _descriptor8, this);

          this._flag = 0;
        }

        update() {
          if (this.floorFlag0.worldPosition.y > this.targetNode.worldPosition.y) {
            v3_t.set(this.floorFlag0.worldPosition);
            v3_t.y -= 8;
            this.floorFlag0.worldPosition = v3_t;
            const len = this.floorRoot.children.length;
            const floorNode = this.floorRoot.children[this._flag % len];
            const colliders = floorNode.getComponentsInChildren(ColliderComponent);

            for (let i = 0; i < colliders.length; i++) {
              let clone;

              if (colliders[i].node.name == "Cube") {
                clone = PrefabPoolUtil.getItemByPoolName("FALLING-BALL.Cube", this.cubePrefab, 5);
              } else {
                clone = PrefabPoolUtil.getItemByPoolName("FALLING-BALL.CubeRed", this.cubeRedPrefab, 5);
              }

              clone.parent = null;
              this.cubeRoot.addChild(clone);
              clone.worldPosition = colliders[i].node.worldPosition;
              clone.worldRotation = colliders[i].node.worldRotation;
              const cBody = clone.getComponent(RigidBodyComponent);
              cBody.sleep();
              cBody.wakeUp();
              v3_t.set(0, 0, 10000);
              Vec3.transformQuat(v3_t, v3_t, clone.worldRotation);
              cBody.applyForce(v3_t);
            }

            v3_t.set(0, -(this._flag + len) * 8, 0);
            floorNode.worldPosition = v3_t;
            Quat.fromEuler(quat_t, 0, randomRange(-180, 180), 0);
            floorNode.worldRotation = quat_t;
            this._flag++;
            this.scoreLabel.string = this._flag.toString();
          }

          if (this.floorFlag1.worldPosition.y > this.targetNode.worldPosition.y) {
            v3_t.set(this.floorFlag1.worldPosition);
            v3_t.y -= 8;
            this.floorFlag1.worldPosition = v3_t;
          }
        }

        reset() {
          this._flag = 0;
          v3_t.set(0, -1, 0);
          this.floorFlag0.worldPosition = v3_t;
          v3_t.set(0, -3, 0);
          this.floorFlag1.worldPosition = v3_t;
        }

        onDestroy() {
          PrefabPoolUtil.clear("FALLING-BALL.Cube");
          PrefabPoolUtil.clear("FALLING-BALL.CubeRed");
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "targetNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "floorRoot", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "floorFlag0", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "floorFlag1", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "scoreLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "cubePrefab", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "cubeRedPrefab", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "cubeRoot", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/scripts/BallCtr.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js", "./TempConst.js", "./ColumnCtr.js", "./FloorFlagCtr.js"], function (_export, _context) {
  "use strict";

  var cclegacy, RigidBodyComponent, _decorator, Component, ColliderComponent, _applyDecoratedDescriptor, _initializerDefineProperty, v3_t, ColumnCtr, FloorFlagCtr, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, ccclass, property, requireComponent, menu, BallCtr;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _dec4: void 0,
    _dec5: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      RigidBodyComponent = _cc.RigidBodyComponent;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      ColliderComponent = _cc.ColliderComponent;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }, function (_TempConstJs) {
      v3_t = _TempConstJs.v3_t;
    }, function (_ColumnCtrJs) {
      ColumnCtr = _ColumnCtrJs.ColumnCtr;
    }, function (_FloorFlagCtrJs) {
      FloorFlagCtr = _FloorFlagCtrJs.FloorFlagCtr;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1eb123sIqxKN7XiewOH7vLG", "BallCtr", undefined);

      ({
        ccclass,
        property,
        requireComponent,
        menu
      } = _decorator);

      _export("BallCtr", BallCtr = (_dec = ccclass("FALLING-BALL.BallCtr"), _dec2 = requireComponent(RigidBodyComponent), _dec3 = menu("demo/falling-ball/BallCtr"), _dec4 = property({
        type: ColumnCtr
      }), _dec5 = property({
        type: FloorFlagCtr
      }), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = (_temp = class BallCtr extends Component {
        constructor(...args) {
          super(...args);
          this.rigidBody = null;

          _initializerDefineProperty(this, "velocity_y", _descriptor, this);

          _initializerDefineProperty(this, "columnCtr", _descriptor2, this);

          _initializerDefineProperty(this, "floorFlagCtr", _descriptor3, this);

          this._deadlockCount = 0;
          this._tempUuid = '';
          this._hitRedFlag = 0;
        }

        get hitRed() {
          return this._hitRedFlag == 1;
        }

        get isDeadlock() {
          return this._deadlockCount >= 2;
        }

        onLoad() {
          this.rigidBody = this.getComponent(RigidBodyComponent);
          this.rigidBody.allowSleep = false;
        }

        start() {
          const collider = this.getComponent(ColliderComponent);
          collider.on('onCollisionEnter', this.onCollisionEnter, this);
        }

        onCollisionEnter(event) {
          v3_t.set(this.node.worldPosition);
          v3_t.y = event.otherCollider.node.worldPosition.y + 1; // 1 = radius + halfY

          this.node.worldPosition = v3_t;

          if (event.otherCollider.node.name == "CubeRed") {
            this._hitRedFlag = 1;

            if (window.CC_PHYSICS_AMMO) {
              this.rigidBody.body.impl.clearState();
            } else if (window.CC_PHYSICS_CANNON) {
              this.rigidBody.body.impl.sleep();
              this.rigidBody.body.impl.wakeUp();
            }

            this.rigidBody.mass = 0;
            this.columnCtr.enabled = false;
            this.floorFlagCtr.enabled = false;
          } else if (event.otherCollider.node.name == "Cube") {
            v3_t.set(0, this.velocity_y, 0);
            this.rigidBody.setLinearVelocity(v3_t);

            if (this._tempUuid == event.otherCollider.node.uuid) {
              this._deadlockCount++;
            } else {
              this._tempUuid = event.otherCollider.node.uuid;
              this._deadlockCount = 0;
            }
          }
        }

        update() {
          this.rigidBody.getLinearVelocity(v3_t);

          if (v3_t.y > this.velocity_y) {
            v3_t.set(0, this.velocity_y, 0);
            this.rigidBody.setLinearVelocity(v3_t);
          }

          if (v3_t.y < -60) {
            v3_t.set(0, -60, 0);
            this.rigidBody.setLinearVelocity(v3_t);
          }
        }

        reset() {
          this.rigidBody.mass = 10;

          if (window.CC_PHYSICS_CANNON) {
            this.rigidBody.body.impl.type = CANNON.Body.DYNAMIC;
          }

          this._hitRedFlag = 0;
          v3_t.set(0, 6, 4.5);
          this.node.worldPosition = v3_t;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "velocity_y", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "columnCtr", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "floorFlagCtr", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/scripts/CameraFollow.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js", "./TempConst.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Node, _decorator, Component, lerp, _applyDecoratedDescriptor, _initializerDefineProperty, v3_t, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, ccclass, property, menu, CameraFollow;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Node = _cc.Node;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      lerp = _cc.lerp;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }, function (_TempConstJs) {
      v3_t = _TempConstJs.v3_t;
    }],
    execute: function () {
      cclegacy._RF.push({}, "5f826M2zJxAuqjoPVFCOn3x", "CameraFollow", undefined);

      ({
        ccclass,
        property,
        menu
      } = _decorator);

      _export("CameraFollow", CameraFollow = (_dec = ccclass("FALLING-BALL.CameraFollow"), _dec2 = menu("demo/falling-ball/CameraFollow"), _dec3 = property({
        type: Node
      }), _dec(_class = _dec2(_class = (_class2 = (_temp = class CameraFollow extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "targetNode", _descriptor, this);

          _initializerDefineProperty(this, "tolerance", _descriptor2, this);

          _initializerDefineProperty(this, "step", _descriptor3, this);

          this._offset = 0;
        }

        start() {
          this._offset = this.node.worldPosition.y - this.targetNode.worldPosition.y;
        }

        lateUpdate() {
          const y = this.node.worldPosition.y;
          const ty = this.targetNode.worldPosition.y + this._offset;
          const delta = y - ty;

          if (delta > this.tolerance) {
            v3_t.set(this.node.worldPosition);
            v3_t.y = lerp(y, ty, this.step);
            this.node.worldPosition = v3_t;
          }
        }

        reset() {
          v3_t.set(this.node.worldPosition);
          v3_t.y = this.targetNode.worldPosition.y + this._offset;
          this.node.worldPosition = v3_t;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "targetNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tolerance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.01;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "step", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/scripts/GameConfig.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js", "../common/scripts/ProfilerManager.js"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Vec3, Component, PhysicsSystem, profiler, _applyDecoratedDescriptor, _initializerDefineProperty, ProfilerManager, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp, ccclass, property, menu, GameConfig;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _descriptor4: void 0,
    _descriptor5: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Vec3 = _cc.Vec3;
      Component = _cc.Component;
      PhysicsSystem = _cc.PhysicsSystem;
      profiler = _cc.profiler;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }, function (_commonScriptsProfilerManagerJs) {
      ProfilerManager = _commonScriptsProfilerManagerJs.ProfilerManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "59390JZX1lAULUgg8nkWkf9", "GameConfig", undefined);

      ({
        ccclass,
        property,
        menu
      } = _decorator);

      _export("GameConfig", GameConfig = (_dec = ccclass("FALLING-BALL.GameConfig"), _dec2 = menu("demo/falling-ball/GameConfig"), _dec(_class = _dec2(_class = (_class2 = (_temp = class GameConfig extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "allowSleep", _descriptor, this);

          _initializerDefineProperty(this, "gravity", _descriptor2, this);

          _initializerDefineProperty(this, "maxSubStep", _descriptor3, this);

          _initializerDefineProperty(this, "frameRate", _descriptor4, this);

          _initializerDefineProperty(this, "showStat", _descriptor5, this);
        }

        __preload() {
          PhysicsSystem.instance.allowSleep = this.allowSleep;
          PhysicsSystem.instance.gravity = this.gravity;
          PhysicsSystem.instance.maxSubStep = this.maxSubStep;
          PhysicsSystem.instance.deltaTime = this.frameRate == 0 ? 1E+100 : 1 / this.frameRate;
        }

        start() {
          this.node.addComponent(ProfilerManager);

          if (!this.showStat) {
            if (profiler) profiler.hideStats();
          }
        }

        onDestroy() {
          PhysicsSystem.instance.allowSleep = true;
          PhysicsSystem.instance.maxSubStep = 2;
          PhysicsSystem.instance.deltaTime = 1 / 60;
          PhysicsSystem.instance.gravity = new Vec3(0, -10, 0);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "allowSleep", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "gravity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3(0, -20, 0);
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "maxSubStep", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "frameRate", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 60;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "showStat", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/scripts/GameCtr.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js", "./ColumnCtr.js", "./FloorFlagCtr.js", "./BallCtr.js", "./CameraFollow.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Node, _decorator, Component, ButtonComponent, EventHandler, LabelComponent, _applyDecoratedDescriptor, _initializerDefineProperty, ColumnCtr, FloorFlagCtr, BallCtr, CameraFollow, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp, ccclass, property, menu, EGameSate, GameCtr;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _dec4: void 0,
    _dec5: void 0,
    _dec6: void 0,
    _dec7: void 0,
    _dec8: void 0,
    _dec9: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _descriptor4: void 0,
    _descriptor5: void 0,
    _descriptor6: void 0,
    _descriptor7: void 0,
    _descriptor8: void 0,
    _temp: void 0,
    EGameSate: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Node = _cc.Node;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      ButtonComponent = _cc.ButtonComponent;
      EventHandler = _cc.EventHandler;
      LabelComponent = _cc.LabelComponent;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }, function (_ColumnCtrJs) {
      ColumnCtr = _ColumnCtrJs.ColumnCtr;
    }, function (_FloorFlagCtrJs) {
      FloorFlagCtr = _FloorFlagCtrJs.FloorFlagCtr;
    }, function (_BallCtrJs) {
      BallCtr = _BallCtrJs.BallCtr;
    }, function (_CameraFollowJs) {
      CameraFollow = _CameraFollowJs.CameraFollow;
    }],
    execute: function () {
      cclegacy._RF.push({}, "7df5dxpZz5NOIBvxqIr9ZFD", "GameCtr", undefined);

      ({
        ccclass,
        property,
        menu
      } = _decorator);

      (function (EGameSate) {
        EGameSate[EGameSate["LOBBY"] = 0] = "LOBBY";
        EGameSate[EGameSate["GAMING"] = 1] = "GAMING";
        EGameSate[EGameSate["GAMEOVER"] = 2] = "GAMEOVER";
      })(EGameSate || (EGameSate = {}));

      _export("GameCtr", GameCtr = (_dec = ccclass("FALLING-BALL.GameCtr"), _dec2 = menu("demo/falling-ball/GameCtr"), _dec3 = property({
        type: Node
      }), _dec4 = property({
        type: Node
      }), _dec5 = property({
        type: Node
      }), _dec6 = property({
        type: CameraFollow
      }), _dec7 = property({
        type: ColumnCtr
      }), _dec8 = property({
        type: BallCtr
      }), _dec9 = property({
        type: FloorFlagCtr
      }), _dec(_class = _dec2(_class = (_class2 = (_temp = class GameCtr extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "gamePanel", _descriptor, this);

          _initializerDefineProperty(this, "loginPanel", _descriptor2, this);

          _initializerDefineProperty(this, "overPanel", _descriptor3, this);

          _initializerDefineProperty(this, "cameraCtr", _descriptor4, this);

          _initializerDefineProperty(this, "columnCtr", _descriptor5, this);

          _initializerDefineProperty(this, "ballCtr", _descriptor6, this);

          _initializerDefineProperty(this, "floorFlagCtr", _descriptor7, this);

          _initializerDefineProperty(this, "totalSecond", _descriptor8, this);

          this._tick = 0;
          this._intervalId = -1;
          this._state = EGameSate.LOBBY;
          this._timingLb = null;
          this._scoreLb = null;
        }

        start() {
          const startBtn = this.loginPanel.getChildByName('StartBtn').getComponent(ButtonComponent);
          const startEvent = new EventHandler();
          startEvent.target = this.node;
          startEvent.component = "FALLING-BALL.GameCtr";
          startEvent.handler = "gameStart";
          startBtn.clickEvents.push(startEvent);
          const backToLoginBtn = this.overPanel.getChildByName('BackBtn').getComponent(ButtonComponent);
          const backToLoginEvent = new EventHandler();
          backToLoginEvent.target = this.node;
          backToLoginEvent.component = "FALLING-BALL.GameCtr";
          backToLoginEvent.handler = "gameBackToLogin";
          backToLoginBtn.clickEvents.push(backToLoginEvent); // const RestartBtn = this.overPanel.getChildByName('RestartBtn').getComponent(ButtonComponent);

          const restartEvent = new EventHandler();
          restartEvent.target = this.node;
          restartEvent.component = "FALLING-BALL.GameCtr";
          restartEvent.handler = "gameRestart"; // RestartBtn.clickEvents.push(restartEvent);

          this.columnCtr.enabled = false;
          this.floorFlagCtr.enabled = false; // this._timingLb = this.gamePanel.getChildByName('TimingLabel').getComponent(LabelComponent);

          this._scoreLb = this.gamePanel.getChildByName('ScoreLabel').getComponent(LabelComponent); // this._timingLb.string = parseTime2String(this.totalSecond);

          const score = localStorage.getItem('score');

          if (score != null) {
            this._scoreLb.string = score;
          }
        }

        gameStart() {
          this.columnCtr.enabled = true;
          this.floorFlagCtr.enabled = true;
          this.loginPanel.active = false;
          this._tick = 0; // this._timingLb.string = parseTime2String(this.totalSecond);

          this._scoreLb.string = '0';
          this._intervalId = setInterval(this.gameTick.bind(this), 1000);
          this._state = EGameSate.GAMING;
        }

        gameRestart() {
          this.overPanel.active = false;
          this.ballCtr.reset();
          this.columnCtr.reset();
          this.floorFlagCtr.reset();
          this.cameraCtr.reset();
          this.gameStart();
        }

        gameBackToLogin() {
          this.loginPanel.active = true;
          this.overPanel.active = false;
          this.ballCtr.reset();
          this.columnCtr.reset();
          this.floorFlagCtr.reset();
          this.cameraCtr.reset();
          this.floorFlagCtr.reset(); // this._timingLb.string = parseTime2String(this.totalSecond);

          const score = localStorage.getItem('score');

          if (score != null) {
            this._scoreLb.string = score;
          }
        }

        gameTick() {
          this._tick++;
          const dt = this.totalSecond - this._tick;

          if (dt < 0 || this.ballCtr.hitRed) {
            this.columnCtr.enabled = false;

            if ((this.ballCtr.isDeadlock || this.ballCtr.hitRed) && this._state != EGameSate.GAMEOVER) {
              /** GAME OVER */
              this._state = EGameSate.GAMEOVER;
              clearInterval(this._intervalId);
              this.overPanel.active = true;
              this.columnCtr.enabled = false;
              const score = localStorage.getItem('score');

              if (score != null) {
                let s0 = parseInt(score);
                let s1 = parseInt(this._scoreLb.string);

                if (s1 > s0) {
                  localStorage.setItem('score', this._scoreLb.string);
                }
              } else {
                localStorage.setItem('score', this._scoreLb.string);
              }
            }
          }
        }

        onDestroy() {
          clearInterval(this._intervalId);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gamePanel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "loginPanel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "overPanel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "cameraCtr", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "columnCtr", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "ballCtr", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "floorFlagCtr", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "totalSecond", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 90;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/scripts/SwitchScene.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, Component, director, _decorator, _dec, _class, ccclass, property, SwitchScene;

  _export({
    _dec: void 0,
    _class: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Component = _cc.Component;
      director = _cc.director;
      _decorator = _cc._decorator;
    }],
    execute: function () {
      cclegacy._RF.push({}, "13020V0W8dDbI7wBZ6nsiGw", "SwitchScene", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SwitchScene", SwitchScene = (_dec = ccclass('SwitchScene'), _dec(_class = class SwitchScene extends Component {
        /* class member could be defined like this */
        // dummy = '';

        /* use `property` decorator if your want the member to be serializable */
        // @property
        // serializableDummy = 0;
        start() {} // Your initialization goes here.
        // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        switchScene() {
          var o = jsb.reflection.callStaticMethod("com/example/nativeincludecocos/MainActivity", "showButton", "()V");
          director.loadScene("head");
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///ball/scripts/SwitchScennIos.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, Component, director, _decorator, _dec, _class, ccclass, property, SwitchScennIos;

  _export({
    _dec: void 0,
    _class: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Component = _cc.Component;
      director = _cc.director;
      _decorator = _cc._decorator;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ec603fKTbhOorzG6VkNxi2c", "SwitchScennIos", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SwitchScennIos", SwitchScennIos = (_dec = ccclass('SwitchScennIos'), _dec(_class = class SwitchScennIos extends Component {
        /* class member could be defined like this */
        // dummy = '';

        /* use `property` decorator if your want the member to be serializable */
        // @property
        // serializableDummy = 0;
        start() {} // Your initialization goes here.
        // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        switchScene() {
          director.loadScene("ios");
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///pre-filter-envmap/pre-filter-envmap.js", ["cc", "../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Quat, GFXBufferTextureCopy, EffectAsset, _decorator, Component, CameraComponent, director, Material, GFXCullMode, ModelComponent, utils, primitives, TextureCube, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _temp, ccclass, property, rotations, readRegions, writeRegions, PreFilterEnvmap;

  // 6 faces
  function getMipLevel(size) {
    let level = 0;

    while (size) {
      size >>= 1;
      level++;
    }

    return level;
  }

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Quat = _cc.Quat;
      GFXBufferTextureCopy = _cc.GFXBufferTextureCopy;
      EffectAsset = _cc.EffectAsset;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      CameraComponent = _cc.CameraComponent;
      director = _cc.director;
      Material = _cc.Material;
      GFXCullMode = _cc.GFXCullMode;
      ModelComponent = _cc.ModelComponent;
      utils = _cc.utils;
      primitives = _cc.primitives;
      TextureCube = _cc.TextureCube;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "41074J7W0lCe40VLTiO+Uxi", "pre-filter-envmap", undefined);

      ({
        ccclass,
        property
      } = _decorator);
      rotations = [Quat.fromEuler(new Quat(), 180, 90, 0), // +X
      Quat.fromEuler(new Quat(), 180, -90, 0), // -X
      Quat.fromEuler(new Quat(), 90, 0, 0), // +Y
      Quat.fromEuler(new Quat(), -90, 0, 0), // -Y
      Quat.fromEuler(new Quat(), 180, 0, 0), // +Z
      Quat.fromEuler(new Quat(), 180, 180, 0) // -Z
      ];
      readRegions = [new GFXBufferTextureCopy()];
      readRegions[0].texExtent.depth = 1;
      writeRegions = [new GFXBufferTextureCopy()];
      writeRegions[0].texExtent.depth = 1;
      writeRegions[0].texSubres.layerCount = 6;

      _export("PreFilterEnvmap", PreFilterEnvmap = (_dec = ccclass('PreFilterEnvmap'), _dec2 = property(EffectAsset), _dec(_class = (_class2 = (_temp = class PreFilterEnvmap extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "effect", _descriptor, this);

          _initializerDefineProperty(this, "blurriness", _descriptor2, this);

          this._camera = null;
          this._material = null;
          this._renderTarget = null;
        }

        onLoad() {
          this._camera = this.node.getComponentInChildren(CameraComponent);
          this._renderTarget = this._camera.targetTexture;
          const customStage = 0xbebe; // some random number to avoid colliding with others

          director.root.pipeline.addRenderPass(customStage, this._renderTarget.getGFXWindow().renderPass);
          this._material = new Material();

          this._material.initialize({
            effectAsset: this.effect,
            states: {
              stage: customStage,
              rasterizerState: {
                cullMode: GFXCullMode.FRONT
              },
              depthStencilState: {
                depthTest: false,
                depthWrite: false
              }
            }
          });

          const modelComp = this.node.addComponent(ModelComponent);
          modelComp.mesh = utils.createMesh(primitives.box({
            width: 2,
            height: 2,
            length: 2
          }));
          modelComp.material = this._material;
        }

        start() {
          {
            const skybox = this.node.scene.renderScene.skybox;
            skybox.envmap = this.filter(skybox.envmap); // skybox.isRGBE = false;
          }
        } // WebGL doesn't support using custom mipmap level in framebuffer attachments,
        // so we'll have to do this the hard way (read back and upload again)


        filter(envmap) {
          this.node.active = true;
          envmap.setMipFilter(TextureCube.Filter.LINEAR);
          let size = envmap.width; // has to be square

          const view = this._camera.camera.view;
          const readRegion = readRegions[0];
          const writeRegion = writeRegions[0];
          const mipLevel = getMipLevel(size);
          const newEnvMap = new TextureCube();
          const pass = this._material.passes[0];
          const handle = pass.getHandle('roughness');
          newEnvMap.reset({
            width: size,
            height: size,
            mipmapLevel: mipLevel
          });

          for (let m = 0; m < mipLevel; m++) {
            // need to resize both window and camera
            view.window.resize(size, size);
            view.camera.resize(size, size);
            readRegion.texExtent.width = readRegion.texExtent.height = size;
            writeRegion.texExtent.width = writeRegion.texExtent.height = size;
            writeRegion.texSubres.mipLevel = m;
            pass.setUniform(handle, this.blurriness + m / (mipLevel - 1) * (1 - this.blurriness));
            const length = size * size * 4;
            const buffers = [];

            for (let i = 0; i < 6; i++) {
              buffers[i] = new Uint8Array(length);

              this._camera.node.setRotation(rotations[i]);

              director.root.pipeline.render(view);
              director.root.device.copyFramebufferToBuffer(view.window.framebuffer, buffers[i].buffer, readRegions);
            }

            director.root.device.copyBuffersToTexture(buffers, newEnvMap.getGFXTexture(), writeRegions);
            size >>= 1;
          }

          this.node.active = false;
          newEnvMap.setMipFilter(TextureCube.Filter.LINEAR);
          return newEnvMap;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "effect", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "blurriness", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/ad-hoc/debug-info.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, ModelComponent, _decorator, Component, director, GFXAPI, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _class, _class2, _descriptor, _temp, ccclass, property, gl, DebugInfo;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      ModelComponent = _cc.ModelComponent;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      director = _cc.director;
      GFXAPI = _cc.GFXAPI;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "645d28UJBFHjpWnseLAQxX2", "debug-info", undefined);

      ({
        ccclass,
        property
      } = _decorator);
      gl = null;

      _export("DebugInfo", DebugInfo = (_dec = ccclass('DebugInfo'), _dec2 = property([ModelComponent]), _dec(_class = (_class2 = (_temp = class DebugInfo extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "targets", _descriptor, this);
        }

        printActiveUniforms() {
          if (director.root.device.gfxAPI === GFXAPI.WEBGL || director.root.device.gfxAPI === GFXAPI.WEBGL2) {
            this.targets.forEach(comp => {
              console.log(comp.node.name, '---------------------------------------'); // @ts-ignore

              const psoCI = comp._model._subModels[0]._psoCreateInfos[0];
              gl = director.root.device.gl;
              const shader = psoCI.shader.gpuShader;
              shader.glBlocks.reduce((acc, cur) => acc.concat(cur.glActiveUniforms), []).forEach(u => {
                const data = gl.getUniform(shader.glProgram, gl.getUniformLocation(shader.glProgram, u.name));
                console.log(u.name, Array.from(data).reduce((acc, cur) => `${acc} ${cur.toFixed(2)}`, ''));
              });
            });
          }

          console.log('scene', director.root.scenes);
          console.log('window', director.root.windows);
          console.log('view', director.root.views);
        }

        printJointsTexture() {
          // @ts-ignore
          const info = director.root.dataPoolManager.jointTexturePool._pool._chunks[0].texture;
          const texture = info._gpuTexture.glTexture;
          const pixels = new Float32Array(info.width * info.height * 4);
          const fb = gl.createFramebuffer();
          gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
          gl.readPixels(0, 0, info.width, info.height, gl.RGBA, gl.FLOAT, pixels);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          let str = '';

          for (let i = 0; i < pixels.length; i++) {
            str += pixels[i] + ' ';

            if ((i + 1) % 12 === 0) {
              str += '\n';
            }
          }

          console.log(str);
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "targets", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/ad-hoc/exposure.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, Component, director, CameraComponent, _decorator, _dec, _class, ccclass, property, Exposure;

  _export({
    _dec: void 0,
    _class: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Component = _cc.Component;
      director = _cc.director;
      CameraComponent = _cc.CameraComponent;
      _decorator = _cc._decorator;
    }],
    execute: function () {
      cclegacy._RF.push({}, "7c4317ZMDtPHJt4D9cpx/a0", "exposure", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Exposure", Exposure = (_dec = ccclass('Exposure'), _dec(_class = class Exposure extends Component {
        start() {
          const scene = this.node.scene;
          const pipeline = director.root.pipeline;
          this._ambient = pipeline.ambient;
          this._camera = scene.getComponentInChildren(CameraComponent).camera;
        }

        setSkyIllumination(e) {
          this._ambient.skyIllum = Math.pow(2, e.progress * 30.46); // default illum 38400, at progress 0.5
        }

        setExposure(e) {
          // @ts-ignore
          this._camera._exposure = Math.pow(2, (e.progress - 1) * 30.46); // defaul exposure 1/38400, at progress 0.5
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/unlit-quad.js", ["cc", "../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, GFXCullMode, Vec3, GFXBlendFactor, SpriteFrame, Texture2D, _decorator, ModelComponent, Material, utils, builtinResMgr, GFXFormat, GFXAttributeName, GFXFormatInfos, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, ccclass, property, mesh, vbInfo, vbuffer, material, materialInfo, default_uvs, meshInfo, enableBlend, UnlitQuadComponent;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _dec4: void 0,
    _dec5: void 0,
    _dec6: void 0,
    _dec7: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      GFXCullMode = _cc.GFXCullMode;
      Vec3 = _cc.Vec3;
      GFXBlendFactor = _cc.GFXBlendFactor;
      SpriteFrame = _cc.SpriteFrame;
      Texture2D = _cc.Texture2D;
      _decorator = _cc._decorator;
      ModelComponent = _cc.ModelComponent;
      Material = _cc.Material;
      utils = _cc.utils;
      builtinResMgr = _cc.builtinResMgr;
      GFXFormat = _cc.GFXFormat;
      GFXAttributeName = _cc.GFXAttributeName;
      GFXFormatInfos = _cc.GFXFormatInfos;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "39202sHQERK85gaOXtKVrbH", "unlit-quad", undefined);

      ({
        ccclass,
        property
      } = _decorator);
      mesh = null;
      vbInfo = null;
      vbuffer = null;
      material = null;
      materialInfo = {
        effectName: 'builtin-unlit',
        technique: 0,
        defines: {
          USE_TEXTURE: true
        },
        states: {
          rasterizerState: {
            cullMode: GFXCullMode.NONE
          }
        }
      };
      default_uvs = [0, 1, 1, 1, 0, 0, 1, 0];
      meshInfo = {
        positions: [-0.5, -0.5, 0, // bottom-left
        0.5, -0.5, 0, // bottom-right
        -0.5, 0.5, 0, // top-left
        0.5, 0.5, 0 // top-right
        ],
        uvs: default_uvs,
        indices: [0, 1, 2, 2, 1, 3],
        minPos: new Vec3(-0.5, -0.5, 0),
        maxPos: new Vec3(0.5, 0.5, 0)
      };
      enableBlend = {
        blendState: {
          targets: [{
            blend: true,
            blendSrc: GFXBlendFactor.SRC_ALPHA,
            blendDst: GFXBlendFactor.ONE_MINUS_SRC_ALPHA,
            blendDstAlpha: GFXBlendFactor.ONE_MINUS_SRC_ALPHA
          }]
        }
      };

      _export("UnlitQuadComponent", UnlitQuadComponent = (_dec = ccclass('UnlitQuadComponent'), _dec2 = property(SpriteFrame), _dec3 = property(Texture2D), _dec4 = property({
        override: true,
        visible: false
      }), _dec5 = property({
        override: true,
        visible: false
      }), _dec6 = property({
        type: Texture2D
      }), _dec7 = property({
        type: SpriteFrame
      }), _dec(_class = (_class2 = (_temp = class UnlitQuadComponent extends ModelComponent {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "_sprite", _descriptor, this);

          _initializerDefineProperty(this, "_texture", _descriptor2, this);

          _initializerDefineProperty(this, "_transparent", _descriptor3, this);
        }

        set sharedMaterials(val) {
          super.sharedMaterials = val;
        }

        get sharedMaterials() {
          return super.sharedMaterials;
        }

        set mesh(val) {
          super.mesh = val;
        }

        get mesh() {
          return super.mesh;
        }

        set texture(val) {
          this._texture = val;
          this.updateTexture();
        }

        get texture() {
          return this._texture;
        }

        set spriteFrame(val) {
          this._sprite = val;
          this.updateTexture();
        }

        get spriteFrame() {
          return this._sprite;
        }

        set transparent(val) {
          this._transparent = val;
          this.material.overridePipelineStates(val ? enableBlend : {});
        }

        get transparent() {
          return this._transparent;
        }

        onLoad() {
          if (!material) {
            material = new Material();
            material.initialize(materialInfo);
            mesh = utils.createMesh(meshInfo);
            vbInfo = mesh.struct.vertexBundles[0].view;
            vbuffer = mesh.data.buffer.slice(vbInfo.offset, vbInfo.offset + vbInfo.length);
          }

          this.material = material;
          this._mesh = mesh;
          super.onLoad();
          this.updateTexture();
          this.transparent = this._transparent;
        }

        updateTexture() {
          // update pass
          const pass = this.material && this.material.passes[0];
          const binding = pass && pass.getBinding('mainTexture');

          if (typeof binding !== 'number') {
            return;
          }

          const target = this._sprite ? this._sprite : this._texture ? this._texture : builtinResMgr.get('grey-texture');
          pass.bindTexture(binding, target.getGFXTexture()); // update UV (handle atlas)

          const model = this.model && this.model.subModels[0];
          const ia = model && model.inputAssembler;

          if (!ia) {
            return;
          }

          let uv = default_uvs;

          if (this._sprite) {
            this._sprite._calculateUV();

            uv = this._sprite.uv;
          }

          let offset = 0;
          let format = GFXFormat.UNKNOWN;

          for (const a of ia.attributes) {
            if (a.name === GFXAttributeName.ATTR_TEX_COORD) {
              format = a.format;
              break;
            }

            offset += GFXFormatInfos[a.format].size;
          }

          const vb = ia.vertexBuffers[0];
          utils.writeBuffer(new DataView(vbuffer), uv, format, offset, vb.stride);
          vb.update(vbuffer);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_sprite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_texture", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "sharedMaterials", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "sharedMaterials"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "mesh", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "mesh"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "texture", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "texture"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "spriteFrame", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "spriteFrame"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_transparent", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "transparent", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "transparent"), _class2.prototype)), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/ad-hoc/instanced-skinning.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js", "../unlit-quad.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Prefab, Texture2D, Node, _decorator, Component, director, GFXFeature, instantiate, SkeletalAnimationComponent, _applyDecoratedDescriptor, _initializerDefineProperty, UnlitQuadComponent, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp, ccclass, property, InstancedSkinning;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _dec4: void 0,
    _dec5: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _descriptor4: void 0,
    _descriptor5: void 0,
    _descriptor6: void 0,
    _descriptor7: void 0,
    _descriptor8: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Prefab = _cc.Prefab;
      Texture2D = _cc.Texture2D;
      Node = _cc.Node;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      director = _cc.director;
      GFXFeature = _cc.GFXFeature;
      instantiate = _cc.instantiate;
      SkeletalAnimationComponent = _cc.SkeletalAnimationComponent;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }, function (_unlitQuadJs) {
      UnlitQuadComponent = _unlitQuadJs.UnlitQuadComponent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "68c59n+01ZPy5jl1xY5mn38", "instanced-skinning", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("InstancedSkinning", InstancedSkinning = (_dec = ccclass('InstancedSkinning'), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec4 = property([Texture2D]), _dec5 = property(Node), _dec(_class = (_class2 = (_temp = class InstancedSkinning extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "baseline", _descriptor, this);

          _initializerDefineProperty(this, "testgroup", _descriptor2, this);

          _initializerDefineProperty(this, "labelImages", _descriptor3, this);

          _initializerDefineProperty(this, "maxGroupCount", _descriptor4, this);

          _initializerDefineProperty(this, "baselineVisible", _descriptor5, this);

          _initializerDefineProperty(this, "_groupCount", _descriptor6, this);

          _initializerDefineProperty(this, "groupPerColumn", _descriptor7, this);

          _initializerDefineProperty(this, "warningSign", _descriptor8, this);

          this._baselineNode = null;
          this._testNodes = [];
          this._nameLabels = [];
        }

        set groupCount(val) {
          this._groupCount = val;

          this._updateGroups();
        }

        get groupCount() {
          return this._groupCount;
        }

        start() {
          // clamp the initial count if instancing is not supported
          if (!director.root.device.hasFeature(GFXFeature.INSTANCED_ARRAYS)) {
            this._groupCount = Math.min(this._groupCount, 1);

            if (this.warningSign) {
              this.warningSign.active = true;
            }
          }

          this._baselineNode = this._initGroup('Baseline', this.baseline, 0);

          this._updateGroups();

          this._baselineNode.active = this.baselineVisible;
        }

        toggleBaselineGroup(e) {
          this._baselineNode.active = e.isChecked;
        }

        toggleAnimNames(e) {
          for (let i = 0; i < this._nameLabels.length; i++) {
            this._nameLabels[i].active = e.isChecked;
          }
        }

        setGroups(e) {
          this.groupCount = Math.floor(e.progress * this.maxGroupCount);
        }

        _updateGroups() {
          for (let i = 0; i < this._groupCount; i++) {
            if (this._testNodes[i]) {
              this._testNodes[i].active = true;
            } else {
              this._testNodes.push(this._initGroup('TestGroup', this.testgroup, 5 * (i + 1)));
            }
          }

          for (let i = this._groupCount; i < this._testNodes.length; i++) {
            this._testNodes[i].active = false;
          }
        }

        _initGroup(name, prefab, posZ) {
          const len = this.labelImages.length;
          const group = new Node(name);
          group.parent = this.node.scene;

          for (let i = 0; i < len; i++) {
            const posX = Math.floor(posZ / this.groupPerColumn) * 30 + i * 3;
            const inst = instantiate(prefab);
            inst.setPosition(posX, 0, posZ % this.groupPerColumn);
            inst.parent = group;
            const label = inst.getChildByName('Label').getComponent(UnlitQuadComponent);
            label.texture = this.labelImages[i];

            this._nameLabels.push(label.node);

            const animComp = inst.getChildByName('Model').getComponent(SkeletalAnimationComponent);
            const clipName = inst.name = animComp.clips[i].name;
            animComp.play(clipName);
          }

          return group;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "baseline", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "testgroup", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "labelImages", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "maxGroupCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "baselineVisible", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_groupCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "groupPerColumn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "groupCount", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "groupCount"), _class2.prototype), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "warningSign", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/ad-hoc/sponza.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Component, Color, director, CameraComponent, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _class, _class2, _descriptor, _descriptor2, _temp, ccclass, property, Sponza;

  _export({
    _dec: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Color = _cc.Color;
      director = _cc.director;
      CameraComponent = _cc.CameraComponent;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1888cpVdmdHxJvW19Vw6mV2", "sponza", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Sponza", Sponza = (_dec = ccclass('Sponza'), _dec(_class = (_class2 = (_temp = class Sponza extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "loopTime", _descriptor, this);

          _initializerDefineProperty(this, "maxIllum", _descriptor2, this);

          this.halfLoopTime = 0;
          this.color = new Color();
        }

        start() {
          this.ambient = director.root.pipeline.ambient;
          this.halfLoopTime = this.loopTime * 0.5;
          this.camera = this.node.getComponent(CameraComponent);
        }

        update(deltaTime) {
          let illum = 0;
          const t = director.getTotalFrames() % this.loopTime;

          if (t > this.halfLoopTime) {
            illum = Math.sin((t - this.halfLoopTime) / this.halfLoopTime * Math.PI);
          }

          this.ambient.skyIllum = illum * this.maxIllum;
          this.color.r = this.color.g = this.color.b = illum * 255;
          this.camera.clearColor = this.color;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "loopTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3600;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maxIllum", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20000;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/ad-hoc/toggler.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, Component, _decorator, _dec, _class, ccclass, Toggler;

  _export({
    _dec: void 0,
    _class: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Component = _cc.Component;
      _decorator = _cc._decorator;
    }],
    execute: function () {
      cclegacy._RF.push({}, "32abfv2Y8dPZK9pOrJO0y5M", "toggler", undefined);

      ({
        ccclass
      } = _decorator);

      _export("Toggler", Toggler = (_dec = ccclass('Toggler'), _dec(_class = class Toggler extends Component {
        toggleActive() {
          this.node.active = !this.node.active;
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/audio/audio-controller.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, AudioSourceComponent, _decorator, Component, SliderComponent, LabelComponent, ToggleComponent, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _class, _class2, _descriptor, _temp, ccclass, property, AudioController;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      AudioSourceComponent = _cc.AudioSourceComponent;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      SliderComponent = _cc.SliderComponent;
      LabelComponent = _cc.LabelComponent;
      ToggleComponent = _cc.ToggleComponent;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f0467l4fZlMk6vmKrPCPkaW", "audio-controller", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("AudioController", AudioController = (_dec = ccclass('AudioController'), _dec2 = property(AudioSourceComponent), _dec(_class = (_class2 = (_temp = class AudioController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "source", _descriptor, this);

          this.volume = null;
          this.currentTime = null;
          this.volumeLabel = null;
          this.currentTimeLabel = null;
          this.loop = null;
          this.playOnAwake = null;
          this.playing = null;
        }

        start() {
          this.volume = this.node.getChildByName('volume').getComponent(SliderComponent);
          this.currentTime = this.node.getChildByName('currentTime').getComponent(SliderComponent);
          this.volumeLabel = this.volume.node.getChildByName('Numbers').getComponent(LabelComponent);
          this.currentTimeLabel = this.currentTime.node.getChildByName('Numbers').getComponent(LabelComponent);
          this.loop = this.node.getChildByName('loop').getComponent(ToggleComponent);
          this.playOnAwake = this.node.getChildByName('playOnAwake').getComponent(ToggleComponent);
          this.playing = this.node.getChildByName('playing').getComponent(ToggleComponent);
          this.node.getChildByName('name').getComponent(LabelComponent).string = this.source.node.name;
          let loadMode = 'Unknown Load Mode';

          switch (this.source.clip.loadMode) {
            case cc.AudioClip.AudioType.WEB_AUDIO:
              loadMode = 'Web Audio API Mode';
              break;

            case cc.AudioClip.AudioType.DOM_AUDIO:
              loadMode = 'DOM Audio Mode';
              break;

            case cc.AudioClip.AudioType.JSB_AUDIO:
              loadMode = 'JSB Audio Mode';
              break;
          }

          this.node.getChildByName('loadMode').getComponent(LabelComponent).string = loadMode;
        }

        update() {
          this.volume.progress = this.source.volume;
          this.currentTime.progress = this.source.currentTime / this.source.duration;
          this.volumeLabel.string = `${this.source.volume.toFixed(2)} / 1`;
          this.currentTimeLabel.string = `${this.source.currentTime.toFixed(1)} / ${this.source.duration.toFixed(1)}`;
          this.loop.isChecked = this.source.loop;
          this.playOnAwake.isChecked = this.source.playOnAwake;
          this.playing.isChecked = this.source.playing;
        }

        play() {
          this.source.play();
        }

        pause() {
          this.source.pause();
        }

        stop() {
          this.source.stop();
        } // slider callback


        setVolume(e) {
          this.source.volume = e.progress;
        } // slider callback


        setCurrentTime(e) {
          this.source.currentTime = e.progress * this.source.duration;
        } // toggle callback


        setLoop(e) {
          this.source.loop = e.isChecked;
        } // toggle callback


        setPlayOnAwake(e) {
          this.source.playOnAwake = e.isChecked;
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "source", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/audio/audio.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Node, _decorator, Component, AudioSourceComponent, director, Director, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp, ccclass, property, Audio;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Node = _cc.Node;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      AudioSourceComponent = _cc.AudioSourceComponent;
      director = _cc.director;
      Director = _cc.Director;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "fe26e4Vsn5EyLu1/LeX+J90", "audio", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Audio", Audio = (_dec = ccclass('audio'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = (_temp = class Audio extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "node1", _descriptor, this);

          _initializerDefineProperty(this, "node2", _descriptor2, this);
        }

        start() {
          const source = this.node1.getComponent(AudioSourceComponent);
          const source2 = this.node2.getComponent(AudioSourceComponent);
          const t1 = 17;
          const off2 = 5;
          const t2 = 15;
          /* discrete callbacks *
          source.clip.once('started', () => {
              setTimeout(function(){ source.volume = 0.55; }, t1 * 500);
              setTimeout(function(){ source.volume = 0.1; }, t1 * 1000);
               setTimeout(function(){ source2.play(); }, off2 * 1000);
              setTimeout(function(){ source2.volume = 0.75; }, (off2 + t2 * 0.5) * 1000);
              setTimeout(function(){ source2.volume = 1; }, (off2 + t2) * 1000);
          });
          /* smooth transition */

          let startTime1;
          let startTime2;

          const sineLerp = (b, e, t) => {
            return b + (e - b) * (Math.sin((t - 0.5) * Math.PI) + 1) * 0.5;
          };

          const animation1 = () => {
            source.volume = sineLerp(1, 0.1, (performance.now() - startTime1) / (t1 * 1000));
          };

          const animation2 = () => {
            source2.volume = sineLerp(0.5, 1, (performance.now() - startTime2) / (t2 * 1000));
          };

          source.clip.once('started', () => {
            // animate audio 1
            const s2 = source2;
            startTime1 = performance.now();
            director.on(Director.EVENT_BEFORE_UPDATE, animation1);
            setTimeout(() => {
              director.off(Director.EVENT_BEFORE_UPDATE, animation1);
            }, t1 * 1000); // animate audio 2

            setTimeout(() => {
              s2.play();
              startTime2 = performance.now();
              director.on(Director.EVENT_BEFORE_UPDATE, animation2);
            }, off2 * 1000);
            setTimeout(() => {
              director.off(Director.EVENT_BEFORE_UPDATE, animation2);
            }, (off2 + t2) * 1000);
          });
          /**/
        }

        onDisable() {
          this.node1.getComponent(AudioSourceComponent).stop();
          this.node2.getComponent(AudioSourceComponent).stop();
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "node1", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "node2", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/collision-detection/emitter.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Vec3, EffectAsset, _decorator, Color, Component, utils, primitives, Node, ModelComponent, Material, SphereColliderComponent, math, _applyDecoratedDescriptor, _initializerDefineProperty, Element, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _temp, ccclass, property, hintMesh, sphereMesh, outOfBounds, v3_1, Emitter;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _descriptor4: void 0,
    _descriptor5: void 0,
    _descriptor6: void 0,
    _descriptor7: void 0,
    _temp: void 0,
    hintMesh: void 0,
    sphereMesh: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Vec3 = _cc.Vec3;
      EffectAsset = _cc.EffectAsset;
      _decorator = _cc._decorator;
      Color = _cc.Color;
      Component = _cc.Component;
      utils = _cc.utils;
      primitives = _cc.primitives;
      Node = _cc.Node;
      ModelComponent = _cc.ModelComponent;
      Material = _cc.Material;
      SphereColliderComponent = _cc.SphereColliderComponent;
      math = _cc.math;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "0be61hmDlxF0LIemE0HrRrM", "emitter", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      outOfBounds = (v, border = 20) => Math.abs(v.x) > border || Math.abs(v.y) > border || Math.abs(v.z) > border;

      v3_1 = new Vec3();
      Element = class Element extends Component {
        constructor(...args) {
          super(...args);
          this.velocity = new Vec3();
          this.color = new Color();
          this.collided = false;
          this.framesRemaining = 0;
          this.pass = null;
          this.hColor = 0;
        }

      }; // encapsulate an interesting emitter, emitted particles will
      // annihilate after collision, if satisfying filter condition

      _export("Emitter", Emitter = (_dec = ccclass('Emitter'), _dec2 = property(EffectAsset), _dec(_class = (_class2 = (_temp = class Emitter extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "poolSize", _descriptor, this);

          _initializerDefineProperty(this, "group", _descriptor2, this);

          _initializerDefineProperty(this, "mask", _descriptor3, this);

          _initializerDefineProperty(this, "leftAngle", _descriptor4, this);

          _initializerDefineProperty(this, "rightAngle", _descriptor5, this);

          _initializerDefineProperty(this, "color", _descriptor6, this);

          _initializerDefineProperty(this, "effectAsset", _descriptor7, this);

          this._deadpool = [];
          this._livepool = [];
        } // generate everything procedurally


        start() {
          if (!hintMesh) {
            hintMesh = utils.createMesh(primitives.capsule(1));
            sphereMesh = utils.createMesh(primitives.sphere(1));
          } // emitter hint


          const hint = new Node();
          const hintModel = hint.addComponent(ModelComponent);
          const hintMat = new Material();
          hintMat.initialize({
            effectName: 'builtin-standard'
          });
          hintMat.setProperty('albedo', this.color);
          hintMat.setProperty('metallic', 0.1);
          hintModel.material = hintMat;
          hintModel.mesh = hintMesh;
          hint.parent = this.node; // elements

          for (let i = 0; i < this.poolSize; i++) {
            const node = new Node();
            node.parent = this.node; // element info

            const info = node.addComponent(Element);
            info.color.set(this.color); // model

            const model = node.addComponent(ModelComponent);
            const mat = new Material();
            mat.initialize({
              effectName: 'builtin-standard',
              technique: 1 // transparent

            });
            mat.setProperty('metallic', 0.1);
            info.pass = mat.passes[0];
            info.hColor = info.pass.getHandle('albedo');
            info.pass.setUniform(info.hColor, info.color);
            model.material = mat;
            model.mesh = sphereMesh; // collider

            const col = node.addComponent(SphereColliderComponent);
            col.radius = 1;
            col.isTrigger = true;
            col.setGroup(this.group);
            col.setMask(this.mask);
            col.on('onTriggerEnter', e => {
              const collider = e.selfCollider;
              const ele = collider.node.getComponent(Element);

              if (ele.collided) {
                return;
              }

              ele.color.a = 255;
              ele.pass.setUniform(ele.hColor, ele.color);
              ele.collided = true;
              ele.framesRemaining = 5;
              Vec3.set(ele.velocity, 0, 0, 0);
              collider.setGroup(0);
              collider.setMask(0);
            }); // store

            node.active = false;

            this._deadpool.push(info);
          }
        }

        update() {
          for (let i = 0; i < this._livepool.length; i++) {
            const ele = this._livepool[i];

            if (ele.collided) {
              if (ele.framesRemaining-- <= 0) {
                this.reap(ele);
              }
            } else {
              Vec3.add(v3_1, ele.node.position, ele.velocity);
              ele.node.setPosition(v3_1);

              if (outOfBounds(v3_1)) {
                this.reap(ele);
              }
            }
          }

          if (this._deadpool.length > 0) {
            this.resurrect();
          } // for (let i = 0; i < this._deadpool.length; i++) this.resurrect();

        }

        reap(ele) {
          ele.node.active = false;

          this._livepool.splice(this._livepool.indexOf(ele), 1);

          this._deadpool.push(ele);
        }

        reapAll() {
          for (let i = 0; i < this._livepool.length; i++) {
            const ele = this._livepool[i];
            ele.node.active = false;

            this._deadpool.push(ele);
          }

          this._livepool.length = 0;
        }

        resurrect() {
          const ele = this._deadpool.pop();

          const theta = math.toRadian(math.randomRange(this.leftAngle, this.rightAngle));
          const phi = math.randomRange(1, 2);
          const speed = math.randomRange(0.1, 0.3);
          Vec3.set(ele.velocity, Math.cos(theta) * Math.sin(phi) * speed, Math.cos(phi) * speed, Math.sin(theta) * Math.sin(phi) * speed);
          ele.color.a = this.color.a;
          ele.collided = false;
          ele.pass.setUniform(ele.hColor, ele.color);
          const col = ele.node.getComponent(SphereColliderComponent);
          col.setGroup(this.group);
          col.setMask(this.mask);
          ele.node.setPosition(0, 0, 0);

          this._livepool.push(ele);

          ele.node.active = true;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "poolSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 50;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "group", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "mask", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "leftAngle", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "rightAngle", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "color", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Color();
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "effectAsset", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/collision-detection/engine-info.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, Component, LabelComponent, _decorator, _dec, _class, ccclass, EngineInfo;

  _export({
    _dec: void 0,
    _class: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Component = _cc.Component;
      LabelComponent = _cc.LabelComponent;
      _decorator = _cc._decorator;
    }],
    execute: function () {
      cclegacy._RF.push({}, "080d5NntnNJyrm5bWmi6fAY", "engine-info", undefined);

      ({
        ccclass
      } = _decorator);

      _export("EngineInfo", EngineInfo = (_dec = ccclass('EngineInfo'), _dec(_class = class EngineInfo extends Component {
        start() {
          let engine = 'Unknown Physics Engine';

          if (window.CC_PHYSICS_BUILTIN) {
            engine = 'Built-in Collision Detection Engine';
          } else if (window.CC_PHYSICS_CANNON) {
            engine = 'Cannon.js Physics Engine';
          } else if (window.CC_PHYSICS_AMMO) {
            engine = 'Ammo.js Physics Engine';
          }

          this.node.getChildByName('EngineInfo').getComponent(LabelComponent).string = `${engine}\nYou can change this in the project settings menu`;
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/custom-effect/tunnel.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Component, Vec4, Vec2, ModelComponent, director, eventManager, _dec, _class, _temp, ccclass, Tunnel;

  _export({
    _dec: void 0,
    _class: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Vec4 = _cc.Vec4;
      Vec2 = _cc.Vec2;
      ModelComponent = _cc.ModelComponent;
      director = _cc.director;
      eventManager = _cc.eventManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a6060IJdhFH6q3eEI9KzE5Q", "tunnel", undefined);

      ({
        ccclass
      } = _decorator);

      _export("Tunnel", Tunnel = (_dec = ccclass('Tunnel'), _dec(_class = (_temp = class Tunnel extends Component {
        constructor(...args) {
          super(...args);
          this._passes = [];
          this._colorHandles = [];
          this._borderHandles = [];
          this._color = new Vec4(1, 0, 0, 1);
          this._border = new Vec2(0, 0);
        }

        start() {
          const comps = this.getComponentsInChildren(ModelComponent);

          for (const comp of comps) {
            const mat = comp.material;
            const pass = mat.passes[0];

            this._colorHandles.push(pass.getHandle('color'));

            this._borderHandles.push(pass.getHandle('border'));

            this._passes.push(pass);
          }
        }

        update() {
          const time = director.getTotalFrames() * 0.1;
          const margin = time % (Math.PI * 4) > Math.PI ? 0.1 : Math.abs(Math.cos(time)) * 0.1;
          this._color.y = this._color.z = margin * 10;
          this._border.x = this._border.y = margin;
          const len = this._passes.length;

          for (let i = 0; i < len; i++) {
            this._passes[i].setUniform(this._colorHandles[i], this._color);

            this._passes[i].setUniform(this._borderHandles[i], this._border);
          }
        }

        onDisable() {
          eventManager.removeAllListeners();
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/first-person-camera.js", ["cc", "../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Vec2, Vec3, Quat, macro, _decorator, Component, systemEvent, SystemEvent, game, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp, ccclass, property, v2_1, v2_2, v3_1, qt_1, KEYCODE, FirstPersonCamera;

  _export({
    _dec: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _descriptor4: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
      Quat = _cc.Quat;
      macro = _cc.macro;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      systemEvent = _cc.systemEvent;
      SystemEvent = _cc.SystemEvent;
      game = _cc.game;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "41634RuzwBMPotfcRtAog7n", "first-person-camera", undefined);

      ({
        ccclass,
        property
      } = _decorator);
      v2_1 = new Vec2();
      v2_2 = new Vec2();
      v3_1 = new Vec3();
      qt_1 = new Quat();
      KEYCODE = {
        W: 'W'.charCodeAt(0),
        S: 'S'.charCodeAt(0),
        A: 'A'.charCodeAt(0),
        D: 'D'.charCodeAt(0),
        Q: 'Q'.charCodeAt(0),
        E: 'E'.charCodeAt(0),
        SHIFT: macro.KEY.shift
      };

      _export("FirstPersonCamera", FirstPersonCamera = (_dec = property({
        slide: true,
        range: [0.05, 0.5, 0.01]
      }), ccclass(_class = (_class2 = (_temp = class FirstPersonCamera extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "moveSpeed", _descriptor, this);

          _initializerDefineProperty(this, "moveSpeedShiftScale", _descriptor2, this);

          _initializerDefineProperty(this, "damp", _descriptor3, this);

          _initializerDefineProperty(this, "rotateSpeed", _descriptor4, this);

          this._euler = new Vec3();
          this._velocity = new Vec3();
          this._position = new Vec3();
          this._speedScale = 1;
        }

        onLoad() {
          systemEvent.on(SystemEvent.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
          systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
          systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
          systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
          systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
          systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
          Vec3.copy(this._euler, this.node.eulerAngles);
          Vec3.copy(this._position, this.node.position);
        }

        onDestroy() {
          systemEvent.off(SystemEvent.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
          systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
          systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
          systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
          systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
          systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        }

        update(dt) {
          // position
          Vec3.transformQuat(v3_1, this._velocity, this.node.rotation);
          Vec3.scaleAndAdd(this._position, this._position, v3_1, this.moveSpeed * this._speedScale);
          Vec3.lerp(v3_1, this.node.position, this._position, dt / this.damp);
          this.node.setPosition(v3_1); // rotation

          Quat.fromEuler(qt_1, this._euler.x, this._euler.y, this._euler.z);
          Quat.slerp(qt_1, this.node.rotation, qt_1, dt / this.damp);
          this.node.setRotation(qt_1);
        }

        onMouseWheel(e) {
          const delta = -e.getScrollY() * this.moveSpeed * 0.1; // delta is positive when scroll down

          Vec3.transformQuat(v3_1, Vec3.UNIT_Z, this.node.rotation);
          Vec3.scaleAndAdd(this._position, this.node.position, v3_1, delta);
        }

        onKeyDown(e) {
          const v = this._velocity;

          if (e.keyCode === KEYCODE.SHIFT) {
            this._speedScale = this.moveSpeedShiftScale;
          } else if (e.keyCode === KEYCODE.W) {
            if (v.z === 0) {
              v.z = -1;
            }
          } else if (e.keyCode === KEYCODE.S) {
            if (v.z === 0) {
              v.z = 1;
            }
          } else if (e.keyCode === KEYCODE.A) {
            if (v.x === 0) {
              v.x = -1;
            }
          } else if (e.keyCode === KEYCODE.D) {
            if (v.x === 0) {
              v.x = 1;
            }
          } else if (e.keyCode === KEYCODE.Q) {
            if (v.y === 0) {
              v.y = -1;
            }
          } else if (e.keyCode === KEYCODE.E) {
            if (v.y === 0) {
              v.y = 1;
            }
          }
        }

        onKeyUp(e) {
          const v = this._velocity;

          if (e.keyCode === KEYCODE.SHIFT) {
            this._speedScale = 1;
          } else if (e.keyCode === KEYCODE.W) {
            if (v.z < 0) {
              v.z = 0;
            }
          } else if (e.keyCode === KEYCODE.S) {
            if (v.z > 0) {
              v.z = 0;
            }
          } else if (e.keyCode === KEYCODE.A) {
            if (v.x < 0) {
              v.x = 0;
            }
          } else if (e.keyCode === KEYCODE.D) {
            if (v.x > 0) {
              v.x = 0;
            }
          } else if (e.keyCode === KEYCODE.Q) {
            if (v.y < 0) {
              v.y = 0;
            }
          } else if (e.keyCode === KEYCODE.E) {
            if (v.y > 0) {
              v.y = 0;
            }
          }
        }

        onTouchStart(e) {
          if (game.canvas.requestPointerLock) {
            game.canvas.requestPointerLock();
          }
        }

        onTouchMove(e) {
          e.getStartLocation(v2_1);

          if (v2_1.x > game.canvas.width * 0.4) {
            // rotation
            e.getDelta(v2_2);
            this._euler.y -= v2_2.x * this.rotateSpeed * 0.1;
            this._euler.x += v2_2.y * this.rotateSpeed * 0.1;
          } else {
            // position
            e.getLocation(v2_2);
            Vec2.subtract(v2_2, v2_2, v2_1);
            this._velocity.x = v2_2.x * 0.01;
            this._velocity.z = -v2_2.y * 0.01;
          }
        }

        onTouchEnd(e) {
          if (document.exitPointerLock) {
            document.exitPointerLock();
          }

          e.getStartLocation(v2_1);

          if (v2_1.x < game.canvas.width * 0.4) {
            // position
            this._velocity.x = 0;
            this._velocity.z = 0;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeedShiftScale", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "damp", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "rotateSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/jellyfish/jellyfish.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Vec3, Quat, _decorator, Component, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, ccclass, property, _pos, _quat, JellyFish;

  _export({
    _dec: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Vec3 = _cc.Vec3;
      Quat = _cc.Quat;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "0a93azrzEdN/btLNf6splxl", "jellyfish", undefined);

      ({
        ccclass,
        property
      } = _decorator);
      _pos = new Vec3();
      _quat = new Quat();

      _export("JellyFish", JellyFish = (_dec = ccclass('JellyFish'), _dec(_class = (_class2 = (_temp = class JellyFish extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "speed", _descriptor, this);

          _initializerDefineProperty(this, "mixDuration", _descriptor2, this);

          _initializerDefineProperty(this, "range", _descriptor3, this);

          this._dstPos = new Vec3();
          this._dstRot = new Quat();
          this._dir = new Vec3();
          this._changing = true;
          this._time = 0;
        }

        onLoad() {
          const x = Math.random() * this.range - this.range / 2;
          const y = Math.random() * this.range - this.range / 2;
          const z = Math.random() * this.range - this.range / 2;
          this.node.setPosition(x, y, z);
          this.newDst();
        }

        newDst() {
          this._dstPos.x = Math.random() * this.range - this.range / 2;
          this._dstPos.y = Math.random() * this.range - this.range / 2;
          this._dstPos.z = Math.random() * this.range - this.range / 2;
          this.node.getPosition(_pos);
          const temp = new Vec3();
          temp.set(this._dstPos);

          this._dstPos.subtract(_pos);

          this._dir.set(this._dstPos);

          this._dstPos.set(temp);

          const angle = Math.atan2(this._dir.x, this._dir.z);
          this._dstRot.x = 0;
          this._dstRot.y = 1 * Math.sin(angle / 2);
          this._dstRot.z = 0;
          this._dstRot.w = Math.cos(angle / 2);
          Quat.normalize(this._dstRot, this._dstRot); // let angle = cc.Vec3.angle(_pos, this._dstPos);
          // this._dstRot.x = _pos.x * Math.sin(angle/2);
          // this._dstRot.y = _pos.y * Math.sin(angle/2);
          // this._dstRot.z = _pos.z * Math.sin(angle/2);
          // this._dstRot.w = Math.cos(angle/2);
          // cc.Quat.normalize(this._dstRot, this._dstRot);
          // this._dstPos.sub(_pos, this._dir);

          this._dir.normalize();

          this._dir.multiplyScalar(this.speed);

          this._changing = true;
          this._time = 0;
        }

        update(dt) {
          this._time += dt;

          if (this._changing) {
            if (this._time >= this.mixDuration) {
              this.node.setRotation(this._dstRot);
              this._changing = false;
            } else {
              const ratio = this._time / this.mixDuration;
              this.node.getRotation(_quat);

              _quat.lerp(this._dstRot, ratio);

              this.node.setRotation(_quat);
            }
          }

          this.node.getPosition(_pos);

          _pos.add(this._dir);

          this.node.setPosition(_pos);

          _pos.subtract(this._dstPos);

          if (_pos.length() < 5) {
            this.newDst();
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "speed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.01;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "mixDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "range", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 50;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/jellyfish/spawn.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js", "./jellyfish.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Prefab, _decorator, Component, instantiate, _applyDecoratedDescriptor, _initializerDefineProperty, JellyFish, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, ccclass, property, Spawn;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Prefab = _cc.Prefab;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      instantiate = _cc.instantiate;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }, function (_jellyfishJs) {
      JellyFish = _jellyfishJs.JellyFish;
    }],
    execute: function () {
      cclegacy._RF.push({}, "6b7aeXx11NGZLgGo51ugQp9", "spawn", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Spawn", Spawn = (_dec = ccclass('Spawn'), _dec2 = property(Prefab), _dec(_class = (_class2 = (_temp = class Spawn extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "prefab", _descriptor, this);

          _initializerDefineProperty(this, "count", _descriptor2, this);

          _initializerDefineProperty(this, "range", _descriptor3, this);
        }

        start() {
          for (let i = 0; i < this.count; ++i) {
            setTimeout(() => {
              if (!this.prefab) {
                return;
              }

              const node = instantiate(this.prefab);
              node.getComponent(JellyFish).range = this.range;
              this.node.addChild(node);
            }, Math.random() * 3000);
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "count", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "range", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/pbr/geometries.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, Component, Color, utils, primitives, Node, ModelComponent, Material, math, _decorator, _dec, _class, ccclass, Geometries;

  _export({
    _dec: void 0,
    _class: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Component = _cc.Component;
      Color = _cc.Color;
      utils = _cc.utils;
      primitives = _cc.primitives;
      Node = _cc.Node;
      ModelComponent = _cc.ModelComponent;
      Material = _cc.Material;
      math = _cc.math;
      _decorator = _cc._decorator;
    }],
    execute: function () {
      cclegacy._RF.push({}, "6bb243zHfFJi4MLeBdak3WZ", "geometries", undefined);

      ({
        ccclass
      } = _decorator);

      _export("Geometries", Geometries = (_dec = ccclass('Geometries'), _dec(_class = class Geometries extends Component {
        start() {
          this.node.removeAllChildren();
          const rows = 7;
          const cols = 7;
          const stride = 2.5;
          const albedo = new Color(128, 0, 0);
          const meshSphere = utils.createMesh(primitives.sphere(1, {
            segments: 64
          }));

          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              const node = new Node();
              node.parent = this.node;
              node.setPosition((j - Math.floor(cols / 2)) * stride, (i - Math.floor(rows / 2)) * stride, 0);
              const comp = node.addComponent(ModelComponent);
              comp.mesh = meshSphere;
              const m = new Material();
              m.initialize({
                effectName: 'builtin-standard'
              });
              m.setProperty('roughness', math.clamp(j / cols, 0.05, 1));
              m.setProperty('metallic', i / rows);
              m.setProperty('albedo', albedo);
              comp.material = m;
            }
          }
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/physics/collider-manager.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Vec3, Node, _decorator, Component, instantiate, math, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp, ccclass, property, v3_1, ColliderManager;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _descriptor4: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Vec3 = _cc.Vec3;
      Node = _cc.Node;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      instantiate = _cc.instantiate;
      math = _cc.math;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "95b4fpK+A9Cmbfc9vOmsGsJ", "collider-manager", undefined);

      ({
        ccclass,
        property
      } = _decorator);
      v3_1 = new Vec3();

      _export("ColliderManager", ColliderManager = (_dec = ccclass('ColliderManager'), _dec2 = property([Node]), _dec3 = property({
        type: Node
      }), _dec(_class = (_class2 = (_temp = class ColliderManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "count", _descriptor, this);

          _initializerDefineProperty(this, "boundHalfLength", _descriptor2, this);

          _initializerDefineProperty(this, "prefabs", _descriptor3, this);

          _initializerDefineProperty(this, "tipsNode", _descriptor4, this);
        }

        start() {
          this.tipsNode.active = window.CC_PHYSICS_BUILTIN;
          this.node.removeAllChildren();

          for (let i = 0; i < this.count; i++) {
            const node = instantiate(this.prefabs[Math.round(Math.random())]);
            node.parent = this.node;
            node.setPosition(math.randomRange(-2, 2), 3 + i * 2, math.randomRange(-2, 2));
            node.setRotationFromEuler(math.randomRange(0, 180), math.randomRange(0, 180), math.randomRange(0, 180));
          }
        }

        update() {
          // handle bounds
          for (const node of this.node.children) {
            node.getPosition(v3_1);

            if (v3_1.y < -10) {
              v3_1.y = 30;
            } else if (v3_1.x > this.boundHalfLength + 3) {
              v3_1.x = -(this.boundHalfLength - 3);
            } else if (v3_1.x < -(this.boundHalfLength + 3)) {
              v3_1.x = this.boundHalfLength - 3;
            } else if (v3_1.z > this.boundHalfLength + 3) {
              v3_1.z = -(this.boundHalfLength - 3);
            } else if (v3_1.z < -(this.boundHalfLength + 3)) {
              v3_1.z = this.boundHalfLength - 3;
            }

            node.setPosition(v3_1);
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "count", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 200;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "boundHalfLength", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 12.5;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "prefabs", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "tipsNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/physics/collider.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, Vec3, Vec4, _decorator, Component, RigidBodyComponent, ModelComponent, _dec, _class, _temp, ccclass, v3_1, static_color, Collider;

  _export({
    _dec: void 0,
    _class: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Vec3 = _cc.Vec3;
      Vec4 = _cc.Vec4;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      RigidBodyComponent = _cc.RigidBodyComponent;
      ModelComponent = _cc.ModelComponent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "9734djZWa9MEbCNBh1ENuMW", "collider", undefined);

      ({
        ccclass
      } = _decorator);
      v3_1 = new Vec3();
      static_color = new Vec4(0.3, 0.3, 0.3, 1.0);

      _export("Collider", Collider = (_dec = ccclass('Collider'), _dec(_class = (_temp = class Collider extends Component {
        constructor(...args) {
          super(...args);
          this._body = null;
          this._initialColor = null;
          this._pass = null;
          this._handle = 0;
          this._color = new Vec4();
        }

        start() {
          this._body = this.node.getComponent(RigidBodyComponent);
          const mat = this.node.getComponent(ModelComponent).material; // Vec4 and Color are compatible with each other, but Vec4 is more efficient when updated frequently

          this._initialColor = new Vec4(mat.getProperty('mainColor'));
          this._pass = mat.passes[0];
          this._handle = this._pass.getHandle('mainColor');
        }

        update() {
          // visualize speed
          this._body.getLinearVelocity(v3_1);

          let speed = v3_1.length();
          speed /= speed + 1;
          Vec4.lerp(this._color, static_color, this._initialColor, speed);

          this._pass.setUniform(this._handle, this._color);
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/physics/ground.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Node, _decorator, Component, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, ccclass, property, sineLerp, PhysicsGround;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Node = _cc.Node;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "22c90hEyfxHvbY8lQgqlkQ+", "ground", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      sineLerp = (b, e, t) => {
        return b + (e - b) * (Math.sin((t - 0.5) * Math.PI) + 1) * 0.5;
      };

      _export("PhysicsGround", PhysicsGround = (_dec = ccclass('PhysicsGround'), _dec2 = property(Node), _dec(_class = (_class2 = (_temp = class PhysicsGround extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "spinDuration", _descriptor, this);

          _initializerDefineProperty(this, "spinInterval", _descriptor2, this);

          _initializerDefineProperty(this, "manualSpinSliderNode", _descriptor3, this);

          this._time = 0;
          this._angle = 0;
          this._autoSpin = true;
        }

        update(deltaTime) {
          // spin once in a while
          if (this._autoSpin) {
            this._time += deltaTime;
            const t = Math.min(this.spinInterval - this._time % this.spinInterval, this.spinDuration);
            const back = Math.floor(this._time / this.spinInterval) % 2;
            this._angle = sineLerp(back ? 0 : 180, back ? 180 : 0, t / this.spinDuration);
          }

          this.node.setRotationFromEuler(0, 0, this._angle);
        } // toggle callback


        toggleSpin(e) {
          this._autoSpin = e.isChecked;
          this.manualSpinSliderNode.active = !e.isChecked;
        } // slider callback


        setAngle(e) {
          this._angle = (0.5 - e.progress) * 180;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spinDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spinInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "manualSpinSliderNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/physics-checker/PhysicsEnvCheck.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, Enum, _decorator, Component, LabelComponent, SpriteComponent, _dec, _dec2, _class, _temp, ccclass, property, menu, EPhysicsItem, PhysicsEnvCheck;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _temp: void 0,
    EPhysicsItem: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Enum = _cc.Enum;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      LabelComponent = _cc.LabelComponent;
      SpriteComponent = _cc.SpriteComponent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ac794yPoAdBvZzv5/e8WT2m", "PhysicsEnvCheck", undefined);

      ({
        ccclass,
        property,
        menu
      } = _decorator);

      (function (EPhysicsItem) {
        EPhysicsItem[EPhysicsItem["BUILTIN"] = 1] = "BUILTIN";
        EPhysicsItem[EPhysicsItem["CANNON"] = 2] = "CANNON";
        EPhysicsItem[EPhysicsItem["AMMO"] = 4] = "AMMO";
        EPhysicsItem[EPhysicsItem["CANNON_AMMO"] = EPhysicsItem.CANNON + EPhysicsItem.AMMO] = "CANNON_AMMO";
        EPhysicsItem[EPhysicsItem["ALL"] = -1] = "ALL";
      })(EPhysicsItem || (EPhysicsItem = {}));

      Enum(EPhysicsItem);

      _export("PhysicsEnvCheck", PhysicsEnvCheck = (_dec = ccclass('PhysicsEnvCheck'), _dec2 = menu('physics/PhysicsEnvCheck'), _dec(_class = _dec2(_class = (_temp = class PhysicsEnvCheck extends Component {
        constructor(...args) {
          super(...args);
          this.physics = EPhysicsItem.CANNON_AMMO;
        }

        onLoad() {
          let lbCom;
          let sprCom;

          if (window.CC_PHYSICS_BUILTIN) {
            lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
            lbCom.string = '当前物理：builtin';
          } else if (window.CC_PHYSICS_CANNON) {
            lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
            lbCom.string = '当前物理：cannon.js';
          } else if (window.CC_PHYSICS_AMMO) {
            lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
            lbCom.string = '当前物理：ammo.js';
          } else {
            lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
            lbCom.string = '当前物理：none';
          }

          const name = this.node.name;

          if (name === 'cannon-ammo') {
            this.physics = EPhysicsItem.CANNON_AMMO;
          } else if (name === 'builtin') {
            this.physics = EPhysicsItem.BUILTIN;
          } else if (name === 'cannon') {
            this.physics = EPhysicsItem.CANNON;
          } else if (name === 'ammo') {
            this.physics = EPhysicsItem.AMMO;
          } else if (name === 'builtin-cannon-ammo') {
            this.physics = EPhysicsItem.ALL;
          }

          switch (this.physics) {
            case EPhysicsItem.ALL:
              break;

            case EPhysicsItem.CANNON_AMMO:
              if (window.CC_PHYSICS_CANNON || window.CC_PHYSICS_AMMO) {
                break;
              }

              lbCom = this.node.getChildByName('lb').getComponent(LabelComponent);
              lbCom.enabled = true;
              lbCom.string = '测试此场景需要将物理模块设置为 cannon.js 或 ammo.js';
              sprCom = this.getComponentInChildren(SpriteComponent);
              sprCom.enabled = true;
              break;

            case EPhysicsItem.CANNON:
              if (!window.CC_PHYSICS_CANNON) {
                lbCom = this.node.getChildByName('lb').getComponent(LabelComponent);
                lbCom.enabled = true;
                lbCom.string = '测试此场景需要将物理模块设置为 cannon.js';
                sprCom = this.getComponentInChildren(SpriteComponent);
                sprCom.enabled = true;
              }

              break;

            case EPhysicsItem.AMMO:
              if (!window.CC_PHYSICS_AMMO) {
                lbCom = this.node.getChildByName('lb').getComponent(LabelComponent);
                lbCom.enabled = true;
                lbCom.string = '测试此场景需要将物理模块设置为 ammo.js';
                sprCom = this.getComponentInChildren(SpriteComponent);
                sprCom.enabled = true;
              }

              break;

            case EPhysicsItem.BUILTIN:
              if (!window.CC_PHYSICS_BUILTIN) {
                lbCom = this.node.getChildByName('lb').getComponent(LabelComponent);
                lbCom.enabled = true;
                lbCom.string = '测试此场景需要将物理模块设置为 builtin';
                sprCom = this.getComponentInChildren(SpriteComponent);
                sprCom.enabled = true;
              }

              break;
          }
        }

      }, _temp)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/skill-effect/BladeStorm.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Prefab, Node, _decorator, instantiate, Component, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _class, _descriptor, _descriptor2, _temp, _dec2, _dec3, _dec4, _class3, _class4, _descriptor3, _descriptor4, _temp2, ccclass, property, SkilType, Fight, BladeStorm;

  _export({
    _dec: void 0,
    _class: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _temp: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _dec4: void 0,
    _class3: void 0,
    _class4: void 0,
    _descriptor3: void 0,
    _descriptor4: void 0,
    _temp2: void 0,
    SkilType: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Prefab = _cc.Prefab;
      Node = _cc.Node;
      _decorator = _cc._decorator;
      instantiate = _cc.instantiate;
      Component = _cc.Component;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "19951pxMERHsK5hIrDxX1BZ", "BladeStorm", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      (function (SkilType) {
        SkilType[SkilType["SELF"] = 0] = "SELF";
        SkilType[SkilType["ENEMY"] = 1] = "ENEMY";
      })(SkilType || (SkilType = {}));

      Fight = (_dec = property(Prefab), (_class = (_temp = class Fight {
        constructor() {
          _initializerDefineProperty(this, "type", _descriptor, this);

          _initializerDefineProperty(this, "effect", _descriptor2, this);
        }

        explo() {
          const effect = instantiate(this.effect);
          effect.setWorldPosition(0, 0, 0);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "type", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return SkilType.SELF;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "effect", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class));

      _export("BladeStorm", BladeStorm = (_dec2 = ccclass('BladeStorm'), _dec3 = property([Prefab]), _dec4 = property([Node]), _dec2(_class3 = (_class4 = (_temp2 = class BladeStorm extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "effect", _descriptor3, this);

          _initializerDefineProperty(this, "Point", _descriptor4, this);
        } // @property(Prefab)
        // new_one: Prefab = null;
        // @property(fight)
        // fight1: fight=null;

        /*get bbb(){
            return this._aaa;
        }
         set bbb (value){
            this._aaa = value;
         }
         _aaa = '';*/


        fire() {
          // console.log('comming');
          if (!this.enabled) {
            return;
          }

          const new_one = instantiate(this.effect[0]);
          new_one.setParent(this.node.parent);
          new_one.setWorldPosition(1, 7, 20); // const self_blade = instantiate(this.effect[6]) as Node;
          // self_blade.setParent(this.node.parent);
          // self_blade.setWorldPosition(1,2,3);

          const point1 = instantiate(this.effect[2]);
          point1.setParent(this.Point[0]);
          point1.setWorldPosition(this.Point[0].getWorldPosition());
          const point2 = instantiate(this.effect[1]);
          point2.setParent(this.Point[1]);
          point2.setWorldPosition(this.Point[1].getWorldPosition());
          const point3 = instantiate(this.effect[2]);
          point3.setParent(this.Point[2]);
          point3.setWorldPosition(this.Point[2].getWorldPosition()); // const CFD = instantiate(this.effect[3]) as Node;
          // CFD.setParent(this.node.parent);
          // CFD.setWorldPosition(CFD.getPosition(this.Point[0]));
        }

        ring() {
          if (!this.enabled) {
            return;
          }

          const point4 = instantiate(this.effect[3]);
          point4.setParent(this.node.parent);
          point4.setWorldPosition(1, 2, 4.5);
          const point5 = instantiate(this.effect[4]);
          point5.setParent(this.node.parent);
          point5.setWorldPosition(1, 2, 4.5);
          /*setTimeout(() => {
              this.node
          }, 1000);  */
        }
        /*heal(){
            //console.log('comming');
            const new_one = instantiate(this.effect[2]) as Node;
            new_one.setParent(this.node.parent);
            new_one.setWorldPosition(1,2,3);
        }*/
        // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp2), (_descriptor3 = _applyDecoratedDescriptor(_class4.prototype, "effect", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class4.prototype, "Point", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class4)) || _class3));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/skill-effect/healspell.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Prefab, Node, _decorator, Component, instantiate, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp, ccclass, property, HealSpell;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Prefab = _cc.Prefab;
      Node = _cc.Node;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      instantiate = _cc.instantiate;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "407b91FraxBopu0dt4vtVYA", "healspell", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HealSpell", HealSpell = (_dec = ccclass('HealSpell'), _dec2 = property([Prefab]), _dec3 = property([Node]), _dec(_class = (_class2 = (_temp = class HealSpell extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "effect", _descriptor, this);

          _initializerDefineProperty(this, "Point", _descriptor2, this);
        }

        heal() {
          if (!this.enabled) {
            return;
          }

          const point0 = instantiate(this.effect[0]);
          point0.setParent(this.node);
          point0.setPosition(0, 0, 0);
          const point1 = instantiate(this.effect[1]);
          point1.setParent(this.Point[0]);
          point1.setWorldPosition(this.Point[0].getWorldPosition());
          const point2 = instantiate(this.effect[2]);
          point2.setParent(this.Point[1]);
          point2.setWorldPosition(this.Point[1].getWorldPosition());
          const point3 = instantiate(this.effect[1]);
          point3.setParent(this.Point[2]);
          point3.setWorldPosition(this.Point[2].getWorldPosition());
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "effect", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "Point", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/skill-effect/self-destory.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, Component, _decorator, _dec, _class, ccclass, property, SelfDestory;

  _export({
    _dec: void 0,
    _class: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Component = _cc.Component;
      _decorator = _cc._decorator;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d1bc3dAYZ9DrYgEUAHLfjj3", "self-destory", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SelfDestory", SelfDestory = (_dec = ccclass('SelfDestory'), _dec(_class = class SelfDestory extends Component {
        /* class member could be defined like this */
        // dummy = '';

        /* use `property` decorator if your want the member to be serializable */
        // @property
        // serializableDummy = 0;
        start() {
          setTimeout(() => {
            if (this.node && this.node.destroy()) {
              console.log('destroy complete');
            }
          }, 5000);
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/skin/SSS.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Component, ModelComponent, _dec, _class, _temp, ccclass, SSS;

  _export({
    _dec: void 0,
    _class: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      ModelComponent = _cc.ModelComponent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "5d0e06TqCJOgYWfO1jCim+/", "SSS", undefined);

      ({
        ccclass
      } = _decorator);

      _export("SSS", SSS = (_dec = ccclass('SSS'), _dec(_class = (_temp = class SSS extends Component {
        constructor(...args) {
          super(...args);
          this._handle = null;
          this._pass = null;
        }

        start() {
          const mat = this.node.getComponent(ModelComponent).material;
          this._pass = mat.passes[0];
          this._handle = this._pass.getHandle('scattering');
        }

        setSSSIntensity(e) {
          this._pass.setUniform(this._handle, e.progress);
        }

        toggle(e) {
          this.node.active = e.isChecked;
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/skin/label-modifier.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Component, LabelComponent, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _class, _class2, _descriptor, _temp, ccclass, property, LabelModifier;

  _export({
    _dec: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      LabelComponent = _cc.LabelComponent;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b083fbk5OpHE6avlzMP8i4O", "label-modifier", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LabelModifier", LabelModifier = (_dec = ccclass('LabelModifier'), _dec(_class = (_class2 = (_temp = class LabelModifier extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "prefix", _descriptor, this);

          this._label = null;
        }

        start() {
          this._label = this.node.getComponent(LabelComponent);
        }

        setStringBySliderValue(e) {
          if (this._label) {
            this._label.string = this.prefix + e.progress.toFixed(2);
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "prefix", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/skin/rotor.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Component, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _class, _class2, _descriptor, _temp, ccclass, property, Rotor;

  _export({
    _dec: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "16cc7mJ/bNIUKCCsSKIjPsT", "rotor", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Rotor", Rotor = (_dec = ccclass('Rotor'), _dec(_class = (_class2 = (_temp = class Rotor extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "speed", _descriptor, this);
        }

        update(deltaTime) {
          const eu = this.node.eulerAngles;
          this.node.setRotationFromEuler(eu.x, eu.y + deltaTime * this.speed, eu.z);
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "speed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/tangent-visualizer.js", ["cc", "../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Vec3, ModelComponent, _decorator, Component, Material, GFXPrimitiveMode, GFXAttributeName, Color, utils, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp, ccclass, property, executeInEditMode, requireComponent, v3_1, v3_2, TangentVisualizer;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Vec3 = _cc.Vec3;
      ModelComponent = _cc.ModelComponent;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Material = _cc.Material;
      GFXPrimitiveMode = _cc.GFXPrimitiveMode;
      GFXAttributeName = _cc.GFXAttributeName;
      Color = _cc.Color;
      utils = _cc.utils;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e318flB6JhFT5zHRmxMuBHD", "tangent-visualizer", undefined);

      ({
        ccclass,
        property,
        executeInEditMode,
        requireComponent
      } = _decorator);
      v3_1 = new Vec3();
      v3_2 = new Vec3();

      _export("TangentVisualizer", TangentVisualizer = (_dec = ccclass('TangentVisualizer'), _dec2 = requireComponent(ModelComponent), _dec3 = property(ModelComponent), _dec(_class = _dec2(_class = executeInEditMode(_class = (_class2 = (_temp = class TangentVisualizer extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "target", _descriptor, this);

          _initializerDefineProperty(this, "scale", _descriptor2, this);

          this._material = new Material();
        }

        set apply(val) {
          this.refresh();
        }

        get apply() {
          return false;
        }

        start() {
          this._material.initialize({
            effectName: 'builtin-unlit',
            defines: {
              USE_VERTEX_COLOR: true
            },
            states: {
              primitive: GFXPrimitiveMode.LINE_LIST
            }
          });

          this.refresh();
        }

        refresh() {
          if (!this.target) {
            return;
          }

          const comps = this.node.getComponents(ModelComponent);

          if (comps.length < 3) {
            console.warn('three model component on this node is needed');
            return;
          }

          const position = this.target.mesh.readAttribute(0, GFXAttributeName.ATTR_POSITION);
          const normal = this.target.mesh.readAttribute(0, GFXAttributeName.ATTR_NORMAL);
          const tangent = this.target.mesh.readAttribute(0, GFXAttributeName.ATTR_TANGENT);

          const bitangent = this._generateBitangent(normal, tangent);

          this._updateModel(comps[0], position, normal, Color.MAGENTA);

          this._updateModel(comps[1], position, tangent, Color.CYAN, 4);

          this._updateModel(comps[2], position, bitangent, Color.YELLOW);
        }

        _updateModel(comp, pos, data, color, stride = 3) {
          comp.material = this._material;
          comp.mesh = utils.createMesh({
            positions: Array(pos.length / 3 * 2).fill(0).map((_, i) => {
              const ofs = Math.floor(i / 2);
              Vec3.fromArray(v3_1, pos, ofs * 3);

              if (i % 2) {
                Vec3.scaleAndAdd(v3_1, v3_1, Vec3.fromArray(v3_2, data, ofs * stride), this.scale);
              }

              return Vec3.toArray([], v3_1);
            }).reduce((acc, cur) => (cur.forEach(c => acc.push(c)), acc), []),
            colors: Array(pos.length / 3 * 2).fill(0).map((_, i) => {
              return Color.toArray([], i % 2 ? color : Color.WHITE);
            }).reduce((acc, cur) => (cur.forEach(c => acc.push(c)), acc), []),
            primitiveMode: GFXPrimitiveMode.LINE_LIST,
            minPos: new Vec3(-Infinity, -Infinity, -Infinity),
            maxPos: new Vec3(Infinity, Infinity, Infinity)
          });
        }

        _generateBitangent(normal, tangent) {
          const bitangent = normal.slice();
          const vCount = normal.length / 3;

          for (let i = 0; i < vCount; i++) {
            Vec3.fromArray(v3_1, normal, i * 3);
            Vec3.fromArray(v3_2, tangent, i * 4);
            Vec3.multiplyScalar(v3_1, Vec3.cross(v3_1, v3_1, v3_2), tangent[i * 4 + 3]);
            Vec3.toArray(bitangent, v3_1, i * 3);
          }

          return bitangent;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "scale", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "apply", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "apply"), _class2.prototype)), _class2)) || _class) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/testlist/scenelist.js", ["cc", "../../_virtual/_rollupPluginBabelHelpers.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Prefab, _decorator, Component, instantiate, _applyDecoratedDescriptor, _initializerDefineProperty, _dec, _dec2, _class, _class2, _descriptor, _temp, ccclass, property, sceneArray, SceneManager;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Prefab = _cc.Prefab;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      instantiate = _cc.instantiate;
    }, function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }],
    execute: function () {
      cclegacy._RF.push({}, "56ce0MAdDJH2qBewyMuTQnW", "scenelist", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("sceneArray", sceneArray = []);

      _export("SceneManager", SceneManager = (_dec = ccclass('SceneManager'), _dec2 = property({
        type: Prefab
      }), _dec(_class = (_class2 = (_temp = class SceneManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "itemPrefab", _descriptor, this);
        }

        onLoad() {
          if (this.itemPrefab) {
            for (let i = 0; i < sceneArray.length; i++) {
              const item = instantiate(this.itemPrefab);
              this.node.addChild(item);
            }
          }
        }

        start() {}

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/testlist/backbutton.js", ["cc", "./scenelist.js"], function (_export, _context) {
  "use strict";

  var cclegacy, Vec3, _decorator, Component, game, ScrollViewComponent, director, LayoutComponent, sceneArray, _dec, _class, _class2, _temp, ccclass, property, BackButton;

  _export({
    _dec: void 0,
    _class: void 0,
    _class2: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      Vec3 = _cc.Vec3;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      game = _cc.game;
      ScrollViewComponent = _cc.ScrollViewComponent;
      director = _cc.director;
      LayoutComponent = _cc.LayoutComponent;
    }, function (_scenelistJs) {
      sceneArray = _scenelistJs.sceneArray;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b20edYWY5pMo6v9nvpXwDsb", "backbutton", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BackButton", BackButton = (_dec = ccclass('BackButton'), _dec(_class = (_temp = _class2 = class BackButton extends Component {
        static get offset() {
          return BackButton._offset;
        }

        static set offset(value) {
          BackButton._offset = value;
        }

        static saveOffset() {
          if (BackButton._scrollNode) {
            BackButton._offset = new Vec3(0, BackButton._scrollCom.getScrollOffset().y, 0);
          }
        }

        static saveIndex(index) {
          BackButton._sceneIndex = index;
          BackButton.refreshButton();
        }

        static refreshButton() {
          if (BackButton._sceneIndex === -1) {
            BackButton._prevNode.active = false;
            BackButton._nextNode.active = false;
          } else {
            BackButton._prevNode.active = true;
            BackButton._nextNode.active = true;
          }
        }

        __preload() {
          const sceneInfo = game._sceneInfos;
          let firstIndex = 0;
          let lastIndex = 0;
          let sceneString = '';

          for (let i = 0; i < sceneInfo.length; i++) {
            sceneString = sceneInfo[i].url;
            firstIndex = sceneString.lastIndexOf('/') + 1;
            lastIndex = sceneString.lastIndexOf('.scene');
            sceneString = sceneString.substring(firstIndex, lastIndex);

            if (sceneString === 'testlist') {
              continue;
            }

            sceneArray.push(sceneString);
          }
        }

        start() {
          game.addPersistRootNode(this.node);
          BackButton._scrollNode = this.node.getParent().getChildByPath('Canvas/ScrollView');

          if (BackButton._scrollNode) {
            BackButton._scrollCom = BackButton._scrollNode.getComponent(ScrollViewComponent);
          }

          BackButton._blockInput = this.node.getChildByName('BlockInput');
          BackButton._blockInput.active = false;
          BackButton._prevNode = this.node.getChildByName('PrevButton');
          BackButton._nextNode = this.node.getChildByName('NextButton');

          if (BackButton._prevNode && BackButton._nextNode) {
            BackButton.refreshButton();
          }
        }

        backToList() {
          BackButton._blockInput.active = true;
          director.loadScene('testlist', () => {
            BackButton._sceneIndex = -1;
            BackButton.refreshButton();
            BackButton._scrollNode = this.node.getParent().getChildByPath('Canvas/ScrollView');

            if (BackButton._scrollNode) {
              BackButton._scrollCom = BackButton._scrollNode.getComponent(ScrollViewComponent); // @ts-ignore

              BackButton._scrollCom._content.getComponent(LayoutComponent).updateLayout();

              BackButton._scrollCom.scrollToOffset(BackButton.offset, 0.1, true);
            }

            BackButton._blockInput.active = false;
          });
        }

        nextscene() {
          BackButton._blockInput.active = true;
          this.updateSceneIndex(true);
          director.loadScene(this.getSceneName(), () => {
            BackButton._blockInput.active = false;
          });
        }

        prescene() {
          BackButton._blockInput.active = true;
          this.updateSceneIndex(false);
          director.loadScene(this.getSceneName(), () => {
            BackButton._blockInput.active = false;
          });
        }

        updateSceneIndex(next) {
          if (next) {
            BackButton._sceneIndex + 1 >= sceneArray.length ? BackButton._sceneIndex = 0 : BackButton._sceneIndex += 1;
          } else {
            BackButton._sceneIndex - 1 < 0 ? BackButton._sceneIndex = sceneArray.length - 1 : BackButton._sceneIndex -= 1;
          }
        }

        getSceneName() {
          return sceneArray[BackButton._sceneIndex];
        }

      }, _class2._scrollNode = null, _class2._offset = new Vec3(), _class2._scrollCom = null, _class2._sceneIndex = -1, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///scripts/testlist/listitem.js", ["cc", "./scenelist.js", "./backbutton.js"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Component, LabelComponent, ButtonComponent, director, sceneArray, BackButton, _dec, _class, _temp, ccclass, property, ListItem;

  _export({
    _dec: void 0,
    _class: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      LabelComponent = _cc.LabelComponent;
      ButtonComponent = _cc.ButtonComponent;
      director = _cc.director;
    }, function (_scenelistJs) {
      sceneArray = _scenelistJs.sceneArray;
    }, function (_backbuttonJs) {
      BackButton = _backbuttonJs.BackButton;
    }],
    execute: function () {
      cclegacy._RF.push({}, "dfb240gUk5FzLJW2+GbHJRv", "listitem", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ListItem", ListItem = (_dec = ccclass('ListItem'), _dec(_class = (_temp = class ListItem extends Component {
        constructor(...args) {
          super(...args);
          this.index = -1;
          this._name = '';
          this.label = null;
          this.button = null;
        }

        onload() {}

        start() {
          // Your initialization goes here.
          this.index = this.node.getSiblingIndex();
          this._name = '';

          if (this.node) {
            this.label = this.node.getComponentInChildren(LabelComponent);
            this.button = this.node.getComponent(ButtonComponent);
          }

          this.updateItem(this.index, sceneArray[this.index]);
        }

        loadScene() {
          BackButton.saveOffset();
          BackButton.saveIndex(this.index);
          this.button.interactable = false;
          director.loadScene(this._name, BackButton.refreshButton);
        }

        updateItem(idx, name) {
          this.index = idx;
          this._name = name;
          this.label.string = name;
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///taylor.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Component, Vec3, director, CallA, _dec, _class, _class2, _temp, ccclass, property, Taylor;

  _export({
    _dec: void 0,
    _class: void 0,
    _class2: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Vec3 = _cc.Vec3;
      director = _cc.director;
    }],
    execute: function () {
      cclegacy._RF.push({}, "35b15MIiexJpodI5dQtSQFl", "taylor", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Taylor", Taylor = (_dec = ccclass('Taylor'), _dec(_class = (_temp = _class2 = class Taylor extends Component {
        constructor(...args) {
          super(...args);
          this._offset = new Vec3();
        }

        start() {
          Taylor.isRotate = true; // Your initialization goes here.
        }

        update(deltaTime) {
          // Your update function goes here.
          if (Taylor.isRotate) {
            this.setRotateYnum(deltaTime);
          }
        }

        setRotateX(slider) {
          var progress = slider.progress;
          var raw = this.node.eulerAngles.clone();
          this.node.eulerAngles = new Vec3(progress * 360 + 90, raw.y, raw.z);
        }

        setRotateY(slider) {
          var progress = slider.progress;
          var raw = this.node.eulerAngles.clone();
          this.node.eulerAngles = new Vec3(raw.x, progress * 360, raw.z);
        }

        setRotateYnum(count) {
          var raw = this.node.eulerAngles.clone();
          this.node.eulerAngles = new Vec3(raw.x, (raw.y + count * 15) % 360, raw.z);
        }

        setRotateZ(slider) {
          var progress = slider.progress;
          var raw = this.node.eulerAngles.clone();
          this.node.eulerAngles = new Vec3(raw.x, raw.y, progress * 360);
        }

        switchScene() {
          var o = jsb.reflection.callStaticMethod("com/example/nativeincludecocos/MainActivity", "hideButton", "()V");
          director.loadScene("joymeballandroid");
        }

        static changeRotate() {
          Taylor.isRotate = !Taylor.isRotate;
        }

      }, _class2.isRotate = true, _temp)) || _class));

      _export("CallA", CallA = class CallA {
        static change() {
          Taylor.changeRotate();
        }

      });

      window["tscall"] = {
        tscall: CallA
      };

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///taylorios.js", ["cc"], function (_export, _context) {
  "use strict";

  var cclegacy, _decorator, Component, Vec3, director, _dec, _class, _temp, ccclass, property, Taylor;

  _export({
    _dec: void 0,
    _class: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Vec3 = _cc.Vec3;
      director = _cc.director;
    }],
    execute: function () {
      cclegacy._RF.push({}, "260e84Q3JlMNbrlN7cpIGpC", "taylorios", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Taylor", Taylor = (_dec = ccclass('Taylorios'), _dec(_class = (_temp = class Taylor extends Component {
        constructor(...args) {
          super(...args);
          this._offset = new Vec3();
        }
        /* class member could be defined like this */
        // dummy = '';

        /* use `property` decorator if your want the member to be serializable */
        // @property
        // serializableDummy = 0;


        start() {// Your initialization goes here.
        }

        update(deltaTime) {
          // Your update function goes here.
          this.setRotateYnum(deltaTime);
        }

        setRotateX(slider) {
          var progress = slider.progress;
          var raw = this.node.eulerAngles.clone();
          this.node.eulerAngles = new Vec3(progress * 360 + 90, raw.y, raw.z);
        }

        setRotateY(slider) {
          var progress = slider.progress;
          var raw = this.node.eulerAngles.clone();
          this.node.eulerAngles = new Vec3(raw.x, progress * 360, raw.z);
        }

        setRotateYnum(count) {
          var raw = this.node.eulerAngles.clone();
          this.node.eulerAngles = new Vec3(raw.x, (raw.y + count * 15) % 360, raw.z);
        }

        setRotateZ(slider) {
          var progress = slider.progress;
          var raw = this.node.eulerAngles.clone();
          this.node.eulerAngles = new Vec3(raw.x, raw.y, progress * 360);
        }

        switchScene() {
          director.loadScene("joymeballios");
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/prerequisite-imports:main", ["../ball/common/scripts/AxisHelper.js", "../ball/common/scripts/ContactPointHelper.js", "../ball/common/scripts/EmitBullet.js", "../ball/common/scripts/PrefabPoolUtil.js", "../ball/common/scripts/ProfilerManager.js", "../ball/common/scripts/RaycastHelper.js", "../ball/common/scripts/first-person-camera.js", "../ball/scripts/TempConst.js", "../ball/scripts/ColumnCtr.js", "../ball/scripts/FloorFlagCtr.js", "../ball/scripts/BallCtr.js", "../ball/scripts/CameraFollow.js", "../ball/scripts/GameConfig.js", "../ball/scripts/GameCtr.js", "../ball/scripts/SwitchScene.js", "../ball/scripts/SwitchScennIos.js", "../pre-filter-envmap/pre-filter-envmap.js", "../scripts/ad-hoc/debug-info.js", "../scripts/ad-hoc/exposure.js", "../scripts/unlit-quad.js", "../scripts/ad-hoc/instanced-skinning.js", "../scripts/ad-hoc/sponza.js", "../scripts/ad-hoc/toggler.js", "../scripts/audio/audio-controller.js", "../scripts/audio/audio.js", "../scripts/collision-detection/emitter.js", "../scripts/collision-detection/engine-info.js", "../scripts/custom-effect/tunnel.js", "../scripts/first-person-camera.js", "../scripts/jellyfish/jellyfish.js", "../scripts/jellyfish/spawn.js", "../scripts/pbr/geometries.js", "../scripts/physics/collider-manager.js", "../scripts/physics/collider.js", "../scripts/physics/ground.js", "../scripts/physics-checker/PhysicsEnvCheck.js", "../scripts/skill-effect/BladeStorm.js", "../scripts/skill-effect/healspell.js", "../scripts/skill-effect/self-destory.js", "../scripts/skin/SSS.js", "../scripts/skin/label-modifier.js", "../scripts/skin/rotor.js", "../scripts/tangent-visualizer.js", "../scripts/testlist/scenelist.js", "../scripts/testlist/backbutton.js", "../scripts/testlist/listitem.js", "../taylor.js", "../taylorios.js"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_ballCommonScriptsAxisHelperJs) {}, function (_ballCommonScriptsContactPointHelperJs) {}, function (_ballCommonScriptsEmitBulletJs) {}, function (_ballCommonScriptsPrefabPoolUtilJs) {}, function (_ballCommonScriptsProfilerManagerJs) {}, function (_ballCommonScriptsRaycastHelperJs) {}, function (_ballCommonScriptsFirstPersonCameraJs) {}, function (_ballScriptsTempConstJs) {}, function (_ballScriptsColumnCtrJs) {}, function (_ballScriptsFloorFlagCtrJs) {}, function (_ballScriptsBallCtrJs) {}, function (_ballScriptsCameraFollowJs) {}, function (_ballScriptsGameConfigJs) {}, function (_ballScriptsGameCtrJs) {}, function (_ballScriptsSwitchSceneJs) {}, function (_ballScriptsSwitchScennIosJs) {}, function (_preFilterEnvmapPreFilterEnvmapJs) {}, function (_scriptsAdHocDebugInfoJs) {}, function (_scriptsAdHocExposureJs) {}, function (_scriptsUnlitQuadJs) {}, function (_scriptsAdHocInstancedSkinningJs) {}, function (_scriptsAdHocSponzaJs) {}, function (_scriptsAdHocTogglerJs) {}, function (_scriptsAudioAudioControllerJs) {}, function (_scriptsAudioAudioJs) {}, function (_scriptsCollisionDetectionEmitterJs) {}, function (_scriptsCollisionDetectionEngineInfoJs) {}, function (_scriptsCustomEffectTunnelJs) {}, function (_scriptsFirstPersonCameraJs) {}, function (_scriptsJellyfishJellyfishJs) {}, function (_scriptsJellyfishSpawnJs) {}, function (_scriptsPbrGeometriesJs) {}, function (_scriptsPhysicsColliderManagerJs) {}, function (_scriptsPhysicsColliderJs) {}, function (_scriptsPhysicsGroundJs) {}, function (_scriptsPhysicsCheckerPhysicsEnvCheckJs) {}, function (_scriptsSkillEffectBladeStormJs) {}, function (_scriptsSkillEffectHealspellJs) {}, function (_scriptsSkillEffectSelfDestoryJs) {}, function (_scriptsSkinSSSJs) {}, function (_scriptsSkinLabelModifierJs) {}, function (_scriptsSkinRotorJs) {}, function (_scriptsTangentVisualizerJs) {}, function (_scriptsTestlistScenelistJs) {}, function (_scriptsTestlistBackbuttonJs) {}, function (_scriptsTestlistListitemJs) {}, function (_taylorJs) {}, function (_tayloriosJs) {}],
    execute: function () {}
  };
});

(function(r) {
  r('project:///assets/ball/common/scripts/AxisHelper.js', 'chunks:///ball/common/scripts/AxisHelper.js');
  r('project:///assets/ball/common/scripts/ContactPointHelper.js', 'chunks:///ball/common/scripts/ContactPointHelper.js');
  r('project:///assets/ball/common/scripts/EmitBullet.js', 'chunks:///ball/common/scripts/EmitBullet.js');
  r('project:///assets/ball/common/scripts/PrefabPoolUtil.js', 'chunks:///ball/common/scripts/PrefabPoolUtil.js');
  r('project:///assets/ball/common/scripts/ProfilerManager.js', 'chunks:///ball/common/scripts/ProfilerManager.js');
  r('project:///assets/ball/common/scripts/RaycastHelper.js', 'chunks:///ball/common/scripts/RaycastHelper.js');
  r('project:///assets/ball/common/scripts/first-person-camera.js', 'chunks:///ball/common/scripts/first-person-camera.js');
  r('project:///assets/ball/scripts/TempConst.js', 'chunks:///ball/scripts/TempConst.js');
  r('project:///assets/ball/scripts/ColumnCtr.js', 'chunks:///ball/scripts/ColumnCtr.js');
  r('project:///assets/ball/scripts/FloorFlagCtr.js', 'chunks:///ball/scripts/FloorFlagCtr.js');
  r('project:///assets/ball/scripts/BallCtr.js', 'chunks:///ball/scripts/BallCtr.js');
  r('project:///assets/ball/scripts/CameraFollow.js', 'chunks:///ball/scripts/CameraFollow.js');
  r('project:///assets/ball/scripts/GameConfig.js', 'chunks:///ball/scripts/GameConfig.js');
  r('project:///assets/ball/scripts/GameCtr.js', 'chunks:///ball/scripts/GameCtr.js');
  r('project:///assets/ball/scripts/SwitchScene.js', 'chunks:///ball/scripts/SwitchScene.js');
  r('project:///assets/ball/scripts/SwitchScennIos.js', 'chunks:///ball/scripts/SwitchScennIos.js');
  r('project:///assets/pre-filter-envmap/pre-filter-envmap.js', 'chunks:///pre-filter-envmap/pre-filter-envmap.js');
  r('project:///assets/scripts/ad-hoc/debug-info.js', 'chunks:///scripts/ad-hoc/debug-info.js');
  r('project:///assets/scripts/ad-hoc/exposure.js', 'chunks:///scripts/ad-hoc/exposure.js');
  r('project:///assets/scripts/unlit-quad.js', 'chunks:///scripts/unlit-quad.js');
  r('project:///assets/scripts/ad-hoc/instanced-skinning.js', 'chunks:///scripts/ad-hoc/instanced-skinning.js');
  r('project:///assets/scripts/ad-hoc/sponza.js', 'chunks:///scripts/ad-hoc/sponza.js');
  r('project:///assets/scripts/ad-hoc/toggler.js', 'chunks:///scripts/ad-hoc/toggler.js');
  r('project:///assets/scripts/audio/audio-controller.js', 'chunks:///scripts/audio/audio-controller.js');
  r('project:///assets/scripts/audio/audio.js', 'chunks:///scripts/audio/audio.js');
  r('project:///assets/scripts/collision-detection/emitter.js', 'chunks:///scripts/collision-detection/emitter.js');
  r('project:///assets/scripts/collision-detection/engine-info.js', 'chunks:///scripts/collision-detection/engine-info.js');
  r('project:///assets/scripts/custom-effect/tunnel.js', 'chunks:///scripts/custom-effect/tunnel.js');
  r('project:///assets/scripts/first-person-camera.js', 'chunks:///scripts/first-person-camera.js');
  r('project:///assets/scripts/jellyfish/jellyfish.js', 'chunks:///scripts/jellyfish/jellyfish.js');
  r('project:///assets/scripts/jellyfish/spawn.js', 'chunks:///scripts/jellyfish/spawn.js');
  r('project:///assets/scripts/pbr/geometries.js', 'chunks:///scripts/pbr/geometries.js');
  r('project:///assets/scripts/physics/collider-manager.js', 'chunks:///scripts/physics/collider-manager.js');
  r('project:///assets/scripts/physics/collider.js', 'chunks:///scripts/physics/collider.js');
  r('project:///assets/scripts/physics/ground.js', 'chunks:///scripts/physics/ground.js');
  r('project:///assets/scripts/physics-checker/PhysicsEnvCheck.js', 'chunks:///scripts/physics-checker/PhysicsEnvCheck.js');
  r('project:///assets/scripts/skill-effect/BladeStorm.js', 'chunks:///scripts/skill-effect/BladeStorm.js');
  r('project:///assets/scripts/skill-effect/healspell.js', 'chunks:///scripts/skill-effect/healspell.js');
  r('project:///assets/scripts/skill-effect/self-destory.js', 'chunks:///scripts/skill-effect/self-destory.js');
  r('project:///assets/scripts/skin/SSS.js', 'chunks:///scripts/skin/SSS.js');
  r('project:///assets/scripts/skin/label-modifier.js', 'chunks:///scripts/skin/label-modifier.js');
  r('project:///assets/scripts/skin/rotor.js', 'chunks:///scripts/skin/rotor.js');
  r('project:///assets/scripts/tangent-visualizer.js', 'chunks:///scripts/tangent-visualizer.js');
  r('project:///assets/scripts/testlist/scenelist.js', 'chunks:///scripts/testlist/scenelist.js');
  r('project:///assets/scripts/testlist/backbutton.js', 'chunks:///scripts/testlist/backbutton.js');
  r('project:///assets/scripts/testlist/listitem.js', 'chunks:///scripts/testlist/listitem.js');
  r('project:///assets/taylor.js', 'chunks:///taylor.js');
  r('project:///assets/taylorios.js', 'chunks:///taylorios.js');
  r('virtual:///prerequisite-imports:main', 'chunks:///_virtual/prerequisite-imports:main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    var _m;
    return {
        setters: [function(m) { _m = m; }],
        execute: function () { _export(_m); }
    };
    });
});
} }; });