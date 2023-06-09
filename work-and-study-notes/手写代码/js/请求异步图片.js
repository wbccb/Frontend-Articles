const url1 = "https://ossimg.xinli001.com/op/df/20211217/1639736870122cOREpahMFf0SqBJNyuwbfTEs8X3TxyYY.png";

const url2 = "https://pics1.baidu.com/feed/838ba61ea8d3fd1f652993288ce4ea1695ca5f37.jpeg?token=4c2ca5c6064c343dad01c30538ed2659";

loadImg(url1).then(img1 => {
  return img1;
}).then(img1 => {
  return loadImg(url2);
}).then(img2 => {
  return img2;
});


function loadImg(url) {
  // 返回一个promise对象

  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = function () {
      resolve(img);
    }

    img.onerror = function (error) {
      const err = new Error(`图片加载失败${url}:` + JSON.stringify(error));
      reject(err);
    }

    img.src = url;
  })
}