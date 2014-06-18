#pragma OPENCL EXTENSION cl_khr_fp64 : disable

#undef M_PI
#define M_PI 3.14159f

//##############################################################################
// Type definition
//##############################################################################
typedef float4 Stokes;
typedef int3 VoxelId;

// Different types of visualization
enum visualizationType{
    REGULAR = 0, // Regular, unpolarized image
    DOP = 1, // View of the degree of polarization
    TOP = 2, // View of the type of polarization
    CCP = 3, // View of the chirality of the circular polarization
    OPL = 4, // View of the orientation of the linear polarization
    DEBUG = 5 // Debugging view to check sanity of degree of polarization
};

// Different types of scaling
enum scalingType{
    RAW = 0, // Scaled only using the degree of polarization
    DIRECT = 1, // Direct overlay on the grey image
    SCALED = 2 // Overlay scaled by the luminance value
};

typedef struct{
    float3 o; // origin
    float3 at; // lookat point
    float3 up; // up vector (normalized)
    float fov; // field of view
} Cam;

typedef struct{
    float3 o; // origin
    float3 d; // directon (normalized)
    float3 r; // right vector to keep track of polarization
} Ray;

typedef struct{
    float3 p; // position
    float3 n; // normal
    uint m; // material id
} Intersection;

typedef struct{
    float3 p0;
    float3 p1;
    float3 p2;
    float3 n0;
    float3 n1;
    float3 n2;

    uint m;

    // For intersection only
    float alpha;
    float beta;
} Triangle;

typedef struct{
    float3 c; // center
    float r; // radius
    uint m; // Index of the material
} Sphere;

typedef struct{
    float3 c; // Light is a sphere
    float r; // Radius of the light
    float3 e; // Color of the light source
} Light;

typedef struct{
    Stokes R; // Red component of the polarized color
    Stokes G; // Green component of the polarized color
    Stokes B; // Blue component of the polarized color
} pColor;

typedef struct{
  float3 diffuseReflectance;
  float2 refractiveIndex;
  float3 specularReflectance;
  float3 specularTransmittance;
  float idBRDF;
  int idTabularBRDF;
} Material;

typedef struct{
    float4 l0; // First line of the Mueller matrix
    float4 l1; // Second line of the Mueller matrix
    float4 l2; // Third line of the Mueller matrix
    float4 l3; // Fourth line of the Mueller matrix
} Mueller;

typedef struct{
  Mueller R;
  Mueller G;
  Mueller B;
} Modificator;

typedef struct{
    float3 pMin;
    float3 pMax;
    float tMin;
    float tMax;
} AABB;

//##############################################################################
// Useful values
//##############################################################################

#define ONE 1.0f
#define ZERO 0.0f
#define EPSILON 0.01f
#define AIR_REFRACTIVE 1.000277f
__constant float4 zeros4 = (float4)(ZERO, ZERO, ZERO, ZERO);
__constant float3 zeros3 = (float3)(ZERO, ZERO, ZERO);
__constant float4 ones4 = (float4)(ONE, ONE, ONE, ONE);
__constant float3 ones3 = (float3)(ONE, ONE, ONE);
__constant Stokes unpolarized = (float4)(ONE, ZERO, ZERO, ZERO);
__constant float3 one3 = (float3)(ONE, ZERO, ZERO);
__constant float3 RED = (float3)(ONE, ZERO, ZERO);
__constant float3 GREEN = (float3)(ZERO, ONE, ZERO);
__constant float3 BLUE = (float3)(ZERO, ZERO, ONE);
__constant float3 CYAN = (float3)(ZERO, ONE, ONE);
__constant float3 YELLOW = (float3)(ONE, ONE, ZERO);
__constant float3 MAGENTA = (float3)(ONE, ZERO, ONE);



//##############################################################################
// Generic functions
//##############################################################################
float random(uint *seed0, uint *seed1) 
{
    *seed0 = 36969 * ((*seed0) & 65535) + ((*seed0) >> 16);
    *seed1 = 18000 * ((*seed1) & 65535) + ((*seed1) >> 16);

    uint ires = ((*seed0) << 16) + (*seed1);

    //Convert to float
    union {
        float f;
        uint ui;
    } res;
    res.ui = (ires & 0x007fffff) | 0x40000000;

    return (res.f - 2.0f) / 2.0f;
}

float3 samplePointOnUnitSphere(uint * seed0, uint * seed1){
    float z = random(seed0, seed1) * 2.0f - ONE;
    float phi = random(seed0, seed1) * 2.0f * M_PI;

    float r = sqrt(ONE - z * z);
    float x = r * cos(phi);
    float y = r * sin(phi);

    return (float3)(x,y,z);
}

float3 samplePointOnUnitHemisphere(uint * seed0, uint * seed1){
    float z = random(seed0, seed1);
    float phi = random(seed0, seed1) * 2.0f * M_PI;

    float r = sqrt(ONE - z * z);
    float x = r * cos(phi);
    float y = r * sin(phi);

    return (float3)(x,y,z);
}

float3 samplePointOnUnitHemisphereAlongDir(uint * seed0, uint * seed1, 
                                           float3 dir){


    float3 point = samplePointOnUnitHemisphere(seed0, seed1);

    float3 dir2 = fabs(dir);
    float3 dir3 = dir;

    if (dir2.x == ZERO){
        dir3.x = ONE;
    } else if (dir2.y == ZERO){
        dir3.y = ONE;
    } if (dir2.x < dir2.y && dir2.x < dir2.z){
        dir3.x = ONE * sign(dir3.x);
    }
    else if (dir2.y < dir2.x && dir2.y < dir2.z){
        dir3.y = ONE * sign(dir3.y);
    }
    else{
        dir3.z = ONE * sign(dir3.z);
    }

    float3 U = normalize(cross(dir3, dir));
    float3 V = cross(dir, U);
    float3 W = dir;

    return point.x * U + point.y * V + point.z * W;   
}


bool isZero(float3 vec){
  return (vec.x == ZERO || vec.y == ZERO || vec.z == ZERO);
}

// Dir has to point to the surface
float3 getReflectedDir(float3 dir, float3 normal){
    float3 badNormal = normal * -sign(dot(normal, dir));
    return dir - 2.0f * badNormal * dot(dir, badNormal);
}

// Dir has to point to the surface
float3 getRefractedDir(float3 dir, float3 normal, 
                       float refractiveIndexOut,float refractiveIndexIn){
  float cosThetaIn = clamp(dot(-dir, normal), ZERO, ONE);
  float sinThetaIn2 = ONE - cosThetaIn * cosThetaIn;
  float eta = refractiveIndexIn / refractiveIndexOut;
  float sinThetaOut2 = eta * eta * sinThetaIn2;
  float cosThetaOut = sqrt(max(ZERO, ONE - sinThetaOut2));
  if (dot(-dir, normal) > ZERO)
    cosThetaOut = -cosThetaOut;
  return normalize(normal * cosThetaOut + (dir - normal * cosThetaIn) * eta);

}

bool doRefract(Ray * r, float3 normal, float refractiveIndex,
               uint * seed0, uint * seed1){
  float cosThetaI = clamp(dot(-r->d, normal), ZERO, ONE);
  float a = refractiveIndex - ONE;
  float b = refractiveIndex + ONE;
  float r0 = a * a / (b * b);
  float c = ONE - cosThetaI;
  float re = r0 + (ONE - r0) * pown(c,5);
  float ra = random(seed0, seed1);
  if (ra < re)
    return false;
  return true;
}

//##############################################################################
// Polarization related
//##############################################################################

Mueller identity(){
    Mueller result;
        result.l0 = zeros4; result.l0.s0 = ONE;
        result.l1 = zeros4; result.l1.s1 = ONE;
        result.l2 = zeros4; result.l2.s2 = ONE;
        result.l3 = zeros4; result.l3.s3 = ONE;

    return result;
}

Stokes mmults(Mueller m, Stokes s){
    Stokes result;
    result.s0 = m.l0.s0 * s.s0 + m.l0.s1 * s.s1 
              + m.l0.s2 * s.s2 + m.l0.s3 * s.s3;
    result.s1 = m.l1.s0 * s.s0 + m.l1.s1 * s.s1 
              + m.l1.s2 * s.s2 + m.l1.s3 * s.s3;
    result.s2 = m.l2.s0 * s.s0 + m.l2.s1 * s.s1 
              + m.l2.s2 * s.s2 + m.l2.s3 * s.s3;
    result.s3 = m.l3.s0 * s.s0 + m.l3.s1 * s.s1 
              + m.l3.s2 * s.s2 + m.l3.s3 * s.s3;   
    return result; 
}

Mueller mmultm(Mueller m1, Mueller m2){
    Mueller result;

    result.l0.s0 = m1.l0.s0 * m2.l0.s0 + m1.l0.s1 * m2.l1.s0
                 + m1.l0.s2 * m2.l2.s0 + m1.l0.s3 * m2.l3.s0;
    result.l0.s1 = m1.l0.s0 * m2.l0.s1 + m1.l0.s1 * m2.l1.s1
                 + m1.l0.s2 * m2.l2.s1 + m1.l0.s3 * m2.l3.s1;
    result.l0.s2 = m1.l0.s0 * m2.l0.s2 + m1.l0.s1 * m2.l1.s2
                 + m1.l0.s2 * m2.l2.s2 + m1.l0.s3 * m2.l3.s2;
    result.l0.s3 = m1.l0.s0 * m2.l0.s3 + m1.l0.s1 * m2.l1.s3
                 + m1.l0.s2 * m2.l2.s3 + m1.l0.s3 * m2.l3.s3;

    result.l1.s0 = m1.l1.s0 * m2.l0.s0 + m1.l1.s1 * m2.l1.s0
                 + m1.l1.s2 * m2.l2.s0 + m1.l1.s3 * m2.l3.s0;
    result.l1.s1 = m1.l1.s0 * m2.l0.s1 + m1.l1.s1 * m2.l1.s1
                 + m1.l1.s2 * m2.l2.s1 + m1.l1.s3 * m2.l3.s1;
    result.l1.s2 = m1.l1.s0 * m2.l0.s2 + m1.l1.s1 * m2.l1.s2
                 + m1.l1.s2 * m2.l2.s2 + m1.l1.s3 * m2.l3.s2;
    result.l1.s3 = m1.l1.s0 * m2.l0.s3 + m1.l1.s1 * m2.l1.s3
                 + m1.l1.s2 * m2.l2.s3 + m1.l1.s3 * m2.l3.s3;

    result.l2.s0 = m1.l2.s0 * m2.l0.s0 + m1.l2.s1 * m2.l1.s0
                 + m1.l2.s2 * m2.l2.s0 + m1.l2.s3 * m2.l3.s0;
    result.l2.s1 = m1.l2.s0 * m2.l0.s1 + m1.l2.s1 * m2.l1.s1
                 + m1.l2.s2 * m2.l2.s1 + m1.l2.s3 * m2.l3.s1;
    result.l2.s2 = m1.l2.s0 * m2.l0.s2 + m1.l2.s1 * m2.l1.s2
                 + m1.l2.s2 * m2.l2.s2 + m1.l2.s3 * m2.l3.s2;
    result.l2.s3 = m1.l2.s0 * m2.l0.s3 + m1.l2.s1 * m2.l1.s3
                 + m1.l2.s2 * m2.l2.s3 + m1.l2.s3 * m2.l3.s3;


    result.l3.s0 = m1.l3.s0 * m2.l0.s0 + m1.l3.s1 * m2.l1.s0
                 + m1.l3.s2 * m2.l2.s0 + m1.l3.s3 * m2.l3.s0;
    result.l3.s1 = m1.l3.s0 * m2.l0.s1 + m1.l3.s1 * m2.l1.s1
                 + m1.l3.s2 * m2.l2.s1 + m1.l3.s3 * m2.l3.s1;
    result.l3.s2 = m1.l3.s0 * m2.l0.s2 + m1.l3.s1 * m2.l1.s2
                 + m1.l3.s2 * m2.l2.s2 + m1.l3.s3 * m2.l3.s2;
    result.l3.s3 = m1.l3.s0 * m2.l0.s3 + m1.l3.s1 * m2.l1.s3
                 + m1.l3.s2 * m2.l2.s3 + m1.l3.s3 * m2.l3.s3;



    return result;                                          
}

