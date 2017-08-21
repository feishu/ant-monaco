let processQueue = [];

export default class Event {
  constructor(type) {
    this._eventsMap = new Map();
    this._triggersMap = new Map();
  }

  addListenerEvent(event, func) {
    const methods = this._eventsMap.get(event) || [];
    methods.push(func);
    this._eventsMap.set(event, methods);
  }

  dispatchEvent(event, args) {
    const methods = this._eventsMap.get(event) || [];
    async function doPromise() {
      for (const method of methods) {
        await new Promise((resolve) => {
          resolve(method(args));
        })
      }
    }
    doPromise();
  }

  addTrigger(trigger, params, callback, cancel) {
    const { lastCancel } = this._triggersMap.get(trigger) || {};
    if (lastCancel) {
      lastCancel();
    }

    this._triggersMap.set(trigger, { callback, cancel });
    if (global.socket)
      global.socket.write(JSON.stringify({ method: trigger, params, trigger: true }));
  }

  doTrigger(trigger, args) {
    const chunks = this._triggersMap.get(trigger) || {};
    const { callback } = chunks;
    const { version, uri } = args;
    if (callback)
      callback(args);
  }

  static dispatchGlobalEvent(event, params) {
    globalEvent.dispatchEvent(event, params);
    if (params.model) {
      params.uri = params.model.uri;
      params.model = null;
    }
    if (global.socket)
      global.socket.write(JSON.stringify({
        method: event,
        params,
      }) + '\s\s\s\n');
  }

  static dispatchLocalEvent(local, event, args) {
    if (local.dispatchEvent && typeof local.dispatchEvent === 'function')
      local.dispatchEvent(event, args);
  }

  static addGlobalListenerEvent(event, func) {
    globalEvent.addListenerEvent(event, func);
  }

  static addGlobalListenerEventOnce(event, func) {
    globalEvent.addListenerEventOnce(event, func);
  }

  static addLocalListenerEvent(local, event, func) {
    if (local.addListenerEvent && typeof local.addListenerEvent === 'function')
      local.addListenerEvent(event, func);
  }

  static addGlobalTrigger(trigger, params, callback, cancel) {
    globalEvent.addTrigger(trigger, params, callback, cancel);
  }

  static doGlobalTrigger(trigger, args) {
    globalEvent.doTrigger(trigger, args);
  }
}

const globalEvent = new Event();