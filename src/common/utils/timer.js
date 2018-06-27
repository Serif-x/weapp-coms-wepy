/*
 * Timer
 */

'use strict'

const log = (level, debug, ...args) => {
  if (!debug) {
    return
  }
  console[level](...args)
}

const TIMER_STATUS = {
  STARTED: 'started',
  STOPPED: 'stopped',
  PAUSED: 'paused',
  TIMEOUT: 'timeout'
}

export default class Timer {
  constructor (options = {}) {
    this.settings = {
      tickTimes: 0, // int
      delay: 1000, // ms
      name: '',
      debug: true,
      onBeforeStart () {},
      onProcess (timeLeft) {},
      onTimeout () {}
    }

    for (let p in options) {
      if (options.hasOwnProperty(p)) {
        this.settings[p] = options[p]
      }
    }

    // Init
    this.name = this.settings.name
    this.tickTimes = ~~this.settings.tickTimes
    this.currentTick = this.tickTimes
    this.timer = null
    this.status = null

    const debug = this.settings.debug

    const that = this

    this.processor = function () {
      const self = that

      if (self.timer) {
        clearTimeout(self.timer)
      }

      if (self.settings.onBeforeStart) {
        self.settings.onBeforeStart.call(self)
      }

      log('warn', debug, `→ Timer [${self.name}] started.`)

      return function _process () {
        clearTimeout(self.timer) // clear last timer

        // If timer is stopped manually
        // don't execute callback
        // if (!self.timer) {
        //   return;
        // }

        if (self.settings.onProcess) {
          self.settings.onProcess.call(self, self.currentTick)
        }

        if (self.currentTick <= 0) {
          // clearTimeout(self.timer)
          self.timer = null
          self.status = TIMER_STATUS.TIMEOUT
          log('warn', debug, '→ Timer [' + self.settings.name + '] timeout.')

          if (self.settings.onTimeout) {
            self.settings.onTimeout.call(self)
          }

          return
        }

        self.currentTick--
        self.timer = setTimeout(_process, self.settings.delay || 1000)
        self.status = TIMER_STATUS.STARTED
      }
    }
  }

  STATUS = TIMER_STATUS

  start () {
    this.currentTick = this.tickTimes
    this.processor()()
    // log('warn', debug, `→ Timer [${this.name}] started.`)
  }

  stop () {
    clearTimeout(this.timer)

    this.timer = null
    this.currentTick = 0
    this.status = TIMER_STATUS.STOPPED
    log('warn', this.settings.debug, `→ Timer [${this.name}] stopped.`)
  }

  restart () {
    this.stop()
    this.start()
    log('warn', this.settings.debug, `→ Timer [${this.name}] restarted.`)
  }

  pause () {
    clearTimeout(this.timer)

    this.timer = null
    this.status = TIMER_STATUS.PAUSED
    log('warn', this.settings.debug, `→ Timer [${this.name}] paused.`)
  }

  resume () {
    this.processor()()
    log('warn', this.settings.debug, `→ Timer [${this.name}] resumed.`)
  }

  setFrequency (frequency) {
    this.tickTimes = ~~frequency || ~~this.tickTimes
    this.currentTick = this.tickTimes
    log('warn', this.settings.debug, `→ Timer frequency is set to [${this.tickTimes}].`)
  }
}
