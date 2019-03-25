export default {
  flatMap: (arr, f) => {
    const concat = (x,y) => x.concat(y);

    return arr.map(f).reduce(concat, []);
  }
}