/*
 * This file is part of WebCL – Web Computing Language.
 *
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL
 * was not distributed with this file, You can obtain
 * one at http://mozilla.org/MPL/2.0/.
 *
 * The Original Contributor of this Source Code Form is
 * Nokia Research Tampere (http://webcl.nokiaresearch.com).
 *
 * Author: Tomi Aarnio, 2014
 */

errorEnums = {
  /* Error Codes */
  SUCCESS                                   : 0,
  DEVICE_NOT_FOUND                          : -1,
  DEVICE_NOT_AVAILABLE                      : -2,
  COMPILER_NOT_AVAILABLE                    : -3,
  MEM_OBJECT_ALLOCATION_FAILURE             : -4,
  OUT_OF_RESOURCES                          : -5,
  OUT_OF_HOST_MEMORY                        : -6,
  PROFILING_INFO_NOT_AVAILABLE              : -7,
  MEM_COPY_OVERLAP                          : -8,
  IMAGE_FORMAT_MISMATCH                     : -9,
  IMAGE_FORMAT_NOT_SUPPORTED                : -10,
  BUILD_PROGRAM_FAILURE                     : -11,
  MAP_FAILURE                               : -12,
  MISALIGNED_SUB_BUFFER_OFFSET              : -13,
  EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST : -14,
  INVALID_VALUE                             : -30,
  INVALID_DEVICE_TYPE                       : -31,
  INVALID_PLATFORM                          : -32,
  INVALID_DEVICE                            : -33,
  INVALID_CONTEXT                           : -34,
  INVALID_QUEUE_PROPERTIES                  : -35,
  INVALID_COMMAND_QUEUE                     : -36,
  INVALID_HOST_PTR                          : -37,
  INVALID_MEM_OBJECT                        : -38,
  INVALID_IMAGE_FORMAT_DESCRIPTOR           : -39,
  INVALID_IMAGE_SIZE                        : -40,
  INVALID_SAMPLER                           : -41,
  INVALID_BINARY                            : -42,
  INVALID_BUILD_OPTIONS                     : -43,
  INVALID_PROGRAM                           : -44,
  INVALID_PROGRAM_EXECUTABLE                : -45,
  INVALID_KERNEL_NAME                       : -46,
  INVALID_KERNEL_DEFINITION                 : -47,
  INVALID_KERNEL                            : -48,
  INVALID_ARG_INDEX                         : -49,
  INVALID_ARG_VALUE                         : -50,
  INVALID_ARG_SIZE                          : -51,
  INVALID_KERNEL_ARGS                       : -52,
  INVALID_WORK_DIMENSION                    : -53,
  INVALID_WORK_GROUP_SIZE                   : -54,
  INVALID_WORK_ITEM_SIZE                    : -55,
  INVALID_GLOBAL_OFFSET                     : -56,
  INVALID_EVENT_WAIT_LIST                   : -57,
  INVALID_EVENT                             : -58,
  INVALID_OPERATION                         : -59,
  //INVALID_GL_OBJECT                         : -60,  // moved to extension
  INVALID_BUFFER_SIZE                       : -61,
  //INVALID_MIP_LEVEL                         : -62,  // moved to extension
  INVALID_GLOBAL_WORK_SIZE                  : -63,
  INVALID_PROPERTY                          : -64,
};

removedErrorEnums = {
  //INVALID_GL_OBJECT                        : -60,
  //INVALID_MIP_LEVEL                        : -62,
};

