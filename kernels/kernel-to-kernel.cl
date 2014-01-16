kernel void bar(global uint* bar_return) {
  bar_return[0] = 0xdeadbeef;
}
kernel void foo(global uint* foo_return) {
  bar(foo_return);
}
