
/**
* Eliseo Geraldo · e1016 · MIT
* AsyncStorage manager for React Native
* 1.0.3 · 2018-04-04
*/
module.exports = (function () {

  if (!support) throw '[Store Error]: AsyncStorage is not supported!';

  // initializing Store class model
  let Storaged = function (str) {
    if (!str && typeof str !== 'string') throw '[Store Error]: Collection reference is not defined';
    this.collection = str;
  }

  // Save method
  Storaged.prototype.save = function (ob) {
    let data;

    // check for correct type of parameter
    // it should be an object
    if  (typeof ob !== 'object') throw '[Store Error]: "save" method expect a JSON';

    // check if register exists
    if ( data = JSON.parse(AsyncStorage.getItem(this.collection)) ) {
      data.push(ob);
      AsyncStorage.setItem (
        this.collection,
        JSON.stringify(data)
      );
    } else {
      // insert data for first time
      data = []
      data.push(ob)
      AsyncStorage.setItem (
        this.collection,
        JSON.stringify(data)
      );
    }
  }

  // Delete method
  Storaged.prototype.delete = function () {
    AsyncStorage.removeItem(this.collection);
  }

  // finder function used for all reader methods
  const __finder_prot = function (values, nod, collection) {
    let data,
      tmp = [],
      tmpRefactor = {};

    // if values is defined
    if (values) {
      if (typeof values !== 'object') throw '[Store Error]: "find" method expect a JSON';
      data = JSON.parse(AsyncStorage.getItem(collection));

      // if the node is defined, it responds
      // only with the requested nodes
      if (nod && typeof nod === 'string') {
        for (let __j_key in values) {
          data.forEach(function(el) {
            if (el[__j_key] == values[__j_key]) {
              (nod.split(/ +/g)).forEach(function(nodMirror) {
                tmpRefactor[nodMirror] = el[nodMirror];
              });
              tmp.push(tmpRefactor);
              tmpRefactor = {};
            }
          })
        }
        // else, request all nodes
      } else {
        for (let __j_key in values) {
          data.forEach(function(el) {
            if (el[__j_key] == values[__j_key]) {
              tmp.push(el);
            }
          })
        }
      }
      return tmp;
    } else {
      return JSON.parse (
        AsyncStorage.getItem(collection)
      );
    }
  }

  // Find method
  Storaged.prototype.find = function (values, nod) {
    return __finder_prot(values, nod, this.collection)
  }

  // Find one method
  Storaged.prototype.findOne = function (values, nod) {
    return (__finder_prot(values, nod, this.collection))[0]
  }

  // update method
  Storaged.prototype.update = function (ob) {
    if (!ob.set) throw '[Store Error]: "set" node missing';
    if (!ob.where) throw '[Store Error]: "where" node missing';

    if (typeof ob.where !== 'object' && typeof ob.set !== 'object') {
      throw '[Store Error]: "Where" or "Set" node expects objects';
    }


    let data,
        rules = [],
        setterLength = 0,
        whereLength = 0,
        flag;

    // checking for all avalible setters
    for (s in ob.set) {
      setterLength++;
    }

    // check for all conditions
    for (w in ob.where) {
      whereLength++;
    }

    if (data = JSON.parse(AsyncStorage.getItem(this.collection))) {
      data.forEach(function(data_el, indx) {
        flag = 0; // <- reset flag to 0
        // checking for coincidences in each of stored object
        // conditios
        for (w in ob.where) {
          flag += (ob.where[w] === data_el[w]) ? 1 : 0;
        }
        // nodes that will be returned
        if (flag === whereLength) {
          for (s in ob.set) {
            data[indx][s] = ob.set[s];
          }
        }
      })
      // saving updated object
      AsyncStorage.setItem (
        this.collection,
        JSON.stringify(data)
      );
    } else {
      throw '[Store Error]: has been ocurred an error trying to get data from ' + this.collection;
    }
  }

  // Find and Sort method
  Storaged.prototype.findSorted = function (order) {
    var result, orderer, parmOrder;
    if (typeof order !== 'string') throw '[Store Error]: Sort parameter should be String type';
    if (!(orderer = order.match(/[<|>]/)[0])) throw '[Store Error]: Error processing';

    parmOrder = order.replace(/[<|>]/, '').trim();
    result = __finder_prot(undefined, undefined, this.collection);

    return (
      result.sort(function(a, b) {
        return (orderer === '<')
          ? a[parmOrder] < b[parmOrder]
          : a[parmOrder] > b[parmOrder]
      })
    );
  }

  return Storaged;
});
