kernel void copyBuffer(global float* src, global float* dst)
{
  const int index = get_global_id(0);
  dst[index] = src[index];
}