Mueller mmultf(Mueller m, float factor){
    Mueller result;
        result.l0.s0 = factor * m.l0.s0;
        result.l0.s1 = factor * m.l0.s1;
        result.l0.s2 = factor * m.l0.s2;
        result.l0.s3 = factor * m.l0.s3;
        result.l1.s0 = factor * m.l1.s0;
        result.l1.s1 = factor * m.l1.s1;
        result.l1.s2 = factor * m.l1.s2;
        result.l1.s3 = factor * m.l1.s3;
        result.l2.s0 = factor * m.l2.s0;
        result.l2.s1 = factor * m.l2.s1;
        result.l2.s2 = factor * m.l2.s2;
        result.l2.s3 = factor * m.l2.s3;
        result.l3.s0 = factor * m.l3.s0;
        result.l3.s1 = factor * m.l3.s1;
        result.l3.s2 = factor * m.l3.s2;
        result.l3.s3 = factor * m.l3.s3;
    return result;

}

Mueller maddm(Mueller m1, Mueller m2){
    Mueller result;
        result.l0.s0 = m1.l0.s0 + m2.l0.s0;
        result.l0.s1 = m1.l0.s1 + m2.l0.s1;
        result.l0.s2 = m1.l0.s2 + m2.l0.s2;
        result.l0.s3 = m1.l0.s3 + m2.l0.s3;
        result.l1.s0 = m1.l1.s0 + m2.l1.s0;
        result.l1.s1 = m1.l1.s1 + m2.l1.s1;
        result.l1.s2 = m1.l1.s2 + m2.l1.s2;
        result.l1.s3 = m1.l1.s3 + m2.l1.s3;
        result.l2.s0 = m1.l2.s0 + m2.l2.s0;
        result.l2.s1 = m1.l2.s1 + m2.l2.s1;
        result.l2.s2 = m1.l2.s2 + m2.l2.s2;
        result.l2.s3 = m1.l2.s3 + m2.l2.s3;
        result.l3.s0 = m1.l3.s0 + m2.l3.s0;
        result.l3.s1 = m1.l3.s1 + m2.l3.s1;
        result.l3.s2 = m1.l3.s2 + m2.l3.s2;
        result.l3.s3 = m1.l3.s3 + m2.l3.s3;
    return result;
}


Stokes rotateStokes(Stokes s, float cosPhi){
    float cos2Phi = cosPhi * cosPhi - 1.;
    float sin2Phi = sqrt(ONE - cos2Phi * cos2Phi);
    Stokes result;
        result.s0 = s.s0;
        result.s1 = cos2Phi * s.s1 + sin2Phi * s.s2;
        result.s2 = -sin2Phi * s.s1 + cos2Phi * s.s2;
        result.s3 = s.s3;
    return result;
}

Mueller getRotationMatrix(float cosPhi, float signPhi){
    float cosPhi2 = min(cosPhi * cosPhi, ONE);
    float cos2Phi = clamp(2.0f * cosPhi2 - ONE, -ONE, ONE);
    float sin2Phi = -sign(cosPhi) * signPhi * sqrt(ONE - cos2Phi * cos2Phi);
    Mueller result = identity();
        result.l1.s1 = cos2Phi;
        result.l1.s2 = sin2Phi;
        result.l2.s1 = -sin2Phi;
        result.l2.s2 = cos2Phi;

    return result;
}

Mueller getFresnelMatrix(float realRef, float imagRef, float cosTheta, 
                         bool debug){
    float cosTheta2 = cosTheta * cosTheta;
    float sinTheta2 = ONE - cosTheta * cosTheta;
    float sinTheta = sqrt(sinTheta2);
    float tanTheta = sinTheta / cosTheta;
    float tanTheta2 = tanTheta * tanTheta;


    float realRef2 = realRef * realRef;
    float imagRef2 = imagRef * imagRef;

    float temp1 = realRef2 - imagRef2 - sinTheta2;
    float temp2 = sqrt(temp1 * temp1 + 4.0f * realRef2 * imagRef2);
    float a2 = 0.5f * (temp2 + temp1);
    float b2 = 0.5f * (temp2 - temp1);
    float a = sqrt(a2);
    float b = sqrt(b2);


    float tandpe = (2.0f * cosTheta) / (cosTheta2 - a2 - b2);
    float tandpa = (realRef2 - imagRef2) * b - 2.0f * realRef * imagRef * a;
    float denum = ((realRef2 + imagRef2) * (realRef2 + imagRef2)) * cosTheta2;
    tandpa = 2.0f * b * cosTheta * tandpa / (denum - a2 - b2);
    float dpe = atan(tandpe);
    float dpa = atan(tandpa);

    temp1 = a2 + b2;
    temp2 = 2.0f * a * cosTheta;
    float temp3 = 2.0f * a * sinTheta * tanTheta;
    float Fpe = (temp1 - temp2 + cosTheta2) 
              / (temp1 + temp2 + cosTheta2);
    float Fpa = (temp1 - temp3 + sinTheta2 * tanTheta2) * Fpe
              / (temp1 + temp3 + sinTheta2 * tanTheta2);


    float A = 0.5f * (Fpe + Fpa);
    float B = 0.5f * (Fpe - Fpa);
    temp1 = sqrt(Fpe * Fpa);
    float C = cos(dpe - dpa) * temp1;
    float D = sin(dpe - dpa) * temp1;

    Mueller result = identity();
    result.l0.s0 = A; 
    result.l1.s1 = A;
    result.l0.s1 = B; result.l1.s0 = B;
    result.l2.s2 = C; result.l3.s3 = C;
    result.l2.s3 = D; result.l3.s2 = -D;

    return result;
}


// Wi points away from the surface
Mueller getJohnsMatrix(float2 refractiveIndex,
                       float3 wi, float3 wo, float3 normal){
  // first we need ass and app
  float cosThetaI = dot(wi, normal);
  float cosThetaO = dot(wo, normal);

  float2 n1 = (float2)(AIR_REFRACTIVE, ZERO);
  float2 n2 = refractiveIndex;

  float2 ass, app;
  ass.x = (n1.x * cosThetaI - n2.x * cosThetaO) 
        / (n1.x * cosThetaI + n2.x * cosThetaO);
  ass.y = -ONE; // Because n1.y = ZERO

  app.x = (n2.x * cosThetaI - n1.x * cosThetaO)
        / (n2.x * cosThetaI + n1.x * cosThetaO);
  app.y = ONE; // Because n1.y = ZERO

  float Tss2 = ass.x * ass.x + ass.y * ass.y;
  float Tpp2 = app.x * app.x + app.y * app.y;

  // We compute the Mueller matrix
  Mueller result;
    result.l0.s0 = (Tss2 + Tpp2);
    result.l0.s1 = (Tss2 - Tpp2);
    result.l0.s2 = ZERO; result.l0.s3 = ZERO;

    result.l1.s0 = (Tss2 - Tpp2);
    result.l1.s1 = (Tss2 + Tpp2);
    result.l1.s2 = ZERO; result.l1.s3 = ZERO;

    result.l2.s0 = ZERO; result.l2.s1 = ZERO;
    result.l2.s2 = 2.0f * (ass.x * app.x - ass.y * app.y);
    result.l2.s3 = 2.0f * (ass.y * app.x + ass.x * app.y);

    result.l3.s0 = ZERO; result.l3.s1 = ZERO;
    result.l3.s2 = -2.0f * (ass.y * app.x + ass.x * app.y);
    result.l3.s3 = 2.0f * (ass.x * app.x - ass.y * app.y);

  result = mmultf(result, 0.5f);

  // And multiply it by the BRDF coefficients
  float sigma = 0.7f;
  float cosBeta = dot(normal, wi);
  float cosTheta = (cosThetaI + cosThetaO) / (2.0f * cosBeta);
  float denum = 8.f * M_PI * sigma * sigma
              *  cosTheta * cosTheta * cosTheta * cosTheta
              * cosThetaO * cosThetaI;
  float cosTheta2 = cosTheta * cosTheta;
  float sinTheta2 = ONE - cosTheta2;
  float tanTheta2 = sinTheta2 / cosTheta2;
  float num = exp(-tanTheta2 / (2.0f * sigma * sigma));

  result = mmultf(result, num / denum);

  return result;
}


int getBRDFId(int idMui, int idMuo, int idPhiDiff,
              uint nbMu, uint nbPhiDiff){
    int result = (idMuo * nbPhiDiff + idPhiDiff) * nbMu + idMui;
    return result * 16;
}

Mueller getMatrixFromId(int id, __global float * brdf){
    Mueller result;
        result.l0.s0 = brdf[id];
        result.l0.s1 = brdf[id + 1];
        result.l0.s2 = brdf[id + 2];
        result.l0.s3 = brdf[id + 3];

        result.l1.s0 = brdf[id + 4];
        result.l1.s1 = brdf[id + 5];
        result.l1.s2 = brdf[id + 6];
        result.l1.s3 = brdf[id + 7];

        result.l2.s0 = brdf[id + 8];
        result.l2.s1 = brdf[id + 9];
        result.l2.s2 = brdf[id + 10];
        result.l2.s3 = brdf[id + 11];

        result.l3.s0 = brdf[id + 12];
        result.l3.s1 = brdf[id + 13];
        result.l3.s2 = brdf[id + 14];
        result.l3.s3 = brdf[id + 15];
    return result;
}

