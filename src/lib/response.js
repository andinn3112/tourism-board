export function successResponse(data) {
   return {
      success: true,
      data: data,
   };
}

export function errorResponse(errors) {
   return {
      success: false,
      errors,
   };
}
