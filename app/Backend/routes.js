module.exports = function(Parse) {

    return ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$messagesProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $messages) {
        $messages = $messages.$get();
        $urlRouterProvider.otherwise("/");
        //Routes
        var resolvers = {

            checkAll: ['AccountsService', 'OrgService', '$q', '$state', '$rootScope', function(Accounts, Org, $q, $state, $rootScope) {
                var fns = [checkForAccount,checkForOrg]
                if(!Parse.User.current().get('authorized_by') && !Parse.User.current().get('isAdmin')) window.location = "/no-access"
                var deferred = $q.defer();
                //Check if logged in
                if (Parse.User.current()) {
                    $messages.log("Logged In");
                    next()
                } else {
                    $messages.log("Not Logged In");
                    window.location = "/";
                }

                //Get Company 

               

                function checkForAccount() {
                    if (Parse.User.current().get('payload'))
                        next()
                    else
                        window.location = "/register"
                }
                function checkForOrg() {
                    if(!Parse.User.current().get('org')) return window.location = "/register";
                     Org.load(next);
                }


                function next() {
                    if (!fns.length) return deferred.resolve(true);
                    return fns.shift()();
                }


                return deferred.promise;
            }]

        }
        require('./Controllers/dash/routes')($stateProvider, Parse, resolvers);

    }]

};