Mueller getMatrixFromId2(int id, __global float * brdf, uint offset){
    Mueller result;
        result.l0.s0 = brdf[offset + id];
        result.l0.s1 = brdf[offset + id + 1];
        result.l0.s2 = brdf[offset + id + 2];
        result.l0.s3 = brdf[offset + id + 3];

        result.l1.s0 = brdf[offset + id + 4];
        result.l1.s1 = brdf[offset + id + 5];
        result.l1.s2 = brdf[offset + id + 6];
        result.l1.s3 = brdf[offset + id + 7];

        result.l2.s0 = brdf[offset + id + 8];
        result.l2.s1 = brdf[offset + id + 9];
        result.l2.s2 = brdf[offset + id + 10];
        result.l2.s3 = brdf[offset + id + 11];

        result.l3.s0 = brdf[offset + id + 12];
        result.l3.s1 = brdf[offset + id + 13];
        result.l3.s2 = brdf[offset + id + 14];
        result.l3.s3 = brdf[offset + id + 15];
    return result;
}


Mueller getBRDFFromIds(int idMui, int idMuo, int idPhiDiff,
                       __global float * brdf, uint nbMu, uint nbPhiDiff,
                       uint offset){
    int brdfId = getBRDFId(idMui, idMuo, idPhiDiff, nbMu, nbPhiDiff);
    return getMatrixFromId(brdfId + offset, brdf); 
}


int binarySearch(float value, __global float * array, uint arraySize,
                     int * id0, int * id1){
  int low = *id0; int high = *id1;
  int result = (high + low) / 2;

    if (value <= array[low]){
        (*id0) = low;
        (*id1) = low;
        return 1;
    }

    if (value >= array[high]){
        (*id0) = high;
        (*id1) = high;
        return 1;
    }

    float currValue = array[result];

    while (value != currValue && low < high){
        if (value < currValue){
            if (value > array[result-1]){
                (*id0) = result - 1;
                (*id1) = result;
                return 2;
            }
            high = result;
        }
        else if (value > currValue){
            if (value < array[result + 1]){
                (*id0) = result;
                (*id1) = result + 1;
                return 2;
            }
            low = result;
        }

        result = (high + low) / 2;

        currValue = array[result];
    }
    if (currValue < value){
        (*id0) = result;
        (*id1) = result + 1;
    }
    else{
        (*id0) = result-1;
        (*id1) = result;
    }

    return 2;
}


// Binary search for an array where for all i array(i) > array(i+1)
int reverseBinarySearch(float value, __global float * array, uint arraySize,
                            int * id0, int * id1){
  int low = *id1; int high = *id0;
  int result = (high + low) / 2;

    if (value <= array[low]){
        (*id0) = low;
        (*id1) = low;
        return 1;
    }

    if (value >= array[high]){
        (*id0) = high;
        (*id1) = high;
        return 1;
    }

    float currValue = array[result];

    while (value != currValue && low > high){
        if (value < currValue){
            if (value > array[result + 1]){
                (*id0) = result;
                (*id1) = result + 1;
                return 2;
            }
            high = result;
        }
        else if (value > currValue){
            if (value < array[result - 1]){
                (*id0) = result - 1;
                (*id1) = result;
                return 2;
            }
            low = result;
        }

        result = (high + low) / 2;

        currValue = array[result];
    }
    if (currValue < value){
        (*id0) = result;
        (*id1) = result + 1;
    }
    else{
        (*id0) = result-1;
        (*id1) = result;
    }

    return 2;
}

Mueller getBRDF(int idBRDF,
                float mui, float muo, float phiDiff,
                __global float * BRDFs, __global int * BRDFsOffsets,
                __global float * BRDFsMus, __global int * BRDFsMusOffsets,
                __global float * BRDFsPhis, __global int * BRDFsPhisOffsets){

  // We get the offset for the current BRDF
  int index = 2 * idBRDF;
  int BRDFStartingPos = BRDFsOffsets[index];
  int musStartingPos = BRDFsMusOffsets[index];
  int nbMus = BRDFsMusOffsets[index + 1];
  int musEndingPos = musStartingPos + nbMus - 1;
  int phisStartingPos = BRDFsPhisOffsets[index];
  int nbPhis = BRDFsPhisOffsets[index + 1];
  int phisEndingPos = phisStartingPos + nbPhis - 1;


  // We get the indices of the BRDF reading
  int muiId0 = musStartingPos, muiId1 = musEndingPos;
  int muoId0 = musStartingPos, muoId1 = musEndingPos;
  int phiId0 = phisStartingPos, phiId1 = phisEndingPos;

  int nbMui = binarySearch(mui, BRDFsMus, nbMus, &muiId0, &muiId1);
  int nbMuo = binarySearch(muo, BRDFsMus, nbMus, &muoId0, &muoId1);
  int nbPhi = binarySearch(phiDiff, BRDFsPhis, nbPhis, &phiId0, &phiId1);

  // We compute the interpolation weights
  float muiWeight = ONE;
  if (nbMui > 1){
    float mui0 = BRDFsMus[muiId0];
    float mui1 = BRDFsMus[muiId1];
    muiWeight = (mui - mui0) / (mui1 - mui0);
    muiWeight = ONE - muiWeight;
  }

  float muoWeight = ONE;
  if (nbMuo > 1){
    float muo0 = BRDFsMus[muoId0];
    float muo1 = BRDFsMus[muoId1];
    muoWeight = (muo - muo0) / (muo1 - muo0);
    muoWeight = ONE - muoWeight;
  }

  float phiWeight = ONE;
  if (nbPhi > 1){
    float phi0 = BRDFsPhis[phiId0];
    float phi1 = BRDFsPhis[phiId1];
    phiWeight = (phiDiff - phi1) / (phi0 - phi1);
  }

  // === We read all the BRDF

  // We get the local mu and phi indices
  muiId0 = muiId0 - musStartingPos;
  muiId1 = muiId1 - musStartingPos;
  muoId0 = muoId0 - musStartingPos;
  muoId1 = muoId1 - musStartingPos;
  phiId0 = phiId0 - phisStartingPos;
  phiId1 = phiId1 - phisStartingPos;

  // For phiId0
  Mueller m_mui_0_muo_0 = getBRDFFromIds(muiId0, muoId0, phiId0,
                                             BRDFs, nbMus, nbPhis,
                                             BRDFStartingPos);
  Mueller m_mui_0_muo_1 = getBRDFFromIds(muiId0, muoId1, phiId0,
                                             BRDFs, nbMus, nbPhis,
                                             BRDFStartingPos);
  Mueller m_mui_1_muo_0 = getBRDFFromIds(muiId1, muoId0, phiId0,
                                             BRDFs, nbMus, nbPhis,
                                             BRDFStartingPos);
  Mueller m_mui_1_muo_1 = getBRDFFromIds(muiId1, muoId1, phiId0,
                                             BRDFs, nbMus, nbPhis,
                                             BRDFStartingPos);
  Mueller m_phi0_mui_0 = maddm(mmultf(m_mui_0_muo_0, muoWeight),
                               mmultf(m_mui_0_muo_1, ONE - muoWeight));
  Mueller m_phi0_mui_1 = maddm(mmultf(m_mui_1_muo_0, muoWeight),
                               mmultf(m_mui_1_muo_1, ONE - muoWeight));
  Mueller m_phi0 = maddm(mmultf(m_phi0_mui_0, muiWeight),
                         mmultf(m_phi0_mui_1, ONE - muiWeight));

  // For phiId1
  m_mui_0_muo_0 = getBRDFFromIds(muiId0, muoId0, phiId1,
                                     BRDFs, nbMus, nbPhis,
                                     BRDFStartingPos);
  m_mui_0_muo_1 = getBRDFFromIds(muiId0, muoId1, phiId1,
                                     BRDFs, nbMus, nbPhis,
                                     BRDFStartingPos);
  m_mui_1_muo_0 = getBRDFFromIds(muiId1, muoId0, phiId1,
                                     BRDFs, nbMus, nbPhis,
                                     BRDFStartingPos);
  m_mui_1_muo_1 = getBRDFFromIds(muiId1, muoId1, phiId1,
                                     BRDFs, nbMus, nbPhis,
                                     BRDFStartingPos);
  Mueller m_phi1_mui_0 = maddm(mmultf(m_mui_0_muo_0, muoWeight),
                               mmultf(m_mui_0_muo_1, ONE - muoWeight));
  Mueller m_phi1_mui_1 = maddm(mmultf(m_mui_1_muo_0, muoWeight),
                               mmultf(m_mui_1_muo_1, ONE - muoWeight));
  Mueller m_phi1 = maddm(mmultf(m_phi1_mui_0, muiWeight),
                         mmultf(m_phi1_mui_1, ONE - muiWeight));

  // Final BRDF
  return maddm(mmultf(m_phi0, phiWeight), mmultf(m_phi1, ONE - phiWeight));

}

// Dir has to point to the surface
float3 getEntryRightVector(float3 dir, float3 normal){
    return normalize(cross(dir, normal));
}

// Dir has to point away from the surface
float3 getExitRightVector(float3 dir, float3 normal){
    return normalize(cross(dir, normal));
}

float getDOP(Stokes v){
  if (v.s0 <= 0.001f)
    return ZERO;
  return clamp(sqrt(v.s1 * v.s1 + v.s2 * v.s2 + v.s3 * v.s3) / v.s0, ZERO, ONE);
}





//##############################################################################
// Acceleration functions
//##############################################################################

VoxelId getVoxelId(float3 pos, AABB * box,
                   __global float * voxelSizeBuffer,
                   __global int * gridDimBuffer){
  VoxelId result;
  result.x = clamp((int)floor((pos.x - box->pMin.x) / voxelSizeBuffer[0]),
                   (int)0, (int)(gridDimBuffer[0] - 1));
  result.y = clamp((int)floor((pos.y - box->pMin.y) / voxelSizeBuffer[1]),
                   (int)0, (int)(gridDimBuffer[1] - 1));
  result.z = clamp((int)floor((pos.z - box->pMin.z) / voxelSizeBuffer[2]),
                   (int)0, (int)(gridDimBuffer[2] - 1));

  return result;
}

//##############################################################################
// Intersection functions
//##############################################################################

float intersectRayTriangle(Ray *ray, Triangle *t){
        float3 u = t->p1 - t->p0;
        float3 v = t->p2 - t->p0;

        float3 n = cross(u,v);
        float3 Otr = ray->o - t->p0;

        float denominateur = dot(n, ray->d);

        // Ir Computation
        float Ir  = -ONE * (dot(n, Otr)) / denominateur;
        if (Ir < 0)
                return -ONE;

        // Iu Computation
        float3 temp = cross(Otr, v);
        float Iu = dot(temp,ray->d) / denominateur;
        if (Iu < 0 || Iu > 1)
                return -ONE;
        t->alpha = Iu;

        // Iv Computation
        temp = cross(u, Otr);
        float Iv = dot(temp,ray->d) / denominateur;
        if (Iv < 0 || Iv > 1 - Iu)
                return -ONE;
        t->beta = Iv;

        return Ir - 0.0001f;
}

