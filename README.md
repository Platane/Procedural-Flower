Procedural-Flower
=================
Animate the growth and bloom of a flower procedurally generated.



Flowers are drawn with HTML5 native canvas drawing API. These are easy to set up. Specify a HTML container and the script will do the rest! These are also hightly customisable.

The library allow you to set up three kind of flower:


### Flw.LimitedFlower

A basic flower, it grow by itself and stop when it reach it final form.

[LimitedFlower example](http://platane.github.com/Procedural-Flower/examples/LimitedFlower.html)

Use the following syntax to set up the flower:
```
var container = document.getElementById('container');
var flower = Flw.LimitedFlower.create( container , option , runByMySelf );
```

option is a set of key/value. See example for futher informations.
runByMySelf, if true the flower will use requestAnimationFrame to update itself by the time.


### Flw.RampantFlower

This flower have been writed to serve as a loading indication. It receive ponctuals notification of the loadin process. It is able to interpolate the progress curve between two notifications. 

[RampantFlower example](http://platane.github.com/Procedural-Flower/examples/RampantFlower.html)

Use the following syntax to set up the flower:
```
var container = document.getElementById('container');
var flower = Flw.RampantFlower.create( container , option , runByMySelf );
```

### Flw.ControledFlower

A flower that never stop growing. The window scroll to keep view on the top of the stem.

[RampantFlower example](http://platane.github.com/Procedural-Flower/examples/ControledFlower.html)

Use the following syntax to set up the flower:
```
var container = document.getElementById('container');
var flower = Flw.ControledFlower.create( container , option  );
```

