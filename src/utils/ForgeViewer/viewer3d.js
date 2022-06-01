// Viewer3D offers public methods for developers to use.
// Viewer3DImpl is the implementation file for Viewer3D and is only used by Viewer3D.js
// 
// Viewer3D does things like parameter validation.
// Viewer3DImpl does the actual work, by interfacing with other internal components, such as the MaterialManager.

import * as THREE from "three";
import { isMobileDevice, isTouchDevice, isChrome, isIOSDevice, isPhoneFormFactor } from "../compat";
import { logger } from "../logger/Logger";
import { Profile } from "./Profile";
import { Prefs3D, Prefs2D, Prefs, VIEW_TYPES } from "./PreferenceNames";
import { EnumType } from "./ProfileSettings";
import { displayUnitsEnum, displayUnitsPrecisionEnum } from '../../src/measurement/DisplayUnits';
import { ProfileManager } from './ProfileManager';
import { getParameterByName } from "../globals";
import { errorCodeString, ErrorCodes } from "../file-loaders/net/ErrorCodes";
import { EventDispatcher } from "./EventDispatcher";
import { EventUtils } from "./EventUtils";
import { ScreenModeMixin, ScreenMode } from "./ScreenModeDelegate";
import { ExtensionMixin } from "./ExtensionManager";
import { HotkeyManager } from "../tools/HotkeyManager";
import { isNodeJS } from "../compat";
import { Navigation } from "../tools/Navigation";
import { ToolController } from "../tools/ToolController";
import { ViewingUtilities } from "../tools/ViewingUtilities";
import { DefaultHandler } from "../tools/DefaultHandler";
import { GestureHandler } from "../tools/GestureHandler";
import i18n from "i18next";
import * as et from "./EventTypes";
import { FileLoaderManager } from "./FileLoaderManager";
import { clearPropertyWorkerCache } from "../file-loaders/main/PropDbLoader";
import { ViewerState } from "./ViewerState";
import { OrbitDollyPanTool } from "../tools/OrbitDollyPanTool";
import { Autocam } from "../tools/autocam/Autocam";
import { Viewer3DImpl, InitParametersSetting} from "./Viewer3DImpl";
import { BubbleNode } from "./bubble";
import { Consolidation } from "../wgs/scene/consolidation/Consolidation";
import { KeyCode } from "../tools/KeyCode";
import { ForgeLogoSpinner } from './ForgeLogoSpinner';
import { LoadingSpinner } from './LoadingSpinner';
import { SceneMath } from "../wgs/scene/SceneMath";
import { ScreenShot } from "./ScreenShot";
import loaderExtensions from '../file-loaders/loader-extensions';
import { OverlayManager } from './OverlayManager';
import { GlobalManager } from './GlobalManager';
import { GlobalManagerMixin } from './GlobalManagerMixin';
import { LightPresets } from "./LightPresets";
import { ModelExploder } from "../wgs/scene/ModelExploder";
import { analytics } from '../analytics';
import { getLoadModelData } from '../analytics/analyticsData';
import { ViewerPreferences } from "./ViewerPreferences";