float3 computeNormal(Triangle * t){
    return normalize((ONE - t->alpha - t->beta) * t->n0 
           + t->alpha * t->n1 + t->beta * t->n2);
}

float IntersectAABB(Ray *r, AABB * b){

    float3 tMin = (float3)((b->pMin.x - r->o.x) / r->d.x,
                           (b->pMin.y - r->o.y) / r->d.y,
                           (b->pMin.z - r->o.z) / r->d.z);
    float3 tMax = (float3)((b->pMax.x - r->o.x) / r->d.x,
                           (b->pMax.y - r->o.y) / r->d.y,
                           (b->pMax.z - r->o.z) / r->d.z);
    float temp; 
    if (tMin.x > tMax.x){
        float a = tMin.x;
        tMin.x = tMax.x;
        tMax.x = a;
        //swap(&(tMin.x), &(tMax.x));
    }
    if (tMin.y > tMax.y){
        float a = tMin.y;
        tMin.y = tMax.y;
        tMax.y = a;
        //swap(&(tMin.y), &(tMax.y));
    }
    if (tMin.z > tMax.z){
        float a = tMin.z;
        tMin.z = tMax.z;
        tMax.z = a;
        //swap(&(tMin.z), &(tMax.z));
    }

    float tmin = max(max(tMin.x,tMin.y),tMin.z);
    float tmax = min(min(tMax.x,tMax.y),tMax.z);

    b->tMin = max(tmin, ZERO);
    b->tMax = tmax;

    if (tmin>tmax)
        return -ONE;
    if (tmin > ZERO)
        return tmin;
    return tmax;
}


float intersectRayVoxel(Intersection * result, Ray * r,
                        VoxelId * voxelId,
                        float nextTx, float nextTy, float nextTz,
                        __global float * triangleVertices,
                        __global float * triangleNormals,
                        __global uint * triangleIndices,
                        __global uint * triangleMaterialIds,
                        __global int * voxelIndexBuffer,
                        __global int * voxelVolumeBuffer,
                        __global int * voxelOffsetBuffer,
                        __global int * gridDimBuffer
                        ){
  bool hitSomething = false;
  float mint = -ONE;
  int offsetIndex = voxelId->x * gridDimBuffer[1] * gridDimBuffer[2]
                    + voxelId->y * gridDimBuffer[2] + voxelId->z;
  Triangle closestTriangle;
  uint closestTriangleId = 0;

  int primitiveNum = voxelVolumeBuffer[offsetIndex];
  for (int i = 0; i < primitiveNum; ++i){
    int idTriangle = voxelIndexBuffer[voxelOffsetBuffer[offsetIndex] + i];
    int currId1 = triangleIndices[idTriangle * 3];
    int currId2 = triangleIndices[idTriangle * 3 + 1];
    int currId3 = triangleIndices[idTriangle * 3 + 2];

    Triangle t;
      t.p0 = (float3)(triangleVertices[currId1 * 3],
                      triangleVertices[currId1 * 3 + 1],
                      triangleVertices[currId1 * 3 + 2]);
      t.p1 = (float3)(triangleVertices[currId2 * 3],
                      triangleVertices[currId2 * 3 + 1],
                      triangleVertices[currId2 * 3 + 2]);
      t.p2 = (float3)(triangleVertices[currId3 * 3],
                      triangleVertices[currId3 * 3 + 1],
                      triangleVertices[currId3 * 3 + 2]);

      float currt = intersectRayTriangle(r, &t);
      if (currt > ZERO && (mint < ZERO || currt < mint)
          // && (currt <= nextTx || fabs(currt - nextTx) < EPSILON)
          // && (currt <= nextTy || fabs(currt - nextTy) < EPSILON)
          // && (currt <= nextTy || fabs(currt - nextTy) < EPSILON)
      ){
        mint = currt;
        closestTriangle = t;
        closestTriangleId = idTriangle;
      }
  }

  if (mint < ZERO)
    return -ONE;


  uint i3 = closestTriangleId * 3;
  uint id0 = triangleIndices[i3] * 3;
  uint id1 = triangleIndices[i3 + 1] * 3;
  uint id2 = triangleIndices[i3 + 2] * 3;

  closestTriangle.n0 = (float3)(triangleNormals[id0 + 0],
                                triangleNormals[id0 + 1],
                                triangleNormals[id0 + 2]);
  closestTriangle.n1 = (float3)(triangleNormals[id1 + 0],
                                triangleNormals[id1 + 1],
                                triangleNormals[id1 + 2]);
  closestTriangle.n2 = (float3)(triangleNormals[id2 + 0],
                                triangleNormals[id2 + 1],
                                triangleNormals[id2 + 2]);


  result->p = r->o + mint * r->d;
  result->n = computeNormal(&closestTriangle);
  result->n *= -sign(dot(result->n, r->d));
  result->m = triangleMaterialIds[closestTriangleId];

  return mint;


}

float intersectRayTriangles(Intersection * result, Ray * r,
                            // Triangle geometry parameters
                            __global float * triangleVertices,
                            __global float * triangleNormals,
                            __global uint * triangleIndices,
                            __global uint * triangleMaterialIds,
                            uint nbTriangles,
                            // Acceleration
                            AABB * aabb,
                            __global int * voxelIndexBuffer,
                            __global int * voxelVolumeBuffer,
                            __global int * voxelOffsetBuffer,
                            __global int * gridDimBuffer,
                            __global float * voxelSizeBuffer
                            ){
  // Brute force
  float t = -ONE;
  int tnbTriangles = nbTriangles;
  int closestTriangleId;
  Triangle closestTriangle;
  for (int idTriangle = 0; idTriangle < tnbTriangles; ++idTriangle){
    int currId1 = triangleIndices[idTriangle * 3];
    int currId2 = triangleIndices[idTriangle * 3 + 1];
    int currId3 = triangleIndices[idTriangle * 3 + 2];

    Triangle tt;
      tt.p0 = (float3)(triangleVertices[currId1 * 3],
                      triangleVertices[currId1 * 3 + 1],
                      triangleVertices[currId1 * 3 + 2]);
      tt.p1 = (float3)(triangleVertices[currId2 * 3],
                      triangleVertices[currId2 * 3 + 1],
                      triangleVertices[currId2 * 3 + 2]);
      tt.p2 = (float3)(triangleVertices[currId3 * 3],
                      triangleVertices[currId3 * 3 + 1],
                      triangleVertices[currId3 * 3 + 2]);

      float tempt = intersectRayTriangle(r, &tt);
      if (tempt > ZERO && (t < ZERO || tempt < t)){
          t = tempt;
          closestTriangleId = idTriangle;
          closestTriangle = tt;
      }
  }

  // We compute the intersection
  uint i3 = closestTriangleId * 3;
  uint id0 = triangleIndices[i3] * 3;
  uint id1 = triangleIndices[i3 + 1] * 3;
  uint id2 = triangleIndices[i3 + 2] * 3;
  closestTriangle.n0 = (float3)(triangleNormals[id0 + 0],
                                triangleNormals[id0 + 1],
                                triangleNormals[id0 + 2]);
  closestTriangle.n1 = (float3)(triangleNormals[id1 + 0],
                                triangleNormals[id1 + 1],
                                triangleNormals[id1 + 2]);
  closestTriangle.n2 = (float3)(triangleNormals[id2 + 0],
                                triangleNormals[id2 + 1],
                                triangleNormals[id2 + 2]);

  result->p = r->o + t * r->d;
  result->n = computeNormal(&closestTriangle);
  result->n *= -sign(dot(result->n, r->d));
  result->m = triangleMaterialIds[closestTriangleId];
  
  return t;
}



float intersectRayGrid(Intersection * result, Ray * r,
                            // Triangle geometry parameters
                            __global float * triangleVertices,
                            __global float * triangleNormals,
                            __global uint * triangleIndices,
                            __global uint * triangleMaterialIds,
                            uint nbTriangles,
                            // Acceleration
                            AABB * aabb,
                            __global int * voxelIndexBuffer,
                            __global int * voxelVolumeBuffer,
                            __global int * voxelOffsetBuffer,
                            __global int * gridDimBuffer,
                            __global float * voxelSizeBuffer
                            ){

    // We check if we intersect the bounding box
    float tbox = IntersectAABB(r, aabb);
    if (tbox < ZERO)
      return -ONE;

    float3 gridIntersectP = r->o + tbox * r->d;

    VoxelId voxelId = getVoxelId(gridIntersectP, aabb,
                                 voxelSizeBuffer, gridDimBuffer);

    VoxelId originVoxelId = voxelId;

    int stepX = (r->d.x >= ZERO)?1:-1;
    int stepY = (r->d.y >= ZERO)?1:-1;
    int stepZ = (r->d.z >= ZERO)?1:-1;


    int outRangeX = (r->d.x >= ZERO)?gridDimBuffer[0]:-1;
    int outRangeY = (r->d.y >= ZERO)?gridDimBuffer[1]:-1;
    int outRangeZ = (r->d.z >= ZERO)?gridDimBuffer[2]:-1;


    float deltaTx = voxelSizeBuffer[0] / fabs(r->d.x);
    float deltaTy = voxelSizeBuffer[1] / fabs(r->d.y);
    float deltaTz = voxelSizeBuffer[2] / fabs(r->d.z);

    float nextTx, nextTy, nextTz;
    if (stepX > 0){
      nextTx = tbox + (aabb->pMin.x + (float)(voxelId.x + 1) * voxelSizeBuffer[0]
                       - gridIntersectP.x) / r->d.x;
    }
    else{
      nextTx = tbox + (aabb->pMin.x + (float)voxelId.x * voxelSizeBuffer[0]
                       - gridIntersectP.x) / r->d.x;
    }
    if (stepY > 0){
      nextTy = tbox + (aabb->pMin.y + (float)(voxelId.y + 1) * voxelSizeBuffer[1]
                       - gridIntersectP.y) / r->d.y;
    }
    else{
      nextTy = tbox + (aabb->pMin.y + (float)voxelId.y * voxelSizeBuffer[1]
                       - gridIntersectP.y) / r->d.y;
    }
    if (stepZ > 0){
      nextTz = tbox + (aabb->pMin.z + (float)(voxelId.z + 1) * voxelSizeBuffer[2]
                       - gridIntersectP.z) / r->d.z;
    }
    else{
      nextTz = tbox + (aabb->pMin.z + (float)voxelId.z * voxelSizeBuffer[2]
                       - gridIntersectP.z) / r->d.z;
    }

    Intersection inter;
    float mint = intersectRayVoxel(&inter, r, &voxelId,
                             nextTx, nextTy, nextTz,
                             triangleVertices,
                             triangleNormals,
                             triangleIndices,
                             triangleMaterialIds,
                             voxelIndexBuffer,
                             voxelVolumeBuffer,
                             voxelOffsetBuffer,
                             gridDimBuffer);

    while (mint < ZERO){
      if (nextTx <= nextTy && nextTx <= nextTz){
        nextTx += deltaTx;
        voxelId.x += stepX;
        if (voxelId.x == outRangeX) break;
      }
      else if (nextTy <= nextTx && nextTy <= nextTz){
        nextTy += deltaTy;
        voxelId.y += stepY;
        if (voxelId.y == outRangeY) break;
      }
      else{
        nextTz += deltaTz;
        voxelId.z += stepZ;
        if (voxelId.z == outRangeZ) break;
      }

      mint = intersectRayVoxel(&inter, r, &voxelId,
                               nextTx, nextTy, nextTz,
                               triangleVertices,
                               triangleNormals,
                               triangleIndices,
                               triangleMaterialIds,
                               voxelIndexBuffer,
                               voxelVolumeBuffer,
                               voxelOffsetBuffer,
                               gridDimBuffer);

    }
    if (mint < ZERO)
      return -ONE;

    result->p = inter.p;
    result->n = inter.n;
    result->m = inter.m;


    return mint;

}



