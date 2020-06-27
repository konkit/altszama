

export default class CustomPolyfills {

  static flatMap (arr, f) {
    console.log("arr: ", arr);

    if (typeof arr === "array") {
      const concat = (x, y) => x.concat(y);
      return arr.map(f).reduce(concat, []);
    } else if (arr instanceof Map) {
      let result = [];

      arr.forEach((key, value) => {
        const res = f([key, value]);
        result = result.concat(res);
      });

      return result;
    } else {
      const concat = (x, y) => x.concat(y);
      return Object.entries(arr).map(f).reduce(concat, []);
    }
  }
}