module.exports = function(module, Parse) {
  module.$ = (function() {
    var vm = {}
    vm.init = function() {
      this.email = currentUser('email');
      this.address = m.prop();
      this.updateAddress = function() {
        var privateKey = new bitcore.PrivateKey();
        var address = privateKey.toAddress();
        return vm.address(address.toString());
      }
    }
    return vm
  }())
}