const av = Autodesk.Viewing;

    /**
     * LMV has two extra scene it renders along with the models. One is rendered before the models, and the
     * other is rendered after the models. These scenes are THREE.Scene objects and you can add custom meshes
     * to be rendered to either of the scenes.<br>
     *
     * The objects you add to these scenes will be drawn using the same multiple render targets that are used
     * when drawing the models. You may choose to either support multiple render targets or disable them.<br>
     * 
     * To support multiple render targets you can only use Prism, MeshPhongMaterial, MeshBasicMateiral or
     * LineBasicMaterial materials, and you must add all the materials to LMV.<br>
     * 
     * To disable multiple render targets you can set the ``skipIdTarget`` and ``skipDepthTarget`` properties to ``true``.
     * If you disable multiple render targets your objects will not have rollover highlighting and will not
     * contribute to ambient occlusion.
     *
     * @typedef {Object} Viewer3DExtraScene
     * @property {boolean} skipIdTarget - Set to true to prevent the id target from being rendered.
     * @property {boolean} skipDepthTarget - Set to true to prevent the ambient occlusion depth target from being rendered.
     */


    /**
     * Detects if WebGL is enabled.
     *
     * @return { number } -1 for not Supported,
     *                    0 for disabled
     *                    1 for enabled
     * 
     * @private
     */
    function detectWebGL()
    {
        // Check for the webgl rendering context
        if ( av.getGlobal().WebGLRenderingContext) {
            var canvas = av.getGlobal().document.createElement("canvas"),
                names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                context = false;

            for (var i = 0; i < 4; i++) {
                try {
                    context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter === "function") {
                        // WebGL is enabled.
                        //
                        return 1;
                    }
                // eslint-disable-next-line no-empty
                } catch (e) {}
            }

            // WebGL is supported, but disabled.
            //
            return 0;
        }

        // WebGL not supported.
        //
        return -1;
    }


    var nextViewerId = 0;

    // Order in which elements will appear - last node is the top most
    const DefaultContainerLayersOrder = [
        'markups-svg',
        'pushpin-container'
    ];
    

    /**
     * Base class for all viewer implementations.
     * It contains everything that is needed to connect to the Autodesk's Forge service and display 2D and 3D models.
     * It also includes basic navigation support, context menu and extension APIs.
     * 
     * @constructor
     * 
     * @param {HTMLElement} container - The viewer container.
     * @param {ViewerConfig} config - The initial settings object.
     * @param {boolean} [config.startOnInitialize=true] - Set this to false if you want to defer the run to a later time
     *  by calling run() explicitly.
     * @param {string} [config.theme='dark-theme'] - Set this to 'light-theme' if you want to use the light ui theme. Themes can
     *  be changed during execution by calling setTheme() and passing the theme's name.
     * @param {string} [config.localStoragePrefix] - The local storage prefix for viewer.
     * @param {Settings} [options.profileSettings] - settings object to override the default viewer settings: {@link Autodesk.Viewing.ProfileSettings.Default}.
     * @param {boolean} [options.useFileProfile] - if set to true one of the registered file profiles will be used to set the profile.
     * Otherwise, the viewer uses the default profile.
     * 
     * @property {Autodesk.Viewing.Navigation} navigation - The navigation api object.
     * @property {Autodesk.Viewing.ToolController} toolController - The tool controller object.
     * @property {Autodesk.Viewing.ViewingUtilities} utilities - The viewing utilities object.
     * @property {Autodesk.Viewing.Model} model - Property that references the first loaded model.
     * @property {Autodesk.Viewing.OverlayManager} overlays - Add/Remove `THREE.Mesh` instances into overlay scenes.
     * 
	 * @alias Autodesk.Viewing.Viewer3D
     */
    export function Viewer3D(container, config)
    {
        this.setGlobalManager(new GlobalManager());

        if (container) {
            this.clientContainer = container;
            this.container = this.getDocument().createElement("div");
            this.container.classList.add("adsk-viewing-viewer");
            this.container.style.height = "100%";
            this.container.style.width = "100%";
            this.container.style.overflow = "hidden";

            this.container.classList.add( isTouchDevice() ? "touch" : "notouch");

            this.clientContainer.appendChild(this.container);

            this.config = config || {};
            this.contextMenu = null;
            this.contextMenuCallbacks = {};
            this.started = false;

            // Set the UI theme.
            this.theme = this.config.theme || 'dark-theme';
            this.container.classList.add(this.theme);

            this.containerLayerOrder = this.config.containerLayerOrder || DefaultContainerLayersOrder;

            if (isChrome()) {
                this.container.classList.add('quality-text');
            }

            // Create the canvas if it doesn't already exist
            if ( this.container.nodeName === "CANVAS") {
                throw 'Viewer must be initialized on a div [temporary]';
            }
            else
            {
                this.canvasWrap = this.getDocument().createElement("div");
                this.canvasWrap.classList.add("canvas-wrap");

                this.canvas = this.getDocument().createElement("canvas");
                this.canvas.tabIndex = 0;
                this.canvas.setAttribute('data-viewer-canvas', 'true');

                this.canvasWrap.appendChild(this.canvas);
                this.container.appendChild(this.canvasWrap);
            }

            // LMV-5628: Enable the Forge Logo in the bottom right of the canvas.
            if (!isPhoneFormFactor() && !av.Private.DISABLE_FORGE_LOGO && !av.Private.DISABLE_FORGE_CANVAS_LOGO) {
                const _document = this.getDocument();
                this._forgeLogo = _document.createElement('div');
                this._forgeLogo.classList.add('forge-logo-canvas');
                const img = _document.createElement('img');
                img.src = Autodesk.Viewing.Private.getResourceUrl('res/ui/forge-logo-canvas.png');
                this._forgeLogo.appendChild(img);
                this._forgeLogo.style.display = 'none';
                this.container.appendChild(this._forgeLogo);
            }

            this.canvas.viewer = this; //store a pointer to the viewer in the canvas
        }

        var localStoragePrefix = config && config.localStoragePrefix || 'Autodesk.Viewing.Private.GuiViewer3D.SavedSettings.';
        if (!localStoragePrefix.endsWith('.')) {
            localStoragePrefix += '.';
        }

        var prefOptions = {
            // Preferences. Prefix is a bit odd, but a legacy result after refactoring.
            prefix: localStoragePrefix,
            localStorage: !isNodeJS()
        };
        this._displayEdges = null;
        this._setDoubleSided = null;
        this.prefs = new ViewerPreferences(this, prefOptions);

        // Gets assigned by the setProfile method.
        this.profile = null;
        this.profileManager = new ProfileManager();

        // Add a reference to the hotkey manager as an instance variable
        this._hotkeyManager = new HotkeyManager();

        this.extensionCache = null; // Supports Extension.getCache() feature.
        this.running = false;
        this._pushedTool = '';
        this._defaultNavigationTool = '';
        this.id = nextViewerId++;
        this.impl = new Viewer3DImpl(this.canvas, this);
        this.overlays = new OverlayManager(this.impl);
        this._loadingSpinner = av.Private.DISABLE_FORGE_LOGO ? new LoadingSpinner() : new ForgeLogoSpinner(this);
        this._loadingSpinner.setGlobalManager(this.globalManager);

        //ADP
        this.trackADPTimer = [];
    }

    EventDispatcher.prototype.apply( Viewer3D.prototype );
    ScreenModeMixin.prototype.apply( Viewer3D.prototype );
    ExtensionMixin.prototype.apply( Viewer3D.prototype );
    GlobalManagerMixin.call( Viewer3D.prototype );

    Viewer3D.prototype.constructor = Viewer3D;

    Object.defineProperty(Viewer3D.prototype, 'model', {
        get: function() { return this.impl?.model; },
        set: function() { throw "Do not set viewer.model"; }
    });

    /**
     * Need to keep track of viewers in document so we know when it is safe
     * to call clearPropertyWorkerCache()
     *
     * @static
     * @alias Autodesk.Viewing.Viewer3D#ViewerCount
     */
    Viewer3D.ViewerCount = 0;

    /**
     * Default values passed into {@link #setCanvasClickBehavior} specifying how the viewer canvas 
     * will react to user input as well as other 3d-canvas related options.
     *
     * @static
     * @alias Autodesk.Viewing.Viewer3D#kDefaultCanvasConfig
     */
    Viewer3D.kDefaultCanvasConfig = {
        "click": {
            "onObject": ["selectOnly"],
            "offObject": ["deselectAll"]
        },
        "clickAlt": {
            "onObject": ["setCOI"],
            "offObject": ["setCOI"]
        },
        "clickCtrl": {
            "onObject": ["selectToggle"]
            // don't deselect if user has control key down https://jira.autodesk.com/browse/LMV-1852
            //"offObject": ["deselectAll"]
        },
        "clickShift": {
            "onObject": ["selectToggle"]
            // don't deselect if user has shift key down https://jira.autodesk.com/browse/LMV-1852
            //"offObject": ["deselectAll"]
        },

        // Features that support disabling
        "disableSpinner": false,
        "disableMouseWheel": false,
        "disableTwoFingerSwipe": false
    };

    /**
     * The extra scene that gets rendered after the background and before any models are rendered. See {@link Viewer3DExtraScene}
     * @member scene
     * @memberOf Autodesk.Viewing.Viewer3D
     * @alias Autodesk.Viewing.Viewer3D#scene
     */
    Object.defineProperty(Viewer3D.prototype, 'scene', {
        get: function() { return this.impl.scene; },
        set: function() { throw "Do not set viewer.scene"; }
    });

    /**
     * The extra scene that gets rendered after all models are rendered. See {@link Viewer3DExtraScene}
     * @member sceneAfter
     * @memberOf Autodesk.Viewing.Viewer3D
     * @alias Autodesk.Viewing.Viewer3D#sceneAfter
     */
    Object.defineProperty(Viewer3D.prototype, 'sceneAfter', {
        get: function() { return this.impl.sceneAfter; },
        set: function() { throw "Do not set viewer.sceneAfter"; }
    });

    /**
     * @private
     */
    Viewer3D.createHeadlessViewer = function() {
        var viewer = new Viewer3D();
        viewer.impl.initialize();
        viewer.impl.setLightPreset(0);
        return viewer;
    };

    /**
     * @callback Autodesk.Viewing.Viewer3D~onLoadModelSuccess
     * @param {Autodesk.Viewing.Model} model - Reference to the loaded model.
     */

    /**
     * @callback Autodesk.Viewing.Viewer3D~onLoadModelFailure
     * @param {Number} errorCode - error number
     * @param {string} errorMessage - error message
     */

    /**
     * Initializes the viewer and loads any extensions specified in the constructor's
     * config parameter. If the optional parameters are specified, the start() function will
     * use an optimized initialization sequence that results in faster model load.
     * The parameters are the same as the ones for Viewer3D.loadModel and you do not need to call loadModel
     * subsequently if the model is loaded via the call to start().
     *
     * @param {string} [url] - Optional URN or filepath to load on start.
     * @param {object} [options] - Optional path to shared property database.
     * @param {Autodesk.Viewing.Viewer3D~onLoadModelSuccess} [onSuccessCallback] - Method that gets called when initial loading is done
     * and streaming starts.
     * @param {Autodesk.Viewing.Viewer3D~onLoadModelFailure} [onErrorCallback] - Method that gets called when initial loading ends with an error.
     * @param {object} [initOptions] - Optional: Options forwarded to viewer.initialize()
     * @returns {number} 0 if the viewer has started, an error code (same as that returned by initialize()) otherwise.
     * 
     * @alias Autodesk.Viewing.Viewer3D#start
     */
    Viewer3D.prototype.start = function (url, options, onSuccessCallback, onErrorCallback, initOptions) {
        if (this.started) {
            return 0;
        }
        this.started = true;

        var viewer = this;

        // Initialize the renderer and related stuff
        var result = viewer.initialize(initOptions);
        if (result !== 0) {
            if (onErrorCallback) {
                setTimeout(function(){ onErrorCallback(result); }, 1);
            }
            return result;
        }

        //load extensions and set navigation overrides, etc.
        //Delayed so that it runs a frame after the long initialize() call.
        setTimeout(function() {viewer.setUp(viewer.config);}, 1);

        //If a model URL was given, kick off loading first, then initialize, otherwise just continue
        //with initialization immediately.
        if (url)
            this.loadModel(url, options, onSuccessCallback, onErrorCallback);

        return 0;
    };


    /**
     * Initializes the viewer and loads any extensions specified in the constructor's
     * config parameter. If the optional parameters are specified, the start() function will
     * use an optimized initialization sequence that results in faster model load.
     * The parameters are the same as the ones for Viewer3D.loadModel and you do not need to call loadModel
     * subsequently if the model is loaded via the call to start().
     * 
     * @param {Document} avDocument - The Document instance holding the current derivative manifest
     * @param {BubbleNode} [manifestNode] - The manifest node to load model for.
     * @param {Object} [options] - Extra initialization options to override the defaults. Normally not needed.
     * @returns {Promise} - Resolves with loaded model, rejects on any kind of initialization failure.
     * 
     */
     Viewer3D.prototype.startWithDocumentNode = function (avDocument, manifestNode, options) {

        var viewer = this;

        return new Promise(function(resolve, reject) {

            if (viewer.started) {
                return 0;
            }
            viewer.started = true;
    
            // Initialize the renderer and related stuff
            var result = viewer.initialize();
            if (result !== 0) {
                setTimeout(function(){ reject(result); }, 1);
                return;
            }
    
            //load extensions and set navigation overrides, etc.
            //Delayed so that it runs a frame after the long initialize() call.
            setTimeout(function() {viewer.setUp(viewer.config);}, 1);
    
            //If a model URL was given, kick off loading first, then initialize, otherwise just continue
            //with initialization immediately.
            var prom = viewer.loadDocumentNode(avDocument, manifestNode, options);
            prom.then(resolve).catch(reject);
        });
    };


    Viewer3D.prototype.registerUniversalHotkeys = function()
    {
        var self = this;

        var onPress;
        var onRelease;
        var previousTool;

        /*
        // useful for debugging, when you want to force a redraw, hit "u"
        // search on ""Autodesk.ForceUpdate" below and uncomment that popHotkeys line, too.
        // Add force update hotkey
        onPress = function() {
            // _spectorDump: the fourth "true" gets Spector to dump, if uncommented in Viewer3DImpl.js
            console.log('Capture frame started.');
            self.impl.startSpectorCapture();
            self.impl.invalidate(true,true,true,true);
            return true;
        };
        this._hotkeyManager.pushHotkeys("Autodesk.ForceUpdate", [
            {
                keycodes: [KeyCode.u],
                onPress: onPress
            }
        ]);
        */


        // Add Fit to view hotkey
        onPress = function() {
            self.navigation.setRequestFitToView(true);
            analytics.track('viewer.fit_to_view', {
                from: 'Keyboard',
            });
            return true;
        };
        self._hotkeyManager.pushHotkeys("Autodesk.FitToView", [
            {
                keycodes: [KeyCode.f],
                onPress: onPress
            }
        ]);

        // Add home hotkey
        onPress = function() {
            self.navigation.setRequestHomeView(true);
            return true;
        };
        self._hotkeyManager.pushHotkeys("Autodesk.Home", [
            {
                keycodes: [KeyCode.h],
                onPress: onPress
            },
            {
                keycodes: [KeyCode.HOME],
                onPress: onPress
            }
        ]);

        // Escape
        onRelease = function() {
            // handle internal GUI components before firing the event to the client
            if (self.objectContextMenu && self.objectContextMenu.hide()) {
                return true;
            }

            // TODO: Could this all be unified somehow? If event listeners had priorities,
            //       we could intersperse listeners from the client and the viewer, which
            //       I think will eventually be required.

            self.dispatchEvent({ type: et.ESCAPE_EVENT });
            return true;
        };

        self._hotkeyManager.pushHotkeys("Autodesk.Escape", [
            {
                keycodes: [KeyCode.ESCAPE],
                onRelease: onRelease
            }
        ]);

        // Pan
        onPress = function() {
            previousTool = self.getActiveNavigationTool();
            return self.setActiveNavigationTool("pan");
        };
        onRelease = function() {
            return self.setActiveNavigationTool(previousTool);
        };
        var hotkeys = [
            {
                keycodes: [KeyCode.SHIFT],
                onPress: onPress,
                onRelease: onRelease
            },
            {
                keycodes: [KeyCode.SPACE],
                onPress: onPress,
                onRelease: onRelease
            }];
        self._hotkeyManager.pushHotkeys("Autodesk.Pan", hotkeys, {tryUntilSuccess: true});
    };

    Viewer3D.prototype.createControls = function( ) {
        var self = this;
        var impl = self.impl;

        self.navigation = new Navigation(impl.camera);
        self.__initAutoCam(impl);

        self.utilities = new ViewingUtilities(impl, self.autocam, self.navigation);
        self.clickHandler = new DefaultHandler(impl, self.navigation, self.utilities);
        self.toolController = new ToolController(impl, self, self.autocam, self.utilities, self.clickHandler);
        self.toolController.registerTool( new GestureHandler(self) );

        self.toolController.registerTool( self._hotkeyManager );
        self.toolController.activateTool( self._hotkeyManager.getName() );

        self.registerUniversalHotkeys();

        self.toolController.registerTool( new OrbitDollyPanTool(impl, self, this.config.navToolsConfig) , (enable) => {
            if (!enable) {
                this.setActiveNavigationTool();
            }
        });

        // Set the tool Modality Map
        self.toolController.setModalityMap({
            section: { explode: false, pan: false, dolly: false },
            explode: { section: false, pan: false, dolly: false },
            measure: { 'box-selection': false },
            calibration: { 'box-selection': false },
            orbit: {},
            dolly: {},
            pan: {},
            fov: {},
            bimwalk: {},
            'box-selection': { measure: false, calibration: false },
        });

        return self.toolController;
    };

    /**
     * Create any DOM and canvas elements, and setup WebGL.
     *
     * @param {object} [initOptions] - optional initialization options, such as renderer, glrenderer & materialManager.
     * 
     * @returns {number} 0 if initialization was successful, {@link Autodesk.Viewing.ErrorCode} otherwise.
     * @private
     */
    Viewer3D.prototype.initialize = function(initOptions)
    {

        //Set up the private viewer implementation
        this.setScreenModeDelegate(this.config ? this.config.screenModeDelegate : undefined);

        var dimensions = this.getDimensions();
        this.canvas.width = dimensions.width;
        this.canvas.height = dimensions.height;

        // For Safari and WKWebView and UIWebView on ios device with retina display,
        // needs to manually rescale our canvas to get the right scaling. viewport metatag
        // alone would not work.
        if (isIOSDevice() && this.getWindow().devicePixelRatio) {
            this.canvas.width /= this.getWindow().devicePixelRatio;
            this.canvas.height /= this.getWindow().devicePixelRatio;
        }

        //Call this after setting canvas size above...
        this.impl.initialize(initOptions);

        //Only run the WebGL failure logic if the renderer failed to initialize (otherwise
        //we don't have to spend time creating a GL context here, since we know it worked already
        if (!this.impl.glrenderer()) {
            var webGL = detectWebGL();
            if (webGL <= 0) {  // WebGL error.
                return webGL === -1 ? ErrorCodes.BROWSER_WEBGL_NOT_SUPPORTED : ErrorCodes.BROWSER_WEBGL_DISABLED;
            }
        }

        var self = this;

        // Add a callback for the panels to resize when the viewer resizes.
        // For some reason, Safari iOS updates the DOM dimensions *after* the resize event,
        // so in that case we handle the resizing asynchronously.
        if (isIOSDevice()) {
            var _resizeTimer;
            this.onResizeCallback = function() {
                clearTimeout(_resizeTimer);
                _resizeTimer = setTimeout(self.resize.bind(self), 500);
            };
        } else {
            this.onResizeCallback = function() {
                var oldWidth = self.impl.camera.clientWidth;
                var oldHeight = self.impl.camera.clientHeight;
                var newWidth = self.container.clientWidth;
                var newHeight =  self.container.clientHeight;

                if (oldWidth !== newWidth ||
                    oldHeight !== newHeight) {
                    self.resize();
                }
            };
        }
        this.addWindowEventListener('resize', this.onResizeCallback, false);

        this.onScrollCallback = function() {
            self.impl.canvasBoundingclientRectDirty = true;
        };
        this.addWindowEventListener('scroll', this.onScrollCallback);

        this.initContextMenu();

        // Localize the viewer.
        this.localize();


        this.impl.controls = this.createControls();

        // Initialize the preference callbacks
        this.initializePrefListeners();

        this.setDefaultNavigationTool( "orbit" );

        if( this.impl.controls )
            this.impl.controls.setAutocam(this.autocam);

        var canvasConfig = (this.config && this.config.canvasConfig) ? this.config.canvasConfig : Viewer3D.kDefaultCanvasConfig;
        this.setCanvasClickBehavior(canvasConfig);


        // Allow clients not load the spinner. This is needed for embedding viewer in a WebView on mobile,
        // where the spinner makes the UI looks less 'native'.
        if (!canvasConfig.disableSpinner) {

            // Create a div containing an image: this will be a
            // spinner (aka activity indicator) that tells the user
            // that the file is loading.
            //
            // Keep reference for backwards compatibility.
            this.loadSpinner = this._loadingSpinner.createDom(this.container);
        }

        // Auxiliary class to get / restore the viewer state.
        this.viewerState = new ViewerState( this );

        // The default behavior is to run the main loop immediately, unless startOnInitialize
        // is provided and is false.
        //
        if (!this.config || !Object.prototype.hasOwnProperty.call(this.config, "startOnInitialize") || this.config.startOnInitialize) {
            this.run();
        }

        const _window = av.getGlobal();
        if (!_window.NOP_VIEWER) {  // Always keep the main viewer in NOP_VIEWER
            _window.NOP_VIEWER = this;
        }
        
        // Main viewer and any secondary viewers can be found in the NOP_VIEWERS array
        _window.NOP_VIEWERS = _window.NOP_VIEWERS || [];
        _window.NOP_VIEWERS.push(this);
        
        this.addEventListener(et.MODEL_ADDED_EVENT, function(e) {
            self.onModelAdded(e.model, e.preserveTools);
        });

        this.addEventListener(et.GEOMETRY_LOADED_EVENT, function(e) {
            if (e.model.is2d() && !e.model.isLeaflet()) {
                self.navigation.setMinimumLineWidth(e.model.loader?.svf?.minLineWidth);
            }
            const geometryList = e.model.getGeometryList()?.geoms || []; // In case model was already destroyed.

            e.model.hasEdges = false;
            for (let i=0; i<geometryList.length; i++) {
                const geom = geometryList[i];
                if (!geom) continue;
                if (geom.isLines || geom.iblines) {
                    e.model.hasEdges = true;
                    break;
                }
            }
        });

        this.dispatchEvent(et.VIEWER_INITIALIZED);

        this.trackADPSettingsOptions();
        this.trackADPExtensionsLoaded();

        Viewer3D.ViewerCount++;

        // These calls are useful for Internet Explorer's use of spector.
        // Uncomment this code, and add the https://spectorcdn.babylonjs.com/spector.bundle.js script
        // in index.html, and Spector's menu shows up in the application itself.
        /*
        var spector = new SPECTOR.Spector();
        window.spector = spector;
        spector.displayUI();    // comment this line out if you instead want to use _spectorDump and the "u" key
        spector.spyCanvases();
        */

        return 0;   // No Error initializing.
    };

    /**
     * Loading extensions and initializing canvas interactions.
     * Invoked automatically by {@link Autodesk.Viewing.Viewer3D#start} method.
     * 
     * @param {object} [config] - configuration values 
     * @param {string[]} [config.extensions] - List of extension ids to load with the model.
     * @param {object} [config.canvasConfig] - Overrides for click/tap events on the 3D canvas. Refer to {@link #setCanvasClickBehavior} for details.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setUp
     */
    Viewer3D.prototype.setUp = function (config) {

        this.config = config || {};
        this.config.extensions = this.config.extensions || [];

        // Load the extensions specified in the config.
        //
        if (Array.isArray(this.config.extensions)) {
            var extensions = this.config.extensions;
            for (var i = 0; i < extensions.length; ++i) {
                this.loadExtension(extensions[i], this.config);
            }
        }

        // load mixpanel analytics
        this.loadExtension('Autodesk.Viewing.MixpanelExtension');

        //load debug ext by query param
        var debugConfig = getParameterByName("lmv_viewer_debug");
        if (debugConfig === "true") {
            this.loadExtension("Autodesk.Debug", this.config);
        }

        var canvasConfig = this.config.canvasConfig || Viewer3D.kDefaultCanvasConfig;
        this.setCanvasClickBehavior(canvasConfig);

        this._onAggregatedSelectionChanged = this._onAggregatedSelectionChanged.bind(this);
        this.addEventListener(et.AGGREGATE_SELECTION_CHANGED_EVENT, this._onAggregatedSelectionChanged);
    };

    /**
     * Unloads extensions and the loaded models.
     * Invoked automatically by {@link Autodesk.Viewing.Viewer3D#finish} method.
     * 
     * @param {boolean} [isUnloadModelsWanted] - Whether to unload models at the end. Default is true.
     * 
     * @alias Autodesk.Viewing.Viewer3D#tearDown
     */
    Viewer3D.prototype.tearDown = function (isUnloadModelsWanted = true) {
        this.clearSelection();

        this.removeEventListener(et.AGGREGATE_SELECTION_CHANGED_EVENT, this._onAggregatedSelectionChanged);

        if (this.loadedExtensions) {
            for (var extensionId in this.loadedExtensions) {
                try {
                    // Extensions that fail to unload will end up terminating
                    // the viewer tearDown process.  Thus we protect from it
                    // here and log it (if available).
                    this.unloadExtension(extensionId);
                } catch (err) {
                    logger.error("Failed to unload extension: " + extensionId, err, errorCodeString(ErrorCodes.VIEWER_INTERNAL_ERROR));
                    logger.track(
                        {
                            category:"error_unload_extension",
                            extensionId: extensionId,
                            error_message: err.message,
                            call_stack: err.stack
                        });
                }
            }
            this.loadedExtensions = null;
        }

        // Deactivate mouse events and touch gestures. If a new model will be loaded, it will be enabled again (activateDefaultNavigationTools).
        if (this.toolController) {
            this.toolController.enableMouseButtons(false);
            this.toolController.deactivateTool("gestures");
        }

        logger.reportRuntimeStats(true);

        this._loadingSpinner.show();

        if (this.liveReviewClient) {
            this.liveReviewClient.destroy();
            this.liveReviewClient = null;
        }

        //Stop ADP tracking
        while (this.trackADPTimer.length > 0) {
            clearTimeout(this.trackADPTimer.pop());
        }

        if (isUnloadModelsWanted) {
            this.impl.unloadCurrentModel(); // This actually unloads ALL models
        }
        this.impl.setCutPlaneSet('__set_view', undefined);
    };

    /**
     * When selection has changed set the pivot point to be in the middle, if Autodesk.Viewing.Private.Prefs3D.SELECTION_SETS_PIVOT is true
     * 
     * @alias Autodesk.Viewing.Viewer3D#_onAggregatedSelectionChanged
     */
    Viewer3D.prototype._onAggregatedSelectionChanged = function()
    {
        if (this.navigation.getSelectionSetsPivot()) {
            const selection = this.impl.selector.getAggregateSelection();
            if (selection.length) {
                const selectionBounds  = this.impl.get3DBounds(selection);
                this.utilities.setPivotPoint(selectionBounds.getCenter(new THREE.Vector3()), true, true);
                this.utilities.pivotActive(this.navigation.getPivotSetFlag(), true);
            }
        }
    };

    /**
     * Triggers the Viewer's render loop.
     * Invoked automatically by {@link Autodesk.Viewing.Viewer3D#start} method.
     * Refer to {@link ViewerConfig|ViewerConfig.startOnInitialize} to change start's method behavior.
     * 
     * @alias Autodesk.Viewing.Viewer3D#run
     */
    Viewer3D.prototype.run = function()
    {
        if( !this.running ) {
            this.resize();
            this.running = true;
            this.impl.run();
        }
    };


    /**
     * Localize the viewer. This method can be overwritten so that the subclasses
     * can localize any additional elements. Invoked internally during initialization.
     * 
     * @alias Autodesk.Viewing.Viewer3D#localize
     */
    Viewer3D.prototype.localize = function()
    {
        i18n.localize();
    };

    Viewer3D.prototype.__initAutoCam = function(impl)
    {
        var self = this;

        var ourCamera = impl.camera;

        if( !ourCamera.pivot )
            ourCamera.pivot = new THREE.Vector3(0, 0, 0);

        if( !ourCamera.target )
            ourCamera.target = new THREE.Vector3(0, 0, 0);

        if( !ourCamera.worldup )
            ourCamera.worldup = ourCamera.up.clone();

        function autocamChange(upChanged)
        {
            if( self.autocamCamera.isPerspective !== ourCamera.isPerspective )
            {
                if( self.autocamCamera.isPerspective )
                    self.navigation.toPerspective();
                else
                    self.navigation.toOrthographic();
            }
            self.navigation.setVerticalFov(self.autocamCamera.fov, false);
            self.navigation.setView(self.autocamCamera.position, self.autocamCamera.target);
            self.navigation.setPivotPoint(self.autocamCamera.pivot);
            self.navigation.setCameraUpVector(self.autocamCamera.up);
            if( upChanged )
                self.navigation.setWorldUpVector(self.autocamCamera.worldup);

            self.impl.syncCamera(upChanged);
        }

        function pivotDisplay(state)
        {
            if( self.utilities )
                self.utilities.pivotActive(state, false);
            else
                self.impl.controls.pivotActive(state, false);
        }

        function onTransitionCompleted() {
            self.fireEvent({ type: et.CAMERA_TRANSITION_COMPLETED });
        }

        self.autocamCamera = ourCamera.clone();
        self.autocamCamera.target = ourCamera.target.clone();
        self.autocamCamera.pivot  = ourCamera.pivot.clone();
        self.autocamCamera.worldup = ourCamera.worldup.clone();

        self.autocam  = new Autocam(self.autocamCamera, self.navigation, self.canvas);
        self.autocam.setGlobalManager(this.globalManager);
        self.autocam.registerCallbackCameraChanged(autocamChange);
        self.autocam.registerCallbackPivotDisplay(pivotDisplay);
        self.autocam.registerCallbackTransitionCompleted(onTransitionCompleted);

        self.addEventListener("cameraChanged", function(evt)
        {
            var ourCamera = evt.camera;
            self.autocam.sync(ourCamera);
        });

        self.autocam.sync(ourCamera);
    };


    /**
     * Removes all created DOM elements, performs GL uninitialization that is needed and removes event listeners.
     * 
     * @alias Autodesk.Viewing.Viewer3D#uninitialize
     */
    Viewer3D.prototype.uninitialize = function()
    {

        this.removeWindowEventListener('resize', this.onResizeCallback, false);
        this.onResizeCallback = null;

        this.removeWindowEventListener('scroll', this.onScrollCallback);
        this.onScrollCallback = null;

        if(this.canvas) {
            this.canvas.removeEventListener('mousedown', this.onMouseDown); 
        } else if(this.container) {
            this.container.removeEventListener('mousedown', this.onMouseDown);
        }
        this.onMouseDown = null;

        if(this.canvas) {
            this.canvas.removeEventListener('mouseup', this.onMouseUp); 
        } else if(this.container) {
            this.container.removeEventListener('mouseup', this.onMouseUp);
        }
        this.onMouseUp = null;

        this.canvas.parentNode.removeChild(this.canvas);
        this.canvas.viewer = null;
    
        // Detach canvas
        if (InitParametersSetting.canvas === this.canvas) {
            InitParametersSetting.canvas = null;
        }
        this.canvas = null;

        this.canvasWrap = null;

        this.viewerState = null;

        logger.reportRuntimeStats();
        logger.track({category:"viewer_destroy"}, true);

        if( this.toolController ) {
            this.toolController.uninitialize();
            this.toolController = null;
            this.clickHandler = null;
            this.utilities = null;
        }

        if (this.navigation) {
            this.navigation.uninitialize();
            this.navigation = null;
        }

        if (this.impl){
            this.impl.dtor();
            this.impl = null;
        }

        if (this.overlays) {
            this.overlays.dtor();
            this.overlays = null;
        }
        
        this.loadSpinner = null;
        this._loadingSpinner.destroy();
        this._loadingSpinner = null;

        this.prefs && this.prefs.clearListeners();
        this.prefs = null;
        this.profile = null;
        this.profileManager = null;

        this.autocam.dtor();
        this.autocam = null;
        this.autocamCamera = null;

        //this._hotkeyManager.popHotkeys("Autodesk.ForceUpdate");
        this._hotkeyManager.popHotkeys("Autodesk.FitToView");
        this._hotkeyManager.popHotkeys("Autodesk.Home");
        this._hotkeyManager.popHotkeys("Autodesk.Escape");
        this._hotkeyManager.popHotkeys("Autodesk.Pan");
        this._hotkeyManager.popHotkeys("Autodesk.Orbit");
        this._hotkeyManager = null;

        Viewer3D.ViewerCount--;
        if (Viewer3D.ViewerCount === 0) {
            clearPropertyWorkerCache();
        }

        if (this.onDefaultContextMenu) {
            this.container.removeEventListener('contextmenu', this.onDefaultContextMenu, false);
            this.onDefaultContextMenu = null;
        }

        if (this.screenModeDelegate) {
            this.screenModeDelegate.uninitialize();
            this.screenModeDelegate = null;
        }

        if (this._displayEdges) {
            this.removeEventListener(et.GEOMETRY_LOADED_EVENT, this._displayEdges);
            this._displayEdges = null;
        }

        if (this._setDoubleSided) {
            this.removeEventListener(et.MODEL_ADDED_EVENT, this._setDoubleSided);
            this._setDoubleSided = null;
        }

        this.extensionCache = null;
        this.clientContainer = null;
        this.config = null;
        this.contextMenu = null;
        this.contextMenuCallbacks = null;

        if (this.container && this.container.parentNode)
            this.container.parentNode.removeChild(this.container);
        this.container = null;
        this._forgeLogo = null;

        this.dispatchEvent(et.VIEWER_UNINITIALIZED);

        //forget all event listeners
        this.listeners = {};

        const _window = av.getGlobal();
        if (_window.NOP_VIEWER === this) {
            _window.NOP_VIEWER = null;
        }

        const idx = _window.NOP_VIEWERS?.indexOf(this);
        if (idx !== -1) {
            _window.NOP_VIEWERS.splice(idx, 1);

            if (_window.NOP_VIEWERS.length === 0) {
                _window.NOP_VIEWERS = null;
            }
        }

        logger.log("viewer destroy");
    };


    /**
     * Unloads any loaded extensions and then uninitializes the viewer.
     * 
     * @alias Autodesk.Viewing.Viewer3D#finish
     */
    Viewer3D.prototype.finish = function() {
        this.tearDown();
        this.uninitialize();
    };


    Viewer3D.prototype.setLoadHeuristics = function(options) {

        //Check for source file extension -- Revit and Navisworks are AEC/BIM models
        var bubbleNode = options.bubbleNode;
        if (bubbleNode) {
            var viewable = bubbleNode.findViewableParent();
            if (viewable) {
                var fileName = viewable.name();
                options.fileExt = fileName.slice(fileName.length - 3).toLowerCase();
                var AECextensions = ['rvt', 'nwd', 'nwc', 'ifc'];
                if (typeof options.isAEC === "undefined" && AECextensions.indexOf(options.fileExt) !== -1) {
                    options.isAEC = true;
                }
            }
        }


        if (options.isAEC) {

            if (typeof options.useConsolidation === "undefined") {
                //If it's an AEC model, use mesh consolidation unless explicitly turned off
                let cparam = getParameterByName("useConsolidation") || "";
                options.useConsolidation = cparam === "true" ? true : (cparam === "false" ? false : undefined);
            }
            if (typeof options.useConsolidation === "undefined") {
                options.useConsolidation = !isMobileDevice() && !isNodeJS(); //Consolidation requires a renderer, hence skip on node.js
            }
            if (typeof options.createWireframe === "undefined") {
                options.createWireframe = !isMobileDevice();
            }

            if (typeof options.disablePrecomputedNodeBoxes === "undefined") {
                options.disablePrecomputedNodeBoxes = true;
            }

        } else {

            if (typeof options.createWireframe === "undefined") {
                options.createWireframe = !isMobileDevice() && this.prefs.get('edgeRendering');
            }
        }

        // When using consolidation, a too fine-grained bvh would eliminate the performance gain.
        // To avoid that, we use larger default settings when activating consolidation.
        //
        // Doing this for consolidation only is done to minimize the scope of potential side effects whenever consolidation is not used.
        // It might generally be useful to increase these values, but this requires more investigation of potential performance impact first.
        if (options.useConsolidation && !options.bvhOptions) {
            options.bvhOptions = {};
            Consolidation.applyBVHDefaults(options.bvhOptions);
        }

    };

    /**
     * ADP
     */
    Viewer3D.prototype.trackADPSettingsOptions = function () {
        var self = this;
        this.trackADPTimer.push(setTimeout(function () {
            if(self.prefs) {
                var settingOptionsStatus = {
                    category: "settingOptionsStatus",
                    switchSheetColorWhiteToBlack: self.prefs.get('swapBlackAndWhite'),
                    leftHandedMouseSetup: self.prefs.get('leftHandedMouseSetup'),
                    openPropertiesOnSelect: self.prefs.get('openPropertiesOnSelect'),
                    orbitPastWorldPoles: self.prefs.get('orbitPastWorldPoles'),
                    reverseMouseZoomDirection: self.prefs.get('reverseMouseZoomDir'),
                    fusionStyleOrbit: self.prefs.get('fusionOrbit'),
                    setPivotWithLeftMouseButton: self.prefs.get('clickToSetCOI'),
                    zoomTowardPivot: self.prefs.get('zoomTowardsPivot'),
                    viewCubeActsOnPivot: self.prefs.get('alwaysUsePivot'),
                    showViewCube: self.prefs.get('viewCube'),
                    environmentImageVisible: self.prefs.get('envMapBackground'),
                    displayEdges: self.prefs.get('edgeRendering'),
                    displayPoints: self.prefs.get('pointRendering'),
                    displayLines: self.prefs.get('lineRendering'),
                    ghostHiddenObjects: self.prefs.get('ghosting'),
                    groundReflection: self.prefs.get('groundReflection'),
                    groundShadow: self.prefs.get('groundShadow'),
                    ambientShadows: self.prefs.get('ambientShadows'),
                    antiAliasing: self.prefs.get('antialiasing'),
                    progressiveModelDisplay: self.prefs.get('progressiveRendering'),
                    smoothNavigation: self.prefs.get('optimizeNavigation')
                };
                logger.track(settingOptionsStatus);
            }
        },30000));

    };


    Viewer3D.prototype.trackADPExtensionsLoaded = function () {
        var self = this;
        var extensionList = {};
        extensionList.category = "loaded_extensions";
        this.trackADPTimer.push(setTimeout(function () {
           if(self.loadedExtensions) {
               for (var extensionId in self.loadedExtensions) {
                   extensionList[extensionId] = extensionId;
               }
           }
           logger.track(extensionList);
        },30000));
    };

    Viewer3D.prototype.activateDefaultNavigationTools = function(is2d) {
        if (isNodeJS())
            return;
        var defaultNavTool = (is2d ? "pan" : "orbit");
        // Sets the default tool
        this.setDefaultNavigationTool(defaultNavTool);
        // Then activate the tool
        this.setActiveNavigationTool(defaultNavTool);

        if (this.toolController) {
            this.toolController.enableMouseButtons(true);
            this.toolController.activateTool("gestures");
        }
    };

    Viewer3D.prototype.registerDimensionSpecificHotkeys = function(is2d) {
        if (!this._hotkeyManager)
            return;

        if (is2d) {
            // Remove 3D specific hotkeys
          this._hotkeyManager.popHotkeys("Autodesk.Orbit");
        } else {

            var self = this;

            // Add 3D specific hotkeys
            // Orbit
            var previousTool;
            var onPress = function() {
                previousTool = self.getActiveNavigationTool();
                return self.setActiveNavigationTool("orbit");
            };
            var onRelease = function() {
                return self.setActiveNavigationTool(previousTool);
            };
            var hotkeys = [
                {
                    keycodes: [KeyCode.ALT],
                    onPress: onPress,
                    onRelease: onRelease
                }];
          this._hotkeyManager.pushHotkeys("Autodesk.Orbit", hotkeys, {tryUntilSuccess: true});
        }
    };

    Viewer3D.prototype.onModelAdded = function(model, preserveTools) {

        if (model.is2d() && !model.isLeaflet()) {
            this.navigation.setMinimumLineWidth(model.loader?.svf?.minLineWidth);
        }
        
        var models = this.impl.modelQueue().getModels();
        var isFirstModel = (models.length === 1);

        if (isFirstModel) {
            this.initializeFirstModelPresets(model, preserveTools);
        }
    };

    Viewer3D.prototype.initializeFirstModelPresets = function(model, preserveTools, preserveView) {
        if (model.is2d()) {
            this.activateLayerState("Initial");
        }

        //OK, pay attention here:
        //The code here is a mess in order to make "freeorbit" as default navigation
        //unit test load the initial view correctly.
        //First, we call setActiveNavigationTool() with blank, which will make
        //"freeorbit" the active tool. This will trigger a HACK in Viewer3dImpl.setViewFromCamera
        //which checks for that and uses a different initialization code path of the initial view.
        //Only then, after this happens, we call activateDefaultNavigationTools(), which seems to
        //override the name of the active tool somehow from "freeorbit" to "orbit"
        //and would prevent the camera from initializing correctly.
        //Ideally, the "freeorbit" hack would be removed from Viewer3dImpl and moved here, but this is
        //beyond the scope of the Forge-Fluent merge at this point.

        if (!preserveView && !model.getData().loadOptions.preserveView) {
            this.setActiveNavigationTool();
            this.impl.setViewFromFile(model, true);
            this.toolController.recordHomeView();
        }

        this.registerDimensionSpecificHotkeys(model.is2d());
        if (!preserveTools)
            this.activateDefaultNavigationTools(model.is2d());

        this.navigation.setIs2D(this.impl.modelQueue().areAll2D());
        
        // For leaflet, restrict 2D navigation, so that we cannot zoom/pan away from the image
        // and stop zoom-in when reaching max resolution.
        if (model.isLeaflet()) {
            var modelData = model.getData();
            this.navigation.setConstraints2D(modelData.bbox, modelData.maxPixelPerUnit);
        }
        else {
            // If it is not a leaflet model, clear constrain 2d.
            // Otherwise, it will leak to the next model that viewer could open up.
            this.navigation.setConstraints2D();
        }
    };

    /**
     * Loads a model into the viewer. Can be used sequentially to load multiple 3D models into the same scene.
     * 
     * @param {string} url - The url to the model.
     * @param {object} [options] - Dictionary of options.
     * @param {Autodesk.Viewing.FileLoader} [options.fileLoader] - The file loader to use for this url. Required for unsupported file types.
     * @param {object} [options.loadOptions] - May contain params that are specific for certain loaders/filetypes.
     * @param {string} [options.sharedPropertyDbPath] - Optional path to shared property database.
     * @param {string} [options.ids] - A list of object IDs to load.
     * @param {boolean}  [options.loadAsHidden] - By default, a new model is instantly shown and triggers viewer refreshes
     *                                          during loading. Setting this option avoids that. The model can then be
     *                                          shown later by calling showModel().
     * @param {string} [options.modelNameOverride] - Allows host application to override model name used in UI.
     * @param {LmvMatrix4} [options.placementTransform] - Applied to the model during loading.
     * @param {string|Object} [options.applyScaling] - Unit-Scaling that is applied to the model on load, e.g. { from: 'ft', to: 'm' }.
     *                                                 If 'from' is not set, it is determined from model metadata (if provided). If only 'to' is set,
     *                                                 you can just assign a string directly, e.g. applyScaling = 'm' is the same as applyScaling = { to: 'm' }.
     * @param {boolean}[options.applyPlacementInModelUnits] - Only relevant if options.placementTransform and options.applyScaling are both used at once.
     *                                                      In this way, it controls the order in which placement and scaling happen:
     *                                                        - False: Placement happens in viewer world-units. That is, applyScaling is done first,
     *                                                          then the custom placementMatrix is applied. (Default behavior)
     *                                                        - True: Placement happens in model units. That is, custom placementMatrix is applied first,
     *                                                          then the unit scaling. 
     * @param {Autodesk.Viewing.Viewer3D~onLoadModelSuccess} [onSuccessCallback] - A method that gets called when model's metadata loading is done
     * and geometry streaming starts.
     * @param {Autodesk.Viewing.Viewer3D~onLoadModelFailure} [onErrorCallback] - A method that gets called when loading fails.
     * 
     * @alias Autodesk.Viewing.Viewer3D#loadModel
     */
    Viewer3D.prototype.loadModel = async function(url, options, onSuccessCallback, onErrorCallback, onWorkerStart) {
        var self = this;

        // Kind of sucks, but I couldn't think of a better way because loaders
        // are so
        var reservation = self.impl._reserveLoadingFile();     // Reserve a slot for a loading file
        options = options || {};

        if (typeof options.skipPropertyDb === "undefined") {
            var skipParam = getParameterByName("skipPropertyDb") || "";
            options.skipPropertyDb = skipParam === "true" ? true : (skipParam === "false" ? false : undefined);
        }

        var loaderInstance;
        function onDone( error, model ) {
            if (!self.impl) {
                return; // In case viewer was destroyed before model finished loading
            }

            self.impl._removeLoadingFile(loaderInstance);
            if (error) {
                self.dispatchEvent({ type: et.LOADER_LOAD_ERROR_EVENT, error: error, loader: loaderInstance });
                onError( error.code, error.msg, error.args );
                return;
            }

            model.getData().underlayRaster = options.underlayRaster && model.getLeaflet();

            if (options.loadAsHidden) {
                self.impl.modelQueue().addHiddenModel(model);
            } else {
                self.impl.addModel(model);
            }

            if (model.loader && model.loader.notifiesFirstPixel && self._loadingSpinner instanceof LoadingSpinner) {
                // Remove loading spinner after at least a part of the model has made it to the screen
                // At this point, only the model root (aka: just data, no graphics) has been received. 
                self.addEventListener(et.RENDER_FIRST_PIXEL, function(){
                    self._loadingSpinner.hide();
                }, {once: true});
            } else {
                self._loadingSpinner.hide();
            }

            // LMV-5628: Show the forge logo.
            if (!isNodeJS() && self._forgeLogo) {
                self._forgeLogo.style.display = "block";
            }

            if (onSuccessCallback) {
                onSuccessCallback(model);
            }
        }

        function onError( errorCode, errorMessage, errorArgs ) {
            self._loadingSpinner.hide();
            if (onErrorCallback) {
                onErrorCallback( errorCode, errorMessage, errorArgs );
            }
        }

        var match = url.toLowerCase().match(/\.([a-z0-9]+)(\?|$)/),
            fileExtension = match ? match[1] : null;

        // Allow loader extension to be in the options block or the known extensions
        var loaderExtension = (this.config && this.config.loaderExtensions && this.config.loaderExtensions[fileExtension]) ||
            (fileExtension in loaderExtensions && loaderExtensions[fileExtension]);
        // If the loader is in an extension and the extension isn't loaded, then load it.
        if (loaderExtension && !this.isExtensionLoaded(loaderExtension)) {
            // The extension registers the loader for the file type 
            try {
                await this.loadExtension(loaderExtension, this.config);
            } catch(e) {
                self.impl._removeLoadingFile(reservation);
                onErrorCallback && onErrorCallback(ErrorCodes.VIEWER_INTERNAL_ERROR, e.toString());
                return false;
            }
        }

        var loader;
        if (options && options.fileLoader) {
            loader = options.fileLoader;
        } else {
            loader = FileLoaderManager.getFileLoaderForExtension(fileExtension);
        }

        // if there's no loader, don't try to create it and cause an error.
        if (!loader) {
            self.impl._removeLoadingFile(reservation);
            logger.error("File extension not supported:" + fileExtension, errorCodeString(ErrorCodes.UNSUPORTED_FILE_EXTENSION));
            onError(ErrorCodes.UNSUPORTED_FILE_EXTENSION, "File extension not supported", 0, fileExtension);
            return false;
        }

        //Run some heuristics to adapt the viewing experience to the model we are about to display
        this.setLoadHeuristics(options);

        // Add spinner for first model
        if (!this.impl.hasModels()) {
            this._loadingSpinner.show();
        }

        // check whether there is a way to reuse existing loader
        // for dwf/pdf it will generate document tree, that means
        // 1 loader can load multiply model
        if(typeof(loader.getExistingInstance) === "function") {
            // we can keep an reference between the document created in DWFLoader with the instance who created
            // once we navigate in the same dwf file, there is no need to create a new loader instance
            loaderInstance = loader.getExistingInstance(url, options, this.config);
        }
        if(!loaderInstance) {
            loaderInstance = new loader(this.impl, this.config);
        }

        self.impl._addLoadingFile(reservation, loaderInstance);
        var returnValue = loaderInstance.loadFile(url, options, onDone, onWorkerStart);
        // If the loader returns false, make sure we don't wait for it.
        if (!returnValue)
            self.impl._removeLoadingFile(loaderInstance);

        this.fireEvent({ type: et.LOADER_LOAD_FILE_EVENT, loader: loaderInstance });
        
        // Setup of AO, Ghosting, Env Lighting etc.
        // This will also setup the viewer.profile only for the web version of the viewer.
        // This should work with the nodejs version, but loading the settings from the loadModel function causes some methods to be undefined. 

        // Initialize the profile only if the viewer.profile is not set.
        // This will insure that the loadModel model functions sets the settings once.
        if (!options.skipPrefs) {
            if (!isNodeJS() && !this.profile) {
                let profile = this.chooseProfile(options);
                this.setProfile(profile, false);
            }
        } else {
            // These preferences are expected to be always available even if no profile is loaded
            if (this.prefs.get(Prefs.DISPLAY_UNITS) === undefined) {
                this.prefs.set(Prefs.DISPLAY_UNITS, new EnumType(displayUnitsEnum));
            }
            if (this.prefs.get(Prefs.DISPLAY_UNITS_PRECISION) === undefined) {
                this.prefs.set(Prefs.DISPLAY_UNITS_PRECISION, new EnumType(displayUnitsPrecisionEnum));
            }
        }

        // analytics
        const dataToTrack = getLoadModelData(url, fileExtension, returnValue, options.bubbleNode);
        analytics.track('viewer.model.load', dataToTrack);

        return returnValue;
    };


    /**
     * Check whether models are completely loaded
     * This method checks all models in the model queue and load requests that haven't loaded
     * the root model yet. A model is completely loaded when the root model is loaded, all of
     * the geometry is loaded, the property database, if present is loaded and no textures are
     * being loaded.
     * @param {Object} [include] Optional object to set the scope of the wait
     * @param {Boolean} [include.geometry] Set to false to exclude the geometry loading
     *  from consideration. Because textures are loaded with geometry, include.textures
     *  must also be set to false to prevent geometry from being considered. Defaults to true.
     * @param {Boolean} [include.propDb] Set to false to exclude the property data base loading
     *  from consideration. Defaults to true.
     * @param {Boolean} [include.textures] Set to false to exclude the texture loading
     *  from consideration. Defaults to true.
     * @param {Boolean} [include.hidden] Set to true to include hidden models
     *  for consideration. Defaults to false.
     * @param {Model|Model[]} [include.onlyModels] Limits the check to the model or models
     *  in this property. Note that checking for textures loaded cannot be limited to models.
     * @return {Boolean} True if all models are completely loaded, otherwise false
     * 
     * @alias Autodesk.Viewing.Viewer3D#isLoadDone
     */
    Viewer3D.prototype.isLoadDone = function({ geometry = true, propDb = true, textures = true, hidden = false, onlyModels = undefined } = {}) {
        // If we are only checking for specific models, then ignore whether the viewer
        // is started and whether other loaders are starting
        if (!onlyModels) {
            // If we haven't initiialized the viewer, then the load is done.
            if (!this.started)
                return true;

            // If a load is in progress that hasn't called onDone then we are not done
            if (this.impl._hasLoadingFile())
                return false;
        }

        // If we are waiting for textures and textures are in progress, then we are not done.
        if (textures && (Autodesk.Viewing.Private.TextureLoader.requestsInProgress() > 0))
            return false;

        geometry = geometry || textures;    // Waiting for textures forces waiting for geometry

        // Check whether a model is loaded
        const isModelLoaded = model => {
            return !model || (
                (geometry ? model.isLoadDone() : model.modelRootLoaded) &&
                (!propDb || !model.getPropertyDb() || model.getPropertyDb().isLoadDone())
            );
        };

        if (onlyModels) {
            if (Array.isArray(onlyModels))
                return onlyModels.every(isModelLoaded);
            return isModelLoaded(onlyModels);
        }

        const models = this.impl.modelQueue();
        return models.getModels().every(isModelLoaded) &&
            (!hidden || models.getHiddenModels().every(isModelLoaded));
    };

    /**
     * Wait for models to be completely loaded
     * This method checks all models in the model queue and load requests that haven't loaded
     * the root model yet. A model is completely loaded when the root model is loaded, all of
     * the geometry is loaded, the property database, if there is one, is loaded and no textures are
     * being loaded. If this method is called before the viewer is started, then it will wait
     * until the viewer starts and at least one model start loading to check for the load completing
     * @param {Object} [include] Optional object to set the scope of the wait
     * @param {Boolean} [include.geometry] Set to false to exclude the geometry loading
     *  from consideration. Because textures are loaded with geometry, include.textures
     *  must also be set to false to prevent waiting for geometry to load. Defaults to true.
     * @param {Boolean} [include.propDb] Set to false to exclude the property data base loading
     *  from consideration. Defaults to true.
     * @param {Boolean} [include.textures] Set to false to exclude the texture loading
     *  from consideration. Defaults to true.
     * @param {Boolean} [include.hidden] Set to true to include hidden models
     *  for consideration. Defaults to false.
     * @param {Model|Model[]} [include.onlyModels] Limits the wait to the model or models
     *  in this property. Note that waiting for textures loaded cannot be limited to models.
     * @return {Promise} resolves when all models are loaded. This promise can be rejected
     *  by a LOADER_LOAD_ERROR_EVENT event.
     * 
     * @alias Autodesk.Viewing.Viewer3D#waitForLoadDone
     */
    Viewer3D.prototype.waitForLoadDone = function(include) {
        return new Promise((resolve, reject) => {

            var { geometry = true, propDb = true, textures = true, hidden = false, onlyModels = undefined } = include || {};
            geometry = geometry || textures;
            const _include = { geometry, propDb, textures, hidden, onlyModels };

            // We don't say the viewer is started until we 
            const hasStartedLoading = () => {
                return this.started && (this.impl._hasLoadingFile() ||
                    this.impl.modelQueue().getModels().length > 0 ||
                    this.impl.modelQueue().getHiddenModels().length > 0);
            };

            // Has the viewer and a loader started? If we are checking specific
            // models, then we don't need to wait for the viewer or a loader to start.
            var started = !onlyModels && hasStartedLoading();
        
            // If we haven't started or the load is done, then wait is finished
            if (started && this.isLoadDone(_include)) {
                resolve();
                return;
            }

            var unregister;

            // On each load-relevant event, check if loading is finished.
            const onEvent = (/* event */) => {

                started = started || hasStartedLoading();

                // const pending = (this.impl.loaders && this.impl.loaders.length) || 0;
                // const visible = (this.impl.modelQueue() && this.impl.modelQueue().getModels().length) || 0;
                // const hidden = (this.impl.modelQueue() && this.impl.modelQueue().getHiddenModels().length) || 0;
                // const model = (event.loader && event.loader.model) ? event.loader.model.id :
                //     (event.model ? event.model.id : "N/A");
        
                // If we have never seen the viewer started, then continue waiting
                // Otherwise wait until the viewer isn't started, or loading is done
                if (!started || !this.isLoadDone(_include)) {
                    // logger.debug(`waitForLoadDone: Not resolved - Event - ${event.type}, Model - ${model}, Started - ${started}, Pending ${pending}, Visible - ${visible}, Hidden - ${hidden}`);
                    return;
                }

                unregister();
                resolve();
                // logger.debug(`waitForLoadDone: Resolved - Event - ${event.type}, Model - ${model}, Started - ${started}, Pending ${pending}, Visible - ${visible}, Hidden - ${hidden}`);
            };

            const onError = (event) => {
                unregister();
                // We may be able to continue waiting after an error, but there isn't
                // any consistency in the loaders to make that determination, so I will
                // reject the promise using the event object.
                const error = new Error('Error loading model');
                error.loader = event.loader;
                error.error = event.error;
                reject(error);
            };

            unregister = () => {
                if (geometry)
                    this.removeEventListener(et.GEOMETRY_LOADED_EVENT, onEvent);
                if (propDb) {
                    this.removeEventListener(et.OBJECT_TREE_CREATED_EVENT, onEvent);
                    this.removeEventListener(et.OBJECT_TREE_UNAVAILABLE_EVENT, onEvent);
                }
                if (textures)
                    this.removeEventListener(et.TEXTURES_LOADED_EVENT, onEvent);
                this.removeEventListener(et.LOADER_LOAD_FILE_EVENT, onEvent);
                this.removeEventListener(et.MODEL_ADDED_EVENT, onEvent);
                this.removeEventListener(et.MODEL_REMOVED_EVENT, onEvent);
                this.removeEventListener(et.LOADER_LOAD_ERROR_EVENT, onError);
                this.removeEventListener(et.MODEL_ROOT_LOADED_EVENT, onEvent);
                this.removeEventListener(et.VIEWER_UNINITIALIZED, resolve);    // If the viewer is finished, resolve the promise.
            };

            // register event listeners to try again if something changes
            if (geometry)
                this.addEventListener(et.GEOMETRY_LOADED_EVENT, onEvent);
            if (propDb) {
                this.addEventListener(et.OBJECT_TREE_CREATED_EVENT, onEvent);
                this.addEventListener(et.OBJECT_TREE_UNAVAILABLE_EVENT, onEvent);
            }
            if (textures)
                this.addEventListener(et.TEXTURES_LOADED_EVENT, onEvent);
            this.addEventListener(et.LOADER_LOAD_FILE_EVENT, onEvent);
            this.addEventListener(et.MODEL_ADDED_EVENT, onEvent);
            this.addEventListener(et.MODEL_REMOVED_EVENT, onEvent);
            this.addEventListener(et.LOADER_LOAD_ERROR_EVENT, onError);
            // MODEL_ROOT_LOADED_EVENT is a little different. The flag we check for
            // root loaded is set in a MODEL_ROOT_LOADED_EVENT handler. So we use
            // an arbitrary low priority to guarantee we are called after that handler.
            this.addEventListener(et.MODEL_ROOT_LOADED_EVENT, onEvent, { priority: -1000000 });
            // If the viewer is finished, resolve the promise. The viewer
            // uninitialize method clears the listeners.
            this.addEventListener(et.VIEWER_UNINITIALIZED,
                () => reject(new Error("Promise reject because viewer finished")));
        });
    };


    //Temporarily exported until Fluent adjusts to using loadDocumentNode
    export function waitForCompleteLoad(viewer, options) {

        return new Promise((resolve, reject) => {

            var loadedParts = 0;

            function endPromiseMaybe(model) {
                if (loadedParts === 2) {
                    resolve({viewer:viewer, model: model});
                }
            }

            //We have to wait for two or three things to happen in order to
            //say that the model is fully loaded. (1) the geometry,
            //(2) the material textures and (3) optionally the property database
            //The logic below hooks into various event callbacks to make this happen.

            //Callback on geometry load complete
            function gcb(e) {

                //Make sure we handle only the model we want this callback to handle
                //as we load multiple sheets into the same viewer context
                if (e.model.getData().loadOptions.bubbleNode !== options.bubbleNode)
                    return;


                viewer.removeEventListener(et.GEOMETRY_LOADED_EVENT, gcb);

                loadedParts++;

                //Call getProperties to make sure property db is loaded,
                //then continue with hashing
                if (options.skipPropertyDb) {
                    endPromiseMaybe(e.model);
                } else {
                    e.model.getProperties(
                        1,
                        () => endPromiseMaybe(e.model),
                        error => reject(error)
                    );
                }

            }
            viewer.addEventListener(et.GEOMETRY_LOADED_EVENT, gcb);


            function tcb(e) {

                //Make sure we handle only the model we want this callback to handle
                //as we load multiple sheets into the same viewer context
                if (e.model.getData().loadOptions.bubbleNode !== options.bubbleNode)
                    return;

                viewer.removeEventListener(et.TEXTURES_LOADED_EVENT, tcb);

                loadedParts++;

                endPromiseMaybe(e.model);
            }
            viewer.addEventListener(et.TEXTURES_LOADED_EVENT, tcb);
        });
    }

    /**
     * Unloads the specified model.
     * Reference {@link Autodesk.Viewing.Viewer3D#hideModel} to hide the model.
     * @param {Autodesk.Viewing.Model} model - The model to unload.
     * 
     * @alias Autodesk.Viewing.Viewer3D#unloadModel
     */
    Viewer3D.prototype.unloadModel = function(model) {
        if (!model) {
            model = this.model;
        }
        
        this.impl.unloadModel(model);
    };


    /**
     * 
     * @param {Autodesk.Viewing.Document} avDocument - The Document instance, which owns the model being loaded
     * @param {Autodesk.Viewing.BubbleNode} manifestNode - The specific manifest node to load (within the Document) 
     * @param {ViewerConfig} [options] - Options to pass to {@link Autodesk.Viewing.Viewer3D#loadModel}. Will be initialized internally if not specified.
     *                                   The options object will be augmented by automatically determined load parameters.
     * @returns {Promise} - Resolves with an object representing the model.
     * 
     * @alias Autodesk.Viewing.Viewer3D#loadDocumentNode
     */
    Viewer3D.prototype.loadDocumentNode = function(avDocument, manifestNode, options = {}) {

        var bubbleNode = manifestNode;

        //var modelRootUrl = bubbleNode.getViewableRootPath();
        var leafletOptions = options.leafletOptions || {};

        var modelRootUrl = avDocument.getViewableUrn(bubbleNode, leafletOptions);
        var sharedDbPath = bubbleNode.findPropertyDbPath();

        modelRootUrl = avDocument.getFullPath(modelRootUrl);
        sharedDbPath = avDocument.getFullPath(sharedDbPath);

        var loadOptions = {
            sharedPropertyDbPath: sharedDbPath,
            acmSessionId: avDocument.getAcmSessionId(modelRootUrl),
            bubbleNode: bubbleNode,
            // Auto-center model by default. This avoids shaking geometry / z-issues for georeferenced models.
            // Note: If you display multiple models at once, you may have change it to true and set a fixed globalOffset to align them properly.
            applyRefPoint: false, 
            loadOptions: leafletOptions,
            page: leafletOptions.page || 1
        };

        for (var p in loadOptions) {
            if (!Object.prototype.hasOwnProperty.call(options, p))
                options[p] = loadOptions[p];
        }
    
        if (!options.keepCurrentModels && this.impl.hasModels()) {
            let _conf = this.config;
            this.tearDown();
            this.setUp(_conf);
        }

        var geomNode = bubbleNode.findParentGeom2Dor3D();
        var modelExtensions = geomNode.extensions();
        if (Array.isArray(modelExtensions)) {
            modelExtensions.forEach((extId)=>{
                this.loadExtension(extId, this.config);
            });
        }

        var res = leafletOptions.isPdf ? this.loadExtension("Autodesk.PDF", this.config) : Promise.resolve();

        var useUnderlayRaster = !options.disableUnderlayRaster && leafletOptions.tempRasterPath;
        var tempRasterPromise = useUnderlayRaster ? this._loadTempRasterModel(avDocument, options, bubbleNode) : Promise.resolve();

        return res.then(() => tempRasterPromise)
        .then((underlayModel) => new Promise((resolve, reject) => {
            if (useUnderlayRaster && underlayModel && underlayModel !== this.getUnderlayRaster(bubbleNode)) {
                // If the underlay model doesn't exist anymore, load was canceled
                reject('load canceled');
                return;
            }

            this.loadModel(modelRootUrl, options,
                model => {
                    // By default, auto-initialize the camera. This might not be wanted though if either
                    //  a) A model is just loaded in the background, but not supposed to be shown immediately, or
                    //  b) A model is supposed to be shown, but just added to an aggregated view without view reset.
                    var keepView = options.loadAsHidden || options.preserveView;
                    if (!keepView && bubbleNode.type() === 'view') {
                        this.setView(bubbleNode, {skipTransition: true});
                    }

                    resolve(model);
                },
                error => {
                    reject(error);
                }
            );
        }));
    };

    /**
     * Unloads a model previously loaded by loadDocumentNode().
     * 
     * Reference {@link Autodesk.Viewing.Viewer3D#loadDocumentNode}
     * 
     * @param {Autodesk.Viewing.BubbleNode} manifestNode - The specific manifest node to unload (within the Document) 
     * @returns {boolean} - true on success
     * 
     * @alias Autodesk.Viewing.Viewer3D#unloadDocumentNode
     */
    Viewer3D.prototype.unloadDocumentNode = function(manifestNode) {

        // If model is in memory, just unload it.
        let model = this.impl.findModel(manifestNode, true);
        if (model) {
            this.impl.unloadModel(model);
            return true;
        }

        // If there are no loaders in progress, we are done here.
        if (!this.impl.loaders) {
            return false;
        }

        // Check if any loader is currently loading the model root
        //
        // Note: Cancelling loading only works for loaders that properly supports it. (so far: Otg, F2D, Svf)
        //       For this, a loader must:
        //         - Provide the load options in loader.options
        //         - Properly handle the case that dtor is called before model root is loaded, e.g. avoiding any further callback invocation
        for (let i=0; i<this.impl.loaders.length; i++) {
        
            // Check if the loader's docNode matches with the one we want to unload
            let loader     = this.impl.loaders[i];
            let loaderNode = loader.options && loader.options.bubbleNode;
            if (loaderNode === manifestNode) {

                // Loader found - stop it
                loader.dtor();
                this.impl.loaders.splice(i, 1);
                return true;
            }
        }

        // Nothing found to unload. Either the model was never loaded, was already unloaded, or is in progress and the loader does not support 
        // to cancel loading 
        return false;
    };

    // Loads a temp raster model underneath the main vector model, in order to let the user a better "time to first pixel" experience.
    Viewer3D.prototype._loadTempRasterModel = function(avDocument, options, bubbleNode) {
        return new Promise((resolve, reject) => {
            // If the main model should load as hidden, than there is no need for loading the temp leaflet model.
            if (options.loadAsHidden) {
                return resolve();
            }
            
            // Signals that the model is not a "real" one, so it won't trigger GUI and extension loading.
            options.underlayRaster = true;
            // This will force the leaflet model to be created at the same scale as the main model. (Instead of scale of [0,1]).
            options.loadOptions.fitPaperSize = true;

            const isMainModel = (model) => {
                const docNode = model.getDocumentNode();
                return docNode && docNode.getDocument()?.getPath() === bubbleNode.getDocument()?.getPath() &&
                        docNode.guid() === bubbleNode.guid() &&
                        !model.isLeaflet();
            };

            const onMainModelAdded = ({ model }) => {
                if (isMainModel(model)) {
                    // Initialize the viewer according to the main model, but preserve the current camera.
                    // Note: if we are in hypermodeling this shouldn't be done, so check that only 2 models
                    // (the raster and the vector) are loaded.
                    if (this.getVisibleModels().length === 2) {
                        this.initializeFirstModelPresets(model, false, true);
                    }

                    this.removeEventListener(et.MODEL_ADDED_EVENT, onMainModelAdded);
                }
            };
            this.addEventListener(et.MODEL_ADDED_EVENT, onMainModelAdded);

            const onMainModelRemoved = ({ model }) => {
                if (isMainModel(model)) {
                    // Restore main model's background.
                    model.changePaperVisibility(true);

                    this.removeEventListener(et.MODEL_REMOVED_EVENT, onMainModelRemoved);
                    this.removeEventListener(et.MODEL_ADDED_EVENT, onMainModelAdded);
                    this.removeEventListener(et.GEOMETRY_LOADED_EVENT, onMainModelLoadDone);
                }
            };
            this.addEventListener(et.MODEL_REMOVED_EVENT, onMainModelRemoved);

            let rasterModel;

            const onMainModelLoadDone = ({ model }) => {
                if (isMainModel(model)) {
                    // Restore main model's background.
                    model.changePaperVisibility(true);
                    // No need for main model's cleanup anymore.
                    this.removeEventListener(et.MODEL_REMOVED_EVENT, onMainModelRemoved);

                    // No need for the temp model anymore.
                    if (rasterModel) {
                        this.unloadModel(rasterModel);
                        rasterModel = null;
                    }
                    
                    this.removeEventListener(et.GEOMETRY_LOADED_EVENT, onMainModelLoadDone);
                }
            };
            this.addEventListener(et.GEOMETRY_LOADED_EVENT, onMainModelLoadDone);

            const rasterUrl = avDocument.getFullPath(options.loadOptions.tempRasterPath);

            this.loadModel(rasterUrl,
                options,
                (model) => {
                    // clean options for next model.
                    options.loadOptions.fitPaperSize = undefined;
                    options.underlayRaster = undefined;
                    options.hideBackground = true;

                    rasterModel = model;
                    resolve(model);
                },
                (errorCode) => {
                    // clean options for next model.
                    options.loadOptions.fitPaperSize = undefined;
                    options.underlayRaster = undefined;

                    if (errorCode === ErrorCodes.LOAD_CANCELED) {
                        return reject('load canceled');
                    }
                    
                    // Don't block main model loading in case of failure
                    resolve();
                } 
            );
        });
    };

    /**
     * Returns the dimensions of the WebGL canvas.
     * 
     * @returns {object} Client rectangle bounds object { width:Number, height: Number }
     * 
     * @alias Autodesk.Viewing.Viewer3D#getDimensions
     */
    Viewer3D.prototype.getDimensions = function() {
        if (this.container) {
            // NB: Getting dimensions of the client container instead of the container.
            //     At least in IE11, getting dimensions on the dynamically created
            //     child of the dynamically created parent returns a 0 height.
            var rect = {};
            if (this.getScreenMode() === ScreenMode.kFullScreen) {
                rect.width = screen.width;
                rect.height = screen.height;
            } else {
                rect = this.container.getBoundingClientRect();
            }

            return {
                width: rect.width,
                height: rect.height
            };
        }

        return null;
    };


    /**
     * Resizes the viewer. Required when wrapping div changes dimensions due to CSS changes.
     * 
     * @alias Autodesk.Viewing.Viewer3D#resize
     */
    Viewer3D.prototype.resize = function()
    {
        if (this.container.clientWidth > 0 && this.container.clientHeight > 0) {
            this.impl.resize(this.container.clientWidth, this.container.clientHeight);
        }
    };

    /**
     * @returns {Autodesk.Viewing.HotkeyManager} The hotkey manager.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getHotkeyManager
     */
    Viewer3D.prototype.getHotkeyManager = function()
    {
        return this._hotkeyManager;
    };

    /**
     * Gets the camera so it can be modified by the client.
     * @returns {THREE.Camera} The active camera.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getCamera
     */
    Viewer3D.prototype.getCamera = function()
    {
        return this.impl.camera;
    };

    /**
     * Gets the view state as a plain object.
     * A viewer state contains data for the viewport, selection and isolation.
     * 
     * Reference {@link Autodesk.Viewing.Viewer3D#restoreState}
     *
     * @tutorial viewer_state
     * 
     * @param {object} [filter] - Specifies which viewer values to get.
     * @returns {object} Viewer state.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getState
     */
    Viewer3D.prototype.getState = function( filter ) {
        return this.viewerState.getState(filter);
    };

    /**
     * Restores the viewer state from a given object.
     * 
     * Reference {@link Autodesk.Viewing.Viewer3D#getState}
     * 
     * @tutorial viewer_state
     * 
     * @param {Object} viewerState
     * @param {Object} [filter] - Similar in structure to viewerState used to filter out values
     * that should not be restored.
     * @param {boolean} [immediate] - Whether the new view is applied with (true) or without transition (false).
     * @returns {boolean} True if restore operation was successful.
     * 
     * @alias Autodesk.Viewing.Viewer3D#restoreState
     * @fires Autodesk.Viewing#VIEWER_STATE_RESTORED_EVENT
     */
    Viewer3D.prototype.restoreState = function (viewerState, filter, immediate)  {
        var success = this.viewerState.restoreState(viewerState, filter, immediate);
        if (success) {
            this.dispatchEvent({ type: et.VIEWER_STATE_RESTORED_EVENT, value: success });
        }
        return success;
    };
    
    /**
     * Loads a view specified in the Manifest JSON.
     * For 3D models it will use the camera values.
     * For 2D models it will use the viewBox values.
     * 
     * Notice that in order that the view will be properly set according to the model's transformation, the model has to be loaded first.
     * 
     * @param {Autodesk.Viewing.BubbleNode} viewNode - bubble node representing the view
     * @param {Object} [options] 
     * @param {boolean} [options.skipTransition=false] - true to apply instanstly instead of lerping. 
     * @param {boolean} [options.useExactCamera=true] - whether any up vector adjustment is to be done (to keep head up view)
     * 
     * @returns {boolean} true, if the view is applied.
     * @alias Autodesk.Viewing.Viewer3D#setView
     */
