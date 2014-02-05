kernel void pointerSizeCast(global int *G)
{
  local int L[1];
  private int P[1];
  
  local long *Llong = (local long *) &L[0];
  private long *Plong = (private long *) &P[0];
  global long *Glong = (global long *) &G[0];

  Llong[0] = 0xDEADBEEFCAFEBABE;  // OOB write
  Glong[0] = Llong[0];

  Plong[0] = 0x0102030405060708;  // OOB write
  Glong[1] = Plong[0];
}
