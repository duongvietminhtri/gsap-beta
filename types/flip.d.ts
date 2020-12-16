declare namespace gsap {

  type EnterOrLeaveCallback = (elements: Element[]) => any;

  interface FlipStateInstance {
    readonly targets: Element[];
    readonly elementStates: ElementState[];
    readonly props: string;
    readonly idLookup: object;
    readonly alt: object;
    readonly simple: boolean;

    update(): void;
    fit(state: FlipStateInstance, scale?: boolean, nested?: boolean): FlipStateInstance;
    recordInlineStyles(): void;
    completeFlips(): void;
    getProperty(element: string | Element, property: string): any;
    getElementState(element: Element): ElementState;
    makeAbsolute(): void;
  }

  interface FlipState {
    new(targetsOrStates: Element[] | ElementState[], vars?: FlipStateVars, targetsAreElementStates?: boolean): FlipStateInstance;
    prototype: FlipStateInstance;
  }

  interface FlipStateVars {
    simple?: boolean;
    props?: string;
  }

  interface ElementState {
    getProp: Function;
    element: Element;
    id: string;
    matrix: gsap.plugins.Matrix2D;
    cache: object;
    bounds: object;
    isVisible: boolean;
    display: string;
    position: string;
    parent: Element;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    skewX: number;
    opacity: number;
    width: number;
    height: number;
    simple: boolean;
  }

  interface FlipToFromVars {
    targets?: Element | string | null | ArrayLike<Element | string>;
    scale?: boolean;
    onEnter?: EnterOrLeaveCallback;
    onLeave?: EnterOrLeaveCallback;
    absolute?: boolean;
    nested?: boolean;
    fade?: boolean;
    toggleClass?: string;
    zIndex?: number;
    props?: string;
    simple?: boolean;

    onComplete?: Callback;
    onRepeat?: Callback;
    onRepeatParams?: any[];
    onReverseComplete?: Callback;
    onStart?: Callback;
    onUpdate?: Callback;
    delay?: TweenValue;
    duration?: TweenValue;
    ease?: string | EaseFunction;
    stagger?: NumberValue | StaggerVars;
    snap?: object | number;
    [key: string]: any;
  }

  interface FitVars {
    scale?: boolean;
    absolute?: boolean;
    fitChild?: Element | string;
    getVars?: boolean;
    duration?: number;
    props?: string;
    simple?: string;

    onComplete?: Callback;
    onRepeat?: Callback;
    onRepeatParams?: any[];
    onReverseComplete?: Callback;
    onStart?: Callback;
    onUpdate?: Callback;
    delay?: TweenValue;
    ease?: string | EaseFunction;
    overwrite?: "auto" | boolean;
    stagger?: NumberValue | StaggerVars;
    snap?: object | number;
    [key: string]: any;
  }

  interface FitReturnVars {
    x: number;
    y: number;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
    rotation: number;
    skewX: number;

    [key: string]: any;
  }

  interface Flip {
    register(core: typeof gsap): void;

    /**
     * Captures information about the current state of the targets so that they can be Flipped later.
     *
     * ```js
     * const state = Flip.getState(".my-class, .another-class", {props: "backgroundColor,color", simple: true});
     * ```
     *
     * @param {Element | string | null | ArrayLike<Element | string>} targets
     * @param {FlipStateVars | string} vars
     * @returns {FlipStateInstance} The resulting state object
     * @memberof Flip
     */
    getState(targets: Element | string | null | ArrayLike<Element | string>, vars?: FlipStateVars | string): FlipStateInstance;

    /**
     * Animates the targets from the provided state to their current state (position/size).
     *
     * ```js
     * Flip.from(state, {
     *    duration: 1,
     *    ease: "power1.inOut",
     *    stagger: 0.1,
     *    onComplete: () => console.log("done")
     * });
     * ```
     *
     * @param {FlipStateInstance} state
     * @param {FlipToFromVars} vars
     * @returns {core.Timeline} The resulting Timeline animation
     * @memberof Flip
     */
    from(state: FlipStateInstance, vars?: FlipToFromVars): core.Timeline;

    /**
     * Animates the targets from the current state to the provided state.
     *
     * ```js
     * Flip.to(state, {
     *    duration: 1,
     *    ease: "power1.inOut",
     *    stagger: 0.1,
     *    onComplete: () => console.log("done")
     * });
     * ```
     *
     * @param {FlipStateInstance} state
     * @param {FlipToFromVars} vars
     * @returns {core.Timeline} The resulting Timeline animation
     * @memberof Flip
     */
    to(state: FlipStateInstance, vars?: FlipToFromVars): core.Timeline;

    /**
     * Gets the timeline for the most recently-created flip animation associated with the provided element
     *
     * ```js
     * let tl = Flip.getByTarget("#elementID");
     * ```
     *
     * @param {Element | string} target
     * @returns {core.Timeline | null} The timeline for the most recently-created flip animation associated with the provided element
     * @memberof Flip
     */
    getByTarget(target: Element | string): core.Timeline | null;

    /**
     * Determines whether or not a particular element is actively flipping (has an active flip animation)
     *
     * ```js
     * if (!Flip.isFlipping("#elementID")) {
     *    // do stuff
     * }
     * ```
     *
     * @param {Element | string} target
     * @returns {boolean} whether or not the target element is actively flipping
     * @memberof Flip
     */
    isFlipping(target: Element | string): boolean;

    /**
     * Changes the x/y/rotation/skewX transforms (and width/height or scaleX/scaleY) to fit one element exactly into the the position/size/rotation of another element.
     *
     * ```js
     * Flip.fit(".el-1", ".el-2", {scale: true, absolute: true, duration: 1, ease: "power2"});
     * ```
     *
     * @param {Element | string} fromElement
     * @param {Element | FlipStateInstance | string} toElement
     * @param {FitVars} vars
     * @returns {core.Tween | FitReturnVars} The Tween instance, or if getVars: true is set, an object containing "x" and "y" properties along with either "width" and "height" (default), or if scale: true is in the vars object, "scaleX" and "scaleY" properties. It will also include any standard tween-related properties ("scale", "getVars", and "absolute" will be stripped out)
     * @memberof Flip
     */
    fit(fromElement: Element | string, toElement: Element | FlipStateInstance | string, vars?: FitVars): core.Tween | FitReturnVars;

    /**
     * Sets all of the provided target elements to position: absolute while retaining their current positioning.
     *
     * ```js
     * Flip.makeAbsolute(".my-class");
     * ```
     *
     * @param {Element | string | null | ArrayLike<Element | string>} targets
     * @returns {Element[]} An Array containing the Elements that were affected
     * @memberof Flip
     */
    makeAbsolute(targets: Element | string | null | ArrayLike<Element | string>): Element[];

    /**
     * Gets the matrix to convert points from one element's local coordinates into a
     * different element's local coordinate system.
     *
     * ```js
     * Flip.convertCoordinates(fromElement, toElement);
     * ```
     *
     * @param {Element} fromElement
     * @param {Element} toElement
     * @returns {Matrix2D} A matrix to convert from one element's coordinate system to another's
     * @memberof Flip
     */
    convertCoordinates(fromElement: Element, toElement: Element): gsap.plugins.Matrix2D;

    /**
     * Converts a point from one element's local coordinates into a
     * different element's local coordinate system.
     *
     * ```js
     * Flip.convertCoordinates(fromElement, toElement, point);
     * ```
     *
     * @param {Element} fromElement
     * @param {Element} toElement
     * @param {gsap.Point2D} point
     * @returns {gsap.Point2D} A matrix to convert from one element's coordinate system to another's
     * @memberof Flip
     */
    convertCoordinates(fromElement: Element, toElement: Element, point: Point2D): gsap.Point2D;
  }

}

declare const Flip: gsap.Flip;

declare module "gsap/Flip" {
  export const Flip: gsap.Flip;
  export { Flip as default };
}

declare module "gsap/dist/Flip" {
  export * from "gsap/Flip";
  export { Flip as default } from "gsap/Flip";
}

declare module "gsap/src/Flip" {
  export * from "gsap/Flip";
  export { Flip as default } from "gsap/Flip";
}

declare module "gsap/all" {
  export * from "gsap/Flip";
}