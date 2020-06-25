export default {
    flatMap: function (arr, f) {
        var concat = function (x, y) { return x.concat(y); };
        return arr.map(f).reduce(concat, []);
    }
};
//# sourceMappingURL=CustomPolyfills.js.map