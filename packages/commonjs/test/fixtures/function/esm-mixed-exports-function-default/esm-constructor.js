export default function Foo(...args) {
  this.foo = args;
}

Foo.prototype.update = function () {
  this.foo = 'updated';
};

Object.defineProperty(Foo.prototype, 'destroy', {
  value: function () {
    this.foo = 'destroyed';
  },
  enumerable: false,
});

export const bar = 'bar';
