#define SIZE (1u << 28)

kernel void largeArray(global int *res)
{
  local uchar4 A1[SIZE];          // try to allocate 2^2 * 2^28 = 2^30 = 1 GB of memory
  local uchar4 A2[SIZE];          // try to allocate 2^2 * 2^28 = 2^30 = 1 GB of memory

  local uchar8 B1[SIZE];          // try to allocate 2^3 * 2^28 = 2^31 = 2 GB of memory
  local uchar8 B2[SIZE];          // try to allocate 2^3 * 2^28 = 2^31 = 2 GB of memory

  int i = get_global_id(0);
  res[0] = A1[i].s0;
  res[1] = A2[i].s0;
  res[2] = B1[i].s0;
  res[3] = B2[i].s0;
}
