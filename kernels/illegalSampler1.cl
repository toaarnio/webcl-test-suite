constant sampler_t sampler = CLK_NORMALIZED_COORDS_FALSE | CLK_ADDRESS_NONE | CLK_FILTER_NEAREST;

kernel void samplerTypes(read_only image2d_t src, global int* outputValueArray) {

  int x = get_global_id(0);
  int y = get_global_id(1);
  uint red = read_imageui(src, sampler, (int2)(x, y)).x;
  int i = y * get_image_width(src) + x;
  outputValueArray[i] = red;
}
