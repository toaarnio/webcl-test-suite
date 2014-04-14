constant int foo[1];

kernel void uninitializedConstant(global int *res)
{
  int i = get_global_id(0);
  res[0] = foo[0];
}
