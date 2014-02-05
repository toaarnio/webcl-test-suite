kernel void invalidLocalMemInit()
{
  int i = get_global_id(0);
  local uint value = 0xDEADBEEF;  // invalid according to OpenCL 1.2
  local uint *valuePtr = &value;
  valuePtr[0] = 0xCAFEBABE;
}
