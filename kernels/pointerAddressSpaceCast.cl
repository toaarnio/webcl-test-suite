constant int C[2] = { 0xDEADBEEF, 0 };

kernel void pointerTypes(int global *G)
{
  int local L[10];
  int private P[10];

  int local* L2L = L;     // OK
  int private* P2P = P;   // OK
  int global* G2G = G;    // OK
  int constant* P2C = C;  // OK
  L2L[0] = 0xBADBABE;     // OK
  P2P[0] = 0xBADBABE;     // OK
  G2G[0] = 0xBADBABE;     // OK

  private int* P2L = (private int*) L;   // Error, but only detected by AMD
  private int* P2G = (private int*) G;   // Error, but only detected by AMD
  local int* L2P = (local int*) P;       // Error, but only detected by AMD
  local int* L2G = (local int*) G;       // Error, but only detected by AMD
  global int* G2P = (global int*) P;     // Error, but only detected by AMD
  global int* G2L = (global int*) L;     // Error, but only detected by AMD

  int myconst = P2C[0];   // OK

  P2L[0] = myconst;
  P2G[0] = myconst;
  L2P[0] = myconst;
  L2G[0] = myconst;
  G2P[0] = myconst;
  G2L[0] = myconst;
}
