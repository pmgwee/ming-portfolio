type WheelInput = Pick<WheelEvent, "deltaX" | "deltaY" | "deltaMode">;

/** One intentional wheel/trackpad gesture becomes one gallery step. The
 * closure survives image changes so a momentum tail cannot skip more photos.
 * Time is supplied by the caller, keeping device normalization testable.
 */
export function createGalleryWheelStepper() {
  let lastEventAt = -Infinity;
  let lockedUntil = 0;
  let accumulated = 0;
  let direction = 0;
  let consumed = false;

  return ({ deltaX, deltaY, deltaMode }: WheelInput, now: number): -1 | 0 | 1 => {
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
    if (!Number.isFinite(delta) || delta === 0) return 0;
    if (now - lastEventAt > 160) {
      accumulated = 0;
      consumed = false;
    }
    lastEventAt = now;
    if (consumed || now < lockedUntil) return 0;

    const sign = delta > 0 ? 1 : -1;
    if (sign !== direction) accumulated = 0;
    direction = sign;
    const unit = deltaMode === 1 ? 16 : deltaMode === 2 ? 800 : 1;
    accumulated += sign * Math.min(Math.abs(delta) * unit, 120);
    if (Math.abs(accumulated) < 40) return 0;

    consumed = true;
    lockedUntil = now + 480;
    accumulated = 0;
    return sign;
  };
}
