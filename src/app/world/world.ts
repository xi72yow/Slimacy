import {
  AnimatedSprite,
  Container,
  Rectangle,
  Resource,
  Sprite,
  Spritesheet,
  Texture,
  TextureSource,
  Ticker,
} from "pixi.js";
import ldtkData from "../../assets/world/world.ldtk.json";

import spritesheetData from "../../assets/world/world.json";
import { Character, CollisionTypes } from "app/hero/hero";

export class World extends Container {
  private hero;
  private collidingTiles: Sprite[] = [];

  constructor(hero: Character) {
    super();
    this.hero = hero;
    const texture = Texture.from("assets/world/world.png");
    const sheet = new Spritesheet(texture, spritesheetData);
    sheet.parse((textures) => {
      console.log(
        "🚀 ~ file: index.ts:28 ~ sheet.parse ~ textures:",
        textures,
        ldtkData.levels[0].layerInstances[2].gridTiles
      );

      const colision = ldtkData.levels[0].layerInstances.find(
        (layer) => layer.__type === "IntGrid"
      ).intGridCsv;

      const level = ldtkData.levels[0].layerInstances.find(
        (layer) => layer.__type === "Tiles"
      ).gridTiles;

      const levelSprites = level.map((tile, i) => {
        const piece: Sprite = new Sprite(
          textures[`world_${tile.src[1]}_${tile.src[0]}.png`]
        );
        piece.x = tile.px[0];
        piece.y = tile.px[1];
        if (colision[i] === 2) this.collidingTiles.push(piece);
        return piece;
      });

      console.log(this.collidingTiles.length);

      this.addChild(...levelSprites);
    });

    Ticker.shared.add(this.update, this);
  }

  private update(deltaTime: number): void {
    this.hero.update(deltaTime);
    this.setCollisions();
  }

  private setCollisions(): void {
    const collisions: CollisionTypes[] = [];
    for (let i = 0; i < this.collidingTiles.length; i++) {
      const tile = this.collidingTiles[i];
      const hb = this.hero.getBounds();
      const tb = tile.getBounds();

      // detect colliding edge
      const collision = this.detectCollision(hb, tb);
      if (collision !== CollisionTypes.NONE) {
        collisions.push(collision);
      }
    }
    const uniqueCollisions = collisions.filter((element, index) => {
      return collisions.indexOf(element) === index;
    });

    if (uniqueCollisions.length == 0) {
      this.hero.setCollision(CollisionTypes.NONE);
      return;
    }

    if (uniqueCollisions.length == 1) {
      if (uniqueCollisions.includes(CollisionTypes.TOP)) {
        this.hero.setCollision(CollisionTypes.TOP);
      }
      if (uniqueCollisions.includes(CollisionTypes.BOTTOM)) {
        this.hero.setCollision(CollisionTypes.BOTTOM);
      }
      if (uniqueCollisions.includes(CollisionTypes.LEFT)) {
        this.hero.setCollision(CollisionTypes.LEFT);
      }
      if (uniqueCollisions.includes(CollisionTypes.RIGHT)) {
        this.hero.setCollision(CollisionTypes.RIGHT);
      }
    } else {
      if (
        uniqueCollisions.includes(CollisionTypes.TOP) &&
        uniqueCollisions.includes(CollisionTypes.LEFT)
      ) {
        this.hero.setCollision(CollisionTypes.TOPLEFT);
      }
      if (
        uniqueCollisions.includes(CollisionTypes.TOP) &&
        uniqueCollisions.includes(CollisionTypes.RIGHT)
      ) {
        this.hero.setCollision(CollisionTypes.TOPRIGHT);
      }
      if (
        uniqueCollisions.includes(CollisionTypes.BOTTOM) &&
        uniqueCollisions.includes(CollisionTypes.LEFT)
      ) {
        this.hero.setCollision(CollisionTypes.BOTTOMLEFT);
      }
      if (
        uniqueCollisions.includes(CollisionTypes.BOTTOM) &&
        uniqueCollisions.includes(CollisionTypes.RIGHT)
      ) {
        this.hero.setCollision(CollisionTypes.BOTTOMRIGHT);
      }
    }
  }

  private multiplyVectors(a: number[], b: number[]) {
    return a.map((x: number, i: number) => x * b[i]);
  }

  private vecAbs(a: [number, number]) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
  }

  private dotVecProduct(a: [number, number], b: [number, number]) {
    const absA = this.vecAbs(a);
    const absB = this.vecAbs(b);
    const dotProduct = a[0] * b[0] + a[1] * b[1];
    return dotProduct / (absA * absB);
  }

  private detectCollision(rect1: Rectangle, rect2: Rectangle): CollisionTypes {
    const dx = rect2.x + rect2.width / 2 - (rect1.x + rect1.width / 2);
    const dy = rect2.y + rect2.height / 2 - (rect1.y + rect1.height / 2);
    const aw = (rect2.width + rect1.width) * 0.5;
    const ah = (rect2.height + rect1.height) * 0.5;

    if (Math.abs(dx) > aw || Math.abs(dy) > ah) return CollisionTypes.NONE;

    if (Math.abs(dx / rect1.width) > Math.abs(dy / rect1.height)) {
      if (dx < 0) return CollisionTypes.LEFT;
      else return CollisionTypes.RIGHT;
    } else {
      if (dy < 0) return CollisionTypes.TOP;
      else return CollisionTypes.BOTTOM;
    }
  }
}
