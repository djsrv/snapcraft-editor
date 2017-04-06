/*

    objects.js

    a scriptable microworld
    based on morphic.js, blocks.js and threads.js
    inspired by Scratch

    written by Jens Mönig
    jens@moenig.org

    Copyright (C) 2017 by Jens Mönig

    This file is part of Snap!.

    Snap! is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of
    the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


    prerequisites:
    --------------
    needs blocks.js, threads.js, morphic.js and widgets.js


    toc
    ---
    the following list shows the order in which all constructors are
    defined. Use this list to locate code in this document:

        Sprite
        Stage
        Sound
        CellMorph


    credits
    -------
    Ian Reynolds contributed initial porting of primitives from Squeak and
    sound handling
    Achal Dave contributed research and prototyping for creating music
    using the Web Audio API
    Yuan Yuan and Dylan Servilla contributed graphic effects for costumes

*/

// Global stuff ////////////////////////////////////////////////////////

/*global PaintEditorMorph, ListWatcherMorph, PushButtonMorph, ToggleMorph,
DialogBoxMorph, InputFieldMorph, SpriteIconMorph, BlockMorph,
ThreadManager, VariableFrame, detect, BlockMorph, BoxMorph, Color,
CommandBlockMorph, FrameMorph, HatBlockMorph, MenuMorph, Morph, MultiArgMorph,
Point, ReporterBlockMorph, ScriptsMorph, StringMorph, SyntaxElementMorph,
TextMorph, contains, degrees, detect, newCanvas, nop, radians, Array,
CursorMorph, Date, FrameMorph, HandMorph, Math, MenuMorph, Morph,
MorphicPreferences, Object, PenMorph, Point, Rectangle, ScrollFrameMorph,
SliderMorph, String, StringMorph, TextMorph, contains, copy, degrees, detect,
document, isNaN, isString, newCanvas, nop, parseFloat, radians, window,
modules, IDE_Morph, VariableDialogMorph, HTMLCanvasElement, Context, List,
SpeechBubbleMorph, RingMorph, isNil, FileReader, TableDialogMorph,
BlockEditorMorph, BlockDialogMorph, PrototypeHatBlockMorph, localize,
TableMorph, TableFrameMorph, normalizeCanvas, BooleanSlotMorph*/

modules.objects = '2017-January-27';

var Sprite;
var Stage;
var Sound;
var CellMorph;

function isSnapObject(thing) {
    return thing instanceof Sprite || (thing instanceof Stage);
}

// Sprite /////////////////////////////////////////////////////////

// I am a scriptable object

// Sprite inherits from Node:

Sprite.prototype = new Node();
Sprite.prototype.constructor = Sprite;
Sprite.uber = Node.prototype;

// Sprite settings

Sprite.prototype.categories =
    [
        'motion',
        'control',
        'looks',
        'sensing',
        'sound',
        'operators',
        'pen',
        'variables',
        'lists',
        'other'
    ];

Sprite.prototype.blockColor = {
    motion : new Color(74, 108, 212),
    looks : new Color(143, 86, 227),
    sound : new Color(207, 74, 217),
    pen : new Color(0, 161, 120),
    control : new Color(230, 168, 34),
    sensing : new Color(4, 148, 220),
    operators : new Color(98, 194, 19),
    variables : new Color(243, 118, 29),
    lists : new Color(217, 77, 17),
    other: new Color(150, 150, 150)
};

Sprite.prototype.paletteColor = new Color(55, 55, 55);
Sprite.prototype.paletteTextColor = new Color(230, 230, 230);
Sprite.prototype.sliderColor
    = Sprite.prototype.paletteColor.lighter(30);
Sprite.prototype.isCachingPrimitives = true;

Sprite.prototype.enableNesting = true;
Sprite.prototype.enableFirstClass = true;
Sprite.prototype.useFlatLineEnds = false;
Sprite.prototype.highlightColor = new Color(250, 200, 130);
Sprite.prototype.highlightBorder = 8;

Sprite.prototype.bubbleColor = new Color(255, 255, 255);
Sprite.prototype.bubbleFontSize = 14;
Sprite.prototype.bubbleFontIsBold = true;
Sprite.prototype.bubbleCorner = 10;
Sprite.prototype.bubbleBorder = 3;
Sprite.prototype.bubbleBorderColor = new Color(190, 190, 190);
Sprite.prototype.bubbleMaxTextWidth = 130;

