'use strict';

module.exports = function KeyValueList() {

  var _items = [];

  this.getOrSet = function (key, valueFactory) {

    var item = getItem(key);

    if (item) return item.value;

    var value = valueFactory();

    _items.push({
      key: key,
      value: value,
    });

    return value;

  };

  var getItem = function (key) {

    var itemCount = _items.length;

    for (let index = 0; index < itemCount; index++) {

      let item = _items[index];
      if (item.key === key) return item;

    }

    return null;

  };

};
