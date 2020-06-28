var CustomPolyfills = /** @class */ (function () {
    function CustomPolyfills() {
    }
    CustomPolyfills.flatMap = function (arr, f) {
        console.log("arr: ", arr);
        if (typeof arr === "array") {
            var concat = function (x, y) { return x.concat(y); };
            return arr.map(f).reduce(concat, []);
        }
        else if (arr instanceof Map) {
            var result_1 = [];
            arr.forEach(function (key, value) {
                var res = f([key, value]);
                result_1 = result_1.concat(res);
            });
            return result_1;
        }
        else {
            var concat = function (x, y) { return x.concat(y); };
            return Object.entries(arr).map(f).reduce(concat, []);
        }
    };
    return CustomPolyfills;
}());
export default CustomPolyfills;
//# sourceMappingURL=CustomPolyfills.js.map