Sprite.prototype.initBlocks = function () {
    Sprite.prototype.blocks = {

        // Motion
        forward: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'move %n steps',
            defaults: [10]
        },
        turn: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'turn %clockwise %n degrees',
            defaults: [15]
        },
        turnLeft: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'turn %counterclockwise %n degrees',
            defaults: [15]
        },
        setHeading: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'point in direction %dir'
        },
        doFaceTowards: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'point towards %dst'
        },
        gotoXY: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'go to x: %n y: %n',
            defaults: [0, 0]
        },
        doGotoObject: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'go to %dst'
        },
        doGlide: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'glide %n secs to x: %n y: %n',
            defaults: [1, 0, 0]
        },
        changeXPosition: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'change x by %n',
            defaults: [10]
        },
        setXPosition: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'set x to %n',
            defaults: [0]
        },
        changeYPosition: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'change y by %n',
            defaults: [10]
        },
        setYPosition: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'set y to %n',
            defaults: [0]
        },
        bounceOffEdge: {
            only: Sprite,
            type: 'command',
            category: 'motion',
            spec: 'if on edge, bounce'
        },
        xPosition: {
            only: Sprite,
            type: 'reporter',
            category: 'motion',
            spec: 'x position'
        },
        yPosition: {
            only: Sprite,
            type: 'reporter',
            category: 'motion',
            spec: 'y position'
        },
        direction: {
            only: Sprite,
            type: 'reporter',
            category: 'motion',
            spec: 'direction'
        },

        // Looks
        doSwitchToCostume: {
            type: 'command',
            category: 'looks',
            spec: 'switch to costume %cst'
        },
        doWearNextCostume: {
            type: 'command',
            category: 'looks',
            spec: 'next costume'
        },
        getCostumeIdx: {
            type: 'reporter',
            category: 'looks',
            spec: 'costume #'
        },
        doSayFor: {
            only: Sprite,
            type: 'command',
            category: 'looks',
            spec: 'say %s for %n secs',
            defaults: [localize('Hello!'), 2]
        },
        bubble: {
            only: Sprite,
            type: 'command',
            category: 'looks',
            spec: 'say %s',
            defaults: [localize('Hello!')]
        },
        doThinkFor: {
            only: Sprite,
            type: 'command',
            category: 'looks',
            spec: 'think %s for %n secs',
            defaults: [localize('Hmm...'), 2]
        },
        doThink: {
            only: Sprite,
            type: 'command',
            category: 'looks',
            spec: 'think %s',
            defaults: [localize('Hmm...')]
        },
        changeEffect: {
            type: 'command',
            category: 'looks',
            spec: 'change %eff effect by %n',
            defaults: [null, 25]
        },
        setEffect: {
            type: 'command',
            category: 'looks',
            spec: 'set %eff effect to %n',
            defaults: [null, 0]
        },
        clearEffects: {
            type: 'command',
            category: 'looks',
            spec: 'clear graphic effects'
        },
        changeScale: {
            only: Sprite,
            type: 'command',
            category: 'looks',
            spec: 'change size by %n',
            defaults: [10]
        },
        setScale: {
            only: Sprite,
            type: 'command',
            category: 'looks',
            spec: 'set size to %n %',
            defaults: [100]
        },
        getScale: {
            only: Sprite,
            type: 'reporter',
            category: 'looks',
            spec: 'size'
        },
        show: {
            only: Sprite,
            type: 'command',
            category: 'looks',
            spec: 'show'
        },
        hide: {
            only: Sprite,
            type: 'command',
            category: 'looks',
            spec: 'hide'
        },
        comeToFront: {
            only: Sprite,
            type: 'command',
            category: 'looks',
            spec: 'go to front'
        },
        goBack: {
            only: Sprite,
            type: 'command',
            category: 'looks',
            spec: 'go back %n layers',
            defaults: [1]
        },
        doScreenshot: {
            type: 'command',
            category: 'looks',
            spec: 'save %imgsource as costume named %s',
            defaults: [['pen trails'], localize('screenshot')]
        },

        // Looks - Debugging primitives for development mode
        reportCostumes: {
            dev: true,
            type: 'reporter',
            category: 'looks',
            spec: 'wardrobe'
        },

        alert: {
            dev: true,
            type: 'command',
            category: 'looks',
            spec: 'alert %mult%s'
        },
        log: {
            dev: true,
            type: 'command',
            category: 'looks',
            spec: 'console log %mult%s'
        },

        // Sound
        playSound: {
            type: 'command',
            category: 'sound',
            spec: 'play sound %snd'
        },
        doPlaySoundUntilDone: {
            type: 'command',
            category: 'sound',
            spec: 'play sound %snd until done'
        },
        doStopAllSounds: {
            type: 'command',
            category: 'sound',
            spec: 'stop all sounds'
        },
        doRest: {
            type: 'command',
            category: 'sound',
            spec: 'rest for %n beats',
            defaults: [0.2]
        },
        doPlayNote: {
            type: 'command',
            category: 'sound',
            spec: 'play note %n for %n beats',
            defaults: [60, 0.5]
        },
        doChangeTempo: {
            type: 'command',
            category: 'sound',
            spec: 'change tempo by %n',
            defaults: [20]
        },
        doSetTempo: {
            type: 'command',
            category: 'sound',
            spec: 'set tempo to %n bpm',
            defaults: [60]
        },
        getTempo: {
            type: 'reporter',
            category: 'sound',
            spec: 'tempo'
        },

        // Sound - Debugging primitives for development mode
        reportSounds: {
            dev: true,
            type: 'reporter',
            category: 'sound',
            spec: 'jukebox'
        },

        // Pen
        clear: {
            type: 'command',
            category: 'pen',
            spec: 'clear'
        },
        down: {
            only: Sprite,
            type: 'command',
            category: 'pen',
            spec: 'pen down'
        },
        up: {
            only: Sprite,
            type: 'command',
            category: 'pen',
            spec: 'pen up'
        },
        setColor: {
            only: Sprite,
            type: 'command',
            category: 'pen',
            spec: 'set pen color to %clr'
        },
        changeHue: {
            only: Sprite,
            type: 'command',
            category: 'pen',
            spec: 'change pen color by %n',
            defaults: [10]
        },
        setHue: {
            only: Sprite,
            type: 'command',
            category: 'pen',
            spec: 'set pen color to %n',
            defaults: [0]
        },
        changeBrightness: {
            only: Sprite,
            type: 'command',
            category: 'pen',
            spec: 'change pen shade by %n',
            defaults: [10]
        },
        setBrightness: {
            only: Sprite,
            type: 'command',
            category: 'pen',
            spec: 'set pen shade to %n',
            defaults: [100]
        },
        changeSize: {
            only: Sprite,
            type: 'command',
            category: 'pen',
            spec: 'change pen size by %n',
            defaults: [1]
        },
        setSize: {
            only: Sprite,
            type: 'command',
            category: 'pen',
            spec: 'set pen size to %n',
            defaults: [1]
        },
        doStamp: {
            only: Sprite,
            type: 'command',
            category: 'pen',
            spec: 'stamp'
        },
        floodFill: {
            only: Sprite,
            type: 'command',
            category: 'pen',
            spec: 'fill'
        },

        // Control
        receiveGo: {
            type: 'hat',
            category: 'control',
            spec: 'when %greenflag clicked'
        },
        receiveKey: {
            type: 'hat',
            category: 'control',
            spec: 'when %keyHat key pressed'
        },

    /* migrated to a newer block version:

        receiveClick: {
            type: 'hat',
            category: 'control',
            spec: 'when I am clicked'
        },
    */

        receiveInteraction: {
            type: 'hat',
            category: 'control',
            spec: 'when I am %interaction',
            defaults: ['clicked']
        },
        receiveMessage: {
            type: 'hat',
            category: 'control',
            spec: 'when I receive %msgHat'
        },
        receiveCondition: {
            type: 'hat',
            category: 'control',
            spec: 'when %b'
        },
        doBroadcast: {
            type: 'command',
            category: 'control',
            spec: 'broadcast %msg'
        },
        doBroadcastAndWait: {
            type: 'command',
            category: 'control',
            spec: 'broadcast %msg and wait'
        },
        getLastMessage: {
            type: 'reporter',
            category: 'control',
            spec: 'message'
        },
        doWait: {
            type: 'command',
            category: 'control',
            spec: 'wait %n secs',
            defaults: [1]
        },
        doWaitUntil: {
            type: 'command',
            category: 'control',
            spec: 'wait until %b'
        },
        doForever: {
            type: 'command',
            category: 'control',
            spec: 'forever %c'
        },
        doRepeat: {
            type: 'command',
            category: 'control',
            spec: 'repeat %n %c',
            defaults: [10]
        },
        doUntil: {
            type: 'command',
            category: 'control',
            spec: 'repeat until %b %c'
        },
        doIf: {
            type: 'command',
            category: 'control',
            spec: 'if %b %c'
        },
        doIfElse: {
            type: 'command',
            category: 'control',
            spec: 'if %b %c else %c'
        },

    /* migrated to a newer block version:

        doStop: {
            type: 'command',
            category: 'control',
            spec: 'stop script'
        },
        doStopAll: {
            type: 'command',
            category: 'control',
            spec: 'stop all %stop'
        },
    */

        doStopThis: {
            type: 'command',
            category: 'control',
            spec: 'stop %stopChoices'
        },
        doStopOthers: {
            type: 'command',
            category: 'control',
            spec: 'stop %stopOthersChoices'
        },
        doRun: {
            type: 'command',
            category: 'control',
            spec: 'run %cmdRing %inputs'
        },
        fork: {
            type: 'command',
            category: 'control',
            spec: 'launch %cmdRing %inputs'
        },
        evaluate: {
            type: 'reporter',
            category: 'control',
            spec: 'call %repRing %inputs'
        },
    /*
        doRunWithInputList: {
            type: 'command',
            category: 'control',
            spec: 'run %cmd with input list %l'
        },

        forkWithInputList: {
            type: 'command',
            category: 'control',
            spec: 'launch %cmd with input list %l'
        },

        evaluateWithInputList: {
            type: 'reporter',
            category: 'control',
            spec: 'call %r with input list %l'
        },
    */
        doReport: {
            type: 'command',
            category: 'control',
            spec: 'report %s'
        },
    /*
        doStopBlock: { // migrated to a newer block version
            type: 'command',
            category: 'control',
            spec: 'stop block'
        },
    */
        doCallCC: {
            type: 'command',
            category: 'control',
            spec: 'run %cmdRing w/continuation'
        },
        reportCallCC: {
            type: 'reporter',
            category: 'control',
            spec: 'call %cmdRing w/continuation'
        },
        doWarp: {
            type: 'command',
            category: 'other',
            spec: 'warp %c'
        },

        // Cloning - very experimental
        receiveOnClone: {
            type: 'hat',
            category: 'control',
            spec: 'when I start as a clone'
        },
        createClone: {
            type: 'command',
            category: 'control',
            spec: 'create a clone of %cln'
        },
        removeClone: {
            type: 'command',
            category: 'control',
            spec: 'delete this clone'
        },

        // Debugging - pausing

        doPauseAll: {
            type: 'command',
            category: 'control',
            spec: 'pause all %pause'
        },

        // Sensing

        reportTouchingObject: {
            only: Sprite,
            type: 'predicate',
            category: 'sensing',
            spec: 'touching %col ?'
        },
        reportTouchingColor: {
            only: Sprite,
            type: 'predicate',
            category: 'sensing',
            spec: 'touching %clr ?'
        },
        reportColorIsTouchingColor: {
            only: Sprite,
            type: 'predicate',
            category: 'sensing',
            spec: 'color %clr is touching %clr ?'
        },
        colorFiltered: {
            dev: true,
            type: 'reporter',
            category: 'sensing',
            spec: 'filtered for %clr'
        },
        reportStackSize: {
            dev: true,
            type: 'reporter',
            category: 'sensing',
            spec: 'stack size'
        },
        reportFrameCount: {
            dev: true,
            type: 'reporter',
            category: 'sensing',
            spec: 'frames'
        },
        reportThreadCount: {
            dev: true,
            type: 'reporter',
            category: 'sensing',
            spec: 'processes'
        },
        doAsk: {
            type: 'command',
            category: 'sensing',
            spec: 'ask %s and wait',
            defaults: [localize('what\'s your name?')]
        },
        reportLastAnswer: { // retained for legacy compatibility
            dev: true,
            type: 'reporter',
            category: 'sensing',
            spec: 'answer'
        },
        getLastAnswer: {
            type: 'reporter',
            category: 'sensing',
            spec: 'answer'
        },
        reportMouseX: {
            type: 'reporter',
            category: 'sensing',
            spec: 'mouse x'
        },
        reportMouseY: {
            type: 'reporter',
            category: 'sensing',
            spec: 'mouse y'
        },
        reportMouseDown: {
            type: 'predicate',
            category: 'sensing',
            spec: 'mouse down?'
        },
        reportKeyPressed: {
            type: 'predicate',
            category: 'sensing',
            spec: 'key %key pressed?'
        },
        reportDistanceTo: {
            type: 'reporter',
            category: 'sensing',
            spec: 'distance to %dst'
        },
        doResetTimer: {
            type: 'command',
            category: 'sensing',
            spec: 'reset timer'
        },
        reportTimer: { // retained for legacy compatibility
            dev: true,
            type: 'reporter',
            category: 'sensing',
            spec: 'timer'
        },
        getTimer: {
            type: 'reporter',
            category: 'sensing',
            spec: 'timer'
        },
        reportAttributeOf: {
            type: 'reporter',
            category: 'sensing',
            spec: '%att of %spr',
            defaults: [['costume #']]
        },
        reportURL: {
            type: 'reporter',
            category: 'sensing',
            spec: 'http:// %s',
            defaults: ['snap.berkeley.edu']
        },
        reportIsFastTracking: {
            type: 'predicate',
            category: 'sensing',
            spec: 'turbo mode?'
        },
        doSetFastTracking: {
            type: 'command',
            category: 'sensing',
            spec: 'set turbo mode to %b'
        },
        reportDate: {
            type: 'reporter',
            category: 'sensing',
            spec: 'current %dates'
        },
        reportGet: {
            type: 'reporter',
            category: 'sensing',
            spec: 'my %get',
            defaults: [['neighbors']]
        },

        // Operators
        reifyScript: {
            type: 'ring',
            category: 'other',
            spec: '%rc %ringparms',
            alias: 'command ring lambda'
        },
        reifyReporter: {
            type: 'ring',
            category: 'other',
            spec: '%rr %ringparms',
            alias: 'reporter ring lambda'
        },
        reifyPredicate: {
            type: 'ring',
            category: 'other',
            spec: '%rp %ringparms',
            alias: 'predicate ring lambda'
        },
        reportSum: {
            type: 'reporter',
            category: 'operators',
            spec: '%n + %n'
        },
        reportDifference: {
            type: 'reporter',
            category: 'operators',
            spec: '%n \u2212 %n',
            alias: '-'
        },
        reportProduct: {
            type: 'reporter',
            category: 'operators',
            spec: '%n \u00D7 %n',
            alias: '*'
        },
        reportQuotient: {
            type: 'reporter',
            category: 'operators',
            spec: '%n / %n' // '%n \u00F7 %n'
        },
        reportRound: {
            type: 'reporter',
            category: 'operators',
            spec: 'round %n'
        },
        reportMonadic: {
            type: 'reporter',
            category: 'operators',
            spec: '%fun of %n',
            defaults: [null, 10]
        },
        reportModulus: {
            type: 'reporter',
            category: 'operators',
            spec: '%n mod %n'
        },
        reportRandom: {
            type: 'reporter',
            category: 'operators',
            spec: 'pick random %n to %n',
            defaults: [1, 10]
        },
        reportLessThan: {
            type: 'predicate',
            category: 'operators',
            spec: '%s < %s'
        },
        reportEquals: {
            type: 'predicate',
            category: 'operators',
            spec: '%s = %s'
        },
        reportGreaterThan: {
            type: 'predicate',
            category: 'operators',
            spec: '%s > %s'
        },
        reportAnd: {
            type: 'predicate',
            category: 'operators',
            spec: '%b and %b'
        },
        reportOr: {
            type: 'predicate',
            category: 'operators',
            spec: '%b or %b'
        },
        reportNot: {
            type: 'predicate',
            category: 'operators',
            spec: 'not %b'
        },
        reportBoolean: {
            type: 'predicate',
            category: 'operators',
            spec: '%bool',
            alias: 'true boolean'
        },
        reportFalse: { // special case for keyboard entry and search
            type: 'predicate',
            category: 'operators',
            spec: '%bool',
            defaults: [false],
            alias: 'false boolean'
        },
        reportJoinWords: {
            type: 'reporter',
            category: 'operators',
            spec: 'join %words',
            defaults: [localize('hello') + ' ', localize('world')]
        },
        reportLetter: {
            type: 'reporter',
            category: 'operators',
            spec: 'letter %n of %s',
            defaults: [1, localize('world')]
        },
        reportStringSize: {
            type: 'reporter',
            category: 'operators',
            spec: 'length of %s',
            defaults: [localize('world')]
        },
        reportUnicode: {
            type: 'reporter',
            category: 'operators',
            spec: 'unicode of %s',
            defaults: ['a']
        },
        reportUnicodeAsLetter: {
            type: 'reporter',
            category: 'operators',
            spec: 'unicode %n as letter',
            defaults: [65]
        },
        reportIsA: {
            type: 'predicate',
            category: 'operators',
            spec: 'is %s a %typ ?',
            defaults: [5]
        },
        reportIsIdentical: {
            type: 'predicate',
            category: 'operators',
            spec: 'is %s identical to %s ?'
        },
        reportTextSplit: {
            type: 'reporter',
            category: 'operators',
            spec: 'split %s by %delim',
            defaults: [localize('hello') + ' ' + localize('world'), " "]
        },
        reportJSFunction: { // experimental
            type: 'reporter',
            category: 'operators',
            spec: 'JavaScript function ( %mult%s ) { %code }'
        },
        reportTypeOf: { // only in dev mode for debugging
            dev: true,
            type: 'reporter',
            category: 'operators',
            spec: 'type of %s',
            defaults: [5]
        },
        reportTextFunction: { // only in dev mode - experimental
            dev: true,
            type: 'reporter',
            category: 'operators',
            spec: '%txtfun of %s',
            defaults: [null, "Abelson & Sussman"]
        },

    /*
        reportScript: {
            type: 'reporter',
            category: 'operators',
            spec: 'the script %parms %c'
        },
        reify: {
            type: 'reporter',
            category: 'operators',
            spec: 'the %f block %parms'
        },
    */

        // Variables
        doSetVar: {
            type: 'command',
            category: 'variables',
            spec: 'set %var to %s',
            defaults: [null, 0]
        },
        doChangeVar: {
            type: 'command',
            category: 'variables',
            spec: 'change %var by %n',
            defaults: [null, 1]
        },
        doShowVar: {
            type: 'command',
            category: 'variables',
            spec: 'show variable %var'
        },
        doHideVar: {
            type: 'command',
            category: 'variables',
            spec: 'hide variable %var'
        },
        doDeclareVariables: {
            type: 'command',
            category: 'other',
            spec: 'script variables %scriptVars'
        },

        // inheritance - experimental
        doDeleteAttr: {
            type: 'command',
            category: 'variables',
            spec: 'delete %shd'
        },

        // Lists
        reportNewList: {
            type: 'reporter',
            category: 'lists',
            spec: 'list %exp'
        },
        reportCONS: {
            type: 'reporter',
            category: 'lists',
            spec: '%s in front of %l'
        },
        reportListItem: {
            type: 'reporter',
            category: 'lists',
            spec: 'item %idx of %l',
            defaults: [1]
        },
        reportCDR: {
            type: 'reporter',
            category: 'lists',
            spec: 'all but first of %l'
        },
        reportListLength: {
            type: 'reporter',
            category: 'lists',
            spec: 'length of %l'
        },
        reportListContainsItem: {
            type: 'predicate',
            category: 'lists',
            spec: '%l contains %s',
            defaults: [null, localize('thing')]
        },
        doAddToList: {
            type: 'command',
            category: 'lists',
            spec: 'add %s to %l',
            defaults: [localize('thing')]
        },
        doDeleteFromList: {
            type: 'command',
            category: 'lists',
            spec: 'delete %ida of %l',
            defaults: [1]
        },
        doInsertInList: {
            type: 'command',
            category: 'lists',
            spec: 'insert %s at %idx of %l',
            defaults: [localize('thing'), 1]
        },
        doReplaceInList: {
            type: 'command',
            category: 'lists',
            spec: 'replace item %idx of %l with %s',
            defaults: [1, null, localize('thing')]
        },

        // MAP - experimental
        reportMap: {
            dev: true,
            type: 'reporter',
            category: 'lists',
            spec: 'map %repRing over %l'
        },
        doForEach: {
            dev: true,
            type: 'command',
            category: 'lists',
            spec: 'for %upvar in %l %cl',
            defaults: [localize('each item')]
        },

        // Tables - experimental

        doShowTable: {
            dev: true,
            type: 'command',
            category: 'lists',
            spec: 'show table %l'
        },

        // Code mapping - experimental
        doMapCodeOrHeader: { // experimental
            type: 'command',
            category: 'other',
            spec: 'map %cmdRing to %codeKind %code'
        },
        doMapValueCode: { // experimental
            type: 'command',
            category: 'other',
            spec: 'map %mapValue to code %code',
            defaults: [['String'], '<#1>']
        },
    /* obsolete - superseded by 'doMapValue'
        doMapStringCode: { // experimental
            type: 'command',
            category: 'other',
            spec: 'map String to code %code',
            defaults: ['<#1>']
        },
    */
        doMapListCode: { // experimental
            type: 'command',
            category: 'other',
            spec: 'map %codeListPart of %codeListKind to code %code'
        },
        reportMappedCode: { // experimental
            type: 'reporter',
            category: 'other',
            spec: 'code of %cmdRing'
        }
    };
};

Sprite.prototype.initBlocks();

Sprite.prototype.initBlockMigrations = function () {
    Sprite.prototype.blockMigrations = {
        doStopAll: {
            selector: 'doStopThis',
            inputs: [['all']]
        },
        doStop: {
            selector: 'doStopThis',
            inputs: [['this script']]
        },
        doStopBlock: {
            selector: 'doStopThis',
            inputs: [['this block']]
        },
        receiveClick: {
            selector: 'receiveInteraction',
            inputs: [['clicked']]
        },
        reportTrue: {
            selector: 'reportBoolean',
            inputs: [true]
        },
        reportFalse: {
            selector: 'reportBoolean',
            inputs: [false]
        },
        doMapStringCode: {
            selector: 'doMapValueCode',
            inputs: [['String'], '<#1>'],
            offset: 1
        }
    };
};

Sprite.prototype.initBlockMigrations();

Sprite.prototype.blockAlternatives = {
    // motion:
    turn: ['turnLeft'],
    turnLeft: ['turn'],
    changeXPosition: ['changeYPosition', 'setXPosition', 'setYPosition'],
    setXPosition: ['setYPosition', 'changeXPosition', 'changeYPosition'],
    changeYPosition: ['changeXPosition', 'setYPosition', 'setXPosition'],
    setYPosition: ['setXPosition', 'changeYPosition', 'changeXPosition'],
    xPosition: ['yPosition'],
    yPosition: ['xPosition'],

    // looks:
    doSayFor: ['doThinkFor', 'bubble', 'doThink', 'doAsk'],
    doThinkFor: ['doSayFor', 'doThink', 'bubble', 'doAsk'],
    bubble: ['doThink', 'doAsk', 'doSayFor', 'doThinkFor'],
    doThink: ['bubble', 'doAsk', 'doSayFor', 'doThinkFor'],
    show: ['hide'],
    hide: ['show'],
    changeEffect: ['setEffect'],
    setEffect: ['changeEffect'],
    changeScale: ['setScale'],
    setScale: ['changeScale'],

    // sound:
    playSound: ['doPlaySoundUntilDone'],
    doPlaySoundUntilDone: ['playSound'],
    doChangeTempo: ['doSetTempo'],
    doSetTempo: ['doChangeTempo'],

    // pen:
    clear: ['down', 'up', 'doStamp'],
    down: ['up', 'clear', 'doStamp'],
    up: ['down', 'clear', 'doStamp'],
    doStamp: ['clear', 'down', 'up'],
    changeHue: ['setHue', 'changeBrightness', 'setBrightness'],
    setHue: ['changeHue', 'changeBrightness', 'setBrightness'],
    changeBrightness: ['setBrightness', 'setHue', 'changeHue'],
    setBrightness: ['changeBrightness', 'setHue', 'changeHue'],
    changeSize: ['setSize'],
    setSize: ['changeSize'],

    // control:
    doBroadcast: ['doBroadcastAndWait'],
    doBroadcastAndWait: ['doBroadcast'],
    doIf: ['doIfElse', 'doUntil'],
    doIfElse: ['doIf', 'doUntil'],
    doRepeat: ['doUntil'],
    doUntil: ['doRepeat', 'doIf'],

    // sensing:
    doAsk: ['bubble', 'doThink', 'doSayFor', 'doThinkFor'],
    getLastAnswer: ['getTimer'],
    getTimer: ['getLastAnswer'],
    reportMouseX: ['reportMouseY'],
    reportMouseY: ['reportMouseX'],

    // operators:
    reportSum: ['reportDifference', 'reportProduct', 'reportQuotient'],
    reportDifference: ['reportSum', 'reportProduct', 'reportQuotient'],
    reportProduct: ['reportDifference', 'reportSum', 'reportQuotient'],
    reportQuotient: ['reportDifference', 'reportProduct', 'reportSum'],
    reportLessThan: ['reportEquals', 'reportGreaterThan'],
    reportEquals: ['reportLessThan', 'reportGreaterThan'],
    reportGreaterThan: ['reportEquals', 'reportLessThan'],
    reportAnd: ['reportOr'],
    reportOr: ['reportAnd'],

    // variables
    doSetVar: ['doChangeVar'],
    doChangeVar: ['doSetVar'],
    doShowVar: ['doHideVar'],
    doHideVar: ['doShowVar']
};

