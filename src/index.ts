import { Application, Loader } from "pixi.js";
import * as PIXI from "pixi.js";
import { Character } from "./app/hero/hero";
import { World } from "./app/world/world";

import { generateGenericAtlas } from "app/utils/utils";
console.log(generateGenericAtlas(4, 4, 16, 16, "world"));

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const gameParam = {
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  width: 160,
  height: 90,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x6495ed,
  scale: 3,
};

const app = new Application(gameParam);

const character = new Character(gameParam.width, gameParam.height);

const world = new World(character);

app.stage.addChild(world);

app.stage.addChild(character);

function resizeGame() {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const newGameWidth = viewport.width;
  const newGameHeight = (newGameWidth * gameParam.height) / gameParam.width;

  app.renderer.resize(newGameWidth, newGameHeight);
  app.stage.scale.set(gameParam.scale, gameParam.scale);
}

window.addEventListener("resize", resizeGame);

resizeGame();
