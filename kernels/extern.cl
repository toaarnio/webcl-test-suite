extern constant uint table[256];

kernel void use_extern(global uint* result) 
{
  result[0] = table[0];
}
