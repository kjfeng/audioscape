"use strict";

var GuiConfig = GuiConfig || {

};

GuiConfig.imageNames = [
  'flower.jpg',
  'goldengate.jpg',
  'leaves.jpg',
  'woman.jpg',
  'man.jpg',
  'town.jpg',
  'mesa.jpg',
  'doge.jpg',
];

var sampleDropdownOptions = ['point', 'bilinear', 'gaussian'];
var morphLinesDropdownOptions = ['marker.json'];

GuiConfig.onInit = function() {
  // starter image, if none loaded from url
  if (Gui.historyFilters.length === 0) {
    Gui.addHistoryEntry(Gui.filterDefs[0], [GuiConfig.imageNames[0]]);
  }
};

// NOTE(drew): filter names must correspond to names of filter functions unless funcName is supplied
GuiConfig.filterDefs = [
  // GENERAL
  {
    name: "Push Image",
    folderName: undefined,
    notFilter: true,
    pushImage: true,
    paramDefs: [
      {
        name: "image name",
        defaultVal: GuiConfig.imageNames[0],
        dropdownOptions: GuiConfig.imageNames,
      },
    ]
  },
  {
    name: "Batch Mode",
    notFilter: true,
    folderName: undefined,
    applyFunc: function() {
      // TODO put url stuff here
      window.open("batch.html?" + Gui.getUrl());
    },
    paramDefs: [
    ]
  },

  // SETPIXEL OPERATIONS
  {
    name: "Fill",
    folderName: undefined,
    paramDefs: [
      {
        name: "color",
        defaultVal: [0, 0, 0],
        isColor: true,
      },
    ]
  },
  {
    name: "Brush",
    folderName: undefined,
    paramDefs: [
      {
        name: "radius",
        defaultVal: 10,
        sliderRange: [1, 100],
        isFloat: false,
      },
      {
        name: "color",
        defaultVal: [255, 255, 255],
        isColor: true,
      },
      {
        name: "verts",
        defaultVal: "",
        isString: true,
      },
    ]
  },
  {
    name: "Soft Brush",
    folderName: undefined,
    funcName: "softBrushFilter",
    paramDefs: [
      {
        name: "radius",
        defaultVal: 10,
        sliderRange: [1, 100],
        isFloat: false,
      },
      {
        name: "color",
        defaultVal: [255, 255, 255],
        isColor: true,
      },
      {
        name: "alpha at center",
        defaultVal: 1.0,
        sliderRange: [0, 1.0],
        isFloat: true,
      },
      {
        name: "verts",
        defaultVal: "",
        isString: true,
      },
    ]
  },

  {
    name: "CustomFilter",
    funcName: "customFilter",
    folderName: undefined,
    canAnimate: true,
    paramDefs: [
      {
        name: "input value",
        defaultVal: 0.5,
        sliderRange: [0, 1],
        isFloat: true,
      },
    ]
  },

];