// Sprite instance creation

function Sprite(globals) {
    this.init(globals);
}

Sprite.prototype.init = function (globals) {
    this.name = localize('Sprite');
    this.variables = new VariableFrame(globals || null, this);
    this.scripts = new ScriptsMorph(this);
    this.customBlocks = [];
    this.sounds = new List();
    this.normalExtent = new Point(60, 60); // only for costume-less situation
    this.scale = 1;
    this.rotationStyle = 1; // 1 = full, 2 = left/right, 0 = off
    this.version = Date.now(); // for observer optimization
    this.isClone = false; // indicate a "temporary" Scratch-style clone
    this.isCorpse = false; // indicate whether a sprite/clone has been deleted
    this.cloneOriginName = '';

    // sprite nesting properties
    this.parts = []; // not serialized, only anchor (name)
    this.anchor = null;
    this.nestingScale = 1;
    this.rotatesWithAnchor = true;
    this.layers = null; // cache for dragging nested sprites, don't serialize

    this.blocksCache = {}; // not to be serialized (!)
    this.paletteCache = {}; // not to be serialized (!)
    this.rotationOffset = new Point(); // not to be serialized (!)
    this.idx = 0; // not to be serialized (!) - used for de-serialization
    this.wasWarped = false; // not to be serialized, used for fast-tracking

    // sprite inheritance
    this.exemplar = null;

    Sprite.uber.init.call(this);

    this.isDraggable = true;
    this.isDown = false;
    this.heading = 90;
};

// Sprite duplicating (fullCopy)

Sprite.prototype.fullCopy = function (forClone) {
    var c = Sprite.uber.fullCopy.call(this),
        myself = this,
        arr = [],
        cb, effect;

    c.stopTalking();
    c.color = this.color.copy();
    c.blocksCache = {};
    c.paletteCache = {};
    c.scripts = this.scripts.fullCopy(forClone);
    c.scripts.owner = c;
    c.variables = this.variables.copy();
    c.variables.owner = c;
    c.customBlocks = [];
    if (!forClone) {
        this.customBlocks.forEach(function (def) {
            cb = def.copyAndBindTo(c);
            c.customBlocks.push(cb);
            c.allBlockInstances(def).forEach(function (block) {
                block.definition = cb;
            });
        });
    }
    this.sounds.asArray().forEach(function (sound) {
        var snd = forClone ? sound : sound.copy();
        arr.push(snd);
    });
    c.sounds = new List(arr);
    arr = [];
    c.nestingScale = 1;
    c.rotatesWithAnchor = true;
    c.anchor = null;
    c.parts = [];
    this.parts.forEach(function (part) {
        var dp = part.fullCopy(forClone);
        dp.nestingScale = part.nestingScale;
        dp.rotatesWithAnchor = part.rotatesWithAnchor;
        c.attachPart(dp);
    });
    for (effect in this.graphicsValues) {
        if (this.graphicsValues.hasOwnProperty(effect)) {
            c.graphicsValues[effect] = this.graphicsValues[effect];
        }
    }
    return c;
};

// Sprite versioning

Sprite.prototype.setName = function (string) {
    this.name = string || this.name;
    this.version = Date.now();
};

Sprite.prototype.endWarp = function () {
    this.isWarped = false;
    if (this.wantsRedraw) {
        var x = this.xPosition(),
            y = this.yPosition();
        this.drawNew();
        this.silentGotoXY(x, y, true); // just me
        this.wantsRedraw = false;
    }
    this.parent.changed();
};

// Sprite block instantiation

Sprite.prototype.blockForSelector = function (selector, setDefaults) {
    var migration, info, block, defaults, inputs, i;
    migration = this.blockMigrations[selector];
    info = this.blocks[migration ? migration.selector : selector];
    if (!info) {return null; }
    block = info.type === 'command' ? new CommandBlockMorph()
        : info.type === 'hat' ? new HatBlockMorph()
            : info.type === 'ring' ? new RingMorph()
                : new ReporterBlockMorph(info.type === 'predicate');
    block.color = this.blockColor[info.category];
    block.category = info.category;
    block.selector = migration ? migration.selector : selector;
    if (contains(['reifyReporter', 'reifyPredicate'], block.selector)) {
        block.isStatic = true;
    }
    block.setSpec(localize(info.spec));
    if ((setDefaults && info.defaults) || (migration && migration.inputs)) {
        defaults = migration ? migration.inputs : info.defaults;
        block.defaults = defaults;
        inputs = block.inputs();
        if (inputs[0] instanceof MultiArgMorph) {
            inputs[0].setContents(defaults);
            inputs[0].defaults = defaults;
        } else {
            for (i = 0; i < defaults.length; i += 1) {
                if (defaults[i] !== null) {
                    inputs[i].setContents(defaults[i]);
                }
            }
        }
    }
    return block;
};

Sprite.prototype.variableBlock = function (varName) {
    var block = new ReporterBlockMorph(false);
    block.selector = 'reportGetVar';
    block.color = this.blockColor.variables;
    block.category = 'variables';
    block.setSpec(varName);
    block.isDraggable = true;
    return block;
};

// Sprite block templates

Sprite.prototype.blockTemplates = function (category) {
    var blocks = [], myself = this, varNames, button,
        cat = category || 'motion', txt,
        inheritedVars = this.inheritedVariableNames(),
        world = this.parentThatIsA(Stage).ide.world();

    function block(selector) {
        if (Stage.prototype.hiddenPrimitives[selector]) {
            return null;
        }
        var newBlock = Sprite.prototype.blockForSelector(selector, true);
        newBlock.isTemplate = true;
        return newBlock;
    }

    function variableBlock(varName) {
        var newBlock = Sprite.prototype.variableBlock(varName);
        newBlock.isDraggable = false;
        newBlock.isTemplate = true;
        if (contains(inheritedVars, varName)) {
            newBlock.ghost();
        }
        return newBlock;
    }

    function addVar(pair) {
        var ide;
        if (pair) {
            if (myself.isVariableNameInUse(pair[0], pair[1])) {
                myself.inform('that name is already in use');
            } else {
                ide = myself.parentThatIsA(IDE_Morph);
                myself.addVariable(pair[0], pair[1]);
                ide.flushBlocksCache('variables'); // b/c of inheritance
                ide.refreshPalette();
            }
        }
    }

    if (cat === 'motion') {

        blocks.push(block('forward'));
        blocks.push(block('turn'));
        blocks.push(block('turnLeft'));
        blocks.push('-');
        blocks.push(block('setHeading'));
        blocks.push(block('doFaceTowards'));
        blocks.push('-');
        blocks.push(block('gotoXY'));
        blocks.push(block('doGotoObject'));
        blocks.push(block('doGlide'));
        blocks.push('-');
        blocks.push(block('changeXPosition'));
        blocks.push(block('setXPosition'));
        blocks.push(block('changeYPosition'));
        blocks.push(block('setYPosition'));
        blocks.push('-');
        blocks.push(block('bounceOffEdge'));
        blocks.push('-');
        blocks.push(block('xPosition'));
        blocks.push(block('yPosition'));
        blocks.push(block('direction'));

    } else if (cat === 'looks') {

        blocks.push(block('doSwitchToCostume'));
        blocks.push(block('doWearNextCostume'));
        blocks.push(block('getCostumeIdx'));
        blocks.push('-');
        blocks.push(block('doSayFor'));
        blocks.push(block('bubble'));
        blocks.push(block('doThinkFor'));
        blocks.push(block('doThink'));
        blocks.push('-');
        blocks.push(block('changeEffect'));
        blocks.push(block('setEffect'));
        blocks.push(block('clearEffects'));
        blocks.push('-');
        blocks.push(block('changeScale'));
        blocks.push(block('setScale'));
        blocks.push(block('getScale'));
        blocks.push('-');
        blocks.push(block('show'));
        blocks.push(block('hide'));
        blocks.push('-');
        blocks.push(block('comeToFront'));
        blocks.push(block('goBack'));

    // for debugging: ///////////////

        if (world.isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportCostumes'));
            blocks.push('-');
            blocks.push(block('log'));
            blocks.push(block('alert'));
            blocks.push('-');
            blocks.push(block('doScreenshot'));
        }

    /////////////////////////////////

    } else if (cat === 'sound') {

        blocks.push(block('playSound'));
        blocks.push(block('doPlaySoundUntilDone'));
        blocks.push(block('doStopAllSounds'));
        blocks.push('-');
        blocks.push(block('doRest'));
        blocks.push('-');
        blocks.push(block('doPlayNote'));
        blocks.push('-');
        blocks.push(block('doChangeTempo'));
        blocks.push(block('doSetTempo'));
        blocks.push(block('getTempo'));

    // for debugging: ///////////////

        if (world.isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportSounds'));
        }

    } else if (cat === 'pen') {

        blocks.push(block('clear'));
        blocks.push('-');
        blocks.push(block('down'));
        blocks.push(block('up'));
        blocks.push('-');
        blocks.push(block('setColor'));
        blocks.push(block('changeHue'));
        blocks.push(block('setHue'));
        blocks.push('-');
        blocks.push(block('changeBrightness'));
        blocks.push(block('setBrightness'));
        blocks.push('-');
        blocks.push(block('changeSize'));
        blocks.push(block('setSize'));
        blocks.push('-');
        blocks.push(block('doStamp'));
        blocks.push(block('floodFill'));

    } else if (cat === 'control') {

        blocks.push(block('receiveGo'));
        blocks.push(block('receiveKey'));
        blocks.push(block('receiveInteraction'));
        blocks.push(block('receiveCondition'));
        blocks.push(block('receiveMessage'));
        blocks.push('-');
        blocks.push(block('doBroadcast'));
        blocks.push(block('doBroadcastAndWait'));
        blocks.push(block('getLastMessage'));
        blocks.push('-');
        blocks.push(block('doWarp'));
        blocks.push('-');
        blocks.push(block('doWait'));
        blocks.push(block('doWaitUntil'));
        blocks.push('-');
        blocks.push(block('doForever'));
        blocks.push(block('doRepeat'));
        blocks.push(block('doUntil'));
        blocks.push('-');
        blocks.push(block('doIf'));
        blocks.push(block('doIfElse'));
        blocks.push('-');
        blocks.push(block('doReport'));
        blocks.push('-');
    /*
    // old STOP variants, migrated to a newer version, now redundant
        blocks.push(block('doStopBlock'));
        blocks.push(block('doStop'));
        blocks.push(block('doStopAll'));
    */
        blocks.push(block('doStopThis'));
        blocks.push(block('doStopOthers'));
        blocks.push('-');
        blocks.push(block('doRun'));
        blocks.push(block('fork'));
        blocks.push(block('evaluate'));
        blocks.push('-');
    /*
    // list variants commented out for now (redundant)
        blocks.push(block('doRunWithInputList'));
        blocks.push(block('forkWithInputList'));
        blocks.push(block('evaluateWithInputList'));
        blocks.push('-');
    */
        blocks.push(block('doCallCC'));
        blocks.push(block('reportCallCC'));
        blocks.push('-');
        blocks.push(block('receiveOnClone'));
        blocks.push(block('createClone'));
        blocks.push(block('removeClone'));
        blocks.push('-');
        blocks.push(block('doPauseAll'));

    } else if (cat === 'sensing') {

        blocks.push(block('reportTouchingObject'));
        blocks.push(block('reportTouchingColor'));
        blocks.push(block('reportColorIsTouchingColor'));
        blocks.push('-');
        blocks.push(block('doAsk'));
        blocks.push(block('getLastAnswer'));
        blocks.push('-');
        blocks.push(block('reportMouseX'));
        blocks.push(block('reportMouseY'));
        blocks.push(block('reportMouseDown'));
        blocks.push('-');
        blocks.push(block('reportKeyPressed'));
        blocks.push('-');
        blocks.push(block('reportDistanceTo'));
        blocks.push('-');
        blocks.push(block('doResetTimer'));
        blocks.push(block('getTimer'));
        blocks.push('-');
        blocks.push(block('reportAttributeOf'));

        if (Sprite.prototype.enableFirstClass) {
            blocks.push(block('reportGet'));
        }
        blocks.push('-');

        blocks.push(block('reportURL'));
        blocks.push('-');
        blocks.push(block('reportIsFastTracking'));
        blocks.push(block('doSetFastTracking'));
        blocks.push('-');
        blocks.push(block('reportDate'));

    // for debugging: ///////////////

        if (world.isDevMode) {

            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportThreadCount'));
            blocks.push(block('colorFiltered'));
            blocks.push(block('reportStackSize'));
            blocks.push(block('reportFrameCount'));
        }

    } else if (cat === 'operators') {

        blocks.push(block('reifyScript'));
        blocks.push(block('reifyReporter'));
        blocks.push(block('reifyPredicate'));
        blocks.push('#');
        blocks.push('-');
        blocks.push(block('reportSum'));
        blocks.push(block('reportDifference'));
        blocks.push(block('reportProduct'));
        blocks.push(block('reportQuotient'));
        blocks.push('-');
        blocks.push(block('reportModulus'));
        blocks.push(block('reportRound'));
        blocks.push(block('reportMonadic'));
        blocks.push(block('reportRandom'));
        blocks.push('-');
        blocks.push(block('reportLessThan'));
        blocks.push(block('reportEquals'));
        blocks.push(block('reportGreaterThan'));
        blocks.push('-');
        blocks.push(block('reportAnd'));
        blocks.push(block('reportOr'));
        blocks.push(block('reportNot'));
        blocks.push(block('reportBoolean'));
        blocks.push('-');
        blocks.push(block('reportJoinWords'));
        blocks.push(block('reportTextSplit'));
        blocks.push(block('reportLetter'));
        blocks.push(block('reportStringSize'));
        blocks.push('-');
        blocks.push(block('reportUnicode'));
        blocks.push(block('reportUnicodeAsLetter'));
        blocks.push('-');
        blocks.push(block('reportIsA'));
        blocks.push(block('reportIsIdentical'));

        if (true) { // (Process.prototype.enableJS) {
            blocks.push('-');
            blocks.push(block('reportJSFunction'));
        }

    // for debugging: ///////////////

        if (world.isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportTypeOf'));
            blocks.push(block('reportTextFunction'));
        }

    /////////////////////////////////

    } else if (cat === 'variables') {

        button = new PushButtonMorph(
            null,
            function () {
                new VariableDialogMorph(
                    null,
                    addVar,
                    myself
                ).prompt(
                    'Variable name',
                    null,
                    myself.world()
                );
            },
            'Make a variable'
        );
        button.userMenu = helpMenu;
        button.selector = 'addVariable';
        button.showHelp = BlockMorph.prototype.showHelp;
        blocks.push(button);

        if (this.deletableVariableNames().length > 0) {
            button = new PushButtonMorph(
                null,
                function () {
                    var menu = new MenuMorph(
                        myself.deleteVariable,
                        null,
                        myself
                    );
                    myself.deletableVariableNames().forEach(function (name) {
                        menu.addItem(name, name);
                    });
                    menu.popUpAtHand(myself.world());
                },
                'Delete a variable'
            );
            button.userMenu = helpMenu;
            button.selector = 'deleteVariable';
            button.showHelp = BlockMorph.prototype.showHelp;
            blocks.push(button);
        }

        blocks.push('-');

        varNames = this.variables.allNames();
        if (varNames.length > 0) {
            varNames.forEach(function (name) {
                blocks.push(variableBlock(name));
            });
            blocks.push('-');
        }

        blocks.push(block('doSetVar'));
        blocks.push(block('doChangeVar'));
        blocks.push(block('doShowVar'));
        blocks.push(block('doHideVar'));
        blocks.push(block('doDeclareVariables'));

    // inheritance:

        if (Stage.prototype.enableInheritance) {
            blocks.push('-');
            blocks.push(block('doDeleteAttr'));
        }

    ///////////////////////////////

        blocks.push('=');

        blocks.push(block('reportNewList'));
        blocks.push('-');
        blocks.push(block('reportCONS'));
        blocks.push(block('reportListItem'));
        blocks.push(block('reportCDR'));
        blocks.push('-');
        blocks.push(block('reportListLength'));
        blocks.push(block('reportListContainsItem'));
        blocks.push('-');
        blocks.push(block('doAddToList'));
        blocks.push(block('doDeleteFromList'));
        blocks.push(block('doInsertInList'));
        blocks.push(block('doReplaceInList'));

    // for debugging: ///////////////

        if (world.isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportMap'));
            blocks.push('-');
            blocks.push(block('doForEach'));
            blocks.push(block('doShowTable'));
        }

    /////////////////////////////////

        blocks.push('=');

        if (Stage.prototype.enableCodeMapping) {
            blocks.push(block('doMapCodeOrHeader'));
            blocks.push(block('doMapValueCode'));
            blocks.push(block('doMapListCode'));
            blocks.push('-');
            blocks.push(block('reportMappedCode'));
            blocks.push('=');
        }

        button = new PushButtonMorph(
            null,
            function () {
                var ide = myself.parentThatIsA(IDE_Morph),
                    stage = myself.parentThatIsA(Stage);
                new BlockDialogMorph(
                    null,
                    function (definition) {
                        if (definition.spec !== '') {
                            if (definition.isGlobal) {
                                stage.globalBlocks.push(definition);
                            } else {
                                myself.customBlocks.push(definition);
                            }
                            ide.flushPaletteCache();
                            ide.refreshPalette();
                            new BlockEditorMorph(definition, myself).popUp();
                        }
                    },
                    myself
                ).prompt(
                    'Make a block',
                    null,
                    myself.world()
                );
            },
            'Make a block'
        );
        button.userMenu = helpMenu;
        button.selector = 'addCustomBlock';
        button.showHelp = BlockMorph.prototype.showHelp;
        blocks.push(button);
    }
    return blocks;
};