deviceInfoEnums = {
  DEVICE_TYPE                               : 0x1000,
  DEVICE_VENDOR_ID                          : 0x1001,
  DEVICE_MAX_COMPUTE_UNITS                  : 0x1002,
  DEVICE_MAX_WORK_ITEM_DIMENSIONS           : 0x1003,
  DEVICE_MAX_WORK_GROUP_SIZE                : 0x1004,
  DEVICE_MAX_WORK_ITEM_SIZES                : 0x1005,
  DEVICE_PREFERRED_VECTOR_WIDTH_CHAR        : 0x1006,
  DEVICE_PREFERRED_VECTOR_WIDTH_SHORT       : 0x1007,
  DEVICE_PREFERRED_VECTOR_WIDTH_INT         : 0x1008,
  DEVICE_PREFERRED_VECTOR_WIDTH_LONG        : 0x1009,
  DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT       : 0x100A,
  //DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE      : 0x100B, // moved to extension
  DEVICE_MAX_CLOCK_FREQUENCY                : 0x100C,
  DEVICE_ADDRESS_BITS                       : 0x100D,
  DEVICE_MAX_READ_IMAGE_ARGS                : 0x100E,
  DEVICE_MAX_WRITE_IMAGE_ARGS               : 0x100F,
  DEVICE_MAX_MEM_ALLOC_SIZE                 : 0x1010,
  DEVICE_IMAGE2D_MAX_WIDTH                  : 0x1011,
  DEVICE_IMAGE2D_MAX_HEIGHT                 : 0x1012,
  DEVICE_IMAGE3D_MAX_WIDTH                  : 0x1013,
  DEVICE_IMAGE3D_MAX_HEIGHT                 : 0x1014,
  DEVICE_IMAGE3D_MAX_DEPTH                  : 0x1015,
  DEVICE_IMAGE_SUPPORT                      : 0x1016,
  DEVICE_MAX_PARAMETER_SIZE                 : 0x1017,
  DEVICE_MAX_SAMPLERS                       : 0x1018,
  DEVICE_MEM_BASE_ADDR_ALIGN                : 0x1019,
  //DEVICE_MIN_DATA_TYPE_ALIGN_SIZE           : 0x101A, // removed, deprecated in OpenCL 1.2
  DEVICE_SINGLE_FP_CONFIG                   : 0x101B,
  DEVICE_GLOBAL_MEM_CACHE_TYPE              : 0x101C,
  DEVICE_GLOBAL_MEM_CACHELINE_SIZE          : 0x101D,
  DEVICE_GLOBAL_MEM_CACHE_SIZE              : 0x101E,
  DEVICE_GLOBAL_MEM_SIZE                    : 0x101F,
  DEVICE_MAX_CONSTANT_BUFFER_SIZE           : 0x1020,
  DEVICE_MAX_CONSTANT_ARGS                  : 0x1021,
  DEVICE_LOCAL_MEM_TYPE                     : 0x1022,
  DEVICE_LOCAL_MEM_SIZE                     : 0x1023,
  DEVICE_ERROR_CORRECTION_SUPPORT           : 0x1024,
  DEVICE_PROFILING_TIMER_RESOLUTION         : 0x1025,
  DEVICE_ENDIAN_LITTLE                      : 0x1026,
  DEVICE_AVAILABLE                          : 0x1027,
  DEVICE_COMPILER_AVAILABLE                 : 0x1028,
  DEVICE_EXECUTION_CAPABILITIES             : 0x1029,
  DEVICE_QUEUE_PROPERTIES                   : 0x102A,
  DEVICE_NAME                               : 0x102B,
  DEVICE_VENDOR                             : 0x102C,
  DRIVER_VERSION                            : 0x102D,
  DEVICE_PROFILE                            : 0x102E,
  DEVICE_VERSION                            : 0x102F,
  DEVICE_EXTENSIONS                         : 0x1030,
  DEVICE_PLATFORM                           : 0x1031,
  //DEVICE_DOUBLE_FP_CONFIG                   : 0x1032, // moved to extension
  //DEVICE_HALF_FP_CONFIG                     : 0x1033, // moved to extension
  //DEVICE_PREFERRED_VECTOR_WIDTH_HALF        : 0x1034, // moved to extension
  DEVICE_HOST_UNIFIED_MEMORY                : 0x1035,
  DEVICE_NATIVE_VECTOR_WIDTH_CHAR           : 0x1036,
  DEVICE_NATIVE_VECTOR_WIDTH_SHORT          : 0x1037,
  DEVICE_NATIVE_VECTOR_WIDTH_INT            : 0x1038,
  DEVICE_NATIVE_VECTOR_WIDTH_LONG           : 0x1039,
  DEVICE_NATIVE_VECTOR_WIDTH_FLOAT          : 0x103A,
  //DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE         : 0x103B, // moved to extension
  //DEVICE_NATIVE_VECTOR_WIDTH_HALF           : 0x103C, // moved to extension
  DEVICE_OPENCL_C_VERSION                   : 0x103D,
};