float intersectRaySphere(Ray *r, Sphere *s)
{
    float3 B = r->o + r->d;
    float3 CA = r->o - s->c;
    
    float alpha = length(r->d) * length(r->d);
    float beta = 2.*dot(r->d,CA);
    float gamma = dot(r->o,r->o)+dot(s->c,s->c)-2.*dot(r->o,s->c)-s->r*s->r;
    float delta = beta*beta - 4.*alpha*gamma;
    
    if(delta<ZERO)
        return -ONE;
    float U1 = (-beta-sqrt(delta))/(2.*alpha) ;
    if(delta == ZERO)
        return U1;
    float U2 = (-beta+sqrt(delta))/(2.*alpha);
    if (U1 < ZERO)
        return U2;
    if (U2 < ZERO)
        return U1;
    return min(U1, U2);
}


float intersectRaySpheres(Intersection * result, Ray * r,
                          // Sphere geometry parameters
                          __global float * sphereCenters,
                          __global float * sphereRadii,
                          __global uint * sphereMaterialIds,
                          uint nbSpheres){
    float mint = -ONE;

    Sphere closestSphere;
    for (uint idSphere = 0; idSphere < nbSpheres; ++idSphere){
        uint i3 = idSphere * 3;
        Sphere currS;
            currS.c = (float3)(sphereCenters[i3],
                               sphereCenters[i3 + 1],
                               sphereCenters[i3 + 2]);
            currS.r = sphereRadii[idSphere];
            currS.m = sphereMaterialIds[idSphere];
        float currt = intersectRaySphere(r, &currS);
        if (currt > ZERO && (mint < ZERO || currt < mint)){
            mint = currt;
            closestSphere = currS;
        }
    }

    if (mint >= ZERO){
        result->p = r->o + mint * r->d;
        result->n = normalize(result->p - closestSphere.c);
        // result->n *= -sign(dot(result->n, r->d));
        result->m = closestSphere.m;
    }

    return mint;
}



float intersectRayScene(Intersection * result, Ray * r,
                       // Triangle geometry parameters
                      __global float * triangleVertices,
                      __global float * triangleNormals,
                      __global uint * triangleIndices,
                      __global uint * triangleMaterialIds,
                      uint nbTriangles,
                      // Sphere geometry parameters
                      __global float * sphereCenters,
                      __global float * sphereRadii,
                      __global uint * sphereMaterialIds,
                      uint nbSpheres,
                      // Accerelation
                      AABB * aabb,
                      __global int * voxelIndexBuffer,
                      __global int * voxelVolumeBuffer,
                      __global int * voxelOffsetBuffer,
                      __global int * gridDimBuffer,
                      __global float * voxelSizeBuffer
                      ){


    Intersection sphereIntersection;
        sphereIntersection.p = zeros3;
        sphereIntersection.n = one3;
        sphereIntersection.m = 0;
    float minSphere = intersectRaySpheres(&sphereIntersection, r,
                                          sphereCenters, sphereRadii,
                                          sphereMaterialIds, nbSpheres);

    Intersection triangleIntersection;
        triangleIntersection.p = zeros3;
        triangleIntersection.n = one3;
        triangleIntersection.m = 0;

    float minTriangle = intersectRayTriangles(&triangleIntersection, r,
                            // Triangle geometry parameters
                            triangleVertices,
                            triangleNormals,
                            triangleIndices,
                            triangleMaterialIds,
                            nbTriangles,
                            // Acceleration
                            aabb,
                            voxelIndexBuffer,
                            voxelVolumeBuffer,
                            voxelOffsetBuffer,
                            gridDimBuffer,
                            voxelSizeBuffer
                            );


    if (minSphere < ZERO){ // No sphere encountered
        (*result) = triangleIntersection;
        return minTriangle;
    } 
    else if (minTriangle < ZERO){ // No triangle encountered
        (*result) = sphereIntersection;
        return minSphere;
    } else if (minSphere < minTriangle){ // Sphere encountered first
        (*result) = sphereIntersection;
        return minSphere;
    } else { // Triangle encountered first
        (*result) = triangleIntersection;
        return minTriangle;
    }
}

//##############################################################################
// Shadow computation functions
//##############################################################################

bool intersectRaySpheresShadow(Ray * r,
                                __global float * sphereCenters,
                                __global float * sphereRadii,
                                uint nbSpheres,
                                float tLight
                                ){
    Sphere closestSphere;
    for (uint idSphere = 0; idSphere < nbSpheres; ++idSphere){
        uint i3 = idSphere * 3;
        Sphere currS;
            currS.c = (float3)(sphereCenters[i3],
                               sphereCenters[i3 + 1],
                               sphereCenters[i3 + 2]);
            currS.r = sphereRadii[idSphere];
            currS.m = 0;
        float currt = intersectRaySphere(r, &currS);
        if (currt >= ZERO && currt < tLight)
            return true;
    }
    return false;
}

bool intersectRayTrianglesShadow(Ray * r,
                                  __global float * triangleVertices,
                                  __global uint * triangleIndices,
                                  uint nbTriangles,
                                  float tLight
                                  ){

    Triangle closestTriangle;
    uint closestTriangleId = 0;

    for (uint idTriangle = 0; idTriangle < nbTriangles; ++idTriangle){

        uint i3 = idTriangle * 3;

        uint id0 = triangleIndices[i3] * 3; 
        uint id1 = triangleIndices[i3 + 1] * 3;
        uint id2 = triangleIndices[i3 + 2] * 3;

        Triangle currTriangle;
            currTriangle.p0 = (float3)(triangleVertices[id0], 
                                       triangleVertices[id0 + 1], 
                                       triangleVertices[id0 + 2]);
            currTriangle.p1 = (float3)(triangleVertices[id1], 
                                       triangleVertices[id1 + 1], 
                                       triangleVertices[id1 + 2]);
            currTriangle.p2 = (float3)(triangleVertices[id2], 
                                       triangleVertices[id2 + 1], 
                                       triangleVertices[id2 + 2]);
            currTriangle.n0 = zeros3;
            currTriangle.n1 = zeros3;
            currTriangle.n2 = zeros3;

            currTriangle.alpha = ZERO;
            currTriangle.beta = ZERO;

        float currt = intersectRayTriangle(r, &currTriangle);

        if (currt >= ZERO && currt < tLight)
            return true;
    }

    return false;
}


bool shadowComputation(Ray * shadowRay,
                        __global float * triangleVertices,
                        __global uint * triangleIndices,
                        uint nbTriangles,
                         __global float * sphereCenters,
                        __global float * sphereRadii,
                        uint nbSpheres,
                        float dist){

    bool shadowTriangles = intersectRayTrianglesShadow(shadowRay,
                                                       triangleVertices,
                                                       triangleIndices,
                                                       nbTriangles,
                                                       dist);

    bool shadowSpheres = intersectRaySpheresShadow(shadowRay,
                                                   sphereCenters,
                                                   sphereRadii,
                                                   nbSpheres,
                                                   dist);

    return (shadowTriangles || shadowSpheres);

}

//##############################################################################
// Light computation functions
//##############################################################################

float intersectRayLights(Ray * r, float3 * emittance,
                         __global float3 * lightCenters,
                         __global float * lightRadii,
                         __global float3 * lightEmittance,
                         uint nbLights){

    float mint = -ONE;
    for (uint idLight = 0; idLight < nbLights; ++idLight){
        Sphere s;
            s.c = lightCenters[idLight];
            s.r = lightRadii[idLight];
        float currt = intersectRaySphere(r, &s);
        if (currt >= ZERO && (mint < ZERO || currt < mint)){
            mint = currt;
            (*emittance) = lightEmittance[idLight];
        }
    }
    return mint;
}

Light getLight(uint id,
              __global float3 * lightCenters,
              __global float * lightRadii,
              __global float3 * lightEmittance){
    Light l;
        l.c = lightCenters[id];
        l.r = lightRadii[id];
        l.e = lightEmittance[id];
    return l;
}

pColor getDirect(Intersection * inter,
                 __global float3 * lightCenters,
                 __global float * lightRadii,
                 __global float3 * lightEmittance,
                 uint nbLights,
                 uint * seed0,
                 uint * seed1,
                 __global float * triangleVertices,
                 __global uint * triangleIndices,
                 uint nbTriangles,
                 __global float * sphereCenters,
                 __global float * sphereRadii,
                 uint nbSpheres,
                 uint idLight,
                 float3 * lightDir
                 ){
    pColor direct;
      direct.R = zeros4;
      direct.G = zeros4;
      direct.B = zeros4;

    Stokes temp = unpolarized;

    float rand0 = random(seed0, seed1) * 2. * M_PI;
    Light l = getLight(idLight, lightCenters, lightRadii, lightEmittance);
    float3 lightNormal = normalize(inter->p - l.c);
    float3 sampledDir = samplePointOnUnitHemisphereAlongDir(seed0, seed1,
                                                            lightNormal);
    float3 sampledPos = l.c + l.r * sampledDir;

    Ray shadowRay;
        shadowRay.d = normalize(sampledPos - inter->p);
        shadowRay.o = inter->p + EPSILON * shadowRay.d;
    float shadowDist = length(sampledPos - shadowRay.o);

    lightDir->x = shadowRay.d.x;
    lightDir->y = shadowRay.d.y;
    lightDir->z = shadowRay.d.z;
       
    if (shadowComputation(&shadowRay,
                          triangleVertices, triangleIndices, nbTriangles,
                          sphereCenters, sphereRadii, nbSpheres,
                          shadowDist)){
      return direct;
    }

    // We cast a ray to the light source, and take the first encounterd
    // point as a light position

    Sphere lightSphere;
      lightSphere.c = l.c;
      lightSphere.r = l.r;
    float tLight = intersectRaySphere(&shadowRay, &lightSphere);
    sampledPos = shadowRay.o + tLight * shadowRay.d;
    sampledDir = normalize(sampledPos - l.c);

    float cos1 = clamp(dot(inter->n, shadowRay.d), ZERO, ONE);
    float cos3 = clamp(dot(sampledDir, -shadowRay.d), ZERO, ONE);

    float distance = length(inter->p - sampledPos);

    float deltaRad = 2.0f * M_PI * l.r * l.r  * cos3 * cos1
                     / (distance * distance);                     

    direct.R += deltaRad * l.e.s0 * temp;
    direct.G += deltaRad * l.e.s1 * temp;
    direct.B += deltaRad * l.e.s2 * temp;

    return direct;
}