Sprite.prototype.palette = function (category) {
    if (!this.paletteCache[category]) {
        this.paletteCache[category] = this.freshPalette(category);
    }
    return this.paletteCache[category];
};

Sprite.prototype.freshPalette = function (category) {
    var palette = new ScrollFrameMorph(null, null, this.sliderColor),
        unit = SyntaxElementMorph.prototype.fontSize,
        x = 0,
        y = 5,
        ry = 0,
        blocks,
        hideNextSpace = false,
        myself = this,
        stage = this.parentThatIsA(Stage),
        oldFlag = Morph.prototype.trackChanges;

    Morph.prototype.trackChanges = false;

    palette.owner = this;
    palette.padding = unit / 2;
    palette.color = this.paletteColor;
    palette.growth = new Point(0, MorphicPreferences.scrollBarSize);

    // menu:

    palette.userMenu = function () {
        var menu = new MenuMorph(),
            ide = this.parentThatIsA(IDE_Morph),
            more = {
                operators:
                    ['reifyScript', 'reifyReporter', 'reifyPredicate'],
                control:
                    ['doWarp'],
                variables:
                    [
                        'doDeclareVariables',
                        'reportNewList',
                        'reportCONS',
                        'reportListItem',
                        'reportCDR',
                        'reportListLength',
                        'reportListContainsItem',
                        'doAddToList',
                        'doDeleteFromList',
                        'doInsertInList',
                        'doReplaceInList'
                    ]
            };

        function hasHiddenPrimitives() {
            var defs = Sprite.prototype.blocks,
                hiddens = Stage.prototype.hiddenPrimitives;
            return Object.keys(hiddens).some(function (any) {
                return !isNil(defs[any]) && (defs[any].category === category
                    || contains((more[category] || []), any));
            });
        }

        function canHidePrimitives() {
            return palette.contents.children.some(function (any) {
                return contains(
                    Object.keys(Sprite.prototype.blocks),
                    any.selector
                );
            });
        }

        menu.addPair(
            'find blocks...',
            function () {myself.searchBlocks(); },
            '^F'
        );
        if (canHidePrimitives()) {
            menu.addItem(
                'hide primitives',
                function () {
                    var defs = Sprite.prototype.blocks;
                    Object.keys(defs).forEach(function (sel) {
                        if (defs[sel].category === category) {
                            Stage.prototype.hiddenPrimitives[sel] = true;
                        }
                    });
                    (more[category] || []).forEach(function (sel) {
                        Stage.prototype.hiddenPrimitives[sel] = true;
                    });
                    ide.flushBlocksCache(category);
                    ide.refreshPalette();
                }
            );
        }
        if (hasHiddenPrimitives()) {
            menu.addItem(
                'show primitives',
                function () {
                    var hiddens = Stage.prototype.hiddenPrimitives,
                        defs = Sprite.prototype.blocks;
                    Object.keys(hiddens).forEach(function (sel) {
                        if (defs[sel] && (defs[sel].category === category)) {
                            delete Stage.prototype.hiddenPrimitives[sel];
                        }
                    });
                    (more[category] || []).forEach(function (sel) {
                        delete Stage.prototype.hiddenPrimitives[sel];
                    });
                    ide.flushBlocksCache(category);
                    ide.refreshPalette();
                }
            );
        }
        return menu;
    };

    // primitives:

    blocks = this.blocksCache[category];
    if (!blocks) {
        blocks = myself.blockTemplates(category);
        if (this.isCachingPrimitives) {
            myself.blocksCache[category] = blocks;
        }
    }

    blocks.forEach(function (block) {
        if (block === null) {
            return;
        }
        if (block === '-') {
            if (hideNextSpace) {return; }
            y += unit * 0.8;
            hideNextSpace = true;
        } else if (block === '=') {
            if (hideNextSpace) {return; }
            y += unit * 1.6;
            hideNextSpace = true;
        } else if (block === '#') {
            x = 0;
            y = ry;
        } else {
            hideNextSpace = false;
            if (x === 0) {
                y += unit * 0.3;
            }
            block.setPosition(new Point(x, y));
            palette.addContents(block);
            if (block instanceof ToggleMorph
                    || (block instanceof RingMorph)) {
                x = block.right() + unit / 2;
                ry = block.bottom();
            } else {
                // if (block.fixLayout) {block.fixLayout(); }
                x = 0;
                y += block.height();
            }
        }
    });

    // global custom blocks:

    if (stage) {
        y += unit * 1.6;

        stage.globalBlocks.forEach(function (definition) {
            var block;
            if (definition.category === category ||
                    (category === 'variables'
                        && contains(
                            ['lists', 'other'],
                            definition.category
                        ))) {
                block = definition.templateInstance();
                y += unit * 0.3;
                block.setPosition(new Point(x, y));
                palette.addContents(block);
                x = 0;
                y += block.height();
            }
        });
    }

    // local custom blocks:

    y += unit * 1.6;
    this.customBlocks.forEach(function (definition) {
        var block;
        if (definition.category === category ||
                (category === 'variables'
                    && contains(
                        ['lists', 'other'],
                        definition.category
                    ))) {
            block = definition.templateInstance();
            y += unit * 0.3;
            block.setPosition(new Point(x, y));
            palette.addContents(block);
            x = 0;
            y += block.height();
        }
    });

    //layout

    palette.scrollX(palette.padding);
    palette.scrollY(palette.padding);

    Morph.prototype.trackChanges = oldFlag;
    return palette;
};

// Sprite blocks searching

Sprite.prototype.blocksMatching = function (
    searchString,
    strictly,
    types, // optional, ['hat', 'command', 'reporter', 'predicate']
    varNames // optional, list of reachable unique variable names
) {
    // answer an array of block templates whose spec contains
    // the given search string, ordered by descending relevance
    // types is an optional array containing block types the search
    // is limited to, e.g. "command", "hat", "reporter", "predicate".
    // Note that "predicate" is not subsumed by "reporter" and has
    // to be specified explicitly.
    // if no types are specified all blocks are searched
    var blocks = [],
        blocksDict,
        myself = this,
        search = searchString.toLowerCase(),
        stage = this.parentThatIsA(Stage),
        reporterized;

    if (!types || !types.length) {
        types = ['hat', 'command', 'reporter', 'predicate', 'ring'];
    }
    if (!varNames) {varNames = []; }

    function labelOf(aBlockSpec) {
        var words = (BlockMorph.prototype.parseSpec(aBlockSpec)),
            filtered = words.filter(
                function (each) {return (each.indexOf('%') !== 0); }
            );
        return filtered.join(' ');
    }

    function fillDigits(anInt, totalDigits, fillChar) {
        var ans = String(anInt);
        while (ans.length < totalDigits) {ans = fillChar + ans; }
        return ans;
    }

    function relevance(aBlockLabel, aSearchString) {
        var lbl = ' ' + aBlockLabel,
            idx = lbl.indexOf(aSearchString),
            atWord;
        if (idx === -1) {return -1; }
        atWord = (lbl.charAt(idx - 1) === ' ');
        if (strictly && !atWord) {return -1; }
        return (atWord ? '1' : '2') + fillDigits(idx, 4, '0');
    }

    function primitive(selector) {
        var newBlock = Sprite.prototype.blockForSelector(selector, true);
        newBlock.isTemplate = true;
        return newBlock;
    }

    // variable getters
    varNames.forEach(function (vName) {
        var rel = relevance(labelOf(vName.toLowerCase()), search);
        if (rel !== -1) {
            blocks.push([myself.variableBlock(vName), rel + '1']);
        }
    });
    // custom blocks
    [this.customBlocks, stage.globalBlocks].forEach(function (blocksList) {
        blocksList.forEach(function (definition) {
            if (contains(types, definition.type)) {
                var spec = localize(definition.blockSpec()).toLowerCase(),
                    rel = relevance(labelOf(spec), search);
                if (rel !== -1) {
                    blocks.push([definition.templateInstance(), rel + '2']);
                }
            }
        });
    });
    // primitives
    blocksDict = Sprite.prototype.blocks;
    Object.keys(blocksDict).forEach(function (selector) {
        if (!Stage.prototype.hiddenPrimitives[selector] &&
                contains(types, blocksDict[selector].type)) {
            var block = blocksDict[selector],
                spec = localize(block.alias || block.spec).toLowerCase(),
                rel = relevance(labelOf(spec), search);
            if (
                (rel !== -1) &&
                    (!block.dev) &&
                    (!block.only || (block.only === myself.constructor))
            ) {
                blocks.push([primitive(selector), rel + '3']);
            }
        }
    });
    // infix arithmetic expression
    if (contains(types, 'reporter')) {
        reporterized = this.reporterize(searchString);
        if (reporterized) {
            // reporterized.isTemplate = true;
            // reporterized.isDraggable = false;
            blocks.push([reporterized, '']);
        }
    }
    blocks.sort(function (x, y) {return x[1] < y[1] ? -1 : 1; });
    return blocks.map(function (each) {return each[0]; });
};

