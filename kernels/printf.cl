#pragma OPENCL EXTENSION cl_khr_printf : enable
#pragma OPENCL EXTENSION cl_amd_printf : enable
#pragma OPENCL EXTENSION cl_intel_printf : enable
#pragma OPENCL EXTENSION cl_nvidia_printf : enable

kernel void usePrintf(global uint* result) 
{
  printf("Hello, world!\n");
  result[0] = 0xdeadbeef;
}
