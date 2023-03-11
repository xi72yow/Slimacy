import {
  AnimatedSprite,
  Container,
  Resource,
  Spritesheet,
  Texture,
  TextureSource,
  Ticker,
} from "pixi.js";
import spritesheetData from "../../assets/hero/hero.json";

export enum CollisionTypes {
  NONE = 0,
  TOP = 1,
  TOPRIGHT = 2,
  RIGHT = 3,
  BOTTOMRIGHT = 4,
  BOTTOM = 5,
  BOTTOMLEFT = 6,
  LEFT = 7,
  TOPLEFT = 8,
  ALL = 9,
}

export class Character extends Container {
  private hero: AnimatedSprite;
  private animations = new Map<string, Texture<Resource>[]>();
  private currentAnimation: string;
  private velocityVektor = { x: 0, y: 0 };
  private speed = 1;
  private pressedKeys = new Set<string>();
  private collision = CollisionTypes.NONE;

  constructor(screenWidth: number, screenHeight: number) {
    super();

    const texture = Texture.from("assets/hero/hero.png");

    const sheet = new Spritesheet(texture, spritesheetData);

    sheet.parse((textures) => {
      console.log("🚀 ~ file: index.ts:28 ~ sheet.parse ~ textures:", textures);
      Object.keys(spritesheetData.animations).forEach((key) => {
        const animation =
          spritesheetData.animations[
            key as keyof typeof spritesheetData.animations
          ];
        const animationSprites = animation.map(
          (stringy: TextureSource | TextureSource[]) => Texture.from(stringy)
        );
        this.animations.set(key, animationSprites);
      });

      this.hero = new AnimatedSprite(this.animations.get("xi72yowslimemoveup"));
      this.currentAnimation = "xi72yowslimemoveup";
      this.hero.animationSpeed = 0.125;
      this.hero.play();
      this.hero.roundPixels = false;
      this.hero.x = screenWidth / 2;
      this.hero.y = screenHeight / 2;
      this.addChild(this.hero);
    });

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  private setVelocityVektor(xCrement: number, yCrement: number): void {
    const x = this.velocityVektor.x + xCrement;
    const y = this.velocityVektor.y + yCrement;

    if (!(x < -this.speed || x > this.speed)) {
      this.velocityVektor.x = x;
    }
    if (!(y < -this.speed || y > this.speed)) {
      this.velocityVektor.y = y;
    }
  }

  private setCurrentAnimation(name: string): void {
    if (name && this.currentAnimation !== name) {
      this.currentAnimation = name;
      this.hero.textures = this.animations.get(name);
      this.hero.play();
    }
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.pressedKeys.add(e.code);
    switch (e.code) {
      case "KeyW":
        this.setVelocityVektor(0, -this.speed);
        break;

      case "KeyA":
        this.setVelocityVektor(-this.speed, 0);
        break;

      case "KeyS":
        this.setVelocityVektor(0, this.speed);
        break;

      case "KeyD":
        this.setVelocityVektor(this.speed, 0);
        break;

      default:
        break;
    }

    if (this.pressedKeys.has("KeyW") && this.pressedKeys.has("KeyS")) {
      this.velocityVektor.y = 0;
    }

    if (this.pressedKeys.has("KeyA") && this.pressedKeys.has("KeyD")) {
      this.velocityVektor.x = 0;
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.pressedKeys.delete(e.code);
    switch (e.code) {
      case "KeyW":
        this.setVelocityVektor(0, this.speed);
        break;

      case "KeyA":
        this.setVelocityVektor(this.speed, 0);
        break;

      case "KeyS":
        this.setVelocityVektor(0, -this.speed);
        break;

      case "KeyD":
        this.setVelocityVektor(-this.speed, 0);
        break;

      default:
        break;
    }
  }

  private velocityNormalization(): { x: number; y: number } {
    const x = this.velocityVektor.x;
    const y = this.velocityVektor.y;
    const length = Math.sqrt(x * x + y * y);
    if (length > 0) {
      return { x: x / length, y: y / length };
    }
    return { x, y };
  }

  private getMovementDirection(): string {
    const x = this.velocityVektor.x;
    const y = this.velocityVektor.y;

    /*   if (x === 0 && y === 0) {
      return "xi72yowslimemoveup";
    } */

    if (x > 0) {
      return "xi72yowslimemoveright";
    }

    if (x < 0) {
      return "xi72yowslimemoveleft";
    }

    if (y > 0) {
      return "xi72yowslimemovedown";
    }

    if (y < 0) {
      return "xi72yowslimemoveup";
    }
  }

  public update(deltaTime: number): void {
    const normalizedVelocity = this.velocityNormalization();
    const movementDirection = this.getMovementDirection();
    this.setCurrentAnimation(movementDirection);

    const xDirection = normalizedVelocity.x;
    const yDirection = normalizedVelocity.y;

    switch (this.collision) {
      case CollisionTypes.TOP:
        this.hero.y += this.speed;
        break;

      case CollisionTypes.RIGHT:
        this.hero.x -= this.speed;
        break;
      case CollisionTypes.BOTTOM:
        this.hero.y -= this.speed;
        break;
      case CollisionTypes.LEFT:
        this.hero.x += this.speed;
        break;
      case CollisionTypes.TOPLEFT:
        this.hero.y += this.speed;
        this.hero.x += this.speed;
        break;
      case CollisionTypes.TOPRIGHT:
        this.hero.y += this.speed;
        this.hero.x -= this.speed;
        break;
      case CollisionTypes.BOTTOMLEFT:
        this.hero.y -= this.speed;
        this.hero.x += this.speed;
        break;
      case CollisionTypes.BOTTOMRIGHT:
        this.hero.y -= this.speed;
        this.hero.x -= this.speed;
        break;

      case CollisionTypes.NONE:
        break;

      default:
        break;
    }
    this.hero.x = this.hero.x + xDirection * deltaTime;
    this.hero.y = this.hero.y + yDirection * deltaTime;
  }

  public setCollision(collision: CollisionTypes): void {
    this.collision = collision;
  }
}