Sprite.prototype.searchBlocks = function (
    searchString,
    types,
    varNames,
    scriptFocus
) {
    var myself = this,
        unit = SyntaxElementMorph.prototype.fontSize,
        ide = this.parentThatIsA(IDE_Morph),
        oldSearch = '',
        searchBar = new InputFieldMorph(searchString || ''),
        searchPane = ide.createPalette('forSearch'),
        blocksList = [],
        selection,
        focus;

    function showSelection() {
        if (focus) {focus.destroy(); }
        if (!selection || !scriptFocus) {return; }
        focus = selection.outline(
            MorphicPreferences.isFlat ? new Color(150, 200, 255)
                    : new Color(255, 255, 255),
            2
        );
        searchPane.contents.add(focus);
        focus.scrollIntoView();
    }

    function show(blocks) {
        var oldFlag = Morph.prototype.trackChanges,
            x = searchPane.contents.left() + 5,
            y = (searchBar.bottom() + unit);
        blocksList = blocks;
        selection = null;
        if (blocks.length && scriptFocus) {
            selection = blocks[0];
        }
        Morph.prototype.trackChanges = false;
        searchPane.contents.children = [searchPane.contents.children[0]];
        blocks.forEach(function (block) {
            block.setPosition(new Point(x, y));
            searchPane.addContents(block);
            y += block.height();
            y += unit * 0.3;
        });
        Morph.prototype.trackChanges = oldFlag;
        showSelection();
        searchPane.changed();
    }

    searchPane.owner = this;
    searchPane.color = myself.paletteColor;
    searchPane.contents.color = myself.paletteColor;
    searchPane.addContents(searchBar);
    searchBar.drawNew();
    searchBar.setWidth(ide.logo.width() - 30);
    searchBar.contrast = 90;
    searchBar.setPosition(
        searchPane.contents.topLeft().add(new Point(10, 10))
    );
    searchBar.drawNew();

    searchPane.accept = function () {
        var search;
        if (scriptFocus) {
            searchBar.cancel();
            if (selection) {
                scriptFocus.insertBlock(selection);
            }
        } else {
            search = searchBar.getValue();
            if (search.length > 0) {
                show(myself.blocksMatching(search));
            }
        }
    };

    searchPane.reactToKeystroke = function (evt) {
        var search, idx, code = evt ? evt.keyCode : 0;
        switch (code) {
        case 38: // up arrow
            if (!scriptFocus || !selection) {return; }
            idx = blocksList.indexOf(selection) - 1;
            if (idx < 0) {
                idx = blocksList.length - 1;
            }
            selection = blocksList[idx];
            showSelection();
            return;
        case 40: // down arrow
            if (!scriptFocus || !selection) {return; }
            idx = blocksList.indexOf(selection) + 1;
            if (idx >= blocksList.length) {
                idx = 0;
            }
            selection = blocksList[idx];
            showSelection();
            return;
        default:
            search = searchBar.getValue();
            if (search !== oldSearch) {
                oldSearch = search;
                show(myself.blocksMatching(
                    search,
                    search.length < 2,
                    types,
                    varNames
                ));
            }
        }
    };

    searchBar.cancel = function () {
        ide.refreshPalette();
        ide.palette.adjustScrollBars();
    };

    ide.fixLayout('refreshPalette');
    searchBar.edit();
    if (searchString) {searchPane.reactToKeystroke(); }
};

// SpritMorph parsing simple arithmetic expressions to reporter blocks

Sprite.prototype.reporterize = function (expressionString) {
    // highly experimental Christmas Easter Egg 2016 :-)
    var ast;

    function parseInfix(expression, operator, already) {
        // very basic diadic infix parser for arithmetic expressions
        // with strict left-to-right operator precedence (as in Smalltalk)
        // which can be overriden by - nested - parentheses.
        // assumes well-formed expressions, no graceful error handling yet.

        var inputs = ['', ''],
            idx = 0,
            ch;

        function format(value) {
            return value instanceof Array || isNaN(+value) ? value : +value;
        }

        function nested() {
            var level = 1,
                expr = '';
            while (idx < expression.length) {
                ch = expression[idx];
                idx += 1;
                switch (ch) {
                case '(':
                    level += 1;
                    break;
                case ')':
                    level -= 1;
                    if (!level) {
                        return expr;
                    }
                    break;
                }
                expr += ch;
            }
        }

        while (idx < expression.length) {
            ch = expression[idx];
            idx += 1;
            switch (ch) {
            case ' ':
                break;
            case '(':
                if (inputs[operator ? 1 : 0].length) {
                    inputs[operator ? 1 : 0] = [
                        inputs[operator ? 1 : 0],
                        parseInfix(nested())
                    ];
                } else {
                    inputs[operator ? 1 : 0] = parseInfix(nested());
                }
                break;
            case '-':
            case '+':
            case '*':
            case '/':
            case '%':
            case '=':
            case '<':
            case '>':
            case '&':
            case '|':
                if (!operator && !inputs[0].length) {
                    inputs[0] = ch;
                } else if (operator) {
                    if (!inputs[1].length) {
                        inputs[1] = ch;
                    } else {
                        return parseInfix(
                            expression.slice(idx),
                            ch,
                            [operator, already, format(inputs[1])]
                        );
                    }
                } else {
                    operator = ch;
                    already = format(inputs[0]);
                }
                break;
            default:
                inputs[operator ? 1 : 0] += ch;
            }
        }
        if (operator) {
            return [operator, already, format(inputs[1])];
        }
        return format(inputs[0]);
    }

    function blockFromAST(ast) {
        var block, selectors, monads, alias, key, sel, i, inps,
            off = 1,
            reverseDict = {};
        selectors = {
            '+': 'reportSum',
            '-': 'reportDifference',
            '*': 'reportProduct',
            '/': 'reportQuotient',
            '%': 'reportModulus',
            '=': 'reportEquals',
            '<': 'reportLessThan',
            '>': 'reportGreaterThan',
            '&': 'reportAnd',
            '|': 'reportOr',
            round: 'reportRound',
            not: 'reportNot'
        };
        monads = ['abs', 'ceiling', 'floor', 'sqrt', 'sin', 'cos', 'tan',
            'asin', 'acos', 'atan', 'ln', 'log', 'round', 'not'];
        alias = {
            ceil: 'ceiling',
            '!' : 'not'
        };
        monads.concat(['true', 'false']).forEach(function (word) {
            reverseDict[localize(word).toLowerCase()] = word;
        });
        key = alias[ast[0]] || reverseDict[ast[0].toLowerCase()] || ast[0];
        if (contains(monads, key)) { // monadic
            sel = selectors[key];
            if (sel) { // single input
                block = Sprite.prototype.blockForSelector(sel);
                inps = block.inputs();
            } else { // two inputs, first is function name
                block = Sprite.prototype.blockForSelector('reportMonadic');
                inps = block.inputs();
                inps[0].setContents([key]);
                off = 0;
            }
        } else { // diadic
            block = Sprite.prototype.blockForSelector(selectors[key]);
            inps = block.inputs();
        }
        for (i = 1; i < ast.length; i += 1) {
            if (ast[i] instanceof Array) {
                block.silentReplaceInput(inps[i - off], blockFromAST(ast[i]));
            } else if (isString(ast[i])) {
                if (contains(
                    ['true', 'false'], reverseDict[ast[i]] || ast[i])
                ) {
                    block.silentReplaceInput(
                        inps[i - off],
                        Sprite.prototype.blockForSelector(
                            (reverseDict[ast[i]] || ast[i]) === 'true' ?
                                    'reportTrue' : 'reportFalse'
                        )
                    );
                } else if (ast[i] !== '_') {
                    block.silentReplaceInput(
                        inps[i - off],
                        Sprite.prototype.variableBlock(ast[i])
                    );
                }
            } else { // number
                inps[i - off].setContents(ast[i]);
            }
        }
        block.isDraggable = true;
        block.fixLayout();
        block.fixBlockColor(null, true);
        return block;
    }

    if (expressionString.length > 100) {return null; }
    try {
        ast = parseInfix(expressionString);
        return ast instanceof Array ? blockFromAST(ast) : null;
    } catch (error) {
        return null;
    }
};

// Sprite variable management

Sprite.prototype.addVariable = function (name, isGlobal) {
    var ide = this.parentThatIsA(IDE_Morph);
    if (isGlobal) {
        this.globalVariables().addVar(name);
        if (ide) {
            ide.flushBlocksCache('variables');
        }
    } else {
        this.variables.addVar(name);
        this.blocksCache.variables = null;
    }
};

Sprite.prototype.deleteVariable = function (varName) {
    var ide = this.parentThatIsA(IDE_Morph);
    this.variables.deleteVar(varName);
    if (ide) {
        ide.flushBlocksCache('variables'); // b/c the var could be global
        ide.refreshPalette();
    }
};

// Sprite sound management

Sprite.prototype.addSound = function (audio, name) {
    this.sounds.add(new Sound(audio, name));
};

Sprite.prototype.playSound = function (name) {
    var stage = this.parentThatIsA(Stage),
        sound = detect(
            this.sounds.asArray(),
            function (s) {return s.name === name; }
        ),
        active;
    if (sound) {
        active = sound.play();
        if (stage) {
            stage.activeSounds.push(active);
            stage.activeSounds = stage.activeSounds.filter(function (aud) {
                return !aud.ended && !aud.terminated;
            });
        }
        return active;
    }
};

Sprite.prototype.reportSounds = function () {
    return this.sounds;
};

// Sprite cloning

/*
    clones are temporary, partially shallow copies of sprites that don't
    appear as icons in the corral. Clones get deleted when the red stop button
    is pressed. Shallow-copying clones' scripts and costumes makes spawning
    very fast, so they can be used for particle system simulations.
    This speed-up, however, comes at the cost of some detrimental side
    effects: Changes to a costume or a script of the original sprite are
    in some cases shared with all of its clones, however such shared changes
    are hard to predict for users and not actively propagated, so they don't
    offer any reliable feature, and will not be supported as such.
    Changes to the original sprite's scripts affect all of its clones, unless
    the script contains any custom block whose definition contains one or more
    block variables (in which case the script does get deep-copied).
    The original sprite's scripting area, costumes wardrobe or sounds jukebox
    are also not shared. therefore adding or deleting a script, sound or
    costume in the original sprite has no effect on any of its clones.
*/

Sprite.prototype.createClone = function (immediately) {
    var stage = this.parentThatIsA(Stage);
    if (stage && stage.cloneCount <= 2000) {
        this.fullCopy(true).clonify(stage, immediately);
    }
};

Sprite.prototype.clonify = function (stage, immediately) {
    var hats;
    this.parts.forEach(function (part) {
        part.clonify(stage);
    });
    stage.cloneCount += 1;
    this.cloneOriginName = this.isClone ?
            this.cloneOriginName : this.name;
    this.isClone = true;
    this.name = '';
    stage.add(this);
    hats = this.allHatBlocksFor('__clone__init__');
    hats.forEach(function (block) {
        stage.threads.startProcess(
            block,
            stage.isThreadSafe,
            null, // export result
            null, // callback
            null, // is clicked
            immediately // without yielding
            );
    });
    this.endWarp();
};

Sprite.prototype.removeClone = function () {
    if (this.isClone) {
        // this.stopTalking();
        this.parent.threads.stopAllForReceiver(this);
        this.corpsify();
        this.destroy();
        this.parent.cloneCount -= 1;
    }
};

// Sprite deleting

Sprite.prototype.corpsify = function () {
    this.isCorpse = true;
    this.version = Date.now();
};

// Sprite primitives

// Sprite message broadcasting

Sprite.prototype.allMessageNames = function () {
    var msgs = [],
        all = this.scripts.children.slice();
    this.customBlocks.forEach(function (def) {
        if (def.body) {
            all.push(def.body.expression);
        }
        def.scripts.forEach(function (scr) {
            all.push(scr);
        });
    });
    if (this.globalBlocks) {
        this.globalBlocks.forEach(function (def) {
            if (def.body) {
                all.push(def.body.expression);
            }
            def.scripts.forEach(function (scr) {
                all.push(scr);
            });
        });
    }
    all.forEach(function (script) {
        script.allChildren().forEach(function (morph) {
            var txt;
            if (morph.selector && contains(
                ['receiveMessage', 'doBroadcast', 'doBroadcastAndWait'],
                morph.selector
            )) {
                txt = morph.inputs()[0].evaluate();
                if (isString(txt) && txt !== '') {
                    if (!contains(msgs, txt)) {
                        msgs.push(txt);
                    }
                }
            }
        });
    });
    return msgs;
};

Sprite.prototype.allHatBlocksFor = function (message) {
    if (typeof message === 'number') {message = message.toString(); }
    return this.scripts.children.filter(function (morph) {
        var event;
        if (morph.selector) {
            if (morph.selector === 'receiveMessage') {
                event = morph.inputs()[0].evaluate();
                return event === message
                    || (event instanceof Array
                        && message !== '__shout__go__'
                        && message !== '__clone__init__');
            }
            if (morph.selector === 'receiveGo') {
                return message === '__shout__go__';
            }
            if (morph.selector === 'receiveOnClone') {
                return message === '__clone__init__';
            }
        }
        return false;
    });
};

Sprite.prototype.allHatBlocksForKey = function (key) {
    return this.scripts.children.filter(function (morph) {
        if (morph.selector) {
            if (morph.selector === 'receiveKey') {
                var evt = morph.inputs()[0].evaluate()[0];
                return evt === key || evt === 'any key';
            }
        }
        return false;
    });
};

Sprite.prototype.allHatBlocksForInteraction = function (interaction) {
    return this.scripts.children.filter(function (morph) {
        if (morph.selector) {
            if (morph.selector === 'receiveInteraction') {
                return morph.inputs()[0].evaluate()[0] === interaction;
            }
        }
        return false;
    });
};

Sprite.prototype.allGenericHatBlocks = function () {
    return this.scripts.children.filter(function (morph) {
        if (morph.selector) {
            return morph.selector === 'receiveCondition';
        }
        return false;
    });
};

// Sprite events

Sprite.prototype.mouseClickLeft = function () {
    return this.receiveUserInteraction('clicked');
};

Sprite.prototype.mouseEnter = function () {
    return this.receiveUserInteraction('mouse-entered');
};

Sprite.prototype.mouseDownLeft = function () {
    return this.receiveUserInteraction('pressed');
};

Sprite.prototype.receiveUserInteraction = function (interaction) {
    var stage = this.parentThatIsA(Stage),
        procs = [],
        hats;
    if (!stage) {return; } // currently dragged
    hats = this.allHatBlocksForInteraction(interaction);
    hats.forEach(function (block) {
        procs.push(stage.threads.startProcess(block, stage.isThreadSafe));
    });
    return procs;
};

Sprite.prototype.mouseDoubleClick = function () {
    if (this.isClone) {return; }
    this.edit();
};

// Sprite timer

Sprite.prototype.getTimer = function () {
    var stage = this.parentThatIsA(Stage);
    if (stage) {
        return stage.getTimer();
    }
    return 0;
};

// Sprite tempo

Sprite.prototype.getTempo = function () {
    var stage = this.parentThatIsA(Stage);
    if (stage) {
        return stage.getTempo();
    }
    return 0;
};

// Sprite last message

Sprite.prototype.getLastMessage = function () {
    var stage = this.parentThatIsA(Stage);
    if (stage) {
        return stage.getLastMessage();
    }
    return '';
};

// Sprite user prompting

Sprite.prototype.getLastAnswer = function () {
    return this.parentThatIsA(Stage).lastAnswer;
};

// Sprite mouse coordinates

Sprite.prototype.reportMouseX = function () {
    var stage = this.parentThatIsA(Stage);
    if (stage) {
        return stage.reportMouseX();
    }
    return 0;
};

Sprite.prototype.reportMouseY = function () {
    var stage = this.parentThatIsA(Stage);
    if (stage) {
        return stage.reportMouseY();
    }
    return 0;
};

// Sprite thread count (for debugging)

Sprite.prototype.reportThreadCount = function () {
    var stage = this.parentThatIsA(Stage);
    if (stage) {
        return stage.threads.processes.length;
    }
    return 0;
};

