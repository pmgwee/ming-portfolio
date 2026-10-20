import assert from "node:assert/strict";
import { test } from "node:test";
import { createGalleryWheelStepper } from "../src/lib/gallery-wheel.ts";

const wheel = (deltaY, deltaX = 0, deltaMode = 0) => ({ deltaX, deltaY, deltaMode });

test("mouse wheel advances and reverses after the transition", () => {
  const step = createGalleryWheelStepper();
  assert.equal(step(wheel(120), 0), 1);
  assert.equal(step(wheel(-120), 600), -1);
});

test("trackpad movement accumulates into a deliberate step", () => {
  const step = createGalleryWheelStepper();
  assert.equal(step(wheel(12), 0), 0);
  assert.equal(step(wheel(8), 16), 0);
  assert.equal(step(wheel(20), 32), 1);
});

test("horizontal trackpad gestures use their dominant axis", () => {
  const step = createGalleryWheelStepper();
  assert.equal(step(wheel(8, -70), 0), -1);
  assert.equal(step(wheel(-8, 70), 600), 1);
});

test("momentum never advances again within one continuous gesture", () => {
  const step = createGalleryWheelStepper();
  assert.equal(step(wheel(80), 0), 1);
  for (let time = 60; time <= 1800; time += 60) assert.equal(step(wheel(60), time), 0);
  assert.equal(step(wheel(80), 2100), 1);
});

test("a separate gesture cannot interrupt the 3D transition", () => {
  const step = createGalleryWheelStepper();
  assert.equal(step(wheel(120), 0), 1);
  assert.equal(step(wheel(-120), 200), 0);
  assert.equal(step(wheel(-120), 400), 0);
  assert.equal(step(wheel(-120), 600), -1);
});

test("reversing direction discards movement in the old direction", () => {
  const step = createGalleryWheelStepper();
  assert.equal(step(wheel(30), 0), 0);
  assert.equal(step(wheel(-20), 16), 0);
  assert.equal(step(wheel(-20), 32), -1);
});

test("small movements from separate gestures do not accumulate", () => {
  const step = createGalleryWheelStepper();
  assert.equal(step(wheel(30), 0), 0);
  assert.equal(step(wheel(30), 200), 0);
  assert.equal(step(wheel(40), 400), 1);
});

test("line and page wheel units work alongside pixel input", () => {
  assert.equal(createGalleryWheelStepper()(wheel(3, 0, 1), 0), 1);
  assert.equal(createGalleryWheelStepper()(wheel(-1, 0, 2), 0), -1);
});

test("zero and invalid movement cannot navigate", () => {
  const step = createGalleryWheelStepper();
  assert.equal(step(wheel(0), 0), 0);
  assert.equal(step(wheel(Infinity), 16), 0);
  assert.equal(step(wheel(NaN), 32), 0);
});