//##############################################################################
// Materials related functions
//##############################################################################

void getMaterial(uint id, __global float * materials, Material * mat){
  int id13 = id * 13;
  mat->diffuseReflectance.x = materials[id13++];
  mat->diffuseReflectance.y = materials[id13++];
  mat->diffuseReflectance.z = materials[id13++];

  mat->refractiveIndex.x = materials[id13++];
  mat->refractiveIndex.y = materials[id13++];

  mat->specularReflectance.x = materials[id13++];
  mat->specularReflectance.y = materials[id13++];
  mat->specularReflectance.z = materials[id13++];

  mat->specularTransmittance.x = materials[id13++];
  mat->specularTransmittance.y = materials[id13++];
  mat->specularTransmittance.z = materials[id13++];

  mat->idBRDF = materials[id13++];
  mat->idTabularBRDF = materials[id13++];
}

//##############################################################################
// Radiance computation functions
//##############################################################################
void getRadiance(pColor * radiance,
                 Ray * r,
                 Modificator * mod,
                 // Triangle geometry parameters
                 __global float * triangleVertices,
                 __global float * triangleNormals,
                 __global uint * triangleIndices,
                 __global uint * triangleMaterialIds,
                 uint nbTriangles,
                 // Sphere geometry parameters
                 __global float * sphereCenters,
                 __global float * sphereRadii,
                 __global uint * sphereMaterialIds,
                 uint nbSpheres,
                 // Light parameters
                 __global float3 * lightCenters,
                 __global float * lightRadii,
                 __global float3 * lightEmittance,
                 uint nbLights,
                 // Materials
                 __global float * materials,
                 // Acceleraction
                 AABB * aabb,
                 __global int * voxelIndexBuffer,
                 __global int * voxelVolumeBuffer,
                 __global int * voxelOffsetBuffer,
                 __global int * gridDimBuffer,
                 __global float * voxelSizeBuffer,
                 // Tabular brdf
                 __global float * BRDFs,
                 __global int * BRDFsOffsets,
                 __global float * BRDFsMus,
                 __global int * BRDFsMusOffsets,
                 __global float * BRDFsPhis,
                 __global int * BRDFsPhisOffsets,
                 uint * seed0,
                 uint * seed1
){

    Intersection inter;
        inter.p = zeros3;
        inter.n = zeros3;
        inter.m = 0;
    float t = intersectRayScene(&inter, r,
                                triangleVertices,
                                triangleNormals,
                                triangleIndices,
                                triangleMaterialIds,
                                nbTriangles,
                                sphereCenters,
                                sphereRadii,
                                sphereMaterialIds,
                                nbSpheres,
                                aabb,
                                voxelIndexBuffer,
                                voxelVolumeBuffer,
                                voxelOffsetBuffer,
                                gridDimBuffer,
                                voxelSizeBuffer);


    


    float3 emittance;
    float tLight = intersectRayLights(r, &emittance,
                                      lightCenters,
                                      lightRadii,
                                      lightEmittance,
                                      nbLights);

    if (tLight >= ZERO && (tLight < t || t < ZERO)){ // We intersect the light
      radiance->R += mmults(mod->R, emittance.x * unpolarized);
      radiance->G += mmults(mod->G, emittance.y * unpolarized);
      radiance->B += mmults(mod->B, emittance.z * unpolarized);
      mod->R = mmultf(mod->R, ZERO);
      mod->G = mmultf(mod->G, ZERO);
      mod->B = mmultf(mod->B, ZERO);
      return;
    }


    if (t < ZERO){ // We don't intersect anything, we stop
      mod->R = mmultf(mod->R, ZERO);
      mod->G = mmultf(mod->G, ZERO);
      mod->B = mmultf(mod->B, ZERO);

      return;
    }


    Material mat;
      getMaterial(inter.m, materials, &mat);
    int BRDFId = (int)(mat.idTabularBRDF) * 3;


    if (mat.idBRDF == 8){
      radiance->R += mmults(mod->R, (float4)(1.0, 0.0, 0.0, 0.0));
      radiance->G += mmults(mod->G, (float4)(1.0, 0.0, 0.0, 0.0));
      radiance->B += mmults(mod->B, (float4)(1.0, 0.0, 0.0, 0.0));
      mod->R = mmultf(mod->R, ZERO);
      mod->G = mmultf(mod->G, ZERO);
      mod->B = mmultf(mod->B, ZERO);
      return;
    }
     // Phong BRDF
    //--------------------------------------------------------------------------
    else if (mat.idBRDF == 7){

      // We make sure the normal is going up from the ray perspective
      inter.n *= -sign(dot(inter.n, r->d));


      // We compute useful values
      float kd = mat.specularTransmittance.s0;
      float ks = mat.specularTransmittance.s1;
      float exponent = mat.specularTransmittance.s2;

      float3 refl = getReflectedDir(r->d, inter.n);

      // We compute the direct
      for (uint idLight = 0; idLight < nbLights; ++idLight){
        float3 lightDir;
        pColor direct = getDirect(&inter,
                    lightCenters,
                    lightRadii,
                    lightEmittance,
                    nbLights,
                    seed0,
                    seed1,
                    triangleVertices,
                    triangleIndices,
                    nbTriangles,
                    sphereCenters,
                    sphereRadii,
                    nbSpheres,
                    idLight,
                    &lightDir);

        float diffuse = max(ZERO, kd * dot(lightDir, inter.n));
        float specular = max(ZERO, ks * pow(dot(lightDir, refl),exponent));

        float3 coeff = diffuse * mat.diffuseReflectance + specular * mat.specularReflectance;
        coeff = coeff / (float)M_PI;

        radiance->R.s0 += coeff.s0 * direct.R.s0;
        radiance->G.s0 += coeff.s1 * direct.G.s0;
        radiance->B.s0 += coeff.s2 * direct.B.s0;

      }

      // We depolarize
      radiance->R.s1 = 0.; radiance->R.s2 = 0.; radiance->R.s3 = 0.;
      radiance->G.s1 = 0.; radiance->G.s2 = 0.; radiance->G.s3 = 0.;
      radiance->B.s1 = 0.; radiance->B.s2 = 0.; radiance->B.s3 = 0.;

       // We sample the new direction
      float3 newDir = samplePointOnUnitHemisphereAlongDir(seed0,  seed1, inter.n);
      r->d = newDir;
      r->o = inter.p + EPSILON * newDir;

      // We update the modificator matrix
      float diffuse = max(ZERO, kd * dot(newDir, inter.n));
      float specular = max(ZERO, ks * pow(dot(newDir, refl), exponent));

      float3 coeff = diffuse * mat.diffuseReflectance + specular * mat.specularReflectance;
      coeff = coeff / (float)M_PI;

      // We update the modificator matrix
      Mueller m;
        m.l0 = zeros4; m.l1 = zeros4; m.l2 = zeros4; m.l3 = zeros4;
        m.l0.s0 = coeff.s0; // R
        mod->R = mmultm(mod->R, m);
        m.l0.s0 = coeff.s1; // G
        mod->G = mmultm(mod->G, m);
        m.l0.s0 = coeff.s2; // B
        mod->B = mmultm(mod->B, m);


    }
    // BRDF tables
    //--------------------------------------------------------------------------
    else if (mat.idBRDF == 6){
      // We get the right direction the ray should match
      float3 rightOut = getExitRightVector(r->d, inter.n);
      float cosPhi = dot(rightOut, r->r);
      float3 tempNormal = normalize(cross(r->r, rightOut));
      float3 tempVec = normalize(cross(tempNormal, rightOut));
      float signPhi = sign(dot(tempVec, r->r));
      signPhi = sign(dot(r->r, inter.n));
      Mueller rotationMatrix = getRotationMatrix(cosPhi, signPhi);
      mod->R = mmultm(mod->R, rotationMatrix);
      mod->G = mmultm(mod->G, rotationMatrix);
      mod->B = mmultm(mod->B, rotationMatrix);

      // We compute the direct
      float3 trueNormal = inter.n;
      inter.n *= -sign(dot(inter.n, r->d));
      for (uint idLight = 0; idLight < nbLights; ++idLight){
          float3 lightDir;
          pColor direct = getDirect(&inter,
                              lightCenters,
                              lightRadii,
                              lightEmittance,
                              nbLights,
                              seed0,
                              seed1,
                              triangleVertices,
                              triangleIndices,
                              nbTriangles,
                              sphereCenters,
                              sphereRadii,
                              nbSpheres,
                              idLight,
                              &lightDir);
 
          float cosThetaOut = dot(inter.n, -r->d);
          float cosThetaIn = dot(inter.n, lightDir);
          float3 projectedOut = -r->d - cosThetaOut * inter.n;
          float3 projectedIn = -lightDir + cosThetaIn * inter.n;
          float cosPhiDiff = dot(normalize(projectedOut),
                                 normalize(projectedIn));


      Mueller mR = getBRDF(BRDFId, cosThetaIn, cosThetaOut, cosPhiDiff,
                    BRDFs, BRDFsOffsets,
                    BRDFsMus, BRDFsMusOffsets,
                    BRDFsPhis, BRDFsPhisOffsets);
      Mueller mG = getBRDF(BRDFId + 1, cosThetaIn, cosThetaOut, cosPhiDiff,
                    BRDFs, BRDFsOffsets,
                    BRDFsMus, BRDFsMusOffsets,
                    BRDFsPhis, BRDFsPhisOffsets);
      Mueller mB = getBRDF(BRDFId + 2, cosThetaIn, cosThetaOut, cosPhiDiff,
                    BRDFs, BRDFsOffsets,
                    BRDFsMus, BRDFsMusOffsets,
                    BRDFsPhis, BRDFsPhisOffsets);

 
          radiance->R += mmults(mR,mmults(mod->R, direct.R));
          radiance->G += mmults(mG,mmults(mod->G, direct.G));
          radiance->B += mmults(mB,mmults(mod->B, direct.B));

      }

      // We reflect
      float3 newDir =samplePointOnUnitHemisphereAlongDir(seed0, seed1, inter.n);
      float cosThetaOut = dot(inter.n, -r->d);
      float cosThetaIn = dot(inter.n, newDir);
      float3 projectedOut = -r->d - cosThetaOut * inter.n;
      float3 projectedIn = -newDir + cosThetaIn * inter.n;
      float cosPhiDiff = dot(normalize(projectedOut), normalize(projectedIn));

      Mueller mR = getBRDF(BRDFId, cosThetaIn, cosThetaOut, cosPhiDiff,
                    BRDFs, BRDFsOffsets,
                    BRDFsMus, BRDFsMusOffsets,
                    BRDFsPhis, BRDFsPhisOffsets);
      Mueller mG = getBRDF(BRDFId + 1, cosThetaIn, cosThetaOut, cosPhiDiff,
                    BRDFs, BRDFsOffsets,
                    BRDFsMus, BRDFsMusOffsets,
                    BRDFsPhis, BRDFsPhisOffsets);
      Mueller mB = getBRDF(BRDFId + 2, cosThetaIn, cosThetaOut, cosPhiDiff,
                    BRDFs, BRDFsOffsets,
                    BRDFsMus, BRDFsMusOffsets,
                    BRDFsPhis, BRDFsPhisOffsets);

      mod->R = mmultf(mmultm(mod->R, mR), cosThetaIn);
      mod->G = mmultf(mmultm(mod->G, mG), cosThetaIn);
      mod->B = mmultf(mmultm(mod->B, mB), cosThetaIn);
 
 
      r->d = newDir;
      r->o = inter.p + EPSILON * r->d;
      r->r = getEntryRightVector(r->d, inter.n);
 
    }
    // Gold
    else if (mat.idBRDF == 4){
      // We get the right direction the ray should match
      float3 rightOut = getExitRightVector(r->d, inter.n);
      float cosPhi = dot(rightOut, r->r);
      float3 tempNormal = normalize(cross(r->r, rightOut));
      float3 tempVec = normalize(cross(tempNormal, rightOut));
      float signPhi = sign(dot(tempVec, r->r));
      signPhi = sign(dot(r->r, inter.n));
      Mueller rotationMatrix = getRotationMatrix(cosPhi, signPhi);
      mod->R = mmultm(mod->R, rotationMatrix);
      mod->G = mmultm(mod->G, rotationMatrix);
      mod->B = mmultm(mod->B, rotationMatrix);

      float3 reflectedDir = getReflectedDir(r->d, inter.n);
      float cosTheta = dot(inter.n, -r->d);
      r->d = reflectedDir;
      r->o = inter.p + EPSILON * r->d;
      r->r = getEntryRightVector(-r->d, inter.n);

      Mueller FresnelMatrixR = getFresnelMatrix(0.17009, 3.1421, cosTheta, false);
      Mueller FresnelMatrixG = getFresnelMatrix(0.35929, 2.6913, cosTheta, false);
      Mueller FresnelMatrixB = getFresnelMatrix(1.50229, 1.8785, cosTheta, false);
      mod->R = mmultm(mod->R, FresnelMatrixR);
      mod->G = mmultm(mod->G, FresnelMatrixG);
      mod->B = mmultm(mod->B, FresnelMatrixB);
    }
    // Fresnel material
    //--------------------------------------------------------------------------
    else if (mat.idBRDF == 3){
      // We get the right direction the ray should match
      float3 rightOut = getExitRightVector(r->d, inter.n);
      float cosPhi = dot(rightOut, r->r);
      float3 tempNormal = normalize(cross(r->r, rightOut));
      float3 tempVec = normalize(cross(tempNormal, rightOut));
      float signPhi = sign(dot(tempVec, r->r));
      signPhi = sign(dot(r->r, inter.n));
      Mueller rotationMatrix = getRotationMatrix(cosPhi, signPhi);
      mod->R = mmultm(mod->R, rotationMatrix);
      mod->G = mmultm(mod->G, rotationMatrix);
      mod->B = mmultm(mod->B, rotationMatrix);

      float3 reflectedDir = getReflectedDir(r->d, inter.n);
      float cosTheta = dot(inter.n, -r->d);
      r->d = reflectedDir;
      r->o = inter.p + EPSILON * r->d;
      r->r = getEntryRightVector(-r->d, inter.n);

      Mueller FresnelMatrixR = getFresnelMatrix(3.50346,  2.9849, cosTheta, false);
      Mueller FresnelMatrixG = getFresnelMatrix(3.68458, 3.0145, cosTheta, false);
      Mueller FresnelMatrixB = getFresnelMatrix(3.10222, 3.3928, cosTheta, false);

      mod->R = mmultm(mod->R, FresnelMatrixR);
      mod->G = mmultm(mod->G, FresnelMatrixG);
      mod->B = mmultm(mod->B, FresnelMatrixB);
    }
    // Transmissive material (currently bugged)
    //--------------------------------------------------------------------------
    else if (mat.idBRDF == 2){
      // We need to know if we enter or exit the material
      bool entering = (dot(r->d, inter.n) > ZERO);
 
      // We get the refracted direction
      float3 refrDir;
      if (entering){
        refrDir = getRefractedDir(r->d, inter.n, 
                               AIR_REFRACTIVE, mat.refractiveIndex.x);
      }
      else{
        refrDir = getRefractedDir(r->d, inter.n, 
                               mat.refractiveIndex.x,AIR_REFRACTIVE);
      }
 
      // We want to know if we refract or reflect
      float cosThetaI = dot(-refrDir, inter.n);
      float cosThetaT = dot(-r->d, inter.n);
      float rpar = (mat.refractiveIndex.x * cosThetaI 
                    - AIR_REFRACTIVE * cosThetaT)
                 / (mat.refractiveIndex.x * cosThetaI
                    + AIR_REFRACTIVE * cosThetaT);
      float rper = ( AIR_REFRACTIVE * cosThetaI 
                    - mat.refractiveIndex.x * cosThetaT)
                 / (AIR_REFRACTIVE * cosThetaI
                    + mat.refractiveIndex.x * cosThetaT);
 
      float fr = 0.5 * (rpar * rpar + rper * rper);
      float rand = random(seed0, seed1);

      if (rand < fr){
        r->d = getReflectedDir(r->d, inter.n);
        r->o = inter.p + EPSILON * r->d;
        mod->R = mmultf(mod->R, mat.specularReflectance.x);
        mod->G = mmultf(mod->G, mat.specularReflectance.y);
        mod->B = mmultf(mod->B, mat.specularReflectance.z);
      }
      else{
        r->d = refrDir;
        r->o = inter.p + EPSILON * r->d;
        mod->R = mmultf(mod->R, mat.specularTransmittance.x);
        mod->G = mmultf(mod->G, mat.specularTransmittance.y);
        mod->B = mmultf(mod->B, mat.specularTransmittance.z);
      }
      return;
    }
    // Specular material
    //--------------------------------------------------------------------------
    else if (mat.idBRDF == 1){
      mod->R = mmultf(mod->R, mat.specularReflectance.x);
      mod->G = mmultf(mod->G, mat.specularReflectance.y);
      mod->B = mmultf(mod->B, mat.specularReflectance.z);
      r->d = getReflectedDir(r->d, inter.n);
      r->o = inter.p + EPSILON * r->d;
      return;
    }
    // Diffuse material
    else{
      // We make sure the normal is going up from the ray perspective
      inter.n *= -sign(dot(inter.n, r->d));
      Mueller m;
        m.l0 = zeros4; m.l1 = zeros4; m.l2 = zeros4; m.l3 = zeros4;
        // 
        m.l0.s0 = mat.diffuseReflectance.x / M_PI;
        mod->R = mmultm(mod->R, m);
        m.l0.s0 = mat.diffuseReflectance.y / M_PI;
        mod->G = mmultm(mod->G, m);
        m.l0.s0 = mat.diffuseReflectance.z / M_PI;
        mod->B = mmultm(mod->B, m);
    		m.l0 = zeros4; m.l1 = zeros4; m.l2 = zeros4; m.l3 = zeros4;
		

      for (uint idLight = 0; idLight < nbLights; ++idLight){
        float3 lightDir;
        pColor direct = getDirect(&inter,
                            lightCenters,
                            lightRadii,
                            lightEmittance,
                            nbLights,
                            seed0,
                            seed1,
                            triangleVertices,
                            triangleIndices,
                            nbTriangles,
                            sphereCenters,
                            sphereRadii,
                            nbSpheres,
                            idLight,
                            &lightDir);

        radiance->R += mmults(mod->R, direct.R);
        radiance->G += mmults(mod->G, direct.G);
        radiance->B += mmults(mod->B, direct.B);
      }
 
      radiance->R.s1 = ZERO; radiance->R.s2 = ZERO; radiance->R.s3 = ZERO;
      radiance->G.s1 = ZERO; radiance->G.s2 = ZERO; radiance->G.s3 = ZERO;
      radiance->B.s1 = ZERO; radiance->B.s2 = ZERO; radiance->B.s3 = ZERO;
  
      float3 newDir =samplePointOnUnitHemisphereAlongDir(seed0, seed1, inter.n);
      r->d = newDir;
      r->o = inter.p + EPSILON * newDir;

      float cosThetaIn = dot(inter.n, newDir);
      mod->R = mmultf(mod->R, cosThetaIn);
      mod->G = mmultf(mod->G, cosThetaIn);
      mod->B = mmultf(mod->B, cosThetaIn);
	  
      return;
    }

}

