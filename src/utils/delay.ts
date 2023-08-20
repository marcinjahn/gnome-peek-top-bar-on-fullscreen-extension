import Glib from "@gi-ts/glib2";

let timeoutSourceIds: number[] | null = [];

export function delay(milliseconds: number) {
  return new Promise((resolve) => {
    const timeoutId = Glib.timeout_add(
      Glib.PRIORITY_DEFAULT,
      milliseconds,
      () => {
        removeFinishedTimeoutId(timeoutId);
        resolve(undefined);

        return Glib.SOURCE_REMOVE;
      }
    );

    if (!timeoutSourceIds) {
      timeoutSourceIds = [];
    }
    timeoutSourceIds.push(timeoutId);
  });
}

function removeFinishedTimeoutId(timeoutId: number) {
  timeoutSourceIds?.splice(timeoutSourceIds.indexOf(timeoutId), 1);
}

export function disposeDelayTimeouts() {
  timeoutSourceIds?.forEach((sourceId) => {
    Glib.Source.remove(sourceId);
  });

  timeoutSourceIds = null;
}