deviceInfoEnumMatchers = {
  DEVICE_TYPE                               : function(v) { return (v === 2 || v === 4 || v === 8); },
  DEVICE_VENDOR_ID                          : function(v) { return (typeof(v) === 'number'); },
  DEVICE_MAX_COMPUTE_UNITS                  : function(v) { return (v >= 1); },
  DEVICE_MAX_WORK_ITEM_DIMENSIONS           : function(v) { return (v >= 3); },
  DEVICE_MAX_WORK_GROUP_SIZE                : function(v) { return (v >= 1); },
  DEVICE_MAX_WORK_ITEM_SIZES                : function(v) { return (v[0] >= 1 && v[1] >= 1 && v[2] >= 1); },
  DEVICE_PREFERRED_VECTOR_WIDTH_CHAR        : function(v) { return (v >= 1); },
  DEVICE_PREFERRED_VECTOR_WIDTH_SHORT       : function(v) { return (v >= 1); },
  DEVICE_PREFERRED_VECTOR_WIDTH_INT         : function(v) { return (v >= 1); },
  DEVICE_PREFERRED_VECTOR_WIDTH_LONG        : function(v) { return (v >= 1); },
  DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT       : function(v) { return (v >= 1); },
  //DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE      : 0x100B, // moved to extension
  DEVICE_MAX_CLOCK_FREQUENCY                : function(v) { return (v >= 1); },
  DEVICE_ADDRESS_BITS                       : function(v) { return (v === 32 || v === 64); },
  DEVICE_MAX_READ_IMAGE_ARGS                : function(v) { return (v >= 8); },
  DEVICE_MAX_WRITE_IMAGE_ARGS               : function(v) { return (v >= 1); },
  DEVICE_MAX_MEM_ALLOC_SIZE                 : function(v) { return (v >= 1024*1024); },
  DEVICE_IMAGE2D_MAX_WIDTH                  : function(v) { return (v >= 2048); },
  DEVICE_IMAGE2D_MAX_HEIGHT                 : function(v) { return (v >= 2048); },
  DEVICE_IMAGE3D_MAX_WIDTH                  : function(v) { return (v >= 0); },
  DEVICE_IMAGE3D_MAX_HEIGHT                 : function(v) { return (v >= 0); },
  DEVICE_IMAGE3D_MAX_DEPTH                  : function(v) { return (v >= 0); },
  DEVICE_IMAGE_SUPPORT                      : function(v) { return (v === true); },
  DEVICE_MAX_PARAMETER_SIZE                 : function(v) { return (v >= 256); },
  DEVICE_MAX_SAMPLERS                       : function(v) { return (v >= 8); },
  DEVICE_MEM_BASE_ADDR_ALIGN                : function(v) { return (v >= 512); },
  //DEVICE_MIN_DATA_TYPE_ALIGN_SIZE           : 0x101A, // removed, deprecated in OpenCL 1.2
  DEVICE_SINGLE_FP_CONFIG                   : function(v) { return (v >= 0 && v <= 0x7F); },
  DEVICE_GLOBAL_MEM_CACHE_TYPE              : function(v) { return (v === 0 || v === 1 || v === 2); } ,
  DEVICE_GLOBAL_MEM_CACHELINE_SIZE          : function(v) { return (v >= 0); },
  DEVICE_GLOBAL_MEM_CACHE_SIZE              : function(v) { return (v >= 0); },
  DEVICE_GLOBAL_MEM_SIZE                    : function(v) { return (v >= 1024*1024); },
  DEVICE_MAX_CONSTANT_BUFFER_SIZE           : function(v) { return (v >= 1024); },
  DEVICE_MAX_CONSTANT_ARGS                  : function(v) { return (v >= 4); },
  DEVICE_LOCAL_MEM_TYPE                     : function(v) { return (v === 1 || v === 2); },
  DEVICE_LOCAL_MEM_SIZE                     : function(v) { return (v >= 1024); },
  DEVICE_ERROR_CORRECTION_SUPPORT           : function(v) { return (typeof(v) === 'boolean'); },
  DEVICE_PROFILING_TIMER_RESOLUTION         : function(v) { return (v >= 0); },
  DEVICE_ENDIAN_LITTLE                      : function(v) { return (typeof(v) === 'boolean'); },
  DEVICE_AVAILABLE                          : function(v) { return (v === true); },
  DEVICE_COMPILER_AVAILABLE                 : function(v) { return (v === true); },
  DEVICE_EXECUTION_CAPABILITIES             : function(v) { return (v === WebCL.EXEC_KERNEL); },
  DEVICE_QUEUE_PROPERTIES                   : function(v) { return (v === 0 || v === 1 || v === 2 || v === 3); },
  DEVICE_NAME                               : function(v) { return (typeof(v) === 'string'); },
  DEVICE_VENDOR                             : function(v) { return (typeof(v) === 'string'); },
  DRIVER_VERSION                            : function(v) { return (typeof(v) === 'string'); },
  DEVICE_PROFILE                            : function(v) { return (v.indexOf('WEBCL_PROFILE') === 0); },
  DEVICE_VERSION                            : function(v) { return (v.indexOf('WebCL 1.0') === 0); },
  DEVICE_EXTENSIONS                         : function(v) { return (typeof(v) === 'string'); },
  DEVICE_PLATFORM                           : function(v) { return (v instanceof WebCLPlatform); },
  //DEVICE_DOUBLE_FP_CONFIG                   : 0x1032, // moved to extension
  //DEVICE_HALF_FP_CONFIG                     : 0x1033, // moved to extension
  //DEVICE_PREFERRED_VECTOR_WIDTH_HALF        : 0x1034, // moved to extension
  DEVICE_HOST_UNIFIED_MEMORY                : function(v) { return (typeof(v) === 'boolean'); },
  DEVICE_NATIVE_VECTOR_WIDTH_CHAR           : function(v) { return (v >= 1); },
  DEVICE_NATIVE_VECTOR_WIDTH_SHORT          : function(v) { return (v >= 1); },
  DEVICE_NATIVE_VECTOR_WIDTH_INT            : function(v) { return (v >= 1); },
  DEVICE_NATIVE_VECTOR_WIDTH_LONG           : function(v) { return (v >= 1); },
  DEVICE_NATIVE_VECTOR_WIDTH_FLOAT          : function(v) { return (v >= 1); },
  //DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE         : 0x103B, // moved to extension
  //DEVICE_NATIVE_VECTOR_WIDTH_HALF           : 0x103C, // moved to extension
  DEVICE_OPENCL_C_VERSION                   : function(v) { return (v.indexOf('WebCL C 1.0') === 0); },
};

removedDeviceInfoEnums = {
  DEVICE_MIN_DATA_TYPE_ALIGN_SIZE          : 0x101A,
  //DEVICE_DOUBLE_FP_CONFIG                  : 0x1032,
  //DEVICE_HALF_FP_CONFIG                    : 0x1033,
  //DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE     : 0x100B,
  //DEVICE_PREFERRED_VECTOR_WIDTH_HALF       : 0x1034,
  //DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE        : 0x103B,
  //DEVICE_NATIVE_VECTOR_WIDTH_HALF          : 0x103C,
};

extensionEnums = {
  INVALID_GL_OBJECT                        : -60,
  INVALID_MIP_LEVEL                        : -62,
  DEVICE_DOUBLE_FP_CONFIG                  : 0x1032,
  DEVICE_HALF_FP_CONFIG                    : 0x1033,
  DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE     : 0x100B,
  DEVICE_PREFERRED_VECTOR_WIDTH_HALF       : 0x1034,
  DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE        : 0x103B,
  DEVICE_NATIVE_VECTOR_WIDTH_HALF          : 0x103C,
};
