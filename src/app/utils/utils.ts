type Atlas = {
  [key: string]: { [key: string]: unknown };
};

export function generateGenericAtlas(
  rows: number,
  cols: number,
  width: number,
  height: number,
  textureName: string
): Atlas {
  const atlas: Atlas = {};
  atlas["frames"] = {};
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      atlas["frames"][`${textureName}_${i * width}_${j * height}.png`] = {
        frame: {
          x: j * width,
          y: i * height,
          w: width,
          h: height,
        },
        rotated: false,
        trimmed: false,
        spriteSourceSize: {
          x: 0,
          y: 0,
          w: width,
          h: height,
        },
        sourceSize: {
          w: width,
          h: height,
        },
        pivot: {
          x: 0.5,
          y: 0.5,
        },
      };
    }
    atlas["meta"] = {
      app: "slimacy-utils",
      version: "1.0",
      image: `${textureName}.png`,
      format: "RGBA8888",
      size: {
        w: width * cols,
        h: height * rows,
      },
      scale: "1",
      smartupdate: "",
    };
  }
  return atlas;
}
