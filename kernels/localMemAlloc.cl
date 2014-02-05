kernel void invalidLocalMemAlloc()
{
  int i = get_global_id(0);
  local uint value;
  value = 0xCAFE;
  local uint *valuePtr1 = &value;
  local uint *valuePtr2 = &value;
  if (i % 2) {
    local uint notKernelScope;   // invalid declaration according to OpenCL 1.2
    notKernelScope = 0xDEADBEEF;
    valuePtr1 = &notKernelScope;
  }
  *valuePtr1 = 0xBADBABE;
  *valuePtr2 = 0xBADBABE;
}
