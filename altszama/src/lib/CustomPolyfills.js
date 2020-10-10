var CustomPolyfills = /** @class */ (function () {
    function CustomPolyfills() {
    }
    CustomPolyfills.flatMap = function (arr, f) {
        var concat = function (x, y) { return x.concat(y); };
        return arr.map(f).reduce(concat, []);
    };
    CustomPolyfills.flatMap = function (map, f) {
    };
    return CustomPolyfills;
}());
export default CustomPolyfills;
//# sourceMappingURL=CustomPolyfills.js.map