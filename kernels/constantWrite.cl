constant int C[2] = { 0xDEADBEEF, 0 };

kernel void constantWrite(int global *G)
{
  C[0] = 0xBADBABE;
}