//##############################################################################
// Visualization functions
//##############################################################################
float3 getDOPColor(Stokes v){
  return getDOP(v) * RED;
}

float3 getDOCP(Stokes v){
  float lin = v.s1 * v.s1 + v.s2 * v.s2;
  float cir = v.s3 * v.s3;
  return sqrt(cir / (lin + cir));
}

float3 getTOPColor(Stokes v){
    float lin = v.s1 * v.s1 + v.s2 * v.s2;
    float cir = v.s3 * v.s3;
    if ((lin + cir) == ZERO)
        return zeros3;
    float DOPL = sqrt(lin / (lin + cir));
    float DOPC = sqrt(cir / (lin + cir));

    return normalize(DOPL * CYAN + DOPC * YELLOW);
}

float3 getOPLColor(Stokes v){
    float factor = (fabs(v.s1) + fabs(v.s2));
    if (factor == ZERO)
        return zeros3;
    float Ph = max(ZERO,  v.s1); // Horizontal polarization
    float Pv = max(ZERO, -v.s1); // Vertical polarization
    float P45 = max(ZERO,  v.s2); // Polarization along 45°
    float P225 = max(ZERO, -v.s2); // Polarization along 225°
    
    return (Ph * RED + Pv * GREEN + P45 * BLUE + P225 * YELLOW) / factor;
}

float3 getCCPColor(Stokes v){
    if (v.s3 == ZERO)
        return zeros3;
    float factor = ONE / fabs(v.s3);
    float right = max(ZERO, v.s3);
    float left = max(ZERO, -v.s3);

    return (right * BLUE + left * YELLOW) * factor;
}