Viewer3D.prototype.setView = function (viewNode, options) {

        if (!viewNode || !(viewNode instanceof BubbleNode)) 
            return false;
    
        const parentGeom = viewNode.findParentGeom2Dor3D();

        // Find the viewNode's model, according to its parent geometry.
        // As a fallback, use the main model.
        let model = (parentGeom && this.impl.findModel(parentGeom, true)) || this.model;
    
        if (!model)
            return false;
        
        let skipTransition = options ? options.skipTransition : false;
        let useExactCamera = options ? options.useExactCamera : true;

        // 2D models
        if (viewNode.getViewBox()) {
            this.setViewFromViewBox(viewNode.getViewBox(), viewNode.name(), skipTransition);
            this.dispatchEvent({type: et.SET_VIEW_EVENT, view: viewNode});
            return true;
        }

        // 3D models
        const camera = this.getCameraFromViewArray(viewNode.data.camera, model);

        if (camera) {
            this.impl.setViewFromCamera(camera, skipTransition, useExactCamera);
        } else {
            return false;
        }

        // Camera loaded, any section planes or boxes?
        const sp = viewNode.data.sectionPlane;
        const sb = viewNode.data.sectionBox;
        const sbt = viewNode.data.sectionBoxTransform;

        const transform = model.getModelToViewerTransform();
     
        if (sp) {

            // Variable `sp` contains one or more planes. Each plane is
            // defined by 4 numbers, so sp will have either 4, 8, 12, etc values,
            // for 1, 2, 3, etc planes.

            let cutplanes = [];

            for (let i = 0; i < sp.length; i += 4) {
                const plane = new THREE.Plane(new THREE.Vector3(sp[i + 0], sp[i + 1], sp[i + 2]), sp[i + 3]);
                
                if (transform) {
                    plane.applyMatrix4(transform);
                }

                cutplanes.push(
                    new THREE.Vector4(
                    plane.normal.x,
                    plane.normal.y,
                    plane.normal.z,
                    plane.constant)
                );
            }

            this.impl.setCutPlaneSet('__set_view', cutplanes);

        } else if (sb && sbt) {

            const sbTransformMatrix = new THREE.Matrix4().fromArray([
                sbt[0], sbt[1],   sbt[2],   sbt[3],
                sbt[4], sbt[5],   sbt[6],   sbt[7],
                sbt[8], sbt[9],   sbt[10],  sbt[11],
                sbt[12], sbt[13], sbt[14],  sbt[15]
            ]);

            let min = new THREE.Vector3(sb[0], sb[1], sb[2]);
            let max = new THREE.Vector3(sb[3], sb[4], sb[5]);
            let box = new THREE.Box3(min, max);

            const boxTrans = new THREE.Matrix4();
            boxTrans.copy(transform);
            boxTrans.multiply(sbTransformMatrix);

            const planes = SceneMath.box2CutPlanes(box, boxTrans);
            this.impl.setCutPlaneSet('__set_view', planes);

        } else {

            this.impl.setCutPlaneSet('__set_view', undefined);
        }

        this.dispatchEvent({type: et.SET_VIEW_EVENT, view: viewNode});
        return true;
    };

    Viewer3D.prototype.setViewType = function(viewType) {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setViewType is not applicable to 2D");
            return;
        }
        this.prefs.set(Prefs3D.VIEW_TYPE, viewType);
    };

    /**
     * Sets the view from an array of parameters.
     * 
     * To get the view array of the current camera use: {@link Autodesk.Viewing.Viewer3D#getViewArrayFromCamera|getViewArrayFromCamera}.
     * To get the camera object from the view array use {@link Autodesk.Viewing.Viewer3D#getCameraFromViewArray|getCameraFromViewArray}.
     * @param {Number[]} params - View parameters: [position-x, position-y, position-z, target-x, target-y, target-z, up-x, up-y, up-z, aspect, fov (radians), orthoScale, isPerspective (0=perspective, 1=ortho)]
     * 
     * @alias Autodesk.Viewing.Viewer3D#setViewFromArray
     */
    Viewer3D.prototype.setViewFromArray = function(params)
    {
        //TODO: It might be best to get rid of the setViewFromArray API as it's not
        //very descriptive, and move the params->camera conversion to the bubble-reading
        //logic elsewhere.
        var camera = this.getCameraFromViewArray(params);
        this.impl.setViewFromCamera(camera, false, true);
    };

    /**
     * Returns an object representing a Camera from an unintuitive array of number.
     * Note: To use this function in multi-model scenarios, you must pass the model parameter.
     * 
     * To get the view array of the current camera use: {@link Autodesk.Viewing.Viewer3D#getViewArrayFromCamera|getViewArrayFromCamera}.
     * 
     * @param {Number[]} params - Array with 13 elements describing different aspects of a camera.
     * @param {Autodesk.Viewing.Model} [model] - Camera is transformed in the same way as the model. Default is this.model (only sufficient for single-view scenarios).
     * @returns {Object|null} - Camera object, or null if argument is invalid or missing.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getCameraFromViewArray
     */
    Viewer3D.prototype.getCameraFromViewArray = function(params, model = this.model) {

        // Make sure that camera is transformed in the same way as model (if there is one)
        const transform = model?.getModelToViewerTransform();

        return BubbleNode.readCameraFromArray(params, transform);
    };

    /**
     * Returns an Array of values that could be inserted back into a manifest to represent a view.
     * To get the camera object from the view array use {@link Autodesk.Viewing.Viewer3D#getCameraFromViewArray|getCameraFromViewArray}.
     * 
     * @returns {Number[]} - Array with 13 elements describing different aspects of the current camera.
     *
     * @alias Autodesk.Viewing.Viewer3D#getViewArrayFromCamera
     */
    Viewer3D.prototype.getViewArrayFromCamera = function() {
        var off = this.model ? this.model.getData().globalOffset : { x:0, y:0, z:0 };
        return this.impl.getViewArrayFromCamera(off);
    };

    /**
     * Sets the view from an array representing a view box.
     *
     * Not applicable to 3D.
     *
     * @param {Number[]} viewbox - View parameters: [min-x, min-y, max-x, max-y]
     * @param {string} [name] - Optional named view name to also set the layer visibility state
     * associated with this view.
     * @param {boolean} [skipTransition] - true to apply instanstly instead of lerping. 
     * 
     * @alias Autodesk.Viewing.Viewer3D#setViewFromViewBox
     */
    Viewer3D.prototype.setViewFromViewBox = function (viewbox, name, skipTransition)
    {
        var model = this.model;

        if( model && !model.is2d() )
        {
            logger.warn("Viewer3D.setViewFromViewBox is not applicable to 3D");
            return;
        }

        //set the layer state if any
        //It's annoying to search the views and states as arrays,
        //but this is the only place we do this, so converting them
        //to hashmaps is not necessary (yet).
        if (name && name.length) {
            var metadata = model.getData().metadata;
            var views = metadata.views;

            var i;
            for (i=0; i<views.length; i++) {
                if (views[i].name == name)
                    break;
            }

            if (i < views.length) {
                var state_name = views[i].layer_state;
                if (state_name)
                    this.activateLayerState(state_name);
            }
        }

        //Finally set the camera
        this.impl.setViewFromViewBox(this.model, viewbox, name, skipTransition);
    };

    /**
     * Changes the active layer state.
     * Layers is a feature usually available on 2D models and some 3D models.
     * 
     * Reference {@link Autodesk.Viewing.Viewer3D#getLayerStates}
     *
     * @param {string} stateName - Name of the layer state to activate.
     * 
     * @alias Autodesk.Viewing.Viewer3D#activateLayerState
     * 
     * @fires  Autodesk.Viewing#LAYER_VISIBILITY_CHANGED_EVENT
     */
    Viewer3D.prototype.activateLayerState = function(stateName)
    {
        this.impl.layers.activateLayerState(stateName);
        this.dispatchEvent({type: et.LAYER_VISIBILITY_CHANGED_EVENT});
    };

    /**
     * Returns information for each layer state: name, description, active.
     * Activate a state through {@link Autodesk.Viewing.Viewer3D#activateLayerState}.
     * @returns {Object[]|null} - Array of layer states. If layers don't exist or are hidden, this methods returns null.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getLayerStates
     */
    Viewer3D.prototype.getLayerStates = function () {

        return this.impl.layers.getLayerStates();
    };

    /**
     * Sets the view using the default view in the source file.
     * 
     * @param {Autodesk.Viewing.Model} [model] - The model, defaults to the loaded model.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setViewFromFile
     */
    Viewer3D.prototype.setViewFromFile = function(model)
    {
        this.setActiveNavigationTool();
        this.impl.setViewFromFile(model || this.model);
    };

    /**
     * Gets the properties for an ID.
     * 
     * @param {number} dbid - The database identifier.
     * @param {Callbacks#onPropertiesSuccess} [onSuccessCallback] - Callback for when the properties are fetched.
     * @param {Callbacks#onGenericError} [onErrorCallback] - Callback for when the properties are not found or another error occurs.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getProperties
     */
    Viewer3D.prototype.getProperties = function(dbid, onSuccessCallback, onErrorCallback)
    {
        if (this.model) {
            this.model.getProperties(dbid, onSuccessCallback, onErrorCallback);
        }
        else {
            if (onErrorCallback)
                onErrorCallback(ErrorCodes.BAD_DATA, "Properties failed to load since model does not exist");
        }
    };

    /**
     * Gets the viewer model object tree. Once the tree is received it will invoke the specified callback function.
     *
     * You can use the model object tree to get information about items in the model.  The tree is made up
     * of nodes, which correspond to model components such as assemblies or parts.
     * 
     * @param {Callbacks#onObjectTreeSuccess} [onSuccessCallback] - Success callback invoked once the object tree is available.
     * @param {Callbacks#onGenericError} [onErrorCallback] - Error callback invoked when the object tree is not found available.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getObjectTree
     */
    Viewer3D.prototype.getObjectTree = function(onSuccessCallback, onErrorCallback)
    {
        if (this.model) {
            this.model.getObjectTree(onSuccessCallback, onErrorCallback);
        }
        else {
            if (onErrorCallback)
                onErrorCallback(ErrorCodes.BAD_DATA, "ObjectTree failed to load since model does not exist");
        }
    };

    /**
     * Sets the click behavior on the canvas to follow config.
     * This is used to change the behavior of events such as selection or Center-of-Interest changed.
     * @example
     *  {
     *       "click": {
     *           "onObject": [ACTIONS],
     *           "offObject": [ACTIONS]
     *       },
     *       "clickCtrl": {
     *           "onObject": [ACTIONS],
     *           "offObject": [ACTIONS]
     *       },
     *       "clickShift": {
     *           ...
     *       },
     *       "clickCtrlShift": {
     *           ...
     *       },
     *       "disableSpinner": BOOLEAN
     *       "disableMouseWheel": BOOLEAN,
     *       "disableTwoFingerSwipe": BOOLEAN
     *  }
     *
     * Actions can be any of the following: "selectOnly", "selectToggle", "deselectAll", "isolate", "showAll", "setCOI", "focus", "hide"
     * @param {object} config - Parameter object that meets the above layout.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setCanvasClickBehavior
     */
    Viewer3D.prototype.setCanvasClickBehavior = function(config)
    {
        if (Object.prototype.hasOwnProperty.call(this.impl.controls, "setClickBehavior"))
            this.impl.controls.setClickBehavior(config);

        if( this.clickHandler )
            this.clickHandler.setClickBehavior(config);

        if (config && config.disableMouseWheel) {
            this.toolController.setMouseWheelInputEnabled(false);
        }

        if (config && config.disableTwoFingerSwipe) {
            var gestureHandler = this.toolController.getTool("gestures");
            if (gestureHandler) {
                gestureHandler.disableTwoFingerSwipe();
            }
        }
    };

    /**
     * Searches the elements for the given text. When the search is complete,
     * the callback onResultsReturned(idArray) is invoked.
     * 
     * @param {string} text - The search term (not case sensitive).
     * @param {Callbacks#onSearchSuccess} onSuccessCallback - Invoked when the search results are ready.
     * @param {Callbacks#onGenericError} onErrorCallback - Invoke when an error occured during search.
     * @param {string[]} [attributeNames] - Restricts search to specific attribute names.
     * @param {Object} [options] - Search options.
     * @param {boolean} [options.searchHidden=false] - Set to true to also search hidden properties
     * @param {boolean} [options.includeInherited=false] - Set to true to include nodes that inherit the property
     * @alias Autodesk.Viewing.Viewer3D#search
     */
    Viewer3D.prototype.search = function(text, onSuccessCallback, onErrorCallback, attributeNames, options = { searchHidden: false})
    {
        this.searchText = text;

        if (this.model) {
            this.model.search(text, onSuccessCallback, onErrorCallback, attributeNames, options);
        }
        else {
            if (onErrorCallback)
                onErrorCallback(ErrorCodes.BAD_DATA, "Search failed since model does not exist");
        }
    };

    /**
     * Returns an array of the IDs of the currently hidden nodes.
     * When isolation is in place, there are no hidden nodes returned because
     * all nodes that are not isolated are considered hidden.
     * 
     * @param {Autodesk.Viewing.Model} [model] - Model object, if passed in the hidden nodes of the model are returned
     *
     * @returns {number[]} Array of nodes that are currently hidden, when no isolation is in place.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getHiddenNodes
     */
    Viewer3D.prototype.getHiddenNodes = function (model) {
        model = model  || this.model;
        return this.impl.visibilityManager.getHiddenNodes(model);
    };

    /**
     * Returns an array of the IDs of the currently isolated nodes.
     *
     * Not yet implemented for 2D.
     * 
     * @param {Autodesk.Viewing.Model} [model] - Model object, if passed in the isolated nodes of the model are returned
     *
     * @returns {number[]} Array of nodes that are currently isolated.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getIsolatedNodes
     */
    Viewer3D.prototype.getIsolatedNodes = function (model) {
        model = model  || this.model;
        if( model && model.is2d() )
        {
            logger.warn("Viewer3D.getIsolatedNodes is not yet implemented for 2D");
            return [];
        }

        return this.impl.visibilityManager.getIsolatedNodes(model);
    };

    /**
     * Isolates one of many sub-elements. You can pass in a node or an array of nodes to isolate.
     * Pass in null to reset isolation.
     *
     * @param {number[]|number} node - A node ID or array of node IDs from the model tree {@link BaseViewer#getObjectTree}.
     * @param {Autodesk.Viewing.Model} [model] - the model that contains the node id. Defaults to the first loaded model.
     * 
     * @alias Autodesk.Viewing.Viewer3D#isolate
     */
    Viewer3D.prototype.isolate = function(node, model)
    {
        model = model || this.model;
        if (!model) {
            return;
        }

        this.impl.visibilityManager.isolate(node, model);
    };


    /**
     * Sets the background colors, which will be used to create a gradient.
     * Values are in the range [0..255]
     * 
     * @param {number} red
     * @param {number} green
     * @param {number} blue
     * @param {number} red2
     * @param {number} green2
     * @param {number} blue2
     * 
     * @alias Autodesk.Viewing.Viewer3D#setBackgroundColor
     */
    Viewer3D.prototype.setBackgroundColor = function(red, green, blue, red2, green2, blue2)
    {
        this.impl.setClearColors(red, green, blue, red2, green2, blue2);
    };

    /**
     * Sets the background opacity.
     * 
     * @param {number} opacity - Value is in the range [0.0..1.0]
     * 
     * @alias Autodesk.Viewing.Viewer3D#setBackgroundOpacity
     */
    Viewer3D.prototype.setBackgroundOpacity = function(opacity)
    {
        this.impl.setClearAlpha(opacity);
    };

    /**
     * Toggles the selection for a given dbid.
     * If it was unselected, it is selected.
     * If it was selected, it is unselected.
     *
     * Currently three ways of node selection are supported:
     * - Autodesk.Viewing.SelectionType.MIXED
     *   - Leaf nodes are selected using the overlayed selection type, and inner nodes are selected using regular selection type.
     * - Autodesk.Viewing.SelectionType.REGULAR
     *   - Nodes are tinted with the selection color.
     * - Autodesk.Viewing.SelectionType.OVERLAYED
     *   - Nodes are tinted with the selection color and shown on top of the not selected geometry.
     *
     * Not yet implemented for 2D.
     *
     * @param {number} dbid
     * @param {Autodesk.Viewing.Model} [model] - the model that contains the dbId. Uses the initial model loaded by default.
     * @param {number} selectionType a member of Autodesk.Viewing.SelectionMode.
     * 
     * @alias Autodesk.Viewing.Viewer3D#toggleSelect
     */
    Viewer3D.prototype.toggleSelect = function(dbid, model, selectionType)
    {
        model = model || this.model;
        if (model && model.is2d())
        {
            // Fails because Model.getNodeById is not supported.
            logger.warn("Viewer3D.toggleSelect is not yet implemented for 2D");
            return;
        }

        this.impl.selector.toggleSelection(dbid, model, selectionType);
    };

     /**
     * Selects the array of ids. You can also pass in a single id instead of an array.
     *
     * Currently three ways of node selection are supported:	
     * - Autodesk.Viewing.SelectionType.MIXED	
     *   - Leaf nodes are selected using the overlayed selection type, and inner nodes are selected using regular selection type.	
     * - Autodesk.Viewing.SelectionType.REGULAR	
     *   - Nodes are tinted with the selection color.	
     * - Autodesk.Viewing.SelectionType.OVERLAYED	
     *   - Nodes are tinted with the selection color and shown on top of the not selected geometry.
     * 
     * @param {number[]|number} dbids - element or array of elements to select.
     * @param {Autodesk.Viewing.Model} [model] - the model instance containing the ids.
     * @param {number} [selectionType] - a member of `Autodesk.Viewing.SelectionType`.
     * 
     * @alias Autodesk.Viewing.Viewer3D#select
     */
    Viewer3D.prototype.select = function(dbids, model, selectionType)
    {
        if (typeof dbids === "number") {
            dbids = [dbids];
        }

        model = model || this.model;
        this.impl.selector.setSelection(dbids, model, selectionType);
    };


    /**
     * Clears the selection. See {@link Autodesk.Viewing.Viewer3D#select|select()}
     * @alias Autodesk.Viewing.Viewer3D#clearSelection
     */
    Viewer3D.prototype.clearSelection = function()
    {
        this.impl.selector.clearSelection();
    };

    /**
     * Returns information about the visibility of the current selection.
     * @returns {object} `{hasVisible:boolean, hasHidden:boolean}`
     * 
     * @alias Autodesk.Viewing.Viewer3D#getSelectionVisibility
     */
    Viewer3D.prototype.getSelectionVisibility = function () {
        return this.impl.selector.getSelectionVisibility();
    };

    /**
     * Returns the number of nodes (dbIds) in the current selection.
     * @returns {number} - number of selected nodes
     * @alias Autodesk.Viewing.Viewer3D#getSelectionCount
     */
    Viewer3D.prototype.getSelectionCount = function () {
        return this.impl.selector.getSelectionLength();
    };

    /**
     * Sets selection granularity mode. Supported values are:
     * - Autodesk.Viewing.SelectionMode.LEAF_OBJECT: Always select the leaf objects in the hierarchy.
     * - Autodesk.Viewing.SelectionMode.FIRST_OBJECT: For a given node, selects the first non-composite (layer, collection, model) on the path from the root to the given node, and all children.
     * - Autodesk.Viewing.SelectionMode.LAST_OBJECT: For a given node, selects the nearest ancestor composite node and all children. 
     *   Selects the input node itself in case there is no composite node in the path to the root node.
     * 
     * @param {number} mode - The selection mode.
     * @alias Autodesk.Viewing.Viewer3D#setSelectionMode
     */
    Viewer3D.prototype.setSelectionMode = function (mode) {
        this.prefs.set(Prefs3D.SELECTION_MODE, mode);
    };


    /**
     * Returns the current selection.
     * @returns {number[]} Array of the nodes (dbIds) of the currently selected nodes.
     * @alias Autodesk.Viewing.Viewer3D#getSelection
     */
    Viewer3D.prototype.getSelection = function () {
        return this.impl.selector.getSelection();
    };


    /**
     * Locks the selection of specific `nodes` (dbIds) in a given model.
     * The `nodes` will be unselected if the `lock` is set to true and the nodes are already selected.
     * The locked nodes will not be selectable.
     * @param {Number|Number[]} dbIds - dbIds to lock
     * @param {Boolean} lock - true to lock, false otherwise
     * @param {Autodesk.Viewing.Model} [model] - The model that contains the dbId. By default uses the initial model loaded into the scene.
     * @alias Autodesk.Viewing.Viewer3D#lockSelection
     */
    Viewer3D.prototype.lockSelection = function(dbIds, lock, model) {
        model = model || this.model;
        this.impl.selector.lockSelection(dbIds, lock, model);
    };

    /**
     * This function will unlock the specified `nodes` (dbIds) for a specific `model`.
     * If the `nodes` parameter is omitted then the specified `model`'s locked nodes will be unlocked.
     * If the `model` parameter is omitted then the specified `nodes` will be unlocked for the viewer.model.
     * If both parameters are omitted then all of the models in the viewer will release their locked nodes.
     * @param {Number[]} [dbIds] - dbIds to unlock
     * @param {Autodesk.Viewing.Model} [model] - The model associated to the nodes parameters
     * @alias Autodesk.Viewing.Viewer3D#unlockSelection
     */
    Viewer3D.prototype.unlockSelection = function(dbIds, model) {
        this.impl.selector.unlockSelection(dbIds, model);
    };

    /**
     * Checks whether selection is locked for a node
     *
     * @param {number} dbId - the object's identifier.
     * @param {Autodesk.Viewing.Model} [model] - the model that contains the dbId. By default uses the initial model loaded into the scene.
     * @return {boolean} True is the visibility is locked
     * 
     * @alias Autodesk.Viewing.Viewer3D#isSelectionLocked
     */
    Viewer3D.prototype.isSelectionLocked = function(dbId, model) {
        return this.impl.selector.isNodeSelectionLocked(dbId, model);
    };

    /**
     * Returns the selected items from all loaded models.
     * @param {function} [callback] - Optional callback to receive enumerated pairs of model and dbId
     * for each selected object. If no callback is given, an array of objects is returned.
     * @returns {object[]} An array of objects with a model and selectionSet properties for each model
     * that has selected items in the scene.
     * @alias Autodesk.Viewing.Viewer3D#getAggregateSelection
     */
    Viewer3D.prototype.getAggregateSelection = function(callback) {
        var res = this.impl.selector.getAggregateSelection();

        if (callback) {
            for (var i=0; i<res.length; i++) {
                for (var j=0; j<res[i].selection.length; j++) {
                    callback(res[i].model, res[i].selection[j]);
                }
            }
        }

        return res;
    };

    /**
     * 
     * @typedef {object} SelectionDef
     * @property {Autodesk.Viewing.Model} model - The model from which to select
     * @property {number[]} ids - array of ids to select
     * @property {number} [selectionType] - a member of `Autodesk.Viewing.SelectionType`
     */

    /**
     * Selects ids from different models. Choose this api instead of select() when selecting across many models
     * @param {SelectionDef[]} selection - Array of selection objects defining what to select
     * @alias Autodesk.Viewing.Viewer3D#setAggregateSelection
     */
    Viewer3D.prototype.setAggregateSelection = function(selection) {
        this.impl.selector.setAggregateSelection(selection);
    };

    /**
     * Returns the isolated items from all loaded models.
     * 
     * @returns {object[]} An array of objects with a `model` and the isolated `ids` in that model.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getAggregateIsolation
     */
    Viewer3D.prototype.getAggregateIsolation = function() {

        var res = this.impl.visibilityManager.getAggregateIsolatedNodes();
        return res;
    };

    /**
     * Returns the hidden nodes for all loaded models.
     * 
     * @returns {object[]} An array of objects with a `model` and the hidden `ids` in that model. 
     * 
     * @alias Autodesk.Viewing.Viewer3D#getAggregateHiddenNodes
     */
    Viewer3D.prototype.getAggregateHiddenNodes = function() {

        var res = this.impl.visibilityManager.getAggregateHiddenNodes();
        return res;
    };

    /**
     * Ensures the passed in nodes (dbIds) are hidden.
     *
     * @param {number[]|number} node - An array of nodes (dbids) or just a single node.
     * @param {Autodesk.Viewing.Model} [model] - The model that contains the dbId. By default uses the initial model loaded into the scene. 
     * 
     * @alias Autodesk.Viewing.Viewer3D#hide
     */
    Viewer3D.prototype.hide = function(node, model)
    {
        model = model || this.model;
        this.impl.visibilityManager.hide(node, model);
    };

    /**
     * Ensures the passed in nodes (dbIds) are shown.
     *
     * @param {number[]|number} node - An array of nodes (dbids) or just a single node.
     * @param {Autodesk.Viewing.Model} [model] - The model that contains the dbId. By default uses the initial model loaded into the scene. 
     * 
     * @alias Autodesk.Viewing.Viewer3D#show
     */
    Viewer3D.prototype.show = function(node, model)
    {
        model = model || this.model;
        this.impl.visibilityManager.show(node, model);
    };

    /**
     * Ensures everything is visible. Clears all node isolation (3D) and turns on all layers (2D).
     * 
     * @alias Autodesk.Viewing.Viewer3D#showAll
     *
     * @fires Autodesk.Viewing#SHOW_ALL_EVENT
     */
    Viewer3D.prototype.showAll = function()
    {
        this.impl.visibilityManager.aggregateIsolate([]);
        this.impl.layers.showAllLayers();
        this.fireEvent({ type: et.SHOW_ALL_EVENT });
    };

    /**
     * Ensures all objects are hidden. Clears all nodes.
     * 
     * @alias Autodesk.Viewing.Viewer3D#hideAll
     *
     * @fires Autodesk.Viewing#HIDE_ALL_EVENT
     */
    Viewer3D.prototype.hideAll = function()
    {
        const models = this.getVisibleModels();
        models.forEach(model => {
            this.hide(model.getRootId(), model);
        });
        this.fireEvent({ type: et.HIDE_ALL_EVENT });
    };
     

    /**
     * Toggles the visibility of the given node (dbId).
     *
     * Not yet implemented for 2D.
     *
     * @param {number} dbId - the object's identifier.
     * @param {Autodesk.Viewing.Model} [model] - the model that contains the dbId. By default uses the initial model loaded into the scene.
     * 
     * @alias Autodesk.Viewing.Viewer3D#toggleVisibility
     */
    Viewer3D.prototype.toggleVisibility = function(dbId, model)
    {
        this.impl.visibilityManager.toggleVisibility(dbId, model);
    };

    /**
     * Returns true if every node (dbId) is visible.
     * @returns {boolean} - True if every node is visible, false otherwise.
     * 
     * @alias Autodesk.Viewing.Viewer3D#areAllVisible
     */
    Viewer3D.prototype.areAllVisible = function() {
        return this.impl.isWholeModelVisible(this.model);
    };

    /**
     * Returns true if the specified node is visible.
     * The model argument is required only when in multi-model scenarios.
     *
     * @param {number} nodeId - Geometry node to check if visible.
     * @param {Autodesk.Viewing.Model} [model] - The model that contains the specified ``nodeId``.
     *
     * @returns {boolean}
     * 
     * @alias Autodesk.Viewing.Viewer3D#isNodeVisible
     */
    Viewer3D.prototype.isNodeVisible = function(nodeId, model) {
        model = model || this.model;
        return this.impl.isNodeVisible(nodeId, model);
    };

    /**
     * Ensures the passed in nodes (dbIds) are shown.
     *
     * @param {number[]|number} dbId - array of nodes or a single node
     * @param {boolean} locked Set to true to lock the nodes visible. Set to false to allow the nodes to be hidden.
     * @param {Autodesk.Viewing.Model} [model] - The model that contains the dbId. By default uses the initial model loaded into the scene. 
     * 
     * @alias Autodesk.Viewing.Viewer3D#show
     */
    Viewer3D.prototype.lockVisible = function(dbId, locked, model)
    {
        model = model || this.model;
        this.impl.visibilityManager.lockNodeVisible(dbId, locked, model);
    };

    /**
     * Toggles the visibility of the given node (dbId).
     *
     * Not yet implemented for 2D.
     *
     * @param {number} dbId - the object's identifier.
     * @param {Autodesk.Viewing.Model} [model] - the model that contains the dbId. By default uses the initial model loaded into the scene.
     * 
     * @alias Autodesk.Viewing.Viewer3D#toggleLockVisible
     */
    Viewer3D.prototype.toggleLockVisible = function(dbId, model)
    {
        this.impl.visibilityManager.toggleVisibleLocked(dbId, model);
    };

    /**
     * Checks whether visibility is locked for a node (dbId).
     *
     * Not yet implemented for 2D.
     *
     * @param {number} dbId - the object's identifier.
     * @param {Autodesk.Viewing.Model} [model] - the model that contains the dbId. By default uses the initial model loaded into the scene.
     * @return {boolean} True is the visibility is locked
     * 
     * @alias Autodesk.Viewing.Viewer3D#isVisibleLocked
     */
    Viewer3D.prototype.isVisibleLocked = function(dbId, model)
    {
        return this.impl.visibilityManager.isNodeVisibleLocked(dbId, model);
    };

    /**
     * Explodes the model from the center of gravity.
     *
     * Not applicable to 2D.
     *
     * @param {number} scale - A value from 0.0-1.0 to indicate how much to explode.
     * 
     * @alias Autodesk.Viewing.Viewer3D#explode
     */
    Viewer3D.prototype.explode = function(scale)
    {
        if (!this.model)
            return;

        if (this.model.is2d())
        {
            logger.warn("Viewer3D.explode is not applicable to 2D");
            return;
        }

        var exploded = this.impl.explode(scale);
        if (exploded) {
            logger.track({ name: 'explode_count', aggregate: 'count' });
        }
    };

    /**
     * Returns the explode scale.
     *
     * Not applicable to 2D.
     *
     * @returns {number} - A value from 0.0-1.0 indicating how exploded the model is.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getExplodeScale
     */
    Viewer3D.prototype.getExplodeScale = function()
    {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.getExplodeScale is not applicable to 2D");
            return 0;
        }

        return this.impl.getExplodeScale();
    };

    /**
     * Lock node (dbid) so that it doesn't explode
     *
     * Not applicable to 2D.
     *
     * @param {number[]|number} dbids The dbids to lock or unlock
     * @param {boolean} lock Set to true to prevent dbids from exploding. Set to false to allow dbids to explode.
     * @param {Autodesk.Viewing.Model} [model] The model containing the dbids. Defaults to this.model
     * @returns {boolean} True if any dbids were changed.
     * 
     * @alias Autodesk.Viewing.Viewer3D#lockExplode
     */
    Viewer3D.prototype.lockExplode = function(dbids, lock, model)
    {
        model = model || this.model;
        if( model && model.is2d() )
        {
            logger.warn("Viewer3D.lockExplode is not applicable to 2D");
            return 0;
        }

        return this.impl.lockExplode(dbids, lock, model);
    };

    /**
     * Check whether a dbid is locked so it doesn't explode.
     *
     * Not applicable to 2D.
     *
     * @param {number} dbid The dbid to check
     * @param {Autodesk.Viewing.Model} [model] The model containing the dbids. Defaults to this.model
     * @returns {boolean} True if dbid is locked to prevent explode
     * 
     * @alias Autodesk.Viewing.Viewer3D#isExplodeLocked
     */
    Viewer3D.prototype.isExplodeLocked = function(dbid, model)
    {
        model = model || this.model;
        if( model && model.is2d() )
        {
            logger.warn("Viewer3D.isExplodeLocked is not applicable to 2D");
            return 0;
        }

        return this.impl.isExplodeLocked(dbid, model);
    };

    /**
     * Toggle dbid lock so it doesn't explode
     *
     * Not applicable to 2D.
     *
     * @param {number} dbid The dbid to lock or unlock
     * @param {Autodesk.Viewing.Model} [model] The model containing the dbids. Defaults to this.model
     * @returns {boolean} True if any dbids were changed.
     * 
     * @alias Autodesk.Viewing.Viewer3D#toggleLockExplode
     */
    Viewer3D.prototype.toggleLockExplode = function(dbid, model)
    {
        model = model || this.model;
        if( model && model.is2d() )
        {
            logger.warn("Viewer3D.toggleLockExplode is not applicable to 2D");
            return 0;
        }

        return this.impl.lockExplode(dbid, !this.isExplodeLocked(dbid, model), model);
    };


    /**
     * Enables or disables the high quality rendering settings.
     *
     * Not applicable to 2D.
     *
     * @param {boolean} useSAO - True or false to enable screen space ambient occlusion.
     * @param {boolean} useFXAA - True or false to enable fast approximate anti-aliasing.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setQualityLevel
     */
    Viewer3D.prototype.setQualityLevel = function(useSAO, useFXAA)
    {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setQualityLevel is not applicable to 2D");
            return;
        }

        this.prefs.set(Prefs3D.AMBIENT_SHADOWS, useSAO);
        this.prefs.set(Prefs3D.ANTIALIASING, useFXAA);
    };


    /**
     * Toggles ghosting during search and isolate.
     *
     * Not applicable to 2D.
     *
     * @param {boolean} value - Indicates whether ghosting is on or off.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setGhosting
     */
    Viewer3D.prototype.setGhosting = function(value)
    {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setGhosting is not applicable to 2D");
            return;
        }

        this.prefs.set(Prefs3D.GHOSTING, value);
    };

    /**
     * Toggles ground shadow.
     *
     * Not applicable to 2D.
     *
     * @param {boolean} value - Indicates whether shadow is on or off.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setGroundShadow
     */
    Viewer3D.prototype.setGroundShadow = function(value)
    {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setGroundShadow is not applicable to 2D");
            return;
        }

        this.prefs.set(Prefs3D.GROUND_SHADOW, value);
    };

    /**
     * Toggles ground reflection.
     *
     * Not applicable to 2D.
     *
     * @param {boolean} value - Indicates whether reflection is on or off.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setGroundReflection
     */
    Viewer3D.prototype.setGroundReflection = function(value)
    {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setGroundReflection is not applicable to 2D");
            return;
        }

        this.prefs.set(Prefs3D.GROUND_REFLECTION, value);
    };

    /**
     * Toggles environment map for background.
     *
     * Not applicable to 2D.
     *
     * @param {boolean} value - Indicates whether environment map for background is on or off.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setEnvMapBackground
     */
    Viewer3D.prototype.setEnvMapBackground = function(value)
    {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setEnvMapBackground is not applicable to 2D");
            return;
        }

        this.prefs.set(Prefs3D.ENV_MAP_BACKGROUND, value);
    };

    /**
     * Toggles first person tool popup.
     *
     * Not applicable to 2D.
     *
     * @param {boolean} value - Indicates whether first person tool popup is showed or not.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setFirstPersonToolPopup
     */
    Viewer3D.prototype.setFirstPersonToolPopup = function(value)
    {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setFirstPersonToolPopup is not applicable to 2D");
            return;
        }

        this.prefs.set(Prefs3D.FIRST_PERSON_TOOL_POPUP, value);
    };

    /**
     * Returns the state of First Person Walk tool popup.
     *
     * Not applicable to 2D.
     *
     * @returns {boolean} true if the First Person Walk tool popup appears, false if the First Person Walk tool popup does not appear.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getFirstPersonToolPopup
     */
    Viewer3D.prototype.getFirstPersonToolPopup = function()
    {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.getFirstPersonToolPopup is not applicable to 2D");
            return;
        }

        return this.prefs.get('firstPersonToolPopup');
    };

    /**
     * Toggles the bimwalk tool popup.
     *
     * Not applicable to 2D.
     *
     * @param {boolean} value - Indicates whether first person tool popup is showed or not.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setBimWalkToolPopup
     * 
     */
    Viewer3D.prototype.setBimWalkToolPopup = function(value)
    {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setBimWalkToolPopup is not applicable to 2D");
            return;
        }

        this.prefs.set(Prefs3D.BIM_WALK_TOOL_POPUP, value);
    };

    /**
     * Returns the state of First Person Walk tool popup
     *
     * Not applicable to 2D.
     *
     * @returns {boolean} true if the First Person Walk tool popup appears, false if the First Person Walk tool popup does not appear.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getBimWalkToolPopup
     */
    Viewer3D.prototype.getBimWalkToolPopup = function()
    {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.getBimWalkToolPopup is not applicable to 2D");
            return;
        }

        return this.prefs.get('bimWalkToolPopup');
    };

    /**
     * Toggles whether progressive rendering is used. Warning: turning progressive rendering off
     * will have serious performance implications.
     * @param {boolean} value whether it is on or off
     * 
     * @alias Autodesk.Viewing.Viewer3D#setProgressiveRendering
     */
    Viewer3D.prototype.setProgressiveRendering = function(value)
    {
        this.prefs.set(Prefs.PROGRESSIVE_RENDERING, value);
    };

    /**
     * Overrides line colors in 2D models to render in shades of gray.
     * Applies only to 2D models.
     * 
     * @param {boolean} value whether it is on or off
     * 
     * @alias Autodesk.Viewing.Viewer3D#setGrayscale
     */
    Viewer3D.prototype.setGrayscale = function(value)
    {
        if (this.model && this.model.is3d()) {
            logger.warn("Viewer3D.setGrayscale is not applicable to 3D");
            return;
        }
        this.prefs.set(Prefs2D.GRAYSCALE, value);
    };

    /**
     * AutoCAD drawings are commonly displayed with white lines on a black background. Setting reverse swaps (just)
     * these two colors.
     * @param {boolean} value whether it is on or off
     * 
     * @alias Autodesk.Viewing.Viewer3D#setSwapBlackAndWhite
     */
    Viewer3D.prototype.setSwapBlackAndWhite = function(value)
    {
        if (this.model && this.model.is3d()) {
            logger.warn("Viewer3D.setSwapBlackAndWhite is not applicable to 3D");
            return;
        }
        this.prefs.set(Prefs2D.SWAP_BLACK_AND_WHITE, value);
    };

    /**
     * Toggles whether the navigation should be optimized for performance. If set
     * to true, anti-aliasing and ambient shadows will be off while navigating.
     *
     * Not applicable to 2D.
     *
     * @param {boolean} value whether it is on or off
     * 
     * @alias Autodesk.Viewing.Viewer3D#setOptimizeNavigation
     */
    Viewer3D.prototype.setOptimizeNavigation = function(value)
    {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setOptimizeNaviation is not applicable to 2D");
            return;
        }

        this.prefs.set(Prefs3D.OPTIMIZE_NAVIGATION, value);
    };

    /**
     * Registers rendering callbacks with preferences.
     * @private
     */
    Viewer3D.prototype.initializePrefListeners = function() {
        this.prefs.addListeners(Prefs.KEY_MAP_CMD, (value) => {
            this.impl.toggleCmdMapping(value, this.toolController);
        });

        this.prefs.addListeners(Prefs3D.ANTIALIASING, (value) => {
            const useSAO = this.prefs.get(Prefs3D.AMBIENT_SHADOWS);
            this.impl.togglePostProcess(useSAO, value);
        });

        this.prefs.addListeners(Prefs3D.AMBIENT_SHADOWS, (value) => {
            const useFXAA = this.prefs.get(Prefs3D.ANTIALIASING);
            this.impl.togglePostProcess(value, useFXAA);
        });

        this.prefs.addListeners(Prefs3D.GROUND_SHADOW, (value) => {
            this.impl.toggleGroundShadow(value);
        });

        this.prefs.addListeners(Prefs3D.GROUND_REFLECTION, (value) => {
            this.impl.toggleGroundReflection(value);
        });

        this.prefs.addListeners(Prefs3D.ENV_MAP_BACKGROUND, (value) => {
            this.impl.toggleEnvMapBackground(value);
        });

        this.prefs.addListeners(Prefs.PROGRESSIVE_RENDERING, (value) => {
            this.impl.toggleProgressive(value);
        });

        this.prefs.addListeners(Prefs3D.VIEW_TYPE, (value) => {
            const curView = this.prefs.get(Prefs3D.VIEW_TYPE);

            const camera = this.impl.getModelCamera(this.model);
            if (camera) {
                const isPerspective = camera.isPerspective;
                // Update the default view from the model's stored camera.
                if (!isNaN(isPerspective)) {
                    const defaultValue = isPerspective ? VIEW_TYPES.PERSPECTIVE : VIEW_TYPES.ORTHOGRAPHIC;
                    this.prefs.setDefault(Prefs3D.VIEW_TYPE, defaultValue);
                    if (curView === VIEW_TYPES.DEFAULT) this.prefs[Prefs3D.VIEW_TYPE] = defaultValue;
                }
            }
            this.autocam.setViewType(value);
        });

        this.prefs.addListeners(Prefs2D.GRAYSCALE, (value) => {
            this.impl.toggleGrayscale(value);
        });

        this.prefs.addListeners(Prefs2D.SWAP_BLACK_AND_WHITE, (value) => {
            this.impl.toggleSwapBlackAndWhite(value);
        });

        this.prefs.addListeners(Prefs3D.OPTIMIZE_NAVIGATION, (value) => {
            this.impl.setOptimizeNavigation(value);
        });

        this.prefs.addListeners(Prefs3D.GHOSTING, (value) => {
            this.impl.toggleGhosting(value);
        });

        this.prefs.addListeners(Prefs3D.LINE_RENDERING, (value) => {
            this.impl.hideLines(!value);
        });

        this.prefs.addListeners(Prefs.POINT_RENDERING, (value) => {
            this.impl.hidePoints(!value);
        });

        this.prefs.addListeners(Prefs3D.EDGE_RENDERING, (value) => {
            this._displayEdges = () => {
                this.impl.setDisplayEdges(value);
            };
            // LMV-5390: Make sure that the model object is created before calling the setDisplayEdges.
            // This method expects the model is initialized when setting the PolygonOffset.
            if (!value && (!this.model || !this.model.isLoadDone())) {
                // This event listener will be removed in the uninitialize function.
                // That is because the initializePrefListeners is called only once when the viewer is initialized.
                // The displayEdges needs to be called for every model that is loaded.
                this.addEventListener(et.GEOMETRY_LOADED_EVENT, this._displayEdges);
            } else {
                this._displayEdges();
            }
        });

        this.prefs.addListeners(Prefs3D.LIGHT_PRESET, (value) => {
            let force = false;
            if (typeof value === 'string') {
                // find the index value
                var presetName = value;
                var idx = -1;
                for (var i=0; i<LightPresets.length; i++) {
                    if (LightPresets[i].name === presetName) {
                        idx = i;
                        break;
                    }
                }
                if (idx === -1) {
                    // Force the default light preset for envirnments that are not defined in LightPresets.
                    logger.warn('Invalid Prefs3D.LIGHT_PRESET: ' + value);
                    logger.warn('Setting to default light preset.');
                    force = true;
                }
                value = idx;
            }
            this.impl.setLightPreset(value, force);
        });

        this.prefs.addListeners(Prefs3D.ALWAYS_USE_PIVOT, (value) => {
            this.navigation.setUsePivotAlways(value);
        });

        this.prefs.addListeners(Prefs.REVERSE_MOUSE_ZOOM_DIR, (value) => {
            this.navigation.setReverseZoomDirection(value);
        });

        this.prefs.addListeners(Prefs3D.REVERSE_HORIZONTAL_LOOK_DIRECTION, (value) => {
            this.navigation.setReverseHorizontalLookDirection(value);
        });

        this.prefs.addListeners(Prefs3D.REVERSE_VERTICAL_LOOK_DIRECTION, (value) => {
            this.navigation.setReverseVerticalLookDirection(value);
        });

        this.prefs.addListeners(Prefs3D.ZOOM_TOWARDS_PIVOT, (value) => {
            this.navigation.setZoomTowardsPivot(value);
        });

        this.prefs.addListeners(Prefs3D.SELECTION_SETS_PIVOT, (value) => {
            this.navigation.setSelectionSetsPivot(value);
        });
        
        this.prefs.addListeners(Prefs3D.ORBIT_PAST_WORLD_POLES, (value) => {
            this.navigation.setOrbitPastWorldPoles(value);
        });

        this.prefs.addListeners(Prefs.LEFT_HANDED_MOUSE_SETUP, (value) => {
            this.navigation.setUseLeftHandedInput(value);
            EventUtils.setUseLeftHandedInput(value);
        });

        this.prefs.addListeners(Prefs.WHEEL_SETS_PIVOT, (value) => {
            this.navigation.setWheelSetsPivot(value);
        });

        this.prefs.addListeners(Prefs3D.SELECTION_MODE, (mode) => {
            this.impl.selector.setSelectionMode(mode);
        });

        this.prefs.addListeners(Prefs.BACKGROUND_COLOR_PRESET, (bacStr) => {
            if (bacStr) {
                try {
                    var bac = JSON.parse(bacStr);
                    this.impl.setClearColors(bac[0],bac[1],bac[2],bac[3],bac[4],bac[5]);
                } catch(e) {
                    logger.warn('Invalid Prefs.BACKGROUND_COLOR_PRESET: ' + bac);
                }
            }
        });

        this.prefs.addListeners(Prefs3D.EXPLODE_STRATEGY, (strategy) => {
            if (ModelExploder.setStrategy(strategy)) {
                this.impl.refreshExplode();
            }
        });

        this.prefs.addListeners(Prefs2D.LOADING_ANIMATION, (value) => {
            this.impl.onLoadingAnimationChanged(value);
        });

        const prevDoubleSided = {};
        // LMV-5379 - add preference to turn double sided materials on and off
        // If the value is a boolean, all of the models will get their materials toggled.
        // The value can also be an object, where the key is the model id and the value is the flag 
        // that is used to turn on and off the model's double sided materials.
        this.prefs.addListeners(Prefs3D.FORCE_DOUBLE_SIDED, (value) => {
            // Returns true if the model's materials needs to be update.
            function getEnableFlag(model) {
                if (typeof value === 'boolean') {
                    return value;
                }
                return !!value[model.id];
            }
        
            this._setDoubleSided = (event, update=true) => {
                let model = event.model;
                let enable = getEnableFlag(model);
                const modelData = model.getData();
                if (!Object.prototype.hasOwnProperty.call(prevDoubleSided, model.id)) {
                    prevDoubleSided[model.id] = !!modelData.doubleSided;
                }

                // Use the model's doubleSided flag if the value is set to false.
                // NOTE: this means that if the model has the doubleSided flag set to true,
                // this preference will not turn off double sided materials.
                const isDoubleSided = enable || !!modelData.doubleSided;
                if (isDoubleSided !== prevDoubleSided[model.id]) {
                    this.impl.setDoubleSided(isDoubleSided, model, update);
                    prevDoubleSided[model.id] = isDoubleSided;
                }
            };
        
            var models = this.impl.modelQueue().getModels();
            if (models.length === 0) {
                // Add an event listener
                this.addEventListener(et.MODEL_ADDED_EVENT, this._setDoubleSided);
            } else {
                models.forEach((model) => {
                    this._setDoubleSided({ model }, false);
                });
                this.impl.sceneUpdated();
            }
        });
    };

    /**
     * Locks or unlocks navigation controls.
     *
     * When navigation is locked, certain operations (for example, orbit, pan, or fit-to-view)
     * are disabled.
     * 
     * Reference {@link Autodesk.Viewing.Viewer3D#setNavigationLockSettings}
     *
     * @param {boolean} value True if the navigation should be locked.
     * @returns {boolean} The previous state of the lock (this may be used to restore the lock to it's previous state).
     * 
     * @alias Autodesk.Viewing.Viewer3D#setNavigationLock
     */
    Viewer3D.prototype.setNavigationLock = function(value)
    {
        const prev = this.navigation.getIsLocked();
        if (prev !== value) {
            this.navigation.setIsLocked(value);
            this.dispatchEvent({ type: et.NAVIGATION_MODE_CHANGED_EVENT, id: this.getActiveNavigationTool() });
        }

        return prev;
    };

    /**
     * Gets the current state of the navigation lock.
     * @returns {boolean} True if the navigation controls are currently locked.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getNavigationLock
     */
    Viewer3D.prototype.getNavigationLock = function()
    {
        return this.navigation.getIsLocked();
    };

    /**
     * Updates the configuration of the navigation lock,
     * i.e., which actions are available when navigation is locked.
     *
     * The configurable actions are 'orbit', 'pan', 'zoom', 'roll', 'fov', 'walk', or 'gotoview'.
     * By default, none of the actions are enabled when the navigation is locked.
     *
     * Reference {@link Autodesk.Viewing.Viewer3D#setNavigationLock}
     * 
     * @param {object} settings Map of <action>:<boolean> pairs specifying
     * whether the given action is *enabled* even when the navigation is locked.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setNavigationLockSettings
     */
    Viewer3D.prototype.setNavigationLockSettings = function(settings)
    {
        this.navigation.setLockSettings(settings);
        this.dispatchEvent({ type: et.NAVIGATION_MODE_CHANGED_EVENT, id: this.getActiveNavigationTool() });
    };

    /**
     * Gets the current configuration of the navigation lock.
     *  @returns {object} Map of <action>:<boolean> pairs specifying
     * whether the given action is *enabled* even when the navigation is locked.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getNavigationLockSettings
     */
    Viewer3D.prototype.getNavigationLockSettings = function()
    {
        return this.navigation.getLockSettings();
    };

    /**
     * Swaps the current navigation tool for the tool with the provided name.
     * Will trigger NAVIGATION_MODE_CHANGED event if the mode actually changes.
     * 
     * Reference {@link Viewer3D#getActiveNavigationTool|getActiveNavigationTool()}
     *
     * @param {string} [toolName] - The name of the tool to activate. By default it will switch to the default tool.
     *
     * @returns {boolean} - True if the tool was set successfully. False otherwise.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setActiveNavigationTool
     */
    Viewer3D.prototype.setActiveNavigationTool = function(toolName)
    {

        if(toolName === this._pushedTool || (!toolName && !this._pushedTool))
            return true;


        if( this._pushedTool ) {

            if( !this.impl.controls.deactivateTool(this._pushedTool) ) {
                return false;
            }

            // Need to reset the activeName of the default tool, since "orbit",
            // "freeorbit", "dolly" and "pan" share the same instance.
            this.impl.controls.setToolActiveName(this.getDefaultNavigationToolName());
            this._pushedTool = null;
        }

        var isDefault = !toolName || toolName === this.getDefaultNavigationToolName();

        if (isDefault && this._pushedTool === null) {
            this.dispatchEvent({ type: et.NAVIGATION_MODE_CHANGED_EVENT, id: this.getDefaultNavigationToolName() });
            return true;
        }

        if( this.impl.controls.activateTool(toolName) ) {
            this._pushedTool = toolName;
            this.dispatchEvent({ type: et.NAVIGATION_MODE_CHANGED_EVENT, id: this._pushedTool });
            return true;
        }

        return false;
    };

    /**
     * Returns the name of the active navigation tool.
     *
     * Reference {@link Viewer3D#setActiveNavigationTool|setActiveNavigationTool()}
     * 
     * @returns {string} - The tool's name.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getActiveNavigationTool
     */
    Viewer3D.prototype.getActiveNavigationTool = function()
    {
        return this._pushedTool ? this._pushedTool : this._defaultNavigationTool;
    };

    /**
     * Sets the default navigation tool. This tool will always sit beneath the navigation tool on the tool stack.
     *
     * @param {string} toolName - The name of the new default navigation tool.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setDefaultNavigationTool
     */
    Viewer3D.prototype.setDefaultNavigationTool = function(toolName)
    {
        if (this._defaultNavigationTool) {
            this.impl.controls.deactivateTool(this._defaultNavigationTool);
        }

        var pushed = this._pushedTool;
        this._pushedTool = null;
        if (pushed) {
            this.impl.controls.deactivateTool(pushed);
        }

        this.impl.controls.activateTool(toolName);
        this._defaultNavigationTool = toolName;

        if (pushed) {
            this.impl.controls.activateTool(pushed);
            this._pushedTool = pushed;
        }
    };

    /**
     * Returns the default navigation tool
     *
     * @returns {Object} - The default navigation tool.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getDefaultNavigationToolName
     */
    Viewer3D.prototype.getDefaultNavigationToolName = function()
    {
        return this._defaultNavigationTool;
    };

    /**
     * Gets the current camera vertical field of view.
     * @returns { number } - the field of view in degrees.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getFOV
     */
    Viewer3D.prototype.getFOV = function()
    {
        return this.navigation.getVerticalFov();
    };

    /**
     * Sets the current cameras vertical field of view.
     * @param { number } degrees - Field of view in degrees.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setFOV
     */
    Viewer3D.prototype.setFOV = function(degrees)
    {
        this.navigation.setVerticalFov(degrees, true);
    };

    /**
     * Gets the current camera focal length.
     * @returns { number } - the focal length in millimetres.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getFocalLength
     */
    Viewer3D.prototype.getFocalLength = function()
    {
        return this.navigation.getFocalLength();
    };

    /**
     * Sets the current cameras focal length.
     * @param { number } mm - Focal length in millimetres
     * 
     * @alias Autodesk.Viewing.Viewer3D#setFocalLength
     */
    Viewer3D.prototype.setFocalLength = function(mm)
    {
        this.navigation.setFocalLength(mm, true);
    };

    /**
     * Hides all lines in the scene.
     * @param {boolean} hide
     * 
     * @alias Autodesk.Viewing.Viewer3D#hideLines
     */
    Viewer3D.prototype.hideLines = function(hide){
        if (this.model && this.model.is2d()) {
            logger.warn("Viewer3D.hideLines is not applicable to 2D");
            return;
        }
        this.prefs.set(Prefs3D.LINE_RENDERING, !hide);
    };

    /**
     * Hides all points in the scene.
     * @param {boolean} hide
     * 
     * @alias Autodesk.Viewing.Viewer3D#hidePoints
     */
    Viewer3D.prototype.hidePoints = function(hide){
        this.prefs.set(Prefs.POINT_RENDERING, !hide);
    };

    /**
     * Turns edge topology display on/off (where available).
     * @param {boolean} show - true to turn edge topology display on, false to turn edge topology display off.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setDisplayEdges
     */
    Viewer3D.prototype.setDisplayEdges = function(show) {
        if (this.model && this.model.is2d()) {
            logger.warn("Viewer3D.setDisplayEdges is not applicable to 2D");
            return;
        }
        this.prefs.set(Prefs3D.EDGE_RENDERING, show);
    };

    /**
     * @deprecated
     * Applies the camera to the current viewer's camera.
     * @param {THREE.Camera} camera - the camera to apply.
     * @param {boolean} [fit=false] - Do a fit to view after transition.
     * 
     * @alias Autodesk.Viewing.Viewer3D#applyCamera
     */
    Viewer3D.prototype.applyCamera = function(camera, fit) {
        this.impl.setViewFromCamera(camera, true);
        if (fit)
            this.fitToView();
    };

    /**
     * Fits camera to objects by ID. It fits the entire model if no ID is provided.
     * Operation will fit to the model's bounding box when its object tree is not available.
     *
     * @param {number[]|null} [objectIds=null] array of Ids to fit into the view. Avoid passing this value to fit the entire model.
     * @param {Autodesk.Viewing.Model|null} [model] - The model containing the ``objectIds``. If falsey, the viewer's current model will be used.
     * @param {boolean} [immediate=false] - true to avoid the default transition.
     * 
     * @fires Autodesk.Viewing#FIT_TO_VIEW_EVENT
     * @fires Autodesk.Viewing#AGGREGATE_FIT_TO_VIEW_EVENT
     * 
     * @alias Autodesk.Viewing.Viewer3D#fitToView
     */
    Viewer3D.prototype.fitToView = function(objectIds, model, immediate) {

        var selection = [];
        if (objectIds) {
            if (objectIds.length > 0 && objectIds[0].model) {
                // Aggregated selection being passed in.
                selection = objectIds;
            } else if (objectIds.length > 0) {
                // Backwards compatibility interface for single model.
                selection.push({
                    model: (model || this.model),
                    selection: objectIds
                });
            }
        }

        this.impl.fitToView(selection, immediate);
        // Event gets fired from `impl`
    };

    /**
     * Modifies a click action configuration entry.
     * @param {string} what - which click config to modify (one of "click", "clickAlt", "clickCtrl", "clickShift", "clickCtrlShift").
     * @param {string} where - hit location selector (one of "onObject", "offObject").
     * @param {string[]} newAction - action list (containing any of "setCOI", "selectOnly", "selectToggle", "deselectAll", "deselectAll", "isolate", "showAll", "hide", "focus").
     * @returns {boolean} False if specified entry is not found, otherwise true.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setClickConfig
     */
    Viewer3D.prototype.setClickConfig = function(what, where, newAction) {
        var config = this.clickHandler ? this.clickHandler.getClickBehavior()
            : this.impl.controls.getClickBehavior();

        if( what in config )
        {
            var actions = config[what];
            if( where in actions )
            {
                actions[where] = newAction;
                return true;
            }
        }
        return false;
    };

    /**
     * Fetch a click action configuration entry.
     * @param {string} what - which click config to fetch (one of "click", "clickAlt", "clickCtrl", "clickShift", "clickCtrlShift").
     * @param {string} where - hit location selector (one of "onObject", "offObject").
     * @returns {array} action list for the given entry or null if not found.
     * 
     * @alias Autodesk.Viewing.Viewer3D#getClickConfig
     */
    Viewer3D.prototype.getClickConfig = function(what, where)
    {
        var config = this.clickHandler ? this.clickHandler.getClickBehavior()
            : this.impl.controls.getClickBehavior();

        if( what in config )
        {
            var actions = config[what];
            if( where in actions )
                return actions[where];
        }
        return null;
    };

    /**
     * Modify the default click behaviour for the viewer.
     * @param {boolean} state - If true the default is to set the center of interest. If false the default is single select.
     * @param {boolean} [updatePrefs=true] - If true, the user preferences will be updated.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setClickToSetCOI
     */
    Viewer3D.prototype.setClickToSetCOI = function(state, updatePrefs)
    {
        // Typically, the set{Blah} functions set a preference. This function will set the preference and then call an internal API.
        if (updatePrefs !== false)
            this.prefs.set(Prefs3D.CLICK_TO_SET_COI, state);

        var currentOn = this.getClickConfig("click", "onObject");
        if( state )
        {
            if( currentOn.indexOf("setCOI") === -1 ) // Not already set?
            {
                this.setClickConfig("click", "onObject",  [ "setCOI" ]);
            }
        }
        else if( currentOn.indexOf("setCOI") >= 0 ) // Is currently set?
        {
            this.setClickConfig("click", "onObject",  [ "selectOnly" ]);
        }
    };

    /**
     * Updates viewer settings encapsulated witihn a Profile.
     * This method will also load and unload extensions referenced by the Profile.
     * 
     * @example
     *   const profileSettings = {
     *      name: "mySettings",
     *      settings: {
     *          ambientShadows: false,
     *          groundShadows: true
     *      }
     *      extensions: {
     *          load: [],   // Extension IDs 
     *          unload: []  // Extension IDs
     *      }
     *   }
     *   const profile = new Autodesk.Viewing.Profile(profileSettings);
     *   viewer.setProfile(profile);
     *
     * @param {Autodesk.Viewing.Profile} profile - profile containing settings.
     * @param {boolean} [override] - If set to true this will override all existing preference with the new profile preference. Default: true
     *
     * @alias Autodesk.Viewing.Viewer3D#setProfile
     */
    Viewer3D.prototype.setProfile = function(profile, override) {
        
        if (!profile)
            return false;

        this.profile = profile;
        this.profile.apply(this.prefs, override);

        const toUnload = (this.profile.extensions && this.profile.extensions.unload) || [];
        const toLoad = (this.profile.extensions && this.profile.extensions.load) || [];

        toUnload.forEach((extId) => {
            if (this.isExtensionLoaded(extId)) {
                this.unloadExtension(extId);
            }
        });

        toLoad.forEach((extId) => {
            if (!this.isExtensionLoaded(extId)) {
                this.loadExtension(extId, this.config);
            }
        });
        this.dispatchEvent({ type: Autodesk.Viewing.PROFILE_CHANGE_EVENT, profile });
    };

    /**
     * DEPRECATED. DO NO USE.
     * REMOVE IN v8.0
     * @private
     * @deprecated
     */
    Viewer3D.prototype.initSettings = function(settings) {
        
        // Initialize the profile only if the viewer.profile is not set.
        // This will insure that the loadModel model functions sets the settings once.
        if (!this.profile) {
            const profile = new Profile(settings);
            this.setProfile(profile);
        }
    };

    /**
     * Sets the Light Presets (Environments) for the Viewer.
     *
     * Not applicable to 2D.
     *
     * Sets the preference in the UI
     * @param {Number} index - The index mapping looks like this: 0 -> Simple Grey, 1 -> Sharp Highlights, 2 -> Dark Sky, 3 -> Grey Room, 4 -> Photo Booth, 5 -> Tranquility, 6 -> Infinity Pool, 7 -> Simple White, 8 -> Riverbank, 9 -> Contrast, 1 ->0 Rim Highlights, 1 ->1 Cool Light, 1 ->2 Warm Light, 1 ->3 Soft Light, 1 ->4 Grid Light, 1 ->5 Plaza, 1 ->6 Snow Field
     * @note this list is copied from the ones in Environments.js
     * 
     * @alias Autodesk.Viewing.Viewer3D#setLightPreset
     */
    Viewer3D.prototype.setLightPreset = function (index) {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setLightPreset is not applicable to 2D");
            return;
        }

        this.prefs.set(Prefs3D.LIGHT_PRESET, index);
    };

    /**
     *  Set or unset a view navigation option which requests that orbit controls always orbit around the currently set pivot point.
     *
     *  Sets the preference in the UI
     *  @param {boolean} value - value of the option, true to request use of the pivot point. When false some controls may pivot around the center of the view. (Currently applies only to the view-cube orbit controls.)
     * 
     * @alias Autodesk.Viewing.Viewer3D#setUsePivotAlways
     */
    Viewer3D.prototype.setUsePivotAlways = function (value) {
        if(this.model && this.model.is2d()){
            logger.warn("Viewer3D.setUsePivotAlways is not applicable to 2D");
            return;
        }
        this.prefs.set(Prefs3D.ALWAYS_USE_PIVOT, value);
    };

    /**
     * Set or unset a view navigation option to reverse the default direction for camera dolly (zoom) operations.
     *
     *  Sets the preference in the UI
     *  @param {boolean} value - value of the option, true for reverse, false for default
     * 
     * @alias Autodesk.Viewing.Viewer3D#setReverseZoomDirection
     */
    Viewer3D.prototype.setReverseZoomDirection = function (value) {
        this.prefs.set(Prefs.REVERSE_MOUSE_ZOOM_DIR, value);
    };

    /**
     * Set or unset a view navigation option to reverse the default direction for horizontal look operations.
     *
     * Not applicable to 2D.
     *
     *  Sets the preference in the UI
     *  @param {boolean} value - value of the option, true for reverse, false for default
     * 
     * @alias Autodesk.Viewing.Viewer3D#setReverseHorizontalLookDirection
     */
    Viewer3D.prototype.setReverseHorizontalLookDirection = function (value) {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setReverseHorizontalLookDirection is not applicable to 2D");
            return;
        }

        this.prefs.set(Prefs3D.REVERSE_HORIZONTAL_LOOK_DIRECTION, value);
    };

    /**
     * Set or unset a view navigation option to reverse the default direction for vertical look operations.
     *
     * Not applicable to 2D.
     *
     *  Sets the preference in the UI
     *  @param {boolean} value - value of the option, true for reverse, false for default
     * 
     * @alias Autodesk.Viewing.Viewer3D#setReverseVerticalLookDirection
     */
    Viewer3D.prototype.setReverseVerticalLookDirection = function (value) {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setReverseVerticalLookDirection is not applicable to 2D");
            return;
        }

        this.prefs.set(Prefs3D.REVERSE_VERTICAL_LOOK_DIRECTION, value);
    };

    /**
     * Get the state of the view navigation option that requests the default direction for camera dolly (zoom) operations to be towards the camera pivot point.
     *
     *  Sets the preference in the UI
     *  @param {boolean} value - value of the option, true for towards the pivot, false for default
     * 
     * @alias Autodesk.Viewing.Viewer3D#setZoomTowardsPivot
     */
    Viewer3D.prototype.setZoomTowardsPivot = function (value) {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setZoomTowardsPivot is not applicable to 2D");
            return;
        }
        this.prefs.set(Prefs3D.ZOOM_TOWARDS_PIVOT, value);
    };

    /**
     * Set or unset a view navigation option to allow the orbit controls to move the camera beyond the north and south poles (world up/down direction). In other words, when set the orbit control will allow the camera to rotate into an upside down orientation. When unset orbit navigation should stop when the camera view direction reaches the up/down direction.
     *
     * Not applicable to 2D.
     *
     *  Sets the preference in the UI
     *  @param {boolean} value - value of the option, true to allow orbiting past the poles.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setOrbitPastWorldPoles
     */
    Viewer3D.prototype.setOrbitPastWorldPoles = function (value) {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setOrbitPastWorldPoles is not applicable to 2D");
            return;
        }

        this.prefs.set(Prefs3D.ORBIT_PAST_WORLD_POLES, value);
    };

    /**
     * Set or unset a view navigation option which requests that mouse buttons be reversed from their default assignment (i.e. Left mouse operation becomes right mouse and vice versa).
     *
     *  Sets the preference in the UI
     *  @param {boolean} value - value of the option, true to request reversal of mouse button assignments.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setUseLeftHandedInput
     */
    Viewer3D.prototype.setUseLeftHandedInput = function (value) {
        this.prefs.set(Prefs.LEFT_HANDED_MOUSE_SETUP, value);
    };

    /**
     * Set units for quantities displayed in the property panel. 
     * Only setting linear (distance) quantity units are supported
     *
     *  @param {string} value - display units to set. 
     * 
     * The units can be "" (file units), "mm", "cm", "m", "in", "ft", "ft-and-fractional-in", 
     * "ft-and-decimal-in", "decimal-in", "decimal-ft", "fractional-in", "m-and-cm",
     * 
     * @alias Autodesk.Viewing.Viewer3D#setDisplayUnits
     */
    Viewer3D.prototype.setDisplayUnits = function (value) {
        this.prefs.set(Prefs.DISPLAY_UNITS, value);
    };

    /**
     * Set the precision for quantities displayed in the property panel. 
     *
     *  @param {number} value - precision for the units
     * The value is the number of decimal values after the ".". 
     * For e.g., a value of
     * 5 would be either 0.12345 or 1/32 (2^5) for fraction type units
     * Values greater than 6 is not supported
     * 
     * If value is not specified, it defaults to the precision
     * in the file
     * @alias Autodesk.Viewing.Viewer3D#setDisplayUnitsPrecision
     */
    Viewer3D.prototype.setDisplayUnitsPrecision = function (value) {
        if (value === null || value === undefined) {
            value = "";
        }
        this.prefs.set(Prefs.DISPLAY_UNITS_PRECISION, value);
    };

    /**
     * Set visibility for a single layer, or for all layers.
     *
     * @param {?Array} nodes - An array of layer nodes, or a single layer node, or null for all layers
     * @param {boolean} visible - true to show the layer, false to hide it
     * @param {boolean=} [isolate] - true to isolate the layer
     * 
     * @alias Autodesk.Viewing.Viewer3D#setLayerVisible
     */
    Viewer3D.prototype.setLayerVisible = function (nodes, visible, isolate) {

        var layers = this.impl.layers;
        
        if (nodes === null) {
            if (visible) {
                layers.showAllLayers();
            } else {
                layers.hideAllLayers();
            }
        } else {

            if(!Array.isArray(nodes)) {
                nodes = [nodes];
            }

            if (isolate) {
                layers.hideAllLayers();
            }

            this.impl.setLayerVisible(nodes, visible);
        }
        this.dispatchEvent({type: et.LAYER_VISIBILITY_CHANGED_EVENT});
    };

    /**
     * Returns true if the layer is visible.
     *
     * @param {Object} node - Layer node
     * @returns {boolean} true if the layer is visible
     * 
     * @alias Autodesk.Viewing.Viewer3D#isLayerVisible
     */
    Viewer3D.prototype.isLayerVisible = function (node) {
        return !!(node && node.isLayer && this.impl.isLayerVisible(node));
    };

    /**
     * Returns true if any layer is hidden.
     *
     * @returns {boolean} true if any layer is hidden
     * 
     * @alias Autodesk.Viewing.Viewer3D#anyLayerHidden
     */
    Viewer3D.prototype.anyLayerHidden = function () {

        var root = this.impl.getLayersRoot();
        var layers = root && root.children;
        var layersCount = (layers ? layers.length : 0);

        for (var i = 0; i < layersCount; ++i) {
            if(!this.impl.layers.isLayerVisible(layers[i])) {
                return true;
            }
        }

        return false;
    };

    /**
     * Returns true if all layers are hiden.
     *
     * @returns {boolean} true if all layers are hidden
     * 
     * @alias Autodesk.Viewing.Viewer3D#allLayersHidden
     */
    Viewer3D.prototype.allLayersHidden = function () {

        var root = this.impl.getLayersRoot();
        var layers = root && root.children;
        var layersCount = (layers ? layers.length : 0);

        for (var i = 0; i < layersCount; ++i) {
            if (this.impl.layers.isLayerVisible(layers[i])) {
                return false;
            }
        }

        return true;
    };

    /**
     * If enabled, set ground shadow color
     *
     * Not applicable to 2D
     *
     * @param {THREE.Color} color
     * 
     * @alias Autodesk.Viewing.Viewer3D#setGroundShadowColor
     */
    Viewer3D.prototype.setGroundShadowColor = function(color) {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setGroundShadowColor is not applicable to 2D");
            return;
        }

        this.impl.setGroundShadowColor(color);
    };

    /**
     * If enabled, set ground shadow alpha
     *
     * Not applicable to 2D
     *
     * @param {float} alpha
     * 
     * @alias Autodesk.Viewing.Viewer3D#setGroundShadowAlpha
     */
    Viewer3D.prototype.setGroundShadowAlpha = function(alpha) {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setGroundShadowAlpha is not applicable to 2D");
            return;
        }

        this.impl.setGroundShadowAlpha(alpha);
    };

    /**
     * If enabled, set ground reflection color. This is reset to default when reflections toggled off.
     *
     * Not applicable to 2D
     *
     * @param {THREE.Color} color
     * 
     * @alias Autodesk.Viewing.Viewer3D#setGroundReflectionColor
     */
    Viewer3D.prototype.setGroundReflectionColor = function(color) {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setGroundReflectionColor is not applicable to 2D");
            return;
        }

        this.impl.setGroundReflectionColor(color);
    };

    /**
     * If enabled, set ground reflection alpha. This is reset to default when reflections toggled off.
     *
     * Not applicable to 2D
     *
     * @param {number} alpha
     * 
     * @alias Autodesk.Viewing.Viewer3D#setGroundReflectionAlpha
     */
    Viewer3D.prototype.setGroundReflectionAlpha = function(alpha) {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.setGroundReflectionAlpha is not applicable to 2D");
            return;
        }

        this.impl.setGroundReflectionAlpha(alpha);
    };

    /**
     * Returns a list of active cut planes
     *
     * Not applicable to 2D
     *
     * @return {THREE.Vector4[]} List of Vector4 plane representation {x:a, y:b, z:c, w:d}
     * 
     * @alias Autodesk.Viewing.Viewer3D#getCutPlanes
     */
    Viewer3D.prototype.getCutPlanes = function() {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.getCutPlanes is not applicable to 2D");
            return [];
        }

        return this.impl.getCutPlanes();
    };

    /**
     * Apply a list of cut planes
     *
     * Not applicable to 2D
     *
     * @param {THREE.Vector4[]} planes - List of Vector4 plane representation: {x:a, y:b, z:c, w:d}
     * Plane general equation: ax + by + cz + d = 0 where a, b, and c are not all zero
     * Passing an empty list or null is equivalent to setting zero cut planes
     * 
     * @alias Autodesk.Viewing.Viewer3D#setCutPlanes
     */
    Viewer3D.prototype.setCutPlanes = function(planes) {
        if( this.model && this.model.is2d() )
        {
            logger.warn("Viewer3D.getCutPlanes is not applicable to 2D");
            return;
        }
        this.impl.setCutPlaneSet("__set_view", planes);
    };

    /**
     * Captures the current screen image as Blob URL
     * Blob URL can be used like a regular image url (e.g., window.open, img.src, etc)
     * If width and height are 0, returns asynchronously and calls the callback with an image as Blob URL with dimensions equal to current canvas dimensions
     * If width and height are given, returns asynchronously and calls the callback with the resized image as Blob URL
     * If no callback is given, displays the image in a new window.
     * Optional overlayRenderer can be supplied, in order to render an overlay on top of the renderer image.
     * @param  {number} [w]  width of the requested image
     * @param  {number} [h]  height of the requested image
     * @param  {Function} [cb] callback
     * @param  {Function} [overlayRenderer] overlayRenderer
     * @return {DOMString} screenshot image Blob URL, if no parameters are given
     * 
     * @alias Autodesk.Viewing.Viewer3D#getScreenShot
     */
    Viewer3D.prototype.getScreenShot = function(w, h, cb, overlayRenderer) {
        return ScreenShot.getScreenShotLegacy(this, w, h, cb, overlayRenderer);
    };

    /**
     * Sets the object context menu.
     * @param {?ObjectContextMenu=} [contextMenu]
     */
    Viewer3D.prototype.setContextMenu = function (contextMenu) {

        if (this.contextMenu) {

            // Hide the current context menu, just in case it's open right now.
            // This does nothing if the context menu is not open.
            //
            this.contextMenu.hide();
        }

        this.contextMenu = contextMenu || null; // to avoid undefined
    };

    /**
     * Activates the default context menu.<br>
     * Contains options Isolate, Hide selected, Show all objects, Focus and Clear selection.
     *
     * @returns {boolean} Whether the default context menu was successfully set (true) or not (false)
     */
    Viewer3D.prototype.setDefaultContextMenu = function() {

        var ave = Autodesk.Viewing.Extensions;
        if (ave && ave.ViewerObjectContextMenu) {
            this.setContextMenu(new ave.ViewerObjectContextMenu(this));
            return true;
        }
        return false;
    };

    Viewer3D.prototype.triggerContextMenu = function (event) {
        if (this.config && this.config.onTriggerContextMenuCallback) {
            this.config.onTriggerContextMenuCallback(event);
        }

        if (this.contextMenu) {
            this.contextMenu.show(event);
            return true;
        }
        return false;
    };

    Viewer3D.prototype.triggerSelectionChanged = function (dbId) {
        if (this.config && this.config.onTriggerSelectionChangedCallback) {
            this.config.onTriggerSelectionChangedCallback(dbId);
        }
    };

    Viewer3D.prototype.triggerDoubleTapCallback = function (event) {
        if (this.config && this.config.onTriggerDoubleTapCallback) {
            this.config.onTriggerDoubleTapCallback(event);
        }
    };

    Viewer3D.prototype.triggerSingleTapCallback = function (event) {
        if (this.config && this.config.onTriggerSingleTapCallback) {
            this.config.onTriggerSingleTapCallback(event);
        }
    };

    Viewer3D.prototype.triggerSwipeCallback = function (event) {
        if (this.config && this.config.onTriggerSwipeCallback) {
            this.config.onTriggerSwipeCallback(event);
        }
    };

    Viewer3D.prototype.initContextMenu = function() {

        // Disable the browser's default context menu by default, or if explicitly specified.
        //
        var disableBrowserContextMenu = !this.config || (Object.prototype.hasOwnProperty.call(this.config, "disableBrowserContextMenu") ? this.config.disableBrowserContextMenu : true);
        if (disableBrowserContextMenu) {
            this.onDefaultContextMenu = function (e) {
                e.preventDefault();
            };
            this.container.addEventListener('contextmenu', this.onDefaultContextMenu, false);
        }

        var self = this;

        var canvas = this.canvas || this.container;

        this.onMouseDown = function(event) {
            if (EventUtils.isRightClick(event)) {
                self.startX = event.clientX;
                self.startY = event.clientY;
            }
        };

        canvas.addEventListener( 'mousedown', this.onMouseDown);

        this.onMouseUp = function(event) {
            if (EventUtils.isRightClick(event) && event.clientX === self.startX && event.clientY === self.startY) {
                self.triggerContextMenu(event);
            }
            return true;
        };

        canvas.addEventListener( 'mouseup', this.onMouseUp, false);
    };


    /**
     * Registers a new callback that modifies the context menu.
     * This allows extensions and others to add, remove, or change items in the context menu.
     * Extensions that call registerContextMenuCallback() should call unregisterContextMenuCallback() in their unload().
     * 
     * @see Viewer.unregisterContextMenuCallback
     * @see ObjectContextMenu.buildMenu
     * 
     * @param {string} id - Unique id to identify this callback. Used by unregisterContextMenuCallback().
     * @param {function(Array, Object)} callback - Will be called before the context menu is displayed.
     *
     * @example
     * // Here's an example that appends a new context menu item:
     *
     * viewer.registerContextMenuCallback('MyExtensionName', function (menu, status) {
     *     if (status.hasSelected) {
     *         menu.push({
     *             title: 'My new context menu item with selected objects',
     *             target: function () {
     *                 alert('Do something with selected objects');
     *         }});
     *     } else {
     *         menu.push({
     *             title: 'My new context menu item, no selected objects',
     *             target: function () {
     *                 alert('Do something else');
     *         }});
     *     }
     * });
     */
    Viewer3D.prototype.registerContextMenuCallback = function (id, callback) {
        this.contextMenuCallbacks[id] = callback;
    };

    /**
     * Unregisters an existing callback that modifies the context menu.
     * Extensions that call registerContextMenuCallback() should call unregisterContextMenuCallback() in their unload().
     * @param {string} id - Unique id to identify this callback.
     * @returns {boolean} true if the callback was unregistered successfully.
     * @see Viewer.registerContextMenuCallback
     */
    Viewer3D.prototype.unregisterContextMenuCallback = function (id) {
        if (id in this.contextMenuCallbacks) {
            delete this.contextMenuCallbacks[id];
            return true;
        }
        return false;
    };

    /**
     * Runs all registered context menu callbacks.
     * @param {array} menu - Context menu items.
     * @param {Object} status - Information about nodes.
     * @param {Event} status.event - The UI event that triggered the context menu.
     * @see ObjectContextMenu.buildMenu
     * @private
     */
    Viewer3D.prototype.runContextMenuCallbacks = function (menu, status) {
        for (var id in this.contextMenuCallbacks) {
            if (Object.prototype.hasOwnProperty.call(this.contextMenuCallbacks, id)) {
                this.contextMenuCallbacks[id](menu, status);
            }
        }
    };

    /**
     * Join a live review session.
     *
     * @param {string} [sessionId] - The live review session id to join.
     *
     * @private
     * @deprecated
     */
    Viewer3D.prototype.joinLiveReview = function (sessionId) {
        // TODO: Deprecated
        this.loadExtension('Autodesk.Viewing.Collaboration').then((ext) => {
            ext.joinLiveReview.call(this, sessionId);
        });
    };

    /**
     * Leave a live review session.
     *
     * @private
     * @deprecated
     */
    Viewer3D.prototype.leaveLiveReview = function () {
        // TODO: Deprecated
        this.loadExtension('Autodesk.Viewing.Collaboration').then((ext) => {
            ext.leaveLiveReview.call(this);
        });
    };

    /**
     * Set model units
     * @param Model units
     */
    Viewer3D.prototype.setModelUnits = function(modelUnits) {
        if (this.model) {
            this.model.getData().overriddenUnits = modelUnits;
        }
    };

    /**
     * Calculates the pixel position in client space coordinates of a point in world space.<br>
     * See also
     * {@link Autodesk.Viewing.Viewer3D#clientToWorld|clientToWorld()}.
     * @param {THREE.Vector3} point Point in world space coordinates.
     * @param {THREE.Camera} camera Optional camera to use - default is the viewer's native camera.
     * @returns {THREE.Vector3} Point transformed and projected into client space coordinates. Z value is 0.
     * 
     * @alias Autodesk.Viewing.Viewer3D#worldToClient
     */
    Viewer3D.prototype.worldToClient = function(point, camera = this.impl.camera) {
        return this.impl.worldToClient(point, camera);
    };

    /**
     * Given coordinates in pixel screen space it returns information of the underlying geometry node.
     * Hidden nodes will not be taken into account. Returns null if there is no geometry in the specified location.
     * For 2d models, it will return null outside the paper, unless ignore2dModelBounds is true.<br>
     * See also
     * {@link Autodesk.Viewing.Viewer3D#worldToClient|worldToClient()}.
     *
     * @param {Number} clientX - X coordinate where 0 is left
     * @param {Number} clientY - Y coordinate where 0 is top
     * @param {Boolean} [ignoreTransparent] - Ignores transparent materials
     * @param {boolean} [ignore2dModelBounds] - For 2d models - whether to return a result outside of the model's bounds.
     * @returns {Object|null} contains point attribute. 3d models have additional attributes.
     * 
     * @alias Autodesk.Viewing.Viewer3D#clientToWorld
     */
    Viewer3D.prototype.clientToWorld = function(clientX, clientY, ignoreTransparent, ignore2dModelBounds) {

        return this.impl.clientToWorld(clientX, clientY, ignoreTransparent, ignore2dModelBounds);
    };

    /**
     * Expose if the model has topology information downloaded.
     * Only applicable to 3D models.
     * @returns {boolean} value - Indicates whether the model has topology information.
     * 
     * @alias Autodesk.Viewing.Viewer3D#modelHasTopology
     */
    Viewer3D.prototype.modelHasTopology = function() {

        if (this.model && this.model.hasTopology()) {
            return true;
        }

        return false;
    };

    /**
     * Changes the color of the selection for a particular selection type.
     * - Autodesk.Viewing.SelectionType.MIXED
     *   - Sets the same color for regular and overlayed selection.
     * - Autodesk.Viewing.SelectionType.REGULAR
     *   - Sets the color of regular selection.
     * - Autodesk.Viewing.SelectionType.OVERLAYED
     *   - Sets the color of overlayed selection.
     *
     * @example
     *  viewer.setSelectionColor(new THREE.Color(0xFF0000), Autodesk.Viewing.SelectionType.MIXED); // red color
     * @param {THREE.Color} color
     * @param {number} selectionType a member of Autodesk.Viewing.SelectionMode.
     * @alias Autodesk.Viewing.Viewer3D#setSelectionColor
     */
    Viewer3D.prototype.setSelectionColor = function(color, selectionType) {
        this.impl.setSelectionColor(color, selectionType);
    };

    /**
     * Changes the color of the selection for 2D drawings.
     *
     * @example
     *  viewer.set2dSelectionColor(new THREE.Color(0xFF0000), 0.1); // red color, opacity of 0.1
     * @param {THREE.Color} color
     * @param {number} opacity
     * 
     * @alias Autodesk.Viewing.Viewer3D#set2dSelectionColor
     */
    Viewer3D.prototype.set2dSelectionColor = function(color, opacity) {
        this.impl.set2dSelectionColor(color, opacity);
    };

    /**
     * Sets the current UI theme of the viewer.
     * Supported values are "light-theme" and "dark-theme", which is the default.
     * 
     * @param {string} name - Name of the theme, it will be added to the viewer's container class list.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setTheme
     */
    Viewer3D.prototype.setTheme = function(name) {

        var classList = this.container.classList;

        // Remove previous themes.
        for (var i = 0; i < classList.length; ++i) {
            var index = classList[i].indexOf('-theme');
            if (index !== -1) {
                classList.remove(classList[i--]);
            }
        }

        // Set current theme.
        classList.add(name);
    };

    /**
     * Highlight an object with a theming color that is blended with the original object's material.
     * @param {number} dbId
     * @param {THREE.Vector4} color - (r, g, b, intensity), all in [0,1].
     * @param {Autodesk.Viewing.Model} [model] - For multi-model support.
     * @param {boolean} [recursive] - Should apply theming color recursively to all child nodes.
     * 
     * @alias Autodesk.Viewing.Viewer3D#setThemingColor
     */
    Viewer3D.prototype.setThemingColor = function(dbId, color, model, recursive) {
        // use default RenderModel by default
        model = model || this.model;

        model.setThemingColor(dbId, color, recursive);

        // we changed the scene to apply theming => trigger re-render
        this.impl.invalidate(true);
    };

    /**
     * Restore original colors for all themed shapes.
     * @param {Autodesk.Viewing.Model} [model] - For multi-model support.
     * 
     * @alias Autodesk.Viewing.Viewer3D#clearThemingColors
     */
    Viewer3D.prototype.clearThemingColors = function(model) {
        // use default RenderModel by default
        model = model || this.model;

        model.clearThemingColors();

        // we changed the scene to apply theming => trigger re-render
        this.impl.invalidate(true);
    };

    /**
     * @deprecated
     * Transfer model from this viewer to another one - including state of selection, ghosting, and theming.
     * Note that this does not work with OTG models, because a single OTG geometry may be shared by different OTG models.
     */
    Viewer3D.prototype.transferModel = function(modelId, viewer) {

        var model = this.impl.findModel(modelId);
        if (!model) {
            // unknown modeId
            return;
        }

        // collect all selected db ids for this model
        var selectedIds = [];
        this.getAggregateSelection(function(model, dbId) {
            if (model.id==modelId) {
                selectedIds.push(dbId);
            }
        });

        // collect isolated/hidden nodes
        var isolatedIds = this.impl.visibilityManager.getIsolatedNodes(model);
        var hiddenIds   = this.impl.visibilityManager.getHiddenNodes(model);

        // export all materials and textures to MaterialManager of the other viewer
        // Note: Getting the materials from MaterialManager directly is the safest way for consistent state between both viewers.
        // E.g., enumerating the materials of the RenderModel instead would not work for 2 reasons:
        //  a) If the model is still loading, some materials would get lost: SvfLoader adds all materials in onModelRootLoadDone() already.
        //     But, RenderModel only knows materials for meshes that have been already loaded.
        //  b) The material hashes are only known to MaterialManager
        var modelMaterials = this.impl.matman().exportModelMaterials(model);

        // detach model from this viewer and discard all GPU resources.
        this.impl.unloadModel(model, true);
        model.getFragmentList()?.dispose(this.impl.glrenderer());
        
        // Set rendering prefs before adding the model (to prevent flashing of the environment)
        if (model.isAEC() && model.is3d()) {
            viewer.impl.setLightPresetForAec();
        }
        viewer.impl.setRenderingPrefsFor2D(model.is2d());

        // pass model to other viewer
        viewer.impl.addModel(model);

        // import materials to new viewer
        // Note that it is essential to do export/import of materials in separate steps:
        //  - Exporting materials must be done before removing the model. After removeModel(),
        //    MaterialManager would not contain the material of this model anymore.
        //  - Importing materials must be done after adding the model to make sure that everything is properly initialized.
        //    E.g., the layerTexture would not be initialized otherwise.
        viewer.impl.matman().importModelMaterials(modelMaterials, modelId);

        // if the other viewer had no model before, make sure that the loadSpinner disappears.
        viewer._loadingSpinner.hide();

        // link running loader to new viewer
        if (model.loader && model.loader.viewer3DImpl===this.impl) {
            model.loader.viewer3DImpl = viewer.impl;
        }

        // if model is still loading, the worker will call onLoadComplete later. If the model is still loaded,
        // we do it immediately.
        if (model.getData().loadDone) {
            viewer.impl.onLoadComplete(model);
        }

        // recover selection
        viewer.impl.selector.setSelection(selectedIds, model);

        // recover isolated/hidden nodes (Note that hiddenIds are only used if no node is isolated)
        if (isolatedIds.length!=0)      viewer.impl.visibilityManager.isolate(isolatedIds, model);
        else if (hiddenIds.length!=0)   viewer.impl.visibilityManager.hide(hiddenIds, model);
    };

	/**
     * Temporarily remove a model from the Viewer, but keep loaders, materials, and geometry alive.
     * 
     * Reference {@link Autodesk.Viewing.Viewer3D#showModel}
     *
     * @param {number|Autodesk.Viewing.Model} model - model id or Model object
     * @returns {boolean} true indicates success, i.e., modelId referred to a visible model that is now hidden
     * 
     * @alias Autodesk.Viewing.Viewer3D#hideModel
     */
    Viewer3D.prototype.hideModel = function(model) {
        var scene = this.impl.modelQueue();
        // find visible model with this id
        model = typeof model === 'number' ? scene.findModel(model) : model;
        
        if (!model) {
            return false;
        }

        // remove model from viewer - but without discarding materials
        this.impl.removeModel(model);

        // make this model available for later showModel() calls
        scene.addHiddenModel(model);

        return true;
    };

	/**
     * Make a previously hidden model visible again.
     * 
     * Reference {@link Autodesk.Viewing.Viewer3D#hideModel}
     *
     * @param {number|Autodesk.Viewing.Model} model - model id or Model object
     * @param {boolean} preserveTools - disable automatic activation of default tool
     * @returns {boolean} true indicates success, i.e., ``model`` referred to a hidden model that is now visible
     * 
     * @alias Autodesk.Viewing.Viewer3D#showModel
     */
    Viewer3D.prototype.showModel = function(model, preserveTools) {
        var scene = this.impl.modelQueue();
        model = typeof model === 'number' ? scene.findHiddenModel(model) : model;

        if (!model) {
            // modelId does not refer to any hidden model
            return false;
        }

        // remove model from list of hidden ones
        scene.removeHiddenModel(model);

        // add it to the viewer.
        this.impl.addModel(model, preserveTools);

        return true;
    };

    /**
     * @returns {Autodesk.Viewing.Model[]}
     * 
     * @alias Autodesk.Viewing.Viewer3D#getVisibleModels
     */
     Viewer3D.prototype.getVisibleModels = function() {
         var scene = this.impl.modelQueue();
         return scene.getModels().slice();
     };

    /**
     * @returns {Autodesk.Viewing.Model[]}
     * 
     * @alias Autodesk.Viewing.Viewer3D#getHiddenModels
     */
    Viewer3D.prototype.getHiddenModels = function() {
        var scene = this.impl.modelQueue();
        return scene.getHiddenModels().slice();
    };

    /**
     * Returns all models loaded in the viewer.
     * @returns {Autodesk.Viewing.Model[]} - An array of visible and hidden models
     * 
     * @alias Autodesk.Viewing.Viewer3D#getAllModels
     */
    Viewer3D.prototype.getAllModels = function() {
        var scene = this.impl.modelQueue();
        return scene.getAllModels().slice();
    };


    /**
     * When loading a PDF document we optionally add a raster preview. This function returns the preview
     * corresponding to the passed bubbleNode.
     * 
     * @returns {Autodesk.Viewing.Model[]}
     * 
     * @param {Autodesk.Viewing.BubbleNode} bubbleNode 
     * 
     * @alias Autodesk.Viewing.Viewer3D#getUnderlayRaster
     */
    Viewer3D.prototype.getUnderlayRaster = function(bubbleNode) {
        const models = this.getAllModels();
        const underlayRasterModel = models.find(model => {
            const docNode = model.getDocumentNode();
            return docNode && docNode.getDocument()?.getPath() === bubbleNode.getDocument()?.getPath() &&
                docNode.guid() === bubbleNode.guid() && model.getData().underlayRaster;
        });

        return underlayRasterModel;
    };

     /**
      * @private
      */
    Viewer3D.prototype.restoreDefaultSettings = function() {

        var model = this.model;
        var tag = model.is2d() ? '2d' : '3d';
        this.prefs.reset(tag);
        
        this.impl.setupLighting(model);
        if (model.isAEC() && model.is3d()) {
            this.impl.setLightPresetForAec();
        }
        this.impl.setRenderingPrefsFor2D(!model.is3d());

        this.fireEvent({ type: et.RESTORE_DEFAULT_SETTINGS_EVENT });
    };

    /**
     * Disables roll-over highlighting.
     * @param {boolean} disable - Indicates whether highlighting should be on or off. True to disable highlights, false to enable them.
     *
     * @alias Autodesk.Viewing.Viewer3D#disableHighlight
     */
    Viewer3D.prototype.disableHighlight = function (disable) {
        this.impl.disableHighlight(disable);
    };

    /**
     * disable the selection of a loaded model.
     * @param {boolean} disable - true to disable selection, false to enable selection.
     * 
     * @alias Autodesk.Viewing.Viewer3D#disableSelection
     */
    Viewer3D.prototype.disableSelection = function (disable) {
        if(disable) {
            this.clearSelection();
        }
        this.impl.disableSelection(disable);
    };

    /**
     * check if the mouse-over highlight is disabled or not
     * 
     * @alias Autodesk.Viewing.Viewer3D#isHighlightDisabled
     */
    Viewer3D.prototype.isHighlightDisabled = function () {
       return this.impl.selector.highlightDisabled;
    };

    /**
     * check if the mouse-over highlight is paused or not
     * 
     * @alias Autodesk.Viewing.Viewer3D#isHighlightPaused
     */
    Viewer3D.prototype.isHighlightPaused = function () {
        return this.impl.selector.highlightPaused;
    };

    /**
     * check if the mouse-over highlight is active or not
     * @alias Autodesk.Viewing.Viewer3D#isHighlightActive
     */
    Viewer3D.prototype.isHighlightActive = function () {
        return !(this.impl.selector.highlightDisabled || this.impl.selector.highlightPaused);
    };

    /**
     * check if the selection of the loaded model is disabled or not
     * @alias Autodesk.Viewing.Viewer3D#isSelectionDisabled
     */
    Viewer3D.prototype.isSelectionDisabled = function () {
        return this.impl.selector.selectionDisabled;
    };

    /**
     * Activates the extension based on the extensionID and mode given. By default it takes the first available mode in getmodes();
     * @param {string} extensionID - The extension id.
     * @param {string} [mode]
     * 
     * @alias Autodesk.Viewing.Viewer3D#activateExtension
     */
    Viewer3D.prototype.activateExtension = function (extensionID, mode) {
        if (this.loadedExtensions && extensionID in this.loadedExtensions) {
            var extension =  this.loadedExtensions[extensionID];
            return extension.activate(mode);
        } else {
            logger.warn("Extension is not loaded or doesn't exist");
            return false;
        }
    };

    /**
     * Dectivates the extension based on the extensionID specified.
     * @param {string} extensionID - the extension ID
     * @returns {boolean} - true if the extension was deactivated false otherwise
     * @alias Autodesk.Viewing.Viewer3D#deactivateExtension
     */
    Viewer3D.prototype.deactivateExtension = function (extensionID) {
        if(this.loadedExtensions && extensionID in this.loadedExtensions) {
            var extension = this.loadedExtensions[extensionID];
            return extension.deactivate();
        } else {
            logger.warn("Extension is not loaded or doesn't exist");
            return false;
        }
    };

    /**
     * Check if the extension is active or not by passing the extensionID.
     * @param {string} extensionID - the extension ID
     * @param {string} mode - The model of the extension
     * @returns {boolean} - True if the extension is active, false otherwise
     * @alias Autodesk.Viewing.Viewer3D#isExtensionActive
     */
    Viewer3D.prototype.isExtensionActive = function (extensionID, mode) {
        if(this.loadedExtensions && extensionID in this.loadedExtensions) {
            var extension = this.loadedExtensions[extensionID];
            var activeStatus = extension.isActive(mode);
            return activeStatus;

        } else {
            logger.warn("Extension is not loaded or doesn't exist");
            return false;
        }
    };

    /**
     * Check if the extension is loaded or not by passing the extensionID.
     * @param {string} extensionID - the extension ID
     * @returns {boolean} - returns true if the extension was loaded, false otherwise
     * @alias Autodesk.Viewing.Viewer3D#isExtensionLoaded
     */
    Viewer3D.prototype.isExtensionLoaded = function (extensionID) {
        return this.loadedExtensions && extensionID in this.loadedExtensions;
    };

    /**
     * Get a list of all the extensions that are currently loaded.
     * @returns {string[]} - returns the IDs of all of the loaded extensions
     * @alias Autodesk.Viewing.Viewer3D#getLoadedExtensions
     */
    Viewer3D.prototype.getLoadedExtensions = function () {
        return this.loadedExtensions || [];
    };

    /**
     * Get a list of all the modes that are available for the given extensionID.
     * @param {string} extensionID - the extension ID
     * @returns {string[]} - array of the extension's modes.
     * @alias Autodesk.Viewing.Viewer3D#getExtensionModes
     */
    Viewer3D.prototype.getExtensionModes = function (extensionID) {
        if (this.loadedExtensions && extensionID in this.loadedExtensions) {
            var extension = this.loadedExtensions[extensionID];
            return extension.getModes();
        } else {
            console.warn("Extension is not loaded or doesn't exist");
            return [];
        }
    };

    /**
     * Reorders elements in the viewer container that need a certain order in the DOM to work correctly,
     * according to what's set in containerLayerOrder
     * @param {object} element - the element that needs reordering
     */
    Viewer3D.prototype.reorderElements = function(element) {
        var id = element.getAttribute('layer-order-id');
        var order = this.containerLayerOrder.indexOf(id);

        var nextElement = null;

        if (order !== -1) {
            for (var i = order + 1; i < this.containerLayerOrder.length && !nextElement; i++) {
                nextElement = this.container.querySelector('[layer-order-id="' + this.containerLayerOrder[i] + '"]');
            }
        }

        (nextElement) ? this.container.insertBefore(element, nextElement) : this.container.appendChild(element);
    };

    /**
     * Appends a new div element, inserting it in the correct order according to what's in containerLayerOrder
     * @param {string} layerOrderId - the id for the newly created div
     */
    Viewer3D.prototype.appendOrderedElementToViewer = function(layerOrderId) {
        var existingElement = this.container.querySelector('[layer-order-id="' + layerOrderId + '"]');

        if (existingElement) {
            return existingElement;
        }

        var element = this.getDocument().createElement('div');
        element.setAttribute('layer-order-id', layerOrderId);

        this.reorderElements(element);

        return element;
    };

    /**
     * Object that is returned by the ray cast and hit test methods for each scene object under the given canvas coordinates.
     * @typedef {object} Intersection
     * @property {number} dbId - Internal ID of the scene object.
     * @property {number} distance - Distance of the intersection point from camera. All intersections
     *  returned by the ray casting method are sorted from the smallest distance to the largest.
     * @property {THREE.Face3} face - THREE.Face3 object
     *  representing the triangular mesh face that has been intersected.
     * @property {number} faceIndex - Index of the intersected face, if available.
     * @property {number} fragId - ID of Forge Viewer *fragment* that was intersected.
     * @property {THREE.Vector3} point - THREE.Vector3 point of intersection.
     * @property {Autodesk.Viewing.Model} model - Model instance the dbId belongs to.
     */

    /**
     * Returns the intersection information for point x,y. If no intersection is found this function will return null.
     * @param {number} x - X-coordinate, i.e., horizontal distance (in pixels) from the left border of the canvas.
     * @param {number} y - Y-coordinate, i.e., vertical distance (in pixels) from the top border of the canvas.
     * @param {boolean} [ignoreTransparent] - ignores any transparent objects that might intersect x,y 
     * @returns {Intersection|null} - Intersection information about closest hit point.        
     * 
     * @alias Autodesk.Viewing.Viewer3D#hitTest
     */
    Viewer3D.prototype.hitTest = function(x, y, ignoreTransparent) {
        return this.impl.hitTest(x, y, ignoreTransparent);
    };

    /**
     * Clears the screen and redraws the overlays if *clear* is set to true.
     * Only the overlays will be redrawn if *clear* is set to false.
     * Should only be called when absolutely needed.
     * 
     * @param {boolean} clear - clears the screen and redraws the overlays.
     * @alias Autodesk.Viewing.Viewer3D#refresh
     */
    Viewer3D.prototype.refresh = function(clear) {
        this.impl.invalidate(clear, false, !clear);
    };


    /**
     * Function that decides which {@link Autodesk.Viewing.Profile} to use when
     * a model is loaded for the first time.
     *
     * Override this method to implement a different logic.
     *
     * @params {Object} [options] - Value passed into {#loadModel} function.
     *
     * @returns {Autodesk.Viewing.Profile|null} a Profile
     *
     * @alias Autodesk.Viewing.Viewer3D#chooseProfile
     */
    Viewer3D.prototype.chooseProfile = function(options) {
        
        let profile = this.profileManager.PROFILE_DEFAULT;

        if (this.config && this.config.profileSettings) {
            profile = new Profile(this.config.profileSettings);
        }
        else if (options && !!options.useFileProfile) {
            profile = this.profileManager.getProfileOrDefault(options.fileExt);
        }
        else if (BUILD_FLAG__FLUENT_PROFILE) {
            // Always use Fluent's profile for fluent builds.
            // It has priority over the AEC profile.
            profile = this.profileManager.PROFILE_FLUENT;
        }
        else if (options.isAEC) {
            profile = this.profileManager.PROFILE_AEC;
        }

        return profile;
    };
