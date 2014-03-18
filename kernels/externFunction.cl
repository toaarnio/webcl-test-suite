extern void externFunc(global float *a); 

kernel void externFunction(global float *a) 
{
  a[0] = externFunc(a);
}
