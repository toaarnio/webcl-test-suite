kernel void use_memcpy(global uint* result) 
{
  memcpy((void *)result, (void *)result, 16);
  result[0] = 0xdeadbeef;
}