// Sprite custom blocks

Sprite.prototype.deleteAllBlockInstances = function (definition) {
    this.allBlockInstances(definition).forEach(function (each) {
        each.deleteBlock();
    });
    this.customBlocks.forEach(function (def) {
        if (def.body && def.body.expression.isCorpse) {
            def.body = null;
        }
    });
};

Sprite.prototype.allBlockInstances = function (definition) {
    var stage, objects, blocks = [], inDefinitions;
    if (definition.isGlobal) {
        stage = this.parentThatIsA(Stage);
        objects = stage.children.filter(function (morph) {
            return morph instanceof Sprite;
        });
        objects.push(stage);
        objects.forEach(function (sprite) {
            blocks = blocks.concat(sprite.allLocalBlockInstances(definition));
        });
        inDefinitions = [];
        stage.globalBlocks.forEach(function (def) {
            if (def.body) {
                def.body.expression.allChildren().forEach(function (c) {
                    if (c.definition && (c.definition === definition)) {
                        inDefinitions.push(c);
                    }
                });
            }
        });
        return blocks.concat(inDefinitions);
    }
    return this.allLocalBlockInstances(definition);
};

Sprite.prototype.allLocalBlockInstances = function (definition) {
    var inScripts, inDefinitions, inBlockEditors, inPalette, result;

    inScripts = this.scripts.allChildren().filter(function (c) {
        return c.definition && (c.definition === definition);
    });

    inDefinitions = [];
    this.customBlocks.forEach(function (def) {
        if (def.body) {
            def.body.expression.allChildren().forEach(function (c) {
                if (c.definition && (c.definition === definition)) {
                    inDefinitions.push(c);
                }
            });
        }
    });

    inBlockEditors = this.allEditorBlockInstances(definition);
    inPalette = this.paletteBlockInstance(definition);

    result = inScripts.concat(inDefinitions).concat(inBlockEditors);
    if (inPalette) {
        result.push(inPalette);
    }
    return result;
};

Sprite.prototype.allEditorBlockInstances = function (definition) {
    var inBlockEditors = [],
        world = this.parentThatIsA(Stage).ide.world();

    if (!world) {return []; } // when copying a sprite

    world.children.forEach(function (morph) {
        if (morph instanceof BlockEditorMorph) {
            morph.body.contents.allChildren().forEach(function (block) {
                if (!block.isPrototype
                        && !(block instanceof PrototypeHatBlockMorph)
                        && (block.definition === definition)) {
                    inBlockEditors.push(block);
                }
            });
        }
    });
    return inBlockEditors;
};


Sprite.prototype.paletteBlockInstance = function (definition) {
    var ide = this.parentThatIsA(IDE_Morph);
    if (!ide) {return null; }
    return detect(
        ide.palette.contents.children,
        function (block) {
            return block.definition === definition;
        }
    );
};

Sprite.prototype.usesBlockInstance = function (
    definition,
    forRemoval, // optional bool
    skipGlobals, // optional bool
    skipBlocks // optional array with ignorable definitions
) {
    var inDefinitions,
        inScripts = detect(
            this.scripts.allChildren(),
            function (c) {
                return c.definition && (c.definition === definition);
            }
        );

    if (inScripts) {return true; }

    if (definition.isGlobal && !skipGlobals) {
        inDefinitions = [];
        this.parentThatIsA(Stage).globalBlocks.forEach(
            function (def) {
                if (forRemoval && (definition === def)) {return; }
                if (skipBlocks && contains(skipBlocks, def)) {return; }
                if (def.body) {
                    def.body.expression.allChildren().forEach(function (c) {
                        if (c.definition && (c.definition === definition)) {
                            inDefinitions.push(c);
                        }
                    });
                }
            }
        );
        if (inDefinitions.length > 0) {return true; }
    }

    inDefinitions = [];
    this.customBlocks.forEach(function (def) {
        if (def.body) {
            def.body.expression.allChildren().forEach(function (c) {
                if (c.definition && (c.definition === definition)) {
                    inDefinitions.push(c);
                }
            });
        }
    });
    return (inDefinitions.length > 0);
};

Sprite.prototype.doubleDefinitionsFor = function (definition) {
    var spec = definition.blockSpec(),
        blockList,
        idx,
        stage;

    if (definition.isGlobal) {
        stage = this.parentThatIsA(Stage);
        if (!stage) {return []; }
        blockList = stage.globalBlocks;
    } else {
        blockList = this.customBlocks;
    }
    idx = blockList.indexOf(definition);
    if (idx === -1) {return []; }
    return blockList.filter(function (def, i) {
        return def.blockSpec() === spec && (i !== idx);
    });
};

Sprite.prototype.replaceDoubleDefinitionsFor = function (definition) {
    var doubles = this.doubleDefinitionsFor(definition),
        myself = this,
        stage,
        ide;
    doubles.forEach(function (double) {
        myself.allBlockInstances(double).forEach(function (block) {
            block.definition = definition;
            block.refresh();
        });
    });
    if (definition.isGlobal) {
        stage = this.parentThatIsA(Stage);
        stage.globalBlocks = stage.globalBlocks.filter(function (def) {
            return !contains(doubles, def);
        });
    } else {
        this.customBlocks = this.customBlocks.filter(function (def) {
            return !contains(doubles, def);
        });
    }
    ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        ide.flushPaletteCache();
        ide.refreshPalette();
    }
};

// Sprite inheritance - general

Sprite.prototype.chooseExemplar = function () {
    var stage = this.parentThatIsA(Stage),
        myself = this,
        other = stage.children.filter(function (m) {
            return m instanceof Sprite &&
                (!contains(m.allExemplars(), myself));
        }),
        menu;
    menu = new MenuMorph(
        function (aSprite) {myself.setExemplar(aSprite); },
        localize('current parent') +
            ':\n' +
            (this.exemplar ? this.exemplar.name : localize('none'))
    );
    other.forEach(function (eachSprite) {
        menu.addItem(eachSprite.name, eachSprite);
    });
    menu.addLine();
    menu.addItem(localize('none'), null);
    menu.popUpAtHand(this.world());
};

Sprite.prototype.setExemplar = function (another) {
    var ide = this.parentThatIsA(IDE_Morph);
    this.exemplar = another;
    if (isNil(another)) {
        this.variables.parentFrame = (this.globalVariables());
    } else {
        this.variables.parentFrame = (another.variables);
    }
    if (ide) {
        ide.flushBlocksCache('variables');
        ide.refreshPalette();
    }
};

Sprite.prototype.allExemplars = function () {
    // including myself
    var all = [],
        current = this;
    while (!isNil(current)) {
        all.push(current);
        current = current.exemplar;
    }
    return all;
};

Sprite.prototype.specimens = function () {
    // without myself
    var myself = this;
    return this.siblings().filter(function (m) {
        return m instanceof Sprite && (m.exemplar === myself);
    });
};

Sprite.prototype.allSpecimens = function () {
    // without myself
    var myself = this;
    return this.siblings().filter(function (m) {
        return m instanceof Sprite && contains(m.allExemplars(), myself);
    });
};

// Sprite inheritance - variables

Sprite.prototype.isVariableNameInUse = function (vName, isGlobal) {
    if (isGlobal) {
        return contains(this.variables.allNames(), vName);
    }
    if (contains(this.variables.names(), vName)) {return true; }
    return contains(this.globalVariables().names(), vName);
};

Sprite.prototype.globalVariables = function () {
    var current = this.variables.parentFrame;
    while (current.owner) {
        current = current.parentFrame;
    }
    return current;
};

Sprite.prototype.shadowVar = function (name, value) {
    var ide = this.parentThatIsA(IDE_Morph);
    this.variables.addVar(name, value);
    if (ide) {
        ide.flushBlocksCache('variables');
        ide.refreshPalette();
    }
};

Sprite.prototype.inheritedVariableNames = function (shadowedOnly) {
    var names = [],
        own = this.variables.names(),
        current = this.variables.parentFrame;

    function test(each) {
        return shadowedOnly ? contains(own, each) : !contains(own, each);
    }

    while (current.owner instanceof Sprite) {
        names.push.apply(
            names,
            current.names().filter(test)
        );
        current = current.parentFrame;
    }
    return names;
};

Sprite.prototype.deletableVariableNames = function () {
    var locals = this.variables.names(),
        inherited = this.inheritedVariableNames();
    return locals.concat(
        this.globalVariables().names().filter(
            function (each) {
                return !contains(locals, each) && !contains(inherited, each);
            }
        )
    );
};

Sprite.prototype.hasSpriteVariable = function (varName) {
    return contains(this.variables.names(), varName);
};

// Variable refactoring

Sprite.prototype.refactorVariableInstances = function (
    oldName,
    newName,
    isGlobal
) {
    if (isGlobal && this.hasSpriteVariable(oldName)) {
        return;
    }

    this.scripts.children.forEach(function (child) {
        if (child instanceof BlockMorph) {
            child.refactorVarInStack(oldName, newName);
        }
    });

};

// Sprite inheritance - custom blocks

/*
// under construction, commented out for now

Sprite.prototype.ownBlocks = function () {
    var dict = {};
    this.customBlocks.forEach(function (def) {
        dict[def.blockSpec()] = def;
    });
    return dict;
};

Sprite.prototype.allBlocks = function (valuesOnly) {
    var dict = {};
    this.allExemplars().reverse().forEach(function (sprite) {
        sprite.customBlocks.forEach(function (def) {
            dict[def.blockSpec()] = def;
        });
    });
    if (valuesOnly) {
        return Object.keys(dict).map(function (key) {return dict[key]; });
    }
    return dict;
};

Sprite.prototype.inheritedBlocks = function (valuesOnly) {
    var dict = {},
        own = Object.keys(this.ownBlocks()),
        others = this.allExemplars().reverse();
    others.pop();
    others.forEach(function (sprite) {
        sprite.customBlocks.forEach(function (def) {
            var spec = def.blockSpec();
            if (!contains(own, spec)) {
                dict[spec] = def;
            }
        });
    });
    if (valuesOnly) {
        return Object.keys(dict).map(function (key) {return dict[key]; });
    }
    return dict;
};

*/

// Sprite thumbnail

Sprite.prototype.thumbnail = function (extentPoint) {
/*
    answer a new Canvas of extentPoint dimensions containing
    my thumbnail representation keeping the originial aspect ratio
*/
    var src = this.image, // at this time sprites aren't composite morphs
        trg = newCanvas(extentPoint),
        ctx = trg.getContext('2d');

    return trg;
};

Sprite.prototype.fullThumbnail = function (extentPoint) {
    // containing parts and anchor symbols, if any
    var thumb = this.thumbnail(extentPoint);
    return thumb;
};

// Sprite Boolean visual representation

Sprite.prototype.booleanMorph = function (bool) {
    var sym = new BooleanSlotMorph(bool);
    sym.isStatic = true;
    sym.drawNew();
    return sym;
};

// Stage /////////////////////////////////////////////////////////

/*
    I inherit from FrameMorph and copy from Sprite.
*/

// Stage inherits from FrameMorph:

Stage.prototype = new Node();
Stage.prototype.constructor = Stage;
Stage.uber = Node.prototype;

// Stage preferences settings

Stage.prototype.dimensions = new Point(480, 360); // unscaled extent
Stage.prototype.frameRate = 0; // unscheduled per default

Stage.prototype.isCachingPrimitives
    = Sprite.prototype.isCachingPrimitives;

Stage.prototype.sliderColor
    = Sprite.prototype.sliderColor;

Stage.prototype.paletteTextColor
    = Sprite.prototype.paletteTextColor;

Stage.prototype.hiddenPrimitives = {};
Stage.prototype.codeMappings = {};
Stage.prototype.codeHeaders = {};
Stage.prototype.enableCodeMapping = false;
Stage.prototype.enableInheritance = false;
Stage.prototype.enableSublistIDs = false;

// Stage instance creation

function Stage(globals) {
    this.init(globals);
}

Stage.prototype.init = function (ide, globals) {
    this.ide = ide;

    this.name = localize('Stage');
    this.threads = new ThreadManager();
    this.variables = new VariableFrame(globals || null, this);
    this.scripts = new ScriptsMorph(this);
    this.customBlocks = [];
    this.globalBlocks = [];
    this.sounds = new List();
    this.version = Date.now(); // for observers
    this.isFastTracked = false;
    this.enableCustomHatBlocks = true;
    this.cloneCount = 0;

    this.timerStart = Date.now();
    this.tempo = 60; // bpm
    this.lastMessage = '';

    this.scale = 1; // for display modes, do not persist

    this.keysPressed = {}; // for handling keyboard events, do not persist
    this.blocksCache = {}; // not to be serialized (!)
    this.paletteCache = {}; // not to be serialized (!)
    this.lastAnswer = ''; // last user input, do not persist
    this.activeSounds = []; // do not persist

    this.trailsCanvas = null;
    this.isThreadSafe = false;

    Stage.uber.init.call(this);

    this.acceptsDrops = false;
};

// Stage timer

Stage.prototype.resetTimer = function () {
    this.timerStart = Date.now();
};

Stage.prototype.getTimer = function () {
    var elapsed = Math.floor((Date.now() - this.timerStart) / 100);
    return elapsed / 10;
};

// Stage tempo

Stage.prototype.setTempo = function (bpm) {
    this.tempo = Math.max(20, (+bpm || 0));
};

Stage.prototype.changeTempo = function (delta) {
    this.setTempo(this.getTempo() + (+delta || 0));
};

Stage.prototype.getTempo = function () {
    return +this.tempo;
};

// Stage messages

Stage.prototype.getLastMessage = function () {
    return this.lastMessage || '';
};

// Stage stepping

Stage.prototype.step = function () {
    var current, elapsed, leftover, ide, world = this.world();

    // handle keyboard events
    if (world.keyboardReceiver === null) {
        world.keyboardReceiver = this;
    }
    if (world.currentKey === null) {
        this.keyPressed = null;
    }

    // manage threads
    if (this.enableCustomHatBlocks) {
        this.stepGenericConditions();
    }
    if (this.isFastTracked && this.threads.processes.length) {
        this.children.forEach(function (morph) {
            if (morph instanceof Sprite) {
                morph.wasWarped = morph.isWarped;
                if (!morph.isWarped) {
                    morph.startWarp();
                }
            }
        });
        while ((Date.now() - this.lastTime) < 100) {
            this.threads.step();
        }
        this.children.forEach(function (morph) {
            if (morph instanceof Sprite) {
                if (!morph.wasWarped) {
                    morph.endWarp();
                }
            }
        });
        this.changed();
    } else {
        this.threads.step();

        // single-stepping hook:
        if (this.threads.wantsToPause) {
            ide = this.parentThatIsA(IDE_Morph);
            if (ide) {
                ide.controlBar.pauseButton.refresh();
            }
        }
    }
};

