local int foo(int value) {
  return 0xDEADBEEF + value;
}

kernel void localMemReturn()
{
  int i = get_global_id(0);
  local int a;
  a = foo(i);
}
