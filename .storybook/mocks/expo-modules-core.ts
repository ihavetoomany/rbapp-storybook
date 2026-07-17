export class EventEmitter {
  addListener() {
    return { remove: () => undefined };
  }

  removeAllListeners() {
    return;
  }

  emit() {
    return;
  }
}

export class NativeModule {}

export class SharedObject {}

export class SharedRef {}