Stage.prototype.stepGenericConditions = function (stopAll) {
    var hats = [],
        myself = this,
        ide;
    this.children.concat(this).forEach(function (morph) {
        if (morph instanceof Sprite || morph instanceof Stage) {
            hats = hats.concat(morph.allGenericHatBlocks());
        }
    });
    if (!hats.length) {
        this.enableCustomHatBlocks = false;
        ide = this.parentThatIsA(IDE_Morph);
        if (ide) {
            ide.controlBar.stopButton.refresh();
        }
        return;
    }
    hats.forEach(function (block) {
        myself.threads.doWhen(block, stopAll);
    });
};

Stage.prototype.fireGreenFlagEvent = function () {
    var procs = [],
        hats = [],
        ide = this.parentThatIsA(IDE_Morph),
        myself = this;

    this.children.concat(this).forEach(function (morph) {
        if (isSnapObject(morph)) {
            hats = hats.concat(morph.allHatBlocksFor('__shout__go__'));
        }
    });
    hats.forEach(function (block) {
        procs.push(myself.threads.startProcess(
            block,
            myself.isThreadSafe
        ));
    });
    if (ide) {
        ide.controlBar.pauseButton.refresh();
    }
    return procs;
};

Stage.prototype.fireStopAllEvent = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    this.threads.resumeAll(this.stage);
    this.keysPressed = {};
    this.threads.stopAll();
    this.stopAllActiveSounds();
    this.children.forEach(function (morph) {
        if (morph.stopTalking) {
            morph.stopTalking();
        }
    });
    if (ide) {
        ide.nextSteps([
            nop,
            function () {ide.controlBar.pauseButton.refresh(); }
        ]);
    }
};

Stage.prototype.editScripts = function () {
    var ide = this.parentThatIsA(IDE_Morph),
        scripts,
        sorted;
    if (ide.isAppMode || !ScriptsMorph.prototype.enableKeyboard) {return; }
    scripts = this.parentThatIsA(IDE_Morph).currentSprite.scripts;
    scripts.edit(scripts.position());
    sorted = scripts.focus.sortedScripts();
    if (sorted.length) {
        scripts.focus.element = sorted[0];
        if (scripts.focus.element instanceof HatBlockMorph) {
            scripts.focus.nextCommand();
        }
    } else {
        scripts.focus.moveBy(new Point(50, 50));
    }
    scripts.focus.fixLayout();
};

// Stage block templates

Stage.prototype.blockTemplates = function (category) {
    var blocks = [], myself = this, varNames, button,
        cat = category || 'motion', txt,
        world = this.ide.world;

    function block(selector) {
        if (myself.hiddenPrimitives[selector]) {
            return null;
        }
        var newBlock = Sprite.prototype.blockForSelector(selector, true);
        newBlock.isTemplate = true;
        return newBlock;
    }

    function variableBlock(varName) {
        var newBlock = Sprite.prototype.variableBlock(varName);
        newBlock.isDraggable = false;
        newBlock.isTemplate = true;
        return newBlock;
    }

    function addVar(pair) {
        if (pair) {
            if (myself.isVariableNameInUse(pair[0])) {
                myself.inform('that name is already in use');
            } else {
                myself.addVariable(pair[0], pair[1]);
                myself.blocksCache[cat] = null;
                myself.paletteCache[cat] = null;
                myself.parentThatIsA(IDE_Morph).refreshPalette();
            }
        }
    }

    if (cat === 'motion') {

        txt = new TextMorph(localize(
            'Stage selected:\nno motion primitives'
        ));
        txt.fontSize = 9;
        txt.setColor(this.paletteTextColor);
        blocks.push(txt);

    } else if (cat === 'looks') {

        blocks.push(block('doSwitchToCostume'));
        blocks.push(block('doWearNextCostume'));
        blocks.push(block('getCostumeIdx'));
        blocks.push('-');
        blocks.push(block('changeEffect'));
        blocks.push(block('setEffect'));
        blocks.push(block('clearEffects'));
        blocks.push('-');
        blocks.push(block('show'));
        blocks.push(block('hide'));

    // for debugging: ///////////////

        if (world.isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportCostumes'));
            blocks.push('-');
            blocks.push(block('log'));
            blocks.push(block('alert'));
            blocks.push('-');
            blocks.push(block('doScreenshot'));
        }

    /////////////////////////////////

    } else if (cat === 'sound') {

        blocks.push(block('playSound'));
        blocks.push(block('doPlaySoundUntilDone'));
        blocks.push(block('doStopAllSounds'));
        blocks.push('-');
        blocks.push(block('doRest'));
        blocks.push('-');
        blocks.push(block('doPlayNote'));
        blocks.push('-');
        blocks.push(block('doChangeTempo'));
        blocks.push(block('doSetTempo'));
        blocks.push(block('getTempo'));

    // for debugging: ///////////////

        if (world.isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportSounds'));
        }

    } else if (cat === 'pen') {

        blocks.push(block('clear'));

    } else if (cat === 'control') {

        blocks.push(block('receiveGo'));
        blocks.push(block('receiveKey'));
        blocks.push(block('receiveInteraction'));
        blocks.push(block('receiveCondition'));
        blocks.push(block('receiveMessage'));
        blocks.push('-');
        blocks.push(block('doBroadcast'));
        blocks.push(block('doBroadcastAndWait'));
        blocks.push(block('getLastMessage'));
        blocks.push('-');
        blocks.push(block('doWarp'));
        blocks.push('-');
        blocks.push(block('doWait'));
        blocks.push(block('doWaitUntil'));
        blocks.push('-');
        blocks.push(block('doForever'));
        blocks.push(block('doRepeat'));
        blocks.push(block('doUntil'));
        blocks.push('-');
        blocks.push(block('doIf'));
        blocks.push(block('doIfElse'));
        blocks.push('-');
        blocks.push(block('doReport'));
        blocks.push('-');
    /*
    // old STOP variants, migrated to a newer version, now redundant
        blocks.push(block('doStopBlock'));
        blocks.push(block('doStop'));
        blocks.push(block('doStopAll'));
    */
        blocks.push(block('doStopThis'));
        blocks.push(block('doStopOthers'));
        blocks.push('-');
        blocks.push(block('doRun'));
        blocks.push(block('fork'));
        blocks.push(block('evaluate'));
        blocks.push('-');
    /*
    // list variants commented out for now (redundant)
        blocks.push(block('doRunWithInputList'));
        blocks.push(block('forkWithInputList'));
        blocks.push(block('evaluateWithInputList'));
        blocks.push('-');
    */
        blocks.push(block('doCallCC'));
        blocks.push(block('reportCallCC'));
        blocks.push('-');
        blocks.push(block('createClone'));
        blocks.push('-');
        blocks.push(block('doPauseAll'));

    } else if (cat === 'sensing') {

        blocks.push(block('doAsk'));
        blocks.push(block('getLastAnswer'));
        blocks.push('-');
        blocks.push(block('reportMouseX'));
        blocks.push(block('reportMouseY'));
        blocks.push(block('reportMouseDown'));
        blocks.push('-');
        blocks.push(block('reportKeyPressed'));
        blocks.push('-');
        blocks.push(block('doResetTimer'));
        blocks.push(block('getTimer'));
        blocks.push('-');
        blocks.push(block('reportAttributeOf'));

        if (Sprite.prototype.enableFirstClass) {
            blocks.push(block('reportGet'));
        }
        blocks.push('-');

        blocks.push(block('reportURL'));
        blocks.push('-');
        blocks.push(block('reportIsFastTracking'));
        blocks.push(block('doSetFastTracking'));
        blocks.push('-');
        blocks.push(block('reportDate'));

    // for debugging: ///////////////

        if (world.isDevMode) {

            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportThreadCount'));
            blocks.push(block('colorFiltered'));
            blocks.push(block('reportStackSize'));
            blocks.push(block('reportFrameCount'));
        }

    /////////////////////////////////

    } else if (cat === 'operators') {

        blocks.push(block('reifyScript'));
        blocks.push(block('reifyReporter'));
        blocks.push(block('reifyPredicate'));
        blocks.push('#');
        blocks.push('-');
        blocks.push(block('reportSum'));
        blocks.push(block('reportDifference'));
        blocks.push(block('reportProduct'));
        blocks.push(block('reportQuotient'));
        blocks.push('-');
        blocks.push(block('reportModulus'));
        blocks.push(block('reportRound'));
        blocks.push(block('reportMonadic'));
        blocks.push(block('reportRandom'));
        blocks.push('-');
        blocks.push(block('reportLessThan'));
        blocks.push(block('reportEquals'));
        blocks.push(block('reportGreaterThan'));
        blocks.push('-');
        blocks.push(block('reportAnd'));
        blocks.push(block('reportOr'));
        blocks.push(block('reportNot'));
        blocks.push(block('reportBoolean'));
        blocks.push('-');
        blocks.push(block('reportJoinWords'));
        blocks.push(block('reportTextSplit'));
        blocks.push(block('reportLetter'));
        blocks.push(block('reportStringSize'));
        blocks.push('-');
        blocks.push(block('reportUnicode'));
        blocks.push(block('reportUnicodeAsLetter'));
        blocks.push('-');
        blocks.push(block('reportIsA'));
        blocks.push(block('reportIsIdentical'));

        if (true) { // (Process.prototype.enableJS) {
            blocks.push('-');
            blocks.push(block('reportJSFunction'));
        }

    // for debugging: ///////////////

        if (world.isDevMode) {
            blocks.push('-');
            txt = new TextMorph(
                'development mode \ndebugging primitives:'
            );
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportTypeOf'));
            blocks.push(block('reportTextFunction'));
        }

    //////////////////////////////////

    } else if (cat === 'variables') {

        button = new PushButtonMorph(
            null,
            function () {
                new VariableDialogMorph(
                    null,
                    addVar,
                    myself
                ).prompt(
                    'Variable name',
                    null,
                    myself.world()
                );
            },
            'Make a variable'
        );
        blocks.push(button);

        if (this.variables.allNames().length > 0) {
            button = new PushButtonMorph(
                null,
                function () {
                    var menu = new MenuMorph(
                        myself.deleteVariable,
                        null,
                        myself
                    );
                    myself.variables.allNames().forEach(function (name) {
                        menu.addItem(name, name);
                    });
                    menu.popUpAtHand(myself.world());
                },
                'Delete a variable'
            );
            blocks.push(button);
        }

        blocks.push('-');

        varNames = this.variables.allNames();
        if (varNames.length > 0) {
            varNames.forEach(function (name) {
                blocks.push(variableBlock(name));
            });
            blocks.push('-');
        }

        blocks.push(block('doSetVar'));
        blocks.push(block('doChangeVar'));
        blocks.push(block('doShowVar'));
        blocks.push(block('doHideVar'));
        blocks.push(block('doDeclareVariables'));
        blocks.push('=');
        blocks.push(block('reportNewList'));
        blocks.push('-');
        blocks.push(block('reportCONS'));
        blocks.push(block('reportListItem'));
        blocks.push(block('reportCDR'));
        blocks.push('-');
        blocks.push(block('reportListLength'));
        blocks.push(block('reportListContainsItem'));
        blocks.push('-');
        blocks.push(block('doAddToList'));
        blocks.push(block('doDeleteFromList'));
        blocks.push(block('doInsertInList'));
        blocks.push(block('doReplaceInList'));

    // for debugging: ///////////////

        if (world.isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportMap'));
            blocks.push('-');
            blocks.push(block('doForEach'));
            blocks.push(block('doShowTable'));
        }

    /////////////////////////////////

        blocks.push('=');

        if (Stage.prototype.enableCodeMapping) {
            blocks.push(block('doMapCodeOrHeader'));
            blocks.push(block('doMapValueCode'));
            blocks.push(block('doMapListCode'));
            blocks.push('-');
            blocks.push(block('reportMappedCode'));
            blocks.push('=');
        }

        button = new PushButtonMorph(
            null,
            function () {
                var ide = myself.parentThatIsA(IDE_Morph);
                new BlockDialogMorph(
                    null,
                    function (definition) {
                        if (definition.spec !== '') {
                            if (definition.isGlobal) {
                                myself.globalBlocks.push(definition);
                            } else {
                                myself.customBlocks.push(definition);
                            }
                            ide.flushPaletteCache();
                            ide.refreshPalette();
                            new BlockEditorMorph(definition, myself).popUp();
                        }
                    },
                    myself
                ).prompt(
                    'Make a block',
                    null,
                    myself.world()
                );
            },
            'Make a block'
        );
        blocks.push(button);
    }
    return blocks;
};

// Stage thumbnail

Stage.prototype.thumbnail = function (extentPoint, excludedSprite) {
/*
    answer a new Canvas of extentPoint dimensions containing
    my thumbnail representation keeping the originial aspect ratio
*/
    var myself = this,
        src = this.image,
        scale = Math.min(
            (extentPoint.x / src.width),
            (extentPoint.y / src.height)
        ),
        trg = newCanvas(extentPoint),
        ctx = trg.getContext('2d'),
        fb,
        fimg;

    ctx.scale(scale, scale);
    ctx.drawImage(
        src,
        0,
        0
    );
    ctx.drawImage(
        this.penTrails(),
        0,
        0,
        this.dimensions.x * this.scale,
        this.dimensions.y * this.scale
    );
    this.children.forEach(function (morph) {
        if (morph.isVisible && (morph !== excludedSprite)) {
            fb = morph.fullBounds();
            fimg = morph.fullImage();
            if (fimg.width && fimg.height) {
                ctx.drawImage(
                    morph.fullImage(),
                    fb.origin.x - myself.bounds.origin.x,
                    fb.origin.y - myself.bounds.origin.y
                );
            }
        }
    });
    return trg;
};

// Stage pseudo-inherited behavior

Stage.prototype.categories = Sprite.prototype.categories;
Stage.prototype.blockColor = Sprite.prototype.blockColor;
Stage.prototype.paletteColor = Sprite.prototype.paletteColor;
Stage.prototype.setName = Sprite.prototype.setName;
Stage.prototype.palette = Sprite.prototype.palette;
Stage.prototype.freshPalette = Sprite.prototype.freshPalette;
Stage.prototype.blocksMatching = Sprite.prototype.blocksMatching;
Stage.prototype.searchBlocks = Sprite.prototype.searchBlocks;
Stage.prototype.reporterize = Sprite.prototype.reporterize;
Stage.prototype.addVariable = Sprite.prototype.addVariable;
Stage.prototype.deleteVariable = Sprite.prototype.deleteVariable;

// Stage block rendering

