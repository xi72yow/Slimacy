export enum Events {
  HERO_SPEED = "hero-speed:changed",
}

function on(
  eventType: Events,
  listener: EventListenerOrEventListenerObject
): void {
  document.addEventListener(eventType, listener);
}

function off(
  eventType: Events,
  listener: EventListenerOrEventListenerObject
): void {
  document.removeEventListener(eventType, listener);
}

function once(eventType: Events, listener: (arg0: any) => void): void {
  on(eventType, handleEventOnce);

  function handleEventOnce(event: any) {
    listener(event);
    off(eventType, handleEventOnce);
  }
}

function trigger(eventType: Events, data: any): void {
  const event = new CustomEvent(eventType, { detail: data });
  document.dispatchEvent(event);
}

export { on, once, off, trigger };
