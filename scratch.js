var doStuff = function (word) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(word)
    })
  })
}

var all = function (promises) {
  return new Promise(function (resolve, reject) {
    var results = []
    promises.forEach(function (promise) {
      promise.then(function (data) {
        results.push(data)
        if (results.length === promises.length) {
          resolve(results)
        }
      })
    })
  })
}

var words = ["hello", "bye", "okbai"]
var promises = []
for (var i = 0; i < words.length; i++) {
  promises.push(doStuff(words[i]))
}
all(promises).then(function (results) {
  console.log(results);
})