Stage.prototype.blockForSelector
    = Sprite.prototype.blockForSelector;

// Stage sound management

Stage.prototype.addSound
    = Sprite.prototype.addSound;

Stage.prototype.playSound
    = Sprite.prototype.playSound;

Stage.prototype.stopAllActiveSounds = function () {
    this.activeSounds.forEach(function (audio) {
        audio.pause();
    });
    this.activeSounds = [];
};

Stage.prototype.pauseAllActiveSounds = function () {
    this.activeSounds.forEach(function (audio) {
        audio.pause();
    });
};

Stage.prototype.resumeAllActiveSounds = function () {
    this.activeSounds.forEach(function (audio) {
        audio.play();
    });
};

Stage.prototype.reportSounds
    = Sprite.prototype.reportSounds;

Stage.prototype.getLastAnswer
    = Sprite.prototype.getLastAnswer;

Stage.prototype.reportThreadCount
    = Sprite.prototype.reportThreadCount;

// Stage message broadcasting

Stage.prototype.allMessageNames
    = Sprite.prototype.allMessageNames;

Stage.prototype.allHatBlocksFor
    = Sprite.prototype.allHatBlocksFor;

Stage.prototype.allHatBlocksForKey
    = Sprite.prototype.allHatBlocksForKey;

Stage.prototype.allHatBlocksForInteraction
    = Sprite.prototype.allHatBlocksForInteraction;

Stage.prototype.allGenericHatBlocks
    = Sprite.prototype.allGenericHatBlocks;

// Stage events

Stage.prototype.mouseClickLeft
    = Sprite.prototype.mouseClickLeft;

Stage.prototype.mouseEnter
    = Sprite.prototype.mouseEnter;

Stage.prototype.mouseLeave = function () {
    this.receiveUserInteraction('mouse-departed');
};

Stage.prototype.mouseDownLeft
    = Sprite.prototype.mouseDownLeft;

Stage.prototype.receiveUserInteraction
    = Sprite.prototype.receiveUserInteraction;

// Stage custom blocks

Stage.prototype.deleteAllBlockInstances
    = Sprite.prototype.deleteAllBlockInstances;

Stage.prototype.allBlockInstances
    = Sprite.prototype.allBlockInstances;

Stage.prototype.allLocalBlockInstances
    = Sprite.prototype.allLocalBlockInstances;

Stage.prototype.allEditorBlockInstances
    = Sprite.prototype.allEditorBlockInstances;

Stage.prototype.paletteBlockInstance
    = Sprite.prototype.paletteBlockInstance;

Stage.prototype.usesBlockInstance
    = Sprite.prototype.usesBlockInstance;

Stage.prototype.doubleDefinitionsFor
    = Sprite.prototype.doubleDefinitionsFor;

Stage.prototype.replaceDoubleDefinitionsFor
    = Sprite.prototype.replaceDoubleDefinitionsFor;

// Stage inheritance support - variables

Stage.prototype.isVariableNameInUse
    = Sprite.prototype.isVariableNameInUse;

Stage.prototype.globalVariables
    = Sprite.prototype.globalVariables;

Stage.prototype.inheritedVariableNames = function () {
    return [];
};

// Stage variable refactoring

Stage.prototype.hasSpriteVariable
    = Sprite.prototype.hasSpriteVariable;

Stage.prototype.refactorVariableInstances
    = Sprite.prototype.refactorVariableInstances;

// Sound /////////////////////////////////////////////////////////////

// Sound instance creation

function Sound(audio, name) {
    this.audio = audio; // mandatory
    this.name = name || "Sound";
}

Sound.prototype.play = function () {
    // return an instance of an audio element which can be terminated
    // externally (i.e. by the stage)
    var aud = document.createElement('audio');
    aud.src = this.audio.src;
    aud.play();
    return aud;
};

Sound.prototype.copy = function () {
    var snd = document.createElement('audio'),
        cpy;

    snd.src = this.audio.src;
    cpy = new Sound(snd, this.name ? copy(this.name) : null);
    return cpy;
};

Sound.prototype.toDataURL = function () {
    return this.audio.src;
};

// CellMorph //////////////////////////////////////////////////////////

/*
    I am a spreadsheet style cell that can display either a string,
    a Morph, a Canvas or a toString() representation of anything else.
    I can be used in variable watchers or list view element cells.
*/

// CellMorph inherits from BoxMorph:

CellMorph.prototype = new BoxMorph();
CellMorph.prototype.constructor = CellMorph;
CellMorph.uber = BoxMorph.prototype;

// CellMorph instance creation:

function CellMorph(contents, color, idx, parentCell) {
    this.init(contents, color, idx, parentCell);
}

CellMorph.prototype.init = function (contents, color, idx, parentCell) {
    this.contents = (contents === 0 ? 0
            : contents === false ? false
                    : contents || '');
    this.isEditable = isNil(idx) ? false : true;
    this.idx = idx || null; // for list watchers
    this.parentCell = parentCell || null; // for list circularity detection
    CellMorph.uber.init.call(
        this,
        SyntaxElementMorph.prototype.corner,
        1.000001, // shadow bug in Chrome,
        new Color(255, 255, 255)
    );
    this.color = color || new Color(255, 140, 0);
    this.isBig = false;
    this.version = null; // only for observing sprites
    this.drawNew();
};

// CellMorph accessing:

CellMorph.prototype.big = function () {
    this.isBig = true;
    this.changed();
    this.drawNew();
    this.changed();
};

CellMorph.prototype.normal = function () {
    this.isBig = false;
    this.changed();
    this.drawNew();
    this.changed();
};

// CellMorph circularity testing:


CellMorph.prototype.isCircular = function (list) {
    if (!this.parentCell) {return false; }
    if (list instanceof List) {
        return this.contents === list || this.parentCell.isCircular(list);
    }
    return this.parentCell.isCircular(this.contents);
};

// CellMorph layout:

CellMorph.prototype.fixLayout = function () {
    var listwatcher;
    this.changed();
    this.drawNew();
    this.changed();
    if (this.parent && this.parent.fixLayout) { // variable watcher
        this.parent.fixLayout();
    } else {
        listwatcher = this.parentThatIsA(ListWatcherMorph);
        if (listwatcher) {
            listwatcher.fixLayout();
        }
    }
};

// CellMorph drawing:

CellMorph.prototype.update = function () {
    // special case for observing sprites
    if (!isSnapObject(this.contents)) {
        return;
    }
    if (this.version !== this.contents.version) {
        this.drawNew();
    }
};

CellMorph.prototype.drawMorph = function (toggle, type) {
    var context,
        txt,
        img,
        fontSize = SyntaxElementMorph.prototype.fontSize,
        isSameList = this.contentsMorph instanceof ListWatcherMorph
                && (this.contentsMorph.list === this.contents),
        isSameTable = this.contentsMorph instanceof TableFrameMorph
                && (this.contentsMorph.tableMorph.table === this.contents);

    if (this.isBig) {
        fontSize = fontSize * 1.5;
    }

    // re-build my contents
    if (toggle || (this.contentsMorph && !isSameList && !isSameTable)) {
        this.contentsMorph.destroy();
        this.version = null;
    }

    if (toggle || (!isSameList && !isSameTable)) {
        if (this.contents instanceof Morph) {
            if (isSnapObject(this.contents)) {
                img = this.contents.thumbnail(new Point(40, 40));
                this.contentsMorph = new Morph();
                this.contentsMorph.silentSetWidth(img.width);
                this.contentsMorph.silentSetHeight(img.height);
                this.contentsMorph.image = img;
                this.version = this.contents.version;
            } else {
                this.contentsMorph = this.contents;
            }
        } else if (isString(this.contents)) {
            txt  = this.contents.length > 500 ?
                    this.contents.slice(0, 500) + '...' : this.contents;
            this.contentsMorph = new TextMorph(
                txt,
                fontSize,
                null,
                true,
                false,
                'left' // was formerly 'center', reverted b/c of code-mapping
            );
            if (this.isEditable) {
                this.contentsMorph.isEditable = true;
                this.contentsMorph.enableSelecting();
            }
            this.contentsMorph.setColor(new Color(255, 255, 255));
        } else if (typeof this.contents === 'boolean') {
            img = Sprite.prototype.booleanMorph.call(
                null,
                this.contents
            ).fullImage();
            this.contentsMorph = new Morph();
            this.contentsMorph.silentSetWidth(img.width);
            this.contentsMorph.silentSetHeight(img.height);
            this.contentsMorph.image = img;
        } else if (this.contents instanceof HTMLCanvasElement) {
            this.contentsMorph = new Morph();
            this.contentsMorph.silentSetWidth(this.contents.width);
            this.contentsMorph.silentSetHeight(this.contents.height);
            this.contentsMorph.image = this.contents;
        } else if (this.contents instanceof Context) {
            img = this.contents.image();
            this.contentsMorph = new Morph();
            this.contentsMorph.silentSetWidth(img.width);
            this.contentsMorph.silentSetHeight(img.height);
            this.contentsMorph.image = img;
        } else if (this.contents instanceof List) {
            if ('table' === type || (!toggle && this.contents.isTable())) {
                this.contentsMorph = new TableFrameMorph(new TableMorph(
                    this.contents,
                    10
                ));
                this.contentsMorph.expand(new Point(200, 150));
            } else {
                if (this.isCircular()) {
                    this.contentsMorph = new TextMorph(
                        '(...)',
                        fontSize,
                        null,
                        false, // bold
                        true, // italic
                        'center'
                    );
                    this.contentsMorph.setColor(new Color(255, 255, 255));
                } else {
                    this.contentsMorph = new ListWatcherMorph(
                        this.contents,
                        this
                    );
                }
            }
            this.contentsMorph.isDraggable = false;
        } else {
            this.contentsMorph = new TextMorph(
                !isNil(this.contents) ? this.contents.toString() : '',
                fontSize,
                null,
                true,
                false,
                'center'
            );
            if (this.isEditable) {
                this.contentsMorph.isEditable = true;
                this.contentsMorph.enableSelecting();
            }
            this.contentsMorph.setColor(new Color(255, 255, 255));
        }
        this.add(this.contentsMorph);
    }

    // adjust my layout
    this.silentSetHeight(this.contentsMorph.height()
        + this.edge
        + this.border * 2);
    this.silentSetWidth(Math.max(
        this.contentsMorph.width() + this.edge * 2,
        (this.contents instanceof Context ||
            this.contents instanceof List ? 0 :
                    SyntaxElementMorph.prototype.fontSize * 3.5)
    ));

    // draw my outline
    this.image = newCanvas(this.extent());
    context = this.image.getContext('2d');
    if ((this.edge === 0) && (this.border === 0)) {
        BoxMorph.uber.drawMorph.call(this);
        return null;
    }
    context.fillStyle = this.color.toString();
    context.beginPath();
    this.outlinePath(
        context,
        Math.max(this.edge - this.border, 0),
        this.border
    );
    context.closePath();
    context.fill();
    if (this.border > 0 && !MorphicPreferences.isFlat) {
        context.lineWidth = this.border;
        context.strokeStyle = this.borderColor.toString();
        context.beginPath();
        this.outlinePath(context, this.edge, this.border / 2);
        context.closePath();
        context.stroke();

        context.shadowOffsetX = this.border;
        context.shadowOffsetY = this.border;
        context.shadowBlur = this.border;
        context.shadowColor = this.color.darker(80).toString();
        this.drawShadow(context, this.edge, this.border / 2);
    }

    // position my contents
    if (toggle || (!isSameList && !isSameTable)) {
        this.contentsMorph.setCenter(this.center());
    }
};

CellMorph.prototype.drawShadow = function (context, radius, inset) {
    var offset = radius + inset,
        w = this.width(),
        h = this.height();

    // bottom left:
    context.beginPath();
    context.moveTo(0, h - offset);
    context.lineTo(0, offset);
    context.stroke();

    // top left:
    context.beginPath();
    context.arc(
        offset,
        offset,
        radius,
        radians(-180),
        radians(-90),
        false
    );
    context.stroke();

    // top right:
    context.beginPath();
    context.moveTo(offset, 0);
    context.lineTo(w - offset, 0);
    context.stroke();
};

// CellMorph editing (inside list watchers):

CellMorph.prototype.layoutChanged = function () {
    var context,
        fontSize = SyntaxElementMorph.prototype.fontSize,
        listWatcher = this.parentThatIsA(ListWatcherMorph);

    if (this.isBig) {
        fontSize = fontSize * 1.5;
    }

    // adjust my layout
    this.silentSetHeight(this.contentsMorph.height()
        + this.edge
        + this.border * 2);
    this.silentSetWidth(Math.max(
        this.contentsMorph.width() + this.edge * 2,
        (this.contents instanceof Context ||
            this.contents instanceof List ? 0 : this.height() * 2)
    ));


    // draw my outline
    this.image = newCanvas(this.extent());
    context = this.image.getContext('2d');
    if ((this.edge === 0) && (this.border === 0)) {
        BoxMorph.uber.drawMorph.call(this);
        return null;
    }
    context.fillStyle = this.color.toString();
    context.beginPath();
    this.outlinePath(
        context,
        Math.max(this.edge - this.border, 0),
        this.border
    );
    context.closePath();
    context.fill();
    if (this.border > 0 && !MorphicPreferences.isFlat) {
        context.lineWidth = this.border;
        context.strokeStyle = this.borderColor.toString();
        context.beginPath();
        this.outlinePath(context, this.edge, this.border / 2);
        context.closePath();
        context.stroke();

        context.shadowOffsetX = this.border;
        context.shadowOffsetY = this.border;
        context.shadowBlur = this.border;
        context.shadowColor = this.color.darker(80).toString();
        this.drawShadow(context, this.edge, this.border / 2);
    }

    // position my contents
    this.contentsMorph.setCenter(this.center());

    if (listWatcher) {
        listWatcher.fixLayout();
    }
};

CellMorph.prototype.reactToEdit = function (textMorph) {
    var listWatcher;
    if (!isNil(this.idx)) {
        listWatcher = this.parentThatIsA(ListWatcherMorph);
        if (listWatcher) {
            listWatcher.list.put(textMorph.text, this.idx);
        }
    }
};

CellMorph.prototype.mouseClickLeft = function (pos) {
    if (this.isEditable && this.contentsMorph instanceof TextMorph) {
        this.contentsMorph.selectAllAndEdit();
    } else {
        this.escalateEvent('mouseClickLeft', pos);
    }
};

CellMorph.prototype.mouseDoubleClick = function (pos) {
    if (List.prototype.enableTables &&
            this.currentValue instanceof List) {
        new TableDialogMorph(this.contents).popUp(this.world());
    } else {
        this.escalateEvent('mouseDoubleClick', pos);
    }
};