float3 getColorFromPRad(pColor prad, 
                        enum visualizationType visuType,
                        enum scalingType scaleType){

  // We compute the average Stokes vector
  Stokes average = (prad.R + prad.G + prad.B) / 3.f;	
  float3 greyColor = ones3 * (0.299f * prad.R.s0 
                              + 0.587f * prad.G.s0
                              + 0.114f * prad.B.s0);

  // We compute the degree of polarization
  float dop = getDOP(average);

  float3 result;
  switch(visuType){
    case DOP:
      result = getDOPColor(average);
      break;
    case TOP:
      result = dop * getTOPColor(average);
      break;
    case OPL:
      result = dop * getOPLColor(average);
      break;
    case CCP:
      result = dop * getCCPColor(average) * getDOCP(average);
      break;
    case DEBUG:
      if (dop > ONE) return MAGENTA;
      return greyColor;
      break;
    case REGULAR:
    default:
      result.x = clamp(prad.R.x, ZERO, ONE);
      result.y = clamp(prad.G.x, ZERO, ONE);
      result.z = clamp(prad.B.x, ZERO, ONE);
  }

  if (scaleType == SCALED){
  }
  if (scaleType == DIRECT){
    float3 temp = result + (ONE - dop) * greyColor;
    result = temp;
  }


  return result;

}


//##############################################################################
// Kernels
//##############################################################################
__kernel void updateStokes(// Image parameters
                     uint nbColumns,
                     uint nbRows,
                     // Polarization parameters
                     __global float * stokes,
                     // Monte-Carlo parameters
                     uint iterationId,
                     __global uint * seeds,
                     uint nbSeedsPerPixel,
                     // Camera parameters
                     __global float3 * cam_o,
                     __global float3 * cam_at,
                     __global float3 * cam_up,
                     float cam_fov,
                     // Triangle geometry parameters
                     __global float * triangleVertices,
                     __global float * triangleNormals,
                     __global uint * triangleIndices,
                     __global uint * triangleMaterialIds,
                     uint nbTriangles,
                     // Sphere geometry parameters
                     __global float * sphereCenters,
                     __global float * sphereRadii,
                     __global uint * sphereMaterialIds,
                     uint nbSpheres,
                     // Light parameters
                     __global float3 * lightCenters,
                     __global float * lightRadii,
                     __global float3 * lightEmittance,
                     uint nbLights,
                     // Materials
                     __global float * materials,
                     // Acceleration structures
                     __global float * aabb,
                     __global int * voxelIndexBuffer,
                     __global int * voxelVolumeBuffer,
                     __global int * voxelOffsetBuffer,
                     __global int * gridDimBuffer,
                     __global float * voxelSizeBuffer,
                     // Tabular brdf
                     __global float * BRDFs,
                     __global int * BRDFsOffsets,
                     __global float * BRDFsMus,
                     __global int * BRDFsMusOffsets,
                     __global float * BRDFsPhis,
                     __global int * BRDFsPhisOffsets
                     ){

    // We get the pixel coordinate
    int i = get_global_id(0); int j = get_global_id(1);
    if (i >= nbColumns || j >= nbRows) return;
    int idPixel1D = j * nbColumns + i;

    // We get the random seeds for the current pixel
    uint seed0 = seeds[2 * idPixel1D];
    uint seed1 = seeds[2 * idPixel1D + 1];

    // We create the camera
    Cam c;
        c.o = cam_o[0];
        c.at = cam_at[0];
        c.up = cam_up[0];
        c.fov = cam_fov;
    float3 cam_W = normalize(c.o - c.at);
    float3 cam_U = normalize(cross(c.up, cam_W));
    float3 cam_V = cross(cam_W, cam_U);

    // We create the ray for the current pixel
    float height = 2 * tan((float)c.fov * M_PI / 360.f);
    float width = height * (float)nbColumns / (float)nbRows;
    float ray_z = -ONE;
    float ray_x = width * ((i+random(&seed0, &seed1)) / (float)nbColumns-0.5f);
    float ray_y = height * (0.5f - (j+random(&seed0, &seed1)) / (float)nbRows);
    Ray r;
        r.o = c.o;
        r.d = normalize(ray_x * cam_U + ray_y * cam_V + ray_z * cam_W);
        r.r = normalize(cross(r.d, cam_V));


    // We create the bounding box for the triangles
    AABB box;
      box.pMin = (float3)(aabb[0], aabb[1], aabb[2]);
      box.pMax = (float3)(aabb[3], aabb[4], aabb[5]);
      box.tMin = ZERO; box.tMax = ZERO;


    pColor radiance;
      radiance.R = zeros4;
      radiance.G = zeros4;
      radiance.B = zeros4;
    Modificator mod; 
      mod.R = identity();
      mod.G = identity();
      mod.B = identity();

    for (int idPath = 0; idPath < 6; ++idPath){
      getRadiance(&radiance, &r, & mod,
                           triangleVertices,
                           triangleNormals,
                           triangleIndices,
                           triangleMaterialIds,
                           nbTriangles,
                           sphereCenters,
                           sphereRadii,
                           sphereMaterialIds,
                           nbSpheres,
                           lightCenters,
                           lightRadii,
                           lightEmittance,
                           nbLights,
                           materials,
                           &box,
                           voxelIndexBuffer,
                           voxelVolumeBuffer,
                           voxelOffsetBuffer,
                           gridDimBuffer,
                           voxelSizeBuffer,
                           BRDFs, BRDFsOffsets, BRDFsMus, BRDFsMusOffsets, 
                           BRDFsPhis, BRDFsPhisOffsets,
                           &seed0,
                           &seed1);
    }

    radiance.R.s0 = clamp(radiance.R.s0, ZERO, ONE);
    radiance.G.s0 = clamp(radiance.G.s0, ZERO, ONE);
    radiance.B.s0 = clamp(radiance.B.s0, ZERO, ONE);

    uint id12 = idPixel1D * 12;
    if (iterationId > 0){
      pColor previous;
        previous.R = (float4)(stokes[id12]    ,  stokes[id12 + 1],
                              stokes[id12 + 2],  stokes[id12 + 3]);
        previous.G = (float4)(stokes[id12 + 4],  stokes[id12 + 5],
                              stokes[id12 + 6],  stokes[id12 + 7]);
        previous.B = (float4)(stokes[id12 + 8],  stokes[id12 + 9],
                              stokes[id12 + 10], stokes[id12 + 11]);

        float denum = ONE / ((float)(iterationId) + ONE);
        radiance.R = (radiance.R + previous.R * (float)(iterationId)) * denum;
        radiance.G = (radiance.G + previous.G * (float)(iterationId)) * denum;
        radiance.B = (radiance.B + previous.B * (float)(iterationId)) * denum;
    }

    stokes[id12] = radiance.R.s0;      stokes[id12 + 1] = radiance.R.s1;
    stokes[id12 + 2] = radiance.R.s2;  stokes[id12 + 3] = radiance.R.s3;
    stokes[id12 + 4] = radiance.G.s0;  stokes[id12 + 5] = radiance.G.s1;
    stokes[id12 + 6] = radiance.G.s2;  stokes[id12 + 7] = radiance.G.s3;
    stokes[id12 + 8] = radiance.B.s0;  stokes[id12 + 9] = radiance.B.s1;
    stokes[id12 + 10] = radiance.B.s2; stokes[id12 + 11] = radiance.B.s3;

}


__kernel void render(uint nbColumns,
                     uint nbRows,
                     __global uchar4 * raster,
                     // Polarization parameters
                     __global float * stokes,
                     enum visualizationType visuType,
                     enum scalingType scaleType){
  int i = get_global_id(0); int j = get_global_id(1);
  if (i >= nbColumns || j >= nbRows) return;
  int idPixel1D = j * nbColumns + i;

  pColor radiance;
  uint id12 = idPixel1D * 12;
  radiance.R = (float4)(stokes[id12]    ,  stokes[id12 + 1],
                        stokes[id12 + 2],  stokes[id12 + 3]);
  radiance.G = (float4)(stokes[id12 + 4],  stokes[id12 + 5],
                        stokes[id12 + 6],  stokes[id12 + 7]);
  radiance.B = (float4)(stokes[id12 + 8],  stokes[id12 + 9],
                        stokes[id12 + 10], stokes[id12 + 11]);

  float3 fcolor = getColorFromPRad(radiance, visuType, scaleType);
  uchar4 color;
  color.x = fcolor.x * 255;
  color.y = fcolor.y * 255;
  color.z = fcolor.z * 255;
  color.w = 255;


  raster[idPixel1D] = (uchar4)(fcolor.x * 255, fcolor.y * 255, fcolor.z * 255,
                               255);

}

// Debugging kernel, no other purpose
__kernel void render3(uint nbColumns,
                      uint nbRows,
                      __global uchar4 * raster,
                      __global float * stokes,
                      enum visualizationType visuType,
                      enum scalingType scaleType,
                      // Tabular brdf
                      __global float * brdf1,
                      uint nbMu1,
                      uint nbPhiDiff1,
                      __global float * brdfMus1,
                      __global float * brdfPhis1){

  int i = get_global_id(0); int j = get_global_id(1);
  if (i >= nbColumns || j >= nbRows) return;
  int idPixel1D = j * nbColumns + i;

  float3 fcolor = (float3)(ZERO, ZERO, ZERO);

  // We create the camera
    Cam c;
        c.o = (float3)(ZERO, ZERO, ZERO);
        c.at = (float3)(ZERO, ZERO, -1.);
        c.up = (float3)(ZERO, ONE, ZERO);
        c.fov = 0.75;
    float3 cam_W = normalize(c.o - c.at);
    float3 cam_U = normalize(cross(c.up, cam_W));
    float3 cam_V = cross(cam_W, cam_U);

    // We create the ray for the current pixel
    float height = 2 * tan((float)c.fov * M_PI / 360.f);
    float width = height * (float)nbColumns / (float)nbRows;
    float ray_z = -ONE;
    float ray_x = width * (i / (float)nbColumns-0.5f);
    float ray_y = height * (0.5f - j / (float)nbRows);
    Ray r;
        r.o = c.o;
        r.d = normalize(ray_x * cam_U + ray_y * cam_V + ray_z * cam_W);
        r.r = normalize(cross(r.d, cam_V));

    // We create a sphere to intersect
    Sphere s;
      s.c = (float3)(ZERO, ZERO, -100.);
      s.r = 0.3;
      s.m = 0;

    float t = intersectRaySphere(&r, &s);


    // float3 incidentLightDirection = normalize((float3)(ZERO, ONE, ZERO));
    float3 lightPos = (float3)(ZERO, 8., -90.);
    if (t > ZERO){
      float3 intersectionPoint = r.o + t * r.d;
      float3 camDirection = normalize(r.o - intersectionPoint);
      float3 n = normalize(intersectionPoint - s.c);
      float3 incidentLightDirection = normalize(lightPos - intersectionPoint);

      // We project the camDirection according to the normal
      float coeffCam = dot(camDirection, n);
      float coeffLight = dot(incidentLightDirection, n);
      float3 projectedCam = normalize(camDirection - coeffCam * n);
      float3 projectedLight = normalize(incidentLightDirection - coeffLight * n);

      float cosPhiDiff = dot(projectedCam, projectedLight);
      
    }


    raster[idPixel1D] = (uchar4)(fcolor.x * 255, fcolor.y * 255, fcolor.z * 255,
                               255);
}

