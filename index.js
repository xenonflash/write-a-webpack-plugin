var { SyncHook, AsyncSeriesHook } = require('tapable')

class Car {
  constructor(options) {
    this.options = options
    this.hooks = {
      onRun: new SyncHook(['position']),
      onFetch: new AsyncSeriesHook(['info'])
    }
    this.position = 0
    this.timer = null
    this.applyPlugin()
  }
  applyPlugin() {
    const plugins = this.options.plugins
    plugins.forEach(p => {
      p.apply(this)
    })
  }
  run() {
    this.timer = setTimeout(() => {
      this.run()
      this.hooks.onRun.call(this.position)
      this.position ++
      if (this.position > 5) this.stop()
    }, 1000);
  }
  stop() {
    clearTimeout(this.timer)
    this.timer = null
    this.hooks.onStop.call(this.position)
  }
}


class MyPlugin{
  constructor(options) {
    this.name = 'MyPlugin'
  }
  logRun(param) {
    console.log(param)
  }
  apply(car) {
    console.log(car.hooks)
    car.hooks.onRun.tap(this.name, this.logRun)
  }
}


var car = new Car({
  plugins: [
    new MyPlugin()
  ]
})

car.run()
