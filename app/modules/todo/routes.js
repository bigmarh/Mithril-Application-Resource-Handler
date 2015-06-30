module.exports = function(module) {
  app.routes[module.parentName + "." + module.name] = {
    module: module.name,
    places: {
      '#content': module.name,
      '.extra': 'fred'
    },
    url: "/" + module.name,
    onEnter: function(args) {},
    onExit: function(args) {}
  }
}
