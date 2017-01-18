(function() {
    'use strict';

    angular
        .module('wallavicApp')
        .controller('ProductController', ProductController);

    ProductController.$inject = ['$scope', '$state', 'Product', 'ParseLinks', 'AlertService', 'paginationConstants'];

    function ProductController ($scope, $state, Product, ParseLinks, AlertService, paginationConstants) {
        var vm = this;

        vm.toDisplay = {};
        vm.toDisplay.options = ['for sale', 'sold'];
        vm.toDisplay.current = 'for sale';

        vm.products = [];
        vm.loadPage = loadPage;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.page = 0;
        vm.links = {
            last: 0
        };
        vm.predicate = 'id';
        vm.reset = reset;
        vm.reverse = true;

        vm.changeView = changeView;

        loadAll();

        function loadAll () {
            Product.query({
                page: vm.page,
                size: vm.itemsPerPage,
                sort: sort()
            }, onSuccess, onError);
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }

            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                for (var i = 0; i < data.length; i++) {
                    vm.products.push(data[i]);
                }
            }

            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function reset () {
            vm.page = 0;
            vm.products = [];
            loadAll();
        }

        function loadPage(page) {
            vm.page = page;
            loadAll();
        }

        function changeView(newView) {
            vm.toDisplay.current = newView;
        }
    }
})();
