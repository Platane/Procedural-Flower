Procedural-Flower
=================
Animate the growth and bloom of a flower procedurally generated.



Flowers are drawn with HTML5 native canvas drawing API. These are easy to set up. Specify a HTML container and the script will do the rest! These are also hightly customisable.

The library allows you to set up three kind of flower:


### Flw.LimitedFlower

A basic flower, it grows by itself and stop when it reaches its final form.

[LimitedFlower example](http://platane.github.com/Procedural-Flower/examples/LimitedFlower.html)

Use the following syntax to set up the flower:
```
var container = document.getElementById('container');
var flower = Flw.LimitedFlower.create( container , option , runByMySelf );
```

option is a set of key/value. See examples for futher informations.
runByMySelf, if true the flower will use requestAnimationFrame to update itself. If false, consider to call the method flower.cycle( delta_ms ).


### Flw.RampantFlower

A flower that never stops growing. The window scrolls to keep view on the top of the stem.

[RampantFlower example](http://platane.github.com/Procedural-Flower/examples/RampantFlower.html)

Use the following syntax to set up the flower:
```
var container = document.getElementById('container');
var flower = Flw.RampantFlower.create( container , option , runByMySelf );
```

### Flw.ControledFlower

This flower have been writed to serve as a loading indication. It receive ponctual notifications of the loadin process. It is able to interpolate the progress curve between two notifications. 

[ControledFlower example](http://platane.github.com/Procedural-Flower/examples/ControledFlower.html)

Use the following syntax to set up the flower:
```
var container = document.getElementById('container');
var flower = Flw.ControledFlower.create( container , option  );
```

And notify the progression:
```
var deltaProgress = 1;
var maxProgress = 100;
flower.tick( deltaProgress / maxProgress );
```

